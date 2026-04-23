'use client';

import useEditorStore from '@/store/useEditorStore';

interface TopBarProps {
  onOpenExport: () => void;
  onOpenShare: () => void;
}

const PALETTE_SWATCHES: { value: 'dark' | 'navy' | 'light'; color: string; label: string }[] = [
  { value: 'dark',  color: '#f7b500', label: 'Dark · Gold' },
  { value: 'navy',  color: '#16a34a', label: 'Navy · Green' },
  { value: 'light', color: '#d97706', label: 'Light · Amber' },
];

export default function TopBar({ onOpenExport, onOpenShare }: TopBarProps) {
  const {
    undo, redo, past, future,
    showMovementArrows, setShowMovementArrows,
    showPlayerNames, setShowPlayerNames,
    palette, setPalette,
    scenes, currentSceneId,
  } = useEditorStore();

  const currentSceneIndex = scenes.findIndex((s) => s.id === currentSceneId);
  const currentScene = scenes[currentSceneIndex];

  return (
    <header
      className="h-14 flex items-center shrink-0 z-10 border-b"
      style={{ background: 'var(--bg-elev)', borderColor: 'var(--border)' }}
    >
      {/* 1. Wordmark tile */}
      <div
        className="w-14 h-14 flex items-center justify-center shrink-0 text-[32px] font-bold select-none"
        style={{
          background: 'var(--accent)',
          color: '#0a0a0a',
          fontFamily: 'var(--font-oswald), Oswald, sans-serif',
          letterSpacing: '-0.04em',
        }}
      >
        P
      </div>

      {/* 2. Match card */}
      <div className="flex items-center gap-3 px-4 border-r h-full" style={{ borderColor: 'var(--border)' }}>
        {/* LIVE pulse */}
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm bg-red-500 animate-pulse inline-block" />
          <span
            className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase"
            style={{ color: '#ef4444' }}
          >
            LIVE ANALYSIS
          </span>
        </div>
        {/* Score */}
        <div className="flex items-center gap-1.5">
          <span
            className="text-xl font-bold uppercase"
            style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: 'var(--text)' }}
          >
            IRE
          </span>
          <span
            className="text-xl font-bold"
            style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: 'var(--accent)' }}
          >
            22 – 19
          </span>
          <span
            className="text-xl font-bold uppercase"
            style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: 'var(--text-dim)' }}
          >
            NZL
          </span>
        </div>
        {/* Pill */}
        <div
          className="flex items-center px-2 py-0.5 rounded-full border text-[10px] font-mono font-medium tracking-[0.18em] uppercase whitespace-nowrap"
          style={{ borderColor: 'var(--border-strong)', color: 'var(--text-mute)' }}
        >
          Q3 · 58:14 · Aviva
        </div>
      </div>

      {/* 3. Play title */}
      <div className="flex-1 flex items-center gap-3 px-4 min-w-0">
        <span className="text-[10px] font-mono font-medium tracking-[0.18em] uppercase" style={{ color: 'var(--text-mute)' }}>
          Play
        </span>
        <span
          className="text-base font-semibold uppercase truncate"
          style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: 'var(--text)', letterSpacing: '0.02em' }}
        >
          {currentScene?.name ?? 'Lineout Strike · Off the Top – 9'}
        </span>
        <div
          className="shrink-0 flex items-center px-2 py-0.5 rounded border text-[10px] font-mono font-medium tracking-[0.18em] uppercase"
          style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
        >
          PLAYBOOK · IRE-L04
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 px-3 shrink-0">
        {/* Undo/Redo */}
        <button
          onClick={undo}
          disabled={past.length === 0}
          title="Undo (Ctrl+Z)"
          className="w-7 h-7 flex items-center justify-center rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ color: 'var(--text-mute)' }}
        >
          <UndoIcon />
        </button>
        <button
          onClick={redo}
          disabled={future.length === 0}
          title="Redo (Ctrl+Shift+Z)"
          className="w-7 h-7 flex items-center justify-center rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ color: 'var(--text-mute)' }}
        >
          <RedoIcon />
        </button>

        <div className="w-px h-5 mx-1" style={{ background: 'var(--border-strong)' }} />

        {/* Paths toggle */}
        <button
          onClick={() => setShowMovementArrows(!showMovementArrows)}
          title="Toggle movement paths"
          className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono font-medium tracking-[0.18em] uppercase transition-all"
          style={{
            background: showMovementArrows ? 'var(--accent)' : 'var(--bg-elev-2)',
            color: showMovementArrows ? '#0a0a0a' : 'var(--text-mute)',
            border: `1px solid ${showMovementArrows ? 'var(--accent)' : 'var(--border)'}`,
          }}
        >
          Paths
        </button>

        {/* Names toggle */}
        <button
          onClick={() => setShowPlayerNames(!showPlayerNames)}
          title="Toggle player names"
          className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono font-medium tracking-[0.18em] uppercase transition-all"
          style={{
            background: showPlayerNames ? 'var(--accent)' : 'var(--bg-elev-2)',
            color: showPlayerNames ? '#0a0a0a' : 'var(--text-mute)',
            border: `1px solid ${showPlayerNames ? 'var(--accent)' : 'var(--border)'}`,
          }}
        >
          Names
        </button>

        <div className="w-px h-5 mx-1" style={{ background: 'var(--border-strong)' }} />

        {/* Palette swatches */}
        <div className="flex items-center gap-1.5">
          {PALETTE_SWATCHES.map((sw) => (
            <button
              key={sw.value}
              onClick={() => setPalette(sw.value)}
              title={sw.label}
              className="w-5 h-5 rounded-full transition-all"
              style={{
                background: sw.color,
                outline: palette === sw.value ? `2px solid var(--text)` : '2px solid transparent',
                outlineOffset: '2px',
              }}
            />
          ))}
        </div>

        <div className="w-px h-5 mx-1" style={{ background: 'var(--border-strong)' }} />

        {/* Share */}
        <button
          onClick={onOpenShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-colors"
          style={{ borderColor: 'var(--border-strong)', color: 'var(--text-dim)' }}
        >
          ↗ Share
        </button>

        {/* Export */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
          style={{ background: 'var(--accent)', color: '#0a0a0a' }}
        >
          Export
        </button>
      </div>
    </header>
  );
}

function UndoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
    </svg>
  );
}
function RedoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="m15 14 5-5-5-5" /><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13" />
    </svg>
  );
}
