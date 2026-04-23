'use client';

import { useEffect } from 'react';
import { ROSTER_IRE } from '@/data/iRoster';
import useEditorStore from '@/store/useEditorStore';

interface RosterModalProps {
  onClose: () => void;
}

export default function RosterModal({ onClose }: RosterModalProps) {
  const { scenes, currentSceneId, selectedActorNumber, setSelectedActorNumber } = useEditorStore();
  const currentScene = scenes.find((s) => s.id === currentSceneId);
  const onBallActorId = currentScene?.onBall;

  // Find which actor the onBall id belongs to — get the number
  const onBallActor = currentScene?.actors.find((a) => a.id === onBallActorId);
  const onBallNumber = onBallActor?.number;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSelect = (n: number) => {
    setSelectedActorNumber(n);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="w-[720px] rounded-2xl border flex flex-col overflow-hidden max-h-[80vh]"
        style={{ background: 'var(--bg-elev)', borderColor: 'var(--border-strong)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
          <div>
            <p className="text-[10px] font-mono font-medium tracking-[0.18em] uppercase" style={{ color: 'var(--accent)' }}>IRELAND</p>
            <p className="text-lg font-semibold uppercase tracking-wide" style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: 'var(--text)' }}>
              Match Day Roster
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
            style={{ background: 'var(--bg-elev-2)', color: 'var(--text-mute)' }}
          >
            ✕
          </button>
        </div>

        {/* Grid */}
        <div className="p-6 overflow-y-auto sidebar-scroll">
          <div className="grid grid-cols-3 gap-3">
            {ROSTER_IRE.map((r) => {
              const isOnBall = r.n === onBallNumber;
              const isSelected = r.n === selectedActorNumber;
              return (
                <button
                  key={r.n}
                  onClick={() => handleSelect(r.n)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl border-l-[3px] text-left transition-all"
                  style={{
                    background: 'var(--bg-elev-2)',
                    border: '1px solid var(--border)',
                    borderLeftColor: isOnBall ? 'var(--accent-hot)' : isSelected ? 'var(--accent)' : 'transparent',
                    borderLeftWidth: '3px',
                  }}
                >
                  {/* Jersey tile */}
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: isOnBall ? 'var(--accent)' : 'var(--bg-elev)',
                      color: isOnBall ? '#0a0a0a' : 'var(--text)',
                    }}
                  >
                    <span
                      className="font-bold text-lg leading-none"
                      style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif' }}
                    >
                      {r.n}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: 'var(--text)' }}>
                      {r.name}
                    </p>
                    <p className="text-[10px] font-mono truncate" style={{ color: 'var(--text-mute)' }}>{r.pos}</p>
                    {isOnBall && (
                      <p className="text-[9px] font-mono font-bold mt-0.5" style={{ color: 'var(--accent)' }}>✓ BALL</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t shrink-0" style={{ borderColor: 'var(--border)' }}>
          <p className="text-[10px] font-mono text-center" style={{ color: 'var(--text-mute)' }}>
            Click a player to select · {selectedActorNumber ? `#${selectedActorNumber} selected` : 'None selected'}
          </p>
        </div>
      </div>
    </div>
  );
}
