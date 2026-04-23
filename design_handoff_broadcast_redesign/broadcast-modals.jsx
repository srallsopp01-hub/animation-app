/* Export, Share, Roster modals — themed via palette prop. */

const { useState: useStateM, useEffect: useEffectM } = React;

function ModalShell({ p, onClose, title, subtitle, children, width = 560 }) {
  useEffectM(() => {
    const esc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.72)',
      display: 'grid', placeItems: 'center', zIndex: 50,
      backdropFilter: 'blur(3px)',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width, maxWidth: '92%', maxHeight: '88%', overflow: 'auto',
        background: p.bgElev, border: `1px solid ${p.borderStrong}`, borderRadius: 3,
        boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px', borderBottom: `1px solid ${p.border}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            <span style={{ fontFamily: '"Oswald",Impact,sans-serif', fontSize: 20, fontWeight: 600,
              letterSpacing: '0.06em', textTransform: 'uppercase', color: p.text }}>{title}</span>
            {subtitle && <div style={{ marginTop: 4 }}>
              <span style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 10,
                letterSpacing: '0.18em', textTransform: 'uppercase', color: p.textMute }}>{subtitle}</span>
            </div>}
          </div>
          <button onClick={onClose} style={{
            background: 'transparent', border: `1px solid ${p.border}`,
            color: p.text, width: 28, height: 28, cursor: 'pointer', borderRadius: 2,
            fontFamily: 'sans-serif', fontSize: 16,
          }}>×</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

function ExportModal({ p, onClose }) {
  const [fmt, setFmt] = useStateM('video');
  const [quality, setQuality] = useStateM('hd');
  const [annotations, setAnnotations] = useStateM(true);
  const [coachNotes, setCoachNotes] = useStateM(true);
  const formats = [
    { id: 'video', name: 'Video · MP4',      sub: 'Animated playback · 1080p/4K', size: '~84 MB' },
    { id: 'pdf',   name: 'PDF Playbook',     sub: 'Static phase sheets · printable', size: '~2.1 MB' },
    { id: 'seq',   name: 'Image sequence',   sub: 'PNG per phase · 7 frames', size: '~14 MB' },
    { id: 'gif',   name: 'Animated GIF',     sub: 'Quick share · 720p', size: '~38 MB' },
  ];

  const mono = { fontFamily: '"JetBrains Mono",monospace', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' };

  return (
    <ModalShell p={p} onClose={onClose} title="Export Play" subtitle="Lineout Strike · Off the Top – 9">
      <div style={{ padding: 20 }}>
        <div style={{ ...mono, color: p.textMute, display: 'block', marginBottom: 10 }}>Format</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
          {formats.map(f => {
            const active = fmt === f.id;
            return (
              <button key={f.id} onClick={() => setFmt(f.id)} style={{
                padding: '14px', textAlign: 'left', cursor: 'pointer',
                background: active ? p.bgElev2 : 'transparent',
                border: `1px solid ${active ? p.accent : p.border}`,
                borderLeft: `3px solid ${active ? p.accent : p.border}`,
                borderRadius: 2,
              }}>
                <div style={{ fontFamily: '"Oswald",Impact,sans-serif', fontSize: 14, fontWeight: 600,
                  color: active ? p.accent : p.text, textTransform: 'uppercase' }}>{f.name}</div>
                <div style={{ height: 4 }} />
                <div style={{ ...mono, color: p.textDim, fontSize: 9.5 }}>{f.sub}</div>
                <div style={{ marginTop: 6 }}>
                  <span style={{ ...mono, color: p.textMute, fontSize: 9 }}>{f.size}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ ...mono, color: p.textMute, display: 'block', marginBottom: 10 }}>Quality</div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {[['sd','720p'],['hd','1080p'],['uhd','4K UHD']].map(([id, l]) => (
            <button key={id} onClick={() => setQuality(id)} style={{
              padding: '8px 14px', cursor: 'pointer', borderRadius: 2,
              background: quality === id ? p.accent : 'transparent',
              color: quality === id ? '#0a0a0a' : p.text,
              border: `1px solid ${quality === id ? p.accent : p.borderStrong}`,
              ...mono, fontWeight: quality === id ? 700 : 500,
            }}>{l}</button>
          ))}
        </div>

        <div style={{ ...mono, color: p.textMute, display: 'block', marginBottom: 10 }}>Include</div>
        {[['Arrow annotations', annotations, setAnnotations], ['Coach cue overlay', coachNotes, setCoachNotes]].map(([l, v, set]) => (
          <label key={l} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', cursor: 'pointer', color: p.text, fontSize: 13 }}>
            <input type="checkbox" checked={v} onChange={(e) => set(e.target.checked)}
              style={{ accentColor: p.accent, width: 16, height: 16 }} />
            {l}
          </label>
        ))}
      </div>
      <div style={{
        padding: '14px 20px', borderTop: `1px solid ${p.border}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: p.bg,
      }}>
        <span style={{ ...mono, color: p.textMute }}>
          Est: {fmt === 'video' && quality === 'uhd' ? '312 MB' : fmt === 'pdf' ? '2.1 MB' : '84 MB'}
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onClose} style={{
            display: 'flex', alignItems: 'center', padding: '0 14px', height: 36,
            background: 'transparent', color: p.text, border: `1px solid ${p.borderStrong}`,
            borderRadius: 2, cursor: 'pointer',
          }}><span style={mono}>Cancel</span></button>
          <button style={{
            display: 'flex', alignItems: 'center', padding: '0 14px', height: 36,
            background: p.accent, color: '#0a0a0a', border: `1px solid ${p.accent}`,
            borderRadius: 2, cursor: 'pointer',
          }}><span style={{ ...mono, color: '#0a0a0a', fontWeight: 700 }}>Generate export</span></button>
        </div>
      </div>
    </ModalShell>
  );
}

function ShareModal({ p, onClose }) {
  const [copied, setCopied] = useStateM(false);
  const mono = { fontFamily: '"JetBrains Mono",monospace', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' };
  const link = 'https://play.bk/IRE-L04/off-the-top-9';
  const staff = [
    { initials: 'AF', name: 'Andy Farrell',    role: 'Head Coach',    status: 'Viewing' },
    { initials: 'SE', name: 'Simon Easterby',  role: 'Def. Coach',    status: '' },
    { initials: 'MC', name: 'Mike Catt',        role: 'Att. Coach',    status: 'Online' },
    { initials: 'PO', name: "Paul O'Connell",  role: 'Forwards',      status: '' },
  ];
  return (
    <ModalShell p={p} onClose={onClose} title="Share this play" subtitle="Coaches, analysts and players" width={520}>
      <div style={{ padding: 20 }}>
        <div style={{ ...mono, color: p.textMute, display: 'block', marginBottom: 8 }}>Link</div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
          <div style={{
            flex: 1, padding: '10px 12px', background: p.bg, border: `1px solid ${p.border}`, borderRadius: 2,
            fontFamily: '"JetBrains Mono"', fontSize: 12, color: p.textDim,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{link}</div>
          <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1400); }}
            style={{
              padding: '0 14px', height: 40, cursor: 'pointer',
              background: copied ? p.accent : 'transparent',
              border: `1px solid ${copied ? p.accent : p.borderStrong}`,
              color: copied ? '#0a0a0a' : p.text, borderRadius: 2,
            }}>
            <span style={{ ...mono, color: 'inherit', fontWeight: 700 }}>{copied ? 'Copied ✓' : 'Copy'}</span>
          </button>
        </div>

        <div style={{ ...mono, color: p.textMute, display: 'block', marginBottom: 10 }}>Send to staff</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: p.border, marginBottom: 18 }}>
          {staff.map(s => (
            <div key={s.initials} style={{ background: p.bgElev, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 32, height: 32, background: p.bgElev2, borderRadius: 2,
                display: 'grid', placeItems: 'center',
                fontFamily: '"Oswald"', fontWeight: 600, color: p.accent, fontSize: 12,
              }}>{s.initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: p.text, fontSize: 13, fontWeight: 500 }}>{s.name}</div>
                <span style={{ ...mono, color: p.textMute, fontSize: 9 }}>{s.role}</span>
              </div>
              {s.status && <span style={{ ...mono, color: s.status === 'Viewing' ? p.accent : '#22c55e', fontSize: 9 }}>✓ {s.status}</span>}
              <button style={{ padding: '4px 10px', background: 'transparent', border: `1px solid ${p.border}`, color: p.text, cursor: 'pointer', borderRadius: 2 }}>
                <span style={mono}>Send</span>
              </button>
            </div>
          ))}
        </div>

        <div style={{ ...mono, color: p.textMute, display: 'block', marginBottom: 10 }}>Channels</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
          {['Team iPad', 'Slack · #attack', 'Email squad', 'QR code'].map(c => (
            <button key={c} style={{
              height: 48, background: 'transparent', border: `1px solid ${p.borderStrong}`,
              color: p.text, cursor: 'pointer', borderRadius: 2,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ ...mono, fontSize: 9 }}>{c}</span>
            </button>
          ))}
        </div>
      </div>
    </ModalShell>
  );
}

function RosterModal({ p, onClose, selectedN, setSelectedN, onBall }) {
  const mono = { fontFamily: '"JetBrains Mono",monospace', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' };
  return (
    <ModalShell p={p} onClose={onClose} title="IRE Squad" subtitle="15-man starting XV · Tap to select" width={720}>
      <div style={{ padding: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: p.border }}>
          {ROSTER_IRE.map(r => {
            const isOnBall   = r.n === onBall;
            const isSelected = r.n === selectedN;
            return (
              <button key={r.n} onClick={() => { setSelectedN(r.n); onClose(); }} style={{
                background: p.bgElev, border: 'none', padding: 12, cursor: 'pointer', textAlign: 'left',
                borderLeft: `3px solid ${isSelected ? p.accent : isOnBall ? p.accentHot : 'transparent'}`,
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 44, height: 44, background: isOnBall ? p.accent : p.bgElev2,
                  color: isOnBall ? '#0a0a0a' : p.text,
                  display: 'grid', placeItems: 'center',
                  fontFamily: '"Oswald"', fontSize: 22, fontWeight: 700, borderRadius: 2, flex: 'none',
                }}>{r.n}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: p.text, fontSize: 13, fontWeight: 600,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
                  <span style={{ ...mono, color: p.textMute, fontSize: 9 }}>{r.pos}</span>
                </div>
                {isOnBall && <span style={{ ...mono, color: p.accent, fontSize: 9 }}>✓ BALL</span>}
              </button>
            );
          })}
        </div>
      </div>
    </ModalShell>
  );
}

Object.assign(window, { ExportModal, ShareModal, RosterModal, ModalShell });
