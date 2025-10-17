import { create } from 'zustand';

export interface MarketData {
  symbol: string;
  price: number;
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
  chartData: ChartData[];
  
  // WebSocket connection status
  isConnected: boolean;
  
  // Actions
  setMarketData: (data: MarketData[]) => void;
  updateMarketData: (symbol: string, data: Partial<MarketData>) => void;
  setSelectedSymbol: (symbol: string | null) => void;
  addChartData: (data: ChartData) => void;
  setChartData: (data: ChartData[]) => void;
  setConnectionStatus: (status: boolean) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  marketData: [],
  selectedSymbol: null,
  chartData: [],
  isConnected: false,

  setMarketData: (data) => set({ marketData: data }),
  
  updateMarketData: (symbol, data) =>
    set((state) => ({
      marketData: state.marketData.map((item) =>
        item.symbol === symbol ? { ...item, ...data } : item
      ),
    })),
  
  setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),
  
  addChartData: (data) =>
    set((state) => ({
      chartData: [...state.chartData.slice(-999), data], // Keep last 1000 points
    })),
  
  setChartData: (data) => set({ chartData: data }),
  
  setConnectionStatus: (status) => set({ isConnected: status }),
}));
