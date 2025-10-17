// Kafka Configuration
// Update these values based on your Kafka server setup

export const KAFKA_CONFIG = {
  // Kafka broker addresses
  brokers: ['localhost:9092'], // Update with your Kafka broker addresses
  
  // Client configuration
  clientId: 'trading-dashboard-viewer',
  groupId: 'trading-dashboard-consumer-group',
  
  // Topics to subscribe to
  topics: [
    'prices.tick',    // Symbol tick data
    'prices.pair',    // Pair tick data
  ],
  
  // Connection settings
  autoConnect: true,
};

// Environment-based configuration
export const getKafkaConfig = () => {
  // You can override with environment variables
  const brokers = import.meta.env.VITE_KAFKA_BROKERS?.split(',') || KAFKA_CONFIG.brokers;
  const clientId = import.meta.env.VITE_KAFKA_CLIENT_ID || KAFKA_CONFIG.clientId;
  const groupId = import.meta.env.VITE_KAFKA_GROUP_ID || KAFKA_CONFIG.groupId;
  
  return {
    ...KAFKA_CONFIG,
    brokers,
    clientId,
    groupId,
  };
};
