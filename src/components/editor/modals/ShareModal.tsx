'use client';

import { useEffect, useState } from 'react';

interface ShareModalProps {
  onClose: () => void;
}

const STAFF = [
  { name: 'Andy Farrell', role: 'Head Coach' },
  { name: 'Simon Easterby', role: 'Defence Coach' },
  { name: 'Mike Catt', role: 'Attack Coach' },
  { name: "Paul O'Connell", role: 'Forwards Coach' },
];

const CHANNELS = [
  { id: 'ipad',  label: 'Team iPad',     icon: '📱' },
  { id: 'slack', label: 'Slack · #attack', icon: '💬' },
  { id: 'email', label: 'Email squad',   icon: '✉️' },
  { id: 'qr',    label: 'QR code',       icon: '⬛' },
];

const SHARE_URL = 'https://play.bk/IRE-L04/off-the-top-9';

export default function ShareModal({ onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleCopy = () => {
    navigator.clipboard.writeText(SHARE_URL).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="w-[520px] rounded-2xl border flex flex-col overflow-hidden"
        style={{ background: 'var(--bg-elev)', borderColor: 'var(--border-strong)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div>
            <p className="text-[10px] font-mono font-medium tracking-[0.18em] uppercase" style={{ color: 'var(--accent)' }}>SHARE</p>
            <p className="text-lg font-semibold uppercase tracking-wide" style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', color: 'var(--text)' }}>
              Share Play
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
          {/* URL + Copy */}
          <div>
            <p className="text-[10px] font-mono font-medium tracking-[0.18em] uppercase mb-2" style={{ color: 'var(--text-mute)' }}>LINK</p>
            <div className="flex gap-2">
              <div
                className="flex-1 px-3 py-2 rounded-lg text-xs font-mono border"
                style={{ background: 'var(--bg-elev-2)', borderColor: 'var(--border)', color: 'var(--text-dim)' }}
              >
                {SHARE_URL}
              </div>
              <button
                onClick={handleCopy}
                className="px-3 py-2 rounded-lg text-xs font-semibold transition-all min-w-[72px]"
                style={{ background: 'var(--accent)', color: '#0a0a0a' }}
              >
                {copied ? 'Copied ✓' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Staff list */}
          <div>
            <p className="text-[10px] font-mono font-medium tracking-[0.18em] uppercase mb-2" style={{ color: 'var(--text-mute)' }}>STAFF</p>
            <div className="space-y-1">
              {STAFF.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg border"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg-elev-2)' }}
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{s.name}</p>
                    <p className="text-xs font-mono" style={{ color: 'var(--text-mute)' }}>{s.role}</p>
                  </div>
                  <button
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
                    style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
                  >
                    Send
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Channels */}
          <div>
            <p className="text-[10px] font-mono font-medium tracking-[0.18em] uppercase mb-2" style={{ color: 'var(--text-mute)' }}>CHANNELS</p>
            <div className="grid grid-cols-2 gap-2">
              {CHANNELS.map((c) => (
                <button
                  key={c.id}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl border text-sm transition-colors"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg-elev-2)', color: 'var(--text-dim)' }}
                >
                  <span>{c.icon}</span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
