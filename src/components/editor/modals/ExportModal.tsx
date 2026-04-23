'use client';

import { useEffect } from 'react';

interface ExportModalProps {
  onClose: () => void;
}

const FORMATS = [
  { id: 'mp4',   label: 'Video MP4',       icon: '🎬' },
  { id: 'pdf',   label: 'PDF Playbook',    icon: '📄' },
  { id: 'seq',   label: 'Image Sequence',  icon: '🖼' },
  { id: 'gif',   label: 'Animated GIF',    icon: '✨' },
];

const QUALITIES = ['720p', '1080p', '4K'] as const;

export default function ExportModal({ onClose }: ExportModalProps) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="w-[560px] rounded-2xl border flex flex-col overflow-hidden"
        style={{ background: 'var(--bg-elev)', borderColor: 'var(--border-strong)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div>
            <p className="text-[10px] font-mono font-medium tracking-[0.18em] uppercase" style={{ color: 'var(--accent)' }}>EXPORT</p>
            <p className="font-['var(--font-oswald)',Oswald,sans-serif] text-lg font-semibold uppercase tracking-wide" style={{ color: 'var(--text)' }}>
              Export Play
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors"
            style={{ background: 'var(--bg-elev-2)', color: 'var(--text-mute)' }}
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Format grid */}
          <div>
            <p className="text-[10px] font-mono font-medium tracking-[0.18em] uppercase mb-3" style={{ color: 'var(--text-mute)' }}>FORMAT</p>
            <div className="grid grid-cols-2 gap-2">
              {FORMATS.map((f, i) => (
                <button
                  key={f.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all"
                  style={{
                    background: i === 0 ? 'var(--bg-elev-2)' : 'transparent',
                    borderColor: i === 0 ? 'var(--accent)' : 'var(--border)',
                    color: 'var(--text-dim)',
                  }}
                >
                  <span className="text-xl">{f.icon}</span>
                  <span className="text-sm font-medium">{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quality */}
          <div>
            <p className="text-[10px] font-mono font-medium tracking-[0.18em] uppercase mb-3" style={{ color: 'var(--text-mute)' }}>QUALITY</p>
            <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
              {QUALITIES.map((q, i) => (
                <button
                  key={q}
                  className="flex-1 py-2 text-sm font-medium transition-colors"
                  style={{
                    background: i === 1 ? 'var(--accent)' : 'var(--bg-elev-2)',
                    color: i === 1 ? '#0a0a0a' : 'var(--text-mute)',
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Includes */}
          <div>
            <p className="text-[10px] font-mono font-medium tracking-[0.18em] uppercase mb-3" style={{ color: 'var(--text-mute)' }}>INCLUDE</p>
            <div className="space-y-2">
              {['Arrow annotations', 'Coach cue overlay'].map((item) => (
                <label key={item} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-[var(--accent)]" />
                  <span className="text-sm" style={{ color: 'var(--text-dim)' }}>{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs font-mono" style={{ color: 'var(--text-mute)' }}>Est. size: ~24 MB</p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm border transition-colors"
              style={{ borderColor: 'var(--border-strong)', color: 'var(--text-mute)' }}
            >
              Cancel
            </button>
            <button
              onClick={() => { window.dispatchEvent(new Event('export-png')); onClose(); }}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              style={{ background: 'var(--accent)', color: '#0a0a0a' }}
            >
              Generate Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
