# WebSocket Proxy Server for Kafka

This is a simple Node.js server that connects to Kafka and forwards messages to browser clients via WebSocket.

## Setup

1. **Install dependencies:**
```bash
cd server
npm install
```

2. **Configure Kafka:**
Edit `server.js` and update the Kafka broker addresses.

3. **Start the server:**
```bash
npm start
```

The WebSocket server will listen on `ws://localhost:8080`

## How it works

```
Kafka Broker → Node.js Server (KafkaJS) → WebSocket → Browser Dashboard
```

1. The server connects to Kafka using KafkaJS
2. Subscribes to `prices.tick` and `prices.pair` topics
3. Forwards all messages to connected WebSocket clients
4. The browser dashboard receives and displays the data in real-time

## Testing

You can test the WebSocket connection using:

```javascript
const ws = new WebSocket('ws://localhost:8080');
ws.onmessage = (event) => {
  console.log('Received:', JSON.parse(event.data));
};
```
