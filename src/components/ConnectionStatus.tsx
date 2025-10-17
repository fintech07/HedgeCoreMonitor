import { memo } from 'react';
import { useDashboardStore } from '../stores/dashboardStore';

export const ConnectionStatus = memo(() => {
  const isConnected = useDashboardStore((state) => state.isConnected);

  return (
    <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
      <span className="status-indicator"></span>
      <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
    </div>
  );
});

ConnectionStatus.displayName = 'ConnectionStatus';
