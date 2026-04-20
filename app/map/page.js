'use client';
import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

const MapClient = dynamic(() => import('@/components/MapClient'), { ssr: false });

const ALL_MATERIALS = ['Flowers', 'Nirmalya', 'PoP Idol', 'Clay Idol', 'Full Pooja Set', 'Coconut', 'Prasad'];

function showToast(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

function MapPageInner() {
  const params = useSearchParams();
  const [filters, setFilters] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    const mats = params.getAll('m');
    if (mats.length > 0) {
      // map pill IDs to material names
      const map = { pop: 'PoP Idol', clay: 'Clay Idol', flowers: 'Flowers', coconut: 'Coconut', fullset: 'Full Pooja Set' };
      setFilters(mats.map(m => map[m]).filter(Boolean));
    }
  }, [params]);

  const toggleFilter = (mat) => {
    setFilters(prev => prev.includes(mat) ? prev.filter(f => f !== mat) : [...prev, mat]);
  };

  const handleNotify = () => {
    if (!name.trim()) return;
    const existing = JSON.parse(localStorage.getItem('visarjan_signups') || '[]');
    existing.push({ name, phone, ts: Date.now() });
    localStorage.setItem('visarjan_signups', JSON.stringify(existing));
    setNotified(true);
    showToast('✅ NGO notified! We\'ll reach out before your visit.');
  };

  return (
    <div className="page-wrapper" style={{ paddingTop: 80 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 20px 40px' }}>

        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="section-title"
          style={{ marginBottom: 8 }}
        >
          Drop Points Near You
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          style={{ color: 'var(--warm-gray)', marginBottom: 28, fontSize: '0.92rem', fontFamily: 'var(--font-body)' }}
        >
          8 verified eco-drop centres across Delhi · Tap a marker for details
        </motion.p>

        {/* Filter chips */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}
        >
          {ALL_MATERIALS.map(mat => (
            <button key={mat} onClick={() => toggleFilter(mat)}
              className={`pill-btn${filters.includes(mat) ? ' selected' : ''}`}
              style={{ padding: '7px 14px', fontSize: '0.82rem' }}
              id={`filter-${mat.replace(/\s/g, '-')}`}
            >
              {mat}
            </button>
          ))}
          {filters.length > 0 && (
            <button onClick={() => setFilters([])} className="pill-btn"
              style={{ padding: '7px 14px', fontSize: '0.82rem', borderColor: 'rgba(192,57,43,0.35)', color: 'var(--sacred-red)' }}>
              ✕ Clear
            </button>
          )}
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.55 }}
          style={{ height: 'clamp(380px, 55vh, 560px)', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(232,135,26,0.22)', boxShadow: '0 8px 40px rgba(61,26,58,0.12)' }}
        >
          <MapClient filterMaterials={filters} />
        </motion.div>

        {/* Soft signup prompt */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="warm-card"
          style={{ marginTop: 36, padding: '32px 28px' }}
        >
          <AnimatePresence mode="wait">
            {!notified ? (
              <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--plum)', marginBottom: 6 }}>
                    Want the NGO to know you’re coming?
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--warm-gray)' }}>
                    Leave your name and the NGO will be ready with dedicated staff.
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
                  <input className="vis-input" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} id="notify-name" />
                  <input className="vis-input" placeholder="Phone (optional)" value={phone} onChange={e => setPhone(e.target.value)} id="notify-phone" />
                </div>
                <button className="cta-btn-warm" onClick={handleNotify} id="notify-btn">
                  Notify NGO 🔔
                </button>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
                style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--plum)', marginBottom: 8 }}>
                  You're all set, {name}!
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--warm-gray)' }}>
                  The NGO team will be notified. See you at the drop point!
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense>
      <MapPageInner />
    </Suspense>
  );
}
