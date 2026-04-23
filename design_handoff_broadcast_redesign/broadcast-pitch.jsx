/* Unified pitch renderer — takes a palette token object, scene actors array,
   arrows, optional zone, selected player, onBall number, theme name.        */

function BroadcastPitch({
  w, h, palette,
  actors = [], arrows = [], zone = null,
  onBall = null, selectedN = null,
  showNames = true, onSelectPlayer = () => {},
  theme = 'dark',
}) {
  const L = {
    homeTry: 6/112, home22: 25/112, home10: 40/112,
    half: 56/112,
    away10: 72/112, away22: 87/112, awayTry: 106/112,
  };

  const pitchFill    = theme === 'light' ? '#d8ebc8' : theme === 'navy' ? '#0f2a3d' : '#0e3b1e';
  const pitchStripe  = theme === 'light' ? '#cde4b8' : theme === 'navy' ? '#133349' : '#114425';
  const inGoal       = theme === 'light' ? '#b9d4a2' : theme === 'navy' ? '#081e2d' : '#072612';
  const lineColor    = theme === 'light' ? '#2a3b1c' : '#ffffff';
  const lineOp       = theme === 'light' ? 0.55 : 0.72;

  const arrowColor = (t) => palette[t === 'run' ? 'arrowRun' : t === 'pass' ? 'arrowPass' : 'arrowKick'];

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <defs>
        <pattern id={`bp-stripe-${theme}`} x="0" y="0" width={w/14} height={h} patternUnits="userSpaceOnUse">
          <rect width={w/14} height={h} fill={pitchFill} />
          <rect x={w/28} width={w/28} height={h} fill={pitchStripe} />
        </pattern>
        {['run','pass','kick'].map(t => (
          <marker key={t} id={`bp-${theme}-${t}`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill={arrowColor(t)} />
          </marker>
        ))}
        <filter id="bp-glow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Pitch */}
      <rect x={0} y={0} width={w} height={h} fill={`url(#bp-stripe-${theme})`} />
      <rect x={0} y={0} width={L.homeTry * w} height={h} fill={inGoal} />
      <rect x={L.awayTry * w} y={0} width={(1 - L.awayTry) * w} height={h} fill={inGoal} />

      {/* Lines */}
      {[L.homeTry, L.home22, L.home10, L.half, L.away10, L.away22, L.awayTry].map((frac, i) => (
        <line key={i} x1={frac * w} y1={0} x2={frac * w} y2={h}
          stroke={lineColor} strokeWidth={i === 3 ? 1.5 : 1}
          strokeDasharray={i === 2 || i === 4 ? '6 4' : undefined}
          opacity={lineOp} />
      ))}
      {[5/70, 15/70, 55/70, 65/70].map((frac, i) => (
        <line key={`c${i}`} x1={L.homeTry * w} y1={frac * h} x2={L.awayTry * w} y2={frac * h}
          stroke={lineColor} strokeWidth={0.6} strokeDasharray="2 4" opacity={lineOp * 0.6} />
      ))}
      <rect x={0} y={0} width={w} height={h} fill="none" stroke={lineColor} strokeWidth={1} opacity={lineOp} />

      {/* Zone */}
      {zone && (
        <g>
          <rect x={zone.x * w} y={zone.y * h} width={zone.w * w} height={zone.h * h}
            fill={zone.color === 'gold' ? 'rgba(247,181,0,0.14)' : 'rgba(247,181,0,0.10)'}
            stroke={palette.accent} strokeWidth={1.2} strokeDasharray="5 4" rx={2} />
          {zone.label && (
            <text x={zone.x * w + 8} y={zone.y * h + 16}
              fill={palette.accent} fontSize={10.5}
              fontFamily='"Oswald", Impact, sans-serif' fontWeight={600}
              letterSpacing="0.14em" style={{ textTransform: 'uppercase' }}>
              {zone.label}
            </text>
          )}
        </g>
      )}

      {/* Arrows */}
      {arrows.map((ar, i) => {
        const color = arrowColor(ar.type);
        const dash = ar.type === 'pass' ? '6 4' : ar.type === 'kick' ? '10 5' : undefined;
        const x1 = ar.from.x * w, y1 = ar.from.y * h, x2 = ar.to.x * w, y2 = ar.to.y * h;
        const d = ar.cp
          ? `M${x1},${y1} Q${ar.cp.x * w},${ar.cp.y * h} ${x2},${y2}`
          : `M${x1},${y1} L${x2},${y2}`;
        return (
          <path key={`a${i}`} d={d}
            stroke={color} strokeWidth={2.5} strokeLinecap="round"
            strokeDasharray={dash} fill="none"
            markerEnd={`url(#bp-${theme}-${ar.type})`} />
        );
      })}

      {/* Actors */}
      {actors.map((ac, i) => {
        if (!ac) return null;
        const cx = ac.x * w, cy = ac.y * h;
        if (ac.t === 'b') {
          return (
            <g key={`b${i}`} transform={`translate(${cx},${cy}) rotate(-20)`} style={{ filter: 'url(#bp-glow)' }}>
              <ellipse rx={8} ry={12} fill={palette.ball} stroke="#fff" strokeWidth={1.6} />
              <line x1={-5} y1={0} x2={5} y2={0} stroke="#fff" strokeWidth={1} />
            </g>
          );
        }
        const isOnBall   = onBall === ac.n && ac.team === 'home';
        const isSelected = selectedN === ac.n && ac.team === 'home';
        const color = ac.team === 'home' ? palette.home : palette.away;
        const r = 13;
        return (
          <g key={`p${i}`} onClick={() => ac.team === 'home' && onSelectPlayer(ac.n)}
            style={{ cursor: ac.team === 'home' ? 'pointer' : 'default' }}>
            <circle cx={cx} cy={cy + 1.5} r={r + 0.5} fill="#000" opacity={0.35} />
            {isOnBall && (
              <circle cx={cx} cy={cy} r={r + 7} fill="none" stroke={palette.accent} strokeWidth={1.5} opacity={0.9} />
            )}
            {isSelected && !isOnBall && (
              <circle cx={cx} cy={cy} r={r + 5} fill="none" stroke="#fff" strokeWidth={1.5} strokeDasharray="3 2" />
            )}
            <circle cx={cx} cy={cy} r={r} fill={color} stroke="#fff" strokeWidth={2} />
            <text x={cx} y={cy + 4} textAnchor="middle"
              fontSize={11.5} fontWeight={700}
              fill={ac.team === 'home' && palette.homeIsLight ? '#0a0a0a' : '#fff'}
              fontFamily='"Inter", system-ui, sans-serif'>
              {ac.n}
            </text>
            {showNames && ac.name && ac.team === 'home' && (
              <text x={cx} y={cy + r + 12} textAnchor="middle"
                fontSize={8.5} fill="rgba(255,255,255,0.85)"
                fontFamily='"JetBrains Mono", monospace'
                letterSpacing="0.04em" fontWeight={500}>
                {ac.name}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

Object.assign(window, { BroadcastPitch });
