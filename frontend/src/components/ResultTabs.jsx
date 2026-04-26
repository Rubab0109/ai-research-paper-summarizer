import { Clipboard, Download } from 'lucide-react'
import { useMemo, useState } from 'react'

const tabs = [
  { id: 'summary', label: 'Summary' },
  { id: 'rewrite', label: 'Rewritten Content' },
  { id: 'citations', label: 'Citations' },
  { id: 'points', label: 'Key Points' },
]

function copyText(text) {
  navigator.clipboard.writeText(text)
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export default function ResultTabs({ result }) {
  const [activeTab, setActiveTab] = useState('summary')
  const analysis = result.analysis

  const fullText = useMemo(() => {
    return [
      `Title: ${analysis.paper_title_guess}`,
      '',
      'SECTION-WISE SUMMARY',
      ...(analysis.section_wise_summary || []).map(
        (item) => `
${item.section}
Summary: ${item.summary}
Easy Explanation: ${item.easy_explanation}`
      ),
      '',
      'OVERALL EASY EXPLANATION',
      analysis.overall_easy_explanation,
      '',
      'KEY POINTS',
      ...(analysis.key_points || []).map((point, index) => `${index + 1}. ${point}`),
      '',
      'REWRITTEN CONTENT',
      analysis.rewritten_content,
      '',
      'SMART CITATIONS',
      ...(analysis.smart_citations || []).map((citation, index) => `${index + 1}. ${citation}`),
      '',
      'LIMITATIONS',
      ...(analysis.limitations || []).map((item, index) => `${index + 1}. ${item}`),
    ].join('\n')
  }, [analysis])

  return (
    <section className="glass-card rounded-3xl p-5 lg:p-6 mt-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-5">
        <div>
          <p className="text-sm text-slate-400">Generated result for</p>
          <h3 className="text-2xl font-bold">{analysis.paper_title_guess || result.file_name}</h3>
          <p className="text-sm text-slate-500 mt-1">{result.file_name}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => copyText(fullText)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-semibold"
          >
            <Clipboard size={16} />
            Copy All
          </button>
          <button
            onClick={() => downloadText('research-analysis.txt', fullText)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold"
          >
            <Download size={16} />
            Download
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-3xl bg-slate-950/70 soft-border p-5 max-h-[560px] overflow-y-auto scrollbar-thin">
        {activeTab === 'summary' && (
          <div className="space-y-5">
            {(analysis.section_wise_summary || []).map((item, index) => (
              <article key={`${item.section}-${index}`} className="p-4 rounded-2xl bg-slate-900/80 soft-border">
                <h4 className="font-bold text-blue-300 mb-2">{item.section}</h4>
                <p className="text-slate-200 leading-relaxed mb-3">{item.summary}</p>
                <p className="text-slate-400 leading-relaxed">
                  <span className="font-semibold text-slate-300">Easy Explanation: </span>
                  {item.easy_explanation}
                </p>
              </article>
            ))}

            <article className="p-4 rounded-2xl bg-blue-950/30 soft-border">
              <h4 className="font-bold text-blue-200 mb-2">Overall Easy Explanation</h4>
              <p className="text-slate-300 leading-relaxed">{analysis.overall_easy_explanation}</p>
            </article>
          </div>
        )}

        {activeTab === 'rewrite' && (
          <div>
            <div className="flex justify-end mb-3">
              <button
                onClick={() => copyText(analysis.rewritten_content || '')}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm"
              >
                Copy Rewrite
              </button>
            </div>
            <p className="text-slate-200 leading-8 whitespace-pre-line">{analysis.rewritten_content}</p>
          </div>
        )}

        {activeTab === 'citations' && (
          <div className="space-y-4">
            {(analysis.smart_citations || []).map((citation, index) => (
              <div key={index} className="p-4 rounded-2xl bg-slate-900/80 soft-border">
                <p className="text-slate-200 leading-relaxed">{citation}</p>
              </div>
            ))}
            <p className="text-sm text-amber-300">
              Note: The app does not invent missing author/year/DOI information. Verify citations manually before submission.
            </p>
          </div>
        )}

        {activeTab === 'points' && (
          <div className="space-y-3">
            {(analysis.key_points || []).map((point, index) => (
              <div key={index} className="flex gap-3 p-4 rounded-2xl bg-slate-900/80 soft-border">
                <span className="h-7 w-7 flex items-center justify-center rounded-full bg-blue-600 text-sm font-bold">
                  {index + 1}
                </span>
                <p className="text-slate-200 leading-relaxed">{point}</p>
              </div>
            ))}

            <div className="mt-6">
              <h4 className="font-bold mb-3">Recommended Next Steps</h4>
              <ul className="space-y-2 text-slate-300">
                {(analysis.recommended_next_steps || []).map((step, index) => (
                  <li key={index}>• {step}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
