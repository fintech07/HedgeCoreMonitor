<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Project: High-Performance Real-Time Trading Dashboard

## Tech Stack
- **React 19** with TypeScript
- **Vite** with Rolldown (experimental) for ultra-fast builds
- **@vitejs/plugin-react** with optimized Rolldown integration
- **Zustand** for lightweight state management
- **Lightweight-charts** (TradingView library) for financial charts
- **@tanstack/react-virtual** for virtualized lists
- **web-vitals** for performance monitoring

## Best Practices
- Optimize for real-time data updates with minimal re-renders
- Use React.memo() for expensive components
- Implement virtualization for large datasets
- Use WebSocket connections for real-time data
- Avoid prop drilling - use Zustand for global state
- Keep chart updates at 60fps
- Monitor performance with web-vitals

## Code Style
- Use functional components with hooks
- Prefer named exports over default exports
- Use TypeScript strict mode
- Follow React 19 best practices (concurrent features)
- Use proper error boundaries
- Implement proper cleanup in useEffect
