'use client';

import useEditorStore from '@/store/useEditorStore';

interface TopBarProps {
  onOpenExport: () => void;
  onOpenShare: () => void;
}

const PALETTE_SWATCHES: { value: 'dark' | 'navy' | 'light'; color: string }[] = [
  { value: 'dark',  color: '#f7b500' },
  { value: 'navy',  color: '#16a34a' },
  { value: 'light', color: '#d97706' },
];

export default function TopBar({ onOpenExport, onOpenShare }: TopBarProps) {
  const {
    undo, redo, past, future,
    showMovementArrows, setShowMovementArrows,
    showPlayerNames, setShowPlayerNames,
    palette, setPalette,
    scenes, currentSceneId,
    projectName,
  } = useEditorStore();

  const currentSceneIndex = scenes.findIndex((s) => s.id === currentSceneId);
  const total = scenes.length;
  const totalMs = scenes.reduce((sum, s) => sum + s.duration, 0);

  return (
    <header
      className="shrink-0 flex items-stretch z-10 border-b"
      style={{ background: 'var(--bg-elev)', borderColor: 'var(--border)', height: 60 }}
    >
      {/* ── Wordmark ─────────────────────────────────────────────────────────── */}
      <div
        className="w-[60px] shrink-0 flex flex-col items-center justify-center select-none border-r"
        style={{ background: 'var(--accent)', borderColor: 'transparent' }}
      >
        <span
          className="text-[28px] font-bold leading-none"
          style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: '#0a0a0a', letterSpacing: '-0.04em' }}
        >
          P
        </span>
        <span
          className="text-[7px] font-mono font-bold tracking-[0.18em] uppercase leading-none mt-0.5"
          style={{ color: '#0a0a0a', opacity: 0.55 }}
        >
          BOARD
        </span>
      </div>

      {/* ── Brand + label ─────────────────────────────────────────────────── */}
      <div className="flex flex-col justify-center pl-3 pr-4 border-r" style={{ borderColor: 'var(--border)' }}>
        <span
          className="text-[17px] font-bold uppercase leading-tight"
          style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: 'var(--text)', letterSpacing: '0.04em' }}
        >
          PHASEBOARD
        </span>
        <span
          className="text-[8px] font-mono font-bold tracking-[0.22em] uppercase"
          style={{ color: 'var(--accent)' }}
        >
          BROADCAST
        </span>
      </div>

      {/* ── Match card ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 border-r" style={{ borderColor: 'var(--border)' }}>
        {/* IRE */}
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-sm flex items-center justify-center" style={{ background: '#22c55e' }}>
            <span className="text-[8px] font-bold text-white leading-none">IE</span>
          </div>
          <span className="text-sm font-bold uppercase" style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: 'var(--text)' }}>
            IRE
          </span>
        </div>
        <span className="text-sm font-medium" style={{ color: 'var(--text-mute)' }}>VS</span>
        {/* NZL */}
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-sm flex items-center justify-center" style={{ background: '#374151' }}>
            <span className="text-[8px] font-bold text-white leading-none">NZ</span>
          </div>
          <span className="text-sm font-bold uppercase" style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: 'var(--text-mute)' }}>
            NZL
          </span>
        </div>
      </div>

      {/* ── Play title (center flex) ───────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-4 min-w-0">
        <div className="flex items-baseline gap-3 min-w-0">
          <span
            className="text-base font-bold uppercase truncate leading-tight"
            style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: 'var(--text)', letterSpacing: '0.05em' }}
          >
            {projectName ?? 'LINEOUT STRIKE — OFF THE TOP'}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[9px] font-mono uppercase tracking-[0.18em]" style={{ color: 'var(--text-mute)' }}>
            PLAYBOOK · {total} PHASES · {(totalMs / 1000).toFixed(1)} SEC
          </span>
        </div>
      </div>

      {/* ── Utility toggles ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 px-3 border-l" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={undo} disabled={past.length === 0}
          title="Undo (Ctrl+Z)"
          className="w-7 h-7 flex items-center justify-center rounded transition-colors disabled:opacity-30"
          style={{ color: 'var(--text-mute)' }}
        >
          <UndoIcon />
        </button>
        <button
          onClick={redo} disabled={future.length === 0}
          title="Redo (Ctrl+Shift+Z)"
          className="w-7 h-7 flex items-center justify-center rounded transition-colors disabled:opacity-30"
          style={{ color: 'var(--text-mute)' }}
        >
          <RedoIcon />
        </button>
        <div className="w-px h-4 mx-0.5" style={{ background: 'var(--border-strong)' }} />
        <ToggleBtn active={showMovementArrows} onClick={() => setShowMovementArrows(!showMovementArrows)}>
          Paths
        </ToggleBtn>
        <ToggleBtn active={showPlayerNames} onClick={() => setShowPlayerNames(!showPlayerNames)}>
          Names
        </ToggleBtn>
        <div className="w-px h-4 mx-0.5" style={{ background: 'var(--border-strong)' }} />
        {/* Palette swatches */}
        {PALETTE_SWATCHES.map((sw) => (
          <button
            key={sw.value}
            onClick={() => setPalette(sw.value)}
            className="w-4 h-4 rounded-full transition-all"
            style={{
              background: sw.color,
              outline: palette === sw.value ? `2px solid var(--text)` : '2px solid transparent',
              outlineOffset: '2px',
            }}
          />
        ))}
      </div>

      {/* ── Total duration display ──────────────────────────────────────────── */}
      <div className="flex flex-col justify-center items-end px-4 border-l shrink-0" style={{ borderColor: 'var(--border)' }}>
        <span
          className="text-[22px] font-bold leading-none tabular-nums"
          style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: 'var(--accent)', letterSpacing: '0.02em' }}
        >
          {String(total).padStart(2, '0')}
        </span>
        <span className="text-[7px] font-mono tracking-[0.18em] uppercase leading-none mt-0.5" style={{ color: 'var(--text-mute)' }}>
          PHASES · {(totalMs / 1000).toFixed(1)}S
        </span>
      </div>

      {/* ── Export / Share ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-3 border-l" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={onOpenShare}
          className="px-3 h-8 rounded text-[11px] font-mono font-medium tracking-[0.12em] uppercase transition-colors border"
          style={{ borderColor: 'var(--border-strong)', color: 'var(--text-mute)' }}
        >
          SHARE
        </button>
        <button
          onClick={onOpenExport}
          className="px-4 h-8 rounded text-[11px] font-mono font-bold tracking-[0.12em] uppercase transition-colors"
          style={{ background: 'var(--accent)', color: '#0a0a0a' }}
        >
          EXPORT
        </button>
      </div>
    </header>
  );
}

function ToggleBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="px-2 py-1 rounded text-[9px] font-mono font-medium tracking-[0.14em] uppercase transition-all"
      style={{
        background: active ? 'var(--accent)' : 'transparent',
        color: active ? '#0a0a0a' : 'var(--text-mute)',
        border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
      }}
    >
      {children}
    </button>
  );
}

function UndoIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
    </svg>
  );
}
function RedoIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="m15 14 5-5-5-5" /><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13" />
    </svg>
  );
}
