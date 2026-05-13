'use client';          //partner-page.js//
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signIn, signOut } from 'next-auth/react';
import { ALL_INDIA_AREAS } from '@/lib/data';

const MATERIALS = ['Flowers / Nirmalya', 'PoP Idol', 'Clay Idol', 'Coconut / Prasad', 'Full Pooja Set'];


function showToast(msg) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3200);
}

export default function PartnerPage() {
    const { data: session, status } = useSession();
    const [userRole, setUserRole] = useState(null);
    const [authIntent, setAuthIntent] = useState(null); // 'citizen' | 'ngo' | null

    // Fetch user role when signed in
    useEffect(() => {
        if (session) {
            fetch('/api/users/me')
                .then(r => r.json())
                .then(res => {
                    if (res.success) setUserRole(res.data.role);
                })
                .catch(() => { });
        }
    }, [session]);

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

    // Pre-fill form fields when session loads
    useEffect(() => {
        if (session && !cName) setCName(session.user.name || '');
        if (session && !oName) setOName(session.user.name || '');
        if (session && !oEmail) setOEmail(session.user.email || '');
    }, [session]);

    const submitCitizen = async () => {
        if (!cName.trim()) return;
        fetch('/api/citizens', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: cName, phone: cPhone, area: cArea }),
        }).catch(() => { });
        // Update user role
        await fetch('/api/users/me', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: 'citizen' }),
        }).catch(() => { });
        setUserRole('citizen');
        setCDone(true);
        showToast('✅ You\'re on the list!');
    };

    const submitNgo = async () => {
        if (!oName.trim() || !oEmail.trim()) return;
        fetch('/api/ngos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: oName, email: oEmail, area: oArea, materials: oMats, timing: oTiming, phone: oContact, lat: 0, lng: 0 }),
        }).catch(() => { });
        // Update user role
        await fetch('/api/users/me', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: 'ngo_admin' }),
        }).catch(() => { });
        setUserRole('ngo_admin');
        setODone(true);
        showToast('🌿 NGO registered! We\'ll be in touch soon.');
    };

    const toggleMat = (mat) => setOMats(prev => prev.includes(mat) ? prev.filter(m => m !== mat) : [...prev, mat]);

    const isSignedIn = status !== 'loading' && !!session;
    const isSignedOut = status !== 'loading' && !session;

    // Render auth gate button for a card
    const renderAuthGate = (intent) => (
        <motion.div key="auth-gate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--warm-gray)', marginBottom: 20, lineHeight: 1.7, fontFamily: 'var(--font-body)' }}>
                Sign in to get started
            </div>
            <button
                className="cta-btn-warm"
                onClick={() => { setAuthIntent(intent); signIn('google'); }}
                id={`${intent}-auth-btn`}
            >
                Sign in with Google to continue
            </button>
        </motion.div>
    );

    // Render "already registered" state
    const renderRegistered = (roleLabel) => (
        <motion.div key="registered" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 42, marginBottom: 14 }}>✓</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--plum)', marginBottom: 8 }}>
                You're registered as {roleLabel}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--warm-gray)', lineHeight: 1.7, marginBottom: 16 }}>
                {session.user.name} · {session.user.email}
            </div>
            <button
                onClick={() => signOut()}
                style={{ fontSize: '0.82rem', color: 'var(--saffron)', background: 'none', border: '1px solid rgba(232,135,26,0.3)', borderRadius: 8, padding: '6px 16px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
            >
                Sign out
            </button>
        </motion.div>
    );

    // Determine what to show in citizen card
    const renderCitizenContent = () => {
        if (isSignedOut) return renderAuthGate('citizen');
        if (isSignedIn && userRole === 'citizen') return renderRegistered('a Citizen');
        // Signed in, no role yet (or different role) — show form
        if (!cDone) {
            return (
                <motion.div key="cform" exit={{ opacity: 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                        <input className="vis-input" placeholder="Your name *" value={cName} onChange={e => setCName(e.target.value)} id="citizen-name" />
                        <input className="vis-input" placeholder="Phone number" value={cPhone} onChange={e => setCPhone(e.target.value)} id="citizen-phone" />
                        <div style={{ position: 'relative' }}>
                            <select className="vis-select" value={cArea} onChange={e => setCArea(e.target.value)} id="citizen-area">
                                <option value="">Select your area...</option>
                                {ALL_INDIA_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                            <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--saffron)', fontSize: 12 }}>▼</div>
                        </div>
                    </div>
                    <button className="cta-btn-warm" onClick={submitCitizen} id="citizen-submit">
                        Get notified of drives ✨
                    </button>
                </motion.div>
            );
        }
        return (
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
        );
    };

    // Determine what to show in NGO card
    const renderNgoContent = () => {
        if (isSignedOut) return renderAuthGate('ngo');
        if (isSignedIn && userRole === 'ngo_admin') return renderRegistered('an NGO / Organisation');
        // Signed in, no role yet — show form
        if (!oDone) {
            return (
                <motion.div key="oform" exit={{ opacity: 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
                        <input className="vis-input" placeholder="Organisation name *" value={oName} onChange={e => setOName(e.target.value)} id="ngo-name" />
                        <input className="vis-input" placeholder="Contact person" value={oContact} onChange={e => setOContact(e.target.value)} id="ngo-contact" />
                        <div style={{ position: 'relative' }}>
                            <select className="vis-select" value={oArea} onChange={e => setOArea(e.target.value)} id="ngo-area">
                                <option value="">Area in India...</option>
                                {ALL_INDIA_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
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
            );
        }
        return (
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
                <div style={{ marginTop: 12, fontSize: '0.78rem', color: 'var(--warm-gray)', lineHeight: 1.7, fontStyle: 'italic' }}>
                    Your drop point is under review — we'll verify and list it on the map within 48 hours.
                </div>
            </motion.div>
        );
    };

    return (
        <div className="page-wrapper" style={{ paddingTop: 80 }}>
            <div style={{ maxWidth: 1000, margin: '0 auto', padding: '60px 20px 40px' }}>

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
                            {renderCitizenContent()}
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
                            {renderNgoContent()}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
