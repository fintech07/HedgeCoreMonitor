import { memo } from 'react';
import { useDashboardStore, type MarketData } from '../stores/dashboardStore';

const MarketRow = memo(({ data }: { data: MarketData }) => {
  const isPositive = data.change >= 0;
  
  return (
    <div className="market-row">
      <span className="symbol">{data.symbol}</span>
      <span className="price">${data.price.toFixed(2)}</span>
      <span className={`change ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? '+' : ''}{data.change.toFixed(2)} ({data.changePercent.toFixed(2)}%)
      </span>
      <span className="volume">{(data.volume / 1000000).toFixed(2)}M</span>
    </div>
  );
});

MarketRow.displayName = 'MarketRow';

export const MarketDataTable = memo(() => {
  const marketData = useDashboardStore((state) => state.marketData);
  const setSelectedSymbol = useDashboardStore((state) => state.setSelectedSymbol);

  return (
    <div className="market-data-table">
      <div className="table-header">
        <span>Symbol</span>
        <span>Price</span>
        <span>Change</span>
        <span>Volume</span>
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
