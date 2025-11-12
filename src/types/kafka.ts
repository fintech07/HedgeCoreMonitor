// Kafka message types for prices.ticks topic
// Data format: Symbol, Timestamp, Bid, Ask

export interface SymbolTick {
  symbol: string;
  timestamp: string; // ISO 8601 string or timestamp
  bid: number;
  ask: number;
}

export interface KafkaMessage<T> {
  key: string; // Symbol name
  value: T;
  timestamp: number;
  partition: number;
  offset: string;
}
