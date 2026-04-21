'use client';
import { useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

const TOTAL_FRAMES = 240;

// Beat definitions: [startPct, endPct]
const BEATS = {
  HERO: [0, 0.15],
  CRISIS: [0.15, 0.40],
  SOLUTION: [0.40, 0.65],
  TECH: [0.65, 0.85],
  FINALE: [0.85, 1.00],
};

function beatOpacity(progress, beat) {
  const [start, end] = BEATS[beat];
  const duration = end - start;
  const fadeZone = Math.min(0.04, duration * 0.25);
  if (progress < start - fadeZone || progress > end + fadeZone) return 0;
  if (progress < start) return (progress - (start - fadeZone)) / fadeZone;
  if (progress > end) return 1 - (progress - end) / fadeZone;
  return 1;
}

// Animated counter that increments as opacity rises
function StatCounter({ target, suffix, label }) {
  const shadow = '0 2px 14px rgba(255,255,255,0.9), 0 1px 3px rgba(0,0,0,0.1)';
  return (
    <div className="stat-tile">
      <div className="stat-value" style={{ textShadow: shadow }}>{target}{suffix}</div>
      <div className="stat-label" style={{ textShadow: shadow }}>{label}</div>
    </div>
  );
}

export default function ScrollCanvasHero() {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const loadedRef = useRef(0);
  const rafRef = useRef(null);
  const progressRef = useRef(0);

  // Beat opacity refs (DOM manipulation for perf)
  const beatRefs = useRef({});

  /* ── 1. Preload all frames ── */
  useEffect(() => {
    const images = [];
    framesRef.current = images;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new window.Image();
      const idx = i;
      img.onload = () => {
        loadedRef.current++;
      };
      img.src = `/frames/frame_${String(idx).padStart(3, '0')}.jpg`;
      images.push(img);
    }

    return () => {
      // cancel any pending RAF on unmount
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* ── 2. Draw frame to canvas ── */
  const drawFrame = useCallback((frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = framesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const { width: cw, height: ch } = canvas;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // Fill background first (matching JPG background)
    ctx.fillStyle = '#F3E8F5';
    ctx.fillRect(0, 0, cw, ch);

    // Cover-fit: centre the image
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);
  }, []);

  /* ── 3. Resize canvas to match viewport ── */
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const fi = Math.round(progressRef.current * (TOTAL_FRAMES - 1));
      drawFrame(fi);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [drawFrame]);

  /* ── 4. Scroll → rAF loop ── */
  useEffect(() => {
    let lastProgress = -1;

    const update = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) { rafRef.current = requestAnimationFrame(update); return; }

      const rect = wrapper.getBoundingClientRect();
      const total = wrapper.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(1, Math.max(0, scrolled / total));
      progressRef.current = progress;

      if (Math.abs(progress - lastProgress) > 0.0005) {
        lastProgress = progress;
        const frameIndex = Math.round(progress * (TOTAL_FRAMES - 1));
        drawFrame(frameIndex);

        // Update beat overlays via direct DOM style for max perf
        Object.keys(BEATS).forEach(beat => {
          const el = beatRefs.current[beat];
          if (el) {
            const op = beatOpacity(progress, beat);
            el.style.opacity = op;
            el.style.pointerEvents = op > 0.05 ? 'auto' : 'none';
          }
        });
      }

      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, [drawFrame]);

  const setBeatRef = (beat) => (el) => {
    beatRefs.current[beat] = el;
  };

  return (
    <div
      ref={wrapperRef}
      className="scroll-canvas-wrapper"
      style={{ height: '400vh', position: 'relative' }}
    >
      {/* Sticky viewport */}
      <div className="scroll-canvas-sticky">

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="scroll-canvas"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          aria-hidden="true"
        />

        {/* ── BEAT 1: HERO (0–15%) ── */}
        <div
          ref={setBeatRef('HERO')}
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '80px 24px 40px',
            opacity: 1, transition: 'opacity 0.4s ease',
            pointerEvents: 'none',
          }}
        >
          {/* Radial glow behind text */}
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: '60vw', height: '50vh',
            background: 'radial-gradient(ellipse at center, rgba(244,166,35,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 9vw, 7rem)',
            fontWeight: 900,
            color: 'rgba(241, 234, 234, 0.87)',
            letterSpacing: '-0.02em',
            textAlign: 'center',
            lineHeight: 1,
            position: 'relative',
            textShadow: '0 2px 24px rgba(244, 244, 244, 1), 0 1px 4px rgba(0, 0, 0, 1)',
          }}>
            VISARJAN
          </h1>

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'rgba(252, 122, 22, 1)',
            marginTop: 18,
            maxWidth: 480,
            textAlign: 'center',
            lineHeight: 1.65,
            textShadow: '0 2px 24px rgba(3, 3, 3, 1), 0 1px 10px rgba(0, 0, 0, 1)',
          }}>
            Give your idol a farewell worthy of the tradition.
            <br />
            <em style={{ color: 'rgba(0, 0, 0, 1)', fontStyle: 'normal', textShadow: '0 2px 24px rgba(255, 255, 255, 1), 0 1px 4px rgba(171, 171, 171, 1)' }}>
              The tradition isn't the problem. Modern materials are.
            </em>
          </p>

          <div style={{ marginTop: 36, pointerEvents: 'auto', fontFamily: 'var(--font-body)' }}>
            <Link href="/items" className="cta-btn-warm" id="hero-cta" style={{ textShadow: '0 2px 14px rgba(255,255,255,0.9), 0 1px 3px rgba(0,0,0,0.1)' }}>
              What do you have? →
            </Link>
          </div>

          {/* Scroll hint */}
          <div
            className="bounce-slow"
            style={{
              position: 'absolute', bottom: 32, left: '50%',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            }}
          >
            <span style={{ fontSize: '0.65rem', letterSpacing: '0.25em', color: 'rgba(61,26,58,0.45)', textTransform: 'uppercase', fontFamily: 'var(--font-body)', textShadow: '0 2px 14px rgba(255,255,255,0.9), 0 1px 3px rgba(0,0,0,0.1)' }}>Scroll</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(61,26,58,0.4)" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </div>

        {/* ── BEAT 2: CRISIS (15–40%) ── */}
        <div
          ref={setBeatRef('CRISIS')}
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'flex-start', justifyContent: 'center',
            padding: '80px clamp(32px,8vw,120px)',
            opacity: 0, transition: 'opacity 0.4s ease',
            pointerEvents: 'none',
          }}
        >
          <div style={{
            position: 'absolute', left: 0, top: '50%',
            transform: 'translateY(-50%)',
            width: '50vw', height: '60vh',
            background: 'radial-gradient(ellipse at 20% 50%, rgba(244,166,35,0.18) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.6rem, 4vw, 3rem)',
            fontWeight: 700,
            color: 'var(--plum)',
            maxWidth: 520,
            position: 'relative',
            textShadow: '0 2px 10px rgba(255, 251, 251, 1), 0 1px 4px rgba(255, 253, 253, 0)',
          }}>
            A beloved tradition.<br />A growing crisis.
          </h2>

          <div style={{ display: '', flexDirection: 'column', gap: 8, marginTop: 16, maxWidth: 440, }}>
            {[
              '150M+ Ganesh idols immersed annually across India',
              '100+ water bodies affected each Visarjan season',
              'Lead levels 10× WHO safe limits during immersion',
              'PoP never dissolves — sits at riverbeds forever',
            ].map((line, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: 'rgba(0,0,0,1)', fontWeight: 600,
              }}>
                <span style={{ color: 'var(--saffron)', fontSize: '1rem', marginTop: 2, textShadow: '0 2px 14px rgba(255,255,255,0.9), 0 1px 3px rgba(0,0,0,0.1)' }}>•</span>
                {line}
              </div>
            ))}
          </div>

          <div className="stat-tiles" style={{ marginTop: 28, gap: 12, flexWrap: 'wrap' }}>
            <StatCounter target="150M+" suffix="" label="Idols immersed / year" />
            <StatCounter target="100+" suffix="" label="Water bodies affected" />
            <StatCounter target="220T" suffix="" label="Puja samagri waste" />
          </div>

          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.72rem',
            color: 'rgba(107,91,78,0.55)', marginTop: 14, letterSpacing: '0.05em',
            textShadow: '0 2px 14px rgba(255,255,255,0.9), 0 1px 3px rgba(0,0,0,0.1)',
          }}>
            Source: CPCB Data, 2023
          </p>
        </div>

        {/* ── BEAT 3: SOLUTION (40–65%) ── */}
        <div
          ref={setBeatRef('SOLUTION')}
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'flex-end', justifyContent: 'center',
            padding: '80px clamp(32px,8vw,120px)',
            opacity: 0, transition: 'opacity 0.4s ease',
            pointerEvents: 'none',
          }}
        >
          <div style={{
            position: 'absolute', right: 0, top: '50%',
            transform: 'translateY(-50%)',
            width: '50vw', height: '60vh',
            background: 'radial-gradient(ellipse at 80% 50%, rgba(244,166,35,0.18) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.6rem, 4vw, 3rem)',
            fontWeight: 700,
            color: 'var(--plum)',
            textShadow: '0 2px 14px rgba(255,255,255,0.9), 0 1px 3px rgba(0,0,0,0.1)',
            maxWidth: 480, textAlign: 'right',
            position: 'relative',
          }}>
            One platform.<br />Every offering. Every route.
          </h2>

          <div className="routing-lines" style={{ marginTop: 24, alignItems: 'flex-end', textAlign: 'right', maxWidth: 460 }}>
            {[
              ['PoP idol', 'Nearest controlled immersion pond'],
              ['Clay idol', 'Artisan reuse program'],
              ['Flowers & nirmalya', 'Phool drop point → incense'],
            ].map(([item, route]) => (
              <div key={item} style={{
                display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', gap: 10,
                fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'rgba(0,0,0,1)', fontWeight: 600,
                textShadow: '0 2px 14px rgba(255, 255, 255, 1), 0 1px 3px rgba(0,0,0,0.1)',
              }}>
                <span>
                  <strong style={{ color: 'var(--plum)', textShadow: '0 2px 14px rgba(255,255,255,0.9), 0 1px 3px rgba(0,0,0,0.1)' }}>{item}</strong>
                  <span style={{ color: 'rgba(0,0,0,1)', textShadow: '0 2px 14px rgba(255,255,255,0.9), 0 1px 3px rgba(0,0,0,0.1)' }}> → {route}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── BEAT 4: TECH (65–85%) ── */}
        <div
          ref={setBeatRef('TECH')}
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '80px 24px',
            opacity: 0, transition: 'opacity 0.4s ease',
            pointerEvents: 'none',
          }}
        >
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: '70vw', height: '60vh',
            background: 'radial-gradient(ellipse at center, rgba(61,26,58,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.6rem, 4vw, 3rem)',
            fontWeight: 700,
            color: 'var(--plum)',
            textAlign: 'center',
            position: 'relative',
            textShadow: '0 2px 24px rgba(255, 255, 255, 0.94), 0 1px 4px rgba(255, 255, 255, 0.31)',
          }}>
            AI that understands<br />what you have.
          </h2>

          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '1rem',
            color: 'rgba(255, 255, 255, 1)', marginTop: 16,
            maxWidth: 460, textAlign: 'center', lineHeight: 1.7,
            textShadow: '0 2px 14px rgba(255, 255, 255, 1), 0 1px 3px rgba(0, 0, 0, 1)',
          }}>
            Photograph your idol. Gemini Vision identifies the material — PoP, clay, metal, or paper pulp — estimates pollution risk, and routes you to the right drop point.
            <br />
            <strong style={{ color: 'rgba(0,0,0,1)', textShadow: '0 2px 14px rgba(255,255,255,0.9), 0 1px 3px rgba(0,0,0,0.1)' }}>30 seconds. No app download.</strong>
          </p>

          <div className="feature-pills" style={{ marginTop: 28, justifyContent: 'center' }}>
            {[
              { icon: '🔍', label: 'AI Idol Analyzer' },
              { icon: '🗺️', label: 'Smart Map & Navigation' },
              { icon: '🏆', label: 'Impact Certificate' },
            ].map(p => (
              <div key={p.label} className="feature-pill" style={{ pointerEvents: 'auto', textShadow: '0 2px 14px rgba(255,255,255,0.9), 0 1px 3px rgba(0,0,0,0.1)' }}>
                <span style={{ textShadow: 'none' }}>{p.icon}</span>
                <span>{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── BEAT 5: FINALE (85–100%) ── */}
        <div
          ref={setBeatRef('FINALE')}
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '80px 24px',
            opacity: 0, transition: 'opacity 0.4s ease',
            pointerEvents: 'none',
          }}
        >
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: '65vw', height: '55vh',
            background: 'radial-gradient(ellipse at center, rgba(244,166,35,0.22) 0%, transparent 68%)',
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginTop: 36, pointerEvents: 'auto', position: 'relative' }}>

          </div>
        </div>

      </div>
    </div >
  );
}
