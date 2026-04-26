# Demo Video Script: 5–7 Minutes

## 0:00–0:30 — Introduction
Assalam-o-Alaikum. My project title is AI Research Paper Summarizer & Smart Rewriter. It is a Generative AI web application designed for university students and researchers.

## 0:30–1:15 — Problem Explanation
Students often need to read long research papers for assignments, literature reviews, and final year projects. These papers are difficult to understand because they contain technical academic language. Students also face difficulty in summarizing papers, rewriting content, and creating citations.

## 1:15–2:00 — Project Objective
The objective of this project is to create a working AI-powered web app that allows users to upload a PDF research paper and generate:
- Section-wise summary
- Easy explanation
- Key points
- Plagiarism-reduced rewritten content
- Smart citation suggestions

## 2:00–2:45 — Technology Stack
The frontend is built using React.js, Vite, and Tailwind CSS. The backend is built using FastAPI and Python. PDF text is extracted using pdfplumber. The system uses Gemini API as the Large Language Model. Local JSON storage is used for saving analysis history.

## 2:45–3:45 — Live Demo: Upload PDF
Now I will open the application. The UI is designed in a modern dark theme. From the sidebar, I will click PDF Summarizer. Here, I can upload a PDF research paper. After selecting the file, I click Generate AI Analysis.

## 3:45–4:45 — Live Demo: AI Output
The system extracts the paper text and sends it to the LLM. The output is displayed in tabs. The Summary tab shows section-wise summaries. The Rewritten Content tab shows plagiarism-reduced academic rewriting. The Citations tab shows citation suggestions. The Key Points tab shows important points.

## 4:45–5:30 — AI/LLM Working
The backend creates a structured prompt and sends extracted text to Gemini API. The LLM returns a JSON response containing summaries, explanations, rewriting, citations, and limitations. The frontend displays this response in a clean and readable format.

## 5:30–6:15 — Testing and Error Handling
The system handles common errors such as empty PDF, unsupported file format, large file size, missing API key, and scanned PDFs where text cannot be extracted properly.

## 6:15–7:00 — Conclusion
This project solves a real academic problem using Generative AI. It helps students save time, understand research papers better, and prepare academic summaries more efficiently. Future improvements include OCR support, Word/PDF export, login system, and cloud storage.
