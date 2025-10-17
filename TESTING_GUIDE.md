# Testing Your Real-Time Dashboard

## Quick Test Checklist

### 1. Check WebSocket Proxy Server
```bash
cd server
npm start
```

**Expected Output:**
```
🚀 Starting Kafka WebSocket Proxy Server...
🔌 Connecting to Kafka...
✅ Connected to Kafka
📥 Subscribing to topics: prices.ticks, prices.pairs
✅ Subscribed to topics
🎧 Starting to consume messages...
```

### 2. Check React Dashboard
```bash
npm run dev
```

**Expected Output:**
```
ROLLDOWN-VITE v7.1.14  ready in XXX ms
➜  Local:   http://localhost:5173/
```

### 3. Open Dashboard in Browser
1. Navigate to `http://localhost:5173/` (or the port shown)
2. Open DevTools (F12) → Console tab

**Expected Console Output:**
```
🔌 Connecting to WebSocket: ws://localhost:8080
✅ WebSocket connected
```

### 4. Start Your C# Kafka Publisher
When your C# app publishes messages, you should see:

**Browser Console:**
```
📊 SymbolTick: AAPL Bid: 150.25 Ask: 150.30 Mid: 150.2750
📈 PairTick: BTC/ETH Bid: 18.5 Ask: 18.6 Mid: 18.5500
```

**Server Console:**
```
📤 [prices.ticks] AAPL → 1 client(s)
📤 [prices.pairs] BTC/ETH → 1 client(s)
```

**Dashboard UI:**
- Chart starts drawing with price data
- Market Data Table shows symbols and prices
- Connection indicator turns green
- Price updates in real-time

## Troubleshooting

### Problem: WebSocket won't connect
**Solution:** Make sure the proxy server is running on port 8080
```bash
cd server
npm start
```

### Problem: No data appearing
**Possible causes:**
1. C# publisher not publishing to correct topics
   - Check topic names: `prices.ticks` and `prices.pairs` (plural)
2. Kafka not running
   - Verify Kafka is running on `localhost:9092`
3. Messages published before consumer started
   - Consumer only reads new messages (fromBeginning: false)
   - Restart your C# publisher after starting the proxy

### Problem: Chart not updating
**Check:**
1. Browser console for JavaScript errors
2. DevTools → Network tab → WS (WebSocket) → Check messages
3. Verify data format matches TypeScript types

### Problem: "Waiting for market data..."
**This is normal if:**
- No messages have been published yet
- Proxy server just started (waiting for new messages)

**Action:** Publish some test messages from your C# app

## Verify Data Format

### Your C# Publisher Should Send:

**SymbolTick (Topic: prices.ticks)**
```json
{
  "symbol": "AAPL",
  "bid": 150.25,
  "ask": 150.30,
  "bidSize": 100,
  "askSize": 150,
  "timestamp": "2025-10-17T11:30:00.000Z"
}
```

**PairTick (Topic: prices.pairs)**
```json
{
  "pairSymbol": "BTC/ETH",
  "baseSymbol": "BTC",
  "quoteSymbol": "ETH",
  "hedgeRate": 0.05,
  "bid": 18.5,
  "ask": 18.6,
  "timestamp": "2025-10-17T11:30:00.000Z"
}
```

## Success Indicators

✅ **Everything is working when you see:**
1. Green "Connected" indicator in dashboard header
2. Chart showing price line
3. Market Data Table populated with symbols
4. Prices updating in real-time
5. Console showing tick messages
6. Server showing broadcast messages

## Performance Check

Monitor the browser console for any warnings about:
- Memory usage (should stay stable)
- FPS drops (chart should render smoothly)
- WebSocket message backlog

If everything looks good, congratulations! Your real-time trading dashboard is working! 🎉

## Next: Customize

Now you can:
- Add more symbols
- Customize chart appearance
- Add technical indicators
- Implement price alerts
- Add data export features
- Enhance the UI/UX
