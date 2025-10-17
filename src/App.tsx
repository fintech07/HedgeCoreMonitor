import { useEffect } from 'react';
import { useDashboardStore } from './stores/dashboardStore';
import { useWebSocket } from './hooks/useWebSocket';
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';
import { TradingChart } from './components/TradingChartSimple';
import { MarketDataTable } from './components/MarketDataTable';
import { ConnectionStatus } from './components/ConnectionStatus';
import './App.css';

// Demo data generator
const generateMockData = () => {
  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'AMD'];
  return symbols.map((symbol) => ({
    symbol,
    price: Math.random() * 500 + 100,
    change: (Math.random() - 0.5) * 20,
    changePercent: (Math.random() - 0.5) * 5,
    volume: Math.random() * 10000000,
    timestamp: Date.now(),
  }));
};

function App() {
  const setMarketData = useDashboardStore((state) => state.setMarketData);
  const addChartData = useDashboardStore((state) => state.addChartData);
  const selectedSymbol = useDashboardStore((state) => state.selectedSymbol);
  
  // Initialize WebSocket (simulated for demo)
  useWebSocket({ url: 'wss://your-websocket-server.com' });
  
  // Monitor performance
  usePerformanceMonitor();

  // Initialize with mock data
  useEffect(() => {
    setMarketData(generateMockData());
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMarketData(generateMockData());
      
      // Add chart data point
      addChartData({
        time: Math.floor(Date.now() / 1000),
        value: Math.random() * 200 + 100,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [setMarketData, addChartData]);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Real-Time Trading Dashboard</h1>
        <ConnectionStatus />
      </header>
      
      <div className="dashboard-grid">
        <div className="chart-section">
          <h2>{selectedSymbol || 'Market Overview'}</h2>
          <TradingChart />
        </div>
        
        <div className="data-section">
          <h2>Market Data</h2>
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
