# Phaseboard — Build Progress Log

> **Last updated:** 2026-04-23
>
> **Repository:** https://github.com/srallsopp01-hub/animation-app
>
> **Branches:** `main` (stable), `broadcast-redesign` (in progress)

---

## What This App Is

**Phaseboard** is a rugby tactics animation tool for coaches and analysts. A coach can:

1. Add players (home/away), a ball, and cones to a pitch canvas.
2. Arrange them into formations using quick presets (lineout, scrum, open play, etc.).
3. Draw run, pass, and kick arrows, and highlight zones.
4. Create multiple **scenes** (phases of play) that form a sequence.
5. Press **Play** to animate through the scenes — actors smoothly glide between positions.
6. Export or share the animated sequence with the squad.

The end goal is a **professional-grade tactical analysis tool** comparable to Hudl or Sportscode, but focused on live pre-match and half-time briefings — fast, visual, and shareable. The broadcast visual style (dark pitch, gold accent, TV-aesthetic typography) makes it suitable for big-screen presentation in a team room.

---

## End Goal

| Milestone | Description |
|-----------|-------------|
| **MVP (done)** | Local editor with full set-piece formations, animated playback, zone drawing, arrow types |
| **Sprint B** | Supabase cloud persistence + read-only share links (URL-based) |
| **Sprint C** | Video/GIF export (MP4 and animated GIF from canvas frames) |
| **Sprint D** | Team management, multi-play library, formation saving |
| **Sprint E** | Real-time collaboration (two coaches editing simultaneously) |

---

## Build History

### 2026-04-23 — Initial session (all in one day)

All development happened on 2026-04-23. Commits are:

| Commit | Branch | What was done |
|--------|--------|--------------|
| `1880778` | main | Create Next App scaffold |
| `4668e83` | main | Sprint A+B foundation through transition fades |
| `5a3c3b8` | broadcast-redesign | Full broadcast visual redesign |
| `3135d97` | main | Design handoff files written to disk |

---

### Phase 1 — Foundation (Session 1)

**Status: Complete**

- Next.js 16 + TypeScript strict + Tailwind v4 + Zustand v5 + react-konva
- **Editor layout**: TopBar / LeftSidebar / Canvas / RightSidebar / SceneRail
- **Rugby pitch canvas**: correct markings (try lines, 22m, 10m, halfway, channel lines, in-goal banding, stripe pattern)
- **Actor system**: home/away players, ball, cone — all draggable on canvas
- **Scene rail**: SVG thumbnails of each scene; add/duplicate/delete/reorder
- **Zustand store**: full undo/redo (50-step history), autosave to localStorage
- **Keyboard shortcuts**: Ctrl+Z, Ctrl+Shift+Z, Delete, Escape

**Data model:**
- Actor positions stored as normalised 0–1 fractions of pitch width/height (survives window resize)
- Each scene has its own actor list
- Duplicate scene copies actors with same IDs (enables movement arrows in Phase 2)

---

### Phase 2 — Animation & UX Polish (Session 2)

**Status: Complete**

- **Movement arrows**: auto-generated arrows between consecutive scenes showing actor movement (colour-coded by team)
- **Ghost positions**: semi-transparent actors showing previous scene positions
- **Play/Stop**: Space bar or Play button steps through scenes at each scene's configured duration
- **Drag boundary clamping**: actors can't be dragged off pitch
- **Actor shadows and glow**, selected actor shows gold ring, locked actors show dashed border

---

### Phase 3 — Pitch Controls & Smooth Transitions (Session 3)

**Status: Complete**

- **Orientation toggle**: Landscape ↔ Portrait — flips entire coordinate system (not just CSS rotation)
- **Pitch scale slider**: 40%–100%
- **Player size slider**: 50%–200%
- **Transition speed slider**: 0ms–1200ms ("Cut" at 0 allows instant scene cuts)
- **Smooth animated transitions**: full RAF interpolation using cubic ease-in-out — actors glide between scene positions

---

### Phase 4 — Arrow Drawing, Zones & Formations (Session 4)

**Status: Complete**

- **Run/Pass/Kick arrows**: click-drag on canvas to draw, colour-coded (white / dashed white / amber)
- **Bezier curves**: drawn arrows bent by dragging their midpoint handle
- **Zone drawing**: drag to draw rectangular zones with colour, opacity, label
- **Zone thumbnails**: SceneRail SVG cards render zones as coloured overlays
- **12 formation presets** in LeftSidebar:
  - Kickoff & kickoff defence
  - Lineout: 5-man, 6+1 (deception), 7-man — each with top/bottom touchline variant
  - Scrum: top and bottom touchline variants
  - Penalty attack
  - Open play / breakdown

**Formation accuracy rules:**
- `normX`: 0 = home dead-ball → 1 = away dead-ball (112 m landscape)
- `normY`: 0 = top touchline → 1 = bottom touchline (70 m)
- Home lineout row at `normX=0.247`, away at `normX=0.253` (visible separation)
- Scrum front rows offset `normX` ±0.002 from centre so hookers aren't coincident
- Minimum gaps: 0.018 normY lineout, 0.026 normY scrum front row, 0.034 normY breakdown

---

### Phase 5 — Transition Fade & Formation Polish (Session 5)

**Status: Complete**

- **Fade-in for new actors**: actors appearing between scenes smoothly fade in (opacity 0→1)
- **Fade-out for removed actors**: actors disappearing between scenes fade out (opacity 1→0)
- **Cut mode**: Transition slider extended to 0ms — labeled "Cut" at 0, allows instant scene cuts
- **AnimatedActor type** (`Actor & { _opacity: number }`) — local to RugbyCanvas, no store changes needed
- **prevActorsRef**: separate ref captures pure previous-scene actors before each transition so rapid switches don't compound opacity

---

### Phase 6 — Broadcast Redesign (Sprint B visual layer)

**Status: In progress on `broadcast-redesign` branch**

#### What was built

- **Three-palette system** (dark/navy/light) via CSS custom properties on `[data-palette]` attribute — coaches switch with swatches in TopBar
- **TopBar**: 56px wordmark tile, match scoreboard, pulsing LIVE indicator, play title chip, palette swatches, Share + Export buttons, undo/redo/paths/names utilities
- **LeftSidebar**: 6-tool grid (Select/Run/Pass/Kick/Zone/Note), formation presets with accent left-border, Phase Lock toggle
- **SceneRail**: bottom timeline bar with transport controls (◀ ▶▶), 4px progress fill track, 45°-rotated diamond phase markers (`P01`–`P07`), scene names below, 🔒 on locked phases
- **RightSidebar**: "On the Ball" panel — jersey tile with player number (56px, Oswald), name/position/role, stats grid, empty-state dashed circle; Roster button
- **IRE Roster** (`src/data/iRoster.ts`): 15 players with name, position, role descriptions
- **Export modal**: format selector (MP4/PDF/PNG/GIF), quality tiers, include options
- **Share modal**: link copy, send-to-staff list with online status, channels grid
- **Roster modal**: 15-man grid with on-ball highlight, name/position labels
- **Mobile companion** (`/mobile` route): 390×844 phone frame with phase strip, pitch, transport, coach cue
- **Design handoff files** on `main`: 12 JSX source files + HTML entry point — open `design_handoff_broadcast_redesign/Phaseboard Editor Redesign.html` in a browser to see all three visual variations in a pan/zoom canvas

#### Design variations in handoff

| File | Variation |
|------|-----------|
| `broadcast-app.jsx` | **Broadcast** — gold accent, Oswald, TV aesthetic (primary) |
| `studio.jsx` | **Studio** — cyan accent, IBM Plex Sans, dark tactical |
| `chalk.jsx` | **Chalk** — cream parchment, Fraunces serif, editorial |
| `broadcast-mobile.jsx` | Mobile companion phone frame |

---

## What to Improve Next

### Priority 1 — Supabase persistence (Sprint B)

The app currently saves to `localStorage` only. Coaches need to:
- Access their plays from any device
- Share read-only links with the squad

**Steps:**
1. Create Supabase project at supabase.com; get URL + anon key
2. Add `.env.local`: `NEXT_PUBLIC_SUPABASE_URL=...` and `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
3. Create `src/lib/supabase.ts` — Supabase client singleton
4. In Zustand store, add `saveToCloud()` and `loadFromCloud(id)` actions
5. Replace localStorage autosave with `debounce(saveToCloud, 1000)` on every store mutation
6. Create `src/app/view/[id]/page.tsx` — read-only viewer (no editing, just Play)
7. Wire the TopBar Share button to generate a `/view/[id]` URL and copy to clipboard

**Schema (SQL):**
```sql
create table projects (
  id uuid primary key default gen_random_uuid(),
  owner_email text,
  title text,
  data jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### Priority 2 — Visual fidelity pass on broadcast-redesign

The `broadcast-redesign` branch implementation was built before the design source files were on disk. Now that `design_handoff_broadcast_redesign/` exists, do a pass to tighten the visual match:
- Open `Phaseboard Editor Redesign.html` in a browser (no server needed — Babel standalone)
- Compare each panel against the Next.js implementation
- Focus on: typography sizes/weights, spacing between panels, accent usage in the SceneRail timeline diamonds

### Priority 3 — Video/GIF export (Sprint C)

- Use `html2canvas` or `konva.toDataURL()` per frame + `gif.js` for animated GIF
- Or Playwright headless screenshot sequence → ffmpeg → MP4
- ExportModal UI is already built — just needs the generation logic wired up

### Priority 4 — Formation library (coach can save custom formations)

- Add `formations: Formation[]` to Zustand store (persisted)
- Button in LeftSidebar: "Save as formation" (names current actor layout)
- Saved formations appear alongside built-in presets

### Priority 5 — Right-click context menu

Currently actions on actors require selecting them and using the sidebar. A right-click menu (delete, lock, change team, set as ball carrier) would be faster for coaches.

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Main editor page — assembles TopBar, sidebars, canvas, scene rail |
| `src/store/useEditorStore.ts` | All app state (Zustand v5) — actors, scenes, tools, playback, palette |
| `src/types/index.ts` | TypeScript types: Actor, Scene, Arrow, Zone, PitchLayout |
| `src/data/formations.ts` | All 12 formation presets with accurate rugby positions |
| `src/data/iRoster.ts` | Ireland 15-man roster with position/role descriptions |
| `src/components/editor/canvas/RugbyCanvas.tsx` | Main Konva canvas — pitch, actors, arrows, zones, transitions |
| `src/components/editor/TopBar.tsx` | Match card, palette swatches, Share/Export buttons |
| `src/components/editor/LeftSidebar.tsx` | Tool selector, formation presets |
| `src/components/editor/SceneRail.tsx` | Phase timeline, transport controls, scene thumbnails |
| `src/components/editor/RightSidebar.tsx` | On-ball panel, scene settings, pitch/player size sliders |
| `src/components/editor/modals/ExportModal.tsx` | Export format/quality selector |
| `src/components/editor/modals/ShareModal.tsx` | Link copy, send-to-staff, channels |
| `src/components/editor/modals/RosterModal.tsx` | 15-man roster grid |
| `src/app/mobile/page.tsx` | Mobile companion — 390×844 phone frame |
| `design_handoff_broadcast_redesign/` | All design source JSX files + HTML viewer |

---

## Instructions for Future Claude Code Sessions

### 1. Always read this file first

Before starting any task, read `PROGRESS.md` to understand what's been built and what the priorities are. Don't re-implement things that already exist.

### 2. Always check AGENTS.md

`AGENTS.md` (referenced from `CLAUDE.md`) contains critical notes about the Next.js version. Read it before writing any Next.js code.

### 3. Git discipline

- **Commit after every meaningful unit of work** — don't batch unrelated changes into one giant commit
- **Commit message format**: one short imperative line (`Add share link generation`), optionally followed by a blank line and bullet points if needed
- **Always add the co-author footer**:
  ```
  Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
  ```
- **Push to GitHub** (`git push origin <branch>`) after every session so work is not lost
- **Never force-push main** — create a new branch or a new commit
- **Branch naming**: use descriptive names (`supabase-persistence`, `export-gif`, `roster-system`)

### 4. Update PROGRESS.md after every major update

When you complete a meaningful chunk of work:
1. Add a new section under **Build History** with today's date and what was done
2. Move completed items from **What to Improve Next** into Build History
3. Add any new improvements discovered during the session to the backlog
4. Update the **Last updated** date at the top

Keep it factual and brief — this is a reference document, not a narrative. Future Claude sessions will read it cold.

### 5. Design reference

The visual design lives in `design_handoff_broadcast_redesign/`. Before making any UI changes on `broadcast-redesign`, open `Phaseboard Editor Redesign.html` in a browser and compare. The JSX files are the source of truth for spacing, typography, and colour usage.

### 6. Dev server

```bash
npm run dev
# Opens on http://localhost:3000
```

Port is 3000 (default Next.js). Mobile route is `/mobile`.

### 7. TypeScript

Run `npm run build` (or `tsc --noEmit`) before committing. The project uses TypeScript strict mode — no `any` unless genuinely unavoidable.

### 8. Coordinate system (never forget this)

- `normX`: 0 = home dead-ball end → 1 = away dead-ball end (112 m landscape)
- `normY`: 0 = top touchline → 1 = bottom touchline (70 m)
- All actor positions are stored normalised — converting to canvas pixels happens in `RugbyCanvas.tsx`'s `toCanvas()` helper

---

## Palette Token Reference

CSS custom properties set via `data-palette` on `<html>`:

| Token | Dark | Navy | Light |
|-------|------|------|-------|
| `--bg` | `#070a12` | `#04111a` | `#f6f7f9` |
| `--bg-elev` | `#0a0f1c` | `#08213a` | `#ffffff` |
| `--bg-elev-2` | `#0d1426` | `#0a2a49` | `#eef0f4` |
| `--border` | `#1a2238` | `#0f3a5a` | `#d9dde3` |
| `--text` | `#f4f5fa` | `#ffffff` | `#0a0e1a` |
| `--accent` | `#f7b500` | `#16a34a` | `#d97706` |
| `--home-jersey` | `#f7b500` | `#16a34a` | `#1d4ed8` |
| `--away-jersey` | `#1a1d2b` | `#111827` | `#111827` |

Palette is persisted to `localStorage` under key `phaseboard-palette` and applied to `document.documentElement` via the store's `setPalette` action.
