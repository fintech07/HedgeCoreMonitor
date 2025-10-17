import { useDashboardStore } from './stores/dashboardStore';
import { useWebSocket } from './hooks/useWebSocket';
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';
import { OHLCChart } from './components/OHLCChart';
import { MarketDataTable } from './components/MarketDataTable';
import { ConnectionStatus } from './components/ConnectionStatus';
import './App.css';

function App() {
  const selectedSymbol = useDashboardStore((state) => state.selectedSymbol);
  
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
        <ConnectionStatus />
      </header>
      
      <div className="dashboard-grid">
        <div className="chart-section">
          <h2>{selectedSymbol || 'OHLC Bars Chart'}</h2>
          <OHLCChart />
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
