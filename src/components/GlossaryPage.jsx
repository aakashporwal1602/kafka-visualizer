const TERMS = [
  { term: 'At-least-once', def: 'Message kam se kam ek baar deliver hogi. Duplicates possible. Default in most systems.' },
  { term: 'At-most-once', def: 'Message zyada se zyada ek baar. Loss possible. Fast but unreliable.' },
  { term: 'Exactly-once', def: 'Message exactly ek baar. Kafka Transactions se possible. Slowest but safest.' },
  { term: 'Broker', def: 'Kafka server. Messages store karta hai. Cluster mein multiple brokers hote hain for redundancy.' },
  { term: 'Bootstrap Server', def: 'Kafka cluster se connect karne ke liye initial server address. e.g. localhost:9092' },
  { term: 'Commit', def: 'Consumer apna current offset save karta hai. Restart ke baad yahan se resume karta hai.' },
  { term: 'Consumer Group ID', def: 'Group ka unique name. Same group-id wale consumers ek team mein hote hain.' },
  { term: 'Dead Letter Queue', def: 'Failed messages yahan jaate hain retry ke liye ya debugging ke liye. JARVIS mein hum ye use karte the.' },
  { term: 'Deserialization', def: 'Bytes → Object. Consumer ke side pe bytes ko readable format mein convert karna.' },
  { term: 'Event Sourcing', def: 'State changes ko events ke roop mein store karna. Kafka perfect fit hai.' },
  { term: 'Idempotent Producer', def: 'Duplicate messages nahi bhejega even if retry kare. enable.idempotence=true se.' },
  { term: 'ISR', def: 'In-Sync Replicas. Brokers jo leader ke saath sync mein hain. ISR se bahar jaana = potential data loss.' },
  { term: 'Key', def: 'Message ka identifier. Same key wale messages hamesha same partition mein jaate hain (ordering guarantee).' },
  { term: 'Leader', def: 'Har partition ka ek leader broker hota hai. Saare reads/writes leader ke through jaate hain.' },
  { term: 'Log Compaction', def: 'Same key ke purane messages delete hote hain, sirf latest rakhte hain. State snapshots ke liye.' },
  { term: 'Offset Reset', def: 'Consumer ko kisi purane offset se phir se start karna. earliest/latest/specific offset.' },
  { term: 'Partition Key', def: 'Is key ke hash se decide hota hai kaunse partition mein message jaayega.' },
  { term: 'Replication Factor', def: 'Kitne brokers pe data ka backup hai. 3 common in production.' },
  { term: 'Retention Policy', def: 'Kitne time ya size tak messages store rahenge. Default 7 days.' },
  { term: 'Schema Registry', def: 'Message schemas centrally store karta hai. Avro/Protobuf ke saath use hota hai. JARVIS mein hum Confluent Schema Registry use karte the.' },
  { term: 'Serialization', def: 'Object → Bytes. Producer ke side pe data ko bytes mein convert karna for storage/transfer.' },
  { term: 'Timestamp', def: 'Har message ke saath creation time ya ingestion time store hota hai.' },
  { term: 'Topic Partition', def: 'Topic ki physical unit. Ek ordered log file. Parallelism ki unit.' },
  { term: 'Watermark', def: 'Event-time processing mein — batata hai ki kis time tak events process ho chuke hain.' },
  { term: 'Zookeeper', def: 'Purana Kafka cluster management tool. Modern Kafka (2.8+) mein KRaft ne replace kiya.' },
  { term: 'KRaft', def: 'Kafka Raft — Zookeeper ko replace kiya. Native Kafka consensus protocol. Simpler deployment.' },
  { term: 'Consumer Lag', def: 'Latest offset − Consumer offset. Kitne messages abhi tak nahi consume hue.' },
  { term: 'Throughput', def: 'Kitne messages per second process ho rahe hain. Kafka ka ek main strength.' },
  { term: 'Backpressure', def: 'Consumer slow hai, producer fast — lag build hone lagta hai. Throttle karo ya consumers scale karo.' },
  { term: 'Kafka Streams', def: 'Kafka ka built-in stream processing library. Join, filter, aggregate kar sakte ho.' },
]

export default function GlossaryPage() {
  return (
    <div className="glossary-page">
      <div className="page-hdr">
        <h1>Kafka Glossary</h1>
        <p>30 essential Kafka terms — quick reference for interviews and production.</p>
      </div>
      <div className="glossary-grid">
        {TERMS.map(t => (
          <div className="gloss-card" key={t.term}>
            <div className="gloss-term">{t.term}</div>
            <div className="gloss-def">{t.def}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
