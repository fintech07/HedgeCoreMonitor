# WebSocket Subscription Update

## Changes Made

Updated the WebSocket subscription to handle the simplified data format from the single topic `prices.ticks`.

---

## Data Format

### Topic: `prices.ticks`

**Message Structure:**
```typescript
{
  topic: "prices.ticks",
  key: "SYMBOL",
  value: {
    symbol: string,
    timestamp: string,
    bid: number,
    ask: number
  }
}
```

**Example:**
```json
{
  "topic": "prices.ticks",
  "key": "EURUSD",
  "value": {
    "symbol": "EURUSD",
    "timestamp": "2025-10-20T10:30:45.123Z",
    "bid": 1.0850,
    "ask": 1.0852
  }
}
```

---

## Files Modified

### 1. `src/types/kafka.ts`

**Before:**
```typescript
export interface SymbolTick {
  symbol: string;
  bid: number;
  ask: number;
  bidSize: number;
  askSize: number;
  timestamp: string;
}

export interface PairTick {
  pairSymbol: string;
  baseSymbol: string;
  quoteSymbol: string;
  hedgeRate: number;
  bid: number;
  ask: number;
  timestamp: string;
}
```

**After:**
```typescript
// Data format: Symbol, Timestamp, Bid, Ask
export interface SymbolTick {
  symbol: string;
  timestamp: string;
  bid: number;
  ask: number;
}
```

**Changes:**
- ✅ Removed `bidSize` and `askSize` fields
- ✅ Removed `PairTick` interface (no longer used)
- ✅ Simplified to 4 fields: symbol, timestamp, bid, ask
- ✅ Added clear comment about data format

---

### 2. `src/hooks/useWebSocket.ts`

**Changes:**

#### Imports
```typescript
// Before:
import type { SymbolTick, PairTick } from '../types/kafka';

// After:
import type { SymbolTick } from '../types/kafka';
```

#### KafkaMessage Interface
```typescript
// Before:
interface KafkaMessage {
  topic: string;
  key: string;
  value: SymbolTick | PairTick;
}

// After:
interface KafkaMessage {
  topic: string;
  key: string;
  value: SymbolTick;
}
```

#### Message Processing
```typescript
// Before:
if (message.topic === 'prices.ticks') {
  const tick = message.value as SymbolTick;
  // ... used tick.bidSize and tick.askSize
}

// After:
if (message.topic === 'prices.ticks') {
  const tick = message.value;
  // ... only uses tick.symbol, tick.timestamp, tick.bid, tick.ask
  // Sets bidSize, askSize, volume to 0 (not available)
}
```

**Key Updates:**
- ✅ Removed `PairTick` import
- ✅ Simplified `KafkaMessage` value type to only `SymbolTick`
- ✅ Removed references to `bidSize` and `askSize`
- ✅ Set unavailable fields (bidSize, askSize, volume) to 0
- ✅ Removed comment about "Ignore prices.pairs messages" (no longer relevant)

---

## What Still Works

### ✅ Market Data Updates
- Symbol name
- Bid price
- Ask price
- Mid price (calculated: (bid + ask) / 2)
- Timestamp

### ✅ Chart Updates
- Real-time price chart with mid price
- OHLC 1-minute bar aggregation
- All technical indicators (SMA, EMA, Bollinger Bands, TRIX)

### ✅ Interactive Features
- Zoom and pan
- Crosshair
- Auto-scroll
- Symbol selection
- Multi-chart view

---

## What's Not Available (Due to Simplified Format)

### ❌ Size Information
- `bidSize` → Set to 0
- `askSize` → Set to 0
- `volume` → Set to 0

**Impact:** Volume-related features won't show meaningful data

### ❌ Pair/Hedge Information
- No `prices.pairs` topic handling
- No pair symbol data
- No hedge rate calculations

**Impact:** If you had pair-based features, they won't work

---

## Console Output

When receiving messages, you'll see:
```
📊 EURUSD | Bid: 1.0850 | Ask: 1.0852 | Mid: 1.0851
📊 GBPUSD | Bid: 1.2550 | Ask: 1.2552 | Mid: 1.2551
📊 USDJPY | Bid: 149.50 | Ask: 149.52 | Mid: 149.51
```

---

## Backend Requirements

Your Kafka producer should send messages in this format:

```csharp
// C# example
var message = new {
    topic = "prices.ticks",
    key = symbol,
    value = new {
        symbol = symbol,
        timestamp = DateTime.UtcNow.ToString("o"), // ISO 8601
        bid = bidPrice,
        ask = askPrice
    }
};
```

```json
// JSON example
{
  "topic": "prices.ticks",
  "key": "EURUSD",
  "value": {
    "symbol": "EURUSD",
    "timestamp": "2025-10-20T10:30:45.123Z",
    "bid": 1.0850,
    "ask": 1.0852
  }
}
```

---

## Testing

### Verify Subscription
1. Open browser console (F12)
2. Look for: `✅ WebSocket connected`
3. Watch for: `📊 SYMBOL | Bid: X.XXXX | Ask: X.XXXX | Mid: X.XXXX`

### Check Data Flow
- Market data table should update with bid/ask prices
- Chart should show real-time price updates
- OHLC bars should aggregate every minute
- Technical indicators should calculate

### Troubleshooting

**No data showing?**
- Check WebSocket connection status (top-right indicator)
- Verify backend is sending to `prices.ticks` topic
- Check console for error messages
- Ensure message format matches exactly

**Wrong prices?**
- Verify bid/ask are numbers (not strings)
- Check timestamp format is valid
- Ensure symbol names match exactly

---

## Summary

✅ **Simplified Types**: Only 4 fields per tick (symbol, timestamp, bid, ask)
✅ **Single Topic**: Only handles `prices.ticks`
✅ **Clean Code**: Removed unused PairTick and size fields
✅ **Maintained Features**: All charting and indicators still work
✅ **Zero Errors**: TypeScript compilation successful

The WebSocket subscription is now aligned with your simplified data format! 🚀
