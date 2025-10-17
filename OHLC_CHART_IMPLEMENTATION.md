# TradingView-Style OHLC Candlestick Chart Implementation

## Overview
Successfully upgraded the dashboard to display professional **OHLC (Open-High-Low-Close) candlestick charts** using the TradingView `lightweight-charts` library with full interactive features.

## Key Features Implemented

### 1. **OHLC Data Aggregation**
- Real-time tick data is automatically aggregated into **1-second candlestick bars**
- Each bar shows:
  - **Open**: First price in the time period
  - **High**: Highest price in the time period
  - **Low**: Lowest price in the time period
  - **Close**: Last price in the time period

### 2. **TradingView-Style Chart Features**
✅ **Candlestick Display**: Green (up) and red (down) candles with wicks
✅ **Interactive Crosshair**: Hover to see precise price and time
✅ **Scrolling**: Scroll mouse wheel to zoom in/out on time axis
✅ **Panning**: Click and drag to pan through historical data
✅ **Auto-scaling**: Y-axis automatically adjusts to visible price range
✅ **Time Scale**: Shows precise timestamps with seconds
✅ **Responsive**: Auto-resizes with window
✅ **Dark Theme**: Professional trading-style dark theme

### 3. **Per-Symbol Charts**
- Chart displays **only the selected symbol's data**
- Click any symbol in the table to switch charts instantly
- Maintains up to **1,000 bars per symbol** in memory
- Auto-fits data to view when switching symbols

## Technical Implementation

### Store Updates (`dashboardStore.ts`)
```typescript
// New OHLC data structure
export interface OHLCData {
  time: number;      // Unix timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
}

// Per-symbol OHLC storage
ohlcDataBySymbol: Record<string, OHLCData[]>

// Automatic OHLC aggregation
addTickToOHLC: (symbol, price, timestamp) => void
```

**Aggregation Logic**:
- Groups ticks into 1-second bars
- Updates existing bar if within same second
- Creates new bar for new second
- Automatically calculates OHLC values

### WebSocket Hook (`useWebSocket.ts`)
```typescript
// Each tick updates OHLC
addTickToOHLC(tick.symbol, midPrice, timestamp);
```

### Chart Component (`TradingViewChart.tsx`)
- Uses `lightweight-charts` v5.0.9
- Professional candlestick styling:
  - **Up Candles**: `#26a69a` (teal/green)
  - **Down Candles**: `#ef5350` (red)
  - **Background**: `#1a1a1a` (dark gray)
  - **Grid**: `#2b2b43` (subtle lines)

## Color Scheme

| Element | Color | Description |
|---------|-------|-------------|
| Up Candle | #26a69a | Green when close > open |
| Down Candle | #ef5350 | Red when close < open |
| Crosshair | #758696 | Semi-transparent gray |
| Background | #1a1a1a | Dark charcoal |
| Grid Lines | #2b2b43 | Subtle purple-gray |
| Text | #d1d4dc | Light gray |

## User Interface

### Chart States
1. **No Symbol Selected**: Shows message "Select a symbol from the table to view chart"
2. **Symbol Selected, No Data**: Shows "Waiting for {SYMBOL} data..."
3. **Data Available**: Displays interactive candlestick chart

### Interactive Controls
- **Mouse Wheel**: Zoom in/out on time axis
- **Click + Drag**: Pan through chart history
- **Hover**: Show crosshair with exact price/time
- **Double Click**: Reset zoom to fit all data
- **Window Resize**: Chart auto-adjusts size

## Chart Header
Dynamically updates to show:
- Selected symbol name (e.g., "BTC/ETH")
- Or default: "OHLC Candlestick Chart" when no selection

## Performance
- **1-Second Bars**: High granularity for tick data
- **1,000 Bar Limit**: Per symbol (approximately 16 minutes of data)
- **Real-time Updates**: Bars update in real-time as ticks arrive
- **Hardware Accelerated**: Canvas-based rendering via `fancy-canvas`

## Data Flow
```
Kafka Tick Data
    ↓
WebSocket Hook
    ↓
Calculate Mid-Price (bid + ask) / 2
    ↓
Store: addTickToOHLC()
    ↓
Aggregate into 1-Second OHLC Bars
    ↓
TradingViewChart Component
    ↓
Lightweight-Charts Candlestick Series
    ↓
Interactive Canvas Display
```

## Usage Instructions

1. **Start WebSocket Proxy**:
   ```bash
   cd server
   npm start
   ```

2. **Start Dashboard**:
   ```bash
   npm run dev
   ```

3. **Start Kafka Publisher** (your C# application)

4. **View Charts**:
   - Wait for tick data to appear in table
   - Click any symbol row to select it
   - Chart will automatically display OHLC candlesticks
   - Use mouse to interact with chart

## Troubleshooting

### Chart Not Displaying
- **Check**: Is a symbol selected? (Click a row in table)
- **Check**: Is data arriving? (Look for console logs: `📊 SYMBOL | Bid: ... | Ask: ...`)
- **Check**: Are there at least 2 data points? (Need minimum data for chart)

### Chart Not Updating
- **Check**: WebSocket connection status (top-right indicator)
- **Check**: Kafka messages arriving (check proxy server logs)
- **Check**: Symbol matches Kafka topic data

### Chart Too Zoomed In/Out
- **Fix**: Double-click chart to auto-fit all data
- **Fix**: Scroll mouse wheel to zoom
- **Fix**: Click and drag to pan

## Advanced Customization

### Change Bar Interval
Edit `dashboardStore.ts` line ~65:
```typescript
// Current: 1-second bars
const barTime = timeInSeconds;

// Change to 5-second bars:
const barTime = Math.floor(timeInSeconds / 5) * 5;

// Change to 1-minute bars:
const barTime = Math.floor(timeInSeconds / 60) * 60;
```

### Change Chart Colors
Edit `TradingViewChart.tsx` lines ~61-66:
```typescript
upColor: '#26a69a',      // Up candle color
downColor: '#ef5350',    // Down candle color
wickUpColor: '#26a69a',  // Up wick color
wickDownColor: '#ef5350' // Down wick color
```

### Change Chart Height
Edit `TradingViewChart.tsx` line ~28:
```typescript
height: 500,  // Change to desired height in pixels
```

## Files Modified

1. **src/stores/dashboardStore.ts**
   - Added `OHLCData` interface
   - Added `ohlcDataBySymbol` storage
   - Added `addTickToOHLC` method

2. **src/hooks/useWebSocket.ts**
   - Added `addTickToOHLC` call for each tick

3. **src/components/TradingViewChart.tsx**
   - NEW: Professional TradingView-style chart component

4. **src/App.tsx**
   - Updated to use `TradingViewChart` component
   - Changed header to "OHLC Candlestick Chart"

## Dependencies
- ✅ `lightweight-charts` v5.0.9 (already installed)
- ✅ `react` v19.1.1
- ✅ `zustand` v5.0.8

## Next Steps (Optional Enhancements)

1. **Volume Bars**: Add volume indicator below price chart
2. **Technical Indicators**: Add MA, RSI, MACD
3. **Multiple Timeframes**: Allow switching between 1s, 5s, 1m, 5m bars
4. **Drawing Tools**: Add trend lines, horizontal lines
5. **Price Alerts**: Set alerts at specific price levels
6. **Export Data**: Download chart as image or CSV

---

**Status**: ✅ **COMPLETE** - Professional OHLC candlestick charts with full TradingView-style interactivity are now operational!
