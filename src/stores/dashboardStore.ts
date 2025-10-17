import { create } from 'zustand';

export interface MarketData {
  symbol: string;
  price: number; // mid price
  bid?: number;
  ask?: number;
  bidSize?: number;
  askSize?: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: number;
}

export interface ChartData {
  time: number;
  value: number;
}

export interface OHLCData {
  time: number; // Unix timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
}

interface DashboardState {
  // Market data
  marketData: MarketData[];
  selectedSymbol: string | null;
  chartDataBySymbol: Record<string, ChartData[]>; // Chart data per symbol
  ohlcDataBySymbol: Record<string, OHLCData[]>; // OHLC data per symbol
  
  // WebSocket connection status
  isConnected: boolean;
  
  // Actions
  setMarketData: (data: MarketData[]) => void;
  updateMarketData: (symbol: string, data: Partial<MarketData>) => void;
  setSelectedSymbol: (symbol: string | null) => void;
  addChartData: (symbol: string, data: ChartData) => void;
  addTickToOHLC: (symbol: string, price: number, timestamp: number) => void;
  setConnectionStatus: (status: boolean) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  marketData: [],
  selectedSymbol: null,
  chartDataBySymbol: {},
  ohlcDataBySymbol: {},
  isConnected: false,

  setMarketData: (data) => set({ marketData: data }),
  
  updateMarketData: (symbol, data) =>
    set((state) => {
      const existingIndex = state.marketData.findIndex((item) => item.symbol === symbol);
      
      if (existingIndex >= 0) {
        // Update existing symbol
        const updatedData = state.marketData.map((item) =>
          item.symbol === symbol ? { ...item, ...data } : item
        );
        return { marketData: updatedData };
      } else {
        // Add new symbol
        return { marketData: [...state.marketData, { symbol, ...data } as MarketData] };
      }
    }),
  
  setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),
  
  addChartData: (symbol, data) =>
    set((state) => {
      const existingData = state.chartDataBySymbol[symbol] || [];
      return {
        chartDataBySymbol: {
          ...state.chartDataBySymbol,
          [symbol]: [...existingData.slice(-999), data], // Keep last 1000 points per symbol
        },
      };
    }),
  
  addTickToOHLC: (symbol, price, timestamp) =>
    set((state) => {
      const existingBars = state.ohlcDataBySymbol[symbol] || [];
      const timeInSeconds = Math.floor(timestamp / 1000);
      
      // Use 1-minute bars (60 seconds)
      // Round down to the nearest minute
      const barTime = Math.floor(timeInSeconds / 60) * 60;
      
      // Find or create the current bar
      const lastBar = existingBars[existingBars.length - 1];
      
      if (lastBar && lastBar.time === barTime) {
        // Update existing bar
        const updatedBar = {
          ...lastBar,
          high: Math.max(lastBar.high, price),
          low: Math.min(lastBar.low, price),
          close: price,
        };
        
        return {
          ohlcDataBySymbol: {
            ...state.ohlcDataBySymbol,
            [symbol]: [...existingBars.slice(0, -1), updatedBar].slice(-1000), // Keep last 1000 bars
          },
        };
      } else {
        // Create new bar
        const newBar: OHLCData = {
          time: barTime,
          open: price,
          high: price,
          low: price,
          close: price,
        };
        
        return {
          ohlcDataBySymbol: {
            ...state.ohlcDataBySymbol,
            [symbol]: [...existingBars, newBar].slice(-1000), // Keep last 1000 bars
          },
        };
      }
    }),
  
  setConnectionStatus: (status) => set({ isConnected: status }),
}));
