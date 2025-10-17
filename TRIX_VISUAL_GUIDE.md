# TRIX Indicator Visual Guide

## What You'll See

### Before (Without TRIX)
```
┌──────────────────────────────────────────────────┐
│  📊 Indicators  🔍  ⏭  ⏸ Manual               │
│                                                  │
│  EURUSD  O 1.0850  H 1.0875  L 1.0840  C 1.0860│
│                                                  │
│         ╭───╮                                    │
│         │   │  ╭─╮                               │
│      ╭──╯   ╰──╯ ╰───╮                          │
│  ────┼───────────────┼──── 1.0850              │
│                       ╰╮                         │
│                        ╰╮                        │
│                         ╰─╮                      │
│                           │                      │
│                           ╰─                     │
│                                                  │
│          10:00    10:30    11:00                │
│                                                  │
│  🖱 Drag to Pan | ⚙ Scroll to Zoom             │
└──────────────────────────────────────────────────┘
```

### After (With TRIX Enabled)
```
┌──────────────────────────────────────────────────┐
│  📊 Indicators  🔍  ⏭  ⏸ Manual               │
│                                                  │
│  EURUSD  O 1.0850  H 1.0875  L 1.0840  C 1.0860│
│                                                  │
│         ╭───╮                                    │
│         │   │  ╭─╮                               │
│      ╭──╯   ╰──╯ ╰───╮                          │
│  ────┼───────────────┼──── 1.0850              │
│                       ╰╮                         │
│                        ╰╮                        │
│                         ╰─╮                      │
│                           │                      │
│                           ╰─                     │
│                                                  │
│  🖱 Drag to Pan | ⚙ Scroll to Zoom             │
├──────────────────────────────────────────────────┤ ← Seamless border
│  TRIX(14)                                        │
│                      ╭╮                     0.15 │
│                  ╭───╯╰╮                         │
│  ................╯......╰────────────────  0.00 │ ← Zero line
│              ╭──╯                               │
│          ╭───╯                             -0.15│
│  ────────╯                                       │
└──────────────────────────────────────────────────┘
          ↑                                    ↑
    TRIX line                            Scale values
```

## Key Visual Elements

### TRIX Pane Layout
```
┌─────────────────────────────────────────────────┐
│ TRIX(14)                                   0.15 ← Max value
│                                                 │
│                                                 │
│ ................................        0.00 ← Zero line (dashed)
│                                                 │
│                                                 │
│                                          -0.15 ← Min value
└─────────────────────────────────────────────────┘
  ↑                                            ↑
Label                                    Y-axis scale
```

### Color Scheme
- **Background**: #131722 (Dark blue-gray)
- **TRIX Line**: #00E676 (Green) - 1.5px width
- **Zero Line**: #434651 (Gray) - Dashed, 1px width
- **Scale Labels**: #787B86 (Light gray) - 10px font
- **Scale Ticks**: #2A2E39 (Dark gray) - 4px length
- **Border**: #2A2E39 (Dark gray) - 1px solid

### Dimensions
- **Pane Height**: 100px
- **Chart Width**: Full width minus 70px (price scale)
- **Price Scale**: 70px on right side
- **Top Padding**: 10px
- **Bottom Padding**: 5px

## Interaction

### Mouse Actions
```
Hover over TRIX pane:
  → Crosshair shows on both charts
  → TRIX value at cursor position

Scroll wheel:
  → Zooms both charts simultaneously
  → TRIX bars adjust width to match

Click & Drag:
  → Pans both charts together
  → Time alignment maintained

Auto-scroll ON:
  → Both charts scroll to latest data
  → TRIX follows price chart
```

### Synchronization
```
Price Chart Viewport:
  startIndex: 50
  barsVisible: 100
  barWidth: 8px
         ↓
         ↓ (Shared)
         ↓
TRIX Pane Viewport:
  startIndex: 50  ← Same
  barsVisible: 100 ← Same
  barWidth: 8px   ← Same
```

## Reading the TRIX

### Bullish Signals
```
TRIX above zero line:
│                      ╭────╮
│                  ╭───╯    ╰─╮
│ ................╯............╰──  0.00
│
│  = Bullish momentum
│  = Uptrend confirmed
```

### Bearish Signals
```
TRIX below zero line:
│ ................................  0.00
│              ╭──╮
│          ╭───╯  ╰──╮
│      ╭───╯        ╰────
│
│  = Bearish momentum
│  = Downtrend confirmed
```

### Trend Changes
```
TRIX crossing zero:
│                  ╱
│              ╱───
│ .........╱.................  0.00
│      ╱───
│  ╱───
│
│  = Momentum shift
│  = Potential trend reversal
```

### Divergence (Advanced)
```
Price Chart:          TRIX Chart:
│   ╱╲  ╱╲             │   ╱
│  ╱  ╲╱  ╲            │  ╱
│           ╲  ← High  │ ╱     ← Lower High
│            ╲         │╱
│                      ╱        = Bearish Divergence
                               = Uptrend weakening
```

## Toggle Behavior

### Enable TRIX
```
1. Click "📊 Indicators"
2. Check ☑ TRIX
3. Pane appears with animation
4. Main chart border adjusts
```

### Disable TRIX
```
1. Uncheck ☐ TRIX
2. Pane disappears
3. Main chart border rounds bottom
4. Space reclaimed
```

## Troubleshooting

### TRIX Not Showing?
```
Check:
  ☑ TRIX checkbox enabled in panel?
  ☑ Enough data (needs 42+ bars)?
  ☑ Symbol selected?
  ☑ Data loading complete?
```

### TRIX Line Missing?
```
Possible reasons:
  • Not enough periods (need 3 × period bars)
  • All values null (insufficient data)
  • TRIX range is zero (flat prices)
```

### Scale Issues?
```
If scale looks wrong:
  • Values auto-scale to visible range
  • Zoom in/out to adjust view
  • Reset zoom with 🔍 button
```

## Tips for Best View

1. **Zoom Level**: 50-100 bars visible recommended
2. **Time Period**: Watch 1-2 hours of 1m data
3. **Combined Analysis**: Use with SMA/EMA on price chart
4. **Zero Line**: Focus on crossovers for signals
5. **Trend**: Look for sustained moves above/below zero

## Keyboard Reference (Future)

```
Planned shortcuts:
  T     → Toggle TRIX pane
  Shift+T → TRIX settings
  [ ]   → Adjust TRIX period
  Alt+T → Toggle TRIX zero line
```

---

## Summary

✅ **Separate Pane**: TRIX has dedicated space
✅ **Synchronized**: Moves with main chart
✅ **Auto-Scaling**: Adjusts to data range
✅ **Zero Line**: Clear reference point
✅ **Professional**: Industry-standard layout
✅ **Interactive**: Full mouse support

Enjoy analyzing momentum with the TRIX indicator! 📈
