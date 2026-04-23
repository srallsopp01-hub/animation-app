/* Figma-style pan/zoom design canvas.
   Wraps artboards in a dark infinite canvas — wheel to zoom, drag to pan.
   Each artboard is labeled and has a fixed size; the canvas auto-fits on load. */

const { useState: useStateDC, useEffect: useEffectDC, useRef: useRefDC, useCallback: useCallbackDC } = React;

/* ── DesignCanvas ── */
function DesignCanvas({ children, bg = '#111318' }) {
  const canvasRef = useRefDC(null);
  const [transform, setTransform] = useStateDC({ x: 0, y: 0, scale: 1 });
  const drag = useRefDC(null);

  useEffectDC(() => {
    /* Initial fit: center artboards in viewport with 80% zoom */
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    setTransform({ x: vw * 0.05, y: 80, scale: 0.72 });
  }, []);

  const onWheel = useCallbackDC((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.92 : 1.09;
    setTransform(t => {
      const newScale = Math.max(0.12, Math.min(4, t.scale * delta));
      const rect = canvasRef.current.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      return {
        x: mx - (mx - t.x) * (newScale / t.scale),
        y: my - (my - t.y) * (newScale / t.scale),
        scale: newScale,
      };
    });
  }, []);

  const onMouseDown = useCallbackDC((e) => {
    if (e.button !== 1 && !e.altKey) return;
    e.preventDefault();
    drag.current = { startX: e.clientX, startY: e.clientY, tx: transform.x, ty: transform.y };
  }, [transform]);

  const onMouseMove = useCallbackDC((e) => {
    if (!drag.current) return;
    setTransform(t => ({
      ...t,
      x: drag.current.tx + e.clientX - drag.current.startX,
      y: drag.current.ty + e.clientY - drag.current.startY,
    }));
  }, []);

  const onMouseUp = useCallbackDC(() => { drag.current = null; }, []);

  useEffectDC(() => {
    const el = canvasRef.current;
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  const pct = Math.round(transform.scale * 100);

  return (
    <div
      ref={canvasRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      style={{
        width: '100vw', height: '100vh', overflow: 'hidden',
        background: bg,
        backgroundImage: `radial-gradient(circle, #2a2d35 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
        cursor: drag.current ? 'grabbing' : 'default',
        userSelect: 'none',
        position: 'relative',
      }}>
      {/* Canvas toolbar */}
      <div style={{
        position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: 8, zIndex: 100,
        background: '#1e2229', border: '1px solid #2d333d', borderRadius: 6,
        padding: '6px 12px', boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
      }}>
        <span style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 11, color: '#8b949e', letterSpacing: '0.12em' }}>
          PHASEBOARD DESIGN CANVAS
        </span>
        <div style={{ width: 1, height: 14, background: '#2d333d', margin: '0 4px' }} />
        <button onClick={() => setTransform(t => ({ ...t, scale: Math.min(4, t.scale * 1.15) }))} style={toolBtn}>+</button>
        <span style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 10, color: '#8b949e', minWidth: 38, textAlign: 'center' }}>{pct}%</span>
        <button onClick={() => setTransform(t => ({ ...t, scale: Math.max(0.12, t.scale * 0.87) }))} style={toolBtn}>−</button>
        <button onClick={() => setTransform({ x: window.innerWidth * 0.05, y: 80, scale: 0.72 })} style={{ ...toolBtn, marginLeft: 4, fontSize: 9, letterSpacing: '0.1em' }}>FIT</button>
        <div style={{ width: 1, height: 14, background: '#2d333d', margin: '0 4px' }} />
        <span style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 9, color: '#4d5566', letterSpacing: '0.08em' }}>Alt+drag or wheel-btn to pan</span>
      </div>

      {/* Artboard container */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
        transformOrigin: '0 0',
      }}>
        {children}
      </div>
    </div>
  );
}

const toolBtn = {
  width: 24, height: 24, background: 'transparent', border: '1px solid #2d333d',
  color: '#8b949e', borderRadius: 3, cursor: 'pointer', fontSize: 14,
  display: 'grid', placeItems: 'center', fontFamily: 'sans-serif',
};

/* ── DCSection ── group of artboards under a section heading */
function DCSection({ title, children, x = 0, y = 0 }) {
  return (
    <div style={{ position: 'absolute', left: x, top: y }}>
      <div style={{
        fontFamily: '"JetBrains Mono",monospace', fontSize: 11,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        color: '#484f58', marginBottom: 16,
      }}>{title}</div>
      <div style={{ display: 'flex', gap: 60, alignItems: 'flex-start' }}>
        {children}
      </div>
    </div>
  );
}

/* ── DCArtboard ── labeled artboard wrapper */
function DCArtboard({ label, w, h, children, note }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{
        fontFamily: '"JetBrains Mono",monospace', fontSize: 10,
        letterSpacing: '0.14em', color: '#6e7681', textTransform: 'uppercase',
      }}>{label} <span style={{ color: '#4d5566' }}>· {w}×{h}</span></div>
      <div style={{
        width: w, height: h,
        boxShadow: '0 0 0 1px #30363d, 0 8px 40px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        borderRadius: 2,
        position: 'relative',
      }}>
        {children}
      </div>
      {note && (
        <div style={{
          fontFamily: '"JetBrains Mono",monospace', fontSize: 9,
          color: '#4d5566', letterSpacing: '0.1em', maxWidth: w,
          lineHeight: 1.5,
        }}>{note}</div>
      )}
    </div>
  );
}

Object.assign(window, { DesignCanvas, DCSection, DCArtboard });
