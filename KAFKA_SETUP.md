# Important: Kafka Integration Architecture

## ⚠️ Browser Limitation

KafkaJS is a Node.js library and **cannot run directly in the browser**. The build warnings show that Node.js modules like `net`, `tls`, `crypto`, etc., have been externalized.

## 🔧 Solution: WebSocket Proxy Server

To consume Kafka messages in the browser, you need a **backend proxy server** that:

1. Connects to Kafka using KafkaJS
2. Consumes messages from Kafka topics
3. Forwards messages to the browser via WebSocket

## 📋 Implementation Options

### Option 1: Node.js WebSocket Proxy (Recommended)

Create a simple Node.js server:

```typescript
// server/kafka-proxy.ts
import { Kafka } from 'kafkajs';
import WebSocket from 'ws';

const kafka = new Kafka({
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'dashboard-proxy' });
const wss = new WebSocket.Server({ port: 8080 });

// Broadcast to all connected clients
const broadcast = (data: any) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// Connect and consume
await consumer.connect();
await consumer.subscribe({ topics: ['prices.tick', 'prices.pair'] });

await consumer.run({
  eachMessage: async ({ topic, message }) => {
    const key = message.key?.toString();
    const value = JSON.parse(message.value?.toString() || '{}');
    broadcast({ topic, key, value });
  },
});
```

### Option 2: Use Server-Sent Events (SSE)

Create an HTTP endpoint that streams Kafka messages:

```typescript
// server/sse-proxy.ts
app.get('/api/market-data', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  consumer.run({
    eachMessage: async ({ topic, message }) => {
      const data = {
        topic,
        key: message.key?.toString(),
        value: JSON.parse(message.value?.toString() || '{}'),
      };
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    },
  });
});
```

### Option 3: Use Your C# Backend

Since you're already publishing to Kafka from C#, add a SignalR or WebSocket endpoint:

```csharp
// C# WebSocket endpoint
public class MarketDataHub : Hub
{
    public async Task Subscribe(string[] symbols)
    {
        // Consumer already running
        // Just broadcast to connected clients
    }
}
```

## 🚀 Quick Start for Browser

For now, the dashboard includes the Kafka consumer code, but it will fail in the browser. 

**To make it work:**

1. Remove the direct Kafka integration from the browser
2. Use WebSocket connection to your backend proxy
3. Update `src/hooks/useWebSocket.ts` to connect to your proxy

## 📝 Next Steps

1. Choose one of the proxy solutions above
2. Update WebSocket URL in the dashboard
3. The dashboard will receive Kafka messages through the proxy

Would you like me to:
- Create a Node.js proxy server template?
- Update the dashboard to use WebSocket instead?
- Create a C# SignalR integration example?
