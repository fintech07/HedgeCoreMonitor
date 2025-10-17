import { memo } from 'react';
import { useDashboardStore, type MarketData } from '../stores/dashboardStore';

const MarketRow = memo(({ data }: { data: MarketData }) => {
  const timeAgo = Date.now() - data.timestamp;
  const secondsAgo = Math.floor(timeAgo / 1000);
  
  return (
    <div className="market-row">
      <span className="symbol" style={{ fontWeight: 'bold' }}>{data.symbol}</span>
      <span className="bid" style={{ color: '#f44336', fontWeight: 'bold' }}>{data.bid?.toFixed(4) || '-'}</span>
      <span className="ask" style={{ color: '#4caf50', fontWeight: 'bold' }}>{data.ask?.toFixed(4) || '-'}</span>
      <span className="time" style={{ fontSize: '0.9em', opacity: 0.7 }}>
        {secondsAgo < 60 ? `${secondsAgo}s ago` : `${Math.floor(secondsAgo / 60)}m ago`}
      </span>
    </div>
  );
});

MarketRow.displayName = 'MarketRow';

export const MarketDataTable = memo(() => {
  const marketData = useDashboardStore((state) => state.marketData);
  const setSelectedSymbol = useDashboardStore((state) => state.setSelectedSymbol);

  if (marketData.length === 0) {
    return (
      <div className="market-data-table">
        <div className="table-header">
          <span>Symbol</span>
          <span style={{ color: '#f44336' }}>Bid</span>
          <span style={{ color: '#4caf50' }}>Ask</span>
          <span>Updated</span>
        </div>
        <div style={{ 
          padding: '40px', 
          textAlign: 'center', 
          color: '#888',
          fontSize: '14px' 
        }}>
          Waiting for market data...
        </div>
      </div>
    );
  }

  return (
    <div className="market-data-table">
      <div className="table-header">
        <span>Symbol</span>
        <span style={{ color: '#f44336' }}>Bid</span>
        <span style={{ color: '#4caf50' }}>Ask</span>
        <span>Updated</span>
      </div>
      <div className="table-body" style={{ maxHeight: '400px', overflow: 'auto' }}>
        {marketData.map((data) => (
          <div
            key={data.symbol}
            onClick={() => setSelectedSymbol(data.symbol)}
            style={{ cursor: 'pointer' }}
          >
            <MarketRow data={data} />
          </div>
        ))}
      </div>
    </div>
  );
});

MarketDataTable.displayName = 'MarketDataTable';
