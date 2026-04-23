/* Mobile companion — Broadcast look, phone form factor. */

const { useState: useStateM2, useEffect: useEffectM2, useMemo: useMemoM2 } = React;

function BroadcastMobile({ paletteKey = 'dark' }) {
  const p = PALETTES[paletteKey];
  const [currentIdx, setCurrentIdx] = useStateM2(1);
  const [playing, setPlaying] = useStateM2(false);

  const phase = PHASES[currentIdx];
  const actors = useMemoM2(() => actorsForPhase(currentIdx), [currentIdx]);

  useEffectM2(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      if (currentIdx < PHASES.length - 1) setCurrentIdx(i => i + 1);
      else setPlaying(false);
    }, phase.duration * 1000);
    return () => clearTimeout(t);
  }, [playing, currentIdx, phase.duration]);

  const mono = { fontFamily: '"JetBrains Mono",monospace', letterSpacing: '0.18em', textTransform: 'uppercase' };

  return (
    <div style={{
      width: 390, height: 844,
      background: p.bg, color: p.text,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      fontFamily: '"Inter", system-ui, sans-serif',
      borderRadius: 48, border: '10px solid #000',
      position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    }}>
      {/* Notch */}
      <div style={{
        position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
        width: 110, height: 28, background: '#000', borderRadius: 20, zIndex: 10,
      }} />

      {/* Status bar */}
      <div style={{ height: 44, background: p.bg, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 28px', flex: 'none', paddingTop: 8 }}>
        <span style={{ fontWeight: 600, fontSize: 14 }}>9:41</span>
        <span style={{ fontSize: 11 }}>●●● 🔊 100%</span>
      </div>

      {/* App header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
        borderBottom: `1px solid ${p.border}`, flex: 'none' }}>
        <div style={{
          width: 32, height: 32, background: p.accent, color: '#0a0a0a',
          display: 'grid', placeItems: 'center',
          fontFamily: '"Oswald"', fontSize: 20, fontWeight: 700, borderRadius: 2,
        }}>P</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: '"Oswald"', fontSize: 14, fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'uppercase', color: p.text }}>IRE v NZL · Q3 58:14</div>
          <div style={{ ...mono, color: p.accent, fontSize: 9, marginTop: 2 }}>↑ LIVE · IRE-L04</div>
        </div>
        <div style={{ color: p.textMute, fontSize: 18 }}>⋯</div>
      </div>

      {/* Phase strip */}
      <div style={{ display: 'flex', gap: 0, padding: '10px 16px',
        borderBottom: `1px solid ${p.border}`, flex: 'none', background: p.bgElev }}>
        {PHASES.map((ph, i) => {
          const isCur = i === currentIdx;
          const isPast = i < currentIdx;
          return (
            <button key={ph.id} onClick={() => setCurrentIdx(i)} style={{
              flex: 1, background: 'transparent', border: 'none', cursor: 'pointer',
              padding: '4px 2px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            }}>
              <div style={{ width: '100%', height: 3, background: isCur ? p.accent : isPast ? p.accent : p.borderStrong, opacity: isPast && !isCur ? 0.5 : 1 }} />
              <span style={{ ...mono, fontSize: 8, color: isCur ? p.accent : p.textMute }}>
                P{String(i + 1).padStart(2, '0')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Phase title */}
      <div style={{ padding: '12px 16px 8px', flex: 'none' }}>
        <div style={{ ...mono, color: p.textMute, fontSize: 9 }}>Phase {String(currentIdx + 1).padStart(2, '0')} / 07</div>
        <div style={{ fontFamily: '"Oswald"', fontSize: 20, fontWeight: 600,
          letterSpacing: '0.06em', textTransform: 'uppercase', color: p.text, marginTop: 2 }}>{phase.name}</div>
      </div>

      {/* Pitch */}
      <div style={{ flex: 1, minHeight: 0, background: p.bgElev2, padding: 10, display: 'grid', placeItems: 'center' }}>
        <BroadcastPitch
          w={350} h={220} palette={p} theme={p.pitchTheme}
          actors={actors} arrows={phase.arrows} zone={phase.zone}
          onBall={phase.onBall} showNames={false}
        />
      </div>

      {/* Transport controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
        borderTop: `1px solid ${p.border}`, background: p.bgElev, flex: 'none' }}>
        <button onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))} style={{
          width: 36, height: 36, background: 'transparent',
          border: `1px solid ${p.borderStrong}`, color: p.text, borderRadius: 2, cursor: 'pointer',
        }}>◀</button>
        <button onClick={() => setPlaying(!playing)} style={{
          flex: 1, height: 36, background: p.accent, color: '#0a0a0a',
          border: 'none', borderRadius: 2, cursor: 'pointer',
          fontFamily: '"Oswald"', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', fontSize: 12,
        }}>{playing ? '⏸ PAUSE' : '▶ PLAY PHASE'}</button>
        <button onClick={() => setCurrentIdx(Math.min(PHASES.length - 1, currentIdx + 1))} style={{
          width: 36, height: 36, background: 'transparent',
          border: `1px solid ${p.borderStrong}`, color: p.text, borderRadius: 2, cursor: 'pointer',
        }}>▶</button>
      </div>

      {/* Coach cue */}
      <div style={{ padding: '14px 16px 22px', background: p.bg, borderTop: `2px solid ${p.accent}`, flex: 'none' }}>
        <div style={{ ...mono, color: p.accent, fontWeight: 700, fontSize: 9 }}>COACH CUE</div>
        <div style={{ height: 6 }} />
        <div style={{ color: p.text, fontSize: 14, lineHeight: 1.35, fontFamily: '"Oswald"', letterSpacing: '0.01em' }}>
          {phase.cue}
        </div>
        {phase.onBall && (
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 24, height: 24, background: p.accent, color: '#0a0a0a',
              display: 'grid', placeItems: 'center', borderRadius: 2,
              fontFamily: '"Oswald"', fontWeight: 700, fontSize: 13,
            }}>{phase.onBall}</div>
            <span style={{ ...mono, color: p.textDim, fontSize: 10 }}>
              On ball · {ROSTER_IRE.find(r => r.n === phase.onBall)?.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { BroadcastMobile });
