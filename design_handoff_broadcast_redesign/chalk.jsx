/* Variation 2 — Chalk editorial playbook.
   Cream paper background, dark ink, Fraunces serif display + JetBrains Mono.
   Feels like a printed coaching manual or Sunday Times tactical breakdown. */

const { useState: useStateCh, useMemo: useMemoC } = React;

const CHALK_PALETTE = {
  bg:          '#f5f0e8',
  bgElev:      '#ede7d9',
  bgElev2:     '#e2d9c8',
  text:        '#1a1a18',
  textMute:    '#5a5348',
  textDim:     '#8a7f70',
  border:      '#d0c9b8',
  borderStrong:'#b5a898',
  accent:      '#c84b1a',   /* burnt sienna / editorial red */
  accentHot:   '#1e3a8a',   /* deep navy for contrast */
  home:        '#1e3a8a',
  away:        '#991b1b',
  ball:        '#92400e',
  arrowRun:    '#1c2617',
  arrowPass:   'rgba(28,38,23,0.72)',
  arrowKick:   '#92400e',
  homeIsLight: false,
};

function ChalkApp() {
  const p = CHALK_PALETTE;
  const [currentIdx, setCurrentIdx] = useStateCh(1);
  const [showNames, setShowNames] = useStateCh(true);
  const [showArrows, setShowArrows] = useStateCh(true);
  const [activeTool, setActiveTool] = useStateCh('select');

  const phase = PHASES[currentIdx];
  const actors = useMemoC(() => actorsForPhase(currentIdx), [currentIdx]);

  const serif  = { fontFamily: '"Fraunces","Georgia",serif' };
  const mono   = { fontFamily: '"JetBrains Mono","Fira Code",monospace', letterSpacing: '0.14em', textTransform: 'uppercase' };
  const slab   = { fontFamily: '"Playfair Display","Times New Roman",serif' };

  return (
    <div style={{ width: 1440, height: 900, background: p.bg, color: p.text, display: 'flex', flexDirection: 'column' }}>

      {/* Masthead */}
      <div style={{
        height: 56, display: 'flex', alignItems: 'center', padding: '0 20px',
        background: p.text, color: '#fdfaf2', flex: 'none',
        borderBottom: `3px solid ${p.accent}`,
      }}>
        {/* Title block */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ ...serif, fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em', color: '#fdfaf2' }}>Phaseboard</span>
          <span style={{ ...mono, fontSize: 9, color: '#8a7f70', marginTop: 2 }}>Tactical Playbook</span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Match ref */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ ...mono, fontSize: 10, color: '#8a7f70' }}>IRE v NZL · Q3 58:14</span>
          <div style={{ width: 1, height: 20, background: '#444' }} />
          <span style={{ ...mono, fontSize: 10, color: p.accent }}>● LIVE ANALYSIS</span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Toggles */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[['Names', showNames, setShowNames], ['Arrows', showArrows, setShowArrows]].map(([l, v, set]) => (
            <button key={l} onClick={() => set(!v)} style={{
              padding: '4px 10px', border: `1px solid ${v ? p.accent : '#555'}`,
              background: v ? p.accent : 'transparent', color: v ? '#0a0a0a' : '#aaa',
              borderRadius: 1, cursor: 'pointer', ...mono, fontSize: 9,
            }}>{l}</button>
          ))}
        </div>
        <div style={{ marginLeft: 12 }}>
          <button style={{
            padding: '0 14px', height: 32, background: p.accent, color: '#fdfaf2',
            border: 'none', borderRadius: 1, cursor: 'pointer', ...serif, fontWeight: 700, fontSize: 12,
          }}>Print</button>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

        {/* Left: scene list (newspaper column style) */}
        <div style={{ width: 200, background: p.bgElev, borderRight: `1px solid ${p.border}`, display: 'flex', flexDirection: 'column', flex: 'none' }}>
          <div style={{ padding: '14px 14px 6px' }}>
            <div style={{ ...mono, fontSize: 8, color: p.textMute, borderBottom: `1px solid ${p.border}`, paddingBottom: 6 }}>PHASES</div>
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {PHASES.map((ph, i) => {
              const isActive = i === currentIdx;
              return (
                <button key={ph.id} onClick={() => setCurrentIdx(i)} style={{
                  width: '100%', textAlign: 'left', background: 'transparent',
                  border: 'none', borderLeft: `3px solid ${isActive ? p.accent : 'transparent'}`,
                  padding: '10px 12px', cursor: 'pointer',
                  background: isActive ? p.bgElev2 : 'transparent',
                }}>
                  <div style={{ ...mono, fontSize: 8, color: p.textMute, marginBottom: 3 }}>
                    {String(i + 1).padStart(2, '0')} / {String(PHASES.length).padStart(2, '0')}
                  </div>
                  <div style={{ ...serif, fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? p.text : p.textMute }}>{ph.name}</div>
                  <div style={{ ...mono, fontSize: 8, color: p.textDim, marginTop: 3 }}>{ph.duration.toFixed(1)}s</div>
                </button>
              );
            })}
          </div>

          {/* Tool column */}
          <div style={{ borderTop: `1px solid ${p.border}`, padding: '8px 10px' }}>
            <div style={{ ...mono, fontSize: 8, color: p.textMute, marginBottom: 6 }}>Tools</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {[['↖','select'],['→','run'],['⤳','pass'],['□','zone']].map(([icon, id]) => (
                <button key={id} onClick={() => setActiveTool(id)} style={{
                  width: 34, height: 34, background: activeTool === id ? p.accent : p.bgElev2,
                  color: activeTool === id ? '#fdfaf2' : p.text,
                  border: `1px solid ${activeTool === id ? p.accent : p.border}`,
                  borderRadius: 1, cursor: 'pointer', fontSize: 14, display: 'grid', placeItems: 'center',
                }}>{icon}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Canvas — parchment field */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Phase heading — editorial style */}
          <div style={{
            padding: '12px 24px 10px', background: p.bgElev, borderBottom: `1px solid ${p.border}`,
            display: 'flex', alignItems: 'baseline', gap: 14, flex: 'none',
          }}>
            <span style={{ ...mono, fontSize: 8, color: p.accent }}>PHASE {String(currentIdx + 1).padStart(2, '0')}</span>
            <span style={{ ...serif, fontSize: 20, fontWeight: 800, color: p.text, letterSpacing: '-0.01em' }}>{phase.name}</span>
            {phase.cue && (
              <span style={{ fontFamily: '"Fraunces"', fontSize: 12, color: p.textMute, fontStyle: 'italic', flex: 1 }}>"{phase.cue}"</span>
            )}
          </div>

          <div style={{ flex: 1, display: 'grid', placeItems: 'center', background: p.bg }}>
            <Pitch
              w={960} h={580}
              theme="chalk"
              scene={{
                actors: actors,
                arrows: showArrows ? phase.arrows.map(ar => ({
                  type: ar.type,
                  fromX: ar.from.x, fromY: ar.from.y,
                  toX: ar.to.x, toY: ar.to.y,
                  cpX: ar.cp?.x, cpY: ar.cp?.y,
                })) : [],
                zones: phase.zone ? [{
                  shape: 'rect', x: phase.zone.x, y: phase.zone.y,
                  w: phase.zone.w, h: phase.zone.h,
                  color: 'rgba(200,75,26,0.85)', label: phase.zone.label,
                }] : [],
              }}
              showNames={showNames}
              homeColor={p.home}
              awayColor={p.away}
            />
          </div>

          {/* Phase nav — timeline strip */}
          <div style={{
            height: 52, background: p.bgElev, borderTop: `1px solid ${p.border}`,
            display: 'flex', alignItems: 'center', padding: '0 16px', gap: 0, flex: 'none',
          }}>
            <button onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))} style={{
              width: 28, height: 28, background: 'transparent', border: `1px solid ${p.borderStrong}`,
              color: p.text, borderRadius: 1, cursor: 'pointer', marginRight: 10, fontSize: 10,
            }}>◀</button>

            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div style={{ position: 'absolute', left: 0, right: 0, height: 1, background: p.border }}>
                <div style={{ width: `${(currentIdx / (PHASES.length - 1)) * 100}%`, height: '100%', background: p.accent }} />
              </div>
              {PHASES.map((ph, i) => {
                const isActive = i === currentIdx;
                const isPast = i < currentIdx;
                const pct = (i / (PHASES.length - 1)) * 100;
                return (
                  <button key={ph.id} onClick={() => setCurrentIdx(i)} style={{
                    position: 'absolute', left: `${pct}%`, transform: 'translateX(-50%)',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, zIndex: 1,
                    padding: '2px 4px',
                  }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: isActive ? p.accent : isPast ? p.accent : p.bgElev2,
                      border: `2px solid ${isActive ? p.accent : isPast ? p.accent : p.borderStrong}`,
                      opacity: isPast && !isActive ? 0.5 : 1,
                    }} />
                    <span style={{ ...mono, fontSize: 7, color: isActive ? p.accent : p.textMute, whiteSpace: 'nowrap' }}>P{String(i + 1).padStart(2, '0')}</span>
                  </button>
                );
              })}
            </div>

            <button onClick={() => setCurrentIdx(Math.min(PHASES.length - 1, currentIdx + 1))} style={{
              width: 28, height: 28, background: 'transparent', border: `1px solid ${p.borderStrong}`,
              color: p.text, borderRadius: 1, cursor: 'pointer', marginLeft: 10, fontSize: 10,
            }}>▶</button>
          </div>
        </div>

        {/* Right annotation column */}
        <div style={{ width: 220, background: p.bgElev, borderLeft: `1px solid ${p.border}`, display: 'flex', flexDirection: 'column', flex: 'none' }}>
          <div style={{ padding: '14px 14px 6px', borderBottom: `1px solid ${p.border}` }}>
            <div style={{ ...mono, fontSize: 8, color: p.textMute }}>ANNOTATION</div>
          </div>

          {/* Cue text — editorial callout */}
          {phase.cue && (
            <div style={{
              margin: 12, padding: '10px 12px',
              borderLeft: `3px solid ${p.accent}`,
              background: p.bgElev2,
            }}>
              <div style={{ ...mono, fontSize: 8, color: p.accent, marginBottom: 6 }}>COACH CUE</div>
              <div style={{ ...serif, fontSize: 13, color: p.text, lineHeight: 1.45 }}>{phase.cue}</div>
            </div>
          )}

          {/* On-ball */}
          {phase.onBall && (() => {
            const r = ROSTER_IRE.find(x => x.n === phase.onBall);
            return r ? (
              <div style={{ margin: '0 12px', padding: '10px 12px', background: p.bgElev2, borderRadius: 1 }}>
                <div style={{ ...mono, fontSize: 8, color: p.textMute, marginBottom: 8 }}>ON THE BALL</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{
                    width: 38, height: 38, background: p.home, color: '#fdfaf2',
                    display: 'grid', placeItems: 'center', borderRadius: 1, flex: 'none',
                    fontFamily: '"Fraunces"', fontWeight: 900, fontSize: 18,
                  }}>{r.n}</div>
                  <div>
                    <div style={{ ...serif, fontSize: 13, fontWeight: 700, color: p.text }}>{r.name}</div>
                    <div style={{ ...mono, fontSize: 8, color: p.textMute, marginTop: 2 }}>{r.pos}</div>
                  </div>
                </div>
                <div style={{ ...mono, fontSize: 8, color: p.textDim, marginTop: 8, lineHeight: 1.5 }}>{r.role}</div>
              </div>
            ) : null;
          })()}

          <div style={{ flex: 1 }} />

          {/* Roster key — ink colours */}
          <div style={{ padding: '10px 14px', borderTop: `1px solid ${p.border}` }}>
            <div style={{ ...mono, fontSize: 8, color: p.textMute, marginBottom: 8 }}>KEY</div>
            {[['Home (IRE)', p.home], ['Away (NZL)', p.away]].map(([l, c]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ width: 16, height: 16, background: c, borderRadius: '50%' }} />
                <span style={{ ...mono, fontSize: 8, color: p.textMute }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ChalkApp });
