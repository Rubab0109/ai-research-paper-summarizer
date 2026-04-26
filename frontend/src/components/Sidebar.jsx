import { BookOpen, FileText, History, LayoutDashboard, Sparkles } from 'lucide-react'

const items = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'summarizer', label: 'PDF Summarizer', icon: FileText },
  { id: 'history', label: 'History', icon: History },
]

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="w-full lg:w-72 lg:min-h-screen glass-card lg:rounded-r-3xl p-5">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Sparkles className="text-white" size={24} />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight">AI Research</h1>
          <p className="text-xs text-slate-400">Summarizer & Rewriter</p>
        </div>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activePage === item.id

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
                isActive
                  ? 'bg-blue-600/90 text-white shadow-lg shadow-blue-950/30'
                  : 'text-slate-300 hover:bg-slate-800/80'
              }`}
            >
              <Icon size={18} />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="mt-8 p-4 rounded-2xl bg-slate-900/80 soft-border">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={17} className="text-blue-400" />
          <p className="font-semibold text-sm">Assignment Ready</p>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Includes PDF extraction, Gemini LLM prompts, local storage, report outline, and demo script.
        </p>
      </div>
    </aside>
  )
}
