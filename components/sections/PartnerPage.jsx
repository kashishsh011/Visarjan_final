'use client';          //partner-page.js//
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DELHI_AREAS = ['Connaught Place', 'Lajpat Nagar', 'Dwarka', 'Rohini', 'Saket', 'Janakpuri', 'Pitampura', 'Karol Bagh', 'Greater Kailash', 'Vasant Kunj', 'Nehru Place', 'Preet Vihar', 'Rajouri Garden', 'Punjabi Bagh', 'Noida Sec 18'];
const MATERIALS = ['Flowers / Nirmalya', 'PoP Idol', 'Clay Idol', 'Coconut / Prasad', 'Full Pooja Set'];

const ROADMAP = [
    { icon: '📱', title: 'QR Verification', desc: 'Scan to confirm your drop, earn verified eco-points.' },
    { icon: '📊', title: 'Real-time NGO Dashboard', desc: 'NGOs see live incoming drop requests and capacity.' },
    { icon: '🌆', title: 'City Expansion', desc: 'Mumbai, Pune, Hyderabad — beyond Delhi in 2025.' },
];

function showToast(msg) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3200);
}

export default function PartnerPage() {
    // Citizen form
    const [cName, setCName] = useState('');
    const [cPhone, setCPhone] = useState('');
    const [cArea, setCArea] = useState('');
    const [cDone, setCDone] = useState(false);

    // NGO form
    const [oName, setOName] = useState('');
    const [oContact, setOContact] = useState('');
    const [oArea, setOArea] = useState('');
    const [oMats, setOMats] = useState([]);
    const [oTiming, setOTiming] = useState('');
    const [oEmail, setOEmail] = useState('');
    const [oDone, setODone] = useState(false);

    const submitCitizen = () => {
        if (!cName.trim()) return;
        const data = JSON.parse(localStorage.getItem('visarjan_citizens') || '[]');
        data.push({ name: cName, phone: cPhone, area: cArea, ts: Date.now() });
        localStorage.setItem('visarjan_citizens', JSON.stringify(data));
        setCDone(true);
        showToast('✅ You\'re on the list!');
    };

    const submitNgo = () => {
        if (!oName.trim() || !oEmail.trim()) return;
        const data = JSON.parse(localStorage.getItem('visarjan_ngos') || '[]');
        data.push({ org: oName, contact: oContact, area: oArea, materials: oMats, timing: oTiming, email: oEmail, ts: Date.now() });
        localStorage.setItem('visarjan_ngos', JSON.stringify(data));
        setODone(true);
        showToast('🌿 NGO registered! We\'ll be in touch soon.');
    };

    const toggleMat = (mat) => setOMats(prev => prev.includes(mat) ? prev.filter(m => m !== mat) : [...prev, mat]);

    return (
        <div className="page-wrapper" style={{ paddingTop: 80 }}>
            <div style={{ maxWidth: 1000, margin: '0 auto', padding: '60px 20px 40px' }}>

                {/* Header */}
                <motion.h1
                    initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55 }}
                    className="section-title"
                    style={{ marginBottom: 8 }}
                >
                    Join the Movement
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                    style={{ color: 'var(--warm-gray)', marginBottom: 48, fontSize: '0.92rem', fontFamily: 'var(--font-body)' }}
                >
                    Whether you're a citizen or an NGO, there's a place for you in Visarjan.
                </motion.p>

                {/* Two cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 80 }}>

                    {/* Card 1 — Citizen */}
                    <motion.div
                        initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.55 }}
                        className="partner-card"
                    >
                        <div style={{ fontFamily: '"Cinzel Decorative", serif', fontSize: '1.1rem', color: '#FFB300', marginBottom: 6 }}>
                            🏘 Citizens
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'rgba(255,245,224,0.5)', marginBottom: 24 }}>
                            Get notified of upcoming eco-drives in your area
                        </div>

                        <AnimatePresence mode="wait">
                            {!cDone ? (
                                <motion.div key="cform" exit={{ opacity: 0 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                                        <input className="vis-input" placeholder="Your name *" value={cName} onChange={e => setCName(e.target.value)} id="citizen-name" />
                                        <input className="vis-input" placeholder="Phone number" value={cPhone} onChange={e => setCPhone(e.target.value)} id="citizen-phone" />
                                        <div style={{ position: 'relative' }}>
                                            <select className="vis-select" value={cArea} onChange={e => setCArea(e.target.value)} id="citizen-area">
                                                <option value="">Select your Delhi area...</option>
                                                {DELHI_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                                            </select>
                                            <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--saffron)', fontSize: 12 }}>▼</div>
                                        </div>
                                    </div>
                                    <button className="cta-btn-warm" onClick={submitCitizen} id="citizen-submit">
                                        Get notified of drives ✨
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div key="csuccess" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                    style={{ textAlign: 'center', padding: '24px 0' }}>
                                    <div style={{ fontSize: 52, marginBottom: 14 }}>🙏</div>
                                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--plum)', marginBottom: 8 }}>
                                        Namaste, {cName}!
                                    </div>
                                    <div style={{ fontSize: '0.82rem', color: 'var(--warm-gray)', lineHeight: 1.7 }}>
                                        You'll get a heads-up before every eco-drive in {cArea || 'your area'}.
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Card 2 — NGO */}
                    <motion.div
                        initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.55 }}
                        className="partner-card"
                    >
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--plum)', marginBottom: 6 }}>
                            🌿 NGO / Organisation
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--warm-gray)', marginBottom: 24 }}>
                            List your drop point and reach thousands of families
                        </div>

                        <AnimatePresence mode="wait">
                            {!oDone ? (
                                <motion.div key="oform" exit={{ opacity: 0 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
                                        <input className="vis-input" placeholder="Organisation name *" value={oName} onChange={e => setOName(e.target.value)} id="ngo-name" />
                                        <input className="vis-input" placeholder="Contact person" value={oContact} onChange={e => setOContact(e.target.value)} id="ngo-contact" />
                                        <div style={{ position: 'relative' }}>
                                            <select className="vis-select" value={oArea} onChange={e => setOArea(e.target.value)} id="ngo-area">
                                                <option value="">Area in Delhi...</option>
                                                {DELHI_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                                            </select>
                                            <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#FFB300', fontSize: 12 }}>▼</div>
                                        </div>
                                        <input className="vis-input" placeholder="Operating hours (e.g. 7am–8pm)" value={oTiming} onChange={e => setOTiming(e.target.value)} id="ngo-timing" />
                                        <input className="vis-input" placeholder="Email address *" type="email" value={oEmail} onChange={e => setOEmail(e.target.value)} id="ngo-email" />
                                    </div>

                                    <div style={{ marginBottom: 20 }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--warm-gray)', marginBottom: 10, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>
                                            Materials accepted
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                            {MATERIALS.map(mat => (
                                                <button key={mat} onClick={() => toggleMat(mat)}
                                                    className={`pill-btn${oMats.includes(mat) ? ' selected' : ''}`}
                                                    style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                                                    id={`ngo-mat-${mat.replace(/\s/g, '-')}`}
                                                >
                                                    {mat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <button className="cta-btn-warm" onClick={submitNgo} id="ngo-submit">
                                        Register NGO →
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div key="osuccess" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                    style={{ textAlign: 'center', padding: '24px 0' }}>
                                    <div style={{ fontSize: 52, marginBottom: 14 }}>🌿</div>
                                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--plum)', marginBottom: 8 }}>
                                        Welcome, {oName}!
                                    </div>
                                    <div style={{ fontSize: '0.82rem', color: 'var(--warm-gray)', lineHeight: 1.7 }}>
                                        Your drop point will go live on the Visarjan map. Our team will verify and onboard you within 24 hours.
                                    </div>
                                    <div style={{ marginTop: 16, padding: '10px 16px', borderRadius: 10, background: 'rgba(232,135,26,0.08)', border: '1px solid rgba(232,135,26,0.22)', fontSize: '0.78rem', color: 'var(--warm-gray)' }}>
                                        📧 Check {oEmail} for confirmation
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* Roadmap */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.55 }}
                >
                    <div style={{ textAlign: 'center', marginBottom: 40 }}>
                        <div className="section-title" style={{ textAlign: 'center' }}>What's Coming</div>
                    </div>

                    <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center', position: 'relative' }}>
                        {ROADMAP.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 28 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-60px' }}
                                transition={{ delay: i * 0.14, duration: 0.5 }}
                                style={{ flex: '1 1 200px', maxWidth: 260, textAlign: 'center' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                                    <div className="timeline-dot">{item.icon}</div>
                                </div>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--plum)', fontWeight: 700, marginBottom: 8 }}>
                                    {item.title}
                                </div>
                                <div style={{ fontSize: '0.82rem', color: 'var(--warm-gray)', lineHeight: 1.7 }}>
                                    {item.desc}
                                </div>
                                {i < ROADMAP.length - 1 && (
                                    <div style={{ marginTop: 24, fontSize: 20, color: 'rgba(232,135,26,0.4)' }}>→</div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
