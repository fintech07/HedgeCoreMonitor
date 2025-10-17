import { Kafka, type Consumer, type EachMessagePayload } from 'kafkajs';
import type { SymbolTick, PairTick } from '../types/kafka';

export interface KafkaConfig {
  brokers: string[]; // e.g., ['localhost:9092']
  clientId?: string;
  groupId: string;
}

export type MessageHandler<T> = (key: string, value: T, timestamp: number) => void;

export class KafkaConsumerService {
  private kafka: Kafka;
  private consumer: Consumer | null = null;
  private isConnected = false;
  private symbolTickHandler: MessageHandler<SymbolTick> | null = null;
  private pairTickHandler: MessageHandler<PairTick> | null = null;

  constructor(config: KafkaConfig) {
    this.kafka = new Kafka({
      clientId: config.clientId || 'trading-dashboard',
      brokers: config.brokers,
      retry: {
        retries: 5,
        initialRetryTime: 300,
      },
    });

    this.consumer = this.kafka.consumer({
      groupId: config.groupId,
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
    });
  }

  async connect(): Promise<void> {
    if (this.isConnected || !this.consumer) return;

    try {
      await this.consumer.connect();
      this.isConnected = true;
      console.log('✅ Kafka consumer connected');
    } catch (error) {
      console.error('❌ Failed to connect to Kafka:', error);
      throw error;
    }
  }

  async subscribe(topics: string[]): Promise<void> {
    if (!this.consumer) throw new Error('Consumer not initialized');

    for (const topic of topics) {
      await this.consumer.subscribe({ topic, fromBeginning: false });
      console.log(`📡 Subscribed to topic: ${topic}`);
    }
  }

  onSymbolTick(handler: MessageHandler<SymbolTick>): void {
    this.symbolTickHandler = handler;
  }

  onPairTick(handler: MessageHandler<PairTick>): void {
    this.pairTickHandler = handler;
  }

  async startConsuming(): Promise<void> {
    if (!this.consumer) throw new Error('Consumer not initialized');

    await this.consumer.run({
      eachMessage: async ({ topic, message }: EachMessagePayload) => {
        try {
          const key = message.key?.toString() || '';
          const valueStr = message.value?.toString();
          
          if (!valueStr) return;

          const timestamp = Number(message.timestamp);

          // Route message to appropriate handler based on topic
          if (topic === 'prices.tick' && this.symbolTickHandler) {
            const value: SymbolTick = JSON.parse(valueStr);
            this.symbolTickHandler(key, value, timestamp);
          } else if (topic === 'prices.pair' && this.pairTickHandler) {
            const value: PairTick = JSON.parse(valueStr);
            this.pairTickHandler(key, value, timestamp);
          }
        } catch (error) {
          console.error('❌ Error processing Kafka message:', error);
        }
      },
    });
  }

  async disconnect(): Promise<void> {
    if (!this.consumer) return;

    try {
      await this.consumer.disconnect();
      this.isConnected = false;
      console.log('🔌 Kafka consumer disconnected');
    } catch (error) {
      console.error('❌ Error disconnecting from Kafka:', error);
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}
