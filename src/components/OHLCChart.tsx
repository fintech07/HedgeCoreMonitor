import { useEffect, useRef, memo } from 'react';
import { useDashboardStore } from '../stores/dashboardStore';

export const OHLCChart = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const selectedSymbol = useDashboardStore((state) => state.selectedSymbol);
  const ohlcDataBySymbol = useDashboardStore((state) => state.ohlcDataBySymbol);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get OHLC data for selected symbol
    const ohlcData = selectedSymbol ? (ohlcDataBySymbol[selectedSymbol] || []) : [];

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, rect.width, rect.height);

    if (!selectedSymbol) {
      // Show "Select a symbol..." message
      ctx.fillStyle = '#d1d4dc';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Select a symbol from the table to view chart', rect.width / 2, rect.height / 2);
      return;
    }

    if (ohlcData.length < 1) {
      // Show "Waiting for data..." message
      ctx.fillStyle = '#d1d4dc';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Waiting for ${selectedSymbol} data...`, rect.width / 2, rect.height / 2);
      return;
    }

    // Draw grid
    ctx.strokeStyle = '#2b2b43';
    ctx.lineWidth = 1;
    for (let i = 0; i < 10; i++) {
      const y = (rect.height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rect.width, y);
      ctx.stroke();
    }

    // Calculate scaling
    const allPrices = ohlcData.flatMap(bar => [bar.high, bar.low]);
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);
    const priceRange = maxPrice - minPrice || 1;
    
    const padding = 40;
    const chartHeight = rect.height - padding * 2;
    const barWidth = Math.max(3, (rect.width - padding * 2) / ohlcData.length * 0.8);
    const barSpacing = (rect.width - padding * 2) / ohlcData.length;

    // Function to convert price to Y coordinate
    const priceToY = (price: number) => {
      return rect.height - padding - ((price - minPrice) / priceRange) * chartHeight;
    };

    // Draw OHLC bars
    ohlcData.forEach((bar, index) => {
      const x = padding + index * barSpacing + barSpacing / 2;
      
      const openY = priceToY(bar.open);
      const highY = priceToY(bar.high);
      const lowY = priceToY(bar.low);
      const closeY = priceToY(bar.close);
      
      // Determine color (green if close >= open, red otherwise)
      const isUp = bar.close >= bar.open;
      const color = isUp ? '#26a69a' : '#ef5350';
      
      // Draw high-low line (wick)
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();
      
      // Draw open-close bar (body)
      ctx.fillStyle = color;
      const bodyHeight = Math.abs(closeY - openY);
      const bodyY = Math.min(openY, closeY);
      
      // If body is too small, draw a line
      if (bodyHeight < 1) {
        ctx.fillRect(x - barWidth / 2, bodyY, barWidth, 1);
      } else {
        // Draw filled or hollow candlestick
        if (isUp) {
          // Up candle - hollow
          ctx.strokeStyle = color;
          ctx.lineWidth = 1;
          ctx.strokeRect(x - barWidth / 2, bodyY, barWidth, bodyHeight);
        } else {
          // Down candle - filled
          ctx.fillRect(x - barWidth / 2, bodyY, barWidth, bodyHeight);
        }
      }
      
      // Draw small tick marks on left for open and right for close
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - barWidth / 2, openY);
      ctx.lineTo(x - barWidth / 2 - 3, openY);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(x + barWidth / 2, closeY);
      ctx.lineTo(x + barWidth / 2 + 3, closeY);
      ctx.stroke();
    });

    // Draw price labels
    ctx.fillStyle = '#d1d4dc';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`High: ${maxPrice.toFixed(4)}`, 10, 20);
    ctx.fillText(`Low: ${minPrice.toFixed(4)}`, 10, rect.height - 10);
    
    // Draw latest price
    const latestBar = ohlcData[ohlcData.length - 1];
    ctx.fillStyle = latestBar.close >= latestBar.open ? '#26a69a' : '#ef5350';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`Close: ${latestBar.close.toFixed(4)}`, rect.width - 10, 20);
    
    // Draw symbol and bar count
    ctx.fillStyle = '#888';
    ctx.font = '11px monospace';
    ctx.fillText(`${selectedSymbol} | 1m | ${ohlcData.length} bars`, rect.width - 10, rect.height - 10);

  }, [ohlcDataBySymbol, selectedSymbol]);

  return (
    <div className="chart-container">
      <canvas 
        ref={canvasRef} 
        style={{ 
          width: '100%', 
          height: '500px',
          borderRadius: '8px',
          cursor: 'crosshair'
        }} 
      />
    </div>
  );
});

OHLCChart.displayName = 'OHLCChart';
