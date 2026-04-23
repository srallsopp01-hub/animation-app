/* Variation 1 — Studio (dark tactical).
   Dark green pitch, cyan accent, IBM Plex Sans + JetBrains Mono.
   Shows the full editor UI at 1440×900 desktop size. */

const { useState: useStateS, useMemo: useMemoS } = React;

const STUDIO_PALETTE = {
  bg:          '#0d1117',
  bgElev:      '#161b22',
  bgElev2:     '#21262d',
  text:        '#e6edf3',
  textMute:    '#8b949e',
  textDim:     '#6e7681',
  border:      '#30363d',
  borderStrong:'#484f58',
  accent:      '#00d4aa',   /* cyan-teal */
  accentHot:   '#f78166',
  home:        '#00d4aa',
  away:        '#f78166',
  ball:        '#ffd700',
  arrowRun:    '#ffffff',
  arrowPass:   'rgba(255,255,255,0.80)',
  arrowKick:   '#ffd700',
  homeIsLight: false,
};

function StudioApp() {
  const p = STUDIO_PALETTE;
  const [currentIdx, setCurrentIdx] = useStateS(1);
  const [showNames, setShowNames] = useStateS(true);
  const [showArrows, setShowArrows] = useStateS(true);
  const [showZones, setShowZones] = useStateS(true);
  const [activeTool, setActiveTool] = useStateS('select');
  const [selectedN, setSelectedN] = useStateS(null);

  const phase = PHASES[currentIdx];
  const actors = useMemoS(() => actorsForPhase(currentIdx), [currentIdx]);

  const mono = { fontFamily: '"JetBrains Mono","Fira Code",monospace', letterSpacing: '0.14em', textTransform: 'uppercase' };
  const sans = { fontFamily: '"IBM Plex Sans","Inter",system-ui,sans-serif' };

  const tools = [
    { id: 'select', icon: '↖', label: 'Select' },
    { id: 'run',    icon: '→', label: 'Run' },
    { id: 'pass',   icon: '⤳', label: 'Pass' },
    { id: 'kick',   icon: '⤴', label: 'Kick' },
    { id: 'zone',   icon: '□', label: 'Zone' },
    { id: 'note',   icon: '✎', label: 'Note' },
  ];

  return (
    <div style={{ width: 1440, height: 900, background: p.bg, color: p.text, display: 'flex', flexDirection: 'column', ...sans }}>

      {/* TopBar */}
      <div style={{
        height: 52, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px',
        background: p.bgElev, borderBottom: `1px solid ${p.border}`, flex: 'none',
      }}>
        {/* Wordmark */}
        <div style={{
          width: 34, height: 34, background: p.accent, color: '#0a0a0a',
          display: 'grid', placeItems: 'center',
          fontFamily: '"IBM Plex Sans"', fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em',
        }}>P</div>

        {/* Match card */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '0 14px', height: 36, background: p.bgElev2,
          border: `1px solid ${p.border}`, borderRadius: 2,
        }}>
          <span style={{ ...mono, fontSize: 11, color: p.textMute }}>IRE</span>
          <span style={{ fontWeight: 700, fontSize: 13, color: p.text, letterSpacing: '0.04em' }}>22–19</span>
          <span style={{ ...mono, fontSize: 11, color: p.textMute }}>NZL</span>
          <div style={{ width: 1, height: 18, background: p.border, margin: '0 4px' }} />
          <span style={{ ...mono, fontSize: 10, color: p.accent }}>● LIVE</span>
          <span style={{ ...mono, fontSize: 10, color: p.textMute }}>Q3 58:14</span>
        </div>

        {/* Play title */}
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ ...mono, fontSize: 9, padding: '2px 7px', background: p.bgElev2, border: `1px solid ${p.borderStrong}`, color: p.textMute }}>PLAYBOOK</span>
          <span style={{ fontSize: 13, color: p.text, fontWeight: 500 }}>LO7 — off the top to 10</span>
        </div>
        <div style={{ flex: 1 }} />

        {/* Controls */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[['Names', showNames, setShowNames], ['Arrows', showArrows, setShowArrows], ['Zones', showZones, setShowZones]].map(([l, v, set]) => (
            <button key={l} onClick={() => set(!v)} style={{
              padding: '4px 10px', borderRadius: 2, border: `1px solid ${v ? p.accent : p.border}`,
              background: v ? `${p.accent}18` : 'transparent', color: v ? p.accent : p.textMute,
              cursor: 'pointer', ...mono, fontSize: 9,
            }}>{l}</button>
          ))}
        </div>
        <div style={{ width: 1, height: 24, background: p.border, margin: '0 6px' }} />
        <button style={{
          padding: '0 14px', height: 34, background: p.accent, color: '#0a0a0a',
          border: 'none', borderRadius: 2, cursor: 'pointer',
          ...mono, fontSize: 10, fontWeight: 700,
        }}>↑ Share</button>
        <button style={{
          padding: '0 14px', height: 34, background: 'transparent', color: p.text,
          border: `1px solid ${p.borderStrong}`, borderRadius: 2, cursor: 'pointer',
          ...mono, fontSize: 10,
        }}>Export</button>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

        {/* Left sidebar */}
        <div style={{ width: 52, background: p.bgElev, borderRight: `1px solid ${p.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0', gap: 4, flex: 'none' }}>
          {tools.map(t => (
            <button key={t.id} title={t.label} onClick={() => setActiveTool(t.id)} style={{
              width: 38, height: 38, background: activeTool === t.id ? `${p.accent}18` : 'transparent',
              border: `1px solid ${activeTool === t.id ? p.accent : 'transparent'}`,
              color: activeTool === t.id ? p.accent : p.textMute,
              borderRadius: 2, cursor: 'pointer', fontSize: 16, display: 'grid', placeItems: 'center',
            }}>{t.icon}</button>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ width: 30, height: 1, background: p.border, margin: '4px 0' }} />
          {/* Formation button */}
          <button title="Formations" style={{
            width: 38, height: 38, background: 'transparent', border: `1px solid ${p.border}`,
            color: p.textMute, borderRadius: 2, cursor: 'pointer', fontSize: 12,
            display: 'grid', placeItems: 'center',
          }}>⊞</button>
        </div>

        {/* Canvas */}
        <div style={{ flex: 1, background: '#0a0f0d', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Coach cue bar */}
          {phase.cue && (
            <div style={{
              padding: '8px 20px', background: p.bgElev, borderBottom: `1px solid ${p.border}`,
              display: 'flex', alignItems: 'center', gap: 14, flex: 'none',
            }}>
              <span style={{ ...mono, color: p.accent, fontWeight: 700, fontSize: 9 }}>COACH CUE</span>
              <span style={{ fontFamily: '"IBM Plex Sans"', fontSize: 13, color: p.text, letterSpacing: '0.01em' }}>{phase.cue}</span>
            </div>
          )}
          <div style={{ flex: 1, display: 'grid', placeItems: 'center' }}>
            <Pitch
              w={960} h={620}
              theme="studio"
              scene={{
                actors: actors,
                arrows: showArrows ? phase.arrows.map(ar => ({
                  type: ar.type,
                  fromX: ar.from.x, fromY: ar.from.y,
                  toX: ar.to.x, toY: ar.to.y,
                  cpX: ar.cp?.x, cpY: ar.cp?.y,
                })) : [],
                zones: showZones && phase.zone ? [{
                  shape: 'rect', x: phase.zone.x, y: phase.zone.y,
                  w: phase.zone.w, h: phase.zone.h,
                  color: 'rgba(0,212,170,0.85)', label: phase.zone.label,
                }] : [],
              }}
              showNames={showNames}
              homeColor={p.home}
              awayColor={p.away}
            />
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ width: 240, background: p.bgElev, borderLeft: `1px solid ${p.border}`, display: 'flex', flexDirection: 'column', flex: 'none' }}>
          {/* Phase info */}
          <div style={{ padding: '14px 14px 10px', borderBottom: `1px solid ${p.border}` }}>
            <div style={{ ...mono, color: p.textMute, fontSize: 9 }}>Phase {String(currentIdx + 1).padStart(2, '0')} / 07</div>
            <div style={{ fontFamily: '"IBM Plex Sans"', fontSize: 16, fontWeight: 600, color: p.text, marginTop: 4 }}>{phase.name}</div>
          </div>

          {/* Phase list */}
          <div style={{ flex: 1, overflow: 'auto' }}>
            {PHASES.map((ph, i) => {
              const isActive = i === currentIdx;
              return (
                <button key={ph.id} onClick={() => setCurrentIdx(i)} style={{
                  width: '100%', textAlign: 'left', background: isActive ? p.bgElev2 : 'transparent',
                  border: 'none', borderLeft: `3px solid ${isActive ? p.accent : 'transparent'}`,
                  padding: '10px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <div style={{
                    width: 22, height: 22, background: isActive ? p.accent : p.bgElev2, borderRadius: 2,
                    display: 'grid', placeItems: 'center',
                    color: isActive ? '#0a0a0a' : p.textMute,
                    fontFamily: '"IBM Plex Sans"', fontSize: 11, fontWeight: 700,
                    flex: 'none',
                  }}>{String(i + 1).padStart(2, '0')}</div>
                  <span style={{ fontSize: 12, color: isActive ? p.text : p.textMute }}>{ph.name}</span>
                </button>
              );
            })}
          </div>

          {/* On-ball panel */}
          <div style={{ borderTop: `2px solid ${p.accent}`, padding: '12px 14px' }}>
            <div style={{ ...mono, color: p.accent, fontWeight: 700, fontSize: 9, marginBottom: 8 }}>ON THE BALL</div>
            {phase.onBall ? (() => {
              const r = ROSTER_IRE.find(x => x.n === phase.onBall);
              return r ? (
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{
                    width: 44, height: 44, background: p.accent, color: '#0a0a0a',
                    display: 'grid', placeItems: 'center', borderRadius: 2, flex: 'none',
                    fontFamily: '"IBM Plex Sans"', fontWeight: 700, fontSize: 20,
                  }}>{r.n}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: p.text }}>{r.name}</div>
                    <div style={{ ...mono, color: p.textMute, fontSize: 8, marginTop: 2 }}>{r.pos}</div>
                    <div style={{ ...mono, color: p.textDim || p.textMute, fontSize: 8, marginTop: 1 }}>{r.role}</div>
                  </div>
                </div>
              ) : null;
            })() : (
              <div style={{
                height: 48, border: `1px dashed ${p.borderStrong}`, borderRadius: 2,
                display: 'grid', placeItems: 'center', color: p.textMute,
                ...mono, fontSize: 9,
              }}>No ball carrier</div>
            )}
          </div>
        </div>
      </div>

      {/* Phase timeline */}
      <div style={{
        height: 68, background: p.bgElev, borderTop: `1px solid ${p.border}`,
        display: 'flex', alignItems: 'center', gap: 0, padding: '0 16px', flex: 'none',
      }}>
        {/* Transport */}
        <div style={{ display: 'flex', gap: 6, marginRight: 16 }}>
          <button onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))} style={{
            width: 30, height: 30, background: 'transparent', border: `1px solid ${p.borderStrong}`,
            color: p.text, borderRadius: 2, cursor: 'pointer', fontSize: 11,
          }}>◀</button>
          <button style={{
            width: 30, height: 30, background: p.accent, border: 'none',
            color: '#0a0a0a', borderRadius: 2, cursor: 'pointer', fontSize: 11, fontWeight: 700,
          }}>▶</button>
          <button onClick={() => setCurrentIdx(Math.min(PHASES.length - 1, currentIdx + 1))} style={{
            width: 30, height: 30, background: 'transparent', border: `1px solid ${p.borderStrong}`,
            color: p.text, borderRadius: 2, cursor: 'pointer', fontSize: 11,
          }}>▶</button>
        </div>

        {/* Phase markers */}
        <div style={{ flex: 1, display: 'flex', gap: 0, alignItems: 'center', position: 'relative' }}>
          {/* Progress track */}
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 2, background: p.border, transform: 'translateY(-50%)' }}>
            <div style={{ width: `${(currentIdx / (PHASES.length - 1)) * 100}%`, height: '100%', background: p.accent }} />
          </div>
          {PHASES.map((ph, i) => {
            const isPast = i < currentIdx;
            const isActive = i === currentIdx;
            return (
              <button key={ph.id} onClick={() => setCurrentIdx(i)} style={{
                flex: 1, background: 'transparent', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '4px 0',
                position: 'relative', zIndex: 1,
              }}>
                <div style={{
                  width: 10, height: 10, borderRadius: 2,
                  transform: 'rotate(45deg)',
                  background: isActive ? p.accent : isPast ? p.accent : p.bgElev2,
                  border: `2px solid ${isActive ? p.accent : isPast ? p.accent : p.borderStrong}`,
                  opacity: isPast && !isActive ? 0.6 : 1,
                }} />
                <span style={{
                  ...mono, fontSize: 8,
                  color: isActive ? p.accent : p.textMute,
                }}>P{String(i + 1).padStart(2, '0')}</span>
                <span style={{ fontSize: 9, color: isActive ? p.text : p.textDim || p.textMute, whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: 80, textOverflow: 'ellipsis' }}>{ph.name}</span>
              </button>
            );
          })}
        </div>

        {/* Duration */}
        <div style={{ ...mono, color: p.textMute, fontSize: 10, marginLeft: 16 }}>
          {phase.duration.toFixed(1)}s
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { StudioApp });
