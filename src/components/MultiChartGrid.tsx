import { memo } from 'react';
import { useDashboardStore } from '../stores/dashboardStore';

export const MultiChartGrid = memo(() => {
  const marketData = useDashboardStore((state) => state.marketData);
  const ohlcDataBySymbol = useDashboardStore((state) => state.ohlcDataBySymbol);
  
  // Get all symbols that have OHLC data
  const symbolsWithData = marketData
    .filter(item => ohlcDataBySymbol[item.symbol]?.length > 0)
    .map(item => item.symbol);

  if (symbolsWithData.length === 0) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '400px',
        color: '#787B86',
        fontSize: '14px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        Waiting for symbol data...
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      width: '100%',
    }}>
      {symbolsWithData.map(symbol => (
        <div
          key={symbol}
          style={{
            background: '#131722',
            borderRadius: '6px',
            border: '1px solid #2A2E39',
            padding: '8px',
          }}
        >
          {/* Symbol header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
            paddingLeft: '8px',
          }}>
            <span style={{
              color: '#D1D4DC',
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}>
              {symbol}
            </span>
            <span style={{
              color: '#787B86',
              fontSize: '10px',
              fontFamily: 'monospace',
            }}>
              1m | {ohlcDataBySymbol[symbol]?.length || 0} bars
            </span>
          </div>
          
          {/* Mini chart */}
          <MiniOHLCChart symbol={symbol} />
        </div>
      ))}
    </div>
  );
});

MultiChartGrid.displayName = 'MultiChartGrid';

// Mini chart component for grid view
interface MiniOHLCChartProps {
  symbol: string;
}

const MiniOHLCChart = memo(({ symbol }: MiniOHLCChartProps) => {
  const ohlcDataBySymbol = useDashboardStore((state) => state.ohlcDataBySymbol);
  const setSelectedSymbol = useDashboardStore((state) => state.setSelectedSymbol);
  
  const ohlcData = ohlcDataBySymbol[symbol] || [];
  
  // Show last 50 bars
  const visibleBars = ohlcData.slice(-50);
  
  if (visibleBars.length === 0) {
    return (
      <div style={{
        height: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#787B86',
        fontSize: '11px',
      }}>
        No data
      </div>
    );
  }

  // Calculate price range
  const allPrices = visibleBars.flatMap(bar => [bar.high, bar.low]);
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const priceRange = maxPrice - minPrice || 1;
  const pricePadding = priceRange * 0.05;
  const minPriceWithPadding = minPrice - pricePadding;
  const maxPriceWithPadding = maxPrice + pricePadding;
  const adjustedPriceRange = maxPriceWithPadding - minPriceWithPadding;

  const chartHeight = 130;
  const barWidth = Math.max(2, (100 / visibleBars.length) * 0.7);
  const barSpacing = 100 / visibleBars.length;

  const priceToPercent = (price: number) => {
    return ((price - minPriceWithPadding) / adjustedPriceRange) * 100;
  };

  const latestBar = visibleBars[visibleBars.length - 1];
  const isLatestUp = latestBar.close >= latestBar.open;

  return (
    <div
      onClick={() => setSelectedSymbol(symbol)}
      style={{
        position: 'relative',
        width: '100%',
        height: '150px',
        cursor: 'pointer',
        transition: 'transform 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* SVG Chart */}
      <svg width="100%" height={chartHeight} style={{ display: 'block' }}>
        {/* Background */}
        <rect width="100%" height="100%" fill="#131722" />
        
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line
            key={y}
            x1="0"
            y1={`${y}%`}
            x2="100%"
            y2={`${y}%`}
            stroke="#2A2E39"
            strokeWidth="1"
          />
        ))}

        {/* Candlesticks */}
        {visibleBars.map((bar, index) => {
          const x = (index * barSpacing) + (barSpacing / 2);
          const isUp = bar.close >= bar.open;
          const color = isUp ? '#089981' : '#F23645';
          
          const openPercent = priceToPercent(bar.open);
          const highPercent = priceToPercent(bar.high);
          const lowPercent = priceToPercent(bar.low);
          const closePercent = priceToPercent(bar.close);
          
          const bodyHeight = Math.abs(closePercent - openPercent);
          const bodyY = Math.max(openPercent, closePercent);

          return (
            <g key={index}>
              {/* Wick */}
              <line
                x1={`${x}%`}
                y1={`${100 - highPercent}%`}
                x2={`${x}%`}
                y2={`${100 - lowPercent}%`}
                stroke={color}
                strokeWidth="1"
              />
              
              {/* Body */}
              {bodyHeight < 0.5 ? (
                <line
                  x1={`${x - barWidth / 2}%`}
                  y1={`${100 - bodyY}%`}
                  x2={`${x + barWidth / 2}%`}
                  y2={`${100 - bodyY}%`}
                  stroke={color}
                  strokeWidth="1"
                />
              ) : (
                <rect
                  x={`${x - barWidth / 2}%`}
                  y={`${100 - bodyY}%`}
                  width={`${barWidth}%`}
                  height={`${bodyHeight}%`}
                  fill={color}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Price label */}
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        background: isLatestUp ? '#089981' : '#F23645',
        color: '#FFFFFF',
        padding: '3px 8px',
        borderRadius: '3px',
        fontSize: '11px',
        fontWeight: 600,
        fontFamily: 'monospace',
      }}>
        {latestBar.close.toFixed(4)}
      </div>

      {/* Range labels */}
      <div style={{
        position: 'absolute',
        bottom: '4px',
        left: '4px',
        color: '#787B86',
        fontSize: '9px',
        fontFamily: 'monospace',
      }}>
        {minPrice.toFixed(4)}
      </div>
      <div style={{
        position: 'absolute',
        top: '4px',
        left: '4px',
        color: '#787B86',
        fontSize: '9px',
        fontFamily: 'monospace',
      }}>
        {maxPrice.toFixed(4)}
      </div>
    </div>
  );
});

MiniOHLCChart.displayName = 'MiniOHLCChart';
