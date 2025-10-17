# Real-Time Data Flow

## Architecture Overview

```
C# Kafka Publisher → Kafka Broker → WebSocket Proxy → Browser Dashboard
```

## Data Flow

### 1. Kafka Topics
- **`prices.ticks`**: SymbolTick messages (individual symbol prices)
- **`prices.pairs`**: PairTick messages (currency pair prices)

### 2. WebSocket Proxy Server (`server/server.js`)
- Consumes from Kafka topics: `prices.ticks` and `prices.pairs`
- Broadcasts JSON messages to all connected WebSocket clients
- Message format:
```json
{
  "topic": "prices.ticks",
  "key": "AAPL",
  "value": {
    "symbol": "AAPL",
    "bid": 150.25,
    "ask": 150.30,
    "bidSize": 100,
    "askSize": 150,
    "timestamp": "2025-10-17T11:30:00.000Z"
  },
  "partition": 0,
  "offset": "123",
  "timestamp": 1697539800000
}
```

### 3. React Dashboard (`src/`)

#### WebSocket Hook (`src/hooks/useWebSocket.ts`)
- Connects to `ws://localhost:8080`
- Receives Kafka messages via WebSocket
- Processes two message types:
  - **SymbolTick** (`prices.ticks`): Individual symbol prices
  - **PairTick** (`prices.pairs`): Currency pair prices
- Calculates mid-price: `(bid + ask) / 2`
- Updates Zustand store with:
  - Market data (symbol, price, volume, timestamp)
  - Chart data points (time, value)

#### Dashboard Store (`src/stores/dashboardStore.ts`)
- **marketData**: Array of current prices for all symbols
- **chartData**: Time-series data for chart rendering (max 1000 points)
- **selectedSymbol**: Currently selected symbol to display
- **isConnected**: WebSocket connection status

#### Components

##### TradingChart (`src/components/TradingChartSimple.tsx`)
- Renders real-time price chart using HTML5 Canvas
- Shows:
  - Line chart with gradient fill
  - High/Low prices
  - Current price
  - Data point count
- Auto-updates when `chartData` changes

##### MarketDataTable (`src/components/MarketDataTable.tsx`)
- Displays list of all symbols with prices
- Shows:
  - Symbol name
  - Current price (4 decimal places)
  - Price change and percentage
  - Volume
  - Time since last update
- Click a row to select that symbol

##### ConnectionStatus (`src/components/ConnectionStatus.tsx`)
- Shows WebSocket connection state
- Green: Connected
- Red: Disconnected

## Starting the System

### 1. Start Kafka Broker
Make sure your Kafka server is running with:
- Broker: `localhost:9092`
- Topics: `prices.ticks` and `prices.pairs`

### 2. Start WebSocket Proxy
```bash
cd server
npm start
```
This starts the proxy on `ws://localhost:8080`

### 3. Start React Dashboard
```bash
npm run dev
```
This starts Vite dev server on `http://localhost:5173` or `5174`

### 4. Start Your C# Publisher
Run your C# application that publishes to Kafka topics

## Debugging

### Check WebSocket Connection
Open browser console (F12) and look for:
```
🔌 Connecting to WebSocket: ws://localhost:8080
✅ WebSocket connected
```

### Check Data Reception
When messages arrive, you'll see:
```
📊 SymbolTick: AAPL Bid: 150.25 Ask: 150.30 Mid: 150.2750
📈 PairTick: BTC/ETH Bid: 18.5 Ask: 18.6 Mid: 18.5500
```

### Check Server Console
The WebSocket proxy shows:
```
📤 [prices.ticks] AAPL → 1 client(s)
📤 [prices.pairs] BTC/ETH → 1 client(s)
```

## Performance Optimizations

1. **React.memo**: All components are memoized to prevent unnecessary re-renders
2. **Zustand**: Lightweight state management with selective subscriptions
3. **Chart Data Limit**: Maximum 1000 data points to prevent memory issues
4. **Canvas Rendering**: Hardware-accelerated chart rendering
5. **WebSocket**: Binary-efficient real-time communication

## Next Steps

1. ✅ Data is now flowing from Kafka → WebSocket → Dashboard
2. ✅ Charts update in real-time
3. ✅ Market data table shows all symbols

### Enhancements You Can Add:
- Add price change calculations (track previous prices)
- Add multiple chart types (candlestick, area, etc.)
- Add time range selectors (1m, 5m, 1h, etc.)
- Add symbol search/filter
- Add alerts/notifications for price changes
- Export data to CSV
- Add more technical indicators

Enjoy your real-time trading dashboard! 🚀
