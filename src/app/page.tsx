'use client';

import { useEffect, useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import useEditorStore from '@/store/useEditorStore';
import TopBar from '@/components/editor/TopBar';
import LeftSidebar from '@/components/editor/LeftSidebar';
import RightSidebar from '@/components/editor/RightSidebar';
import SceneRail from '@/components/editor/SceneRail';
import ExportModal from '@/components/editor/modals/ExportModal';
import ShareModal from '@/components/editor/modals/ShareModal';
import RosterModal from '@/components/editor/modals/RosterModal';

const RugbyCanvas = dynamic(() => import('@/components/editor/canvas/RugbyCanvas'), { ssr: false });

function pad2(n: number) { return String(n).padStart(2, '0'); }

export default function EditorPage() {
  const {
    loadFromStorage,
    scenes,
    currentSceneId,
    projectName,
    undo,
    redo,
    selectedActorId,
    selectedArrowId,
    selectedZoneId,
    deleteActor,
    deletePlayArrow,
    deleteZone,
    isPlaying,
    nextScene,
    setIsPlaying,
    palette,
  } = useEditorStore();

  const [exportOpen, setExportOpen] = useState(false);
  const [shareOpen, setShareOpen]   = useState(false);
  const [rosterOpen, setRosterOpen] = useState(false);

  useEffect(() => { loadFromStorage(); }, [loadFromStorage]);

  useEffect(() => {
    document.documentElement.setAttribute('data-palette', palette);
  }, [palette]);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('rugby-editor', JSON.stringify({ projectName, scenes, currentSceneId }));
    }, 800);
    return () => clearTimeout(timer);
  }, [scenes, currentSceneId, projectName]);

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

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      if (meta && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((meta && e.shiftKey && e.key === 'z') || (meta && e.key === 'y')) { e.preventDefault(); redo(); }
      if (!isInput && (e.key === 'Delete' || e.key === 'Backspace')) {
        if (selectedActorId) { e.preventDefault(); deleteActor(selectedActorId); }
        else if (selectedArrowId) { e.preventDefault(); deletePlayArrow(selectedArrowId); }
        else if (selectedZoneId) { e.preventDefault(); deleteZone(selectedZoneId); }
      }
      if (e.key === 'Escape') {
        useEditorStore.getState().setSelectedActor(null);
        useEditorStore.getState().setSelectedArrow(null);
        useEditorStore.getState().setSelectedZone(null);
        useEditorStore.getState().setSelectedTool('select');
        setExportOpen(false);
        setShareOpen(false);
        setRosterOpen(false);
      }
      if (!isInput && e.key === ' ') {
        e.preventDefault();
        if (scenes.length > 1) setIsPlaying(!isPlaying);
      }
    },
    [undo, redo, selectedActorId, selectedArrowId, selectedZoneId, deleteActor, deletePlayArrow, deleteZone, isPlaying, setIsPlaying, scenes]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const currentIdx   = scenes.findIndex((s) => s.id === currentSceneId);
  const currentScene = scenes[currentIdx];
  const homeCount    = currentScene?.actors.filter((a) => a.team === 'home').length ?? 0;
  const awayCount    = currentScene?.actors.filter((a) => a.team === 'away').length ?? 0;
  const ballCount    = currentScene?.actors.filter((a) => a.type === 'ball').length ?? 0;

  return (
    <div
      className="flex flex-col h-screen overflow-hidden select-none"
      style={{ background: 'var(--bg)', color: 'var(--text)' }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────────── */}
      <TopBar onOpenExport={() => setExportOpen(true)} onOpenShare={() => setShareOpen(true)} />

      {/* ── Main content ──────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        <LeftSidebar />

        {/* Canvas area with overlays */}
        <main className="flex-1 flex flex-col overflow-hidden relative min-w-0" style={{ background: 'var(--bg)' }}>

          {/* Phase title overlay — top-left corner of canvas */}
          {currentScene && (
            <div
              className="absolute top-0 left-0 z-10 pointer-events-none"
              style={{ padding: '12px 16px' }}
            >
              <div
                className="text-[8px] font-mono font-bold tracking-[0.22em] uppercase"
                style={{ color: 'var(--accent)' }}
              >
                PHASE {pad2(currentIdx + 1)} / {pad2(scenes.length)}
              </div>
              <div
                className="text-xl font-bold uppercase leading-tight mt-0.5"
                style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: 'var(--text)', letterSpacing: '0.05em' }}
              >
                {currentScene.name}
              </div>
            </div>
          )}

          {/* Phase number watermark */}
          {currentScene && (
            <div
              className="absolute inset-0 flex items-center justify-end pointer-events-none overflow-hidden"
              style={{ paddingRight: '4%', zIndex: 0 }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: 'min(26vw, 300px)',
                  fontWeight: 900,
                  color: 'var(--bg-elev)',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                  userSelect: 'none',
                  opacity: 0.9,
                }}
              >
                {pad2(currentIdx + 1)}
              </span>
            </div>
          )}

          {/* Konva canvas fills remaining space */}
          <div className="flex-1 relative min-h-0" style={{ zIndex: 1 }}>
            <RugbyCanvas />
          </div>

          {/* Coach cue + stats — bottom accent bar */}
          <div
            className="shrink-0 flex items-center gap-4 z-10"
            style={{
              background: 'var(--bg-elev)',
              borderTop: '2px solid var(--accent)',
              padding: '7px 16px',
              minHeight: 44,
            }}
          >
            <div className="flex-1 min-w-0">
              <span
                className="text-[8px] font-mono font-bold tracking-[0.22em] uppercase block"
                style={{ color: 'var(--accent)' }}
              >
                COACH CUE
              </span>
              <span
                className="text-[13px] uppercase leading-tight truncate block mt-0.5"
                style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: 'var(--text)', letterSpacing: '0.02em' }}
              >
                {currentScene?.cue || 'No cue set for this phase — add one in the Scene tab.'}
              </span>
            </div>
            <div className="flex items-center gap-5 shrink-0">
              {[
                { val: homeCount, label: 'IRE',  color: 'var(--accent)' },
                { val: awayCount, label: 'NZL',  color: 'var(--text-mute)' },
                { val: ballCount, label: 'BALL', color: 'var(--text-dim)' },
                { val: `${((currentScene?.duration ?? 0) / 1000).toFixed(1)}s`, label: 'DUR', color: 'var(--text-mute)' },
              ].map(({ val, label, color }) => (
                <div key={label} className="flex flex-col items-center">
                  <span
                    className="text-base font-bold tabular-nums leading-none"
                    style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color }}
                  >
                    {val}
                  </span>
                  <span
                    className="text-[7px] font-mono tracking-[0.18em] uppercase leading-none mt-0.5"
                    style={{ color: 'var(--text-mute)' }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>

        <RightSidebar onOpenRoster={() => setRosterOpen(true)} />
      </div>

      {/* ── Phase timeline (bottom) ────────────────────────────────────────────── */}
      <SceneRail />

      {/* Modals */}
      {exportOpen && <ExportModal onClose={() => setExportOpen(false)} />}
      {shareOpen  && <ShareModal  onClose={() => setShareOpen(false)} />}
      {rosterOpen && <RosterModal onClose={() => setRosterOpen(false)} />}
    </div>
  );
}
