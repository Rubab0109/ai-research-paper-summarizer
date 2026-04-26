import { Brain, FileUp, Quote, ShieldCheck } from 'lucide-react'

const stats = [
  { label: 'PDF Input', value: '1', icon: FileUp },
  { label: 'LLM Integration', value: 'Gemini', icon: Brain },
  { label: 'Outputs', value: '5+', icon: Quote },
  { label: 'Storage', value: 'JSON', icon: ShieldCheck },
]

export default function Dashboard({ setActivePage }) {
  return (
    <main className="flex-1 p-5 lg:p-8">
      <section className="glass-card rounded-3xl p-6 lg:p-8 mb-6">
        <div className="max-w-4xl">
          <p className="text-blue-300 font-semibold mb-3">Generative AI Academic Tool</p>
          <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight mb-4">
            AI Research Paper Summarizer & Smart Rewriter
          </h2>
          <p className="text-slate-300 leading-relaxed text-base lg:text-lg">
            Upload a research paper PDF and generate section-wise summaries, easy explanations,
            plagiarism-reduced rewriting, key points, and smart citation suggestions.
          </p>

          <button
            onClick={() => setActivePage('summarizer')}
            className="mt-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg shadow-blue-950/30 hover:opacity-95"
          >
            Start PDF Analysis
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="glass-card rounded-3xl p-5">
              <Icon className="text-blue-400 mb-4" size={26} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-slate-400">{stat.label}</p>
            </div>
          )
        })}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-card rounded-3xl p-6">
          <h3 className="font-bold text-xl mb-3">How it works</h3>
          <ol className="space-y-3 text-slate-300">
            <li>1. User uploads a text-based PDF research paper.</li>
            <li>2. Backend extracts text and detects major academic sections.</li>
            <li>3. Gemini LLM generates structured academic outputs.</li>
            <li>4. Results are shown in professional tabs and saved locally.</li>
          </ol>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <h3 className="font-bold text-xl mb-3">Professional Features</h3>
          <ul className="space-y-3 text-slate-300">
            <li>• Modern responsive dark theme UI</li>
            <li>• Copy and download buttons</li>
            <li>• Error handling for wrong/empty/large PDFs</li>
            <li>• Documentation-ready folder structure</li>
          </ul>
        </div>
      </section>
    </main>
  )
}
