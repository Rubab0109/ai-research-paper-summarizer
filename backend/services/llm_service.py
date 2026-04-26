import json
import os
import re
from typing import Dict, Any

import requests
from dotenv import load_dotenv

load_dotenv()


def _extract_json(text: str) -> Dict[str, Any]:
    """
    Safely parse JSON returned by Gemini.
    Handles cases where the model wraps output in ```json fences.
    """
    cleaned = text.strip()
    cleaned = re.sub(r"^```json\s*", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"^```\s*", "", cleaned)
    cleaned = re.sub(r"\s*```$", "", cleaned)

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", cleaned, flags=re.DOTALL)
        if match:
            return json.loads(match.group(0))
        raise ValueError("LLM returned invalid JSON. Try again with a smaller or clearer PDF.")


def _build_prompt(file_name: str, full_text: str, detected_sections: Dict[str, str]) -> str:
    """
    Create one professional prompt for section summaries, easy explanation,
    key points, rewriting, and citation suggestions.
    """
    section_preview = "\n\n".join(
        [f"## {name}\n{content[:4000]}" for name, content in detected_sections.items()]
    )

    text_sample = full_text[:35000]

    return f"""
You are an expert academic research assistant.

Analyze the uploaded research paper and generate a professional student-friendly result.

File name:
{file_name}

Detected paper sections:
{section_preview}

Full extracted text sample:
{text_sample}

Return ONLY valid JSON. Do not use markdown fences.

JSON schema:
{{
  "paper_title_guess": "short title if identifiable, otherwise use file name",
  "section_wise_summary": [
    {{
      "section": "Abstract",
      "summary": "clear academic summary of this section",
      "easy_explanation": "simple explanation for students"
    }}
  ],
  "overall_easy_explanation": "explain the whole paper in simple language",
  "key_points": [
    "important point 1",
    "important point 2",
    "important point 3",
    "important point 4",
    "important point 5"
  ],
  "rewritten_content": "rewrite the main idea of the paper in original academic wording. Do not copy long phrases. Keep it plagiarism-reduced and student-friendly.",
  "smart_citations": [
    "APA style citation suggestion if enough metadata is found",
    "If metadata is missing, tell the user what information is required for a complete citation"
  ],
  "limitations": [
    "limitation of the paper or extracted text",
    "limitation of AI summarization"
  ],
  "recommended_next_steps": [
    "what the student should read carefully",
    "what to verify before using in assignment"
  ]
}}

Rules:
- Do not invent author names, journal names, DOI, or publication year.
- If citation metadata is missing, clearly say it is missing.
- Keep language professional and clear.
- Summaries must be section-wise.
- The rewritten content must not claim to remove plagiarism completely; use plagiarism-reduced wording.
"""


def _get_text_from_gemini_response(data: Dict[str, Any]) -> str:
    """
    Extract generated text from Gemini REST API response.
    """
    candidates = data.get("candidates", [])
    if not candidates:
        error_message = data.get("error", {}).get("message", "No response candidates returned by Gemini.")
        raise ValueError(error_message)

    parts = candidates[0].get("content", {}).get("parts", [])
    text_parts = [part.get("text", "") for part in parts if part.get("text")]

    if not text_parts:
        raise ValueError("Gemini returned an empty response.")

    return "\n".join(text_parts)


def generate_research_analysis(
    file_name: str,
    full_text: str,
    detected_sections: Dict[str, str],
) -> Dict[str, Any]:
    """
    Connect to Gemini REST API and return structured research analysis.
    This version does not use google-genai package, so it avoids Windows DLL blocking issues.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    model_name = os.getenv("GEMINI_MODEL", "gemini-3-flash-preview")

    if not api_key or api_key == "your_gemini_api_key_here":
        raise ValueError(
            "GEMINI_API_KEY is missing. Create backend/.env and add your Gemini API key."
        )

    prompt = _build_prompt(file_name, full_text, detected_sections)

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent"

    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": api_key,
    }

    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    {"text": prompt}
                ],
            }
        ],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 7000,
            "responseMimeType": "application/json",
        },
    }

    response = requests.post(url, headers=headers, json=payload, timeout=90)

    if response.status_code != 200:
        try:
            error_data = response.json()
            error_message = error_data.get("error", {}).get("message", response.text)
        except Exception:
            error_message = response.text

        raise ValueError(f"Gemini API request failed: {error_message}")

    data = response.json()
    raw_text = _get_text_from_gemini_response(data)
    parsed = _extract_json(raw_text)

    parsed.setdefault("paper_title_guess", file_name)
    parsed.setdefault("section_wise_summary", [])
    parsed.setdefault("overall_easy_explanation", "")
    parsed.setdefault("key_points", [])
    parsed.setdefault("rewritten_content", "")
    parsed.setdefault("smart_citations", [])
    parsed.setdefault("limitations", [])
    parsed.setdefault("recommended_next_steps", [])

    return parsed