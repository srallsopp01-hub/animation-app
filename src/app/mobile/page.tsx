'use client';

import { useEffect } from 'react';
import useEditorStore from '@/store/useEditorStore';
import { ROSTER_IRE } from '@/data/iRoster';

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

// Simple SVG pitch thumbnail
function PitchSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 112 70"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
    >
      <rect width="112" height="70" fill="var(--pitch-fill)" />
      <rect x="0" y="0" width="6" height="70" fill="var(--pitch-in-goal)" />
      <rect x="106" y="0" width="6" height="70" fill="var(--pitch-in-goal)" />
      {[6, 28, 56, 84, 106].map((x, i) => (
        <line key={i} x1={x} y1="0" x2={x} y2="70"
          stroke="rgba(255,255,255,0.4)" strokeWidth={i === 2 ? 0.8 : 0.5} />
      ))}
      <line x1="0" y1="0" x2="112" y2="0" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
      <line x1="0" y1="70" x2="112" y2="70" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
    </svg>
  );
}

export default function MobilePage() {
  const {
    loadFromStorage,
    scenes,
    currentSceneId,
    setCurrentScene,
    isPlaying,
    setIsPlaying,
    nextScene,
    palette,
  } = useEditorStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    document.documentElement.setAttribute('data-palette', palette);
  }, [palette]);

  useEffect(() => {
    if (!isPlaying) return;
    const currentScene = scenes.find((s) => s.id === currentSceneId);
    const duration = currentScene?.duration ?? 1500;
    const timer = setTimeout(() => {
      const hasNext = nextScene();
      if (!hasNext) setIsPlaying(false);
    }, duration);
    return () => clearTimeout(timer);
  }, [isPlaying, currentSceneId, scenes, nextScene, setIsPlaying]);

  const currentIdx = scenes.findIndex((s) => s.id === currentSceneId);
  const currentScene = scenes[currentIdx];
  const total = scenes.length;

  const onBallActorId = currentScene?.onBall;
  const onBallActor = currentScene?.actors.find((a) => a.id === onBallActorId);
  const onBallPlayer = onBallActor ? ROSTER_IRE.find((r) => r.n === onBallActor.number) : null;

  const handleBack = () => {
    if (currentIdx > 0) setCurrentScene(scenes[currentIdx - 1].id);
  };
  const handleForward = () => {
    if (currentIdx < total - 1) setCurrentScene(scenes[currentIdx + 1].id);
  };
  const handlePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setCurrentScene(scenes[0].id);
      setTimeout(() => setIsPlaying(true), 50);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: '#000' }}
    >
      {/* Phone frame — 390×844 */}
      <div
        className="relative flex flex-col overflow-hidden rounded-[40px]"
        style={{ width: 390, height: 844, background: 'var(--bg)', boxShadow: '0 0 0 12px #111, 0 0 60px rgba(0,0,0,0.8)' }}
      >
        {/* Status bar */}
        <div
          className="flex items-center justify-between px-6 shrink-0"
          style={{ height: 44, background: 'var(--bg-elev)' }}
        >
          <span className="text-xs font-bold" style={{ color: 'var(--text)' }}>9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs" style={{ color: 'var(--text-mute)' }}>●●●●</span>
            <span className="text-xs" style={{ color: 'var(--text-mute)' }}>WiFi</span>
            <span className="text-xs" style={{ color: 'var(--text-mute)' }}>🔋</span>
          </div>
        </div>

        {/* App header */}
        <div
          className="flex items-center gap-3 px-4 shrink-0 border-b"
          style={{ height: 48, background: 'var(--bg-elev)', borderColor: 'var(--border)' }}
        >
          <div
            className="w-7 h-7 flex items-center justify-center rounded-md text-base font-bold shrink-0"
            style={{ background: 'var(--accent)', color: '#0a0a0a', fontFamily: 'var(--font-oswald), Oswald, sans-serif' }}
          >
            P
          </div>
          <span
            className="flex-1 text-sm font-medium uppercase"
            style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: 'var(--text)' }}
          >
            IRE v NZL · Q3 58:14
          </span>
          <span
            className="text-[9px] font-mono font-medium tracking-[0.18em] uppercase px-2 py-0.5 rounded"
            style={{ color: 'var(--accent)', border: '1px solid var(--accent)' }}
          >
            ↑ LIVE · IRE-L04
          </span>
          <button className="w-6 h-6 flex items-center justify-center text-lg" style={{ color: 'var(--text-mute)' }}>⋯</button>
        </div>

        {/* Phase strip */}
        <div
          className="flex shrink-0"
          style={{ background: 'var(--bg-elev)', borderBottom: `1px solid var(--border)` }}
        >
          {scenes.slice(0, 7).map((scene, idx) => {
            const isCurrent = scene.id === currentSceneId;
            const isPast = idx < currentIdx;
            return (
              <button
                key={scene.id}
                onClick={() => setCurrentScene(scene.id)}
                className="flex-1 flex flex-col items-center pt-1.5 pb-1 gap-0.5"
                style={{
                  borderTop: `3px solid ${isCurrent || isPast ? 'var(--accent)' : 'var(--border-strong)'}`,
                }}
              >
                <span
                  className="text-[8px] font-mono font-medium tracking-wide uppercase"
                  style={{ color: isCurrent ? 'var(--accent)' : 'var(--text-mute)' }}
                >
                  P{pad2(idx + 1)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Phase title */}
        <div className="px-4 py-2 shrink-0" style={{ borderBottom: `1px solid var(--border)` }}>
          <p className="text-[9px] font-mono tracking-[0.18em] uppercase" style={{ color: 'var(--text-mute)' }}>
            PHASE {pad2(currentIdx + 1)} / {pad2(total)}
          </p>
          <p
            className="text-xl font-bold uppercase mt-0.5 leading-tight"
            style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: 'var(--text)', letterSpacing: '0.04em' }}
          >
            {currentScene?.name ?? 'Scene'}
          </p>
        </div>

        {/* Pitch area */}
        <div
          className="flex-1 flex items-center justify-center p-3 overflow-hidden"
          style={{ background: 'var(--bg-elev-2)' }}
        >
          <div className="w-full rounded-xl overflow-hidden" style={{ aspectRatio: '112/70', maxHeight: '100%', maxWidth: '100%' }}>
            {/* Actors overlay container */}
            <div className="relative w-full h-full">
              <PitchSVG className="absolute inset-0" />
              {/* Actor dots */}
              <svg
                viewBox="0 0 112 70"
                preserveAspectRatio="xMidYMid meet"
                className="absolute inset-0 w-full h-full"
              >
                {(currentScene?.actors ?? []).map((actor) => {
                  const cx = actor.normX * 112;
                  const cy = actor.normY * 70;
                  const fill = actor.team === 'home' ? '#3b82f6' : actor.team === 'away' ? '#ef4444' : '#f59e0b';
                  return (
                    <g key={actor.id}>
                      {actor.id === onBallActorId && (
                        <circle cx={cx} cy={cy} r={3.5} fill="none" stroke="#f7b500" strokeWidth="0.8" />
                      )}
                      <circle cx={cx} cy={cy} r={2.5} fill={fill} stroke="white" strokeWidth="0.5" />
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Controls row */}
        <div
          className="flex items-center gap-2 px-4 py-3 shrink-0"
          style={{ background: 'var(--bg-elev)', borderTop: `1px solid var(--border)` }}
        >
          <button
            onClick={handleBack}
            disabled={currentIdx === 0}
            className="flex-1 py-2 rounded-lg text-sm border transition-colors disabled:opacity-30"
            style={{ borderColor: 'var(--border-strong)', color: 'var(--text-mute)' }}
          >
            ←
          </button>
          <button
            onClick={handlePlay}
            disabled={total <= 1}
            className="flex-[2] py-2.5 rounded-lg text-sm font-bold transition-all disabled:opacity-30"
            style={{ background: 'var(--accent)', color: '#0a0a0a' }}
          >
            {isPlaying ? '⏸ PAUSE' : '▶ PLAY PHASE'}
          </button>
          <button
            onClick={handleForward}
            disabled={currentIdx >= total - 1}
            className="flex-1 py-2 rounded-lg text-sm border transition-colors disabled:opacity-30"
            style={{ borderColor: 'var(--border-strong)', color: 'var(--text-mute)' }}
          >
            →
          </button>
        </div>

        {/* Coach cue — pinned bottom */}
        <div
          className="flex items-center gap-3 px-4 py-2 shrink-0"
          style={{
            borderTop: `2px solid var(--accent)`,
            background: 'var(--bg-elev)',
          }}
        >
          <span
            className="text-[9px] font-mono font-bold tracking-[0.18em] uppercase shrink-0"
            style={{ color: 'var(--accent)' }}
          >
            COACH CUE
          </span>
          <span
            className="flex-1 text-sm font-medium uppercase truncate"
            style={{
              fontFamily: 'var(--font-oswald), Oswald, sans-serif',
              color: currentScene?.cue ? 'var(--text)' : 'var(--text-mute)',
            }}
          >
            {currentScene?.cue ?? 'No cue'}
          </span>
          {onBallPlayer && (
            <div
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg shrink-0"
              style={{ background: 'var(--accent)' }}
            >
              <span
                className="text-xs font-bold leading-none"
                style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: '#0a0a0a' }}
              >
                {onBallPlayer.n}
              </span>
              <span className="text-[9px] font-medium" style={{ color: '#0a0a0a' }}>
                {onBallPlayer.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
