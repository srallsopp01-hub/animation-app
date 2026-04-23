# Rugby Animator — Build Progress Log

## Session 1 — Phase 1: Foundation
**Status: Complete**

Built the full Phase 1 scaffold from scratch.

### What was built
- Next.js 16 + TypeScript + Tailwind v4 + Zustand + react-konva project
- **Editor layout**: TopBar / LeftSidebar / Canvas / RightSidebar / SceneRail
- **Rugby pitch canvas**: proper markings (try lines, 22m, 10m, halfway, goal posts, in-goal areas, stripe banding)
- **Actor system**: home players (blue), away players (red), ball, cone — all draggable
- **Scene rail**: SVG thumbnails showing player positions per scene, add/duplicate/delete/reorder
- **Zustand store**: full undo/redo (50-step history), autosave to localStorage
- **Keyboard shortcuts**: Ctrl+Z, Ctrl+Shift+Z, Delete, Escape

### Data model
- Actor positions stored as normalised 0–1 fractions of pitch (survives resize)
- Each scene has its own actor list
- Duplicate scene copies actors with same IDs (enables movement arrows in Phase 2)

---

## Session 2 — Phase 2: Animation & UX Polish
**Status: Complete**

### What was built
- **Movement arrows**: auto-generated arrows between consecutive scenes showing where actors move (colour-coded by team)
- **Ghost positions**: semi-transparent actors showing previous scene positions
- **Play button**: press Play (or Space) to step through scenes, each for its configured duration
- **Stop button**: halt playback at any time
- **Scene duration control**: per-scene slider (0.4s – 5s) controlling playback timing
- **Drag boundary clamping**: actors cannot be dragged off the pitch
- **Delete key**: Backspace/Delete removes selected actor
- **Escape**: deselects
- **Paths toggle**: show/hide movement arrows in TopBar

### UX improvements
- Actor shadows and glow effects
- Selected actor shows gold ring
- Locked actors show dashed border
- Scene cards show duration + actor count
- Playing indicator (animated bars) on active scene
- Keyboard shortcut panel in left sidebar

---

## Session 3 — Pitch Controls & Smooth Transitions
**Status: Complete**

### What was built
- **5m and 15m channel lines**: dashed horizontal lines across the pitch (proper rugby channel markings)
- **Pitch orientation toggle**: Landscape ↔ Portrait — flips the entire coordinate system (not just CSS rotation)
- **Pitch scale slider**: 40%–100%, lets coach zoom out for context or work in a focused area
- **Player size slider**: 50%–200%, scale all actor sizes independently
- **Transition speed slider**: 100ms–1200ms, coach controls how fast the smooth animation plays
- **Smooth animated transitions**: full RAF (requestAnimationFrame) interpolation using cubic ease-in-out — actors smoothly glide between scene positions when clicking any scene card or during playback
- **Instant in-scene updates**: drags, adds, and deletes are instant (no lag); only scene changes animate

---

## Session 4 — Arrow Drawing, Zones & Formation System
**Status: Complete**

### What was built
- **Run / Pass / Kick arrow drawing**: click-drag on canvas to draw arrows per type, colour-coded (white/dashed/amber)
- **Bezier curves**: drawn arrows can be bent by dragging the midpoint handle when selected
- **Zone drawing tool**: drag to draw rectangular zones, with colour/opacity/label controls
- **Zone thumbnails**: SceneRail SVG thumbnails render zones as coloured overlays
- **Quick formation presets** (LeftSidebar): 12 presets covering all major set pieces and open play
  - Kickoff & kickoff defence
  - Lineout: 5-man, 6+1 (deception), 7-man — each with top and bottom touchline variants
  - Scrum: top and bottom touchline variants
  - Penalty attack
  - Open play / breakdown
- **Formation accuracy**: all 30 players are correctly separated (no overlaps); home/away teams on opposite sides of ball; lineout corridor (home normX=0.247, away normX=0.253); scrum front rows offset by 0.004 normX; 6+1 lineout places #7 at fake SH and #9 in backs as first receiver
- **Player name labels**: togglable via TopBar "Names" button — shows actor.name below jersey number
- **Names toggle**: TopBar button to show/hide player name labels

### Key coordinate rules
- normX: 0 = home dead-ball → 1 = away dead-ball (112m landscape)
- normY: 0 = top touchline → 1 = bottom touchline (70m)
- Minimum spacing: 0.018 normY in lineout, 0.026 normY in scrum front row, 0.034 normY at breakdown

---

## Session 5 — Transition Fade & Formation Polish
**Status: Complete**

### What was built
- **Fade-in for new actors**: actors added between scenes now smoothly fade in during the transition rather than snapping/popping into place
- **Fade-out for removed actors**: actors removed between scenes fade out instead of vanishing instantly
- **Cut mode**: Transition slider extended to 0ms (labeled "Cut"), allowing instant scene cuts for coaches who prefer static diagrams
- **AnimatedActor type**: local extension `Actor & { _opacity: number }` used only during animation; no store changes needed
- **prevActorsRef**: separate ref tracks the pure scene actors before each transition starts, preventing cascading opacities on rapid scene switches

### How fade transitions work
On each scene change, `prevActorsRef` captures the snapshot of the previous scene's actors. The animation tick interpolates position for matched actors (opacity=1 throughout), fades in new actors (opacity: 0→1), and fades out leaving actors (opacity: 1→0). At the end of the tick, leaving actors are dropped from the display list automatically.

---

## Next Priority — Sprint B: Supabase Persistence & Sharing

### Goals
1. **Supabase project setup**: create project, configure env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
2. **Save to cloud**: replace localStorage-only autosave with a `projects` table (id, owner_email, data jsonb, updated_at)
3. **Share links**: generate a read-only UUID-based URL (`/view/[id]`) that anyone can open without signing in — shows the full play sequence in playback-only mode
4. **Auth (optional MVP)**: anonymous sessions via Supabase Auth so projects persist across devices

### Files likely involved
- `src/store/useEditorStore.ts` — add cloud save/load actions
- `src/app/view/[id]/page.tsx` — new read-only viewer route
- `src/lib/supabase.ts` — Supabase client helper
- `src/components/editor/TopBar.tsx` — wire up Share button (currently disabled)

### Secondary improvements (backlog)
- MP4 / GIF export (Playwright headless capture or canvas-recorder)
- Right-click context menu (actor actions inline)
- Formation library: let coaches save custom formations by name
- Ball in hand indicator (actor holding ball gets a visual badge)
