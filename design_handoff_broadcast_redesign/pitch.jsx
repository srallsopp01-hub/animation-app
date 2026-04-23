/* Shared rugby pitch + actors — used by Studio and Chalk variations.
   Coordinate space: normX (0–1, try to try) × normY (0–1, touchline to touchline). */

const SAMPLE = {
  name: "LO7 — top, off the top to 10",
  duration: 2400,
  actors: [
    { t: 'p', team: 'home', n: 2,  name: 'Sheehan',   x: 0.250, y: 0.014 },
    { t: 'p', team: 'home', n: 1,  name: 'Porter',    x: 0.247, y: 0.080 },
    { t: 'p', team: 'home', n: 4,  name: 'Ryan',      x: 0.247, y: 0.098 },
    { t: 'p', team: 'home', n: 3,  name: 'Furlong',   x: 0.247, y: 0.116 },
    { t: 'p', team: 'home', n: 5,  name: 'Henderson', x: 0.247, y: 0.134 },
    { t: 'p', team: 'home', n: 6,  name: "O'Mahony",  x: 0.247, y: 0.152 },
    { t: 'p', team: 'home', n: 7,  name: 'van der F', x: 0.247, y: 0.170 },
    { t: 'p', team: 'home', n: 8,  name: 'Doris',     x: 0.247, y: 0.188 },
    { t: 'p', team: 'home', n: 9,  name: 'Gibson-P',  x: 0.254, y: 0.206 },
    { t: 'p', team: 'home', n: 10, name: 'Crowley',   x: 0.310, y: 0.280 },
    { t: 'p', team: 'home', n: 12, name: 'Aki',       x: 0.350, y: 0.360 },
    { t: 'p', team: 'home', n: 13, name: 'Ringrose',  x: 0.390, y: 0.450 },
    { t: 'p', team: 'home', n: 14, name: 'Keenan',    x: 0.440, y: 0.540 },
    { t: 'p', team: 'home', n: 15, name: 'Hansen',    x: 0.420, y: 0.660 },
    { t: 'p', team: 'home', n: 11, name: 'Lowe',      x: 0.262, y: 0.044 },
    { t: 'p', team: 'away', n: 2,  x: 0.253, y: 0.013 },
    { t: 'p', team: 'away', n: 1,  x: 0.253, y: 0.080 },
    { t: 'p', team: 'away', n: 4,  x: 0.253, y: 0.098 },
    { t: 'p', team: 'away', n: 3,  x: 0.253, y: 0.116 },
    { t: 'p', team: 'away', n: 5,  x: 0.253, y: 0.134 },
    { t: 'p', team: 'away', n: 6,  x: 0.253, y: 0.152 },
    { t: 'p', team: 'away', n: 7,  x: 0.253, y: 0.170 },
    { t: 'p', team: 'away', n: 8,  x: 0.253, y: 0.188 },
    { t: 'p', team: 'away', n: 9,  x: 0.248, y: 0.210 },
    { t: 'p', team: 'away', n: 10, x: 0.264, y: 0.278 },
    { t: 'p', team: 'away', n: 12, x: 0.274, y: 0.366 },
    { t: 'p', team: 'away', n: 13, x: 0.280, y: 0.454 },
    { t: 'p', team: 'away', n: 14, x: 0.286, y: 0.542 },
    { t: 'p', team: 'away', n: 15, x: 0.276, y: 0.650 },
    { t: 'p', team: 'away', n: 11, x: 0.254, y: 0.040 },
    { t: 'b', x: 0.248, y: 0.160 },
  ],
  arrows: [
    { type: 'pass', fromX: 0.250, fromY: 0.014, toX: 0.248, toY: 0.188, cpX: 0.232, cpY: 0.100 },
    { type: 'pass', fromX: 0.248, fromY: 0.188, toX: 0.254, toY: 0.206 },
    { type: 'pass', fromX: 0.254, fromY: 0.206, toX: 0.310, toY: 0.280 },
    { type: 'run',  fromX: 0.310, fromY: 0.280, toX: 0.400, toY: 0.340, cpX: 0.345, cpY: 0.290 },
    { type: 'pass', fromX: 0.400, fromY: 0.340, toX: 0.390, toY: 0.450 },
  ],
  zones: [
    { shape: 'rect', x: 0.320, y: 0.280, w: 0.160, h: 0.200, color: 'rgba(59,130,246,0.9)', label: 'Strike channel' }
  ],
};

const SCENES = [
  { id: 's1', name: '01 Set piece',   actorsCount: 30, duration: 1.5 },
  { id: 's2', name: '02 Off the top', actorsCount: 30, duration: 2.4, active: true },
  { id: 's3', name: '03 10 cut line', actorsCount: 30, duration: 1.8 },
  { id: 's4', name: '04 Skip to 13',  actorsCount: 30, duration: 1.6 },
  { id: 's5', name: '05 Offload',     actorsCount: 31, duration: 2.2 },
  { id: 's6', name: '06 Phase 2',     actorsCount: 31, duration: 2.0 },
  { id: 's7', name: '07 Strike',      actorsCount: 31, duration: 2.8 },
];

function Pitch({ w, h, theme = 'studio', scene = SAMPLE, showArrows = true, showZones = true, showNames = false, homeColor, awayColor }) {
  const L = { homeTry: 6/112, home22: 25/112, home10: 40/112, half: 56/112, away10: 72/112, away22: 87/112, awayTry: 106/112 };
  const t = themes[theme];
  const HOME = homeColor ?? t.home;
  const AWAY = awayColor ?? t.away;
  const actorR = theme === 'broadcast' ? 13 : 12;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <defs>
        {theme === 'broadcast' && (
          <pattern id="pitch-stripe" x="0" y="0" width={w/14} height={h} patternUnits="userSpaceOnUse">
            <rect width={w/14} height={h} fill={t.pitch} />
            <rect x={w/28} width={w/28} height={h} fill={t.pitchStripe} />
          </pattern>
        )}
        <marker id={`ah-run-${theme}`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill={t.arrowRun} />
        </marker>
        <marker id={`ah-pass-${theme}`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill={t.arrowPass} />
        </marker>
        <marker id={`ah-kick-${theme}`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill={t.arrowKick} />
        </marker>
      </defs>

      <rect x={0} y={0} width={w} height={h} fill={theme === 'broadcast' ? 'url(#pitch-stripe)' : t.pitch} />
      <rect x={0} y={0} width={L.homeTry * w} height={h} fill={t.inGoal} />
      <rect x={L.awayTry * w} y={0} width={(1 - L.awayTry) * w} height={h} fill={t.inGoal} />

      {[L.homeTry, L.home22, L.home10, L.half, L.away10, L.away22, L.awayTry].map((frac, i) => (
        <line key={i} x1={frac * w} y1={0} x2={frac * w} y2={h}
          stroke={t.line} strokeWidth={i === 3 ? 1.4 : 1}
          strokeDasharray={i === 2 || i === 4 ? '6 4' : undefined}
          opacity={t.lineOpacity} />
      ))}
      {[5/70, 15/70, 55/70, 65/70].map((frac, i) => (
        <line key={`c${i}`} x1={L.homeTry * w} y1={frac * h} x2={L.awayTry * w} y2={frac * h}
          stroke={t.line} strokeWidth={0.6} strokeDasharray="2 4" opacity={t.lineOpacity * 0.7} />
      ))}
      <rect x={0} y={0} width={w} height={h} fill="none" stroke={t.line} strokeWidth={1} opacity={t.lineOpacity} />
      <circle cx={L.half * w} cy={h/2} r={2} fill={t.line} opacity={t.lineOpacity} />

      {showZones && scene.zones?.map((z, i) => {
        const fill = z.color.replace(/[\d.]+\)$/, '0.18)');
        return (
          <g key={`z${i}`}>
            <rect x={z.x * w} y={z.y * h} width={z.w * w} height={z.h * h}
              fill={fill} stroke={z.color} strokeWidth={1} strokeDasharray="4 3" rx={2} />
            {z.label && (
              <text x={z.x * w + 6} y={z.y * h + 14} fill={z.color} fontSize={10}
                fontFamily={t.mono} fontWeight={600} letterSpacing="0.05em"
                style={{ textTransform: 'uppercase' }}>{z.label}</text>
            )}
          </g>
        );
      })}

      {showArrows && scene.arrows?.map((ar, i) => {
        const color = ar.type === 'run' ? t.arrowRun : ar.type === 'pass' ? t.arrowPass : t.arrowKick;
        const dash = ar.type === 'pass' ? '6 4' : ar.type === 'kick' ? '10 5' : undefined;
        const x1 = ar.fromX * w, y1 = ar.fromY * h, x2 = ar.toX * w, y2 = ar.toY * h;
        const d = ar.cpX !== undefined
          ? `M${x1},${y1} Q${ar.cpX * w},${ar.cpY * h} ${x2},${y2}`
          : `M${x1},${y1} L${x2},${y2}`;
        return <path key={`a${i}`} d={d} stroke={color} strokeWidth={2} strokeLinecap="round"
          strokeDasharray={dash} fill="none" markerEnd={`url(#ah-${ar.type}-${theme})`} />;
      })}

      {scene.actors.map((actor, i) => {
        const cx = actor.x * w, cy = actor.y * h;
        if (actor.t === 'b') {
          return (
            <g key={`ac${i}`} transform={`translate(${cx},${cy}) rotate(-20)`}>
              <ellipse rx={7} ry={11} fill={t.ball} stroke="#fff" strokeWidth={1.5} />
              <line x1={-5} y1={0} x2={5} y2={0} stroke="#fff" strokeWidth={0.8} />
            </g>
          );
        }
        const color = actor.team === 'home' ? HOME : AWAY;
        return (
          <g key={`ac${i}`}>
            {theme === 'broadcast' && <circle cx={cx} cy={cy + 1} r={actorR + 0.5} fill="#000" opacity={0.35} />}
            <circle cx={cx} cy={cy} r={actorR} fill={color} stroke={t.actorStroke} strokeWidth={theme === 'chalk' ? 1.5 : 2} />
            <text x={cx} y={cy + 4} textAnchor="middle" fontSize={11} fontWeight={700}
              fill={t.actorText} fontFamily={theme === 'chalk' ? t.serif : t.sans}>{actor.n}</text>
            {showNames && actor.name && (
              <text x={cx} y={cy + actorR + 11} textAnchor="middle" fontSize={8.5}
                fill={t.nameText} fontFamily={t.mono} letterSpacing="0.02em">{actor.name}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

const themes = {
  studio: {
    pitch: '#1a3a23', pitchStripe: '#1d4128', inGoal: '#14301c',
    line: '#e8efe6', lineOpacity: 0.55,
    home: '#4f8bf0', away: '#ea5050', ball: '#f5b84a',
    actorStroke: '#ffffff', actorText: '#ffffff', nameText: 'rgba(255,255,255,0.75)',
    arrowRun: '#ffffff', arrowPass: 'rgba(255,255,255,0.82)', arrowKick: '#f5b84a',
    mono: '"JetBrains Mono", ui-monospace, monospace',
    sans: '"Inter Tight", "Inter", system-ui, sans-serif',
    serif: 'ui-serif, serif',
  },
  chalk: {
    pitch: '#e8e3d5', pitchStripe: '#e8e3d5', inGoal: '#dcd5c3',
    line: '#2d3b2a', lineOpacity: 0.75,
    home: '#1e3a8a', away: '#991b1b', ball: '#92400e',
    actorStroke: '#fdfaf2', actorText: '#fdfaf2', nameText: 'rgba(45,59,42,0.75)',
    arrowRun: '#1c2617', arrowPass: 'rgba(28,38,23,0.75)', arrowKick: '#92400e',
    mono: '"JetBrains Mono", ui-monospace, monospace',
    sans: '"Söhne", "Inter", system-ui, sans-serif',
    serif: '"Fraunces", Georgia, serif',
  },
  broadcast: {
    pitch: '#0e3b1e', pitchStripe: '#114425', inGoal: '#072612',
    line: '#ffffff', lineOpacity: 0.75,
    home: '#f7b500', away: '#e11d48', ball: '#fde047',
    actorStroke: '#ffffff', actorText: '#0a0a0a', nameText: 'rgba(255,255,255,0.9)',
    arrowRun: '#ffffff', arrowPass: 'rgba(255,255,255,0.85)', arrowKick: '#fde047',
    mono: '"JetBrains Mono", ui-monospace, monospace',
    sans: '"Oswald", "Inter", system-ui, sans-serif',
    serif: 'ui-serif, serif',
  },
};

Object.assign(window, { Pitch, SAMPLE, SCENES, themes });
