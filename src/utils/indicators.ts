// Technical Indicators Calculations

export interface OHLCData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

/**
 * Simple Moving Average (SMA)
 */
export function calculateSMA(data: OHLCData[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
      continue;
    }
    
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    result.push(sum / period);
  }
  
  return result;
}

/**
 * Exponential Moving Average (EMA)
 */
export function calculateEMA(data: OHLCData[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  const multiplier = 2 / (period + 1);
  
  // Start with SMA for the first value
  let ema = 0;
  for (let i = 0; i < period; i++) {
    if (i >= data.length) break;
    ema += data[i].close;
  }
  ema /= period;
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
      continue;
    }
    
    if (i === period - 1) {
      result.push(ema);
    } else {
      ema = (data[i].close - ema) * multiplier + ema;
      result.push(ema);
    }
  }
  
  return result;
}

/**
 * Bollinger Bands
 */
export interface BollingerBands {
  upper: (number | null)[];
  middle: (number | null)[];
  lower: (number | null)[];
}

export function calculateBollingerBands(
  data: OHLCData[],
  period: number = 20,
  stdDev: number = 2
): BollingerBands {
  const middle = calculateSMA(data, period);
  const upper: (number | null)[] = [];
  const lower: (number | null)[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1 || middle[i] === null) {
      upper.push(null);
      lower.push(null);
      continue;
    }
    
    // Calculate standard deviation
    let sumSquares = 0;
    for (let j = 0; j < period; j++) {
      const diff = data[i - j].close - middle[i]!;
      sumSquares += diff * diff;
    }
    const sd = Math.sqrt(sumSquares / period);
    
    upper.push(middle[i]! + stdDev * sd);
    lower.push(middle[i]! - stdDev * sd);
  }
  
  return { upper, middle, lower };
}

/**
 * TRIX (Triple Exponential Moving Average Oscillator)
 */
export function calculateTRIX(data: OHLCData[], period: number = 14): (number | null)[] {
  // First EMA
  const ema1 = calculateEMA(data, period);
  
  // Create synthetic data for second EMA
  const ema1Data: OHLCData[] = ema1.map((value, i) => ({
    time: data[i].time,
    open: value || 0,
    high: value || 0,
    low: value || 0,
    close: value || 0,
  }));
  
  // Second EMA
  const ema2 = calculateEMA(ema1Data, period);
  
  // Create synthetic data for third EMA
  const ema2Data: OHLCData[] = ema2.map((value, i) => ({
    time: data[i].time,
    open: value || 0,
    high: value || 0,
    low: value || 0,
    close: value || 0,
  }));
  
  // Third EMA
  const ema3 = calculateEMA(ema2Data, period);
  
  // Calculate TRIX (percentage change)
  const trix: (number | null)[] = [];
  for (let i = 0; i < ema3.length; i++) {
    if (i === 0 || ema3[i] === null || ema3[i - 1] === null) {
      trix.push(null);
    } else {
      const change = ((ema3[i]! - ema3[i - 1]!) / ema3[i - 1]!) * 10000;
      trix.push(change);
    }
  }
  
  return trix;
}

/**
 * RSI (Relative Strength Index)
 */
export function calculateRSI(data: OHLCData[], period: number = 14): (number | null)[] {
  const result: (number | null)[] = [];
  
  if (data.length < period + 1) {
    return data.map(() => null);
  }
  
  let avgGain = 0;
  let avgLoss = 0;
  
  // Calculate initial average gain and loss
  for (let i = 1; i <= period; i++) {
    const change = data[i].close - data[i - 1].close;
    if (change > 0) {
      avgGain += change;
    } else {
      avgLoss += Math.abs(change);
    }
  }
  avgGain /= period;
  avgLoss /= period;
  
  // Push nulls for insufficient data
  for (let i = 0; i <= period; i++) {
    result.push(null);
  }
  
  // Calculate RSI
  for (let i = period + 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? Math.abs(change) : 0;
    
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = 100 - 100 / (1 + rs);
    
    result.push(rsi);
  }
  
  return result;
}
