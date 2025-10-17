import { create } from 'zustand';

export interface IndicatorSettings {
  // Moving Averages
  sma: {
    enabled: boolean;
    periods: number[];
    colors: string[];
  };
  ema: {
    enabled: boolean;
    periods: number[];
    colors: string[];
  };
  // Bollinger Bands
  bollingerBands: {
    enabled: boolean;
    period: number;
    stdDev: number;
    upperColor: string;
    middleColor: string;
    lowerColor: string;
    fillOpacity: number;
  };
  // TRIX
  trix: {
    enabled: boolean;
    period: number;
    color: string;
    showInSeparatePane: boolean;
  };
  // RSI
  rsi: {
    enabled: boolean;
    period: number;
    color: string;
    showInSeparatePane: boolean;
  };
}

interface IndicatorStore {
  settings: IndicatorSettings;
  updateIndicator: <K extends keyof IndicatorSettings>(
    indicator: K,
    updates: Partial<IndicatorSettings[K]>
  ) => void;
  toggleIndicator: (indicator: keyof IndicatorSettings) => void;
}

const defaultSettings: IndicatorSettings = {
  sma: {
    enabled: false,
    periods: [20, 50],
    colors: ['#2962FF', '#FF6D00'],
  },
  ema: {
    enabled: false,
    periods: [12, 26],
    colors: ['#00E676', '#F50057'],
  },
  bollingerBands: {
    enabled: false,
    period: 20,
    stdDev: 2,
    upperColor: '#2962FF',
    middleColor: '#2962FF',
    lowerColor: '#2962FF',
    fillOpacity: 0.1,
  },
  trix: {
    enabled: false,
    period: 14,
    color: '#00E676',
    showInSeparatePane: false,
  },
  rsi: {
    enabled: false,
    period: 14,
    color: '#9C27B0',
    showInSeparatePane: false,
  },
};

export const useIndicatorStore = create<IndicatorStore>((set) => ({
  settings: defaultSettings,
  
  updateIndicator: (indicator, updates) =>
    set((state) => ({
      settings: {
        ...state.settings,
        [indicator]: {
          ...state.settings[indicator],
          ...updates,
        },
      },
    })),
  
  toggleIndicator: (indicator) =>
    set((state) => ({
      settings: {
        ...state.settings,
        [indicator]: {
          ...state.settings[indicator],
          enabled: !state.settings[indicator].enabled,
        },
      },
    })),
}));
