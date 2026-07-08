import { useState } from 'react'
import KafkaPlayground from './components/KafkaPlayground'
import ConceptsPage from './components/ConceptsPage'
import GlossaryPage from './components/GlossaryPage'
import './App.css'

const TABS = [
  { id: 'playground', label: 'Live Playground' },
  { id: 'concepts', label: 'Concepts' },
  { id: 'glossary', label: 'Glossary' },
]

export default function App() {
  const [tab, setTab] = useState('playground')

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-mark">K</div>
            <div>
              <div className="brand-title">Kafka Visualizer</div>
              <div className="brand-sub">topics · partitions · consumers · offsets · lag</div>
            </div>
          </div>
          <nav className="nav-tabs">
            {TABS.map(t => (
              <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="main">
        {tab === 'playground' && <KafkaPlayground />}
        {tab === 'concepts' && <ConceptsPage />}
        {tab === 'glossary' && <GlossaryPage />}
      </main>

      <footer className="footer">
        <span>Built by <a href="https://aakashporwal1602.github.io/aakash-porwal-portfolio" target="_blank" rel="noreferrer">Aakash Porwal</a> — processed 300M+ events/day with Kafka at Tata Digital</span>
        <span className="mono">distributed systems · event-driven architecture</span>
      </footer>
    </div>
  )
}
