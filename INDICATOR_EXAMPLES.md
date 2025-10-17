# Indicator Usage Examples

## Example 1: Simple Trend Following

### Setup
```
Indicators:
- SMA(20) - Blue line
- SMA(50) - Orange line
```

### Strategy
1. **Identify Trend**
   - Price above both SMAs = Uptrend
   - Price below both SMAs = Downtrend
   - Price between SMAs = Consolidation

2. **Entry Signal**
   - Uptrend: Buy when price pulls back to SMA(20)
   - Downtrend: Sell when price rallies to SMA(20)

3. **Exit Signal**
   - Close when SMA(20) crosses SMA(50)
   - Or price closes on opposite side of SMA(50)

### Visual Cues
- Strong uptrend: Both SMAs sloping up, price well above
- Weak trend: SMAs flattening, price choppy around them
- Trend change: SMA(20) crossing SMA(50)

---

## Example 2: Bollinger Band Squeeze

### Setup
```
Indicators:
- Bollinger Bands (20, 2σ)
- Optional: SMA(50) for trend context
```

### Strategy
1. **Identify Squeeze**
   - Bands narrowing = Low volatility
   - Wait for bands at narrowest point
   - This indicates breakout coming

2. **Breakout Entry**
   - Price breaks above upper band = Buy
   - Price breaks below lower band = Sell
   - Enter in direction of breakout

3. **Exit Signal**
   - Price touches opposite band
   - Or band width starts contracting again

### Visual Cues
- Tight bands: Consolidation, low volatility
- Expanding bands: Breakout occurring, high volatility
- Price at band edges: Potential exhaustion

---

## Example 3: EMA Crossover System

### Setup
```
Indicators:
- EMA(12) - Green line (fast)
- EMA(26) - Pink line (slow)
- Optional: TRIX for momentum confirmation
```

### Strategy
1. **Buy Signal**
   - EMA(12) crosses above EMA(26)
   - TRIX rising (if enabled)
   - Enter long position

2. **Sell Signal**
   - EMA(12) crosses below EMA(26)
   - TRIX falling (if enabled)
   - Close long or enter short

3. **Stay Out**
   - EMAs intertwined (choppy market)
   - Wait for clear separation

### Visual Cues
- Clear green above pink = Strong uptrend
- Clear pink above green = Strong downtrend
- EMAs converging = Trend weakening

---

## Example 4: Multi-Indicator Confirmation

### Setup
```
Indicators:
- SMA(20) - Trend
- Bollinger Bands - Volatility
- RSI - Momentum
```

### Strategy (Buy Example)
1. **Trend Filter**: Price above SMA(20)
2. **Entry Setup**: Price touches lower Bollinger Band
3. **Momentum Confirmation**: RSI below 30 (oversold)
4. **Entry**: When RSI starts rising (divergence from price)
5. **Exit**: Price reaches upper Bollinger Band OR RSI above 70

### Why This Works
- Trend filter keeps you on right side
- BB identifies pullbacks in trend
- RSI confirms oversold condition
- Multiple confirmations = Higher probability

---

## Example 5: Ranging Market Strategy

### Setup
```
Indicators:
- Bollinger Bands (20, 2σ)
- RSI (14)
```

### Strategy
1. **Identify Range**
   - Bollinger Bands parallel (not expanding)
   - Price bouncing between bands
   - No clear trend

2. **Buy Setup**
   - Price at lower Bollinger Band
   - RSI below 40
   - Enter long, target upper band

3. **Sell Setup**
   - Price at upper Bollinger Band
   - RSI above 60
   - Enter short, target lower band

4. **Stop Trading**
   - When bands start expanding (breakout starting)
   - Switch to breakout strategy

---

## Real Chart Reading Tips

### What You'll See

**Strong Uptrend**:
```
Price action:  ╱╱╱╱╱╱
SMA(20):       ___╱╱╱╱╱
SMA(50):       _______╱╱╱
BB Upper:      ___╱╱╱╱╱╱
BB Lower:      ___╱╱╱╱╱
```
- All indicators sloping up
- Price above all moving averages
- Bollinger Bands expanding

**Consolidation**:
```
Price action:  ╱╲╱╲╱╲╱╲
SMA(20):       ________
SMA(50):       ________
BB Upper:      ¯¯¯¯¯¯¯¯
BB Lower:      ________
```
- Flat moving averages
- Price bouncing between bands
- Bands narrowing (squeeze forming)

**Trend Reversal**:
```
Price action:  ╱╱╱╲╲╲╲╲
SMA(20):       ╱╱╱╲╲╲__
SMA(50):       ╱╱╱╱╱╲╲╲
EMA(12) × EMA(26) crossover
```
- Fast MA crosses slow MA
- Price breaks below support
- Momentum (TRIX) turning negative

---

## Common Mistakes to Avoid

❌ **Too Many Indicators**
- Don't enable all at once
- Chart becomes cluttered
- Signals conflict
✅ Use 2-3 complementary indicators

❌ **Ignoring Trend**
- Trading against major trend
- Counter-trend moves are risky
✅ Use SMA(50) as trend filter

❌ **No Confirmation**
- Acting on single indicator
- False signals more common
✅ Wait for 2+ indicators to align

❌ **Wrong Timeframe**
- Using long periods on 1-min chart
- SMA(200) needs 200 minutes of data
✅ Adjust periods to your timeframe

❌ **No Exit Plan**
- Knowing when to enter only
- Holding losers too long
✅ Define exit before entry

---

## Best Practices

### For 1-Minute Timeframe

**Good Period Choices**:
- SMA: 10, 20, 50 (not 200)
- EMA: 9, 12, 26
- Bollinger: 20
- RSI: 14
- TRIX: 14

**Indicators to Combine**:
1. **Scalping**: EMA(9) + EMA(21) + RSI
2. **Swing (intraday)**: SMA(20) + BB + TRIX
3. **Trend Following**: SMA(20) + SMA(50) + EMA(12)

### Testing Your Setup

1. **Enable Indicators**
2. **Watch for 30-60 minutes**
3. **Note signal quality**
4. **Adjust if too many false signals**
5. **Stick with what works**

### Recording Trades

Keep track of:
- Entry signal (which indicators)
- Exit signal (why you closed)
- Profit/Loss
- What worked/didn't work

---

## Quick Decision Matrix

| Market Condition | Best Indicators | Strategy |
|-----------------|----------------|----------|
| Strong Trend | SMA(20), SMA(50) | Trend following |
| Weak Trend | EMA(12), EMA(26), TRIX | Momentum plays |
| Range-bound | Bollinger Bands, RSI | Mean reversion |
| High Volatility | Bollinger Bands | Breakout trading |
| Low Volatility | Bollinger Bands (squeeze) | Wait for breakout |

---

## Next Steps

1. ✅ **Learn One Strategy**: Start with SMA crossover
2. ✅ **Practice Reading**: Enable indicators and just observe
3. ✅ **Paper Trade**: Test without real money
4. ✅ **Journal Results**: Track what signals worked
5. ✅ **Refine Setup**: Adjust based on your experience

Remember: Indicators show what happened, not what will happen. Use them as tools, not crystal balls!
