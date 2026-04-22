'use client';         //impact-page.js//
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import StatTile from '@/components/sections/StatTile';

const COMMUNITY_CARDS = [
    { name: 'Riya Sharma', area: 'Lajpat Nagar', material: 'PoP Idol', date: 'Apr 14', color: 'linear-gradient(135deg, #FF6B00 0%, #FFB300 100%)' },
    { name: 'Amit Verma', area: 'Dwarka', material: 'Flowers + Coconut', date: 'Apr 13', color: 'linear-gradient(135deg, #8B1A1A 0%, #FF6B00 100%)' },
    { name: 'Priya Nair', area: 'Rohini', material: 'Full Pooja Set', date: 'Apr 14', color: 'linear-gradient(135deg, #FFB300 0%, #8B1A1A 100%)' },
    { name: 'Kiran Joshi', area: 'Saket', material: 'Clay Idol', date: 'Apr 12', color: 'linear-gradient(135deg, #FF6B00 0%, #FFD700 100%)' },
    { name: 'Sunil Kapoor', area: 'Pitampura', material: 'Nirmalya', date: 'Apr 15', color: 'linear-gradient(135deg, #8B1A1A 0%, #FFB300 100%)' },
    { name: 'Meera Das', area: 'Janakpuri', material: 'PoP Idol + Flowers', date: 'Apr 13', color: 'linear-gradient(135deg, #FFB300 0%, #FF6B00 100%)' },
    { name: 'Rahul Singh', area: 'Connaught Place', material: 'Coconut + Prasad', date: 'Apr 14', color: 'linear-gradient(135deg, #FF6B00 0%, #8B1A1A 100%)' },
    { name: 'Anjali Gupta', area: 'Greater Kailash', material: 'Full Pooja Set', date: 'Apr 15', color: 'linear-gradient(135deg, #FFD700 0%, #FF6B00 100%)' },
];

const PARTNER_LOGOS = ['Phool', 'eCoexist', 'Holywaste', 'Sampurnam', 'GreenVidai', 'YamunaClean'];

export default function ImpactPage() {
    const router = useRouter();

    return (
        <div className="page-wrapper" style={{ paddingTop: 80 }}>
            <div style={{ maxWidth: 1060, margin: '0 auto', padding: '60px 20px 40px' }}>

                {/* Header */}
                <motion.h1
                    initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55 }}
                    className="section-title"
                    style={{ marginBottom: 8 }}
                >
                    Community Impact Wall
                </motion.h1>
                <p style={{ fontFamily: 'var(--font-hindi)', color: 'var(--saffron)', fontSize: '1rem', marginBottom: 4 }}>सामुदायिक प्रभाव</p>
                <motion.p
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                    style={{ color: 'var(--warm-gray)', marginBottom: 52, fontSize: '0.92rem', fontFamily: 'var(--font-body)' }}
                >
                    Every responsible disposal is a prayer for the Yamuna. Here's what this community has done.
                </motion.p>

                {/* Masonry community grid */}
                <div className="masonry-grid" style={{ marginBottom: 72 }}>
                    {COMMUNITY_CARDS.map((card, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ delay: (i % 3) * 0.1, duration: 0.5 }}
                            whileHover={{ y: -6, boxShadow: '0 20px 48px rgba(255,107,0,0.2)' }}
                            className="masonry-item"
                            style={{ background: 'var(--warm-white)', border: '1.5px solid rgba(232,135,26,0.22)', borderRadius: 16, padding: '24px 20px', cursor: 'default', boxShadow: '0 4px 20px rgba(61,26,58,0.08)' }}
                        >
                            <div style={{ fontSize: 32, marginBottom: 10 }}>🌸</div>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.92rem', color: 'var(--plum)', fontWeight: 700, marginBottom: 4 }}>
                                {card.name}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--warm-gray)', marginBottom: 6 }}>📍 {card.area}</div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--warm-brown)', marginBottom: 8 }}>
                                Disposed: <strong>{card.material}</strong>
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--warm-gray)', letterSpacing: '0.06em' }}>{card.date} · 2025</div>
                        </motion.div>
                    ))}
                </div>

                {/* Impact Counter Strip */}
                <div style={{ background: 'var(--warm-white)', border: '1px solid rgba(232,135,26,0.18)', borderRadius: 20, padding: '48px 32px', marginBottom: 64 }}>
                    <motion.h2
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.5 }}
                        className="section-title"
                        style={{ textAlign: 'center', marginBottom: 40 }}
                    >
                        Collective Numbers
                    </motion.h2>
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                        <StatTile value="2840" label="kg kept out of Yamuna" delay={0} />
                        <StatTile value="1200" label="families served" delay={0.1} />
                        <StatTile value="340" label="kg flowers → Phool incense" delay={0.2} />
                        <StatTile value="18" label="NGOs partnered" delay={0.3} />
                    </div>
                </div>

                {/* Partner logos */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5 }}
                    style={{ marginBottom: 64 }}
                >
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'rgba(107,91,78,0.55)', textAlign: 'center', letterSpacing: '0.12em', marginBottom: 24, textTransform: 'uppercase' }}>
                        Our Partners
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
                        {PARTNER_LOGOS.map((logo, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.85 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.07 }}
                                whileHover={{ scale: 1.06 }}
                                style={{
                                    padding: '9px 20px', borderRadius: 50, border: '1.5px solid rgba(232,135,26,0.3)',
                                    fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--plum)',
                                    fontWeight: 500, background: 'var(--warm-white)', cursor: 'default',
                                }}
                            >
                                {logo}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5 }}
                    style={{ textAlign: 'center' }}
                >
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1rem, 3vw, 1.6rem)', fontWeight: 700, color: 'var(--plum)', marginBottom: 16 }}>
                        You did your part. Celebrate it.
                    </div>
                    <button className="cta-btn-warm" onClick={() => router.push('/certificate')} id="cta-certificate">
                        Generate my certificate →
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
