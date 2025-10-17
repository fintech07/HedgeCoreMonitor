import { useEffect, useRef, useCallback } from 'react';
import { useDashboardStore } from '../stores/dashboardStore';

interface UseWebSocketOptions {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export const useWebSocket = ({
  url,
  reconnectInterval = 3000,
  maxReconnectAttempts = 5,
}: UseWebSocketOptions) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const setConnectionStatus = useDashboardStore((state) => state.setConnectionStatus);

  const connect = useCallback(() => {
    try {
      // For demo purposes, we'll simulate WebSocket connection
      console.log('WebSocket connection simulated for:', url);
      setConnectionStatus(true);
      
      // In production, use real WebSocket:
      // const reconnectAttempts = 0;
      // wsRef.current = new WebSocket(url);
      
      // wsRef.current.onopen = () => {
      //   console.log('WebSocket connected');
      //   setConnectionStatus(true);
      //   reconnectAttemptsRef.current = 0;
      // };

      // wsRef.current.onmessage = (event) => {
      //   const data = JSON.parse(event.data);
      //   // Process incoming data
      // };

      // wsRef.current.onerror = (error) => {
      //   console.error('WebSocket error:', error);
      // };

      // wsRef.current.onclose = () => {
      //   console.log('WebSocket disconnected');
      //   setConnectionStatus(false);
      //   
      //   if (reconnectAttemptsRef.current < maxReconnectAttempts) {
      //     reconnectTimeoutRef.current = setTimeout(() => {
      //       reconnectAttemptsRef.current++;
      //       connect();
      //     }, reconnectInterval);
      //   }
      // };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      setConnectionStatus(false);
    }
  }, [url, reconnectInterval, maxReconnectAttempts, setConnectionStatus]);

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

  const sendMessage = useCallback((message: any) => {
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
