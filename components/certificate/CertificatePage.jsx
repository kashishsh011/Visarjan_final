'use client';   //certificate-page.js//
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import CertificateCard from '@/components/certificate/CertificateCard';
import { NGO_OPTIONS } from '@/lib/data';

const ITEM_OPTIONS = ['PoP Idol', 'Clay Idol', 'Flowers / Nirmalya', 'Coconut / Prasad', 'Full Pooja Set', 'Multiple Items'];
const KG_MAP = { 'PoP Idol': '4.2', 'Clay Idol': '1.8', 'Flowers / Nirmalya': '1.5', 'Coconut / Prasad': '0.8', 'Full Pooja Set': '6.5', 'Multiple Items': '5.0' };

export default function CertificatePage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [item, setItem] = useState('');
    const [ngo, setNgo] = useState('');
    const certRef = useRef(null);

    const kgAmt = KG_MAP[item] || '2.5';
    const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    const downloadPng = async () => {
        const html2canvas = (await import('html2canvas')).default;
        const el = certRef.current;
        if (!el) return;
        const canvas = await html2canvas(el, { scale: 2, backgroundColor: null, useCORS: true });
        const link = document.createElement('a');
        link.download = `Visarjan_Certificate_${name || 'Certificate'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        // Record drop-off in database
        if (name && item && ngo) {
            await fetch('/api/drop-offs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userName: name,
                    item,
                    ngoName: ngo,
                    weightKg: parseFloat(kgAmt),
                }),
            }).catch(() => { });
        }

        // Redirect to impact section on the home page so they can see the live update
        router.push('/#impact-section');
    };

    const shareWhatsApp = () => {
        const text = `🌿 I responsibly disposed ${item || 'pooja materials'} at ${ngo || 'an eco NGO'} via @VisarjanEco, keeping ${kgAmt} kg of pollutants out of the Yamuna! 🙏 #EcoVisarjan #SaveYamuna`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="page-wrapper" style={{ paddingTop: 80 }}>
            <div style={{ maxWidth: 1060, margin: '0 auto', padding: '60px 20px 40px' }}>

                {/* Back button */}
                <motion.a
                    href="/"
                    initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        fontSize: '0.85rem', color: 'var(--saffron)', textDecoration: 'none',
                        fontFamily: 'var(--font-body)', fontWeight: 500, marginBottom: 24,
                        cursor: 'pointer',
                    }}
                >
                    ← Back to Home
                </motion.a>

                {/* Header */}
                <motion.h1
                    initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55 }}
                    className="section-title"
                    style={{ marginBottom: 8 }}
                >
                    Your Eco Certificate
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                    style={{ color: 'var(--warm-gray)', marginBottom: 48, fontSize: '0.92rem', fontFamily: 'var(--font-body)' }}
                >
                    Fill in your details and download your personalised certificate of eco-responsibility.
                </motion.p>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px,1fr) minmax(300px,1.4fr)', gap: 36, alignItems: 'start' }}>

                    {/* Left — Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.55 }}
                        className="warm-card" style={{ padding: '32px 28px' }}
                    >
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--plum)', marginBottom: 24 }}>
                            Your Details
                        </div>

                        <div style={{ marginBottom: 18 }}>
                            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--warm-gray)', marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>Full Name</label>
                            <input className="vis-input" placeholder="E.g. Priya Sharma" value={name} onChange={e => setName(e.target.value)} id="cert-name" />
                        </div>

                        <div style={{ marginBottom: 18 }}>
                            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--warm-gray)', marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>What did you dispose?</label>
                            <div style={{ position: 'relative' }}>
                                <select className="vis-select" value={item} onChange={e => setItem(e.target.value)} id="cert-item">
                                    <option value="">Select item...</option>
                                    {ITEM_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                </select>
                                <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--saffron)', fontSize: 12 }}>▼</div>
                            </div>
                        </div>

                        <div style={{ marginBottom: 28 }}>
                            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--warm-gray)', marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>Which NGO did you visit?</label>
                            <div style={{ position: 'relative' }}>
                                <select className="vis-select" value={ngo} onChange={e => setNgo(e.target.value)} id="cert-ngo">
                                    <option value="">Select NGO...</option>
                                    {NGO_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                </select>
                                <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--saffron)', fontSize: 12 }}>▼</div>
                            </div>
                        </div>

                        {/* Impact info */}
                        {item && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                style={{ padding: '14px 16px', background: 'rgba(232,135,26,0.08)', borderRadius: 12, marginBottom: 24, border: '1px solid rgba(232,135,26,0.22)' }}>
                                <div style={{ fontSize: '0.78rem', color: 'var(--warm-gray)', marginBottom: 4, fontFamily: 'var(--font-body)' }}>Estimated impact</div>
                                <div style={{ fontSize: '1.6rem', fontFamily: 'var(--font-display)', color: 'var(--plum)', fontWeight: 900 }}>
                                    {kgAmt} kg
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--warm-gray)', fontFamily: 'var(--font-body)' }}>of pollutants kept from the Yamuna</div>
                            </motion.div>
                        )}

                        {/* Action buttons */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <button className="cta-btn-warm" onClick={downloadPng} id="btn-download"
                                style={{ justifyContent: 'center', width: '100%' }}>
                                📥 Download as PNG
                            </button>
                            <button onClick={shareWhatsApp} id="btn-whatsapp"
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                    padding: '13px 24px', borderRadius: 50, border: '2px solid #25D366',
                                    color: '#25D366', fontFamily: '"Cinzel Decorative", serif', fontSize: '0.82rem',
                                    cursor: 'pointer', background: 'transparent', transition: 'all 0.28s', letterSpacing: '0.04em',
                                }}
                                onMouseOver={e => { e.currentTarget.style.background = '#25D366'; e.currentTarget.style.color = 'white'; }}
                                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#25D366'; }}
                            >
                                📱 Share on WhatsApp
                            </button>
                        </div>
                    </motion.div>

                    {/* Right — Certificate preview */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.55 }}
                    >
                        <div style={{ fontSize: '0.72rem', color: 'rgba(107,91,78,0.45)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14, textAlign: 'center', fontFamily: 'var(--font-body)' }}>
                            Live Preview
                        </div>
                        <CertificateCard
                            ref={certRef}
                            name={name}
                            item={item}
                            ngo={ngo}
                            date={today}
                            kgAmt={kgAmt}
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
