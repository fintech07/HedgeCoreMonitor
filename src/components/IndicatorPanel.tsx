import { memo } from 'react';
import { useIndicatorStore } from '../stores/indicatorStore';

export const IndicatorPanel = memo(() => {
  const { settings, updateIndicator, toggleIndicator } = useIndicatorStore();

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

      {/* SMA */}
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
            {settings.sma.periods.map((period, idx) => (
              <label key={idx} style={{ display: 'block', marginBottom: '4px' }}>
                Period {idx + 1}:
                <input
                  type="number"
                  value={period}
                  min={2}
                  max={200}
                  onChange={e => {
                    const newPeriods = [...settings.sma.periods];
                    newPeriods[idx] = Number(e.target.value);
                    updateIndicator('sma', { periods: newPeriods });
                  }}
                  style={{
                    width: '60px',
                    marginLeft: '8px',
                    padding: '2px',
                    borderRadius: '4px',
                    border: '1px solid #2A2E39',
                    background: '#111217',
                    color: '#D1D4DC',
                  }}
                />
              </label>
            ))}
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
            {settings.ema.periods.map((period, idx) => (
              <label key={idx} style={{ display: 'block', marginBottom: '4px' }}>
                Period {idx + 1}:
                <input
                  type="number"
                  value={period}
                  min={2}
                  max={200}
                  onChange={e => {
                    const newPeriods = [...settings.ema.periods];
                    newPeriods[idx] = Number(e.target.value);
                    updateIndicator('ema', { periods: newPeriods });
                  }}
                  style={{
                    width: '60px',
                    marginLeft: '8px',
                    padding: '2px',
                    borderRadius: '4px',
                    border: '1px solid #2A2E39',
                    background: '#111217',
                    color: '#D1D4DC',
                  }}
                />
              </label>
            ))}
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
            <label style={{ display: 'block', marginBottom: '4px' }}>
              Period:
              <input
                type="number"
                value={settings.bollingerBands.period}
                min={2}
                max={200}
                onChange={e =>
                  updateIndicator('bollingerBands', { period: Number(e.target.value) })
                }
                style={{
                  width: '60px',
                  marginLeft: '8px',
                  padding: '2px',
                  borderRadius: '4px',
                  border: '1px solid #2A2E39',
                  background: '#111217',
                  color: '#D1D4DC',
                }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: '4px' }}>
              StdDev:
              <input
                type="number"
                value={settings.bollingerBands.stdDev}
                min={1}
                max={5}
                step={0.1}
                onChange={e =>
                  updateIndicator('bollingerBands', { stdDev: Number(e.target.value) })
                }
                style={{
                  width: '60px',
                  marginLeft: '8px',
                  padding: '2px',
                  borderRadius: '4px',
                  border: '1px solid #2A2E39',
                  background: '#111217',
                  color: '#D1D4DC',
                }}
              />
            </label>
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
            <label style={{ display: 'block', marginBottom: '4px' }}>
              Period:
              <input
                type="number"
                value={settings.trix.period}
                min={2}
                max={100}
                onChange={e =>
                  updateIndicator('trix', { period: Number(e.target.value) })
                }
                style={{
                  width: '60px',
                  marginLeft: '8px',
                  padding: '2px',
                  borderRadius: '4px',
                  border: '1px solid #2A2E39',
                  background: '#111217',
                  color: '#D1D4DC',
                }}
              />
            </label>
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
            <label style={{ display: 'block', marginBottom: '4px' }}>
              Period:
              <input
                type="number"
                value={settings.rsi.period}
                min={2}
                max={100}
                onChange={e =>
                  updateIndicator('rsi', { period: Number(e.target.value) })
                }
                style={{
                  width: '60px',
                  marginLeft: '8px',
                  padding: '2px',
                  borderRadius: '4px',
                  border: '1px solid #2A2E39',
                  background: '#111217',
                  color: '#D1D4DC',
                }}
              />
            </label>
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
