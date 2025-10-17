# Interactive OHLC Chart Features

## 🎯 TradingView-Style Features Implemented

### 1. **Mouse Wheel Zoom** 🔍
- **Action**: Scroll mouse wheel up/down over the chart
- **Effect**: Zoom in (scroll up) or zoom out (scroll down)
- **Range**: Bar width adjusts from 2px to 50px
- **Behavior**: Automatically recalculates visible bars based on zoom level

### 2. **Click & Drag Panning** 🖱️
- **Action**: Click and hold, then drag left/right
- **Effect**: Pan through historical data
- **Cursor**: Changes to "grabbing" hand during drag
- **Bounds**: Prevents panning beyond available data

### 3. **Interactive Crosshair** ✛
- **Action**: Move mouse over chart
- **Display**: 
  - Dashed crosshair lines (vertical & horizontal)
  - Live price label at cursor position
  - Blue label showing exact price value
- **Precision**: 4 decimal places

### 4. **Auto-Scroll Mode** ⏩
- **Default**: ON (enabled by default)
- **Behavior**: Automatically scrolls to show latest bars as new data arrives
- **Toggle**: Click "⏩ Auto" button to enable/disable
- **Smart Disable**: Automatically turns off when user zooms or pans

### 5. **Control Buttons** 🎮
Located in top-right corner:

#### Auto-Scroll Toggle
- **Button**: "⏩ Auto" (blue) / "⏸ Manual" (gray)
- **Function**: Enable/disable automatic scrolling to latest data

#### Jump to Latest
- **Button**: "⏭"
- **Function**: Instantly jump to the most recent bars

#### Reset Zoom
- **Button**: "🔍"
- **Function**: Reset to default zoom level (8px bars, 100 bars visible)

### 6. **Real-Time Status Display** 📊
Bottom-right info shows:
- Symbol name (e.g., "EURUSD")
- Timeframe ("1m")
- Visible bar range (e.g., "1-100/245")
- Current zoom level (e.g., "8.0px")

### 7. **Price Information** 💰
- **High/Low**: Displayed at top-left and bottom-left
- **Latest Close**: Displayed at top-right in color (green/red)
- **Crosshair Price**: Live price at cursor position

### 8. **Visual Features** 🎨
- **Color-Coded Bars**: Green (bullish) / Red (bearish)
- **Hollow/Filled**: Hollow for up, filled for down
- **Grid Background**: Dark theme with subtle grid lines
- **Smooth Rendering**: Canvas-based with retina display support

## 🎹 Keyboard/Mouse Reference

| Action | Effect |
|--------|--------|
| Mouse Wheel Up | Zoom In |
| Mouse Wheel Down | Zoom Out |
| Click + Drag | Pan Chart |
| Mouse Move | Show Crosshair |
| Click Auto Button | Toggle Auto-Scroll |
| Click ⏭ Button | Jump to Latest |
| Click 🔍 Button | Reset Zoom |

## 📈 Technical Details

### Viewport System
- **Viewport State**: Tracks `startIndex`, `barsVisible`, `barWidth`
- **Dynamic Calculation**: Visible bars calculated on-the-fly
- **Efficient Rendering**: Only renders visible bars (not entire dataset)

### Performance Optimizations
- Canvas rendering with `devicePixelRatio` scaling
- React.memo() for component optimization
- useCallback() for event handler stability
- Viewport-based rendering (only visible bars)

### Data Flow
```
Kafka Tick → WebSocket → Store (1m aggregation) → Viewport Filter → Canvas Render
```

## 🚀 Usage Tips

1. **Zoom In**: Scroll up to see more detail on fewer bars
2. **Zoom Out**: Scroll down to see more bars with less detail
3. **Pan History**: Drag right to see older data
4. **Live Mode**: Enable Auto-Scroll to always show latest data
5. **Analysis Mode**: Disable Auto-Scroll to freeze chart and analyze
6. **Quick Reset**: Use 🔍 button to return to default view

## 🎯 Coming Soon (Potential Enhancements)

- [ ] Time axis with formatted timestamps
- [ ] Volume bars below price chart
- [ ] Technical indicators (MA, EMA, RSI, MACD)
- [ ] Drawing tools (trend lines, horizontal lines)
- [ ] Multiple timeframes (1m, 5m, 15m, 1h, 4h, 1d)
- [ ] Order book visualization
- [ ] Alert markers on chart
- [ ] Save/load chart layouts
- [ ] Screenshot/export functionality

---

**Status**: ✅ Production Ready - All core TradingView-style interactions implemented!
