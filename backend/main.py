from pathlib import Path
from datetime import datetime
import os
import re
import uuid

from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from services.pdf_service import extract_pdf_text, detect_sections
from services.llm_service import generate_research_analysis
from services.storage_service import save_analysis, list_history, get_analysis_by_id

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

MAX_FILE_SIZE_MB = 12
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

app = FastAPI(
    title="AI Research Paper Summarizer & Smart Rewriter API",
    description="FastAPI backend for PDF research paper summarization, rewriting, citations, and key-point extraction.",
    version="1.0.0",
)

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def safe_filename(filename: str) -> str:
    """Make uploaded file names safe for local storage."""
    cleaned = re.sub(r"[^a-zA-Z0-9._-]", "_", filename)
    return cleaned[:120] or "research_paper.pdf"


@app.get("/")
def root():
    return {
        "message": "AI Research Paper Summarizer API is running",
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "time": datetime.utcnow().isoformat(),
        "service": "research-paper-summarizer",
    }


@app.post("/api/analyze")
async def analyze_pdf(file: UploadFile = File(...)):
    """
    Upload a PDF research paper, extract text, detect sections,
    send content to Gemini LLM, and store the result locally.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file selected.")

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    content = await file.read()

    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Uploaded PDF is empty.")

    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"PDF is too large. Maximum allowed size is {MAX_FILE_SIZE_MB} MB.",
        )

    file_id = str(uuid.uuid4())
    saved_name = f"{file_id}_{safe_filename(file.filename)}"
    saved_path = UPLOAD_DIR / saved_name
    saved_path.write_bytes(content)

    try:
        extracted_text = extract_pdf_text(saved_path)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"PDF text extraction failed: {str(exc)}",
        )

    if len(extracted_text.strip()) < 200:
        raise HTTPException(
            status_code=422,
            detail="The PDF text could not be extracted properly. Try a text-based PDF instead of a scanned image PDF.",
        )

    sections = detect_sections(extracted_text)

    try:
        analysis = generate_research_analysis(
            file_name=file.filename,
            full_text=extracted_text,
            detected_sections=sections,
        )
    except ValueError as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"LLM API error. Check your internet/API key and try again. Details: {str(exc)}",
        )

    record = {
        "id": file_id,
        "file_name": file.filename,
        "stored_file": saved_name,
        "created_at": datetime.utcnow().isoformat(),
        "text_stats": {
            "characters": len(extracted_text),
            "detected_sections": list(sections.keys()),
        },
        "analysis": analysis,
    }

    save_analysis(record)
    return JSONResponse(record)


@app.get("/api/history")
def history():
    """Return previous analyses from local JSON storage."""
    return list_history()


@app.get("/api/history/{analysis_id}")
def get_history_item(analysis_id: str):
    """Return one saved analysis by ID."""
    item = get_analysis_by_id(analysis_id)
    if not item:
        raise HTTPException(status_code=404, detail="Analysis not found.")
    return item
