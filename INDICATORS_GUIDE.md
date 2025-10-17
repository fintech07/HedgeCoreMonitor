# Technical Indicators Guide

## Overview
Your trading dashboard now supports multiple technical indicators that overlay on the OHLC chart. Click the **📊 Indicators** button in the top-right to open the indicator panel.

## Available Indicators

### 1. Simple Moving Average (SMA)
**Description**: The average price over a specified period, giving equal weight to all prices.

**Default Settings**:
- Periods: 20, 50
- Colors: Blue (#2962FF), Orange (#FF6D00)

**Usage**: 
- Enable SMA checkbox to display
- Multiple periods shown simultaneously with different colors
- Useful for identifying trend direction and support/resistance levels

**Interpretation**:
- Price above SMA = Bullish trend
- Price below SMA = Bearish trend
- SMA crossovers = Potential trend changes

---

### 2. Exponential Moving Average (EMA)
**Description**: Similar to SMA but gives more weight to recent prices, making it more responsive to new information.

**Default Settings**:
- Periods: 12, 26
- Colors: Green (#00E676), Pink (#F50057)

**Usage**:
- Enable EMA checkbox to display
- More sensitive to price changes than SMA
- Popular for short-term trading strategies

**Interpretation**:
- EMA(12) cross above EMA(26) = Bullish signal
- EMA(12) cross below EMA(26) = Bearish signal
- Price bouncing off EMA = Dynamic support/resistance

---

### 3. Bollinger Bands
**Description**: A volatility indicator with three bands - middle (SMA), upper, and lower bands at standard deviations from the middle.

**Default Settings**:
- Period: 20
- Standard Deviation: 2
- Color: Blue (#2962FF)
- Fill Opacity: 10%

**Usage**:
- Enable Bollinger Bands checkbox
- Shows volatility expansion and contraction
- Shaded area between upper and lower bands

**Interpretation**:
- Narrow bands = Low volatility (consolidation)
- Wide bands = High volatility (trending)
- Price touching upper band = Potential overbought
- Price touching lower band = Potential oversold
- Band squeeze = Potential breakout coming

---

### 4. TRIX (Triple Exponential Moving Average)
**Description**: A momentum oscillator that shows the rate of change of a triple exponentially smoothed moving average.

**Default Settings**:
- Period: 14
- Color: Green (#00E676)
- Display: Overlay on price chart (normalized)

**Usage**:
- Enable TRIX checkbox
- Shows momentum direction and strength
- Currently overlaid on price (scaled to fit)

**Interpretation**:
- Rising TRIX = Increasing momentum (bullish)
- Falling TRIX = Decreasing momentum (bearish)
- TRIX crossing zero = Potential trend change

---

### 5. RSI (Relative Strength Index)
**Description**: A momentum oscillator measuring the speed and magnitude of price changes (0-100 scale).

**Default Settings**:
- Period: 14
- Color: Purple (#9C27B0)
- Display: Overlay on price chart (normalized)

**Usage**:
- Enable RSI checkbox
- Measures overbought/oversold conditions
- Currently overlaid on price (scaled to fit)

**Interpretation**:
- RSI > 70 = Overbought (potential reversal down)
- RSI < 30 = Oversold (potential reversal up)
- RSI divergence = Potential trend reversal

---

## Features

### Multiple Indicators Simultaneously
- Enable multiple indicators at once
- Each indicator has distinct colors for easy identification
- Indicators overlay on the price chart

### Color Coding
- Each indicator line has a unique color
- Color legend shown in the indicator panel
- Bollinger Bands have semi-transparent fill

### Performance Optimized
- Indicators calculated only when enabled
- Efficient rendering with Canvas API
- Smooth real-time updates

### Visual Design
- TradingView-inspired styling
- Semi-transparent overlays
- Clear line colors for visibility

---

## How to Use

1. **Open Indicator Panel**: Click the **📊 Indicators** button (top-right)

2. **Enable Indicators**: Check the boxes for desired indicators
   - SMA (Simple Moving Average)
   - EMA (Exponential Moving Average)
   - Bollinger Bands
   - TRIX
   - RSI

3. **View on Chart**: Indicators appear immediately on the chart

4. **Interpret Signals**: Use multiple indicators together for confirmation
   - Example: SMA trend + Bollinger squeeze + TRIX momentum

5. **Close Panel**: Click **📊 Indicators** again to hide the panel

---

## Technical Details

### Calculation Methods

**SMA Formula**:
```
SMA = (P1 + P2 + ... + Pn) / n
```

**EMA Formula**:
```
EMA = (Close - EMA_prev) × Multiplier + EMA_prev
Multiplier = 2 / (period + 1)
```

**Bollinger Bands Formula**:
```
Middle Band = SMA(20)
Upper Band = Middle + (2 × Standard Deviation)
Lower Band = Middle - (2 × Standard Deviation)
```

**TRIX Formula**:
```
EMA1 = EMA(Close, period)
EMA2 = EMA(EMA1, period)
EMA3 = EMA(EMA2, period)
TRIX = ((EMA3 - EMA3_prev) / EMA3_prev) × 10000
```

**RSI Formula**:
```
RS = Average Gain / Average Loss
RSI = 100 - (100 / (1 + RS))
```

---

## Customization (Future)

The indicator system is designed to be extensible. Future enhancements:
- Adjustable periods via UI
- Custom colors
- More indicators (MACD, Stochastic, ATR, etc.)
- Separate panes for oscillators
- Save/load indicator templates
- Alert conditions

---

## Performance Tips

1. **Start with Essential Indicators**: Enable only what you need
2. **Combine Wisely**: Use 2-3 complementary indicators
3. **Watch for Confirmation**: Multiple indicator signals = stronger signal
4. **Adjust to Timeframe**: 1-minute bars work well with shorter MA periods

---

## Troubleshooting

**Indicators not showing?**
- Ensure checkbox is enabled in indicator panel
- Check that enough data exists (some indicators need minimum bars)
- SMA(50) needs at least 50 bars of data

**Indicators look wrong?**
- Each indicator is calculated on close prices
- Some indicators (TRIX, RSI) are normalized to price scale for overlay
- Bollinger Bands should show clear upper/middle/lower bands

**Panel overlapping chart?**
- Panel is positioned top-right with fixed size
- Scroll within panel if needed
- Close panel to see full chart

---

## Files Structure

```
src/
├── components/
│   ├── OHLCChart.tsx          # Main chart with indicator rendering
│   └── IndicatorPanel.tsx     # Indicator control panel UI
├── stores/
│   └── indicatorStore.ts      # Indicator settings state management
└── utils/
    └── indicators.ts          # Indicator calculation algorithms
```

---

## Example Trading Strategy

**Trend Following with Multiple Confirmations**:
1. Enable SMA(20), SMA(50), and Bollinger Bands
2. Look for price above both SMAs (uptrend)
3. Wait for price to touch lower Bollinger Band (pullback)
4. Enter long when price bounces off lower band
5. Exit when price touches upper band or crosses below SMA(20)

This is just an example - always test strategies thoroughly!

---

## Support

For questions or feature requests regarding indicators:
- Check the indicator tooltips in the panel
- Refer to standard technical analysis documentation
- Each indicator has been implemented following industry standards
