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

interface DashboardState {
  // Market data
  marketData: MarketData[];
  selectedSymbol: string | null;
  chartDataBySymbol: Record<string, ChartData[]>; // Chart data per symbol
  
  // WebSocket connection status
  isConnected: boolean;
  
  // Actions
  setMarketData: (data: MarketData[]) => void;
  updateMarketData: (symbol: string, data: Partial<MarketData>) => void;
  setSelectedSymbol: (symbol: string | null) => void;
  addChartData: (symbol: string, data: ChartData) => void;
  setConnectionStatus: (status: boolean) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  marketData: [],
  selectedSymbol: null,
  chartDataBySymbol: {},
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
  
  setConnectionStatus: (status) => set({ isConnected: status }),
}));
