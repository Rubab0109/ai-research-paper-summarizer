import { Clock, RefreshCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getHistory } from '../api'

export default function HistoryPage() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  async function loadHistory() {
    setError('')
    try {
      const data = await getHistory()
      setItems(data)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  return (
    <main className="flex-1 p-5 lg:p-8">
      <section className="glass-card rounded-3xl p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-extrabold">Analysis History</h2>
            <p className="text-slate-400 mt-1">Locally saved PDF analysis records.</p>
          </div>

          <button
            onClick={loadHistory}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold"
          >
            <RefreshCcw size={16} />
            Refresh
          </button>
        </div>

        {error && <p className="text-red-300 mb-4">{error}</p>}

        <div className="space-y-4">
          {items.length === 0 && (
            <div className="p-6 rounded-2xl bg-slate-950/60 soft-border text-slate-400">
              No history yet. Analyze a PDF first.
            </div>
          )}

          {items.map((item) => (
            <article key={item.id} className="p-5 rounded-2xl bg-slate-950/60 soft-border">
              <h3 className="font-bold text-lg">{item.paper_title_guess || item.file_name}</h3>
              <p className="text-sm text-slate-400">{item.file_name}</p>
              <div className="flex items-center gap-2 mt-3 text-sm text-slate-500">
                <Clock size={14} />
                {new Date(item.created_at).toLocaleString()}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {(item.detected_sections || []).slice(0, 6).map((section) => (
                  <span key={section} className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs">
                    {section}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
