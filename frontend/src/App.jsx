import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Summarizer from './components/Summarizer'
import HistoryPage from './components/HistoryPage'

export default function App() {
  const [activePage, setActivePage] = useState('dashboard')

  return (
    <div className="min-h-screen text-slate-100 lg:flex">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {activePage === 'dashboard' && <Dashboard setActivePage={setActivePage} />}
      {activePage === 'summarizer' && <Summarizer />}
      {activePage === 'history' && <HistoryPage />}
    </div>
  )
}
