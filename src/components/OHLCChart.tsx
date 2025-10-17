import { useEffect, useRef, memo, useState, useCallback } from 'react';
import { useDashboardStore } from '../stores/dashboardStore';
import { useIndicatorStore } from '../stores/indicatorStore';
import { calculateSMA, calculateEMA, calculateBollingerBands, calculateTRIX } from '../utils/indicators';
import { IndicatorPanel } from './IndicatorPanel';

interface ChartViewport {
  startIndex: number; // First visible bar index
  barsVisible: number; // Number of bars visible
  barWidth: number; // Width of each bar in pixels
}

export const OHLCChart = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const selectedSymbol = useDashboardStore((state) => state.selectedSymbol);
  const ohlcDataBySymbol = useDashboardStore((state) => state.ohlcDataBySymbol);
  const indicatorSettings = useIndicatorStore((state) => state.settings);
  
  // Chart interaction state
  const [viewport, setViewport] = useState<ChartViewport>({
    startIndex: 0,
    barsVisible: 100,
    barWidth: 8,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [crosshair, setCrosshair] = useState<{ x: number; y: number } | null>(null);
  const [autoScroll, setAutoScroll] = useState(true); // Auto-scroll to latest bar
  const [showIndicatorPanel, setShowIndicatorPanel] = useState(false); // Indicator panel visibility

  // Handle mouse wheel for zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    setAutoScroll(false); // Disable auto-scroll when user zooms
    
    setViewport(prev => {
      const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
      const newBarWidth = Math.max(2, Math.min(50, prev.barWidth * zoomFactor));
      const canvas = canvasRef.current;
      if (!canvas) return prev;
      
      const rect = canvas.getBoundingClientRect();
      const padding = 40;
      const chartWidth = rect.width - padding * 2;
      const newBarsVisible = Math.floor(chartWidth / newBarWidth);
      
      return {
        ...prev,
        barWidth: newBarWidth,
        barsVisible: newBarsVisible,
      };
    });
  }, []);

  // Handle mouse down for panning
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setAutoScroll(false); // Disable auto-scroll when user pans
    setDragStart({ x: e.clientX, y: e.clientY });
  }, []);

  // Handle mouse move for panning and crosshair
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCrosshair({ x, y });
    
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const barsMoved = Math.round(deltaX / viewport.barWidth);
      
      if (barsMoved !== 0) {
        setViewport(prev => {
          const ohlcData = selectedSymbol ? (ohlcDataBySymbol[selectedSymbol] || []) : [];
          const newStartIndex = Math.max(0, Math.min(
            ohlcData.length - prev.barsVisible,
            prev.startIndex - barsMoved
          ));
          
          return {
            ...prev,
            startIndex: newStartIndex,
          };
        });
        
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    }
  }, [isDragging, dragStart, viewport.barWidth, selectedSymbol, ohlcDataBySymbol]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
    setCrosshair(null);
  }, []);

  // Auto-scroll to latest bar when new data arrives
  useEffect(() => {
    if (autoScroll && selectedSymbol) {
      const ohlcData = ohlcDataBySymbol[selectedSymbol] || [];
      setViewport(prev => ({
        ...prev,
        startIndex: Math.max(0, ohlcData.length - prev.barsVisible),
      }));
    }
  }, [ohlcDataBySymbol, selectedSymbol, autoScroll]);

  // Add wheel event listener
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // Main render effect
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

    // TradingView-style background
    ctx.fillStyle = '#131722';
    ctx.fillRect(0, 0, rect.width, rect.height);

    if (!selectedSymbol) {
      // Show "Select a symbol..." message
      ctx.fillStyle = '#787B86';
      ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Select a symbol from the table to view chart', rect.width / 2, rect.height / 2);
      return;
    }

    if (ohlcData.length < 1) {
      // Show "Waiting for data..." message
      ctx.fillStyle = '#787B86';
      ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Waiting for ${selectedSymbol} data...`, rect.width / 2, rect.height / 2);
      return;
    }

    // Define chart areas (TradingView-style layout)
    const priceScaleWidth = 70; // Right price scale
    const timeScaleHeight = 30; // Bottom time scale
    const leftPadding = 0;
    const topPadding = 20;
    const rightPadding = 0; // Add padding on the right for latest bar visibility
    
    const chartWidth = rect.width - leftPadding - priceScaleWidth - rightPadding;
    const chartHeight = rect.height - topPadding - timeScaleHeight;

    // Get visible bars based on viewport
    const endIndex = Math.min(viewport.startIndex + viewport.barsVisible, ohlcData.length);
    const visibleBars = ohlcData.slice(viewport.startIndex, endIndex);

    if (visibleBars.length === 0) return;

    // Calculate scaling for visible bars only
    const allPrices = visibleBars.flatMap(bar => [bar.high, bar.low]);
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);
    const priceRange = maxPrice - minPrice || 1;
    
    // Add 5% padding to price range
    const pricePadding = priceRange * 0.05;
    const minPriceWithPadding = minPrice - pricePadding;
    const maxPriceWithPadding = maxPrice + pricePadding;
    const adjustedPriceRange = maxPriceWithPadding - minPriceWithPadding;
    
    const barWidth = Math.max(2, viewport.barWidth * 0.7);
    const barSpacing = viewport.barWidth;

    // Draw TradingView-style grid
    ctx.strokeStyle = '#2A2E39';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines (6-8 lines)
    const gridLines = 8;
    for (let i = 0; i <= gridLines; i++) {
      const y = topPadding + (chartHeight / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(leftPadding, y);
      ctx.lineTo(leftPadding + chartWidth, y);
      ctx.stroke();
    }
    
    // Vertical grid lines (based on time)
    const verticalLines = Math.min(10, visibleBars.length);
    const barsPerLine = Math.max(1, Math.floor(visibleBars.length / verticalLines));
    for (let i = 0; i <= verticalLines; i++) {
      const barIndex = i * barsPerLine;
      if (barIndex < visibleBars.length) {
        const x = leftPadding + barIndex * barSpacing + barSpacing / 2;
        ctx.beginPath();
        ctx.moveTo(x, topPadding);
        ctx.lineTo(x, topPadding + chartHeight);
        ctx.stroke();
      }
    }
    
    // Draw price scale background (right side)
    ctx.fillStyle = '#1C1E27';
    ctx.fillRect(leftPadding + chartWidth + rightPadding, 0, priceScaleWidth, rect.height);
    
    // Draw time scale background (bottom)
    ctx.fillStyle = '#1C1E27';
    ctx.fillRect(0, topPadding + chartHeight, rect.width, timeScaleHeight);

    // Function to convert price to Y coordinate
    const priceToY = (price: number) => {
      return topPadding + chartHeight - ((price - minPriceWithPadding) / adjustedPriceRange) * chartHeight;
    };

    // Draw OHLC bars (only visible ones)
    visibleBars.forEach((bar, index) => {
      const x = leftPadding + index * barSpacing + barSpacing / 2;
      
      const openY = priceToY(bar.open);
      const highY = priceToY(bar.high);
      const lowY = priceToY(bar.low);
      const closeY = priceToY(bar.close);
      
      // Determine color (TradingView colors: green/red)
      const isUp = bar.close >= bar.open;
      const color = isUp ? '#089981' : '#F23645'; // TradingView green/red
      
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
        // Draw filled candlestick (both up and down are filled)
        ctx.fillStyle = color;
        ctx.fillRect(x - barWidth / 2, bodyY, barWidth, bodyHeight);
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

    // ========== DRAW INDICATORS ==========
    
    // Calculate indicators for ALL data (not just visible)
    const allOhlcData = ohlcData;
    
    // Helper function to draw indicator line
    const drawIndicatorLine = (values: (number | null)[], color: string, lineWidth: number = 1.5) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      
      let hasStarted = false;
      visibleBars.forEach((_bar, index) => {
        const dataIndex = viewport.startIndex + index;
        const value = values[dataIndex];
        
        if (value !== null) {
          const x = leftPadding + index * barSpacing + barSpacing / 2;
          const y = priceToY(value);
          
          if (!hasStarted) {
            ctx.moveTo(x, y);
            hasStarted = true;
          } else {
            ctx.lineTo(x, y);
          }
        } else {
          hasStarted = false;
        }
      });
      
      ctx.stroke();
    };
    
    // 1. Simple Moving Averages
    if (indicatorSettings.sma.enabled) {
      indicatorSettings.sma.periods.forEach((period, i) => {
        const smaValues = calculateSMA(allOhlcData, period);
        const color = indicatorSettings.sma.colors[i] || '#2962FF';
        drawIndicatorLine(smaValues, color);
      });
    }
    
    // 2. Exponential Moving Averages
    if (indicatorSettings.ema.enabled) {
      indicatorSettings.ema.periods.forEach((period, i) => {
        const emaValues = calculateEMA(allOhlcData, period);
        const color = indicatorSettings.ema.colors[i] || '#00E676';
        drawIndicatorLine(emaValues, color);
      });
    }
    
    // 3. Bollinger Bands
    if (indicatorSettings.bollingerBands.enabled) {
      const bb = calculateBollingerBands(
        allOhlcData,
        indicatorSettings.bollingerBands.period,
        indicatorSettings.bollingerBands.stdDev
      );
      
      // Draw filled area between upper and lower bands
      ctx.fillStyle = `${indicatorSettings.bollingerBands.upperColor}${Math.round(indicatorSettings.bollingerBands.fillOpacity * 255).toString(16).padStart(2, '0')}`;
      ctx.beginPath();
      
      // Draw upper band path
      let hasStarted = false;
      visibleBars.forEach((_bar, index) => {
        const dataIndex = viewport.startIndex + index;
        const upperValue = bb.upper[dataIndex];
        
        if (upperValue !== null) {
          const x = leftPadding + index * barSpacing + barSpacing / 2;
          const y = priceToY(upperValue);
          
          if (!hasStarted) {
            ctx.moveTo(x, y);
            hasStarted = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      });
      
      // Draw lower band path in reverse
      for (let index = visibleBars.length - 1; index >= 0; index--) {
        const dataIndex = viewport.startIndex + index;
        const lowerValue = bb.lower[dataIndex];
        
        if (lowerValue !== null) {
          const x = leftPadding + index * barSpacing + barSpacing / 2;
          const y = priceToY(lowerValue);
          ctx.lineTo(x, y);
        }
      }
      
      ctx.closePath();
      ctx.fill();
      
      // Draw the band lines
      drawIndicatorLine(bb.upper, indicatorSettings.bollingerBands.upperColor, 1);
      drawIndicatorLine(bb.middle, indicatorSettings.bollingerBands.middleColor, 1);
      drawIndicatorLine(bb.lower, indicatorSettings.bollingerBands.lowerColor, 1);
    }
    
    // 4. TRIX (overlay on price for now)
    if (indicatorSettings.trix.enabled && !indicatorSettings.trix.showInSeparatePane) {
      const trixValues = calculateTRIX(allOhlcData, indicatorSettings.trix.period);
      // Scale TRIX to fit in price range (normalize)
      const trixFiltered = trixValues.filter(v => v !== null) as number[];
      if (trixFiltered.length > 0) {
        const trixMin = Math.min(...trixFiltered);
        const trixMax = Math.max(...trixFiltered);
        const trixRange = trixMax - trixMin || 1;
        
        // Map TRIX to price range
        const scaledTrix = trixValues.map(v => {
          if (v === null) return null;
          const normalized = (v - trixMin) / trixRange;
          return minPriceWithPadding + normalized * adjustedPriceRange;
        });
        
        drawIndicatorLine(scaledTrix, indicatorSettings.trix.color, 1);
      }
    }

    // Draw price scale labels (right side - TradingView style)
    ctx.fillStyle = '#787B86';
    ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i <= gridLines; i++) {
      const y = topPadding + (chartHeight / gridLines) * i;
      const price = maxPriceWithPadding - (adjustedPriceRange / gridLines) * i;
      
      // Draw price label
      ctx.fillStyle = '#787B86';
      ctx.fillText(price.toFixed(4), leftPadding + chartWidth + rightPadding + 8, y);
      
      // Draw small tick mark
      ctx.strokeStyle = '#2A2E39';
      ctx.beginPath();
      ctx.moveTo(leftPadding + chartWidth + rightPadding, y);
      ctx.lineTo(leftPadding + chartWidth + rightPadding + 4, y);
      ctx.stroke();
    }
    
    // Draw current price label (TradingView style - highlighted)
    const latestBar = visibleBars[visibleBars.length - 1];
    const currentPriceY = priceToY(latestBar.close);
    const isLatestUp = latestBar.close >= latestBar.open;
    const currentPriceColor = isLatestUp ? '#089981' : '#F23645';
    
    // Price label background
    ctx.fillStyle = currentPriceColor;
    ctx.fillRect(leftPadding + chartWidth + rightPadding, currentPriceY - 10, priceScaleWidth, 20);
    
    // Price text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(latestBar.close.toFixed(4), leftPadding + chartWidth + rightPadding + 8, currentPriceY);
    
    // Draw horizontal line extending from current price
    ctx.strokeStyle = currentPriceColor;
    ctx.setLineDash([2, 2]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(leftPadding, currentPriceY);
    ctx.lineTo(leftPadding + chartWidth + rightPadding, currentPriceY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw time scale labels (bottom - TradingView style)
    ctx.fillStyle = '#787B86';
    ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    for (let i = 0; i <= verticalLines; i++) {
      const barIndex = i * barsPerLine;
      if (barIndex < visibleBars.length) {
        const x = leftPadding + barIndex * barSpacing + barSpacing / 2;
        const bar = visibleBars[barIndex];
        const date = new Date(bar.time * 1000);
        
        // Format time based on zoom level
        let timeLabel = '';
        if (viewport.barWidth > 15) {
          // Show full time for zoomed in view
          timeLabel = date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          });
        } else {
          // Show abbreviated time for zoomed out view
          timeLabel = date.toLocaleTimeString('en-US', { 
            hour: '2-digit',
            hour12: false 
          });
        }
        
        ctx.fillText(timeLabel, x, topPadding + chartHeight + 8);
      }
    }

    // Draw crosshair
    if (crosshair && crosshair.x < leftPadding + chartWidth + rightPadding) {
      ctx.strokeStyle = '#434651';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      
      // Vertical line
      ctx.beginPath();
      ctx.moveTo(crosshair.x, topPadding);
      ctx.lineTo(crosshair.x, topPadding + chartHeight);
      ctx.stroke();
      
      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(leftPadding, crosshair.y);
      ctx.lineTo(leftPadding + chartWidth + rightPadding, crosshair.y);
      ctx.stroke();
      
      ctx.setLineDash([]);
      
      // Price label at crosshair (TradingView style)
      if (crosshair.y >= topPadding && crosshair.y <= topPadding + chartHeight) {
        const priceAtCursor = maxPriceWithPadding - ((crosshair.y - topPadding) / chartHeight) * adjustedPriceRange;
        
        // Background
        ctx.fillStyle = '#4B525D';
        const labelWidth = 65;
        ctx.fillRect(leftPadding + chartWidth + rightPadding, crosshair.y - 10, labelWidth, 20);
        
        // Border
        ctx.strokeStyle = '#2A2E39';
        ctx.lineWidth = 1;
        ctx.strokeRect(leftPadding + chartWidth + rightPadding, crosshair.y - 10, labelWidth, 20);
        
        // Text
        ctx.fillStyle = '#D1D4DC';
        ctx.font = '11px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(priceAtCursor.toFixed(4), leftPadding + chartWidth + rightPadding + 6, crosshair.y);
      }
      
      // Time label at crosshair
      if (crosshair.x >= leftPadding && crosshair.x <= leftPadding + chartWidth + rightPadding) {
        const barIndexAtCursor = Math.floor((crosshair.x - leftPadding) / barSpacing);
        if (barIndexAtCursor >= 0 && barIndexAtCursor < visibleBars.length) {
          const bar = visibleBars[barIndexAtCursor];
          const date = new Date(bar.time * 1000);
          const timeLabel = date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
          
          const labelWidth = ctx.measureText(timeLabel).width + 12;
          
          // Background
          ctx.fillStyle = '#4B525D';
          ctx.fillRect(crosshair.x - labelWidth / 2, topPadding + chartHeight, labelWidth, timeScaleHeight - 2);
          
          // Border
          ctx.strokeStyle = '#2A2E39';
          ctx.strokeRect(crosshair.x - labelWidth / 2, topPadding + chartHeight, labelWidth, timeScaleHeight - 2);
          
          // Text
          ctx.fillStyle = '#D1D4DC';
          ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(timeLabel, crosshair.x, topPadding + chartHeight + timeScaleHeight / 2);
        }
      }
    }

    // Draw TradingView-style OHLC legend (top-left)
    const legendX = 12;
    const legendY = 8;
    
    // Symbol name
    ctx.fillStyle = '#D1D4DC';
    ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(selectedSymbol || '', legendX, legendY);
    
    // OHLC values for the bar under cursor or latest bar
    let displayBar = latestBar;
    if (crosshair && crosshair.x >= leftPadding && crosshair.x <= leftPadding + chartWidth) {
      const barIndexAtCursor = Math.floor((crosshair.x - leftPadding) / barSpacing);
      if (barIndexAtCursor >= 0 && barIndexAtCursor < visibleBars.length) {
        displayBar = visibleBars[barIndexAtCursor];
      }
    }
    
    const legendStartX = legendX + ctx.measureText(selectedSymbol || '').width + 15;
    ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    
    // O: Open
    ctx.fillStyle = '#787B86';
    ctx.fillText('O', legendStartX, legendY + 2);
    ctx.fillStyle = '#D1D4DC';
    ctx.fillText(displayBar.open.toFixed(4), legendStartX + 12, legendY + 2);
    
    // H: High
    const highX = legendStartX + 80;
    ctx.fillStyle = '#787B86';
    ctx.fillText('H', highX, legendY + 2);
    ctx.fillStyle = '#D1D4DC';
    ctx.fillText(displayBar.high.toFixed(4), highX + 12, legendY + 2);
    
    // L: Low
    const lowX = highX + 80;
    ctx.fillStyle = '#787B86';
    ctx.fillText('L', lowX, legendY + 2);
    ctx.fillStyle = '#D1D4DC';
    ctx.fillText(displayBar.low.toFixed(4), lowX + 12, legendY + 2);
    
    // C: Close (colored)
    const closeX = lowX + 80;
    ctx.fillStyle = '#787B86';
    ctx.fillText('C', closeX, legendY + 2);
    const isDisplayUp = displayBar.close >= displayBar.open;
    ctx.fillStyle = isDisplayUp ? '#089981' : '#F23645';
    ctx.fillText(displayBar.close.toFixed(4), closeX + 12, legendY + 2);
    
    // Draw chart info (bottom-right, smaller)
    ctx.fillStyle = '#434651';
    ctx.font = '10px monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
      ctx.fillText(
      `1m | ${viewport.startIndex + 1}-${endIndex}/${ohlcData.length}`,
      rect.width - priceScaleWidth - 10,
      rect.height - timeScaleHeight - 5
    );

  }, [ohlcDataBySymbol, selectedSymbol, viewport, crosshair, indicatorSettings]);  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Control buttons - TradingView style */}
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        zIndex: 10,
        display: 'flex',
        gap: '6px',
      }}>
        <button
          onClick={() => setAutoScroll(!autoScroll)}
          style={{
            background: autoScroll ? '#2962FF' : '#2A2E39',
            color: autoScroll ? '#FFFFFF' : '#787B86',
            border: '1px solid #2A2E39',
            borderRadius: '4px',
            padding: '5px 10px',
            fontSize: '11px',
            cursor: 'pointer',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontWeight: 500,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (!autoScroll) {
              e.currentTarget.style.background = '#363A45';
            }
          }}
          onMouseLeave={(e) => {
            if (!autoScroll) {
              e.currentTarget.style.background = '#2A2E39';
            }
          }}
          title={autoScroll ? 'Auto-scroll ON' : 'Auto-scroll OFF'}
        >
          {autoScroll ? '⏩ Auto' : '⏸ Manual'}
        </button>
        <button
          onClick={() => {
            const ohlcData = selectedSymbol ? (ohlcDataBySymbol[selectedSymbol] || []) : [];
            setViewport(prev => ({
              ...prev,
              startIndex: Math.max(0, ohlcData.length - prev.barsVisible),
            }));
          }}
          style={{
            background: '#2A2E39',
            color: '#787B86',
            border: '1px solid #2A2E39',
            borderRadius: '4px',
            padding: '5px 10px',
            fontSize: '11px',
            cursor: 'pointer',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#363A45';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#2A2E39';
          }}
          title="Jump to latest"
        >
          ⏭
        </button>
        <button
          onClick={() => {
            setViewport(prev => ({
              ...prev,
              barWidth: 8,
              barsVisible: 100,
            }));
          }}
          style={{
            background: '#2A2E39',
            color: '#787B86',
            border: '1px solid #2A2E39',
            borderRadius: '4px',
            padding: '5px 10px',
            fontSize: '11px',
            cursor: 'pointer',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#363A45';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#2A2E39';
          }}
          title="Reset zoom"
        >
          🔍
        </button>
        <button
          onClick={() => setShowIndicatorPanel(!showIndicatorPanel)}
          style={{
            background: showIndicatorPanel ? '#2962FF' : '#2A2E39',
            color: showIndicatorPanel ? '#FFFFFF' : '#787B86',
            border: '1px solid #2A2E39',
            borderRadius: '4px',
            padding: '5px 10px',
            fontSize: '11px',
            cursor: 'pointer',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontWeight: 500,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (!showIndicatorPanel) {
              e.currentTarget.style.background = '#363A45';
            }
          }}
          onMouseLeave={(e) => {
            if (!showIndicatorPanel) {
              e.currentTarget.style.background = '#2A2E39';
            }
          }}
          title="Toggle indicators"
        >
          📊 Indicators
        </button>
      </div>

      {/* Indicator Panel */}
      {showIndicatorPanel && <IndicatorPanel />}

      {/* Instructions overlay - TradingView style */}
      <div style={{
        position: 'absolute',
        bottom: '35px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(28, 30, 39, 0.95)',
        color: '#787B86',
        padding: '6px 14px',
        borderRadius: '4px',
        fontSize: '10px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        pointerEvents: 'none',
        zIndex: 1,
        border: '1px solid #2A2E39',
      }}>
        <span style={{ color: '#D1D4DC' }}>🖱</span> Drag to Pan | <span style={{ color: '#D1D4DC' }}>⚙</span> Scroll to Zoom
      </div>

      <canvas 
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ 
          width: '100%', 
          height: '500px',
          borderRadius: '6px',
          cursor: isDragging ? 'grabbing' : 'crosshair',
          userSelect: 'none',
          background: '#131722',
          border: '1px solid #2A2E39',
        }} 
      />
    </div>
  );
});

OHLCChart.displayName = 'OHLCChart';
