'use client';    //app-page.js//
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import ScrollCanvasHero from '@/components/canvas/ScrollCanvasHero';
import WhatDoYouHave from '@/components/sections/WhatDoYouHave';
import SectionNav from '@/components/sections/SectionNav';
import DropPointsSection from '@/components/sections/DropPointsSection';
import { COMMUNITY_CARDS } from '@/lib/data';

/* ── Data ─────────────────────────────────────────── */

const ITEM_PILLS = [
    { emoji: '🏺', label: 'PoP Idol' },
    { emoji: '🪔', label: 'Clay Idol' },
    { emoji: '🌸', label: 'Flowers / Nirmalya' },
    { emoji: '🥥', label: 'Coconut / Prasad' },
    { emoji: '🧺', label: 'Full Pooja Set' },
    { emoji: '❓', label: 'Not Sure → AI Analyzer' },
];

const PARTNERS = [
    { name: 'Phool', emoji: '🌺', desc: 'Flowers → incense & bio-products' },
    { name: 'eCoexist', emoji: '♻️', desc: 'PoP collection & landfill diversion' },
    { name: 'HolyWaste', emoji: '💧', desc: 'Yamuna water quality monitoring' },
    { name: 'Sampurnam', emoji: '🌿', desc: 'Zero-waste Ganesh festival kits' },
];

const IMPACT_STATS = [
    { val: '2.3T', lbl: 'kg PoP kept out of Yamuna' },
    { val: '18,400', lbl: 'Families served' },
    { val: '94K', lbl: 'Flowers converted by Phool' },
    { val: '312', lbl: 'NGO drop points mapped' },
];

const WHY_CARDS = [
    {
        title: 'Abandoned in Plain Sight',
        desc: 'Broken murtis under trees. Nirmalya heaped at temple gates. Pooja waste left at street corners with nowhere to go. Sacred by intention, forgotten by system.',
        img: '/images/why-card-1.jpg', // Uploaded image
    },
    {
        title: 'Our Rivers Are Paying the Price',
        desc: 'PoP never dissolves, it sinks releasing lead and mercury into water we call holy. Flowers consume oxygen. What enters the river as offering leaves as poison.',
        img: '/images/why-card-2.jpg', // Uploaded image
    },
    {
        title: 'Faith Can Be Sustainable',
        desc: 'Flowers become compost. Coconut shells become fuel. Idol clay returns to earth. When sacred waste finds the right hands, nothing is wasted and nothing is lost.',
        img: '/images/why-card-3.jpg', // Uploaded image
    },
];

/* ── Components ───────────────────────────────────── */

function SectionDivider() {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: 16,
            padding: '0 clamp(20px,5vw,80px)', marginBottom: 48,
        }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(232,135,26,0.3))' }} />
            <span style={{ color: 'var(--saffron)', fontSize: '1.2rem' }}>◆</span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(232,135,26,0.3), transparent)' }} />
        </div>
    );
}

function CounterStrip() {
    const [live, setLive] = useState(null)
    useEffect(() => {
        fetch('/api/stats', { cache: 'no-store' })
            .then(r => r.json())
            .then(res => { if (res.success) setLive(res.data) })
            .catch(() => { })
    }, [])

    const stats = live
        ? [
            { val: live.totalWeightKg >= 1000 ? (live.totalWeightKg / 1000).toFixed(1) + 'T' : String(live.totalWeightKg), lbl: 'kg PoP kept out of Yamuna' },
            { val: live.totalDropOffs.toLocaleString(), lbl: 'Families served' },
            { val: IMPACT_STATS[2].val, lbl: 'Flowers converted by Phool' },
            { val: String(live.totalNGOs), lbl: 'NGO drop points mapped' },
        ]
        : IMPACT_STATS

    return (
        <div className="impact-strip">
            {stats.map(s => (
                <div key={s.lbl} className="impact-counter">
                    <div className="val">{s.val}</div>
                    <div className="lbl">{s.lbl}</div>
                </div>
            ))}
        </div>
    );
}

function LiveImpactGrid() {
    const [liveCards, setLiveCards] = useState([])
    useEffect(() => {
        fetch('/api/stats', { cache: 'no-store' })
            .then(r => r.json())
            .then(res => {
                if (res.success && res.data.recentDropOffs && res.data.recentDropOffs.length > 0) {
                    setLiveCards(res.data.recentDropOffs.slice(0, 6))
                }
            })
            .catch(() => { })
    }, [])

    const getIcon = (item) => ({
        'PoP Idol': '⚱️',
        'Clay Idol': '🏺',
        'Flowers / Nirmalya': '🌸',
        'Coconut / Prasad': '🥥',
        'Full Pooja Set': '🙏',
        'Multiple Items': '🌿'
    }[item] || '🌱');

    const displayCards = liveCards.length > 0
        ? liveCards.map((drop) => ({
            name: drop.userName,
            area: drop.ngoName,
            caption: drop.item,
            emoji: getIcon(drop.item),
        }))
        : COMMUNITY_CARDS.slice(0, 6).map(c => ({
            name: c.name,
            area: c.area,
            caption: c.material,
            emoji: getIcon(c.material),
        }))

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 48 }}>
            {displayCards.map((item, i) => (
                <div key={i} className="warm-card" style={{ padding: '24px 20px', borderRadius: 16, background: 'var(--warm-white)', border: '1.5px solid rgba(232,135,26,0.22)' }}>
                    <div style={{ fontSize: 32, marginBottom: 10 }}>{item.emoji}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.92rem', color: 'var(--plum)', fontWeight: 700, marginBottom: 4 }}>
                        {item.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--warm-gray)', marginBottom: 6 }}>
                        📍 {item.area}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--warm-brown)' }}>
                        Disposed: <strong>{item.caption}</strong>
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ── Page ─────────────────────────────────────────── */

export default function LandingPage() {
    const discoverRef = useRef(null);

    return (
        <div style={{ background: 'var(--bg-pink)' }}>
            <SectionNav />

            {/* ════════════════════════════════════════════════
          ZONE A — Scroll Canvas Hero (400vh)
      ════════════════════════════════════════════════ */}
            <ScrollCanvasHero />

            {/* ════════════════════════════════════════════════
          SECTION 1.5 — WHY THIS MATTERS (about anchor)
      ════════════════════════════════════════════════ */}
            <section id="about" style={{ background: 'var(--warm-white)', padding: 'clamp(60px,8vw,100px) clamp(20px,5vw,80px)' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 56 }}>
                        <h2 className="section-title">Why This Matters?</h2>
                        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--warm-gray)', marginTop: 14, maxWidth: 550, margin: '14px auto 0' }}>
                            Devotion is daily. So is the waste it leaves behind. We're here for both.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: 24 }}>
                        {WHY_CARDS.map((card, i) => (
                            <div
                                key={i}
                                className="warm-card why-hover-card"
                                style={{
                                    position: 'relative',
                                    height: '340px',
                                    padding: 0,
                                    overflow: 'hidden',
                                    borderRadius: '16px',
                                    border: '1.5px solid rgba(232,135,26,0.22)'
                                }}
                            >
                                {/* Background Image */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    backgroundImage: `url(${card.img})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    transition: 'transform 0.5s ease',
                                }} className="why-card-img" />

                                {/* Gradient Overlay to make image pop slightly */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    background: 'linear-gradient(to top, rgba(61,26,58,0.2), transparent)',
                                }} />

                                {/* Teaser Overlay (Visible before hover) */}
                                <div
                                    className="why-teaser"
                                    style={{
                                        position: 'absolute',
                                        bottom: 0, left: 0, right: 0,
                                        padding: '50px 24px 24px',
                                        background: 'linear-gradient(to top, rgba(61,26,58,0.9) 0%, rgba(61,26,58,0.6) 40%, transparent 100%)',
                                        textAlign: 'center',
                                        transition: 'opacity 0.3s ease',
                                    }}
                                >
                                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'white', marginBottom: 4 }}>
                                        {card.title}
                                    </h3>
                                    <p style={{ fontFamily: 'var(--font-hindi)', fontSize: '0.95rem', color: 'rgba(255,255,255,0.75)' }}>
                                        {card.hindi}
                                    </p>
                                </div>

                                {/* Text Content (Fades in on hover) */}
                                <div
                                    className="why-card-content"
                                    style={{
                                        position: 'absolute',
                                        top: 0, left: 0, right: 0, bottom: 0,
                                        padding: '40px 30px',
                                        background: 'rgba(255,249,242,0.95)', // warm-white semi-transparent
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        opacity: 0,
                                        transition: 'opacity 0.3s ease',
                                    }}
                                >
                                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--plum)', marginBottom: 8 }}>
                                        {card.title}
                                    </h3>
                                    <p style={{ fontFamily: 'var(--font-hindi)', fontSize: '0.95rem', color: 'var(--saffron)', marginBottom: 16 }}>
                                        {card.hindi}
                                    </p>
                                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: 'var(--warm-gray)', lineHeight: 1.7 }}>
                                        {card.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <style jsx>{`
                        .why-hover-card:hover .why-card-img {
                            transform: scale(1.05);
                        }
                        .why-hover-card:hover .why-card-content {
                            opacity: 1 !important;
                        }
                        .why-hover-card:hover .why-teaser {
                            opacity: 0;
                        }
                    `}</style>
                </div>
            </section>

            <SectionDivider />

            {/* ════════════════════════════════════════════════
          SECTION 2 — WHAT DO YOU HAVE? (Discovery)
      ════════════════════════════════════════════════ */}
            <section id="what-do-you-have" ref={discoverRef} style={{ padding: 'clamp(60px,8vw,100px) clamp(20px,5vw,80px)', background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(232,135,26,0.08) 0%, var(--bg-pink) 70%)' }}>
                <WhatDoYouHave />
            </section>

            <SectionDivider />

            {/* ════════════════════════════════════════════════
          SECTION 3 — DROP POINTS (smart, URL-driven)
      ════════════════════════════════════════════════ */}
            <DropPointsSection />

            <SectionDivider />

            {/* ════════════════════════════════════════════════
          SECTION 4 — IMPACT WALL
      ════════════════════════════════════════════════ */}
            <section id="impact-section">
                <CounterStrip />

                <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(60px,8vw,100px) clamp(20px,5vw,80px)' }}>
                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                        <h2 className="section-title">Community Impact</h2>
                        <p style={{ fontFamily: 'var(--font-hindi)', color: 'var(--saffron)', marginTop: 6, fontSize: '1.05rem' }}>
                            सामुदायिक प्रभाव
                        </p>
                        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--warm-gray)', marginTop: 12, maxWidth: 480, margin: '12px auto 0' }}>
                            Thousands of families across India choosing the responsible path. Here's what we've achieved together.
                        </p>
                    </div>

                    <LiveImpactGrid />

                    {/* Partner logos */}
                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                        <p style={{
                            fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                            color: 'rgba(107,91,78,0.55)', textTransform: 'uppercase',
                            letterSpacing: '0.1em', marginBottom: 24,
                        }}>
                            Our Partners
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
                            {PARTNERS.map(p => (
                                <div key={p.name} style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    padding: '12px 24px', borderRadius: 50,
                                    border: '1.5px solid rgba(232,135,26,0.22)',
                                    background: 'var(--warm-white)',
                                }}>
                                    <span style={{ fontSize: 22 }}>{p.emoji}</span>
                                    <div>
                                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--plum)', fontSize: '0.95rem' }}>{p.name}</div>
                                        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--warm-gray)' }}>{p.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <SectionDivider />

            {/* ════════════════════════════════════════════════
          SECTION 5 — MY CERTIFICATE
      ════════════════════════════════════════════════ */}
            <section id="certificate-section" style={{ background: 'var(--warm-white)', padding: 'clamp(60px,8vw,100px) clamp(20px,5vw,80px)' }}>
                <div style={{ maxWidth: 860, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 44 }}>
                        <h2 className="section-title">My Impact Certificate</h2>
                        <p style={{ fontFamily: 'var(--font-hindi)', color: 'var(--saffron)', marginTop: 6, fontSize: '1.05rem' }}>
                            प्रभाव प्रमाण पत्र
                        </p>
                        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--warm-gray)', marginTop: 12, maxWidth: 480, margin: '12px auto 0' }}>
                            Receive a beautifully designed certificate documenting your contribution. Download as PNG or share on WhatsApp.
                        </p>
                    </div>

                    {/* Certificate preview */}
                    <div className="certificate-bg" style={{ position: 'relative', padding: '48px 40px', textAlign: 'center' }}>
                        <div className="corner-flourish tl" />
                        <div className="corner-flourish tr" />
                        <div className="corner-flourish bl" />
                        <div className="corner-flourish br" />

                        <p style={{ fontFamily: 'var(--font-hindi)', color: 'var(--saffron)', fontSize: '1.1rem', marginBottom: 8 }}>
                            विसर्जन प्रमाण पत्र
                        </p>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', fontWeight: 700, color: 'var(--plum)' }}>
                            Certificate of Responsible Visarjan
                        </h3>

                        <div style={{ margin: '28px 0', padding: '20px', background: 'rgba(232,135,26,0.07)', borderRadius: 12 }}>
                            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--warm-gray)', fontSize: '1rem', lineHeight: 1.8 }}>
                                This certifies that <strong style={{ color: 'var(--plum)' }}>[Your Name]</strong> responsibly disposed their
                                <strong style={{ color: 'var(--plum)' }}> [Idol Type]</strong> through
                                <strong style={{ color: 'var(--plum)' }}> [NGO Name]</strong>,
                                keeping <strong style={{ color: 'var(--saffron)' }}>2.3 kg of PoP</strong> out of the Yamuna river.
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link href="/certificate" className="cta-btn-warm" id="gen-certificate" style={{ textDecoration: 'none' }}>
                                Generate Mine →
                            </Link>
                            <button
                                className="cta-btn-warm"
                                id="share-whatsapp"
                                style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
                                onClick={() => window.open('https://wa.me/?text=I+responsibly+disposed+my+Ganesh+idol+via+Visarjan!', '_blank')}
                            >
                                📱 Share on WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <SectionDivider />

            {/* ════════════════════════════════════════════════
          SECTION 6 — PARTNER PORTAL
      ════════════════════════════════════════════════ */}
            <section id="partner-section" style={{ padding: 'clamp(60px,8vw,100px) clamp(20px,5vw,80px)' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                        <h2 className="section-title">Join the Movement</h2>
                        <p style={{ fontFamily: 'var(--font-hindi)', color: 'var(--saffron)', marginTop: 6, fontSize: '1.05rem' }}>
                            साझेदार बनें — नागरिक या संस्था
                        </p>
                        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--warm-gray)', marginTop: 12, maxWidth: 480, margin: '12px auto 0' }}>
                            Whether you're an individual devotee or an NGO managing collection drives — there's a role for you.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: 28 }}>
                        {/* Citizen card */}
                        <div className="partner-card">
                            <div style={{ fontSize: 36, marginBottom: 16 }}>🙏</div>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--plum)', marginBottom: 8 }}>
                                I'm a Citizen
                            </h3>
                            <p style={{ fontFamily: 'var(--font-hindi)', fontSize: '0.85rem', color: 'var(--saffron)', marginBottom: 14 }}>
                                नागरिक पंजीकरण
                            </p>
                            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--warm-gray)', fontSize: '0.93rem', lineHeight: 1.7, marginBottom: 24 }}>
                                Register to get personalised drop-point recommendations, track your impact over time, and receive your certificate after disposal.
                            </p>
                            <Link href="/partner" className="cta-btn-warm" id="citizen-signup" style={{ textDecoration: 'none' }}>
                                Sign Up Free →
                            </Link>
                        </div>

                        {/* NGO card */}
                        <div className="partner-card" style={{ border: '2px solid rgba(232,135,26,0.35)', position: 'relative' }}>
                            <div style={{
                                position: 'absolute', top: -12, left: 24,
                                background: 'linear-gradient(135deg, var(--saffron), var(--marigold))',
                                color: 'white', padding: '3px 14px', borderRadius: 50,
                                fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600,
                            }}>
                                NGO / Organisation
                            </div>
                            <div style={{ fontSize: 36, marginBottom: 16, marginTop: 8 }}>🤝</div>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--plum)', marginBottom: 8 }}>
                                I Manage Collections
                            </h3>
                            <p style={{ fontFamily: 'var(--font-hindi)', fontSize: '0.85rem', color: 'var(--saffron)', marginBottom: 14 }}>
                                संस्था पंजीकरण
                            </p>
                            <ul style={{ paddingLeft: 0, listStyle: 'none', marginBottom: 24 }}>
                                {[
                                    'Get listed on the Visarjan drop-point map',
                                    'Receive real-time footfall predictions',
                                    'Access impact data for grant applications',
                                    'Coordinate citizen arrivals with advance notice',
                                ].map((b, i) => (
                                    <li key={i} style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--warm-gray)', display: 'flex', gap: 8, marginBottom: 8 }}>
                                        <span style={{ color: 'var(--saffron)' }}>✓</span>
                                        {b}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/partner" className="cta-btn-warm" id="ngo-signup" style={{ textDecoration: 'none' }}>
                                Partner With Us →
                            </Link>
                        </div>
                    </div>

                </div>
            </section>

            {/* ════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════ */}
            <footer style={{
                background: 'var(--plum)',
                color: 'rgba(255,255,255,0.75)',
                padding: 'clamp(40px,6vw,64px) clamp(20px,5vw,80px)',
                textAlign: 'center',
            }}>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.4rem', color: 'white', marginBottom: 6 }}>
                    Visarjan
                    <span style={{ fontFamily: 'var(--font-hindi)', fontWeight: 400, fontSize: '1rem', color: 'var(--marigold)', marginLeft: 10 }}>
                        विसर्जन
                    </span>
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', maxWidth: 420, margin: '10px auto 24px' }}>
                    A civic-tech platform for responsible religious waste disposal. Built with love for India's sacred traditions.
                </p>
                <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
                    {['About', 'AI Analyzer', 'Drop Points', 'Impact', 'Partners'].map(l => (
                        <a key={l} href="#" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-body)', fontSize: '0.83rem', textDecoration: 'none' }}>
                            {l}
                        </a>
                    ))}
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
                    © 2026 Visarjan · Made for the people of India
                </p>
            </footer>

        </div>
    );
}