/* Scene data for the full 7-phase Lineout Strike — Off the Top play. */

const ROSTER_IRE = [
  { n:  1, name: 'Porter',       pos: 'Loosehead Prop',    role: 'Jumper lift · front pod' },
  { n:  2, name: 'Sheehan',      pos: 'Hooker',            role: 'Thrower · hits 8 at tail' },
  { n:  3, name: 'Furlong',      pos: 'Tighthead Prop',    role: 'Lift · middle pod' },
  { n:  4, name: 'Ryan',         pos: 'Lock',              role: 'Jumper · 2-man option' },
  { n:  5, name: 'Henderson',    pos: 'Lock',              role: 'Lift · tail' },
  { n:  6, name: "O'Mahony",     pos: 'Blindside Flanker', role: 'Lift · tail (capt.)' },
  { n:  7, name: 'van der Flier',pos: 'Openside Flanker',  role: 'Jumper · tail pod' },
  { n:  8, name: 'Doris',        pos: 'Number 8',          role: 'Receives off top' },
  { n:  9, name: 'Gibson-Park',  pos: 'Scrum-half',        role: 'First receiver · pulls flat' },
  { n: 10, name: 'Crowley',      pos: 'Fly-half',          role: 'Cut line · distributor' },
  { n: 11, name: 'Lowe',         pos: 'Left Wing',         role: 'Blindside option' },
  { n: 12, name: 'Aki',          pos: 'Inside Centre',     role: 'Crash line · hold-up' },
  { n: 13, name: 'Ringrose',     pos: 'Outside Centre',    role: 'Strike receiver (skip)' },
  { n: 14, name: 'Keenan',       pos: 'Right Wing',        role: 'Finisher · outside shoulder' },
  { n: 15, name: 'Hansen',       pos: 'Fullback',          role: 'Deep insertion · late' },
];

const PHASES = [
  { id: 'p1', name: 'Set piece',     duration: 1.5, cue: 'Lineout set. Pod call in. 8 at the tail, 9 behind.', onBall: null, arrows: [], zone: null },
  { id: 'p2', name: 'Off the top – 9', duration: 2.4, cue: '9 pulls flat to 10 — fix first def, skip to 13 on edge.', onBall: 9,
    arrows: [
      { type: 'pass', from: { x: 0.250, y: 0.014 }, to: { x: 0.248, y: 0.188 }, cp: { x: 0.232, y: 0.100 } },
      { type: 'pass', from: { x: 0.248, y: 0.188 }, to: { x: 0.254, y: 0.206 } },
    ],
    zone: { x: 0.320, y: 0.280, w: 0.160, h: 0.200, label: 'Strike channel' },
  },
  { id: 'p3', name: '10 cut line',   duration: 1.8, cue: '10 flat, fixes 12 defender — threatens line, skip pass loaded.', onBall: 10,
    arrows: [
      { type: 'pass', from: { x: 0.254, y: 0.206 }, to: { x: 0.340, y: 0.310 } },
      { type: 'run',  from: { x: 0.310, y: 0.280 }, to: { x: 0.400, y: 0.340 }, cp: { x: 0.345, y: 0.290 } },
    ],
    zone: { x: 0.320, y: 0.280, w: 0.160, h: 0.200, label: 'Strike channel' },
  },
  { id: 'p4', name: 'Skip – 13',     duration: 1.6, cue: 'Skip pass 10 → 13. 12 runs hold-up. 13 takes it flat to the line.', onBall: 13,
    arrows: [
      { type: 'pass', from: { x: 0.400, y: 0.340 }, to: { x: 0.430, y: 0.460 } },
      { type: 'run',  from: { x: 0.350, y: 0.360 }, to: { x: 0.420, y: 0.420 } },
    ],
    zone: { x: 0.380, y: 0.400, w: 0.160, h: 0.180, label: 'Break zone' },
  },
  { id: 'p5', name: 'Offload',        duration: 2.2, cue: '13 through the first tackle, offload out the back to 14.', onBall: 14, arrows: [], zone: null },
  { id: 'p6', name: 'Phase 2',        duration: 2.0, cue: '14 carries, breakdown set. 9 on the base, 10 looking again.', onBall: 9,
    arrows: [],
    zone: { x: 0.520, y: 0.560, w: 0.100, h: 0.110, label: 'Ruck' },
  },
  { id: 'p7', name: 'Strike – try',   duration: 2.8, cue: '9 pulls to 15 coming off the back door. Hansen hits gap — try.', onBall: 15,
    arrows: [
      { type: 'pass', from: { x: 0.560, y: 0.610 }, to: { x: 0.700, y: 0.500 } },
      { type: 'pass', from: { x: 0.700, y: 0.500 }, to: { x: 0.820, y: 0.400 } },
      { type: 'run',  from: { x: 0.820, y: 0.400 }, to: { x: 0.940, y: 0.350 }, cp: { x: 0.880, y: 0.360 } },
    ],
    zone: { x: 0.870, y: 0.180, w: 0.076, h: 0.640, label: 'In-goal', color: 'gold' },
  },
];

function actorsForPhase(phaseIdx) {
  const HX = 0.247, AX = 0.253;
  const LY = [0.080, 0.098, 0.116, 0.134, 0.152, 0.170, 0.188];
  const homeForwards = [
    { n: 1, name: 'Porter' }, { n: 4, name: 'Ryan' }, { n: 3, name: 'Furlong' },
    { n: 5, name: 'Henderson' }, { n: 6, name: "O'Mahony" }, { n: 7, name: 'v.d.Flier' }, { n: 8, name: 'Doris' },
  ];
  const awayForwards = [{ n: 1 }, { n: 4 }, { n: 3 }, { n: 5 }, { n: 6 }, { n: 7 }, { n: 8 }];

  if (phaseIdx <= 1) {
    return [
      { t:'p', team:'home', n:2, name:'Sheehan', x:0.250, y:0.014 },
      ...homeForwards.map((p, i) => ({ t:'p', team:'home', ...p, x:HX, y:LY[i] })),
      { t:'p', team:'home', n:9,  name:'Gibson-P', x:0.254, y:0.206 },
      { t:'p', team:'home', n:10, name:'Crowley',  x:0.310, y:0.280 },
      { t:'p', team:'home', n:12, name:'Aki',      x:0.350, y:0.360 },
      { t:'p', team:'home', n:13, name:'Ringrose', x:0.390, y:0.450 },
      { t:'p', team:'home', n:14, name:'Keenan',   x:0.440, y:0.540 },
      { t:'p', team:'home', n:15, name:'Hansen',   x:0.420, y:0.660 },
      { t:'p', team:'home', n:11, name:'Lowe',     x:0.262, y:0.044 },
      { t:'p', team:'away', n:2, x:0.253, y:0.013 },
      ...awayForwards.map((p, i) => ({ t:'p', team:'away', ...p, x:AX, y:LY[i] })),
      { t:'p', team:'away', n:9,  x:0.248, y:0.210 },
      { t:'p', team:'away', n:10, x:0.264, y:0.278 },
      { t:'p', team:'away', n:12, x:0.274, y:0.366 },
      { t:'p', team:'away', n:13, x:0.280, y:0.454 },
      { t:'p', team:'away', n:14, x:0.286, y:0.542 },
      { t:'p', team:'away', n:15, x:0.276, y:0.650 },
      { t:'p', team:'away', n:11, x:0.254, y:0.040 },
      phaseIdx === 0 ? { t:'b', x:0.240, y:0.020 } : { t:'b', x:0.254, y:0.206 },
    ];
  }
  // Simplified spread for later phases
  return [
    ...homeForwards.map((p, i) => ({ t:'p', team:'home', ...p, x:0.370+(i*0.020), y:0.240+(i*0.025) })),
    { t:'p', team:'home', n:2,  name:'Sheehan',  x:0.360, y:0.210 },
    { t:'p', team:'home', n:9,  name:'Gibson-P', x:0.440+(phaseIdx*0.04), y:0.400+(phaseIdx*0.04) },
    { t:'p', team:'home', n:10, name:'Crowley',  x:0.480+(phaseIdx*0.04), y:0.460 },
    { t:'p', team:'home', n:12, name:'Aki',      x:0.470+(phaseIdx*0.04), y:0.500 },
    { t:'p', team:'home', n:13, name:'Ringrose', x:0.490+(phaseIdx*0.04), y:0.540 },
    { t:'p', team:'home', n:14, name:'Keenan',   x:0.510+(phaseIdx*0.04), y:0.580 },
    { t:'p', team:'home', n:15, name:'Hansen',   x:0.470+(phaseIdx*0.04), y:0.660 },
    { t:'p', team:'home', n:11, name:'Lowe',     x:0.340, y:0.080 },
    ...awayForwards.map((p, i) => ({ t:'p', team:'away', ...p, x:0.400+(i*0.020), y:0.270+(i*0.025) })),
    { t:'p', team:'away', n:2,  x:0.380, y:0.230 },
    { t:'p', team:'away', n:9,  x:0.430+(phaseIdx*0.04), y:0.420+(phaseIdx*0.04) },
    { t:'p', team:'away', n:10, x:0.470+(phaseIdx*0.04), y:0.490 },
    { t:'p', team:'away', n:12, x:0.500+(phaseIdx*0.04), y:0.540 },
    { t:'p', team:'away', n:13, x:0.530+(phaseIdx*0.04), y:0.580 },
    { t:'p', team:'away', n:14, x:0.550+(phaseIdx*0.04), y:0.620 },
    { t:'p', team:'away', n:15, x:0.440+(phaseIdx*0.04), y:0.720 },
    { t:'p', team:'away', n:11, x:0.360, y:0.070 },
    { t:'b', x: PHASES[phaseIdx]?.zone ? PHASES[phaseIdx].zone.x + 0.02 : 0.5, y: 0.5 },
  ];
}

Object.assign(window, { PHASES, ROSTER_IRE, actorsForPhase });
