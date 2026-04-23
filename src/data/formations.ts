import type { FormationPreset } from '@/types';

// ─── Coordinate reference (landscape) ─────────────────────────────────────────
//   normX: 0 = home dead-ball → 1 = away dead-ball   (112 m)
//   normY: 0 = top touchline  → 1 = bottom touchline (70 m)
//   1 m = 0.00893 normX / 0.01429 normY
//   Home try ≈ 0.054  |  home 22 = 0.250  |  halfway = 0.500
//   Away 22 = 0.750   |  away try ≈ 0.946
//   Top 5 m channel = normY 0.071  |  top 15 m channel = normY 0.214
//
//   Jersey numbers: 1 LP  2 H  3 TP  4 L  5 L  6 BF  7 OF  8 N8
//                   9 SH  10 FH  11 LW  12 IC  13 OC  14 RW  15 FB

// ─── Compact builder helpers ──────────────────────────────────────────────────

type AP = { type: 'player'; team: 'home' | 'away'; number: number; normX: number; normY: number; locked: false };

const h = (n: number, x: number, y: number): AP =>
  ({ type: 'player', team: 'home', number: n, normX: x, normY: y, locked: false });

const a = (n: number, x: number, y: number): AP =>
  ({ type: 'player', team: 'away', number: n, normX: x, normY: y, locked: false });

// Mirror Y-axis for bottom-touchline variants
const bot = (actors: AP[]): AP[] =>
  actors.map(p => ({ ...p, normY: +((1 - p.normY).toFixed(3)) }));

// ─── Lineout constants ────────────────────────────────────────────────────────
// Home row at 0.247, Away row at 0.253 — 0.45 m corridor gap between the two lines.
// Players step 0.018 normY apart (≈ 1.26 m) starting at normY 0.080 (5.6 m from touchline).
const HX  = 0.247;   // home lineout column
const AX  = 0.253;   // away lineout column
const TX  = 0.250;   // lineout normX (home 22 mark)
const LY  = [0.080, 0.098, 0.116, 0.134, 0.152, 0.170, 0.188]; // 7 slots

// ─── Lineout: 7-man (top touchline) ──────────────────────────────────────────
// Home: #1 #4 #3 #5 #6 #7 #8 in line, #2 throws from touchline, #9 at tail
const lo7HomeTop: AP[] = [
  h( 2, TX,   0.014),          // hooker throws from touchline
  h( 1, HX,   LY[0]),          // front
  h( 4, HX,   LY[1]),
  h( 3, HX,   LY[2]),
  h( 5, HX,   LY[3]),
  h( 6, HX,   LY[4]),
  h( 7, HX,   LY[5]),
  h( 8, HX,   LY[6]),          // tail
  h( 9, 0.254, 0.206),         // SH at tail of lineout
  h(10, 0.272, 0.274),
  h(12, 0.282, 0.360),
  h(13, 0.288, 0.446),
  h(14, 0.294, 0.532),         // RW open side
  h(15, 0.284, 0.640),         // FB
  h(11, 0.262, 0.044),         // LW near touchline
];

// Away: same 7 positions, away #2 at their touchline side (doesn't throw)
const lo7AwayTop: AP[] = [
  a( 2, AX,   0.013),          // away hooker near touchline
  a( 1, AX,   LY[0]),
  a( 4, AX,   LY[1]),
  a( 3, AX,   LY[2]),
  a( 5, AX,   LY[3]),
  a( 6, AX,   LY[4]),
  a( 7, AX,   LY[5]),
  a( 8, AX,   LY[6]),
  a( 9, 0.248, 0.210),         // away SH behind their lineout
  a(10, 0.264, 0.278),
  a(12, 0.274, 0.366),
  a(13, 0.280, 0.454),
  a(14, 0.286, 0.542),
  a(15, 0.276, 0.650),
  a(11, 0.254, 0.040),
];

// ─── Lineout: 6+1 (top touchline) ────────────────────────────────────────────
// Home: #1 #4 #5 #6 #3 #8 in line (6 players).
// #7 stands at the fake-SH position (deception: looks like #9 at tail).
// #9 is in backs as first receiver — away defence expects #10 there.
const lo61HomeTop: AP[] = [
  h( 2, TX,   0.014),          // throws
  h( 1, HX,   LY[0]),
  h( 4, HX,   LY[1]),
  h( 5, HX,   LY[2]),
  h( 6, HX,   LY[3]),
  h( 3, HX,   LY[4]),
  h( 8, HX,   LY[5]),          // tail (tailY = 0.170)
  h( 7, 0.254, 0.180),         // #7 at fake-SH spot (tailY + 0.010)
  h( 9, 0.272, 0.258),         // #9 pushed to first-receiver role
  h(10, 0.280, 0.334),         // backs shifted one slot
  h(12, 0.288, 0.414),
  h(13, 0.294, 0.494),
  h(14, 0.298, 0.574),
  h(15, 0.288, 0.672),
  h(11, 0.262, 0.044),
];

// Away defends with standard 7-man lineup (they see the deception too late)
const lo61AwayTop: AP[] = lo7AwayTop;

// ─── Lineout: 5-man (top touchline) ──────────────────────────────────────────
// Home: #1 #4 #5 #6 #3 in line (5 players).
// #7 and #8 join the backs — extra ball-carriers for wide attack.
const lo5HomeTop: AP[] = [
  h( 2, TX,   0.014),          // throws
  h( 1, HX,   LY[0]),
  h( 4, HX,   LY[1]),
  h( 5, HX,   LY[2]),
  h( 6, HX,   LY[3]),
  h( 3, HX,   LY[4]),          // tail (tailY = 0.152)
  h( 7, 0.256, 0.168),         // #7 in backs, just behind tail
  h( 8, 0.263, 0.208),         // #8 in backs, extra carrier
  h( 9, 0.272, 0.272),         // SH first receiver
  h(10, 0.282, 0.338),
  h(12, 0.290, 0.416),
  h(13, 0.296, 0.494),
  h(14, 0.300, 0.572),
  h(15, 0.290, 0.666),
  h(11, 0.262, 0.044),
];

// Away also fields 5-man lineout with #7 and #8 in their backs
const lo5AwayTop: AP[] = [
  a( 2, AX,   0.013),
  a( 1, AX,   LY[0]),
  a( 4, AX,   LY[1]),
  a( 5, AX,   LY[2]),
  a( 6, AX,   LY[3]),
  a( 3, AX,   LY[4]),
  a( 7, 0.259, 0.170),
  a( 8, 0.266, 0.214),
  a( 9, 0.272, 0.280),
  a(10, 0.282, 0.348),
  a(12, 0.292, 0.424),
  a(13, 0.298, 0.502),
  a(14, 0.302, 0.580),
  a(15, 0.292, 0.678),
  a(11, 0.255, 0.040),
];

// ─── Scrum — top touchline ────────────────────────────────────────────────────
// Scrum at home 22 (normX ≈ 0.250), centered near top touchline (normY ≈ 0.246).
// Home front row at normX 0.248, away at 0.252 — tiny 0.45m engagement gap.
//
// Front row order (top → bottom, touching-line side first):
//   Home: #1 LP (touchline), #2 H, #3 TP (open side)
//   Away: #3 TP (opposite home LP), #2 H, #1 LP (opposite home TP)
//
// Second row: #4 locks on loosehead side, #5 on tighthead side.
// Back row: #6 BF on touchline/blind side, #7 OF on open side, #8 at back center.
const scrumTop: AP[] = [
  // Home tight 8
  h( 1, 0.248, 0.218),   // LP — loosehead, touchline side
  h( 2, 0.248, 0.246),   // Hooker
  h( 3, 0.248, 0.274),   // TP — tighthead, open side
  h( 4, 0.236, 0.228),   // Lock — loosehead side (behind 1/2 gap)
  h( 5, 0.236, 0.262),   // Lock — tighthead side (behind 2/3 gap)
  h( 6, 0.228, 0.206),   // BF — blindside (toward touchline)
  h( 7, 0.228, 0.286),   // OF — openside (toward center)
  h( 8, 0.222, 0.246),   // N8 — back center
  // Home backs (open side = higher normY)
  h( 9, 0.236, 0.316),   // SH — open side, feeds scrum
  h(10, 0.272, 0.376),
  h(12, 0.316, 0.436),
  h(13, 0.354, 0.496),
  h(14, 0.382, 0.562),   // RW — open side wing
  h(11, 0.296, 0.124),   // LW — blind side wing
  h(15, 0.360, 0.648),   // FB
  // Away tight 8 (tighthead faces home loosehead across the gap)
  a( 3, 0.252, 0.218),   // TP — opposite home LP
  a( 2, 0.252, 0.246),   // Hooker
  a( 1, 0.252, 0.274),   // LP — opposite home TP
  a( 5, 0.264, 0.228),   // Lock — their TP side (behind their #3)
  a( 4, 0.264, 0.262),   // Lock — their LP side (behind their #1)
  a( 6, 0.272, 0.206),   // BF — touchline side
  a( 7, 0.272, 0.286),   // OF — open side
  a( 8, 0.278, 0.246),   // N8
  // Away backs (defending on open side)
  a( 9, 0.262, 0.320),
  a(10, 0.298, 0.382),
  a(12, 0.340, 0.442),
  a(13, 0.378, 0.502),
  a(14, 0.408, 0.568),
  a(11, 0.318, 0.128),
  a(15, 0.390, 0.654),
];

// ─── Penalty attack ───────────────────────────────────────────────────────────
// Penalty on away 22 (normX ≈ 0.748), center field.
// Home forwards form staggered pods behind the mark (not a flat wall).
// Away team is 10 m back: 0.748 + 10/112 ≈ 0.837.
const penaltyAttack: AP[] = [
  // Home forward pods (layered from mark backwards)
  h( 8, 0.720, 0.490),   // Pod 1 — nearest the mark, potential runner
  h( 7, 0.708, 0.436),   // Pod 2
  h( 2, 0.708, 0.492),
  h( 6, 0.708, 0.548),
  h( 1, 0.696, 0.420),   // Pod 3
  h( 4, 0.696, 0.476),
  h( 5, 0.696, 0.532),
  h( 3, 0.696, 0.588),
  // Home backs
  h( 9, 0.732, 0.514),   // SH between pods and backs
  h(10, 0.748, 0.500),   // FH / decision-maker at the mark
  h(12, 0.752, 0.390),
  h(13, 0.752, 0.614),
  h(11, 0.742, 0.220),   // LW wide left
  h(14, 0.742, 0.784),   // RW wide right
  h(15, 0.726, 0.344),   // FB support
  // Away — 10 m behind the mark
  a( 1, 0.838, 0.420),
  a( 2, 0.838, 0.462),
  a( 3, 0.838, 0.504),
  a( 4, 0.838, 0.546),
  a( 5, 0.842, 0.380),
  a( 6, 0.842, 0.590),
  a( 7, 0.846, 0.434),
  a( 8, 0.846, 0.500),
  a( 9, 0.854, 0.458),
  a(10, 0.870, 0.404),
  a(12, 0.880, 0.352),
  a(13, 0.890, 0.556),
  a(11, 0.860, 0.182),
  a(14, 0.860, 0.818),
  a(15, 0.908, 0.500),
];

// ─── Open play ────────────────────────────────────────────────────────────────
// Breakdown near halfway (normX ≈ 0.485). Home attacking, away defending.
// Forwards in realistic ruck shape — some overlap is expected (contact sport).
// Backs are well spread with minimum 0.040 normY gap.
const openPlay: AP[] = [
  // Home ruck
  h( 8, 0.485, 0.490),   // ball carrier / base
  h( 9, 0.474, 0.526),   // SH on far side
  h( 7, 0.477, 0.436),   // OF — first to ruck
  h( 6, 0.477, 0.558),   // BF
  h( 4, 0.465, 0.458),   // Lock
  h( 5, 0.465, 0.534),   // Lock
  h( 1, 0.452, 0.430),   // LP
  h( 2, 0.452, 0.498),   // Hooker
  h( 3, 0.452, 0.566),   // TP
  // Home backs
  h(10, 0.445, 0.402),   // FH flat first receiver
  h(12, 0.415, 0.348),   // IC
  h(13, 0.390, 0.642),   // OC opposite channel
  h(11, 0.330, 0.114),   // LW wide
  h(14, 0.340, 0.884),   // RW wide
  h(15, 0.246, 0.498),   // FB deep
  // Away defensive line
  a( 1, 0.556, 0.452),
  a( 2, 0.556, 0.500),
  a( 3, 0.556, 0.548),
  a( 4, 0.548, 0.456),
  a( 5, 0.548, 0.542),
  a( 6, 0.548, 0.412),
  a( 7, 0.548, 0.586),
  a( 8, 0.542, 0.498),
  a( 9, 0.558, 0.408),   // defensive SH
  a(10, 0.568, 0.370),
  a(12, 0.580, 0.326),
  a(13, 0.576, 0.660),
  a(11, 0.562, 0.126),
  a(14, 0.578, 0.874),
  a(15, 0.710, 0.498),   // FB deep in defence
];

// ─── Formation presets ────────────────────────────────────────────────────────

export const FORMATIONS: FormationPreset[] = [
  // ── Kickoff ──────────────────────────────────────────────────────────────────
  {
    id: 'kickoff-home',
    name: 'Kickoff',
    description: 'Home kick off from halfway — kick-chase spread, away in reception',
    category: 'kickoff',
    actors: [
      // Home — kicker at halfway, chase spread across width
      h(10, 0.500, 0.500),   // kicker exactly on halfway
      h( 9, 0.470, 0.524),
      h(15, 0.380, 0.500),   // FB deep support
      h(11, 0.460, 0.130),   // LW wide chase
      h(14, 0.460, 0.870),   // RW wide chase
      h(12, 0.460, 0.360),
      h(13, 0.460, 0.640),
      h( 8, 0.440, 0.500),
      h( 7, 0.430, 0.420),
      h( 6, 0.430, 0.580),
      h( 4, 0.420, 0.450),
      h( 5, 0.420, 0.550),
      h( 1, 0.410, 0.400),
      h( 2, 0.410, 0.500),
      h( 3, 0.410, 0.600),
      // Away — receiving: deep FB, wide support, pods to contest
      a(15, 0.800, 0.500),   // FB deep to catch
      a(11, 0.660, 0.130),
      a(14, 0.660, 0.870),
      a(12, 0.650, 0.360),
      a(13, 0.650, 0.640),
      a(10, 0.640, 0.500),
      a( 9, 0.620, 0.480),
      a( 8, 0.600, 0.500),
      a( 7, 0.590, 0.420),
      a( 6, 0.590, 0.580),
      a( 4, 0.575, 0.450),
      a( 5, 0.575, 0.550),
      a( 1, 0.560, 0.420),
      a( 2, 0.560, 0.500),
      a( 3, 0.560, 0.580),
    ],
  },

  {
    id: 'kickoff-defence',
    name: 'Kickoff Defence',
    description: 'Home receives — structured catch & maul pods',
    category: 'kickoff',
    actors: [
      // Home — receiving, pods ready to contest
      h(15, 0.220, 0.500),   // FB deep
      h(11, 0.350, 0.130),
      h(14, 0.350, 0.870),
      h(12, 0.360, 0.360),
      h(13, 0.360, 0.640),
      h(10, 0.370, 0.500),
      h( 9, 0.390, 0.480),
      h( 8, 0.400, 0.500),
      h( 7, 0.420, 0.420),
      h( 6, 0.420, 0.580),
      h( 4, 0.430, 0.450),
      h( 5, 0.430, 0.550),
      h( 1, 0.445, 0.410),
      h( 2, 0.445, 0.500),
      h( 3, 0.445, 0.590),
      // Away — kick chase
      a(10, 0.501, 0.500),
      a( 9, 0.530, 0.524),
      a(15, 0.620, 0.500),
      a(11, 0.545, 0.130),
      a(14, 0.545, 0.870),
      a(12, 0.545, 0.360),
      a(13, 0.545, 0.640),
      a( 8, 0.555, 0.500),
      a( 7, 0.565, 0.420),
      a( 6, 0.565, 0.580),
      a( 4, 0.575, 0.450),
      a( 5, 0.575, 0.550),
      a( 1, 0.585, 0.420),
      a( 2, 0.585, 0.500),
      a( 3, 0.585, 0.580),
    ],
  },

  // ── Lineout — 5-man ──────────────────────────────────────────────────────────
  {
    id: 'lineout-5man-top',
    name: '5-Man ↑',
    description: '5-man lineout near top touchline — #7 and #8 join the backs for extra width',
    category: 'lineout',
    actors: [...lo5HomeTop, ...lo5AwayTop],
  },
  {
    id: 'lineout-5man-bottom',
    name: '5-Man ↓',
    description: '5-man lineout near bottom touchline — #7 and #8 join the backs for extra width',
    category: 'lineout',
    actors: [...bot(lo5HomeTop), ...bot(lo5AwayTop)],
  },

  // ── Lineout — 6+1 ────────────────────────────────────────────────────────────
  {
    id: 'lineout-6plus1-top',
    name: '6+1 ↑',
    description: '6+1 lineout near top touchline — #7 at fake-SH, #9 pushed to first receiver',
    category: 'lineout',
    actors: [...lo61HomeTop, ...lo61AwayTop],
  },
  {
    id: 'lineout-6plus1-bottom',
    name: '6+1 ↓',
    description: '6+1 lineout near bottom touchline — #7 at fake-SH, #9 pushed to first receiver',
    category: 'lineout',
    actors: [...bot(lo61HomeTop), ...bot(lo61AwayTop)],
  },

  // ── Lineout — 7-man ──────────────────────────────────────────────────────────
  {
    id: 'lineout-7man-top',
    name: '7-Man ↑',
    description: 'Full 7-man lineout near top touchline — #2 throws, #9 at tail',
    category: 'lineout',
    actors: [...lo7HomeTop, ...lo7AwayTop],
  },
  {
    id: 'lineout-7man-bottom',
    name: '7-Man ↓',
    description: 'Full 7-man lineout near bottom touchline — #2 throws, #9 at tail',
    category: 'lineout',
    actors: [...bot(lo7HomeTop), ...bot(lo7AwayTop)],
  },

  // ── Scrum ─────────────────────────────────────────────────────────────────────
  {
    id: 'scrum-top',
    name: 'Scrum ↑',
    description: 'Home put-in near top touchline — correct front-row order, open side toward centre',
    category: 'scrum',
    actors: scrumTop,
  },
  {
    id: 'scrum-bottom',
    name: 'Scrum ↓',
    description: 'Home put-in near bottom touchline — mirrored from top variant',
    category: 'scrum',
    actors: bot(scrumTop),
  },

  // ── Penalty ───────────────────────────────────────────────────────────────────
  {
    id: 'penalty-attack',
    name: 'Penalty Attack',
    description: 'Home attacking penalty on away 22 — staggered forward pods, backs wide, away 10 m back',
    category: 'penalty',
    actors: penaltyAttack,
  },

  // ── Open play ─────────────────────────────────────────────────────────────────
  {
    id: 'open-play',
    name: 'Open Play',
    description: 'Home attacking breakdown near halfway — realistic ruck shape, away defensive line set',
    category: 'open',
    actors: openPlay,
  },
];

export const FORMATION_CATEGORY_LABELS: Record<string, string> = {
  kickoff: 'Kickoff',
  lineout: 'Lineout',
  scrum:   'Scrum',
  penalty: 'Penalty',
  restart: 'Restart',
  open:    'Open Play',
};
