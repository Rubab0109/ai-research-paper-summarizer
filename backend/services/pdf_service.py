from pathlib import Path
import re
from pypdf import PdfReader


IMPORTANT_HEADINGS = [
    "abstract",
    "introduction",
    "literature review",
    "methodology",
    "methods",
    "materials and methods",
    "results",
    "discussion",
    "conclusion",
    "references",
]


def clean_text(text: str) -> str:
    """Normalize whitespace and remove repeated blank lines."""
    text = text.replace("\x00", " ")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def extract_pdf_text(pdf_path: Path, max_pages: int = 80) -> str:
    """
    Extract text from a PDF using pypdf.
    This works best for text-based PDFs, not scanned image PDFs.
    """
    pages_text = []

    reader = PdfReader(str(pdf_path))

    for index, page in enumerate(reader.pages[:max_pages]):
        page_text = page.extract_text() or ""
        if page_text.strip():
            pages_text.append(f"\n\n--- Page {index + 1} ---\n{page_text}")

    return clean_text("\n".join(pages_text))


def detect_sections(full_text: str) -> dict:
    """
    Detect common research paper sections using heading-like patterns.
    If headings are not clearly detected, return a single Full Paper section.
    """
    text = clean_text(full_text)
    lower_text = text.lower()

    found = []
    for heading in IMPORTANT_HEADINGS:
        pattern = re.compile(
            rf"(?im)^\s*(?:\d+\.?\s*)?({re.escape(heading)})\s*$"
        )
        match = pattern.search(text)
        if match:
            found.append((match.start(), heading.title()))

    if len(found) < 2:
        for heading in IMPORTANT_HEADINGS:
            index = lower_text.find(heading)
            if index != -1:
                found.append((index, heading.title()))

    found = sorted(set(found), key=lambda item: item[0])

    if len(found) < 2:
        return {"Full Paper": text[:25000]}

    sections = {}
    for i, (start, heading) in enumerate(found):
        end = found[i + 1][0] if i + 1 < len(found) else len(text)
        chunk = text[start:end].strip()
        if len(chunk) > 120:
            sections[heading] = chunk[:7000]

    if not sections:
        return {"Full Paper": text[:25000]}

    return sections