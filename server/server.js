import { Kafka } from 'kafkajs';
import { WebSocketServer } from 'ws';

// Configuration
const KAFKA_BROKERS = ['127.0.0.1:9092']; // Update with your Kafka broker
const KAFKA_GROUP_ID = 'websocket-proxy-group';
const KAFKA_TOPICS = ['prices.ticks', 'prices.pairs'];
const WEBSOCKET_PORT = 8080;

console.log('🚀 Starting Kafka WebSocket Proxy Server...');

// Initialize Kafka
const kafka = new Kafka({
  clientId: 'kafka-websocket-proxy',
  brokers: KAFKA_BROKERS,
  retry: {
    retries: 5,
    initialRetryTime: 300,
  },
});

const consumer = kafka.consumer({ 
  groupId: KAFKA_GROUP_ID,
  sessionTimeout: 30000,
});

// Initialize WebSocket Server
const wss = new WebSocketServer({ port: WEBSOCKET_PORT });

console.log(`📡 WebSocket server listening on ws://localhost:${WEBSOCKET_PORT}`);

// Track connected clients
let clientCount = 0;

wss.on('connection', (ws) => {
  clientCount++;
  //console.log(`✅ Client connected. Total clients: ${clientCount}`);

  ws.on('close', () => {
    clientCount--;
    //console.log(`🔌 Client disconnected. Total clients: ${clientCount}`);
  });

  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connection',
    message: 'Connected to Kafka WebSocket Proxy',
    timestamp: new Date().toISOString(),
  }));
});

// Broadcast to all connected clients
const broadcast = (data) => {
  const message = JSON.stringify(data);
  let sentCount = 0;

  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(message);
      sentCount++;
    }
  });

  return sentCount;
};

// Connect to Kafka and start consuming
async function startKafkaConsumer() {
  try {
    console.log('🔌 Connecting to Kafka...');
    await consumer.connect();
    console.log('✅ Connected to Kafka');

    console.log(`📥 Subscribing to topics: ${KAFKA_TOPICS.join(', ')}`);
    await consumer.subscribe({ 
      topics: KAFKA_TOPICS, 
      fromBeginning: false // Start from latest messages
    });
    console.log('✅ Subscribed to topics');

    console.log('🎧 Starting to consume messages...');
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const key = message.key?.toString() || '';
          const value = message.value?.toString();

          if (!value) return;

          const parsedValue = JSON.parse(value);
          const timestamp = message.timestamp;

          // Prepare message for WebSocket clients
          const wsMessage = {
            topic,
            key,
            value: parsedValue,
            partition,
            offset: message.offset,
            timestamp: Number(timestamp),
          };

          // Broadcast to all connected clients
          const sentCount = broadcast(wsMessage);
          
          if (sentCount > 0) {
            //console.log(`📤 [${topic}] ${key} → ${sentCount} client(s)`);
          }
        } catch (error) {
          console.error('❌ Error processing Kafka message:', error);
        }
      },
    });
  } catch (error) {
    console.error('❌ Kafka consumer error:', error);
    process.exit(1);
  }
}

// Graceful shutdown
const shutdown = async () => {
  console.log('\n🛑 Shutting down...');
  
  try {
    await consumer.disconnect();
    console.log('✅ Kafka consumer disconnected');
    
    wss.close(() => {
      console.log('✅ WebSocket server closed');
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start the consumer
startKafkaConsumer().catch((error) => {
  console.error('❌ Failed to start Kafka consumer:', error);
  process.exit(1);
});
