import { useState, useEffect, useRef, useCallback } from 'react'

const COLORS = ['#7C5CFF', '#22D3EE', '#34D399', '#F5B841', '#F87171', '#FB923C', '#F472B6']
const MSG_TYPES = ['click', 'purchase', 'view', 'cart', 'search', 'checkout', 'login']

function makeId() { return Math.random().toString(36).slice(2, 8) }

function initState(numPartitions = 3, numConsumers = 2) {
  const partitions = Array.from({ length: numPartitions }, (_, i) => ({
    id: i,
    messages: [],
    latestOffset: 0,
  }))
  const consumers = Array.from({ length: numConsumers }, (_, i) => ({
    id: `C${i + 1}`,
    color: COLORS[i % COLORS.length],
    assignments: [],
    offsets: {},
    lag: {},
    processed: 0,
    lastMsg: null,
  }))
  assignPartitions(partitions, consumers)
  return { partitions, consumers, producerCount: 0, totalMessages: 0 }
}

function assignPartitions(partitions, consumers) {
  consumers.forEach(c => { c.assignments = []; c.offsets = {}; c.lag = {} })
  partitions.forEach((p, i) => {
    const c = consumers[i % consumers.length]
    c.assignments.push(p.id)
    c.offsets[p.id] = 0
    c.lag[p.id] = 0
  })
}

export default function KafkaPlayground() {
  const [numPartitions, setNumPartitions] = useState(3)
  const [numConsumers, setNumConsumers] = useState(2)
  const [state, setState] = useState(() => initState(3, 2))
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(800)
  const [logs, setLogs] = useState([])
  const [flowMsgs, setFlowMsgs] = useState([])
  const [scenario, setScenario] = useState(null)
  const intervalRef = useRef(null)
  const stateRef = useRef(state)
  stateRef.current = state

  const addLog = useCallback((text, color = 'var(--muted)') => {
    const t = new Date().toLocaleTimeString('en-IN', { hour12: false })
    setLogs(prev => [{ t, text, color, id: makeId() }, ...prev.slice(0, 79)])
  }, [])

  const produce = useCallback((overridePartition = null) => {
    setState(prev => {
      const s = JSON.parse(JSON.stringify(prev))
      const msgType = MSG_TYPES[Math.floor(Math.random() * MSG_TYPES.length)]
      const partIdx = overridePartition !== null
        ? overridePartition
        : s.producerCount % s.partitions.length
      const p = s.partitions[partIdx]
      const msg = {
        id: makeId(),
        offset: p.latestOffset,
        type: msgType,
        key: `user-${Math.floor(Math.random() * 100)}`,
        ts: Date.now(),
      }
      p.messages = [...p.messages.slice(-14), msg]
      p.latestOffset++
      s.producerCount++
      s.totalMessages++
      s.consumers.forEach(c => {
        if (c.assignments.includes(partIdx)) {
          c.lag[partIdx] = p.latestOffset - (c.offsets[partIdx] || 0)
        }
      })
      addLog(`📨 Produced [${msgType}] → Partition-${partIdx} offset=${msg.offset}`, 'var(--cyan)')
      setFlowMsgs(f => [...f, { id: makeId(), partIdx, dir: 'produce', ts: Date.now() }])
      return s
    })
  }, [addLog])

  const consume = useCallback(() => {
    setState(prev => {
      const s = JSON.parse(JSON.stringify(prev))
      let consumed = false
      s.consumers.forEach(consumer => {
        consumer.assignments.forEach(partIdx => {
          const p = s.partitions[partIdx]
          const offset = consumer.offsets[partIdx] || 0
          const msg = p.messages.find(m => m.offset === offset)
          if (msg) {
            consumer.offsets[partIdx] = offset + 1
            consumer.lag[partIdx] = Math.max(0, p.latestOffset - (offset + 1))
            consumer.processed++
            consumer.lastMsg = msg.type
            consumed = true
            addLog(`✅ ${consumer.id} consumed [${msg.type}] ← Partition-${partIdx} offset=${offset}`, consumer.color)
            setFlowMsgs(f => [...f, { id: makeId(), partIdx, consumerId: consumer.id, dir: 'consume', ts: Date.now() }])
          }
        })
      })
      return s
    })
  }, [addLog])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        if (Math.random() > 0.3) produce()
        else consume()
      }, speed)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning, speed, produce, consume])

  useEffect(() => {
    const timer = setTimeout(() => {
      setFlowMsgs(f => f.filter(m => Date.now() - m.ts < 1500))
    }, 1600)
    return () => clearTimeout(timer)
  }, [flowMsgs])

  const reset = () => {
    setIsRunning(false)
    clearInterval(intervalRef.current)
    setState(initState(numPartitions, numConsumers))
    setLogs([])
    setFlowMsgs([])
    setScenario(null)
    addLog('🔄 Cluster reset', 'var(--muted)')
  }

  const applyScenario = (sc) => {
    setIsRunning(false)
    clearInterval(intervalRef.current)
    setScenario(sc)
    if (sc === 'lag') {
      setState(initState(3, 1))
      setNumPartitions(3); setNumConsumers(1)
      addLog('⚠️ Scenario: Consumer Lag — 1 consumer, 3 partitions. Produce fast!', 'var(--amber)')
    } else if (sc === 'rebalance') {
      setState(initState(4, 3))
      setNumPartitions(4); setNumConsumers(3)
      addLog('🔀 Scenario: Rebalance — 4 partitions, 3 consumers', 'var(--violet)')
    } else if (sc === 'burst') {
      setState(initState(3, 2))
      setNumPartitions(3); setNumConsumers(2)
      for (let i = 0; i < 12; i++) setTimeout(() => produce(), i * 50)
      addLog('🚀 Scenario: Producer Burst — 12 messages produced instantly!', 'var(--red)')
    }
    setLogs([])
    setFlowMsgs([])
  }

  const handlePartitionChange = (val) => {
    const n = Number(val)
    setNumPartitions(n)
    setState(prev => {
      const s = JSON.parse(JSON.stringify(prev))
      while (s.partitions.length < n) s.partitions.push({ id: s.partitions.length, messages: [], latestOffset: 0 })
      s.partitions = s.partitions.slice(0, n)
      assignPartitions(s.partitions, s.consumers)
      return s
    })
    addLog(`📦 Partitions changed to ${n} — rebalancing...`, 'var(--violet)')
  }

  const handleConsumerChange = (val) => {
    const n = Number(val)
    setNumConsumers(n)
    setState(prev => {
      const s = JSON.parse(JSON.stringify(prev))
      while (s.consumers.length < n) {
        const i = s.consumers.length
        s.consumers.push({ id: `C${i + 1}`, color: COLORS[i % COLORS.length], assignments: [], offsets: {}, lag: {}, processed: 0, lastMsg: null })
      }
      s.consumers = s.consumers.slice(0, n)
      assignPartitions(s.partitions, s.consumers)
      return s
    })
    addLog(`👥 Consumers changed to ${n} — rebalancing...`, 'var(--green)')
  }

  const totalLag = state.consumers.reduce((sum, c) => sum + Object.values(c.lag).reduce((a, b) => a + b, 0), 0)

  return (
    <div className="pg">
      <div className="pg-header">
        <h1>Kafka Live Playground</h1>
        <p>Produce messages, watch them flow to partitions, consumers commit offsets in real-time.</p>
      </div>

      <div className="controls-bar">
        <div className="ctrl-group">
          <label>Partitions</label>
          <input type="range" min="1" max="6" step="1" value={numPartitions}
            onChange={e => handlePartitionChange(e.target.value)} />
          <span>{numPartitions}</span>
        </div>
        <div className="ctrl-group">
          <label>Consumers</label>
          <input type="range" min="1" max="6" step="1" value={numConsumers}
            onChange={e => handleConsumerChange(e.target.value)} />
          <span>{numConsumers}</span>
        </div>
        <div className="ctrl-group">
          <label>Speed</label>
          <input type="range" min="200" max="2000" step="100" value={speed}
            onChange={e => setSpeed(Number(e.target.value))} />
          <span>{speed}ms</span>
        </div>
      </div>

      <div className="scenario-bar">
        <span className="scenario-label">Scenarios:</span>
        <button className={`sc-btn ${scenario === 'lag' ? 'active' : ''}`} onClick={() => applyScenario('lag')}>Consumer Lag</button>
        <button className={`sc-btn ${scenario === 'rebalance' ? 'active' : ''}`} onClick={() => applyScenario('rebalance')}>Rebalance</button>
        <button className={`sc-btn ${scenario === 'burst' ? 'active' : ''}`} onClick={() => applyScenario('burst')}>Producer Burst</button>
      </div>

      <div className="stats-row">
        <div className="stat"><div className="stat-n">{state.totalMessages}</div><div className="stat-l">Messages produced</div></div>
        <div className="stat"><div className="stat-n">{state.consumers.reduce((s, c) => s + c.processed, 0)}</div><div className="stat-l">Messages consumed</div></div>
        <div className="stat lag"><div className="stat-n" style={{ color: totalLag > 0 ? 'var(--red)' : 'var(--green)' }}>{totalLag}</div><div className="stat-l">Total lag</div></div>
        <div className="stat"><div className="stat-n">{state.partitions.length}</div><div className="stat-l">Partitions</div></div>
        <div className="stat"><div className="stat-n">{state.consumers.length}</div><div className="stat-l">Consumers</div></div>
      </div>

      <div className="main-viz">
        <ProducerPanel onProduce={produce} partitions={state.partitions} />
        <PartitionsPanel partitions={state.partitions} consumers={state.consumers} flowMsgs={flowMsgs} />
        <ConsumersPanel consumers={state.consumers} onConsume={consume} />
      </div>

      <div className="action-row">
        <button className={`btn-run ${isRunning ? 'running' : ''}`} onClick={() => setIsRunning(r => !r)}>
          {isRunning ? '⏸ Pause' : '▶ Auto Run'}
        </button>
        <button className="btn-step" onClick={produce}>+ Produce</button>
        <button className="btn-step" onClick={consume}>↓ Consume</button>
        <button className="btn-reset" onClick={reset}>↺ Reset</button>
      </div>

      <div className="log-panel">
        <div className="log-title">Event log</div>
        <div className="log-area">
          {logs.length === 0 && <div className="log-empty">Press "Auto Run" or "Produce" to start</div>}
          {logs.map(l => (
            <div key={l.id} className="log-line">
              <span className="log-t">{l.t}</span>
              <span style={{ color: l.color }}>{l.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProducerPanel({ onProduce, partitions }) {
  return (
    <div className="panel producer-panel">
      <div className="panel-title" style={{ color: 'var(--cyan)' }}>Producer</div>
      <div className="producer-box">
        <div className="producer-icon">P</div>
        <div className="producer-label">Event Stream</div>
        <div className="producer-sub">round-robin partitioning</div>
        <div className="producer-arrows">
          {partitions.map(p => (
            <button key={p.id} className="p-arrow-btn" onClick={() => onProduce(p.id)}>
              → P{p.id}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function PartitionsPanel({ partitions, consumers, flowMsgs }) {
  return (
    <div className="panel partitions-panel">
      <div className="panel-title" style={{ color: 'var(--violet)' }}>Topic Partitions</div>
      <div className="partitions-list">
        {partitions.map(p => {
          const owner = consumers.find(c => c.assignments.includes(p.id))
          const hasFlow = flowMsgs.some(f => f.partIdx === p.id)
          return (
            <div key={p.id} className={`partition ${hasFlow ? 'partition-flash' : ''}`}>
              <div className="partition-header">
                <span className="partition-name">Partition-{p.id}</span>
                <span className="partition-offset">offset: {p.latestOffset}</span>
                {owner && (
                  <span className="partition-owner" style={{ color: owner.color }}>
                    ← {owner.id}
                  </span>
                )}
              </div>
              <div className="msg-tape">
                {p.messages.slice(-10).map(m => (
                  <div key={m.id} className="msg-pill" title={`${m.type} | key=${m.key} | offset=${m.offset}`}>
                    <span className="msg-offset">{m.offset}</span>
                    <span className="msg-type">{m.type.slice(0, 3)}</span>
                  </div>
                ))}
                {p.messages.length === 0 && <span className="empty-tape">no messages yet</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ConsumersPanel({ consumers, onConsume }) {
  return (
    <div className="panel consumers-panel">
      <div className="panel-title" style={{ color: 'var(--green)' }}>Consumer Group</div>
      <div className="consumers-list">
        {consumers.map(c => {
          const totalLag = Object.values(c.lag).reduce((a, b) => a + b, 0)
          return (
            <div key={c.id} className="consumer" style={{ '--cc': c.color }}>
              <div className="consumer-header">
                <div className="consumer-icon" style={{ background: c.color + '22', border: `1.5px solid ${c.color}`, color: c.color }}>
                  {c.id}
                </div>
                <div className="consumer-meta">
                  <div className="consumer-assigns">
                    Partitions: {c.assignments.length > 0 ? c.assignments.map(a => `P${a}`).join(', ') : 'none'}
                  </div>
                  <div className="consumer-processed">processed: {c.processed}</div>
                </div>
                <div className={`consumer-lag ${totalLag > 5 ? 'lag-high' : totalLag > 0 ? 'lag-mid' : 'lag-ok'}`}>
                  lag: {totalLag}
                </div>
              </div>
              <div className="offset-row">
                {c.assignments.map(partIdx => (
                  <div key={partIdx} className="offset-chip">
                    <span>P{partIdx}</span>
                    <span className="offset-val" style={{ color: c.color }}>@{c.offsets[partIdx] || 0}</span>
                    {c.lag[partIdx] > 0 && <span className="lag-chip">+{c.lag[partIdx]}</span>}
                  </div>
                ))}
              </div>
              {c.lastMsg && (
                <div className="consumer-last">last: <span style={{ color: c.color }}>{c.lastMsg}</span></div>
              )}
            </div>
          )
        })}
      </div>
      <button className="consume-all-btn" onClick={onConsume}>↓ Consume Next</button>
    </div>
  )
}
