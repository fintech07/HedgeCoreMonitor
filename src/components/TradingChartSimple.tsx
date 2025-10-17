import { useEffect, useRef, memo } from 'react';
import { useDashboardStore } from '../stores/dashboardStore';

// Simplified chart using HTML5 Canvas for demonstration
// Replace with actual lightweight-charts implementation when API is stable

export const TradingChart = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartData = useDashboardStore((state) => state.chartData);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, rect.width, rect.height);

    if (chartData.length < 2) return;

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
    const values = chartData.map((d) => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue || 1;
    const xStep = rect.width / (chartData.length - 1);

    // Draw line chart
    ctx.strokeStyle = '#2962FF';
    ctx.lineWidth = 2;
    ctx.beginPath();

    chartData.forEach((point, index) => {
      const x = index * xStep;
      const y = rect.height - ((point.value - minValue) / valueRange) * (rect.height - 40) - 20;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw area fill
    ctx.lineTo(rect.width, rect.height);
    ctx.lineTo(0, rect.height);
    ctx.closePath();
    const gradient = ctx.createLinearGradient(0, 0, 0, rect.height);
    gradient.addColorStop(0, 'rgba(41, 98, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(41, 98, 255, 0.05)');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw price labels
    ctx.fillStyle = '#d1d4dc';
    ctx.font = '12px monospace';
    ctx.fillText(`$${maxValue.toFixed(2)}`, 10, 20);
    ctx.fillText(`$${minValue.toFixed(2)}`, 10, rect.height - 10);

  }, [chartData]);

  return (
    <div className="chart-container">
      <canvas 
        ref={canvasRef} 
        style={{ 
          width: '100%', 
          height: '400px',
          borderRadius: '8px'
        }} 
      />
    </div>
  );
});

TradingChart.displayName = 'TradingChart';
