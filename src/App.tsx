import { useDashboardStore } from './stores/dashboardStore';
import { useWebSocket } from './hooks/useWebSocket';
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';
import { OHLCChart } from './components/OHLCChart';
import { MultiChartGrid } from './components/MultiChartGrid';
import { MarketDataTable } from './components/MarketDataTable';
import { ConnectionStatus } from './components/ConnectionStatus';
import { useState } from 'react';
import './App.css';

function App() {
  const selectedSymbol = useDashboardStore((state) => state.selectedSymbol);
  const [viewMode, setViewMode] = useState<'single' | 'multi'>('single');
  
  console.log('App rendering, selectedSymbol:', selectedSymbol);
  
  // Connect to WebSocket proxy for Kafka messages
  // Update the URL to point to your backend WebSocket server
  useWebSocket({ 
    url: 'ws://localhost:8080', // Your WebSocket proxy URL
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
  });
  
  // Monitor performance
  usePerformanceMonitor();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Real-Time Trading Dashboard - Tick Prices</h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* View mode toggle */}
          <div style={{
            display: 'flex',
            background: '#2A2E39',
            borderRadius: '4px',
            padding: '2px',
            border: '1px solid #363A45',
          }}>
            <button
              onClick={() => setViewMode('single')}
              style={{
                background: viewMode === 'single' ? '#2962FF' : 'transparent',
                color: viewMode === 'single' ? '#FFFFFF' : '#787B86',
                border: 'none',
                borderRadius: '3px',
                padding: '5px 12px',
                fontSize: '11px',
                cursor: 'pointer',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontWeight: 500,
                transition: 'all 0.2s',
              }}
            >
              📊 Single Chart
            </button>
            <button
              onClick={() => setViewMode('multi')}
              style={{
                background: viewMode === 'multi' ? '#2962FF' : 'transparent',
                color: viewMode === 'multi' ? '#FFFFFF' : '#787B86',
                border: 'none',
                borderRadius: '3px',
                padding: '5px 12px',
                fontSize: '11px',
                cursor: 'pointer',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontWeight: 500,
                transition: 'all 0.2s',
              }}
            >
              📈 Multi Charts
            </button>
          </div>
          <ConnectionStatus />
        </div>
      </header>
      
      <div className="dashboard-grid">
        <div className="chart-section">
          <h2>
            {viewMode === 'single' 
              ? (selectedSymbol || 'OHLC Bars Chart')
              : 'All Symbols - 1m Charts'
            }
          </h2>
          {viewMode === 'single' ? (
            <OHLCChart />
          ) : (
            <MultiChartGrid />
          )}
        </div>
        
        <div className="data-section">
          <h2>Live Tick Data</h2>
          <MarketDataTable />
        </div>
      </div>
      
      <footer className="dashboard-footer">
        <p>Built with React 19 + Vite + TypeScript + Zustand + Lightweight Charts</p>
      </footer>
    </div>
  );
}

export default App;
