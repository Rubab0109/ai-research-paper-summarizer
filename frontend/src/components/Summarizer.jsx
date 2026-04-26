import { AlertCircle, FileUp, Loader2, UploadCloud } from 'lucide-react'
import { useState } from 'react'
import { analyzePdf } from '../api'
import ResultTabs from './ResultTabs'

export default function Summarizer() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleAnalyze() {
    setError('')
    setResult(null)

    if (!file) {
      setError('Please select a PDF research paper first.')
      return
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files are supported.')
      return
    }

    setLoading(true)

    try {
      const data = await analyzePdf(file)
      setResult(data)
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex-1 p-5 lg:p-8">
      <section className="glass-card rounded-3xl p-6 lg:p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <FileUp size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold">Research Paper Summarizer</h2>
            <p className="text-slate-400 mt-1">
              Upload a PDF and generate section-wise summary, rewrite, citations, and key points.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-5">
          <div className="rounded-3xl border-2 border-dashed border-slate-700 bg-slate-950/45 p-6 text-center">
            <UploadCloud className="mx-auto text-blue-400 mb-4" size={46} />
            <h3 className="text-xl font-bold mb-2">Upload Research Paper PDF</h3>
            <p className="text-slate-400 mb-5">
              Use a text-based PDF. Scanned image PDFs may not extract text correctly.
            </p>

            <label className="inline-block cursor-pointer">
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(event) => setFile(event.target.files?.[0] || null)}
              />
              <span className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 font-semibold">
                Choose PDF
              </span>
            </label>

            {file && (
              <div className="mt-5 p-4 rounded-2xl bg-slate-900 soft-border text-left">
                <p className="font-semibold">{file.name}</p>
                <p className="text-sm text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="mt-6 w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 font-bold disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-95"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  Processing PDF...
                </span>
              ) : (
                'Generate AI Analysis'
              )}
            </button>
          </div>

          <div className="rounded-3xl bg-slate-950/45 soft-border p-6">
            <h3 className="text-xl font-bold mb-4">Output Includes</h3>
            <ul className="space-y-3 text-slate-300">
              <li>• Section-wise academic summary</li>
              <li>• Easy explanation for students</li>
              <li>• Plagiarism-reduced rewrite</li>
              <li>• Smart citation suggestions</li>
              <li>• Key points and recommended next steps</li>
            </ul>

            <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <p className="text-sm text-amber-200 leading-relaxed">
                AI summaries are for assistance. Always verify important facts, citations, and research claims from the original paper.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-5 flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200">
            <AlertCircle size={20} className="mt-0.5" />
            <p>{error}</p>
          </div>
        )}
      </section>

      {result && <ResultTabs result={result} />}
    </main>
  )
}
