const TERMS = [
  { term: 'At-least-once', def: 'A message is delivered at least one time. Duplicates are possible. Default behavior in most systems.' },
  { term: 'At-most-once', def: 'A message is delivered at most one time. Message loss is possible. Fast but unreliable.' },
  { term: 'Exactly-once', def: 'A message is delivered exactly one time. Achievable via Kafka Transactions. Slowest but safest.' },
  { term: 'Broker', def: 'A Kafka server that stores and serves messages. A cluster contains multiple brokers for redundancy and scalability.' },
  { term: 'Bootstrap Server', def: 'The initial server address used to connect to a Kafka cluster. e.g. localhost:9092' },
  { term: 'Commit', def: 'A consumer saves its current offset to Kafka. On restart, consumption resumes from the last committed offset.' },
  { term: 'Consumer Group ID', def: 'A unique identifier shared by a group of consumers. Consumers with the same group-id collaborate to consume a topic.' },
  { term: 'Dead Letter Queue', def: 'Failed or unprocessable messages are routed here for retry or debugging. Used in JARVIS to isolate bad events.' },
  { term: 'Deserialization', def: 'Converting raw bytes back into a structured object on the consumer side. The reverse of serialization.' },
  { term: 'Event Sourcing', def: 'An architectural pattern where state changes are stored as a sequence of events. Kafka is a natural fit.' },
  { term: 'Idempotent Producer', def: 'A producer that will not send duplicate messages even if it retries. Enabled via enable.idempotence=true.' },
  { term: 'ISR', def: 'In-Sync Replicas. The set of brokers that are fully caught up with the partition leader. Falling out of ISR risks data loss.' },
  { term: 'Key', def: 'An optional message identifier. Messages with the same key are always routed to the same partition, guaranteeing order.' },
  { term: 'Leader', def: 'Each partition has one leader broker that handles all reads and writes. Followers replicate from the leader.' },
  { term: 'Log Compaction', def: 'Kafka retains only the latest message per key, deleting older ones. Used for maintaining state snapshots.' },
  { term: 'Offset Reset', def: 'Restarting a consumer from a specific point: earliest (beginning), latest (now), or a specific offset number.' },
  { term: 'Partition Key', def: 'The value whose hash determines which partition a message is routed to. Same key always maps to the same partition.' },
  { term: 'Replication Factor', def: 'The number of brokers that store a copy of each partition. A factor of 3 is standard in production.' },
  { term: 'Retention Policy', def: 'How long or how much data Kafka keeps before deleting old messages. Default is 7 days.' },
  { term: 'Schema Registry', def: 'A central service that stores and enforces message schemas for Avro or Protobuf. JARVIS used Confluent Schema Registry.' },
  { term: 'Serialization', def: 'Converting a structured object into raw bytes on the producer side for efficient storage and transfer.' },
  { term: 'Timestamp', def: 'Each message carries a timestamp — either the time it was created by the producer or the time it was ingested by the broker.' },
  { term: 'Topic Partition', def: 'The physical unit of a topic. An ordered, append-only log file. The fundamental unit of parallelism in Kafka.' },
  { term: 'Watermark', def: 'In event-time stream processing, a watermark signals up to what point in time all events have been received and processed.' },
  { term: 'Zookeeper', def: 'The legacy Kafka cluster coordination service. Deprecated in modern Kafka (2.8+) and replaced by KRaft.' },
  { term: 'KRaft', def: 'Kafka Raft — Kafka\'s native consensus protocol that replaces Zookeeper. Simpler to deploy and operate.' },
  { term: 'Consumer Lag', def: 'The difference between the latest offset and the consumer\'s current offset. High lag means the consumer is falling behind.' },
  { term: 'Throughput', def: 'The number of messages processed per second. High throughput is one of Kafka\'s core strengths.' },
  { term: 'Backpressure', def: 'When a fast producer overwhelms a slow consumer, lag accumulates. Resolved by throttling the producer or scaling consumers.' },
  { term: 'Kafka Streams', def: 'Kafka\'s built-in stream processing library for real-time transformations — join, filter, aggregate, and more.' },
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
