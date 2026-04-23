'use client';

import useEditorStore from '@/store/useEditorStore';
import { FORMATIONS } from '@/data/formations';
import type { Tool } from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function MonoLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[10px] font-mono font-medium tracking-[0.18em] uppercase px-3 pt-3 pb-1"
      style={{ color: 'var(--text-mute)' }}
    >
      {children}
    </p>
  );
}

// ─── Tool config ──────────────────────────────────────────────────────────────

interface ToolDef {
  tool: Tool;
  label: string;
  icon: React.ReactNode;
}

const TOOL_DEFS: ToolDef[] = [
  { tool: 'select',     label: 'Select', icon: <SelectIcon /> },
  { tool: 'arrow-run',  label: 'Run',    icon: <RunIcon /> },
  { tool: 'arrow-pass', label: 'Pass',   icon: <PassIcon /> },
  { tool: 'arrow-kick', label: 'Kick',   icon: <KickIcon /> },
  { tool: 'zone',       label: 'Zone',   icon: <ZoneIcon /> },
  { tool: 'player-home',label: 'Note',   icon: <NoteIcon /> },
];

export default function LeftSidebar() {
  const {
    selectedTool, setSelectedTool,
    setSelectedActor,
    applyFormation,
    scenes, currentSceneId,
    toggleLockScene,
  } = useEditorStore();

  const currentScene = scenes.find((s) => s.id === currentSceneId);
  const isLocked = currentScene?.locked ?? false;

  return (
    <aside
      className="w-60 shrink-0 flex flex-col overflow-hidden border-r"
      style={{ background: 'var(--bg-elev)', borderColor: 'var(--border)' }}
    >
      {/* ── Tools ──────────────────────────────────────────────────────────── */}
      <div className="border-b pb-3" style={{ borderColor: 'var(--border)' }}>
        <MonoLabel>Tools</MonoLabel>
        <div className="grid grid-cols-3 gap-1.5 px-3">
          {TOOL_DEFS.map(({ tool, label, icon }) => {
            const isActive = selectedTool === tool;
            return (
              <button
                key={tool}
                onClick={() => { setSelectedTool(tool); setSelectedActor(null); }}
                title={label}
                className="w-full aspect-square flex flex-col items-center justify-center gap-1 rounded-lg text-[9px] font-mono font-medium tracking-wide uppercase transition-all"
                style={{
                  background: isActive ? 'var(--accent)' : 'var(--bg-elev-2)',
                  color: isActive ? '#0a0a0a' : 'var(--text-mute)',
                  outline: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                }}
              >
                {icon}
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Formations ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-3 pt-3 pb-1 shrink-0">
          <p
            className="text-[10px] font-mono font-medium tracking-[0.18em] uppercase"
            style={{ color: 'var(--text-mute)' }}
          >
            Formations
          </p>
          <button
            className="text-[10px] font-mono font-medium px-2 py-0.5 rounded border transition-colors"
            style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
            onClick={() => {/* no-op: add blank scene */}}
          >
            + New
          </button>
        </div>

        <div className="flex-1 overflow-y-auto sidebar-scroll">
          {FORMATIONS.map((preset) => {
            return (
              <button
                key={preset.id}
                onClick={() => applyFormation(preset)}
                title={preset.description}
                className="w-full flex items-center justify-between py-2.5 px-3 transition-all text-left border-l-[3px]"
                style={{
                  borderLeftColor: 'transparent',
                  borderBottom: `1px solid var(--border)`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderLeftColor = 'var(--accent)';
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-elev-2)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderLeftColor = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }}
              >
                <div className="min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: 'var(--text-dim)', letterSpacing: '0.02em' }}
                  >
                    {preset.name}
                  </p>
                  <p className="text-[9px] font-mono uppercase tracking-wider mt-0.5" style={{ color: 'var(--text-mute)' }}>
                    {preset.category}
                  </p>
                </div>
                <span className="text-[9px] font-mono ml-2 shrink-0" style={{ color: 'var(--text-mute)' }}>
                  {preset.actors.filter((a) => a.team === 'home').length}v
                  {preset.actors.filter((a) => a.team === 'away').length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Phase Lock ─────────────────────────────────────────────────────── */}
      <div className="border-t p-3" style={{ borderColor: 'var(--border)' }}>
        <p
          className="text-[10px] font-mono font-medium tracking-[0.18em] uppercase mb-2"
          style={{ color: 'var(--text-mute)' }}
        >
          Phase Lock
        </p>
        <button
          onClick={() => currentScene && toggleLockScene(currentScene.id)}
          className="w-full py-2 rounded-lg text-sm font-semibold transition-all"
          style={{
            background: isLocked ? 'var(--accent)' : 'var(--bg-elev-2)',
            color: isLocked ? '#0a0a0a' : 'var(--text-mute)',
            border: `1px solid ${isLocked ? 'var(--accent)' : 'var(--border)'}`,
          }}
        >
          {isLocked ? '✓ Locked 🔒' : '✗ Unlocked 🔓'}
        </button>
      </div>
    </aside>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function SelectIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4 0l16 12.279-6.951 1.17 4.325 8.817-3.596 1.734-4.35-8.879-5.428 4.702z" /></svg>;
}
function RunIcon() {
  return <svg width="16" height="12" viewBox="0 0 18 14" fill="none"><path d="M2 7L13 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M10 3L15 7L10 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function PassIcon() {
  return <svg width="16" height="12" viewBox="0 0 18 14" fill="none"><path d="M2 7L13 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="3 2.5" /><path d="M10 3L15 7L10 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function KickIcon() {
  return <svg width="16" height="12" viewBox="0 0 18 14" fill="none"><path d="M2 7L13 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="5 3" /><path d="M10 3L15 7L10 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function ZoneIcon() {
  return <svg width="16" height="12" viewBox="0 0 18 14" fill="none"><rect x="2" y="2" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" /></svg>;
}
function NoteIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 12h8M8 8h8M8 16h5" /></svg>;
}
