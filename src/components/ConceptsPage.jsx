export default function ConceptsPage() {
  const concepts = [
    {
      title: 'Topic',
      color: '#7C5CFF',
      emoji: '📂',
      simple: 'Ek folder jisme ek type ke messages store hote hain.',
      detail: 'Topic ek logical channel hai. Jaise "user-clicks", "orders", "payments". Producer messages ek topic mein publish karta hai, consumers us topic se read karte hain. Topics durable hote hain — messages disk pe store hote hain.',
      example: 'topic: "user-events"\n  ├── click events\n  ├── page views\n  └── purchase events',
    },
    {
      title: 'Partition',
      color: '#22D3EE',
      emoji: '🗂',
      simple: 'Topic ke andar alag alag drawers. Parallel processing ke liye.',
      detail: 'Ek topic multiple partitions mein split hota hai. Har partition ek ordered, immutable sequence of messages hai. Partitions allow karte hain horizontal scaling — zyada partitions = zyada consumers parallel mein kaam kar sakte hain.',
      example: 'topic: "user-events" (3 partitions)\n  Partition-0: [msg0, msg3, msg6...]\n  Partition-1: [msg1, msg4, msg7...]\n  Partition-2: [msg2, msg5, msg8...]',
    },
    {
      title: 'Offset',
      color: '#F5B841',
      emoji: '🔢',
      simple: 'Har message ka unique number — jaise page number book mein.',
      detail: 'Har message ko ek unique offset assign hota hai partition ke andar. Offset 0 se start hota hai aur monotonically increase karta hai. Consumer apna offset track karta hai — ye batata hai ki usne kitne messages consume kiye hain.',
      example: 'Partition-0:\n  offset=0: {type: "click", user: 42}\n  offset=1: {type: "view",  user: 17}\n  offset=2: {type: "cart",  user: 42}\n  \nConsumer offset: 2 (next: read offset=2)',
    },
    {
      title: 'Producer',
      color: '#34D399',
      emoji: '📨',
      simple: 'Jo messages bhejta hai — Kafka ka writer.',
      detail: 'Producer messages publish karta hai topic mein. Producer decide karta hai kaunse partition mein message jaayega — key-based hashing, round-robin, ya custom partitioner se. JARVIS mein humara Node.js backend producer tha.',
      example: '// Round-robin: partitions mein baari baari\nproducer.send({ topic: "clicks", value: event })\n\n// Key-based: same key = same partition\nproducer.send({ topic: "clicks", key: userId, value: event })',
    },
    {
      title: 'Consumer',
      color: '#F87171',
      emoji: '📥',
      simple: 'Jo messages padhta hai — Kafka ka reader.',
      detail: 'Consumer topic se messages padhta hai aur apna offset commit karta hai. Consumer group mein multiple consumers hote hain jo partitions ke beech kaam divide karte hain. Har partition sirf ek hi consumer group member ke paas jaata hai.',
      example: 'consumer.subscribe(["user-events"])\n\nconsumer.run({\n  eachMessage: async ({ topic, partition, message }) => {\n    console.log(message.value.toString())\n    // offset automatically commit hota hai\n  }\n})',
    },
    {
      title: 'Consumer Group',
      color: '#FB923C',
      emoji: '👥',
      simple: 'Ek team of consumers jo milke kaam karte hain.',
      detail: 'Consumer group ek unique group-id share karte hain. Kafka automatically partitions distribute karta hai group members mein. Agar ek consumer fail ho jaaye — uske partitions dusre members ko assign ho jaate hain (rebalancing).',
      example: 'Group: "analytics-consumers"\n  Consumer-1 → Partition-0, Partition-1\n  Consumer-2 → Partition-2\n\nRule: ek partition sirf ek consumer ko\nNote: consumers > partitions = kuch idle rahenge',
    },
    {
      title: 'Lag',
      color: '#F472B6',
      emoji: '⏱',
      simple: 'Kitne messages abhi tak nahi padhe gaye — backlog.',
      detail: 'Lag = Latest Offset − Consumer Offset. Agar producer fast hai aur consumer slow — lag badhta jaata hai. High lag = consumer overwhelmed hai. Alert lagao jab lag ek threshold cross kare.',
      example: 'Partition-0:\n  Latest offset:   100\n  Consumer offset:  85\n  Lag:              15  ← 15 messages unread\n\nLag = 0 → consumer up-to-date ✓\nLag > threshold → alert! consumer slow 🔴',
    },
    {
      title: 'Rebalancing',
      color: '#7C5CFF',
      emoji: '🔀',
      simple: 'Jab consumers badte/ghate hain toh partitions redistribute hote hain.',
      detail: 'Jab consumer group mein koi consumer join kare ya leave kare — Kafka saare partitions redistribute karta hai. Is process ko rebalancing kehte hain. Rebalancing ke dauran briefly consumption ruk jaata hai. Modern Kafka mein incremental cooperative rebalancing se ye better hua hai.',
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
