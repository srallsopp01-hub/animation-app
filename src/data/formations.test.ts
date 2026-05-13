import { describe, it, expect } from 'vitest';
import { FORMATIONS } from './formations';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TX   = 0.250;
const HX   = TX - 0.003;  // 0.247
const AX   = TX + 0.003;  // 0.253

function inLineout(actors: typeof FORMATIONS[0]['actors'], isHome: boolean) {
  const x = isHome ? HX : AX;
  // Only count players exactly at HX/AX (within 0.0005) — excludes channel pod (0.245) and SH (0.248)
  return actors.filter(
    a => a.type === 'player' && a.team === (isHome ? 'home' : 'away') &&
         Math.abs(a.normX - x) < 0.0005
  );
}

function backPlayers(actors: typeof FORMATIONS[0]['actors'], team: 'home' | 'away') {
  return actors.filter(
    a => a.type === 'player' && a.team === team &&
         [10, 11, 12, 13, 14, 15].includes(a.number)
  );
}

// ─── Universal: no two players share identical coordinates ────────────────────

describe('no stacking in any preset', () => {
  for (const preset of FORMATIONS) {
    it(`${preset.id} — all player positions unique`, () => {
      const seen = new Set<string>();
      for (const actor of preset.actors) {
        if (actor.type !== 'player') continue;
        const key = `${actor.normX.toFixed(3)},${actor.normY.toFixed(3)}`;
        expect(seen.has(key), `${preset.id}: players share position ${key}`).toBe(false);
        seen.add(key);
      }
    });
  }
});

// ─── Lineout forward counts ───────────────────────────────────────────────────

// In attack: home THROWS (hooker at TX, not HX) → N forwards at HX.
// Away DEFENDS with hooker in the line at AX → N+1 at AX.
// In defence: roles swap — away throws from TX, home defends with hooker at HX.
describe('5-man lineout — correct forward counts in column', () => {
  it('attack: home 4 at HX, away 5 at AX', () => {
    const p = FORMATIONS.find(f => f.id === 'lineout-5man-atk-top')!;
    expect(inLineout(p.actors, true).length).toBe(4);
    expect(inLineout(p.actors, false).length).toBe(5);
  });
  it('defence: home 5 at HX, away 4 at AX', () => {
    const p = FORMATIONS.find(f => f.id === 'lineout-5man-def-top')!;
    expect(inLineout(p.actors, true).length).toBe(5);
    expect(inLineout(p.actors, false).length).toBe(4);
  });
  it('↓ variants match ↑ counts', () => {
    expect(inLineout(FORMATIONS.find(f => f.id === 'lineout-5man-atk-bot')!.actors, true).length).toBe(4);
    expect(inLineout(FORMATIONS.find(f => f.id === 'lineout-5man-def-bot')!.actors, true).length).toBe(5);
  });
});

describe('6+1 lineout — correct forward counts in column', () => {
  it('attack: home 5 at HX, away 6 at AX', () => {
    const p = FORMATIONS.find(f => f.id === 'lineout-6plus1-atk-top')!;
    expect(inLineout(p.actors, true).length).toBe(5);
    expect(inLineout(p.actors, false).length).toBe(6);
  });
  it('defence: home 6 at HX, away 5 at AX', () => {
    const p = FORMATIONS.find(f => f.id === 'lineout-6plus1-def-top')!;
    expect(inLineout(p.actors, true).length).toBe(6);
    expect(inLineout(p.actors, false).length).toBe(5);
  });
});

describe('7-man lineout — correct forward counts in column', () => {
  it('attack: home 6 at HX, away 7 at AX', () => {
    const p = FORMATIONS.find(f => f.id === 'lineout-7man-atk-top')!;
    expect(inLineout(p.actors, true).length).toBe(6);
    expect(inLineout(p.actors, false).length).toBe(7);
  });
  it('defence: home 7 at HX, away 6 at AX', () => {
    const p = FORMATIONS.find(f => f.id === 'lineout-7man-def-top')!;
    expect(inLineout(p.actors, true).length).toBe(7);
    expect(inLineout(p.actors, false).length).toBe(6);
  });
});

// ─── Offside: backs at correct distance ──────────────────────────────────────

const H_OFF10 = +(TX - 10 / 112).toFixed(3);  // 0.161
const A_OFF10 = +(TX + 10 / 112).toFixed(3);  // 0.339
const OFFSIDE_TOL = 0.010;                     // allow 0.010 normX slack (~1 m)

describe('attack lineout — away backs at 10m offside (normX ≥ A_OFF10)', () => {
  const ids = [
    'lineout-5man-atk-top', 'lineout-6plus1-atk-top', 'lineout-7man-atk-top',
  ];
  for (const id of ids) {
    it(id, () => {
      const preset = FORMATIONS.find(f => f.id === id)!;
      for (const p of backPlayers(preset.actors, 'away')) {
        expect(p.normX, `away #${p.number} normX ${p.normX} < offside ${A_OFF10 - OFFSIDE_TOL}`)
          .toBeGreaterThanOrEqual(A_OFF10 - OFFSIDE_TOL);
      }
    });
  }
});

describe('defence lineout — home backs at 10m offside (normX ≤ H_OFF10)', () => {
  const ids = [
    'lineout-5man-def-top', 'lineout-6plus1-def-top', 'lineout-7man-def-top',
  ];
  for (const id of ids) {
    it(id, () => {
      const preset = FORMATIONS.find(f => f.id === id)!;
      for (const p of backPlayers(preset.actors, 'home')) {
        expect(p.normX, `home #${p.number} normX ${p.normX} > offside ${H_OFF10 + OFFSIDE_TOL}`)
          .toBeLessThanOrEqual(H_OFF10 + OFFSIDE_TOL);
      }
    });
  }
});

const SCRUM_HOME_8_X = 0.222;
const SCRUM_AWAY_8_X = 0.278;
const SCRUM_5M = 5 / 112;  // 0.045
const SCRUM_TOL = 0.010;

describe('scrum attack — away backs 5m past away #8', () => {
  it('scrum-atk-top', () => {
    const preset = FORMATIONS.find(f => f.id === 'scrum-atk-top')!;
    const limit = SCRUM_AWAY_8_X + SCRUM_5M - SCRUM_TOL;
    for (const p of backPlayers(preset.actors, 'away')) {
      expect(p.normX, `away #${p.number} should be ≥ ${limit.toFixed(3)}, got ${p.normX}`)
        .toBeGreaterThanOrEqual(limit);
    }
  });
});

describe('scrum defence — home backs 5m behind home #8', () => {
  it('scrum-def-top', () => {
    const preset = FORMATIONS.find(f => f.id === 'scrum-def-top')!;
    const limit = SCRUM_HOME_8_X - SCRUM_5M + SCRUM_TOL;
    for (const p of backPlayers(preset.actors, 'home')) {
      expect(p.normX, `home #${p.number} should be ≤ ${limit.toFixed(3)}, got ${p.normX}`)
        .toBeLessThanOrEqual(limit);
    }
  });
});

// ─── ↑/↓ symmetry ────────────────────────────────────────────────────────────

describe('↑ and ↓ variants are Y-mirrors', () => {
  const pairs = [
    ['lineout-5man-atk-top',   'lineout-5man-atk-bot'],
    ['lineout-5man-def-top',   'lineout-5man-def-bot'],
    ['lineout-6plus1-atk-top', 'lineout-6plus1-atk-bot'],
    ['lineout-7man-atk-top',   'lineout-7man-atk-bot'],
    ['scrum-atk-top',          'scrum-atk-bot'],
    ['scrum-def-top',          'scrum-def-bot'],
  ] as const;

  for (const [topId, botId] of pairs) {
    it(`${topId} ↔ ${botId}`, () => {
      const top = FORMATIONS.find(f => f.id === topId)!;
      const bot = FORMATIONS.find(f => f.id === botId)!;
      expect(top.actors.length).toBe(bot.actors.length);
      top.actors.forEach((actor, i) => {
        const mirrored = 1 - actor.normY;
        expect(bot.actors[i].normX).toBeCloseTo(actor.normX, 2);
        expect(bot.actors[i].normY).toBeCloseTo(mirrored, 2);
      });
    });
  }
});
