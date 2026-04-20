'use client';
import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import PillSelect from '@/components/PillSelect';

const ITEMS = [
  { id: 'pop', emoji: '🏺', label: 'PoP Idol' },
  { id: 'clay', emoji: '🪔', label: 'Clay Idol' },
  { id: 'flowers', emoji: '🌸', label: 'Flowers / Nirmalya' },
  { id: 'coconut', emoji: '🥥', label: 'Coconut / Prasad' },
  { id: 'fullset', emoji: '🙏', label: 'Full Pooja Set' },
  { id: 'unsure', emoji: '❓', label: 'Not Sure' },
];

const DELHI_AREAS = [
  'Connaught Place', 'Lajpat Nagar', 'Dwarka', 'Rohini', 'Saket',
  'Janakpuri', 'Pitampura', 'Karol Bagh', 'Greater Kailash', 'Vasant Kunj',
  'Nehru Place', 'Preet Vihar', 'Rajouri Garden', 'Punjabi Bagh', 'Noida Sec 18',
];

const MOCK_ANALYSIS = [
  { name: 'Plaster of Paris Idol', material: 'PoP (Calcium Sulphate)', risk: 'High', badge: 'badge-high', env: 'Does not biodegrade. Releases lead & mercury into waterways. Never immerse in rivers.' },
  { name: 'Marigold Garlands', material: 'Organic Flower Matter', risk: 'Safe', badge: 'badge-safe', env: 'Fully compostable. Can be converted to Phool incense or used as fertilizer. Preferred choice.' },
  { name: 'Synthetic Colour Powder', material: 'Industrial Dyes', risk: 'Moderate', badge: 'badge-moderate', env: 'Chemical dyes can leach into soil. Dispose at designated collection points, not in water.' },
];

export default function ItemsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState([]);
  const [area, setArea] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const toggleItem = useCallback((id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const handleUpload = (file) => {
    if (!file) return;
    setUploadedFile(file);
    setAnalyzing(true);
    setShowResults(false);
    setTimeout(() => { setAnalyzing(false); setShowResults(true); }, 2400);
  };

  const filteredAreas = DELHI_AREAS.filter(a => a.toLowerCase().includes(areaFilter.toLowerCase()));
  const showUnsure = selected.includes('unsure');

  const proceed = () => {
    const params = new URLSearchParams();
    selected.filter(s => s !== 'unsure').forEach(s => params.append('m', s));
    router.push(`/map?${params.toString()}`);
  };

  return (
    <div className="page-wrapper" style={{ paddingTop: 80 }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '60px 20px 40px' }}>

        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="section-title"
          style={{ marginBottom: 10 }}
        >
          What are you offering back to the earth?
        </motion.h1>
        <p style={{ fontFamily: 'var(--font-hindi)', color: 'var(--saffron)', fontSize: '1rem', marginBottom: 6 }}>आप क्या अर्पित करना चाहते हैं?</p>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          style={{ color: 'var(--warm-gray)', marginBottom: 48, fontSize: '0.95rem', fontFamily: 'var(--font-body)' }}
        >
          Select everything you brought for Visarjan. We'll find the right responsible drop point.
        </motion.p>

        {/* Step 1 — Item Selection */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="warm-card" style={{ padding: '28px 24px', marginBottom: 24 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, var(--saffron), var(--marigold))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>1</div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--plum)' }}>Select your materials</span>
          </div>
          <PillSelect items={ITEMS} selected={selected} onToggle={toggleItem} />
        </motion.div>

        {/* Step 2 — AI Analyzer */}
        <AnimatePresence>
          {showUnsure && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="warm-card"
              style={{ padding: '28px 24px', marginBottom: 24, overflow: 'hidden' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, var(--saffron), var(--marigold))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>AI</div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--plum)' }}>Material Analyzer</span>
              </div>

              {/* Upload Zone */}
              <div
                className={`upload-zone${dragOver ? ' drag-over' : ''}`}
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files[0]); }}
              >
                <div style={{ fontSize: 40, marginBottom: 12 }}>📸</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--plum)', marginBottom: 6 }}>
                  {uploadedFile ? uploadedFile.name : 'Drop a photo or tap to upload'}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--warm-gray)' }}>
                  Our AI will identify materials and risk levels
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleUpload(e.target.files[0])} />
              </div>

              {/* Shimmer loading */}
              <AnimatePresence>
                {analyzing && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ marginTop: 20, borderRadius: 12, overflow: 'hidden', height: 80 }}
                    className="shimmer"
                  >
                    <div style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,179,0,0.2)' }} />
                      <div>
                        <div style={{ height: 12, width: 140, borderRadius: 6, background: 'rgba(255,179,0,0.2)', marginBottom: 8 }} />
                        <div style={{ height: 8, width: 200, borderRadius: 6, background: 'rgba(255,179,0,0.15)' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results */}
              <AnimatePresence>
                {showResults && (
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {MOCK_ANALYSIS.map((item, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                          style={{ background: 'var(--warm-white)', border: '1px solid rgba(232,135,26,0.18)', borderRadius: 12, padding: '16px 18px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                            <div>
                              <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.88rem', fontWeight: 700, color: 'var(--plum)', marginBottom: 3 }}>{item.name}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--warm-gray)' }}>{item.material}</div>
                            </div>
                            <span className={`badge ${item.badge}`}>{item.risk}</span>
                          </div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--warm-gray)', lineHeight: 1.6 }}>{item.env}</div>
                        </motion.div>
                      ))}
                    </div>
                    <p style={{ marginTop: 14, fontSize: '0.72rem', color: 'rgba(255,245,224,0.35)', fontStyle: 'italic', textAlign: 'center' }}>
                      * AI assists, not certifies. Consult your NGO for confirmation.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 3 — Location */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="warm-card" style={{ padding: '28px 24px', marginBottom: 40 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, var(--saffron), var(--marigold))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>2</div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--plum)' }}>Your area in Delhi</span>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              className="vis-input"
              placeholder="Type your locality..."
              value={areaFilter}
              onChange={e => { setAreaFilter(e.target.value); setArea(''); setShowDropdown(true); }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              id="area-input"
            />
            <AnimatePresence>
              {showDropdown && areaFilter && filteredAreas.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute', top: '110%', left: 0, right: 0, zIndex: 50,
                    background: 'var(--warm-white)', border: '1px solid rgba(232,135,26,0.28)',
                    borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 32px rgba(61,26,58,0.14)',
                  }}
                >
                  {filteredAreas.slice(0, 6).map((a) => (
                    <button key={a} onMouseDown={() => { setArea(a); setAreaFilter(a); setShowDropdown(false); }}
                      style={{ display: 'block', width: '100%', padding: '11px 16px', textAlign: 'left', background: 'none', border: 'none', color: 'var(--warm-brown)', cursor: 'pointer', fontSize: '0.9rem', borderBottom: '1px solid rgba(232,135,26,0.12)', transition: 'background 0.15s', fontFamily: 'var(--font-body)' }}
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(232,135,26,0.08)'}
                      onMouseOut={e => e.currentTarget.style.background = 'none'}
                    >
                      📍 {a}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.45 }}
          style={{ textAlign: 'center' }}
        >
          <button
            className="cta-btn-warm"
            onClick={proceed}
            disabled={selected.filter(s => s !== 'unsure').length === 0}
            id="cta-show-map"
            style={{ opacity: selected.filter(s => s !== 'unsure').length === 0 ? 0.45 : 1 }}
          >
            Show me drop points →
          </button>
        </motion.div>
      </div>
    </div>
  );
}
