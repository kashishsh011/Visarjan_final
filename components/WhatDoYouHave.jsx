'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

const C = {
  cream:        '#F0E2EE', 
  saffron:      '#D4881A',
  saffronPale:  '#FBE9C4',
  terracotta:   '#2D1B4E', 
  brownDeep:    '#2D1B4E',
  brownMid:     'rgba(45, 27, 78, 0.8)',
  brownLt:      'rgba(45, 27, 78, 0.5)',
  creamBorder:  'rgba(45, 27, 78, 0.12)',
};

const ITEMS = [
  { key: 'pop-idol',   label: 'PoP Idol',          icon: '🏺' },
  { key: 'clay-idol',  label: 'Clay Idol',          icon: '🪔' },
  { key: 'flowers',    label: 'Flowers / Nirmalya', icon: '🌸' },
  { key: 'coconut',    label: 'Coconut / Prasad',   icon: '🥥' },
  { key: 'pooja-set',  label: 'Full Pooja Set',     icon: '🙏' },
];

const LOCALITIES = [
  { name: 'Lajpat Nagar',    zone: 'South Delhi' },
  { name: 'Dwarka',          zone: 'South West Delhi' },
  { name: 'Chandni Chowk',   zone: 'Central Delhi' },
  { name: 'Karol Bagh',      zone: 'Central Delhi' },
  { name: 'Saket',           zone: 'South Delhi' },
  { name: 'Rohini',          zone: 'North West Delhi' },
  { name: 'Janakpuri',       zone: 'West Delhi' },
];

export default function WhatDoYouHave() {
  const router = useRouter();
  const [selected, setSelected] = useState(new Set());
  const [aiOpen, setAiOpen] = useState(false);
  const [locality, setLocality] = useState('');
  const [ddOpen, setDdOpen] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const [uploadDone, setUploadDone] = useState(false);
  const fileInputRef = useRef(null);

  const togglePill = (key) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleAI = () => {
    setAiOpen(prev => {
      const isOpening = !prev;
      setSelected(s => {
        const next = new Set(s);
        if (isOpening) next.add('not-sure');
        else next.delete('not-sure');
        return next;
      });
      return isOpening;
    });
  };

  const isFormValid = selected.size > 0 && locality.trim() !== '';

  const handleContinue = () => {
    if (!isFormValid) return;
    const params = new URLSearchParams();
    Array.from(selected).filter(s => s !== 'not-sure').forEach(s => params.append('m', s));
    if (locality) params.append('loc', locality);
    router.push(`/map?${params.toString()}`);
  };

  return (
    <div className="vis-discover-layer" style={{ position: 'relative', overflow: 'hidden', borderRadius: 40, backgroundColor: C.cream, margin: '0 auto', maxWidth: 1240, border: `1px solid rgba(45,27,78,0.05)`, padding: 'clamp(40px, 8vw, 80px) clamp(20px, 4vw, 40px)' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .vis-discover-layer .abs-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .vis-discover-layer .content-z {
          position: relative;
          z-index: 10;
        }
        .vd-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 50px;
          font-family: var(--font-body), sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.22s ease;
          user-select: none;
        }
        .vd-pill-reg {
          background: rgba(255,255,255,0.85);
          border: 1.5px solid ${C.creamBorder};
          color: ${C.brownDeep};
        }
        .vd-pill-reg:hover { background: ${C.saffronPale}; border-color: ${C.saffronLt}; transform: translateY(-2px); box-shadow: 0 4px 18px rgba(212,136,26,0.18); }
        .vd-pill-reg.active { background: ${C.saffron}; border-color: ${C.saffron}; color: white; transform: translateY(-2px); box-shadow: 0 6px 22px rgba(212,136,26,0.32); }
        
        .vd-pill-ai {
          background: transparent;
          border: 1.5px dashed ${C.saffron};
          color: ${C.saffron};
        }
        .vd-pill-ai:hover { background: rgba(212,136,26,0.1); }
        .vd-pill-ai.active { background: ${C.terracotta}; border: 1.5px solid ${C.terracotta}; color: white; }
        
        .vd-input-wrap { display: flex; gap: 12px; max-width: 600px; margin: 0 auto; flex-wrap: wrap; position: relative; }
        .vd-input {
          flex: 1;
          min-width: 250px;
          padding: 15px 24px;
          border-radius: 50px;
          border: 1.5px solid ${C.creamBorder};
          background: rgba(255,255,255,0.9);
          font-family: var(--font-body), sans-serif;
          font-size: 1rem;
          color: ${C.brownDeep};
          outline: none;
          transition: border-color 0.25s;
        }
        .vd-input:focus { border-color: ${C.saffron}; }
        
        .vd-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 15px 32px;
          border-radius: 50px;
          background: ${C.saffron};
          color: white;
          font-family: var(--font-body), sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .vd-cta.valid:hover { background: ${C.saffronLt}; transform: translateY(-2px); }
        .vd-cta.disabled { opacity: 0.5; pointer-events: none; }
        
        @keyframes vdFadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .vd-anim-up { animation: vdFadeUp 0.6s ease both; }
      `}}/>

      <div className="abs-bg" style={{ backgroundImage: "url('/visarjan-scene.png')", backgroundSize: 'cover', backgroundPosition: 'center top', opacity: 0.1 }} />
      <div className="abs-bg" style={{ background: 'linear-gradient(to bottom, rgba(240,226,238,0.55) 0%, rgba(240,226,238,0.38) 40%, rgba(240,226,238,0.85) 100%)' }} />
      <div className="abs-bg" style={{ backgroundImage: 'radial-gradient(circle, rgba(212,136,26,0.15) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <div className="content-z" style={{ width: '100%' }}>
        <div className="vd-anim-up" style={{ textAlign: 'center', maxWidth: 860, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6vw, 64px)', color: C.brownDeep, marginBottom: 16, lineHeight: 1 }}>
            What Do You Have?
          </h2>
          <p style={{ fontFamily: 'var(--font-hindi)', color: C.saffron, fontSize: '1.1rem', marginBottom: 16 }}>
            आपके पास क्या है?
          </p>
          <p style={{ fontFamily: 'var(--font-body)', color: C.brownMid, fontSize: '1rem', maxWidth: 440, margin: '0 auto', lineHeight: 1.6 }}>
            Select what you want to dispose. We'll find the nearest responsible drop point for you.
          </p>
        </div>

        <div className="vd-anim-up" style={{ animationDelay: '150ms', display: 'flex', alignItems: 'center', gap: 14, margin: '40px auto', maxWidth: 860 }}>
          <div style={{ flex: 1, height: 1, backgroundColor: C.creamBorder }}></div>
          <div style={{ width: 8, height: 8, backgroundColor: C.saffron, transform: 'rotate(45deg)' }}></div>
          <div style={{ flex: 1, height: 1, backgroundColor: C.creamBorder }}></div>
        </div>

        <div className="vd-anim-up" style={{ animationDelay: '250ms', textAlign: 'center' }}>
          <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: C.brownLt, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 16 }}>
            Select all that apply
          </span>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
            {ITEMS.map(item => {
              const active = selected.has(item.key);
              return (
                <div key={item.key} onClick={() => togglePill(item.key)} className={`vd-pill vd-pill-reg ${active ? 'active' : ''}`}>
                  <span>{item.icon}</span>
                  {item.label}
                </div>
              );
            })}
            <div onClick={toggleAI} className={`vd-pill vd-pill-ai ${aiOpen ? 'active' : ''}`}>
              Not Sure → AI Analyzer
            </div>
          </div>

          <div style={{ overflow: 'hidden', transition: 'max-height 0.4s ease, opacity 0.3s ease', maxHeight: aiOpen ? 400 : 0, opacity: aiOpen ? 1 : 0 }}>
            <div style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', border: `1.5px solid ${C.creamBorder}`, borderRadius: 16, padding: 28, maxWidth: 600, margin: '16px auto 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ background: C.terracotta, color: 'white', padding: '4px 10px', borderRadius: 50, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.04em' }}>✦ Gemini Vision</div>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: C.brownDeep }}>AI Idol Analyzer</h3>
              </div>
              <div onClick={() => fileInputRef.current?.click()} style={{ border: `1.5px dashed ${C.saffron}`, borderRadius: 12, padding: '32px 20px', cursor: 'pointer', background: uploadDone ? 'rgba(212,136,26,0.05)' : 'transparent', transition: 'all 0.2s' }}>
                {uploadDone ? (
                  <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontWeight: 500, color: C.brownDeep }}>✅ Image uploaded — analyzing…</p>
                ) : (
                  <>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>📷</div>
                    <p style={{ margin: 0, fontFamily: 'var(--font-body)', color: C.brownMid }}>Click to upload an image of your idols</p>
                  </>
                )}
                <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={(e) => { if (e.target.files?.length) setUploadDone(true); }} />
              </div>
            </div>
          </div>
        </div>

        <div className="vd-anim-up" style={{ animationDelay: '380ms', marginTop: 40, textAlign: 'center' }}>
          <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: C.brownLt, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 16 }}>
            Your Delhi locality
          </span>
          <div className="vd-input-wrap">
            <input 
              type="text" 
              className="vd-input"
              placeholder="e.g. Lajpat Nagar, Dwarka…"
              value={locality}
              onChange={(e) => {
                const val = e.target.value; setLocality(val);
                if (!val) { setFiltered([]); setDdOpen(false); return; }
                const matches = LOCALITIES.filter(l => l.name.toLowerCase().includes(val.toLowerCase())).slice(0, 5);
                setFiltered(matches); setDdOpen(matches.length > 0);
              }}
              onBlur={() => setTimeout(() => setDdOpen(false), 150)}
            />
            {ddOpen && filtered.length > 0 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', background: 'white', border: `1px solid ${C.creamBorder}`, borderRadius: 12, boxShadow: '0 12px 30px rgba(0,0,0,0.08)', zIndex: 20, overflow: 'hidden', textAlign: 'left', marginTop: 8 }}>
                {filtered.map(loc => (
                  <div key={loc.name} onClick={() => { setLocality(loc.name); setDdOpen(false); }} style={{ padding: '12px 20px', cursor: 'pointer', borderBottom: `1px solid ${C.creamBorder}` }}>
                    <span style={{ fontSize: '0.95rem', color: C.brownDeep }}>📍 {loc.name}</span>
                    <span style={{ fontSize: '0.85rem', color: C.brownLt, marginLeft: 8 }}>{loc.zone}</span>
                  </div>
                ))}
              </div>
            )}
            <button 
              onClick={handleContinue}
              className={`vd-cta ${isFormValid ? 'valid' : 'disabled'}`}
            >
              Show Map →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
