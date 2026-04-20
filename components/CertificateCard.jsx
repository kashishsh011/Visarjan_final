'use client';
import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const CertificateCard = forwardRef(function CertificateCard(
  { name, item, ngo, date, kgAmt }, ref
) {
  const dn = name || 'Your Name';
  const di = item || 'Pooja Materials';
  const dng = ngo || 'an Eco NGO';
  const dd = date || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const dk = kgAmt || '2.5';

  return (
    <div
      ref={ref}
      id="certificate-card"
      className="certificate-bg"
      style={{
        position: 'relative', width: '100%', maxWidth: 560, minHeight: 400,
        borderRadius: 16, border: '2px solid #FFB300', padding: '48px 40px',
        boxShadow: '0 0 48px rgba(255,179,0,0.18)', overflow: 'hidden',
        fontFamily: '"Tiro Devanagari Hindi", serif',
      }}
    >
      <div className="corner-flourish tl" />
      <div className="corner-flourish tr" />
      <div className="corner-flourish bl" />
      <div className="corner-flourish br" />

      {/* OM watermark */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)', fontSize: 160, opacity: 0.055,
        color: '#8B1A1A', userSelect: 'none', pointerEvents: 'none',
        fontFamily: 'serif', lineHeight: 1, zIndex: 0,
      }}>ॐ</div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            fontFamily: '"Cinzel Decorative", serif', fontSize: 'clamp(1rem, 3vw, 1.25rem)',
            color: '#8B1A1A', letterSpacing: '0.12em', fontWeight: 900, marginBottom: 4,
          }}>VISARJAN</div>
          <div style={{ fontSize: '0.72rem', color: '#6B4226', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            Certificate of Eco-Responsibility
          </div>
          <div style={{ marginTop: 12, height: 2, background: 'linear-gradient(90deg, transparent, #FFB300 30%, #FF6B00 70%, transparent)' }} />
        </div>

        <div style={{ textAlign: 'center', lineHeight: 2, color: '#3A2010', fontSize: '0.97rem' }}>
          <p>This certifies that</p>
          <motion.p key={dn} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
            style={{ fontFamily: '"Cinzel Decorative", serif', fontSize: 'clamp(1rem, 3vw, 1.3rem)', color: '#8B1A1A', fontWeight: 700 }}>
            {dn}
          </motion.p>
          <p>responsibly disposed</p>
          <motion.p key={di} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
            style={{ fontWeight: 700, color: '#6B2F00' }}>
            {di}
          </motion.p>
          <p>at</p>
          <motion.p key={dng} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
            style={{ fontWeight: 700, color: '#6B2F00' }}>
            {dng}
          </motion.p>
          <p>on <strong>{dd}</strong>,</p>
          <p>keeping <strong style={{ color: '#8B1A1A' }}>{dk} kg</strong> of pollutants from the Yamuna.</p>
        </div>

        <div style={{ marginTop: 28, paddingTop: 16, borderTop: '1px solid rgba(139,26,26,0.18)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: '#8B6914' }}>🌿 Protecting the Yamuna</div>
          <div style={{ fontSize: '0.72rem', color: '#8B6914' }}>visarjan.eco · Delhi {new Date().getFullYear()}</div>
        </div>
      </div>
    </div>
  );
});

export default CertificateCard;
