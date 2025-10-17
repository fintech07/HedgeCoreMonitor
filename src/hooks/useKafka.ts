import { useEffect, useRef, useState } from 'react';
import { KafkaConsumerService, type KafkaConfig } from '../services/kafkaConsumer';
import type { SymbolTick, PairTick } from '../types/kafka';
import { useDashboardStore } from '../stores/dashboardStore';

interface UseKafkaOptions extends KafkaConfig {
  topics: string[];
  autoConnect?: boolean;
}

export const useKafka = ({
  brokers,
  clientId,
  groupId,
  topics,
  autoConnect = true,
}: UseKafkaOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const consumerRef = useRef<KafkaConsumerService | null>(null);
  
  const updateMarketData = useDashboardStore((state) => state.updateMarketData);
  const addChartData = useDashboardStore((state) => state.addChartData);
  const setConnectionStatus = useDashboardStore((state) => state.setConnectionStatus);

  useEffect(() => {
    if (!autoConnect) return;

    const initKafka = async () => {
      try {
        // Initialize Kafka consumer
        const consumer = new KafkaConsumerService({
          brokers,
          clientId,
          groupId,
        });

        consumerRef.current = consumer;

        // Set up message handlers
        consumer.onSymbolTick((key: string, value: SymbolTick) => {
          console.log('📊 Received SymbolTick:', key, value);
          
          // Calculate mid price
          const midPrice = (Number(value.bid) + Number(value.ask)) / 2;
          
          // Update market data table
          updateMarketData(value.symbol, {
            symbol: value.symbol,
            price: midPrice,
            change: 0, // Calculate based on previous price if needed
            changePercent: 0,
            volume: Number(value.bidSize) + Number(value.askSize),
            timestamp: new Date(value.timestamp).getTime(),
          });

          // Add to chart data (use bid price for chart)
          addChartData({
            time: Math.floor(new Date(value.timestamp).getTime() / 1000),
            value: Number(value.bid),
          });
        });

        consumer.onPairTick((key: string, value: PairTick) => {
          console.log('📈 Received PairTick:', key, value);
          
          // Calculate mid price for pair
          const midPrice = (Number(value.bid) + Number(value.ask)) / 2;
          
          // Update market data table
          updateMarketData(value.pairSymbol, {
            symbol: value.pairSymbol,
            price: midPrice,
            change: 0,
            changePercent: 0,
            volume: Number(value.hedgeRate) * 1000000, // Use hedge rate as volume indicator
            timestamp: new Date(value.timestamp).getTime(),
          });

          // Add to chart data
          addChartData({
            time: Math.floor(new Date(value.timestamp).getTime() / 1000),
            value: Number(value.bid),
          });
        });

        // Connect to Kafka
        await consumer.connect();
        setIsConnected(true);
        setConnectionStatus(true);

        // Subscribe to topics
        await consumer.subscribe(topics);

        // Start consuming messages
        await consumer.startConsuming();
        
        console.log('✅ Kafka consumer started successfully');
      } catch (err) {
        console.error('❌ Kafka initialization error:', err);
        setError(err as Error);
        setIsConnected(false);
        setConnectionStatus(false);
      }
    };

    initKafka();

    // Cleanup on unmount
    return () => {
      if (consumerRef.current) {
        consumerRef.current.disconnect().catch(console.error);
      }
    };
  }, [autoConnect, brokers, clientId, groupId, topics, updateMarketData, addChartData, setConnectionStatus]);

  const reconnect = async () => {
    if (consumerRef.current) {
      try {
        await consumerRef.current.disconnect();
        await consumerRef.current.connect();
        await consumerRef.current.subscribe(topics);
        await consumerRef.current.startConsuming();
        setIsConnected(true);
        setConnectionStatus(true);
        setError(null);
      } catch (err) {
        setError(err as Error);
        setIsConnected(false);
        setConnectionStatus(false);
      }
    }
  };

  return {
    isConnected,
    error,
    reconnect,
  };
};
