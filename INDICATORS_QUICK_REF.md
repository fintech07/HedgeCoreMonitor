# 📊 Quick Indicator Reference

## Available Indicators

| Indicator | Purpose | Default Period | Signal |
|-----------|---------|----------------|--------|
| **SMA** | Trend Direction | 20, 50 | Price > SMA = Bullish |
| **EMA** | Responsive Trend | 12, 26 | EMA Cross = Trend Change |
| **Bollinger Bands** | Volatility | 20 (±2σ) | Touch bands = Overbought/Oversold |
| **TRIX** | Momentum | 14 | Rising = Bullish Momentum |
| **RSI** | Overbought/Oversold | 14 | >70 Overbought, <30 Oversold |

## Quick Actions

### Enable Indicators
```
1. Click "📊 Indicators" button (top-right)
2. Check desired indicator boxes
3. View immediately on chart
```

### Common Combinations

**Trend Trading**:
- ✅ SMA(20) + SMA(50)
- ✅ Bollinger Bands
- Strategy: Trade in direction of trend, use BB for entries

**Momentum Trading**:
- ✅ EMA(12) + EMA(26)
- ✅ TRIX
- Strategy: Follow EMA crossovers, confirm with TRIX direction

**Reversal Trading**:
- ✅ Bollinger Bands
- ✅ RSI
- Strategy: BB squeeze + RSI extreme = potential reversal

## Color Legend

| Indicator | Color | Line Style |
|-----------|-------|------------|
| SMA(20) | 🔵 Blue | Solid |
| SMA(50) | 🟠 Orange | Solid |
| EMA(12) | 🟢 Green | Solid |
| EMA(26) | 🔴 Pink | Solid |
| BB Upper | 🔵 Blue | Solid |
| BB Middle | 🔵 Blue | Solid |
| BB Lower | 🔵 Blue | Solid |
| BB Fill | 🔵 Blue | Semi-transparent |
| TRIX | 🟢 Green | Solid (scaled) |
| RSI | 🟣 Purple | Solid (scaled) |

## Keyboard Shortcuts (Future)
- `I` - Toggle indicator panel
- `1-5` - Quick toggle indicators
- `Ctrl+I` - Reset all indicators

## Tips
✨ Start with 2-3 indicators
✨ Use indicators for confirmation, not prediction
✨ More indicators ≠ Better signals
✨ Combine trend + momentum + volatility
✨ Test indicator combinations before trading

## Formula Quick Reference

```
SMA = Sum(Close) / Period

EMA = (Close - EMA_prev) × (2/(Period+1)) + EMA_prev

BB_Middle = SMA(Close, 20)
BB_Upper = BB_Middle + (2 × StdDev)
BB_Lower = BB_Middle - (2 × StdDev)

TRIX = ROC(EMA(EMA(EMA(Close, P), P), P)) × 10000

RSI = 100 - (100 / (1 + AvgGain/AvgLoss))
```

## Performance
- ⚡ Real-time calculation
- ⚡ Canvas-based rendering
- ⚡ Optimized for 1-minute bars
- ⚡ No lag on data updates

---

*For detailed information, see INDICATORS_GUIDE.md*
