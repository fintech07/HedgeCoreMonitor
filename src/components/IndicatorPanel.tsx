import { memo } from 'react';
import { useIndicatorStore } from '../stores/indicatorStore';

export const IndicatorPanel = memo(() => {
  const { settings, toggleIndicator } = useIndicatorStore();

  return (
    <div style={{
      position: 'absolute',
      top: '50px',
      right: '8px',
      zIndex: 10,
      background: '#1C1E27',
      border: '1px solid #2A2E39',
      borderRadius: '6px',
      padding: '12px',
      maxWidth: '280px',
      maxHeight: '400px',
      overflowY: 'auto',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{
        fontSize: '12px',
        fontWeight: 600,
        color: '#D1D4DC',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        📊 Indicators
      </div>

      {/* Moving Averages */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '11px',
          color: '#D1D4DC',
          cursor: 'pointer',
          marginBottom: '6px',
        }}>
          <input
            type="checkbox"
            checked={settings.sma.enabled}
            onChange={() => toggleIndicator('sma')}
            style={{ cursor: 'pointer' }}
          />
          <span style={{ fontWeight: 500 }}>SMA (Simple Moving Average)</span>
        </label>
        {settings.sma.enabled && (
          <div style={{ marginLeft: '24px', fontSize: '10px', color: '#787B86' }}>
            <div>Periods: {settings.sma.periods.join(', ')}</div>
            <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
              {settings.sma.periods.map((period, i) => (
                <div key={i} style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: settings.sma.colors[i],
                  borderRadius: '2px',
                  border: '1px solid #2A2E39',
                }} title={`SMA ${period}`} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* EMA */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '11px',
          color: '#D1D4DC',
          cursor: 'pointer',
          marginBottom: '6px',
        }}>
          <input
            type="checkbox"
            checked={settings.ema.enabled}
            onChange={() => toggleIndicator('ema')}
            style={{ cursor: 'pointer' }}
          />
          <span style={{ fontWeight: 500 }}>EMA (Exponential Moving Average)</span>
        </label>
        {settings.ema.enabled && (
          <div style={{ marginLeft: '24px', fontSize: '10px', color: '#787B86' }}>
            <div>Periods: {settings.ema.periods.join(', ')}</div>
            <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
              {settings.ema.periods.map((period, i) => (
                <div key={i} style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: settings.ema.colors[i],
                  borderRadius: '2px',
                  border: '1px solid #2A2E39',
                }} title={`EMA ${period}`} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bollinger Bands */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '11px',
          color: '#D1D4DC',
          cursor: 'pointer',
          marginBottom: '6px',
        }}>
          <input
            type="checkbox"
            checked={settings.bollingerBands.enabled}
            onChange={() => toggleIndicator('bollingerBands')}
            style={{ cursor: 'pointer' }}
          />
          <span style={{ fontWeight: 500 }}>Bollinger Bands</span>
        </label>
        {settings.bollingerBands.enabled && (
          <div style={{ marginLeft: '24px', fontSize: '10px', color: '#787B86' }}>
            <div>Period: {settings.bollingerBands.period}</div>
            <div>Std Dev: {settings.bollingerBands.stdDev}</div>
            <div style={{
              marginTop: '4px',
              padding: '4px 6px',
              background: `${settings.bollingerBands.upperColor}${Math.round(settings.bollingerBands.fillOpacity * 255).toString(16).padStart(2, '0')}`,
              borderRadius: '2px',
              border: `1px solid ${settings.bollingerBands.upperColor}`,
            }}>
              Band Fill
            </div>
          </div>
        )}
      </div>

      {/* TRIX */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '11px',
          color: '#D1D4DC',
          cursor: 'pointer',
          marginBottom: '6px',
        }}>
          <input
            type="checkbox"
            checked={settings.trix.enabled}
            onChange={() => toggleIndicator('trix')}
            style={{ cursor: 'pointer' }}
          />
          <span style={{ fontWeight: 500 }}>TRIX</span>
        </label>
        {settings.trix.enabled && (
          <div style={{ marginLeft: '24px', fontSize: '10px', color: '#787B86' }}>
            <div>Period: {settings.trix.period}</div>
            <div style={{
              marginTop: '4px',
              width: '40px',
              height: '2px',
              backgroundColor: settings.trix.color,
            }} />
          </div>
        )}
      </div>

      {/* RSI */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '11px',
          color: '#D1D4DC',
          cursor: 'pointer',
          marginBottom: '6px',
        }}>
          <input
            type="checkbox"
            checked={settings.rsi.enabled}
            onChange={() => toggleIndicator('rsi')}
            style={{ cursor: 'pointer' }}
          />
          <span style={{ fontWeight: 500 }}>RSI (Relative Strength Index)</span>
        </label>
        {settings.rsi.enabled && (
          <div style={{ marginLeft: '24px', fontSize: '10px', color: '#787B86' }}>
            <div>Period: {settings.rsi.period}</div>
            <div style={{
              marginTop: '4px',
              width: '40px',
              height: '2px',
              backgroundColor: settings.rsi.color,
            }} />
          </div>
        )}
      </div>

      <div style={{
        marginTop: '12px',
        paddingTop: '12px',
        borderTop: '1px solid #2A2E39',
        fontSize: '9px',
        color: '#434651',
        textAlign: 'center',
      }}>
        Indicators overlay on price chart
      </div>
    </div>
  );
});

IndicatorPanel.displayName = 'IndicatorPanel';
