'use client';

import useEditorStore from '@/store/useEditorStore';

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function formatMs(ms: number) {
  const s = Math.floor(ms / 1000);
  const dec = Math.round((ms % 1000) / 100);
  return `${s}.${dec}s`;
}

export default function SceneRail() {
  const {
    scenes, currentSceneId, setCurrentScene,
    isPlaying, setIsPlaying,
    playbackProgress, setPlaybackProgress,
    addScene, duplicateScene,
  } = useEditorStore();

  const currentIdx = scenes.findIndex((s) => s.id === currentSceneId);
  const currentScene = scenes[currentIdx];
  const total = scenes.length;

  const totalMs = scenes.reduce((sum, s) => sum + s.duration, 0);
  const elapsedMs = scenes.slice(0, currentIdx).reduce((sum, s) => sum + s.duration, 0)
    + (currentScene?.duration ?? 0) * playbackProgress;

  const trackFill = total > 0 ? ((currentIdx + playbackProgress) / total) * 100 : 0;

  const handlePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setPlaybackProgress(0);
    } else {
      setCurrentScene(scenes[0].id);
      setPlaybackProgress(0);
      setTimeout(() => setIsPlaying(true), 50);
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      setCurrentScene(scenes[currentIdx - 1].id);
      setPlaybackProgress(0);
    }
  };

  const handleForward = () => {
    if (currentIdx < total - 1) {
      setCurrentScene(scenes[currentIdx + 1].id);
      setPlaybackProgress(0);
    }
  };

  const handleAddScene = () => {
    if (currentIdx >= 0) duplicateScene(scenes[currentIdx].id);
    else addScene();
  };

  return (
    <footer
      className="shrink-0 border-t"
      style={{ background: 'var(--bg-elev)', borderColor: 'var(--border)', height: 100 }}
    >
      {/* Control row */}
      <div className="flex items-center gap-4 px-4 pt-2 pb-1">
        {/* Transport controls */}
        <div className="flex items-center gap-1">
          {/* Skip back */}
          <button
            onClick={handleBack}
            disabled={currentIdx === 0}
            className="w-7 h-7 flex items-center justify-center rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-xs"
            style={{ color: 'var(--text-mute)' }}
            title="Previous phase"
          >
            ◀◀
          </button>

          {/* Play/Pause */}
          <button
            onClick={handlePlay}
            disabled={total <= 1}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-base font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: isPlaying ? 'var(--accent)' : 'var(--bg-elev-2)',
              color: isPlaying ? '#0a0a0a' : 'var(--text-dim)',
              border: `1px solid ${isPlaying ? 'var(--accent)' : 'var(--border-strong)'}`,
            }}
            title={isPlaying ? 'Pause' : 'Play from start'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          {/* Skip forward */}
          <button
            onClick={handleForward}
            disabled={currentIdx >= total - 1}
            className="w-7 h-7 flex items-center justify-center rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-xs"
            style={{ color: 'var(--text-mute)' }}
            title="Next phase"
          >
            ▶▶
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-6" style={{ background: 'var(--border-strong)' }} />

        {/* Phase info */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-medium tracking-[0.18em] uppercase" style={{ color: 'var(--text-mute)' }}>
            PHASE
          </span>
          <span
            className="text-xl font-bold leading-none"
            style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: 'var(--accent)' }}
          >
            {pad2(currentIdx + 1)}
          </span>
          <span className="text-[10px] font-mono" style={{ color: 'var(--text-mute)' }}>
            / {pad2(total)}
          </span>
          <span
            className="text-sm font-medium uppercase ml-1 max-w-[180px] truncate"
            style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: 'var(--text-dim)', letterSpacing: '0.04em' }}
          >
            {currentScene?.name ?? ''}
          </span>
        </div>

        {/* Right: duration */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[10px] font-mono" style={{ color: 'var(--text-mute)' }}>
            {formatMs(elapsedMs)} / {formatMs(totalMs)}
          </span>
        </div>
      </div>

      {/* Track */}
      <div className="relative px-4 pb-1">
        {/* Base rail */}
        <div className="relative h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-elev-2)' }}>
          {/* Progress fill */}
          <div
            className="absolute inset-y-0 left-0 transition-all duration-200"
            style={{ background: 'var(--accent)', width: `${trackFill}%` }}
          />
        </div>

        {/* Phase markers */}
        <div className="flex mt-1">
          {scenes.map((scene, idx) => {
            const isCurrent = scene.id === currentSceneId;
            const isPast = idx < currentIdx;
            const filled = isCurrent || isPast;
            return (
              <button
                key={scene.id}
                onClick={() => { setCurrentScene(scene.id); setPlaybackProgress(0); }}
                className="flex-1 flex flex-col items-center gap-0.5 group"
              >
                {/* Label */}
                <span
                  className="text-[9px] font-mono font-medium tracking-[0.14em] uppercase leading-none"
                  style={{ color: isCurrent ? 'var(--accent)' : 'var(--text-mute)' }}
                >
                  P{pad2(idx + 1)}
                </span>
                {/* Diamond */}
                <div
                  className="transition-all"
                  style={{
                    width: isCurrent ? 10 : 7,
                    height: isCurrent ? 10 : 7,
                    background: filled ? 'var(--accent)' : 'var(--border-strong)',
                    transform: 'rotate(45deg)',
                    borderRadius: 1,
                  }}
                />
                {/* Scene name */}
                <span
                  className="text-[8px] font-mono leading-tight max-w-full truncate px-0.5"
                  style={{ color: isCurrent ? 'var(--text-dim)' : 'var(--text-mute)' }}
                >
                  {scene.name.length > 8 ? scene.name.slice(0, 7) + '…' : scene.name}
                  {scene.locked ? ' 🔒' : ''}
                </span>
              </button>
            );
          })}

          {/* Add scene button */}
          <button
            onClick={handleAddScene}
            className="flex flex-col items-center justify-center gap-0.5 px-2 rounded transition-colors"
            title="Duplicate current scene"
            style={{ color: 'var(--text-mute)' }}
          >
            <span className="text-base font-light leading-none">+</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
