# Kafka Visualizer

An interactive playground to understand Apache Kafka — topics, partitions, producers, consumers, consumer groups, offsets, and lag — in real-time.

**Live Demo:** https://aakashporwal1602.github.io/kafka-visualizer

---

## What you can do

- **Produce messages** — send to specific partitions or round-robin
- **Consume messages** — watch consumers commit offsets in real-time
- **See consumer lag** — live lag tracking per partition
- **Try scenarios** — Consumer Lag, Rebalancing, Producer Burst
- **Adjust partitions & consumers** — see rebalancing happen live
- **Learn concepts** — Topic, Partition, Offset, Consumer Group, Lag, Rebalancing
- **Glossary** — 30 essential Kafka terms

---

## Getting Started

```bash
git clone https://github.com/aakashporwal1602/kafka-visualizer.git
cd kafka-visualizer
npm install
npm start
```

**Deploy to GitHub Pages:**
```bash
npm run deploy
```

---

## Built from real production experience

At Tata Digital, I processed **300M+ events/day** through Kafka (JARVIS platform), migrated **~1.5B events** from JSON to Avro with Confluent Schema Registry, and designed streaming ingestion pipelines on Databricks consuming Kafka topics.

This visualizer was built to teach the concepts I use daily.

---

Built by [Aakash Porwal](https://aakashporwal1602.github.io/aakash-porwal-portfolio) — Senior Software Engineer, Distributed Systems & Real-Time Data Platforms.
