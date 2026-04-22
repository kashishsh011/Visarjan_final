'use client';     //scroll-canvas-hero.jsx//
import { useEffect, useRef, useCallback } from 'react';

const TOTAL_FRAMES = 240;

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
  // Guard against negative progress range
  const fadeStart = Math.max(0, start - fadeZone);
  if (progress < fadeStart || progress > end + fadeZone) return 0;
  if (progress < start) return (progress - fadeStart) / fadeZone;
  if (progress > end) return 1 - (progress - end) / fadeZone;
  return 1;
}

// Shared shadow constants
const H_SHADOW = '0 2px 4px rgba(0,0,0,0.95), 0 4px 20px rgba(0,0,0,0.7), 0 0 40px rgba(0,0,0,0.3)';
const B_SHADOW = '0 1px 3px rgba(0,0,0,0.98), 0 2px 10px rgba(0,0,0,0.6)';

export default function ScrollCanvasHero() {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const loadedRef = useRef(0);
  const rafRef = useRef(null);
  const progressRef = useRef(0);
  const beatRefs = useRef({});

  /* ── 1. Preload all frames ── */
  useEffect(() => {
    const images = [];
    framesRef.current = images;
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new window.Image();
      img.onload = () => { loadedRef.current++; };
      img.src = `/frames/frame_${String(i).padStart(3, '0')}.jpg`;
      images.push(img);
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  /* ── 2. Draw frame to canvas ── */
  const drawFrame = useCallback((frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = framesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;
    const { width: cw, height: ch } = canvas;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.fillStyle = '#F3E8F5';
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  }, []);

  /* ── 3. Resize canvas ── */
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(Math.round(progressRef.current * (TOTAL_FRAMES - 1)));
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [drawFrame]);

  /* ── 4. Scroll → rAF loop ── */
  useEffect(() => {
    let lastProgress = -1;
    const update = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) { rafRef.current = requestAnimationFrame(update); return; }
      const rect = wrapper.getBoundingClientRect();
      const total = wrapper.offsetHeight - window.innerHeight;
      const progress = Math.min(1, Math.max(0, -rect.top / total));
      progressRef.current = progress;
      if (Math.abs(progress - lastProgress) > 0.0005) {
        lastProgress = progress;
        drawFrame(Math.round(progress * (TOTAL_FRAMES - 1)));
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

  const setBeatRef = (beat) => (el) => { beatRefs.current[beat] = el; };

  return (
    <div
      ref={wrapperRef}
      className="scroll-canvas-wrapper"
      style={{ height: '400vh', position: 'relative' }}
    >
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
            opacity: 1, transition: 'opacity 0.4s ease',
            pointerEvents: 'none',
          }}
        >
          {/* Full radial scrim — darkens centre so white text pops */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 70%, transparent 100%)',
            pointerEvents: 'none',
          }} />

          {/* Centred text block — no card, no border */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '80px 24px 40px',
          }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 9vw, 7rem)',
              fontWeight: 900,
              color: '#fff',
              letterSpacing: '-0.02em',
              textAlign: 'center',
              lineHeight: 1,
              textShadow: H_SHADOW,
            }}>
              VISARJAN
            </h1>

            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'rgba(255, 220, 140, 0.95)',
              marginTop: 18, maxWidth: 480,
              textAlign: 'center', lineHeight: 1.65, fontWeight: 500,
              textShadow: B_SHADOW,
            }}>
              Give your idol a farewell worthy of the tradition.
              <br />
              <em style={{ color: 'rgba(255,255,255,0.75)', fontStyle: 'normal' }}>
                The tradition isn't the problem. Modern materials are.
              </em>
            </p>

            <div style={{ marginTop: 36, pointerEvents: 'auto', fontFamily: 'var(--font-body)' }}>
              <button
                onClick={() => document.getElementById('what-do-you-have')?.scrollIntoView({ behavior: 'smooth' })}
                className="cta-btn-warm"
                id="hero-cta"
                style={{ pointerEvents: 'auto', cursor: 'pointer' }}
              >
                What do you have? →
              </button>
            </div>
          </div>

          {/* Scroll hint */}
          <div
            className="bounce-slow"
            style={{
              position: 'absolute', bottom: 32, left: '50%',
              transform: 'translateX(-50%)',          // ← fixed centering
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            }}
          >
            <span style={{
              fontSize: '0.65rem', letterSpacing: '0.25em',
              color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase',
              fontFamily: 'var(--font-body)', textShadow: B_SHADOW,
            }}>Scroll</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </div>

        {/* ── BEAT 2: CRISIS (15–40%) ── */}
        <div
          ref={setBeatRef('CRISIS')}
          style={{
            position: 'absolute', inset: 0,
            opacity: 0, transition: 'opacity 0.4s ease',
            pointerEvents: 'none',
          }}
        >
          {/* Left-anchored gradient scrim */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, rgba(8,3,8,0.82) 0%, rgba(8,3,8,0.5) 55%, transparent 100%)',
            pointerEvents: 'none',
          }} />

          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center',
            padding: '80px clamp(32px,8vw,120px)',
          }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.6rem, 4vw, 3rem)',
              fontWeight: 700, color: '#fff',
              maxWidth: 520, textShadow: H_SHADOW,
            }}>
              A beloved tradition.<br />A growing crisis.
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16, maxWidth: 440 }}>
              {[
                '150M+ Ganesh idols immersed annually across India',
                '100+ water bodies affected each Visarjan season',
                'Lead levels 10× WHO safe limits during immersion',
                'PoP never dissolves — sits at riverbeds forever',
              ].map((line, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  fontFamily: 'var(--font-body)', fontSize: '0.92rem',
                  color: 'rgba(255,235,200,0.92)', fontWeight: 500,
                  textShadow: B_SHADOW,
                }}>
                  <span style={{ color: '#F4A623', fontSize: '1rem', marginTop: 1, flexShrink: 0 }}>•</span>
                  {line}
                </div>
              ))}
            </div>

            {/* Stat tiles — horizontal, sharp edges */}
            <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
              {[
                { val: '150M+', label: 'IDOLS IMMERSED / YEAR' },
                { val: '100+', label: 'WATER BODIES AFFECTED' },
                { val: '220T', label: 'PUJA SAMAGRI WASTE' },
              ].map(({ val, label }) => (
                <div key={label} style={{
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.13)',
                  borderRadius: '4px',
                  padding: '14px 20px', minWidth: 120,
                }}>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800,
                    color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                  }}>{val}</div>
                  <div style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.62rem',
                    letterSpacing: '0.1em', color: 'rgba(255,220,150,0.72)', marginTop: 4,
                  }}>{label}</div>
                </div>
              ))}
            </div>

            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.72rem',
              color: 'rgba(255,255,255,0.3)', marginTop: 14, letterSpacing: '0.05em',
            }}>
              Source: CPCB Data, 2023
            </p>
          </div>
        </div>

        {/* ── BEAT 3: SOLUTION (40–65%) ── */}
        <div
          ref={setBeatRef('SOLUTION')}
          style={{
            position: 'absolute', inset: 0,
            opacity: 0, transition: 'opacity 0.4s ease',
            pointerEvents: 'none',
          }}
        >
          {/* Right-anchored gradient scrim */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(270deg, rgba(8,3,8,0.82) 0%, rgba(8,3,8,0.5) 55%, transparent 100%)',
            pointerEvents: 'none',
          }} />

          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'flex-end', justifyContent: 'center',
            padding: '80px clamp(32px,8vw,120px)',
          }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.6rem, 4vw, 3rem)',
              fontWeight: 700, color: '#fff',
              maxWidth: 480, textAlign: 'right',
              textShadow: H_SHADOW,
            }}>
              One platform.<br />Every offering. Every route.
            </h2>

            <div style={{
              display: 'flex', flexDirection: 'column', gap: 12,
              marginTop: 24, alignItems: 'flex-end', maxWidth: 460,
            }}>
              {[
                ['PoP idol', 'Nearest controlled immersion pond'],
                ['Clay idol', 'Artisan reuse program'],
                ['Flowers & nirmalya', 'Phool drop point → incense'],
              ].map(([item, route]) => (
                <div key={item} style={{
                  display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', gap: 10,
                  fontFamily: 'var(--font-body)', fontSize: '1rem',
                  color: 'rgba(255,235,200,0.92)', fontWeight: 500,
                  textAlign: 'right', textShadow: B_SHADOW,
                }}>
                  <span>
                    <strong style={{ color: '#F4A623' }}>{item}</strong>
                    <span style={{ color: 'rgba(255,255,255,0.8)' }}> → {route}</span>
                  </span>
                </div>
              ))}
            </div>

            {/* Thin saffron rule for polish */}
            <div style={{
              width: 60, height: 2,
              background: 'linear-gradient(90deg, transparent, #F4A623)',
              marginTop: 28, borderRadius: 1,
            }} />
          </div>
        </div>

        {/* ── BEAT 4: TECH (65–85%) ── */}
        <div
          ref={setBeatRef('TECH')}
          style={{
            position: 'absolute', inset: 0,
            opacity: 0, transition: 'opacity 0.4s ease',
            pointerEvents: 'none',
          }}
        >
          {/* Central vignette scrim */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 65%, transparent 100%)',
            pointerEvents: 'none',
          }} />

          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '80px 24px',
          }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.6rem, 4vw, 3rem)',
              fontWeight: 700, color: '#fff',
              textAlign: 'center', textShadow: H_SHADOW,
            }}>
              AI that understands<br />what you have.
            </h2>

            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '1rem',
              color: 'rgba(255,235,200,0.9)', marginTop: 16,
              maxWidth: 460, textAlign: 'center', lineHeight: 1.7, fontWeight: 500,
              textShadow: B_SHADOW,
            }}>
              Photograph your idol. Gemini Vision identifies the material — PoP, clay, metal, or paper pulp —
              estimates pollution risk, and routes you to the right drop point.
              <br />
              <strong style={{ color: '#F4A623', display: 'inline-block', marginTop: 8, textShadow: B_SHADOW }}>
                30 seconds. No app download.
              </strong>
            </p>

            <div className="feature-pills" style={{ marginTop: 28, justifyContent: 'center' }}>
              {[
                { icon: '🔍', label: 'AI Idol Analyzer' },
                { icon: '🗺️', label: 'Smart Map & Navigation' },
                { icon: '🏆', label: 'Impact Certificate' },
              ].map(p => (
                <div key={p.label} className="feature-pill" style={{
                  pointerEvents: 'auto',
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.13)',
                  borderRadius: '4px',
                }}>
                  <span>{p.icon}</span>
                  <span style={{ color: '#fff', textShadow: B_SHADOW }}>{p.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── BEAT 5: FINALE (85–100%) ── */}
        <div
          ref={setBeatRef('FINALE')}
          style={{
            position: 'absolute', inset: 0,
            opacity: 0, transition: 'opacity 0.4s ease',
            pointerEvents: 'none',
          }}
        >
          {/* Warm saffron vignette for the ending */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(20,8,4,0.7) 0%, rgba(20,8,4,0.2) 70%, transparent 100%)',
            pointerEvents: 'none',
          }} />

          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '80px 24px',
          }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
              fontWeight: 800, color: '#fff',
              textAlign: 'center', textShadow: H_SHADOW,
              maxWidth: 560,
            }}>
              Tradition preserved.<br />
              <span style={{ color: '#F4A623' }}>River protected.</span>
            </h2>

            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '1rem',
              color: 'rgba(255,235,200,0.85)', marginTop: 16,
              maxWidth: 400, textAlign: 'center', lineHeight: 1.7,
              textShadow: B_SHADOW,
            }}>
              Join thousands of families giving their idols an eco-conscious farewell this Ganesh Chaturthi.
            </p>

            <div style={{
              display: 'flex', gap: 12, marginTop: 36,
              pointerEvents: 'auto', flexWrap: 'wrap', justifyContent: 'center',
            }}>
              <button
                onClick={() => document.getElementById('what-do-you-have')?.scrollIntoView({ behavior: 'smooth' })}
                className="cta-btn-warm"
                style={{ pointerEvents: 'auto', cursor: 'pointer' }}
              >
                Get started →
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}