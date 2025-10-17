import { useEffect, useRef, memo, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { useDashboardStore } from '../stores/dashboardStore';

export const TradingViewChart = memo(() => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const candlestickSeriesRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const selectedSymbol = useDashboardStore((state) => state.selectedSymbol);
  const ohlcDataBySymbol = useDashboardStore((state) => state.ohlcDataBySymbol);

  console.log('TradingViewChart render:', { selectedSymbol, hasData: !!ohlcDataBySymbol[selectedSymbol || ''] });

  // Initialize chart once
  useEffect(() => {
    if (!chartContainerRef.current) return;

    console.log('Initializing chart...');

    try {
      // Create chart with TradingView styling
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: '#1a1a1a' },
          textColor: '#d1d4dc',
        },
        grid: {
          vertLines: { color: '#2b2b43' },
          horzLines: { color: '#2b2b43' },
        },
        width: chartContainerRef.current.clientWidth,
        height: 500,
        rightPriceScale: {
          borderColor: '#2b2b43',
          scaleMargins: {
            top: 0.1,
            bottom: 0.2,
          },
        },
        timeScale: {
          borderColor: '#2b2b43',
          timeVisible: true,
          secondsVisible: true,
        },
        crosshair: {
          mode: 1,
          vertLine: {
            color: '#758696',
            width: 1,
            style: 3,
            labelBackgroundColor: '#2962FF',
          },
          horzLine: {
            color: '#758696',
            width: 1,
            style: 3,
            labelBackgroundColor: '#2962FF',
          },
        },
      });

      // Debug: log available methods
      console.log('Chart object methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(chart)));
      console.log('Chart object keys:', Object.keys(chart));

      // For v5, check if addAreaSeries exists (simpler fallback)
      let series;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof (chart as any).addAreaSeries === 'function') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        series = (chart as any).addAreaSeries({
          lineColor: '#2962FF',
          topColor: 'rgba(41, 98, 255, 0.3)',
          bottomColor: 'rgba(41, 98, 255, 0.05)',
          lineWidth: 2,
        });
      } else {
        // Ultra fallback - just store the chart
        console.warn('No series methods found on chart');
        series = null;
      }

      chartRef.current = chart;
      candlestickSeriesRef.current = series;

      console.log('Chart initialized successfully');
    } catch (error) {
      console.error('Error initializing chart:', error);
      setError(`Failed to initialize chart: ${error instanceof Error ? error.message : String(error)}`);
    }    // Handle window resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, []);

  // Update chart data when symbol or data changes
  useEffect(() => {
    if (!candlestickSeriesRef.current) return;

    // Get OHLC data for selected symbol
    const ohlcData = selectedSymbol ? (ohlcDataBySymbol[selectedSymbol] || []) : [];

    if (!selectedSymbol || ohlcData.length === 0) {
      // Clear chart data
      try {
        candlestickSeriesRef.current.setData([]);
      } catch (error) {
        console.error('Error clearing chart data:', error);
      }
      return;
    }

    // Convert OHLC to line data (use close price)
    const lineData = ohlcData.map(bar => ({
      time: bar.time,
      value: bar.close,
    }));

    // Set the line data
    try {
      candlestickSeriesRef.current.setData(lineData);

      // Fit content to view
      if (chartRef.current && chartRef.current.timeScale) {
        chartRef.current.timeScale().fitContent();
      }
    } catch (error) {
      console.error('Error setting chart data:', error);
    }
  }, [selectedSymbol, ohlcDataBySymbol]);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {error && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#ef4444',
            fontSize: '14px',
            textAlign: 'center',
            zIndex: 2,
            pointerEvents: 'none',
            padding: '20px',
            background: 'rgba(0,0,0,0.8)',
            borderRadius: '8px',
          }}
        >
          {error}
        </div>
      )}
      {!selectedSymbol && !error && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#d1d4dc',
            fontSize: '16px',
            textAlign: 'center',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          Select a symbol from the table to view chart
        </div>
      )}
      {selectedSymbol && (!ohlcDataBySymbol[selectedSymbol] || ohlcDataBySymbol[selectedSymbol].length === 0) && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#d1d4dc',
            fontSize: '16px',
            textAlign: 'center',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          Waiting for {selectedSymbol} data...
        </div>
      )}
      <div
        ref={chartContainerRef}
        style={{
          width: '100%',
          height: '500px',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      />
    </div>
  );
});

TradingViewChart.displayName = 'TradingViewChart';
