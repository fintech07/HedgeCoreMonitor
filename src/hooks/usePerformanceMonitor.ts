import { useEffect } from 'react';
import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

export const usePerformanceMonitor = () => {
  useEffect(() => {
    const logMetric = (metric: Metric) => {
      console.log(`[Performance] ${metric.name}:`, metric.value);
      
      // In production, send to analytics service
      // analytics.send(metric);
    };

    onCLS(logMetric);  // Cumulative Layout Shift
    onINP(logMetric);  // Interaction to Next Paint (replaces FID)
    onFCP(logMetric);  // First Contentful Paint
    onLCP(logMetric);  // Largest Contentful Paint
    onTTFB(logMetric); // Time to First Byte
  }, []);
};
