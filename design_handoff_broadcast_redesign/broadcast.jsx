/* Variation 3 — Broadcast (static reference).
   This is the original broadcast-style standalone page used for reference only.
   The live interactive version is in broadcast-app.jsx.
   Oswald + JetBrains Mono, gold accent on dark. */

const { useState: useStateB, useMemo: useMemoB } = React;

function BroadcastStatic() {
  const [paletteKey, setPaletteKey] = useStateB('dark');
  const p = PALETTES[paletteKey];
  const [currentIdx, setCurrentIdx] = useStateB(1);

  const phase = PHASES[currentIdx];
  const actors = useMemoB(() => actorsForPhase(currentIdx), [currentIdx]);

  const mono = { fontFamily: '"JetBrains Mono","Fira Code",monospace', letterSpacing: '0.18em', textTransform: 'uppercase' };
  const oswald = { fontFamily: '"Oswald","Impact",sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase' };

  return (
    <div style={{ width: 1440, height: 900, background: p.bg, color: p.text, display: 'flex', flexDirection: 'column' }}>

      {/* Broadcast header bar */}
      <div style={{
        height: 56, display: 'flex', alignItems: 'center', padding: '0 20px',
        background: p.bgElev, borderBottom: `3px solid ${p.accent}`, flex: 'none',
        gap: 14,
      }}>
        {/* Wordmark */}
        <div style={{
          width: 40, height: 40, background: p.accent, color: '#0a0a0a',
          display: 'grid', placeItems: 'center',
          ...oswald, fontSize: 24, fontWeight: 700,
        }}>P</div>

        <div style={{ width: 1, height: 28, background: p.border }} />

        {/* Match scoreboard */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ ...oswald, fontSize: 14, color: p.text }}>IRE</span>
          <div style={{
            background: p.bgElev2, padding: '4px 14px',
            ...oswald, fontSize: 18, fontWeight: 700, color: p.accent,
          }}>22 – 19</div>
          <span style={{ ...oswald, fontSize: 14, color: p.text }}>NZL</span>
        </div>

        <div style={{ ...mono, fontSize: 10, color: p.textMute }}>Q3 · 58:14</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444', animation: 'pulse 1.5s infinite' }} />
          <span style={{ ...mono, fontSize: 10, color: '#ef4444' }}>LIVE</span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Play label */}
        <span style={{ ...mono, fontSize: 9, padding: '3px 8px', border: `1px solid ${p.borderStrong}`, color: p.textMute }}>PLAYBOOK</span>
        <span style={{ ...oswald, fontSize: 14, color: p.text }}>LO7 — Off the Top to 9</span>

        <div style={{ flex: 1 }} />

        {/* Palette switcher */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <span style={{ ...mono, fontSize: 8, color: p.textMute, marginRight: 4 }}>Palette</span>
          {Object.keys(PALETTES).map(k => {
            const isActive = k === paletteKey;
            return (
              <button key={k} onClick={() => setPaletteKey(k)} style={{
                width: 20, height: 20, borderRadius: '50%',
                background: PALETTES[k].accent,
                border: `2px solid ${isActive ? '#fff' : 'transparent'}`,
                cursor: 'pointer', outline: 'none',
              }} title={k} />
            );
          })}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

        {/* Phase sidebar */}
        <div style={{ width: 200, background: p.bgElev, borderRight: `1px solid ${p.border}`, display: 'flex', flexDirection: 'column', flex: 'none' }}>
          <div style={{ padding: '12px 14px 8px', borderBottom: `1px solid ${p.border}` }}>
            <span style={{ ...mono, fontSize: 9, color: p.textMute }}>Phases</span>
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {PHASES.map((ph, i) => {
              const isActive = i === currentIdx;
              return (
                <button key={ph.id} onClick={() => setCurrentIdx(i)} style={{
                  width: '100%', textAlign: 'left',
                  background: isActive ? p.bgElev2 : 'transparent',
                  border: 'none', borderLeft: `3px solid ${isActive ? p.accent : 'transparent'}`,
                  padding: '10px 12px', cursor: 'pointer',
                }}>
                  <div style={{ ...mono, fontSize: 8, color: isActive ? p.accent : p.textMute }}>{String(i + 1).padStart(2, '0')}</div>
                  <div style={{ ...oswald, fontSize: 12, color: isActive ? p.text : p.textMute, marginTop: 2 }}>{ph.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pitch */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#050e08' }}>
          {/* Cue bar */}
          {phase.cue && (
            <div style={{
              padding: '8px 20px', background: p.bgElev, borderBottom: `1px solid ${p.border}`,
              display: 'flex', alignItems: 'center', gap: 12, flex: 'none',
            }}>
              <span style={{ ...mono, color: p.accent, fontWeight: 700, fontSize: 9 }}>Coach Cue</span>
              <span style={{ ...oswald, fontSize: 13, color: p.text, letterSpacing: '0.02em', fontWeight: 400 }}>{phase.cue}</span>
            </div>
          )}
          <div style={{ flex: 1, display: 'grid', placeItems: 'center' }}>
            <BroadcastPitch
              w={980} h={600}
              palette={p}
              theme={p.pitchTheme || 'dark'}
              actors={actors}
              arrows={phase.arrows}
              zone={phase.zone}
              onBall={phase.onBall}
              showNames={true}
            />
          </div>
        </div>

        {/* Right info panel */}
        <div style={{ width: 240, background: p.bgElev, borderLeft: `1px solid ${p.border}`, display: 'flex', flexDirection: 'column', flex: 'none' }}>
          <div style={{ padding: '14px 14px 8px', borderBottom: `1px solid ${p.border}` }}>
            <div style={{ ...mono, fontSize: 8, color: p.textMute }}>Phase {String(currentIdx + 1).padStart(2, '0')} / 07</div>
            <div style={{ ...oswald, fontSize: 18, fontWeight: 600, color: p.text, marginTop: 4 }}>{phase.name}</div>
          </div>

          <div style={{ flex: 1 }} />

          {/* On-ball panel */}
          <div style={{ borderTop: `2px solid ${p.accent}`, padding: '12px 14px' }}>
            <div style={{ ...mono, color: p.accent, fontWeight: 700, fontSize: 9, marginBottom: 8 }}>On the Ball</div>
            {phase.onBall ? (() => {
              const r = ROSTER_IRE.find(x => x.n === phase.onBall);
              return r ? (
                <div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                    <div style={{
                      width: 50, height: 50, background: p.accent, color: '#0a0a0a',
                      display: 'grid', placeItems: 'center', flex: 'none',
                      ...oswald, fontSize: 24, fontWeight: 700,
                    }}>{r.n}</div>
                    <div>
                      <div style={{ ...oswald, fontSize: 14, color: p.text }}>{r.name}</div>
                      <div style={{ ...mono, fontSize: 8, color: p.textMute, marginTop: 2 }}>{r.pos}</div>
                    </div>
                  </div>
                  <div style={{ ...mono, fontSize: 9, color: p.textDim || p.textMute, lineHeight: 1.6 }}>{r.role}</div>
                </div>
              ) : null;
            })() : (
              <div style={{
                height: 50, border: `1px dashed ${p.borderStrong}`,
                display: 'grid', placeItems: 'center', color: p.textMute,
                ...mono, fontSize: 9,
              }}>No ball carrier set</div>
            )}
          </div>

          {/* Nav */}
          <div style={{ display: 'flex', gap: 6, padding: '10px 14px', borderTop: `1px solid ${p.border}` }}>
            <button onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))} style={{
              flex: 1, height: 34, background: 'transparent', border: `1px solid ${p.borderStrong}`,
              color: p.text, cursor: 'pointer', ...mono, fontSize: 10,
            }}>◀ Prev</button>
            <button onClick={() => setCurrentIdx(Math.min(PHASES.length - 1, currentIdx + 1))} style={{
              flex: 1, height: 34, background: p.accent, border: 'none',
              color: '#0a0a0a', cursor: 'pointer', ...mono, fontSize: 10, fontWeight: 700,
            }}>Next ▶</button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { BroadcastStatic });
