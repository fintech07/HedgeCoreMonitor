# HedgeCore Viewer - Real-Time Trading Dashboard

A high-performance, real-time trading dashboard built with modern web technologies optimized for speed and scalability.

## 🚀 Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite (Rolldown)** - Ultra-fast build tool with experimental Rolldown bundler
- **@vitejs/plugin-react** - Optimized React plugin for Rolldown
- **Zustand** - Lightweight state management (< 1KB)
- **Lightweight Charts** - TradingView's high-performance charting library (ready to integrate)
- **@tanstack/react-virtual** - Virtualization for large datasets
- **web-vitals** - Performance monitoring

## ✨ Features

- ⚡ **Real-time data updates** with minimal re-renders
- 📊 **Financial charts** optimized for 60fps performance
- 🎯 **Virtualized tables** for handling thousands of rows
- 🔄 **WebSocket support** (ready for live data integration)
- 📱 **Responsive design** works on all screen sizes
- 🎨 **Modern UI** with dark theme and glassmorphism
- 📈 **Performance monitoring** with Core Web Vitals

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── TradingChartSimple.tsx # Canvas-based chart (demo)
│   ├── MarketDataTable.tsx    # Virtualized market data table
│   └── ConnectionStatus.tsx   # WebSocket connection indicator
├── hooks/              # Custom React hooks
│   ├── useWebSocket.ts        # WebSocket connection management
│   └── usePerformanceMonitor.ts # Performance tracking
├── stores/             # Zustand stores
│   └── dashboardStore.ts      # Global dashboard state
├── App.tsx            # Main application component
├── App.css            # Application styles
└── main.tsx           # Application entry point
```

## 🔧 Configuration

### WebSocket Connection

Update the WebSocket URL in `App.tsx`:

```typescript
useWebSocket({ url: 'wss://your-websocket-server.com' });
```

### Chart Integration

The project includes a simple Canvas-based chart for demonstration. To use the full TradingView Lightweight Charts:

1. Uncomment the import in `App.tsx`
2. Update the chart component to use the proper lightweight-charts v5 API
3. Configure chart options as needed

## 🎯 Performance Optimizations

1. **React.memo()** - Prevents unnecessary re-renders
2. **Zustand** - Minimal state updates, no context re-renders
3. **Canvas rendering** - Hardware-accelerated graphics
4. **Virtual scrolling** - Only renders visible rows
5. **Code splitting** - Lazy loading with React.lazy()
6. **SWC compiler** - 20x faster than Babel
7. **Vite + Rolldown** - Instant HMR and optimized builds

## 📊 Adding Real Data

Replace the mock data generator in `App.tsx`:

```typescript
// Remove mock data
// const generateMockData = () => {...}

// Use real WebSocket data instead
const { sendMessage } = useWebSocket({ url: 'wss://your-api.com' });
```

## 🎨 Customization

### Theme Colors

Edit CSS variables in `App.css` for custom theming.

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code with ESLint

## 🤝 Best Practices

- Use TypeScript strict mode
- Follow React 19 best practices
- Implement proper error boundaries
- Clean up effects and subscriptions
- Monitor performance with web-vitals
- Keep bundle size small

## 📄 License

MIT
