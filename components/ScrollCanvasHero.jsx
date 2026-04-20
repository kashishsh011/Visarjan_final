'use client';
import { useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

const TOTAL_FRAMES = 240;

// Beat definitions: [startPct, endPct]
const BEATS = {
  HERO:     [0,   0.15],
  CRISIS:   [0.15, 0.40],
  SOLUTION: [0.40, 0.65],
  TECH:     [0.65, 0.85],
  FINALE:   [0.85, 1.00],
};

function beatOpacity(progress, beat) {
  const [start, end] = BEATS[beat];
  const duration = end - start;
  const fadeZone = Math.min(0.04, duration * 0.25);
  if (progress < start - fadeZone || progress > end + fadeZone) return 0;
  if (progress < start) return (progress - (start - fadeZone)) / fadeZone;
  if (progress > end)   return 1 - (progress - end) / fadeZone;
  return 1;
}

// Animated counter that increments as opacity rises
function StatCounter({ target, suffix, label }) {
  return (
    <div className="stat-tile">
      <div className="stat-value">{target}{suffix}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function ScrollCanvasHero() {
  const wrapperRef   = useRef(null);
  const canvasRef    = useRef(null);
  const framesRef    = useRef([]);
  const loadedRef    = useRef(0);
  const rafRef       = useRef(null);
  const progressRef  = useRef(0);

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
      canvas.width  = window.innerWidth;
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

      const rect    = wrapper.getBoundingClientRect();
      const total   = wrapper.offsetHeight - window.innerHeight;
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
            color: 'var(--plum)',
            letterSpacing: '-0.02em',
            textAlign: 'center',
            lineHeight: 1,
            position: 'relative',
          }}>
            VISARJAN
          </h1>

          <p style={{
            fontFamily: 'var(--font-hindi)',
            fontSize: 'clamp(1.2rem, 3vw, 2rem)',
            color: 'var(--saffron)',
            marginTop: 8,
            letterSpacing: '0.05em',
            textAlign: 'center',
          }}>
            विसर्जन — एक पवित्र विदाई
          </p>

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--warm-gray)',
            marginTop: 18,
            maxWidth: 480,
            textAlign: 'center',
            lineHeight: 1.65,
          }}>
            Give your idol a farewell worthy of the tradition.
            <br />
            <em style={{ color: 'var(--warm-brown)', fontStyle: 'normal' }}>
              The tradition isn't the problem. Modern materials are.
            </em>
          </p>

          <div style={{ marginTop: 36, pointerEvents: 'auto' }}>
            <Link href="/items" className="cta-btn-warm" id="hero-cta">
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
            <span style={{ fontSize: '0.65rem', letterSpacing: '0.25em', color: 'rgba(61,26,58,0.45)', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>Scroll</span>
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
          }}>
            A beloved tradition.<br />A growing crisis.
          </h2>

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.95rem',
            color: 'var(--sacred-red)',
            marginTop: 6,
            fontStyle: 'italic',
            letterSpacing: '0.02em',
          }}>
            संकट — पर समाधान भी है
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16, maxWidth: 440 }}>
            {[
              '150M+ Ganesh idols immersed annually across India',
              '100+ water bodies affected each Visarjan season',
              'Lead levels 10× WHO safe limits during immersion',
              'PoP never dissolves — sits at riverbeds forever',
            ].map((line, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: 'var(--warm-gray)',
              }}>
                <span style={{ color: 'var(--saffron)', fontSize: '1rem', marginTop: 2 }}>◆</span>
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
            maxWidth: 480, textAlign: 'right',
            position: 'relative',
          }}>
            One platform.<br />Every offering. Every route.
          </h2>

          <p style={{
            fontFamily: 'var(--font-hindi)', fontSize: '1rem',
            color: 'var(--saffron)', marginTop: 6, textAlign: 'right',
          }}>
            समाधान — हर विसर्जन के लिए
          </p>

          <div className="routing-lines" style={{ marginTop: 24, alignItems: 'flex-end', textAlign: 'right', maxWidth: 460 }}>
            {[
              ['PoP idol',         'Nearest controlled immersion pond'],
              ['Clay idol',        'Artisan reuse program'],
              ['Flowers & nirmalya','Phool drop point → incense'],
              ['Broken idol',      'NGO collection drive, 2 km away'],
            ].map(([item, route]) => (
              <div key={item} style={{
                display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', gap: 10,
                fontFamily: 'var(--font-body)', fontSize: '0.93rem', color: 'var(--warm-brown)',
              }}>
                <span>
                  <strong style={{ color: 'var(--plum)' }}>{item}</strong>
                  <span style={{ color: 'var(--warm-gray)' }}> → {route}</span>
                </span>
                <span style={{ color: 'var(--saffron)', flexShrink: 0 }}>●</span>
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
          }}>
            AI that understands<br />what you have.
          </h2>

          <p style={{
            fontFamily: 'var(--font-hindi)', fontSize: '1rem',
            color: 'var(--saffron)', marginTop: 6, textAlign: 'center',
          }}>
            AI विश्लेषक — सटीक, तुरंत
          </p>

          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '1rem',
            color: 'var(--warm-gray)', marginTop: 16,
            maxWidth: 460, textAlign: 'center', lineHeight: 1.7,
          }}>
            Photograph your idol. Gemini Vision identifies the material — PoP, clay, metal, or paper pulp — estimates pollution risk, and routes you to the right drop point.
            <br />
            <strong style={{ color: 'var(--warm-brown)' }}>30 seconds. No app download.</strong>
          </p>

          <div className="feature-pills" style={{ marginTop: 28, justifyContent: 'center' }}>
            {[
              { icon: '🔍', label: 'AI Idol Analyzer' },
              { icon: '🗺️', label: 'Smart Map & Navigation' },
              { icon: '🏆', label: 'Impact Certificate' },
            ].map(p => (
              <div key={p.label} className="feature-pill" style={{ pointerEvents: 'auto' }}>
                <span>{p.icon}</span>
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

          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.4rem, 3.5vw, 2.5rem)',
            fontWeight: 700,
            color: 'var(--plum)',
            textAlign: 'center',
            maxWidth: 640,
            position: 'relative',
          }}>
            "You kept 2.3 kg of PoP<br />out of the Yamuna."
          </p>

          <h2 style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 2vw, 1.3rem)',
            fontWeight: 400,
            color: 'var(--warm-gray)',
            textAlign: 'center',
            maxWidth: 480,
            marginTop: 14,
            lineHeight: 1.6,
            position: 'relative',
          }}>
            And gave your Ganesha a farewell worthy of the tradition.
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginTop: 36, pointerEvents: 'auto', position: 'relative' }}>
            <Link href="/map" className="cta-btn-warm" id="finale-cta">
              Find Drop Point →
            </Link>

            <Link href="/certificate" style={{
              fontFamily: 'var(--font-body)', fontSize: '0.9rem',
              color: 'var(--saffron)', textDecoration: 'underline',
              textUnderlineOffset: '3px', cursor: 'pointer',
            }}>
              Generate My Impact Certificate
            </Link>

            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.78rem',
              color: 'rgba(107,91,78,0.6)', textAlign: 'center',
              letterSpacing: '0.03em',
            }}>
              Free. No app. Works for idols, flowers, prasad, and full pooja sets.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
