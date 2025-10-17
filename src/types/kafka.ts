// Kafka message types matching C# DTOs

export interface SymbolTick {
  symbol: string;
  bid: number;
  ask: number;
  bidSize: number;
  askSize: number;
  timestamp: string; // ISO 8601 string from C# DateTime
}

export interface PairTick {
  pairSymbol: string; // e.g., "BTC/ETH"
  baseSymbol: string;
  quoteSymbol: string;
  hedgeRate: number;
  bid: number;
  ask: number;
  timestamp: string; // ISO 8601 string from C# DateTime
}

export interface KafkaMessage<T> {
  key: string; // Symbol name
  value: T;
  timestamp: number;
  partition: number;
  offset: string;
}
