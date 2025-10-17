import { useEffect, useRef, useCallback } from 'react';
import { useDashboardStore } from '../stores/dashboardStore';
import type { SymbolTick, PairTick } from '../types/kafka';

interface UseWebSocketOptions {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

interface KafkaMessage {
  topic: string;
  key: string;
  value: SymbolTick | PairTick;
}

export const useWebSocket = ({
  url,
  reconnectInterval = 3000,
  maxReconnectAttempts = 5,
}: UseWebSocketOptions) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const setConnectionStatus = useDashboardStore((state) => state.setConnectionStatus);
  const updateMarketData = useDashboardStore((state) => state.updateMarketData);
  const addChartData = useDashboardStore((state) => state.addChartData);

  const connect = useCallback(() => {
    try {
      console.log('🔌 Connecting to WebSocket:', url);
      wsRef.current = new WebSocket(url);
      
      wsRef.current.onopen = () => {
        console.log('✅ WebSocket connected');
        setConnectionStatus(true);
        reconnectAttemptsRef.current = 0;
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: KafkaMessage = JSON.parse(event.data);
          
          // Handle SymbolTick messages
          if (message.topic === 'prices.tick') {
            const tick = message.value as SymbolTick;
            const midPrice = (Number(tick.bid) + Number(tick.ask)) / 2;
            
            console.log('📊 SymbolTick:', tick.symbol, midPrice);
            
            updateMarketData(tick.symbol, {
              symbol: tick.symbol,
              price: midPrice,
              change: 0, // Calculate based on previous price if needed
              changePercent: 0,
              volume: Number(tick.bidSize) + Number(tick.askSize),
              timestamp: new Date(tick.timestamp).getTime(),
            });

            addChartData({
              time: Math.floor(new Date(tick.timestamp).getTime() / 1000),
              value: Number(tick.bid),
            });
          }
          
          // Handle PairTick messages
          else if (message.topic === 'prices.pair') {
            const pair = message.value as PairTick;
            const midPrice = (Number(pair.bid) + Number(pair.ask)) / 2;
            
            console.log('📈 PairTick:', pair.pairSymbol, midPrice);
            
            updateMarketData(pair.pairSymbol, {
              symbol: pair.pairSymbol,
              price: midPrice,
              change: 0,
              changePercent: 0,
              volume: Number(pair.hedgeRate) * 1000000,
              timestamp: new Date(pair.timestamp).getTime(),
            });

            addChartData({
              time: Math.floor(new Date(pair.timestamp).getTime() / 1000),
              value: Number(pair.bid),
            });
          }
        } catch (error) {
          console.error('❌ Error processing WebSocket message:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setConnectionStatus(false);
      };

      wsRef.current.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        setConnectionStatus(false);
        
        // Attempt reconnection
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            console.log(`🔄 Reconnecting... Attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts}`);
            connect();
          }, reconnectInterval);
        } else {
          console.error('❌ Max reconnection attempts reached');
        }
      };
    } catch (error) {
      console.error('❌ Failed to connect WebSocket:', error);
      setConnectionStatus(false);
    }
  }, [url, reconnectInterval, maxReconnectAttempts, setConnectionStatus, updateMarketData, addChartData]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setConnectionStatus(false);
  }, [setConnectionStatus]);

  const sendMessage = useCallback((message: unknown) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return { sendMessage, disconnect, reconnect: connect };
};
