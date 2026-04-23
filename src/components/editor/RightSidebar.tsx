'use client';

import useEditorStore from '@/store/useEditorStore';
import type { ArrowDrawType, Team } from '@/types';

export default function RightSidebar() {
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

  const currentScene = scenes.find((s) => s.id === currentSceneId);
  const selectedActor = currentScene?.actors?.find((a) => a.id === selectedActorId);
  const selectedArrow = currentScene?.arrows?.find((a) => a.id === selectedArrowId);
  const selectedZone  = currentScene?.zones?.find((z) => z.id === selectedZoneId);

  return (
    <aside className="w-60 bg-zinc-900 border-l border-zinc-800 flex flex-col shrink-0 overflow-y-auto">
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
      ) : (
        <ScenePanel
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
    </aside>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function PanelHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 py-3 border-b border-zinc-800">
      <p className="text-[10px] font-semibold tracking-widest text-zinc-500 uppercase">{children}</p>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800/50">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="text-xs text-zinc-200 font-medium">{children}</span>
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
    <div className="px-4 py-2.5 border-b border-zinc-800/50">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] text-zinc-500">{label}</span>
        <span className="text-[11px] font-mono text-zinc-300">{format(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-500 h-1"
      />
    </div>
  );
}

// ─── Actor panel ──────────────────────────────────────────────────────────────

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
  const teamColor = actor.team === 'home' ? '#3b82f6' : actor.team === 'away' ? '#ef4444' : '#f59e0b';
  const typeLabel = actor.type === 'player' ? 'Player' : actor.type === 'ball' ? 'Ball' : 'Cone';

  return (
    <>
      <PanelHeader>Selected Object</PanelHeader>
      <div className="flex items-center justify-center py-5 border-b border-zinc-800 bg-zinc-950/30">
        <ActorPreview type={actor.type} team={actor.team} number={actor.number} />
      </div>
      <Row label="Type">{typeLabel}</Row>

      {/* Team selector */}
      <div className="px-4 py-2.5 border-b border-zinc-800/50">
        <span className="text-xs text-zinc-500 block mb-2">Team</span>
        <div className="flex gap-1">
          {(['home', 'away', 'neutral'] as Team[]).map((t) => (
            <button
              key={t}
              onClick={() => onTeamChange(t)}
              className={`flex-1 py-1.5 rounded-md text-[11px] font-medium capitalize transition-colors border ${
                actor.team === t
                  ? t === 'home'
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : t === 'away'
                      ? 'bg-red-600 border-red-500 text-white'
                      : 'bg-amber-600 border-amber-500 text-white'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {t === 'neutral' ? 'Neu' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Number editor */}
      {actor.type === 'player' && (
        <div className="px-4 py-2.5 border-b border-zinc-800/50">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">Jersey #</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onNumberChange(Math.max(1, actor.number - 1))}
                className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-bold flex items-center justify-center"
              >−</button>
              <input
                type="number"
                min={1} max={99}
                value={actor.number}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  if (!isNaN(v) && v >= 1 && v <= 99) onNumberChange(v);
                }}
                className="w-10 text-center bg-zinc-800 border border-zinc-700 rounded text-sm text-zinc-100 outline-none focus:border-blue-500 py-0.5"
              />
              <button
                onClick={() => onNumberChange(Math.min(99, actor.number + 1))}
                className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-bold flex items-center justify-center"
              >+</button>
            </div>
          </div>
        </div>
      )}

      {/* Player name */}
      {actor.type === 'player' && (
        <div className="px-4 py-2.5 border-b border-zinc-800/50">
          <label className="text-xs text-zinc-500 block mb-1.5">Player Name</label>
          <input
            type="text"
            value={actor.name ?? ''}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g. Sexton, Larmour..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100 outline-none focus:border-blue-500 transition-colors placeholder-zinc-600"
          />
        </div>
      )}

      <Row label="Locked">{actor.locked ? '🔒 Yes' : 'No'}</Row>
      <div className="p-3 space-y-2 mt-auto border-t border-zinc-800">
        <button
          onClick={onToggleLock}
          className="w-full py-2 rounded-lg text-sm font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
        >
          {actor.locked ? '🔓 Unlock' : '🔒 Lock position'}
        </button>
        <button
          onClick={onDelete}
          className="w-full py-2 rounded-lg text-sm font-medium bg-red-950/50 hover:bg-red-900/60 text-red-400 hover:text-red-300 border border-red-900/40 transition-colors"
        >
          Delete <kbd className="ml-1 text-[10px] text-red-600 font-mono">⌫</kbd>
        </button>
      </div>

      {/* Preview updates live with team colour */}
      <div className="hidden" style={{ color: teamColor }} />
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

// ─── Arrow panel ──────────────────────────────────────────────────────────────

type AnyArrow = ReturnType<typeof useEditorStore.getState>['scenes'][0]['arrows'][0];

const ARROW_TYPES: { type: ArrowDrawType; label: string; desc: string }[] = [
  { type: 'run',  label: 'Run',  desc: 'Solid — player carry' },
  { type: 'pass', label: 'Pass', desc: 'Dashed — ball pass' },
  { type: 'kick', label: 'Kick', desc: 'Long dash — kick' },
];

function ArrowPanel({ arrow, onDelete, onTypeChange }: {
  arrow: AnyArrow;
  onDelete: () => void;
  onTypeChange: (t: ArrowDrawType) => void;
}) {
  const previewColor = arrow.type === 'kick' ? '#fbbf24' : 'white';
  const dash = arrow.type === 'pass' ? '8 6' : arrow.type === 'kick' ? '14 7' : undefined;

  return (
    <>
      <PanelHeader>Selected Arrow</PanelHeader>

      {/* Visual preview */}
      <div className="flex items-center justify-center py-5 border-b border-zinc-800 bg-zinc-950/30">
        <svg width="80" height="30" viewBox="0 0 80 30">
          <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={previewColor} />
            </marker>
          </defs>
          <line x1="8" y1="15" x2="68" y2="15"
            stroke={previewColor} strokeWidth="2.5"
            strokeDasharray={dash}
            markerEnd="url(#arrowhead)"
          />
        </svg>
      </div>

      {/* Type switcher */}
      <div className="px-4 py-3 border-b border-zinc-800/50">
        <span className="text-[11px] text-zinc-500 block mb-2">Arrow type</span>
        <div className="flex flex-col gap-1">
          {ARROW_TYPES.map(({ type, label, desc }) => (
            <button
              key={type}
              onClick={() => onTypeChange(type)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors border ${
                arrow.type === type
                  ? 'bg-zinc-700 border-zinc-500 text-zinc-100'
                  : 'bg-zinc-800/60 border-zinc-700/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              <ArrowTypeIcon type={type} />
              <span>{label}</span>
              <span className="ml-auto text-zinc-600 text-[10px]">{desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-3 text-[11px] text-zinc-600 leading-relaxed border-b border-zinc-800/50">
        Drag the midpoint handle on the pitch to curve this arrow.
      </div>

      <div className="p-3 mt-auto border-t border-zinc-800">
        <button
          onClick={onDelete}
          className="w-full py-2 rounded-lg text-sm font-medium bg-red-950/50 hover:bg-red-900/60 text-red-400 hover:text-red-300 border border-red-900/40 transition-colors"
        >
          Delete Arrow <kbd className="ml-1 text-[10px] text-red-600 font-mono">⌫</kbd>
        </button>
      </div>
    </>
  );
}

function ArrowTypeIcon({ type }: { type: ArrowDrawType }) {
  const color = type === 'kick' ? '#fbbf24' : 'rgba(255,255,255,0.7)';
  const dash = type === 'pass' ? '3 2' : type === 'kick' ? '5 3' : undefined;
  return (
    <svg width="22" height="10" viewBox="0 0 22 10" fill="none">
      <line x1="2" y1="5" x2="16" y2="5" stroke={color} strokeWidth="1.8" strokeDasharray={dash} strokeLinecap="round" />
      <path d="M13 2 L18 5 L13 8" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Zone panel ───────────────────────────────────────────────────────────────

type AnyZone = ReturnType<typeof useEditorStore.getState>['scenes'][0]['zones'][0];

function ZonePanel({ zone, onDelete, onLabelChange }: {
  zone: AnyZone;
  onDelete: () => void;
  onLabelChange: (label: string) => void;
}) {
  const shapeLabel = zone.shape === 'rect' ? 'Rectangle' : 'Ellipse';
  const fillColor = zone.color.replace(/[\d.]+\)$/, '0.35)');
  const borderColor = zone.color;

  return (
    <>
      <PanelHeader>Selected Zone</PanelHeader>

      {/* Visual preview */}
      <div className="flex items-center justify-center py-5 border-b border-zinc-800 bg-zinc-950/30">
        <svg width="80" height="44" viewBox="0 0 80 44">
          {zone.shape === 'rect'
            ? <rect x="8" y="8" width="64" height="28" rx="3" fill={fillColor} stroke={borderColor} strokeWidth="1.5" />
            : <ellipse cx="40" cy="22" rx="32" ry="14" fill={fillColor} stroke={borderColor} strokeWidth="1.5" />
          }
        </svg>
      </div>

      <Row label="Shape">{shapeLabel}</Row>

      {/* Label */}
      <div className="px-4 py-2.5 border-b border-zinc-800/50">
        <label className="text-xs text-zinc-500 block mb-1.5">Label (optional)</label>
        <input
          type="text"
          value={zone.label ?? ''}
          onChange={(e) => onLabelChange(e.target.value)}
          placeholder="e.g. Red Zone, Kick Chase..."
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-100 outline-none focus:border-blue-500 transition-colors placeholder-zinc-600"
        />
      </div>

      <div className="px-4 py-3 text-[11px] text-zinc-600 leading-relaxed border-b border-zinc-800/50">
        Drag the zone to reposition it on the pitch.
      </div>

      <div className="p-3 mt-auto border-t border-zinc-800">
        <button
          onClick={onDelete}
          className="w-full py-2 rounded-lg text-sm font-medium bg-red-950/50 hover:bg-red-900/60 text-red-400 hover:text-red-300 border border-red-900/40 transition-colors"
        >
          Delete Zone <kbd className="ml-1 text-[10px] text-red-600 font-mono">⌫</kbd>
        </button>
      </div>
    </>
  );
}

// ─── Scene panel ──────────────────────────────────────────────────────────────

type AnyScene = ReturnType<typeof useEditorStore.getState>['scenes'][0];

function ScenePanel({
  scene, sceneIndex, totalScenes,
  onRename, onDurationChange, onNotesChange,
  orientation, onOrientationChange,
  pitchScale, onPitchScaleChange,
  actorScale, onActorScaleChange,
  transitionDuration, onTransitionDurationChange,
}: {
  scene: AnyScene | undefined;
  sceneIndex: number;
  totalScenes: number;
  onRename: (name: string) => void;
  onDurationChange: (ms: number) => void;
  onNotesChange: (n: string) => void;
  orientation: 'landscape' | 'portrait';
  onOrientationChange: (o: 'landscape' | 'portrait') => void;
  pitchScale: number;
  onPitchScaleChange: (s: number) => void;
  actorScale: number;
  onActorScaleChange: (s: number) => void;
  transitionDuration: number;
  onTransitionDurationChange: (ms: number) => void;
}) {
  if (!scene) return null;

  const homeCount = scene.actors.filter((a) => a.team === 'home').length;
  const awayCount = scene.actors.filter((a) => a.team === 'away').length;
  const ballCount = scene.actors.filter((a) => a.type === 'ball').length;
  const coneCount = scene.actors.filter((a) => a.type === 'cone').length;

  return (
    <>
      <PanelHeader>Scene {sceneIndex + 1} of {totalScenes}</PanelHeader>

      {/* Scene name */}
      <div className="px-4 py-3 border-b border-zinc-800/60">
        <label className="text-[11px] text-zinc-500 mb-1.5 block">Scene Name</label>
        <input
          value={scene.name}
          onChange={(e) => onRename(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-100 outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Scene notes */}
      <div className="px-4 py-3 border-b border-zinc-800/60">
        <label className="text-[11px] text-zinc-500 mb-1.5 block">Coaching Notes</label>
        <textarea
          value={scene.notes ?? ''}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="e.g. Scrum half feeds off the base..."
          rows={3}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none focus:border-blue-500 transition-colors resize-none placeholder-zinc-600"
        />
      </div>

      {/* Playback duration */}
      <SliderRow
        label="Scene Duration"
        value={scene.duration}
        min={400} max={5000} step={100}
        format={(v) => `${(v / 1000).toFixed(1)}s`}
        onChange={onDurationChange}
      />

      {/* Actor counts */}
      <div className="px-4 py-3 border-b border-zinc-800/60">
        <p className="text-[11px] text-zinc-500 mb-2">Actors on pitch</p>
        <div className="grid grid-cols-2 gap-1.5">
          <CountBadge label="Home"  count={homeCount} color="bg-blue-900/50 text-blue-300 border-blue-800/40" />
          <CountBadge label="Away"  count={awayCount} color="bg-red-900/50 text-red-300 border-red-800/40" />
          <CountBadge label="Ball"  count={ballCount} color="bg-amber-900/50 text-amber-300 border-amber-800/40" />
          <CountBadge label="Cone"  count={coneCount} color="bg-orange-900/50 text-orange-300 border-orange-800/40" />
        </div>
      </div>

      {/* ── Canvas controls ─────────────────────────────── */}
      <PanelHeader>Canvas</PanelHeader>

      {/* Orientation */}
      <div className="px-4 py-3 border-b border-zinc-800/50">
        <p className="text-[11px] text-zinc-500 mb-2">Pitch Orientation</p>
        <div className="flex rounded-lg overflow-hidden border border-zinc-700">
          <button
            onClick={() => onOrientationChange('landscape')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${
              orientation === 'landscape' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <LandscapeIcon /> Landscape
          </button>
          <button
            onClick={() => onOrientationChange('portrait')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${
              orientation === 'portrait' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <PortraitIcon /> Portrait
          </button>
        </div>
      </div>

      <SliderRow label="Pitch Size"   value={pitchScale}         min={0.4}  max={1.0}  step={0.02} format={(v) => `${Math.round(v * 100)}%`}          onChange={onPitchScaleChange} />
      <SliderRow label="Player Size"  value={actorScale}         min={0.5}  max={2.0}  step={0.05} format={(v) => `${Math.round(v * 100)}%`}          onChange={onActorScaleChange} />
      <SliderRow label="Transition"   value={transitionDuration} min={0}    max={1200} step={50}   format={(v) => v === 0 ? 'Cut' : `${(v / 1000).toFixed(1)}s`}    onChange={onTransitionDurationChange} />

      {/* Tips */}
      <div className="p-4 mt-auto">
        <div className="bg-zinc-800/40 rounded-lg p-3 space-y-1.5">
          <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Tips</p>
          <p className="text-[11px] text-zinc-600 leading-relaxed">Click any object to see its properties.</p>
          <p className="text-[11px] text-zinc-600 leading-relaxed">Duplicate a scene, then move players for the next phase.</p>
          <p className="text-[11px] text-zinc-600 leading-relaxed">
            <kbd className="px-1 py-0.5 bg-zinc-700 rounded text-zinc-400 font-mono">Space</kbd> to play ·{' '}
            <kbd className="px-1 py-0.5 bg-zinc-700 rounded text-zinc-400 font-mono">⌫</kbd> to delete
          </p>
        </div>
      </div>
    </>
  );
}

function CountBadge({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs font-medium ${color}`}>
      <span className="text-zinc-400">{label}</span>
      <span className="font-bold">{count}</span>
    </div>
  );
}

function LandscapeIcon() {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="1" width="12" height="8" rx="1" />
      <line x1="5" y1="1" x2="5" y2="9" strokeOpacity="0.5" />
      <line x1="9" y1="1" x2="9" y2="9" strokeOpacity="0.5" />
    </svg>
  );
}

function PortraitIcon() {
  return (
    <svg width="10" height="14" viewBox="0 0 10 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="1" width="8" height="12" rx="1" />
      <line x1="1" y1="5" x2="9" y2="5" strokeOpacity="0.5" />
      <line x1="1" y1="9" x2="9" y2="9" strokeOpacity="0.5" />
    </svg>
  );
}
