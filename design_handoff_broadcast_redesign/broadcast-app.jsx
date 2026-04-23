/* Main Broadcast desktop app — fully interactive.
   Palette-able via prop: palette tokens from PALETTES[key]                  */

const { useState, useEffect, useRef, useMemo } = React;

// ─── Primitives ───────────────────────────────────────────────────────────────

function MonoLabel({ children, style }) {
  return (
    <span style={{
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
      ...style,
    }}>{children}</span>
  );
}

function OswaldLabel({ children, size = 14, weight = 600, style }) {
  return (
    <span style={{
      fontFamily: '"Oswald", Impact, sans-serif',
      fontSize: size, fontWeight: weight,
      letterSpacing: '0.06em', textTransform: 'uppercase',
      ...style,
    }}>{children}</span>
  );
}

function btnStyle(p) {
  return {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '0 14px', height: 34,
    background: 'transparent', color: p.text,
    border: `1px solid ${p.borderStrong}`, borderRadius: 2,
    cursor: 'pointer', fontFamily: '"JetBrains Mono", monospace',
  };
}

function IconBtn({ children, active, disabled, onClick, p, size = 32, title }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      title={title}
      style={{
        width: size, height: size, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        background: active ? p.accent : h && !disabled ? p.bgElev2 : 'transparent',
        color: active ? '#0a0a0a' : disabled ? p.textMute : p.text,
        borderRadius: 3, display: 'grid', placeItems: 'center',
        transition: 'all 0.12s ease', opacity: disabled ? 0.4 : 1,
        outline: `1px solid ${active ? p.accent : h ? p.borderStrong : 'transparent'}`,
      }}>
      {children}
    </button>
  );
}

// ─── Broadcast header ─────────────────────────────────────────────────────────

function BroadcastHeader({ p, onExport, onShare }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'stretch',
      background: p.bg, borderBottom: `1px solid ${p.border}`, height: 56, flex: 'none',
    }}>
      {/* Wordmark tile */}
      <div style={{
        width: 56, background: p.accent, color: '#0a0a0a',
        display: 'grid', placeItems: 'center',
        fontFamily: '"Oswald",Impact,sans-serif', fontSize: 32, fontWeight: 700,
        letterSpacing: '-0.04em', lineHeight: 1,
      }}>P</div>

      {/* Match card */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px', borderRight: `1px solid ${p.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, background: '#ef4444', animation: 'pulse 1.6s infinite' }} />
          <MonoLabel style={{ color: '#ef4444', fontWeight: 700 }}>LIVE ANALYSIS</MonoLabel>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <OswaldLabel size={20} style={{ color: p.text }}>IRE</OswaldLabel>
          <span style={{ fontFamily: '"Oswald"', fontSize: 20, color: p.accent, fontWeight: 700 }}>22 – 19</span>
          <OswaldLabel size={20} style={{ color: p.textDim }}>NZL</OswaldLabel>
        </div>
        <div style={{ padding: '4px 10px', border: `1px solid ${p.border}`, borderRadius: 2, color: p.textDim }}>
          <MonoLabel>Q3 · 58:14 · Aviva</MonoLabel>
        </div>
      </div>

      {/* Play title */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 14, padding: '0 22px' }}>
        <MonoLabel style={{ color: p.textMute }}>Play</MonoLabel>
        <OswaldLabel size={16} style={{ color: p.text }}>Lineout Strike · Off the Top – 9</OswaldLabel>
        <span style={{
          fontFamily: '"JetBrains Mono"', fontSize: 10, color: p.accent,
          padding: '2px 8px', border: `1px solid ${p.accent}`, borderRadius: 2, letterSpacing: '0.14em',
        }}>PLAYBOOK · IRE-L04</span>
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '0 10px' }}>
        <button onClick={onShare} style={btnStyle(p)}>
          <span style={{ fontSize: 14 }}>↗</span>
          <MonoLabel>Share</MonoLabel>
        </button>
        <button onClick={onExport} style={{ ...btnStyle(p), background: p.accent, color: '#0a0a0a', borderColor: p.accent }}>
          <MonoLabel style={{ color: '#0a0a0a', fontWeight: 700 }}>Export</MonoLabel>
        </button>
      </div>
    </div>
  );
}

// ─── Left panel ───────────────────────────────────────────────────────────────

function LeftPanel({ p, tool, setTool, lockedPhases, toggleLock, currentPhaseIdx }) {
  const tools = [
    { id: 'select', icon: '↖', label: 'Select' },
    { id: 'arrow-run',  icon: '→', label: 'Run' },
    { id: 'arrow-pass', icon: '⇢', label: 'Pass' },
    { id: 'arrow-kick', icon: '⟶', label: 'Kick' },
    { id: 'zone',   icon: '▭', label: 'Zone' },
    { id: 'note',   icon: 'T', label: 'Note' },
  ];

  const formations = [
    { id: 'lo7top',      name: '7-Man Tail',    kind: 'Lineout' },
    { id: 'lo6plus1top', name: '6+1 Deception', kind: 'Lineout' },
    { id: 'lo5mantop',   name: '5-Man Front',   kind: 'Lineout' },
    { id: 'scrumtop',    name: 'Scrum',          kind: 'Scrum'   },
    { id: 'penaltyattack', name: 'Penalty Attack', kind: 'Phase' },
    { id: 'openplay',    name: 'Open Play',      kind: 'Phase'   },
    { id: 'kickoff',     name: 'Kickoff',        kind: 'Restart' },
  ];

  return (
    <div style={{ width: 240, flex: 'none', background: p.bgElev, borderRight: `1px solid ${p.border}`, display: 'flex', flexDirection: 'column' }}>
      {/* Tools */}
      <div style={{ padding: '14px 12px', borderBottom: `1px solid ${p.border}` }}>
        <MonoLabel style={{ color: p.textMute, display: 'block', marginBottom: 10 }}>Tools</MonoLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4 }}>
          {tools.map(t => (
            <IconBtn key={t.id} p={p} active={tool === t.id} onClick={() => setTool(t.id)} size={28} title={t.label}>
              <span style={{ fontFamily: '"JetBrains Mono"', fontSize: 13, color: tool === t.id ? '#0a0a0a' : p.text }}>{t.icon}</span>
            </IconBtn>
          ))}
        </div>
      </div>

      {/* Formations */}
      <div style={{ padding: '14px 12px', flex: 1, overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <MonoLabel style={{ color: p.textMute }}>Formations</MonoLabel>
          <MonoLabel style={{ color: p.accent }}>+ New</MonoLabel>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {formations.map(f => (
            <button key={f.id} style={{
              background: 'transparent', border: '1px solid transparent',
              borderLeft: `3px solid transparent`,
              padding: '10px 10px 10px 12px', textAlign: 'left', cursor: 'pointer', borderRadius: 2,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = p.bgElev2;
              e.currentTarget.style.borderLeftColor = p.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderLeftColor = 'transparent';
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <OswaldLabel size={14} style={{ color: p.text }}>{f.name}</OswaldLabel>
                <MonoLabel style={{ color: p.textMute, fontSize: 9 }}>4P</MonoLabel>
              </div>
              <MonoLabel style={{ color: p.textMute, fontSize: 9 }}>{f.kind}</MonoLabel>
            </button>
          ))}
        </div>

        {/* Phase lock */}
        <div style={{ borderTop: `1px solid ${p.border}`, marginTop: 20, paddingTop: 14 }}>
          <MonoLabel style={{ color: p.textMute, display: 'block', marginBottom: 10 }}>Phase Lock</MonoLabel>
          <button onClick={toggleLock} style={{
            width: '100%', padding: '10px 12px', cursor: 'pointer',
            background: lockedPhases[currentPhaseIdx] ? p.accent : p.bgElev2,
            border: `1px solid ${lockedPhases[currentPhaseIdx] ? p.accent : p.borderStrong}`,
            color: lockedPhases[currentPhaseIdx] ? '#0a0a0a' : p.text,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 2,
          }}>
            <MonoLabel style={{ color: 'inherit', fontWeight: 700 }}>
              {lockedPhases[currentPhaseIdx] ? '✓ Locked' : '✗ Unlocked'}
            </MonoLabel>
            <span style={{ fontSize: 13 }}>{lockedPhases[currentPhaseIdx] ? '🔒' : '🔓'}</span>
          </button>
          <p style={{ margin: '8px 0 0', color: p.textMute, fontSize: 10, lineHeight: 1.5,
            fontFamily: '"JetBrains Mono",monospace' }}>
            Lock phase {String(currentPhaseIdx + 1).padStart(2, '0')} to prevent edits during game.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Phase timeline ───────────────────────────────────────────────────────────

function PhaseTimeline({ p, phases, currentIdx, setCurrentIdx, playing, setPlaying, progress, lockedPhases }) {
  const [hover, setHover] = useState(null);
  return (
    <div style={{ background: p.bgElev, borderTop: `1px solid ${p.border}`, padding: '14px 20px 16px', flex: 'none' }}>
      {/* Controls row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 12 }}>
        <IconBtn p={p} onClick={() => setPlaying(!playing)} size={36} active={playing}>
          <span style={{ fontSize: 13, color: playing ? '#0a0a0a' : p.text }}>{playing ? '⏸' : '▶'}</span>
        </IconBtn>
        <IconBtn p={p} onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))} size={32} disabled={currentIdx === 0}>
          <span style={{ fontSize: 11 }}>◀◀</span>
        </IconBtn>
        <IconBtn p={p} onClick={() => setCurrentIdx(Math.min(phases.length - 1, currentIdx + 1))} size={32} disabled={currentIdx === phases.length - 1}>
          <span style={{ fontSize: 11 }}>▶▶</span>
        </IconBtn>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, paddingLeft: 16, borderLeft: `1px solid ${p.border}` }}>
          <MonoLabel style={{ color: p.textMute }}>Phase</MonoLabel>
          <OswaldLabel size={22} style={{ color: p.accent }}>{String(currentIdx + 1).padStart(2, '0')}</OswaldLabel>
          <MonoLabel style={{ color: p.textMute }}>/ {String(phases.length).padStart(2, '0')}</MonoLabel>
          <span style={{ marginLeft: 10, color: p.text, fontFamily: '"Oswald"', fontWeight: 500, fontSize: 15 }}>
            {phases[currentIdx].name}
          </span>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
          <MonoLabel style={{ color: p.textMute }}>{phases[currentIdx].duration.toFixed(1)}s</MonoLabel>
          <MonoLabel style={{ color: p.textMute }}>{phases.reduce((s, ph) => s + ph.duration, 0).toFixed(1)}s total</MonoLabel>
        </div>
      </div>

      {/* Track */}
      <div style={{ position: 'relative', height: 56 }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 26, height: 4, background: p.bgElev2 }} />
        <div style={{
          position: 'absolute', left: 0, top: 26, height: 4,
          width: `${((currentIdx + progress) / phases.length) * 100}%`,
          background: p.accent, transition: playing ? 'none' : 'width 0.3s',
        }} />

        {phases.map((ph, i) => {
          const left = (i / (phases.length - 1)) * 100;
          const isCurrent = i === currentIdx;
          const isPast = i < currentIdx;
          const isHov = hover === i;
          const isLocked = lockedPhases[i];
          return (
            <div key={ph.id}
              onClick={() => setCurrentIdx(i)}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              style={{ position: 'absolute', left: `${left}%`, top: 0, transform: 'translateX(-50%)',
                cursor: 'pointer', userSelect: 'none', width: 70 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <MonoLabel style={{ color: isCurrent ? p.accent : isHov ? p.text : p.textMute,
                  fontWeight: isCurrent ? 700 : 500, fontSize: 9 }}>
                  P{String(i + 1).padStart(2, '0')}
                </MonoLabel>
                <div style={{ height: 4 }} />
                <div style={{
                  width: isCurrent ? 14 : isHov ? 12 : 10,
                  height: isCurrent ? 14 : isHov ? 12 : 10,
                  background: isCurrent || isPast ? p.accent : p.borderStrong,
                  border: isHov && !isCurrent ? `2px solid ${p.accent}` : 'none',
                  transform: 'rotate(45deg)', transition: 'all 0.14s ease',
                  marginTop: isCurrent ? 0 : 2,
                }} />
                <div style={{ height: 4 }} />
                <div style={{ fontFamily: '"Oswald"', fontSize: 10.5, fontWeight: 500,
                  color: isCurrent ? p.text : isHov ? p.textDim : p.textMute,
                  letterSpacing: '0.04em', textAlign: 'center', lineHeight: 1.1,
                  maxWidth: 70, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {ph.name}
                </div>
                {isLocked && <div style={{ fontSize: 8, color: p.accent, marginTop: 2 }}>🔒</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Right panel: On the Ball ─────────────────────────────────────────────────

function RightPanel({ p, phase, selectedN, onOpenRoster, onClearSelection }) {
  const n = selectedN || phase.onBall;
  const player = n ? ROSTER_IRE.find(r => r.n === n) : null;

  return (
    <div style={{ width: 280, flex: 'none', background: p.bgElev, borderLeft: `1px solid ${p.border}`, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 16px', borderBottom: `1px solid ${p.border}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <MonoLabel style={{ color: p.accent, fontWeight: 700 }}>On the Ball</MonoLabel>
        <button onClick={onOpenRoster} style={{
          background: 'transparent', border: `1px solid ${p.border}`,
          color: p.textDim, padding: '2px 8px', cursor: 'pointer', borderRadius: 2,
        }}><MonoLabel>Roster</MonoLabel></button>
      </div>

      {!player ? (
        <div style={{ flex: 1, padding: '40px 20px', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 14 }}>
          <div style={{ width: 68, height: 68, border: `2px dashed ${p.border}`,
            borderRadius: '50%', display: 'grid', placeItems: 'center', color: p.textMute, fontSize: 24 }}>?</div>
          <OswaldLabel size={15} style={{ color: p.textDim }}>No player selected</OswaldLabel>
          <p style={{ color: p.textMute, fontSize: 11, lineHeight: 1.5,
            fontFamily: '"JetBrains Mono"', margin: 0 }}>
            Click any home player on the pitch or open the roster to inspect their phase role.
          </p>
          <button onClick={onOpenRoster} style={{ ...btnStyle(p), height: 30 }}>
            <MonoLabel>Open Roster</MonoLabel>
          </button>
        </div>
      ) : (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <div style={{ padding: '20px 16px', borderBottom: `1px solid ${p.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 56, height: 56, background: p.accent, color: '#0a0a0a',
                display: 'grid', placeItems: 'center',
                fontFamily: '"Oswald"', fontSize: 32, fontWeight: 700, borderRadius: 2 }}>{player.n}</div>
              <div style={{ flex: 1 }}>
                <OswaldLabel size={20} style={{ color: p.text }}>{player.name}</OswaldLabel>
                <div style={{ height: 2 }} />
                <MonoLabel style={{ color: p.textDim, fontSize: 9 }}>{player.pos}</MonoLabel>
              </div>
            </div>
          </div>

          <div style={{ padding: '16px' }}>
            <MonoLabel style={{ color: p.textMute, display: 'block', marginBottom: 8 }}>Role · this phase</MonoLabel>
            <p style={{ color: p.text, fontSize: 13, lineHeight: 1.5, margin: 0 }}>{player.role}</p>
          </div>

          <div style={{ padding: '0 16px 16px' }}>
            <MonoLabel style={{ color: p.textMute, display: 'block', marginBottom: 8 }}>Match stats</MonoLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: p.border }}>
              {[['Carries', 8], ['Tackles', 11], ['Metres', 42], ['Passes', 23], ['Turnovers', 2], ['Minutes', 58]].map(([k, v]) => (
                <div key={k} style={{ padding: '10px 12px', background: p.bgElev }}>
                  <MonoLabel style={{ color: p.textMute, fontSize: 9, display: 'block', marginBottom: 2 }}>{k}</MonoLabel>
                  <OswaldLabel size={18} style={{ color: p.text }}>{v}</OswaldLabel>
                </div>
              ))}
            </div>
          </div>

          {selectedN && selectedN !== phase.onBall && (
            <div style={{ padding: '0 16px 16px' }}>
              <button onClick={onClearSelection} style={{ ...btnStyle(p), width: '100%', justifyContent: 'center' }}>
                <MonoLabel>Clear selection</MonoLabel>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Pitch fitted ─────────────────────────────────────────────────────────────

function PitchFitted({ p, phase, actors, selectedN, onSelectPlayer }) {
  const ref = useRef(null);
  const [dims, setDims] = useState({ w: 960, h: 640 });
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      const AR = 1.6;
      let w = r.width, h = r.height;
      if (w / h > AR) w = h * AR; else h = w / AR;
      setDims({ w: Math.round(w), h: Math.round(h) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
      <div style={{ boxShadow: `0 10px 40px rgba(0,0,0,0.5), 0 0 0 1px ${p.border}` }}>
        <BroadcastPitch
          w={dims.w} h={dims.h} palette={p} theme={p.pitchTheme}
          actors={actors} arrows={phase.arrows} zone={phase.zone}
          onBall={phase.onBall} selectedN={selectedN}
          onSelectPlayer={onSelectPlayer}
        />
      </div>
    </div>
  );
}

// ─── Main app ─────────────────────────────────────────────────────────────────

function BroadcastApp({ paletteKey = 'dark' }) {
  const p = PALETTES[paletteKey];

  const [currentIdx, setCurrentIdx] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tool, setTool] = useState('select');
  const [selectedN, setSelectedN] = useState(null);
  const [lockedPhases, setLockedPhases] = useState(Array(PHASES.length).fill(false));
  const [modal, setModal] = useState(null);

  useEffect(() => {
    if (!playing) return;
    const phase = PHASES[currentIdx];
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / (phase.duration * 1000));
      setProgress(t);
      if (t >= 1) {
        if (currentIdx < PHASES.length - 1) { setCurrentIdx(i => i + 1); setProgress(0); }
        else { setPlaying(false); setProgress(1); }
      } else { raf = requestAnimationFrame(tick); }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, currentIdx]);

  useEffect(() => { if (!playing) setProgress(0); }, [currentIdx, playing]);

  const phase = PHASES[currentIdx];
  const actors = useMemo(() => actorsForPhase(currentIdx), [currentIdx]);

  const toggleLock = () => setLockedPhases(prev => {
    const next = [...prev]; next[currentIdx] = !next[currentIdx]; return next;
  });

  return (
    <div style={{ width: '100%', height: '100%', background: p.bg, color: p.text,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      fontFamily: '"Inter", system-ui, sans-serif', position: 'relative' }}>

      <BroadcastHeader p={p} onExport={() => setModal('export')} onShare={() => setModal('share')} />

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <LeftPanel p={p} tool={tool} setTool={setTool}
          lockedPhases={lockedPhases} toggleLock={toggleLock} currentPhaseIdx={currentIdx} />

        {/* Canvas area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Coach cue bar */}
          <div style={{ padding: '10px 20px', background: p.bgElev, borderBottom: `1px solid ${p.border}`,
            display: 'flex', alignItems: 'center', gap: 14, flex: 'none' }}>
            <MonoLabel style={{ color: p.accent, fontWeight: 700 }}>Coach Cue</MonoLabel>
            <span style={{ fontFamily: '"Oswald"', fontSize: 16, color: p.text, letterSpacing: '0.02em' }}>
              {phase.cue || 'No cue set for this phase.'}
            </span>
            <div style={{ marginLeft: 'auto' }}>
              <MonoLabel style={{ color: p.textMute }}>Tool · {tool.toUpperCase()}</MonoLabel>
            </div>
          </div>

          <div style={{ flex: 1, background: p.bgElev2, padding: 18, display: 'grid', placeItems: 'center', minHeight: 0 }}>
            <PitchFitted p={p} phase={phase} actors={actors}
              selectedN={selectedN} onSelectPlayer={setSelectedN} />
          </div>
        </div>

        <RightPanel p={p} phase={phase} selectedN={selectedN}
          onOpenRoster={() => setModal('roster')}
          onClearSelection={() => setSelectedN(null)} />
      </div>

      <PhaseTimeline p={p} phases={PHASES} currentIdx={currentIdx} setCurrentIdx={setCurrentIdx}
        playing={playing} setPlaying={setPlaying} progress={progress} lockedPhases={lockedPhases} />

      {modal === 'export' && <ExportModal p={p} onClose={() => setModal(null)} />}
      {modal === 'share'  && <ShareModal p={p} onClose={() => setModal(null)} />}
      {modal === 'roster' && <RosterModal p={p} onClose={() => setModal(null)}
        selectedN={selectedN} setSelectedN={(n) => { setSelectedN(n); setModal(null); }}
        onBall={phase.onBall} />}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  );
}

Object.assign(window, { BroadcastApp, MonoLabel, OswaldLabel, btnStyle });
