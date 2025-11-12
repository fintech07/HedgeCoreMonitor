# Quick Reference: prices.ticks Topic

## Message Format

```typescript
{
  topic: "prices.ticks",
  key: string,      // Symbol name
  value: {
    symbol: string,    // e.g., "EURUSD"
    timestamp: string, // ISO 8601 format
    bid: number,       // Bid price
    ask: number        // Ask price
  }
}
```

## Example Messages

### EURUSD
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

### GBPUSD
```json
{
  "topic": "prices.ticks",
  "key": "GBPUSD",
  "value": {
    "symbol": "GBPUSD",
    "timestamp": "2025-10-20T10:30:45.456Z",
    "bid": 1.2550,
    "ask": 1.2552
  }
}
```

### USDJPY
```json
{
  "topic": "prices.ticks",
  "key": "USDJPY",
  "value": {
    "symbol": "USDJPY",
    "timestamp": "2025-10-20T10:30:45.789Z",
    "bid": 149.50,
    "ask": 149.52
  }
}
```

## Data Processing

### Frontend Calculations
```typescript
// Mid price (used for charts)
midPrice = (bid + ask) / 2

// Spread
spread = ask - bid

// Spread %
spreadPercent = ((ask - bid) / bid) * 100
```

### Console Output Format
```
📊 EURUSD | Bid: 1.0850 | Ask: 1.0852 | Mid: 1.0851
```

## Field Descriptions

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `symbol` | string | Trading pair symbol | "EURUSD" |
| `timestamp` | string | ISO 8601 timestamp | "2025-10-20T10:30:45.123Z" |
| `bid` | number | Bid (sell) price | 1.0850 |
| `ask` | number | Ask (buy) price | 1.0852 |

## Backend Integration

### C# Example
```csharp
public class SymbolTick
{
    public string Symbol { get; set; }
    public string Timestamp { get; set; }
    public decimal Bid { get; set; }
    public decimal Ask { get; set; }
}

var tick = new SymbolTick
{
    Symbol = "EURUSD",
    Timestamp = DateTime.UtcNow.ToString("o"),
    Bid = 1.0850m,
    Ask = 1.0852m
};
```

### Python Example
```python
from datetime import datetime

tick = {
    "symbol": "EURUSD",
    "timestamp": datetime.utcnow().isoformat() + "Z",
    "bid": 1.0850,
    "ask": 1.0852
}
```

### Node.js Example
```javascript
const tick = {
    symbol: "EURUSD",
    timestamp: new Date().toISOString(),
    bid: 1.0850,
    ask: 1.0852
};
```

## Timestamp Formats

### ✅ Supported
- ISO 8601: `"2025-10-20T10:30:45.123Z"`
- ISO 8601 with timezone: `"2025-10-20T10:30:45.123+00:00"`
- Milliseconds since epoch: `1729424445123`

### ❌ Not Recommended
- Human readable: `"Oct 20, 2025 10:30:45"`
- Custom formats: `"20/10/2025 10:30:45"`

## WebSocket Connection

### URL
```
ws://localhost:8080
```

### Connection Flow
```
1. Client connects to ws://localhost:8080
2. Backend sends Kafka messages as WebSocket messages
3. Client receives and processes each tick
4. Updates dashboard in real-time
```

## Validation Checklist

✅ Topic is exactly "prices.ticks"
✅ Symbol is a non-empty string
✅ Timestamp is valid ISO 8601 format
✅ Bid is a positive number
✅ Ask is a positive number
✅ Ask >= Bid (no negative spread)

## Common Issues

### Issue: No data appearing
**Check:**
- WebSocket connection status
- Topic name is exactly "prices.ticks"
- Message format matches exactly
- Console for error messages

### Issue: Wrong timestamp
**Fix:**
- Use ISO 8601 format
- Include timezone (Z for UTC)
- Ensure it's a string, not a number

### Issue: Prices not updating
**Check:**
- Bid and ask are numbers (not strings)
- Values are reasonable (not 0 or NaN)
- Timestamp is current

## Testing Command

### Send test message (if you have kafka-console-producer):
```bash
echo '{"symbol":"EURUSD","timestamp":"2025-10-20T10:30:45.123Z","bid":1.0850,"ask":1.0852}' | \
kafka-console-producer --broker-list localhost:9092 --topic prices.ticks
```

---

**Last Updated:** October 20, 2025
