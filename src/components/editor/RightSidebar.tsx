'use client';

import { useState } from 'react';
import useEditorStore from '@/store/useEditorStore';
import { ROSTER_IRE } from '@/data/iRoster';
import type { ArrowDrawType, Team } from '@/types';

// ─── Mono label ───────────────────────────────────────────────────────────────

function MonoLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-mono font-medium tracking-[0.18em] uppercase" style={{ color: 'var(--text-mute)' }}>
      {children}
    </p>
  );
}

function PanelSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
      {children}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--border)' }}>
      <span className="text-xs px-4" style={{ color: 'var(--text-mute)' }}>{label}</span>
      <span className="text-xs font-medium px-4" style={{ color: 'var(--text)' }}>{children}</span>
    </div>
  );
}

function SliderRow({
  label, value, min, max, step, format, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number;
  format: (v: number) => string; onChange: (v: number) => void;
}) {
  return (
    <div className="px-4 py-2.5 border-b" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px]" style={{ color: 'var(--text-mute)' }}>{label}</span>
        <span className="text-[11px] font-mono" style={{ color: 'var(--text-dim)' }}>{format(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 accent-[var(--accent)]"
        style={{ accentColor: 'var(--accent)' }}
      />
    </div>
  );
}

// ─── On the Ball Panel ────────────────────────────────────────────────────────

function OnTheBallPanel({ onOpenRoster }: { onOpenRoster: () => void }) {
  const {
    scenes, currentSceneId, selectedActorNumber, setSelectedActorNumber, setSceneOnBall,
  } = useEditorStore();

  const currentScene = scenes.find((s) => s.id === currentSceneId);
  const onBallActorId = currentScene?.onBall;
  const onBallActor = currentScene?.actors.find((a) => a.id === onBallActorId);
  const onBallNumber = onBallActor?.number ?? null;

  const displayNumber = selectedActorNumber ?? onBallNumber;
  const player = displayNumber !== null ? ROSTER_IRE.find((r) => r.n === displayNumber) : null;

  const MOCK_STATS = [
    { label: 'Carries',   value: 8 },
    { label: 'Tackles',   value: 11 },
    { label: 'Metres',    value: 42 },
    { label: 'Passes',    value: 23 },
    { label: 'Turnovers', value: 2 },
    { label: 'Minutes',   value: 58 },
  ];

  return (
    <>
      {/* Header */}
      <PanelSection>
        <div className="flex items-center justify-between">
          <MonoLabel>ON THE BALL</MonoLabel>
          <button
            onClick={onOpenRoster}
            className="text-[10px] font-mono font-medium px-2 py-0.5 rounded border transition-colors"
            style={{ borderColor: 'var(--border-strong)', color: 'var(--text-mute)' }}
          >
            ROSTER
          </button>
        </div>
      </PanelSection>

      {!player ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-8 px-4 gap-3">
          <div
            className="w-17 h-17 rounded-full border-2 border-dashed flex items-center justify-center"
            style={{ borderColor: 'var(--border-strong)', width: 68, height: 68 }}
          >
            <span className="text-2xl font-bold" style={{ color: 'var(--text-mute)' }}>?</span>
          </div>
          <div className="text-center">
            <p
              className="text-base font-medium uppercase"
              style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: 'var(--text-dim)', letterSpacing: '0.04em' }}
            >
              No player selected
            </p>
            <p className="text-[10px] font-mono mt-1" style={{ color: 'var(--text-mute)' }}>
              Click a home player on pitch or open roster
            </p>
          </div>
          <button
            onClick={onOpenRoster}
            className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
            style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
          >
            Open Roster
          </button>
        </div>
      ) : (
        /* Filled state */
        <div className="flex flex-col gap-0">
          {/* Jersey + name */}
          <PanelSection>
            <div className="flex items-center gap-3">
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'var(--accent)' }}
              >
                <span
                  className="text-3xl font-bold leading-none"
                  style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: '#0a0a0a' }}
                >
                  {player.n}
                </span>
              </div>
              <div>
                <p
                  className="text-xl font-bold uppercase leading-tight"
                  style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: 'var(--text)' }}
                >
                  {player.name}
                </p>
                <p className="text-[9px] font-mono uppercase tracking-[0.12em]" style={{ color: 'var(--text-mute)' }}>
                  {player.pos}
                </p>
              </div>
            </div>
          </PanelSection>

          {/* Role */}
          <PanelSection>
            <MonoLabel>ROLE · THIS PHASE</MonoLabel>
            <p className="text-sm mt-1.5" style={{ color: 'var(--text-dim)' }}>{player.role}</p>
          </PanelSection>

          {/* Stats */}
          <PanelSection>
            <MonoLabel>MATCH STATS</MonoLabel>
            <div className="grid grid-cols-3 gap-1.5 mt-2">
              {MOCK_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg p-2 text-center"
                  style={{ background: 'var(--bg-elev-2)' }}
                >
                  <p
                    className="text-base font-bold leading-none"
                    style={{ color: 'var(--text)' }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-[9px] font-mono uppercase mt-0.5" style={{ color: 'var(--text-mute)' }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </PanelSection>

          {/* Clear / Set on ball */}
          <div className="px-4 py-3 flex gap-2">
            {selectedActorNumber !== null && (
              <button
                onClick={() => setSelectedActorNumber(null)}
                className="flex-1 py-2 rounded-lg text-xs font-medium border transition-colors"
                style={{ borderColor: 'var(--border-strong)', color: 'var(--text-mute)' }}
              >
                Clear selection
              </button>
            )}
            <button
              onClick={() => {
                if (currentScene && onBallActor) {
                  setSceneOnBall(currentScene.id, selectedActorNumber !== null ? null : onBallActorId ?? null);
                }
              }}
              className="flex-1 py-2 rounded-lg text-xs font-medium transition-colors"
              style={{ background: 'var(--bg-elev-2)', color: 'var(--text-dim)', border: `1px solid var(--border)` }}
            >
              Set on ball
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Existing panels ──────────────────────────────────────────────────────────

type AnyActor = ReturnType<typeof useEditorStore.getState>['scenes'][0]['actors'][0];

function ActorPanel({
  actor, onDelete, onToggleLock, onNumberChange, onTeamChange, onNameChange,
}: {
  actor: AnyActor;
  onDelete: () => void;
  onToggleLock: () => void;
  onNumberChange: (n: number) => void;
  onTeamChange: (t: Team) => void;
  onNameChange: (name: string) => void;
}) {
  return (
    <>
      <PanelSection>
        <MonoLabel>Selected Object</MonoLabel>
      </PanelSection>
      <div className="flex items-center justify-center py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <ActorPreview type={actor.type} team={actor.team} number={actor.number} />
      </div>
      <Row label="Type">{actor.type === 'player' ? 'Player' : actor.type === 'ball' ? 'Ball' : 'Cone'}</Row>

      {/* Team */}
      <PanelSection>
        <span className="text-xs block mb-2" style={{ color: 'var(--text-mute)' }}>Team</span>
        <div className="flex gap-1">
          {(['home', 'away', 'neutral'] as Team[]).map((t) => (
            <button
              key={t}
              onClick={() => onTeamChange(t)}
              className="flex-1 py-1.5 rounded-md text-[11px] font-medium capitalize transition-colors border"
              style={{
                background: actor.team === t ? (t === 'home' ? '#3b82f6' : t === 'away' ? '#ef4444' : '#f59e0b') : 'var(--bg-elev-2)',
                borderColor: actor.team === t ? 'transparent' : 'var(--border)',
                color: actor.team === t ? 'white' : 'var(--text-mute)',
              }}
            >
              {t === 'neutral' ? 'Neu' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </PanelSection>

      {/* Number */}
      {actor.type === 'player' && (
        <PanelSection>
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: 'var(--text-mute)' }}>Jersey #</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onNumberChange(Math.max(1, actor.number - 1))}
                className="w-6 h-6 rounded flex items-center justify-center text-sm font-bold transition-colors"
                style={{ background: 'var(--bg-elev-2)', color: 'var(--text-dim)' }}
              >−</button>
              <input
                type="number" min={1} max={99} value={actor.number}
                onChange={(e) => { const v = parseInt(e.target.value); if (!isNaN(v) && v >= 1 && v <= 99) onNumberChange(v); }}
                className="w-10 text-center rounded text-sm outline-none py-0.5"
                style={{ background: 'var(--bg-elev-2)', border: `1px solid var(--border)`, color: 'var(--text)' }}
              />
              <button
                onClick={() => onNumberChange(Math.min(99, actor.number + 1))}
                className="w-6 h-6 rounded flex items-center justify-center text-sm font-bold transition-colors"
                style={{ background: 'var(--bg-elev-2)', color: 'var(--text-dim)' }}
              >+</button>
            </div>
          </div>
        </PanelSection>
      )}

      {/* Name */}
      {actor.type === 'player' && (
        <PanelSection>
          <label className="text-xs block mb-1.5" style={{ color: 'var(--text-mute)' }}>Player Name</label>
          <input
            type="text" value={actor.name ?? ''}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g. Sexton..."
            className="w-full rounded-lg px-3 py-1.5 text-xs outline-none transition-colors"
            style={{ background: 'var(--bg-elev-2)', border: `1px solid var(--border)`, color: 'var(--text)' }}
          />
        </PanelSection>
      )}

      <div className="p-3 space-y-2 mt-auto border-t" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={onToggleLock}
          className="w-full py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ background: 'var(--bg-elev-2)', color: 'var(--text-dim)' }}
        >
          {actor.locked ? '🔓 Unlock' : '🔒 Lock position'}
        </button>
        <button
          onClick={onDelete}
          className="w-full py-2 rounded-lg text-sm font-medium border transition-colors"
          style={{ background: 'rgba(225,29,72,0.1)', borderColor: 'rgba(225,29,72,0.3)', color: '#e11d48' }}
        >
          Delete ⌫
        </button>
      </div>
    </>
  );
}

function ActorPreview({ type, team, number }: { type: string; team: string; number: number }) {
  const color = team === 'home' ? '#3b82f6' : team === 'away' ? '#ef4444' : '#f59e0b';
  if (type === 'player') {
    return (
      <svg width="52" height="52" viewBox="0 0 52 52">
        <circle cx="26" cy="26" r="22" fill={color} stroke="white" strokeWidth="2.5" />
        <text x="26" y="33" textAnchor="middle" fontSize="18" fill="white" fontWeight="bold" fontFamily="sans-serif">{number}</text>
      </svg>
    );
  }
  if (type === 'ball') {
    return (
      <svg width="52" height="52" viewBox="0 0 52 52">
        <ellipse cx="26" cy="26" rx="14" ry="20" fill="#f59e0b" stroke="white" strokeWidth="2" transform="rotate(-20 26 26)" />
      </svg>
    );
  }
  return (
    <svg width="52" height="52" viewBox="0 0 52 52">
      <polygon points="26,6 6,46 46,46" fill="#f97316" stroke="white" strokeWidth="2" />
    </svg>
  );
}

type AnyArrow = ReturnType<typeof useEditorStore.getState>['scenes'][0]['arrows'][0];

const ARROW_TYPES: { type: ArrowDrawType; label: string; desc: string }[] = [
  { type: 'run',  label: 'Run',  desc: 'Solid — player carry' },
  { type: 'pass', label: 'Pass', desc: 'Dashed — ball pass' },
  { type: 'kick', label: 'Kick', desc: 'Long dash — kick' },
];

function ArrowPanel({ arrow, onDelete, onTypeChange }: {
  arrow: AnyArrow; onDelete: () => void; onTypeChange: (t: ArrowDrawType) => void;
}) {
  return (
    <>
      <PanelSection><MonoLabel>Selected Arrow</MonoLabel></PanelSection>
      <PanelSection>
        <MonoLabel>Arrow Type</MonoLabel>
        <div className="flex flex-col gap-1 mt-2">
          {ARROW_TYPES.map(({ type, label, desc }) => (
            <button
              key={type}
              onClick={() => onTypeChange(type)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors border"
              style={{
                background: arrow.type === type ? 'var(--bg-elev-2)' : 'transparent',
                borderColor: arrow.type === type ? 'var(--border-strong)' : 'var(--border)',
                color: arrow.type === type ? 'var(--text)' : 'var(--text-mute)',
              }}
            >
              <span>{label}</span>
              <span className="ml-auto text-[10px]" style={{ color: 'var(--text-mute)' }}>{desc}</span>
            </button>
          ))}
        </div>
      </PanelSection>
      <div className="p-3 mt-auto border-t" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={onDelete}
          className="w-full py-2 rounded-lg text-sm font-medium border transition-colors"
          style={{ background: 'rgba(225,29,72,0.1)', borderColor: 'rgba(225,29,72,0.3)', color: '#e11d48' }}
        >
          Delete Arrow ⌫
        </button>
      </div>
    </>
  );
}

type AnyZone = ReturnType<typeof useEditorStore.getState>['scenes'][0]['zones'][0];

function ZonePanel({ zone, onDelete, onLabelChange }: {
  zone: AnyZone; onDelete: () => void; onLabelChange: (label: string) => void;
}) {
  return (
    <>
      <PanelSection><MonoLabel>Selected Zone</MonoLabel></PanelSection>
      <Row label="Shape">{zone.shape === 'rect' ? 'Rectangle' : 'Ellipse'}</Row>
      <PanelSection>
        <label className="text-xs block mb-1.5" style={{ color: 'var(--text-mute)' }}>Label (optional)</label>
        <input
          type="text" value={zone.label ?? ''}
          onChange={(e) => onLabelChange(e.target.value)}
          placeholder="e.g. Red Zone..."
          className="w-full rounded-lg px-3 py-1.5 text-xs outline-none"
          style={{ background: 'var(--bg-elev-2)', border: `1px solid var(--border)`, color: 'var(--text)' }}
        />
      </PanelSection>
      <div className="p-3 mt-auto border-t" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={onDelete}
          className="w-full py-2 rounded-lg text-sm font-medium border transition-colors"
          style={{ background: 'rgba(225,29,72,0.1)', borderColor: 'rgba(225,29,72,0.3)', color: '#e11d48' }}
        >
          Delete Zone ⌫
        </button>
      </div>
    </>
  );
}

type AnyScene = ReturnType<typeof useEditorStore.getState>['scenes'][0];

function SceneControlsPanel({
  scene, sceneIndex, totalScenes,
  onRename, onDurationChange, onNotesChange,
  orientation, onOrientationChange,
  pitchScale, onPitchScaleChange,
  actorScale, onActorScaleChange,
  transitionDuration, onTransitionDurationChange,
}: {
  scene: AnyScene | undefined; sceneIndex: number; totalScenes: number;
  onRename: (name: string) => void; onDurationChange: (ms: number) => void; onNotesChange: (n: string) => void;
  orientation: 'landscape' | 'portrait'; onOrientationChange: (o: 'landscape' | 'portrait') => void;
  pitchScale: number; onPitchScaleChange: (s: number) => void;
  actorScale: number; onActorScaleChange: (s: number) => void;
  transitionDuration: number; onTransitionDurationChange: (ms: number) => void;
}) {
  if (!scene) return null;
  return (
    <>
      <PanelSection>
        <MonoLabel>Scene {sceneIndex + 1} of {totalScenes}</MonoLabel>
      </PanelSection>
      <PanelSection>
        <label className="text-[11px] block mb-1.5" style={{ color: 'var(--text-mute)' }}>Scene Name</label>
        <input
          value={scene.name}
          onChange={(e) => onRename(e.target.value)}
          className="w-full rounded-lg px-3 py-1.5 text-sm outline-none"
          style={{ background: 'var(--bg-elev-2)', border: `1px solid var(--border)`, color: 'var(--text)' }}
        />
      </PanelSection>
      <PanelSection>
        <label className="text-[11px] block mb-1.5" style={{ color: 'var(--text-mute)' }}>Coach Cue</label>
        <input
          value={scene.cue ?? ''}
          onChange={(e) => useEditorStore.getState().setSceneCue(scene.id, e.target.value)}
          placeholder="e.g. Strike off the top..."
          className="w-full rounded-lg px-3 py-1.5 text-xs outline-none"
          style={{ background: 'var(--bg-elev-2)', border: `1px solid var(--border)`, color: 'var(--text)' }}
        />
      </PanelSection>
      <PanelSection>
        <label className="text-[11px] block mb-1.5" style={{ color: 'var(--text-mute)' }}>Coaching Notes</label>
        <textarea
          value={scene.notes ?? ''}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="e.g. Scrum half feeds off the base..."
          rows={3}
          className="w-full rounded-lg px-3 py-2 text-xs outline-none resize-none"
          style={{ background: 'var(--bg-elev-2)', border: `1px solid var(--border)`, color: 'var(--text)' }}
        />
      </PanelSection>
      <SliderRow label="Scene Duration" value={scene.duration} min={400} max={5000} step={100}
        format={(v) => `${(v / 1000).toFixed(1)}s`} onChange={onDurationChange} />
      <PanelSection>
        <p className="text-[11px] mb-2" style={{ color: 'var(--text-mute)' }}>Pitch Orientation</p>
        <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={() => onOrientationChange('landscape')}
            className="flex-1 py-2 text-xs font-medium transition-colors"
            style={{ background: orientation === 'landscape' ? 'var(--accent)' : 'var(--bg-elev-2)', color: orientation === 'landscape' ? '#0a0a0a' : 'var(--text-mute)' }}
          >
            Landscape
          </button>
          <button
            onClick={() => onOrientationChange('portrait')}
            className="flex-1 py-2 text-xs font-medium transition-colors"
            style={{ background: orientation === 'portrait' ? 'var(--accent)' : 'var(--bg-elev-2)', color: orientation === 'portrait' ? '#0a0a0a' : 'var(--text-mute)' }}
          >
            Portrait
          </button>
        </div>
      </PanelSection>
      <SliderRow label="Pitch Size" value={pitchScale} min={0.4} max={1.0} step={0.02}
        format={(v) => `${Math.round(v * 100)}%`} onChange={onPitchScaleChange} />
      <SliderRow label="Player Size" value={actorScale} min={0.5} max={2.0} step={0.05}
        format={(v) => `${Math.round(v * 100)}%`} onChange={onActorScaleChange} />
      <SliderRow label="Transition" value={transitionDuration} min={0} max={1200} step={50}
        format={(v) => v === 0 ? 'Cut' : `${(v / 1000).toFixed(1)}s`} onChange={onTransitionDurationChange} />
    </>
  );
}

// ─── Main RightSidebar ────────────────────────────────────────────────────────

interface RightSidebarProps {
  onOpenRoster: () => void;
}

export default function RightSidebar({ onOpenRoster }: RightSidebarProps) {
  const {
    scenes, currentSceneId,
    selectedActorId, deleteActor, toggleActorLock, updateActorNumber, updateActorTeam, updateActorName,
    renameScene, updateSceneDuration, updateSceneNotes,
    orientation, setOrientation,
    pitchScale, setPitchScale,
    actorScale, setActorScale,
    transitionDuration, setTransitionDuration,
    selectedArrowId, deletePlayArrow, updateArrowType,
    selectedZoneId, deleteZone, updateZoneLabel,
  } = useEditorStore();

  const [tab, setTab] = useState<'ball' | 'scene'>('ball');

  const currentScene = scenes.find((s) => s.id === currentSceneId);
  const selectedActor = currentScene?.actors?.find((a) => a.id === selectedActorId);
  const selectedArrow = currentScene?.arrows?.find((a) => a.id === selectedArrowId);
  const selectedZone  = currentScene?.zones?.find((z) => z.id === selectedZoneId);

  // If something is selected, show property panels
  const showProperty = selectedActor || selectedArrow || selectedZone;

  return (
    <aside
      className="w-[280px] shrink-0 flex flex-col overflow-hidden border-l"
      style={{ background: 'var(--bg-elev)', borderColor: 'var(--border)' }}
    >
      {showProperty ? (
        <div className="flex-1 overflow-y-auto sidebar-scroll flex flex-col">
          {selectedActor ? (
            <ActorPanel
              actor={selectedActor}
              onDelete={() => deleteActor(selectedActor.id)}
              onToggleLock={() => toggleActorLock(selectedActor.id)}
              onNumberChange={(n) => updateActorNumber(selectedActor.id, n)}
              onTeamChange={(t) => updateActorTeam(selectedActor.id, t)}
              onNameChange={(name) => updateActorName(selectedActor.id, name)}
            />
          ) : selectedArrow ? (
            <ArrowPanel
              arrow={selectedArrow}
              onDelete={() => deletePlayArrow(selectedArrow.id)}
              onTypeChange={(t) => updateArrowType(selectedArrow.id, t)}
            />
          ) : selectedZone ? (
            <ZonePanel
              zone={selectedZone}
              onDelete={() => deleteZone(selectedZone.id)}
              onLabelChange={(label) => updateZoneLabel(selectedZone.id, label)}
            />
          ) : null}
        </div>
      ) : (
        <>
          {/* Tab switcher */}
          <div className="flex border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={() => setTab('ball')}
              className="flex-1 py-2.5 text-[10px] font-mono font-medium tracking-[0.18em] uppercase transition-colors"
              style={{
                color: tab === 'ball' ? 'var(--accent)' : 'var(--text-mute)',
                borderBottom: tab === 'ball' ? `2px solid var(--accent)` : '2px solid transparent',
              }}
            >
              On The Ball
            </button>
            <button
              onClick={() => setTab('scene')}
              className="flex-1 py-2.5 text-[10px] font-mono font-medium tracking-[0.18em] uppercase transition-colors"
              style={{
                color: tab === 'scene' ? 'var(--accent)' : 'var(--text-mute)',
                borderBottom: tab === 'scene' ? `2px solid var(--accent)` : '2px solid transparent',
              }}
            >
              Scene
            </button>
          </div>

          <div className="flex-1 overflow-y-auto sidebar-scroll flex flex-col">
            {tab === 'ball' ? (
              <OnTheBallPanel onOpenRoster={onOpenRoster} />
            ) : (
              <SceneControlsPanel
                scene={currentScene}
                sceneIndex={scenes.findIndex((s) => s.id === currentSceneId)}
                totalScenes={scenes.length}
                onRename={(name) => currentScene && renameScene(currentScene.id, name)}
                onDurationChange={(d) => currentScene && updateSceneDuration(currentScene.id, d)}
                onNotesChange={(n) => currentScene && updateSceneNotes(currentScene.id, n)}
                orientation={orientation}
                onOrientationChange={setOrientation}
                pitchScale={pitchScale}
                onPitchScaleChange={setPitchScale}
                actorScale={actorScale}
                onActorScaleChange={setActorScale}
                transitionDuration={transitionDuration}
                onTransitionDurationChange={setTransitionDuration}
              />
            )}
          </div>
        </>
      )}
    </aside>
  );
}
