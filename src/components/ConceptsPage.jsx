export default function ConceptsPage() {
  const concepts = [
    {
      title: 'Topic',
      color: '#7C5CFF',
      emoji: '📂',
      simple: 'A named channel where messages of a specific type are stored.',
      detail: 'A topic is a logical category for messages — like "user-clicks", "orders", or "payments". Producers publish messages to a topic; consumers read from it. Topics are durable — messages are written to disk and retained based on your retention policy.',
      example: 'topic: "user-events"\n  ├── click events\n  ├── page views\n  └── purchase events',
    },
    {
      title: 'Partition',
      color: '#22D3EE',
      emoji: '🗂',
      simple: 'A topic is split into partitions to enable parallel processing.',
      detail: 'A topic is divided into one or more partitions. Each partition is an ordered, immutable sequence of messages. More partitions = more consumers can work in parallel. Partitions are the fundamental unit of parallelism and scalability in Kafka.',
      example: 'topic: "user-events" (3 partitions)\n  Partition-0: [msg0, msg3, msg6...]\n  Partition-1: [msg1, msg4, msg7...]\n  Partition-2: [msg2, msg5, msg8...]',
    },
    {
      title: 'Offset',
      color: '#F5B841',
      emoji: '🔢',
      simple: 'A unique sequential number assigned to each message — like a page number.',
      detail: 'Every message in a partition gets a unique offset starting from 0, incrementing monotonically. Consumers track their current offset to know which messages they have already processed. Offsets make replay and resumption after failures possible.',
      example: 'Partition-0:\n  offset=0: {type: "click", user: 42}\n  offset=1: {type: "view",  user: 17}\n  offset=2: {type: "cart",  user: 42}\n\nConsumer offset: 2 (next: read offset=2)',
    },
    {
      title: 'Producer',
      color: '#34D399',
      emoji: '📨',
      simple: 'The component that writes messages into Kafka.',
      detail: 'A producer publishes messages to a topic. It decides which partition a message goes to — via key-based hashing, round-robin, or a custom partitioner. In JARVIS at Tata Digital, our Node.js backend was the producer, sending 300M+ events/day.',
      example: '// Round-robin: distributes across partitions evenly\nproducer.send({ topic: "clicks", value: event })\n\n// Key-based: same key always goes to same partition\nproducer.send({ topic: "clicks", key: userId, value: event })',
    },
    {
      title: 'Consumer',
      color: '#F87171',
      emoji: '📥',
      simple: 'The component that reads messages from Kafka.',
      detail: 'A consumer subscribes to one or more topics and reads messages sequentially, committing its offset after processing. Within a consumer group, partitions are split among members so each message is processed by exactly one consumer.',
      example: 'consumer.subscribe(["user-events"])\n\nconsumer.run({\n  eachMessage: async ({ topic, partition, message }) => {\n    console.log(message.value.toString())\n    // offset is committed automatically\n  }\n})',
    },
    {
      title: 'Consumer Group',
      color: '#FB923C',
      emoji: '👥',
      simple: 'A team of consumers that collaborate to process a topic together.',
      detail: 'All consumers in a group share a unique group-id. Kafka automatically distributes partitions across group members. If a consumer fails, its partitions are reassigned to remaining members — this is called rebalancing.',
      example: 'Group: "analytics-consumers"\n  Consumer-1 → Partition-0, Partition-1\n  Consumer-2 → Partition-2\n\nRule: one partition belongs to exactly one consumer\nNote: consumers > partitions = some consumers idle',
    },
    {
      title: 'Lag',
      color: '#F472B6',
      emoji: '⏱',
      simple: 'The number of messages a consumer has not yet processed — the backlog.',
      detail: 'Lag = Latest Offset − Consumer Offset. When a producer is faster than a consumer, lag grows. High lag means the consumer is overwhelmed or too slow. Always monitor lag in production and alert when it crosses a threshold.',
      example: 'Partition-0:\n  Latest offset:   100\n  Consumer offset:  85\n  Lag:              15  ← 15 messages unread\n\nLag = 0 → consumer is up-to-date ✓\nLag > threshold → alert! consumer is falling behind 🔴',
    },
    {
      title: 'Rebalancing',
      color: '#7C5CFF',
      emoji: '🔀',
      simple: 'When consumers join or leave, Kafka redistributes partitions among them.',
      detail: 'Whenever a consumer joins or leaves a group, Kafka triggers a rebalance — redistributing all partitions across the current group members. During rebalancing, consumption briefly pauses. Modern Kafka uses incremental cooperative rebalancing to minimize this pause.',
      example: 'Before (2 consumers, 4 partitions):\n  C1 → P0, P1\n  C2 → P2, P3\n\nC3 joins → Rebalancing...\n\nAfter (3 consumers, 4 partitions):\n  C1 → P0\n  C2 → P1, P2\n  C3 → P3',
    },
  ]

  return (
    <div className="concepts-page">
      <div className="page-hdr">
        <h1>Kafka Concepts</h1>
        <p>Core concepts explained simply — with real examples from production systems.</p>
      </div>
      <div className="concepts-grid">
        {concepts.map(c => (
          <div className="concept-card" key={c.title} style={{ '--cc': c.color }}>
            <div className="cc-top">
              <span className="cc-emoji">{c.emoji}</span>
              <h2 className="cc-title" style={{ color: c.color }}>{c.title}</h2>
            </div>
            <p className="cc-simple">"{c.simple}"</p>
            <p className="cc-detail">{c.detail}</p>
            <pre className="cc-example">{c.example}</pre>
          </div>
        ))}
      </div>
    </div>
  )
}
