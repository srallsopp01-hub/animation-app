'use client';

import { useState } from 'react';
import useEditorStore from '@/store/useEditorStore';
import { FORMATIONS, FORMATION_CATEGORY_LABELS } from '@/data/formations';
import type { Tool, FormationCategory } from '@/types';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold tracking-widest text-zinc-600 uppercase px-3 mt-4 mb-1">
      {children}
    </p>
  );
}

function ToolBtn({
  active, onClick, children, title, count, accent = 'bg-zinc-700/60 text-zinc-100',
}: {
  active?: boolean; onClick: () => void; children: React.ReactNode;
  title?: string; count?: number; accent?: string;
}) {
  return (
    <button
      onClick={onClick} title={title}
      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group
        ${active ? accent : 'text-zinc-400 hover:text-zinc-100 bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700'}`}
    >
      {children}
      {count !== undefined && count > 0 && (
        <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-zinc-700 text-zinc-400 min-w-[20px] text-center">
          {count}
        </span>
      )}
    </button>
  );
}

const ZONE_COLORS = [
  { label: 'Blue',   value: 'rgba(59,130,246,0.9)',   bg: '#3b82f6' },
  { label: 'Red',    value: 'rgba(239,68,68,0.9)',    bg: '#ef4444' },
  { label: 'Green',  value: 'rgba(34,197,94,0.9)',    bg: '#22c55e' },
  { label: 'Yellow', value: 'rgba(234,179,8,0.9)',    bg: '#eab308' },
  { label: 'Purple', value: 'rgba(168,85,247,0.9)',   bg: '#a855f7' },
  { label: 'White',  value: 'rgba(255,255,255,0.85)', bg: '#ffffff' },
];

const CATEGORY_ORDER: FormationCategory[] = ['kickoff', 'lineout', 'scrum', 'penalty', 'open'];

export default function LeftSidebar() {
  const {
    addActor, scenes, currentSceneId, selectedTool, setSelectedTool,
    setSelectedActor, clearSceneActors, applyFormation,
    activeZoneColor, setActiveZoneColor,
  } = useEditorStore();

  const [formationsOpen, setFormationsOpen] = useState(true);

  const scene = scenes.find((s) => s.id === currentSceneId);
  const actors = scene?.actors ?? [];
  const arrows = scene?.arrows ?? [];
  const zones  = scene?.zones  ?? [];

  const homeCount  = actors.filter((a) => a.team === 'home'  && a.type === 'player').length;
  const awayCount  = actors.filter((a) => a.team === 'away'  && a.type === 'player').length;
  const ballCount  = actors.filter((a) => a.type === 'ball').length;
  const coneCount  = actors.filter((a) => a.type === 'cone').length;
  const arrowCount = arrows.length;
  const zoneCount  = zones.length;

  const tool = (t: Tool) => selectedTool === t;

  const byCategory = CATEGORY_ORDER.map((cat) => ({
    cat,
    label: FORMATION_CATEGORY_LABELS[cat],
    items: FORMATIONS.filter((f) => f.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <aside className="w-52 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0 overflow-y-auto py-3">

      {/* ── Tools ── */}
      <SectionLabel>Tools</SectionLabel>
      <div className="px-2">
        <ToolBtn
          active={tool('select')} accent="bg-zinc-700/60 text-zinc-100"
          onClick={() => { setSelectedTool('select'); setSelectedActor(null); }} title="Select (V)"
        >
          <SelectIcon /> Select
        </ToolBtn>
      </div>

      {/* ── Formations ── */}
      <div className="mt-3">
        <button
          onClick={() => setFormationsOpen((o) => !o)}
          className="w-full flex items-center justify-between px-3 py-1 group"
        >
          <span className="text-[10px] font-semibold tracking-widest text-zinc-600 uppercase group-hover:text-zinc-400 transition-colors">
            Formations
          </span>
          <span className={`text-zinc-600 text-[9px] transition-transform duration-200 ${formationsOpen ? 'rotate-90' : ''}`}>▶</span>
        </button>

        {formationsOpen && (
          <div className="px-2 mt-1 space-y-2.5">
            {byCategory.map(({ cat, label, items }) => (
              <div key={cat}>
                <p className="text-[9px] font-semibold tracking-widest text-zinc-700 uppercase px-1 mb-1">{label}</p>
                <div className="space-y-1">
                  {items.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => applyFormation(preset)}
                      title={preset.description}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium
                        text-zinc-400 hover:text-zinc-100 bg-zinc-800/40 hover:bg-emerald-900/30
                        border border-zinc-800 hover:border-emerald-700/50 transition-all text-left"
                    >
                      <FormationIcon category={cat} />
                      <span className="flex-1 truncate">{preset.name}</span>
                      <span className="text-[9px] text-zinc-700 shrink-0">
                        {preset.actors.filter((a) => a.team === 'home').length}v
                        {preset.actors.filter((a) => a.team === 'away').length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <p className="text-[10px] text-zinc-700 px-1 pb-1 leading-relaxed">
              Replaces actors. Undo with ⌘Z.
            </p>
          </div>
        )}
      </div>

      {/* ── Home team ── */}
      <SectionLabel>Home Team</SectionLabel>
      <div className="px-2">
        <ToolBtn onClick={() => addActor('player', 'home')} title="Add home player" count={homeCount}>
          <PlayerDot color="#3b82f6" /> Add Player
        </ToolBtn>
      </div>

      {/* ── Away team ── */}
      <SectionLabel>Away Team</SectionLabel>
      <div className="px-2">
        <ToolBtn onClick={() => addActor('player', 'away')} title="Add away player" count={awayCount}>
          <PlayerDot color="#ef4444" /> Add Player
        </ToolBtn>
      </div>

      {/* ── Objects ── */}
      <SectionLabel>Objects</SectionLabel>
      <div className="px-2 space-y-1">
        <ToolBtn onClick={() => addActor('ball', 'neutral')} title="Add ball" count={ballCount}>
          <BallDot /> Add Ball
        </ToolBtn>
        <ToolBtn onClick={() => addActor('cone', 'neutral')} title="Add cone" count={coneCount}>
          <ConeDot /> Add Cone
        </ToolBtn>
      </div>

      {/* ── Arrows ── */}
      <SectionLabel>Draw Arrows</SectionLabel>
      <div className="px-2 space-y-1">
        <ToolBtn active={tool('arrow-run')}  accent="bg-zinc-700/60 text-zinc-100 border border-zinc-600" onClick={() => setSelectedTool('arrow-run')}  title="Draw run path — drag on pitch">
          <RunArrowIcon /> Run Path
        </ToolBtn>
        <ToolBtn active={tool('arrow-pass')} accent="bg-zinc-700/60 text-zinc-100 border border-zinc-600" onClick={() => setSelectedTool('arrow-pass')} title="Draw pass — drag on pitch">
          <PassArrowIcon /> Pass
        </ToolBtn>
        <ToolBtn active={tool('arrow-kick')} accent="bg-zinc-700/60 text-zinc-100 border border-zinc-600" onClick={() => setSelectedTool('arrow-kick')} title="Draw kick — drag on pitch">
          <KickArrowIcon /> Kick
        </ToolBtn>
      </div>
      {arrowCount > 0 && (
        <div className="px-3 mt-1.5">
          <p className="text-[10px] text-zinc-600">{arrowCount} arrow{arrowCount !== 1 ? 's' : ''} on this scene</p>
        </div>
      )}

      {/* ── Zones ── */}
      <SectionLabel>Draw Zones</SectionLabel>
      <div className="px-2 space-y-1.5">
        <ToolBtn active={tool('zone')} accent="bg-zinc-700/60 text-zinc-100 border border-zinc-600" onClick={() => setSelectedTool('zone')} title="Draw a zone — drag on pitch">
          <ZoneIcon /> Zone
        </ToolBtn>
        <div className="flex gap-1.5 px-0.5 flex-wrap">
          {ZONE_COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => setActiveZoneColor(c.value)}
              title={c.label}
              className={`w-5 h-5 rounded-full border-2 transition-all ${activeZoneColor === c.value ? 'border-white scale-110 shadow-lg' : 'border-zinc-700 hover:border-zinc-400'}`}
              style={{ background: c.bg }}
            />
          ))}
        </div>
        {zoneCount > 0 && (
          <p className="text-[10px] text-zinc-600 px-0.5">{zoneCount} zone{zoneCount !== 1 ? 's' : ''} on this scene</p>
        )}
      </div>

      {/* ── Danger zone ── */}
      <div className="px-2 mt-4">
        <button
          onClick={() => { if (actors.length === 0 && arrowCount === 0 && zoneCount === 0) return; clearSceneActors(); }}
          disabled={actors.length === 0 && arrowCount === 0 && zoneCount === 0}
          className="w-full py-2 rounded-lg text-xs font-medium text-zinc-600 hover:text-red-400 hover:bg-red-950/30 border border-zinc-800 hover:border-red-900/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Clear Scene
        </button>
      </div>

      {/* ── Keyboard shortcuts ── */}
      <div className="mt-auto mx-3 mb-2 rounded-xl bg-zinc-800/50 border border-zinc-700/40 overflow-hidden">
        <div className="px-3 py-2 border-b border-zinc-700/40">
          <p className="text-[10px] font-semibold tracking-widest text-zinc-600 uppercase">Shortcuts</p>
        </div>
        <div className="px-3 py-2 space-y-1.5">
          {[['Space','Play / Stop'],['⌘Z','Undo'],['⌘⇧Z','Redo'],['⌫','Delete selected'],['Esc','Deselect / cancel']].map(([key, desc]) => (
            <div key={key} className="flex items-center justify-between gap-2">
              <span className="text-[10px] text-zinc-600">{desc}</span>
              <kbd className="text-[9px] font-mono bg-zinc-700/80 text-zinc-400 px-1.5 py-0.5 rounded shrink-0">{key}</kbd>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function SelectIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4 0l16 12.279-6.951 1.17 4.325 8.817-3.596 1.734-4.35-8.879-5.428 4.702z" /></svg>;
}
function PlayerDot({ color }: { color: string }) {
  return <svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="8" fill={color} stroke="white" strokeWidth="1.5" /><text x="9" y="13" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">#</text></svg>;
}
function BallDot() {
  return <svg width="18" height="18" viewBox="0 0 18 18"><ellipse cx="9" cy="9" rx="5" ry="8" fill="#f59e0b" stroke="white" strokeWidth="1.2" transform="rotate(-20 9 9)" /></svg>;
}
function ConeDot() {
  return <svg width="18" height="18" viewBox="0 0 18 18"><polygon points="9,2 2,16 16,16" fill="#f97316" stroke="white" strokeWidth="1.2" /></svg>;
}
function RunArrowIcon() {
  return <svg width="18" height="14" viewBox="0 0 18 14" fill="none"><path d="M2 7 L13 7" stroke="white" strokeWidth="2" strokeLinecap="round" /><path d="M10 3 L15 7 L10 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>;
}
function PassArrowIcon() {
  return <svg width="18" height="14" viewBox="0 0 18 14" fill="none"><path d="M2 7 L13 7" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="3 2.5" /><path d="M10 3 L15 7 L10 11" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>;
}
function KickArrowIcon() {
  return <svg width="18" height="14" viewBox="0 0 18 14" fill="none"><path d="M2 7 L13 7" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="5 3" /><path d="M10 3 L15 7 L10 11" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>;
}
function ZoneIcon() {
  return <svg width="18" height="14" viewBox="0 0 18 14" fill="none"><rect x="2" y="2" width="14" height="10" rx="1.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeDasharray="3 2" fill="rgba(255,255,255,0.12)" /></svg>;
}
function FormationIcon({ category }: { category: FormationCategory }) {
  if (category === 'kickoff' || category === 'restart') {
    return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5" stroke="rgba(255,255,255,0.35)" strokeWidth="1" /><circle cx="7" cy="7" r="1.5" fill="rgba(255,255,255,0.5)" /></svg>;
  }
  if (category === 'lineout') {
    return <svg width="14" height="14" viewBox="0 0 14 14" fill="none">{[2,5,8,11].map((y) => <circle key={y} cx="7" cy={y} r="1.3" fill="rgba(255,255,255,0.45)" />)}</svg>;
  }
  if (category === 'scrum') {
    return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="4" cy="7" r="2.5" stroke="rgba(59,130,246,0.6)" strokeWidth="1.2" fill="none" /><circle cx="10" cy="7" r="2.5" stroke="rgba(239,68,68,0.6)" strokeWidth="1.2" fill="none" /></svg>;
  }
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="2" width="10" height="10" rx="1" stroke="rgba(255,255,255,0.35)" strokeWidth="1" /></svg>;
}
