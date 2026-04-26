# AI Research Paper Summarizer & Smart Rewriter

A professional Generative AI web application for university students and researchers.  
Users upload a PDF research paper and the system generates section-wise summaries, easy explanation, key points, plagiarism-reduced rewriting, and smart citation suggestions.

## Features

- PDF upload and text extraction
- Section detection: Abstract, Introduction, Methodology, Results, Discussion, Conclusion
- Gemini LLM API integration
- Section-wise summary
- Easy explanation
- Key point extraction
- Plagiarism-reduced academic rewriting
- Smart citation suggestions
- Local JSON history storage
- Modern dark theme React UI
- Copy and download output
- Error handling for empty, large, unsupported, and scanned PDFs

## Technology Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Lucide React icons

### Backend
- FastAPI
- Python
- pdfplumber
- Google GenAI SDK
- Local JSON storage

## Folder Structure

```text
ai-research-paper-summarizer/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── services/
│   │   ├── llm_service.py
│   │   ├── pdf_service.py
│   │   └── storage_service.py
│   ├── tests/
│   ├── uploads/
│   ├── data/
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
│
├── screenshots/
├── README.md
├── report_outline.md
├── demo_video_script.md
└── .env.example
```

## Setup Guide for Beginners

### 1. Open Project in VS Code

Open the folder:

```bash
ai-research-paper-summarizer
```

### 2. Backend Setup

Open VS Code terminal in the project folder.

```bash
cd backend
python -m venv venv
```

Activate virtual environment:

#### Windows PowerShell

```bash
venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, run:

```bash
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Then activate again.

#### Windows CMD

```bash
venv\Scripts\activate
```

Install packages:

```bash
pip install -r requirements.txt
```

Create `.env` file:

```bash
copy .env.example .env
```

Open `.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_real_api_key_here
GEMINI_MODEL=gemini-2.5-flash
FRONTEND_URL=http://localhost:5173
```

Run backend:

```bash
uvicorn main:app --reload
```

Backend will run on:

```text
http://127.0.0.1:8000
```

API docs:

```text
http://127.0.0.1:8000/docs
```

### 3. Frontend Setup

Open a second VS Code terminal.

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```text
http://127.0.0.1:5173
```

## How to Use

1. Open the frontend URL in browser.
2. Click **PDF Summarizer** from sidebar.
3. Upload a text-based research paper PDF.
4. Click **Generate AI Analysis**.
5. View results in tabs.
6. Copy or download the output.

## Testing

From backend folder:

```bash
pytest
```

Manual tests:

| Test Case | Expected Result |
|---|---|
| Valid PDF upload | AI summary generated |
| Empty PDF | Error message shown |
| Non-PDF upload | Rejected |
| Large PDF above 12 MB | Rejected |
| Missing API key | Clear backend error |
| Scanned PDF | Extraction warning/error |

## Important Limitations

- Scanned PDF images may not work without OCR.
- AI cannot guarantee 100% plagiarism removal.
- Citations must be verified manually.
- Output quality depends on PDF text quality and LLM API availability.
- Large papers are truncated for API reliability.

## AI/LLM Working Explanation

1. The user uploads a PDF from the React frontend.
2. FastAPI backend receives the PDF.
3. pdfplumber extracts text from the PDF.
4. Backend detects common research sections using heading patterns.
5. A structured prompt is created for Gemini.
6. Gemini returns JSON containing summary, rewrite, citations, key points, and limitations.
7. Backend stores result in local JSON history.
8. Frontend displays the result in clean tabs.

## GitHub Submission

Recommended GitHub repository name:

```text
ai-research-paper-summarizer
```

Before uploading to GitHub:

- Do not upload `.env`
- Do not upload `backend/venv`
- Do not upload large PDFs in uploads folder
