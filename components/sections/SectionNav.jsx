'use client';     //section-nav.jsx//
import { useEffect, useState, useRef } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

const LINKS = [
    { label: 'Why It Matters', id: 'about' },
    { label: 'What Do You Have', id: 'what-do-you-have' },
    { label: 'Drop Points', id: 'drop-points-section' },
    { label: 'Community Impact', id: 'impact-section' },
    { label: 'Certificate', id: 'certificate-section' },
    { label: 'Join', id: 'partner-section' },
];

export default function SectionNav() {
    const [visible, setVisible] = useState(false);
    const [active, setActive] = useState('');
    const { data: session, status } = useSession();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const [userDrops, setUserDrops] = useState([]);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const onScroll = () => {
            // Show navbar only after scroll story (400vh) ends
            const scrollStory = document.querySelector('.scroll-canvas-wrapper');
            if (scrollStory) {
                const storyBottom = scrollStory.offsetTop + scrollStory.offsetHeight;
                setVisible(window.scrollY > storyBottom - 80);
            }

            // Highlight whichever section is currently in view
            LINKS.forEach(({ id }) => {
                const el = document.getElementById(id);
                if (!el) return;
                const rect = el.getBoundingClientRect();
                if (rect.top <= 120 && rect.bottom >= 120) setActive(id);
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Fetch user data and drops when session exists
    useEffect(() => {
        if (session) {
            fetch('/api/users/me')
                .then(r => r.json())
                .then(res => { if (res.success) setUserData(res.data) })
                .catch(() => {})
            fetch('/api/users/me/drops')
                .then(r => r.json())
                .then(res => { if (res.success) setUserDrops(res.data) })
                .catch(() => {})
        }
    }, [session]);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        }
        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownOpen]);

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    if (!visible) return null;

    return (
        <nav style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
            background: 'rgba(254,250,248,0.88)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(232,135,26,0.15)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            flexWrap: 'wrap', gap: 4,
            padding: '10px 24px',
        }}>
            {LINKS.map(({ label, id }) => (
                <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.82rem',
                        fontWeight: active === id ? 700 : 500,
                        color: active === id ? 'var(--saffron)' : 'var(--warm-gray)',
                        background: 'none',
                        border: 'none',
                        borderBottom: active === id
                            ? '2px solid var(--saffron)'
                            : '2px solid transparent',
                        cursor: 'pointer',
                        padding: '6px 12px',
                        transition: 'all 0.2s ease',
                    }}
                >
                    {label}
                </button>
            ))}

            {/* Auth indicator */}
            <div style={{ marginLeft: 'auto' }}>
                {status === 'loading' ? null : session ? (
                    <div ref={dropdownRef} style={{ position: 'relative' }}>
                        <div
                            onClick={() => setDropdownOpen(prev => !prev)}
                            style={{
                                width: 28, height: 28, borderRadius: '50%',
                                border: '2px solid var(--saffron)',
                                background: 'linear-gradient(135deg, var(--saffron), #FFB300)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.75rem', fontWeight: 700, color: '#fff',
                                fontFamily: 'var(--font-display)',
                                cursor: 'pointer',
                            }}
                        >
                            {session.user.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>

                        {/* Profile dropdown */}
                        {dropdownOpen && (
                            <div style={{
                                position: 'absolute',
                                top: '44px',
                                right: 0,
                                width: '260px',
                                background: 'var(--parchment, #FDF6EC)',
                                border: '1px solid rgba(193,122,42,0.2)',
                                borderRadius: '16px',
                                boxShadow: '0 8px 32px rgba(45,27,105,0.12)',
                                zIndex: 1000,
                                overflow: 'hidden',
                            }}>

                                {/* Header strip — saffron gradient */}
                                <div style={{
                                    background: 'linear-gradient(135deg, #C17A2A 0%, #E8871A 100%)',
                                    padding: '16px 20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                }}>
                                    {/* Large avatar */}
                                    <div style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.25)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.2rem',
                                        fontWeight: 700,
                                        color: 'white',
                                        fontFamily: 'var(--font-display)',
                                        flexShrink: 0,
                                    }}>
                                        {session.user.name?.[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{
                                            color: 'white',
                                            fontFamily: 'var(--font-display)',
                                            fontWeight: 700,
                                            fontSize: '0.95rem',
                                            lineHeight: 1.2,
                                        }}>
                                            {session.user.name}
                                        </div>
                                        <div style={{
                                            color: 'rgba(255,255,255,0.8)',
                                            fontSize: '0.72rem',
                                            fontFamily: 'var(--font-body)',
                                            marginTop: 2,
                                        }}>
                                            {session.user.email}
                                        </div>
                                    </div>
                                </div>

                                {/* Body */}
                                <div style={{ padding: '16px 20px' }}>

                                    {/* Role badge */}
                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        padding: '4px 12px',
                                        borderRadius: 20,
                                        background: userData?.role === 'ngo_admin'
                                            ? 'rgba(45,27,105,0.08)'
                                            : 'rgba(193,122,42,0.08)',
                                        border: userData?.role === 'ngo_admin'
                                            ? '1px solid rgba(45,27,105,0.2)'
                                            : '1px solid rgba(193,122,42,0.2)',
                                        marginBottom: 16,
                                    }}>
                                        <span style={{ fontSize: '0.7rem' }}>
                                            {userData?.role === 'ngo_admin' ? '🏛️' : '🙏'}
                                        </span>
                                        <span style={{
                                            fontSize: '0.72rem',
                                            fontFamily: 'var(--font-body)',
                                            color: userData?.role === 'ngo_admin' ? 'var(--plum)' : 'var(--saffron)',
                                            fontWeight: 600,
                                            textTransform: 'capitalize',
                                            letterSpacing: '0.04em',
                                        }}>
                                            {userData?.role === 'ngo_admin'
                                                ? 'NGO Partner'
                                                : userData?.role === 'citizen'
                                                ? 'Eco Citizen'
                                                : 'Member'}
                                        </span>
                                    </div>

                                    {/* Stats row */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: 10,
                                        marginBottom: 16,
                                    }}>
                                        <div style={{
                                            padding: '10px 12px',
                                            background: 'rgba(193,122,42,0.06)',
                                            borderRadius: 10,
                                            textAlign: 'center',
                                        }}>
                                            <div style={{
                                                fontFamily: 'var(--font-display)',
                                                fontSize: '1.3rem',
                                                fontWeight: 900,
                                                color: 'var(--plum)',
                                                lineHeight: 1,
                                            }}>
                                                {userData ? '✓' : '—'}
                                            </div>
                                            <div style={{
                                                fontSize: '0.65rem',
                                                color: 'var(--warm-gray)',
                                                fontFamily: 'var(--font-body)',
                                                marginTop: 4,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.06em',
                                            }}>
                                                Registered
                                            </div>
                                        </div>
                                        <div style={{
                                            padding: '10px 12px',
                                            background: 'rgba(193,122,42,0.06)',
                                            borderRadius: 10,
                                            textAlign: 'center',
                                        }}>
                                            <div style={{
                                                fontFamily: 'var(--font-display)',
                                                fontSize: '1.3rem',
                                                fontWeight: 900,
                                                color: 'var(--plum)',
                                                lineHeight: 1,
                                            }}>
                                                {userData?.createdAt
                                                    ? new Date(userData.createdAt).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
                                                    : '—'}
                                            </div>
                                            <div style={{
                                                fontSize: '0.65rem',
                                                color: 'var(--warm-gray)',
                                                fontFamily: 'var(--font-body)',
                                                marginTop: 4,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.06em',
                                            }}>
                                                Joined
                                            </div>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div style={{
                                        height: 1,
                                        background: 'rgba(193,122,42,0.15)',
                                        margin: '0 0 14px',
                                    }} />

                                    {/* Past Drops */}
                                    <div style={{ marginBottom: 14 }}>
                                        <div style={{
                                            fontSize: '0.68rem',
                                            fontFamily: 'var(--font-body)',
                                            color: 'var(--warm-gray)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.08em',
                                            marginBottom: 10,
                                        }}>
                                            Past Drops
                                        </div>
                                        {userDrops.length > 0 ? (
                                            <div style={{
                                                maxHeight: 160,
                                                overflowY: 'auto',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 8,
                                            }}>
                                                {userDrops.map((drop, i) => (
                                                    <div key={drop.certId || i} style={{
                                                        padding: '10px 12px',
                                                        background: 'rgba(193,122,42,0.05)',
                                                        borderRadius: 10,
                                                        border: '1px solid rgba(193,122,42,0.1)',
                                                    }}>
                                                        <div style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            marginBottom: 4,
                                                        }}>
                                                            <span style={{
                                                                fontFamily: 'var(--font-display)',
                                                                fontSize: '0.78rem',
                                                                fontWeight: 700,
                                                                color: 'var(--plum)',
                                                            }}>
                                                                {drop.item}
                                                            </span>
                                                            <span style={{
                                                                fontSize: '0.65rem',
                                                                color: 'var(--saffron)',
                                                                fontWeight: 600,
                                                                fontFamily: 'var(--font-body)',
                                                            }}>
                                                                {drop.weightKg} kg
                                                            </span>
                                                        </div>
                                                        <div style={{
                                                            fontSize: '0.68rem',
                                                            color: 'var(--warm-gray)',
                                                            fontFamily: 'var(--font-body)',
                                                        }}>
                                                            📍 {drop.ngoName}
                                                        </div>
                                                        <div style={{
                                                            fontSize: '0.62rem',
                                                            color: 'rgba(107,91,78,0.5)',
                                                            fontFamily: 'var(--font-body)',
                                                            marginTop: 3,
                                                        }}>
                                                            {new Date(drop.createdAt).toLocaleDateString('en-IN', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric',
                                                            })}
                                                            {drop.certId && ` · #${drop.certId}`}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div style={{
                                                padding: '12px',
                                                textAlign: 'center',
                                                fontSize: '0.72rem',
                                                color: 'var(--warm-gray)',
                                                fontFamily: 'var(--font-body)',
                                                background: 'rgba(193,122,42,0.04)',
                                                borderRadius: 10,
                                            }}>
                                                No drops yet — get your first certificate! 🌿
                                            </div>
                                        )}
                                    </div>

                                    {/* Divider */}
                                    <div style={{
                                        height: 1,
                                        background: 'rgba(193,122,42,0.15)',
                                        margin: '0 0 14px',
                                    }} />

                                    {/* Certificate CTA */}
                                    <a
                                        href="/certificate"
                                        onClick={() => setDropdownOpen(false)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            padding: '10px 14px',
                                            borderRadius: 10,
                                            background: 'linear-gradient(135deg, #C17A2A 0%, #E8871A 100%)',
                                            color: 'white',
                                            textDecoration: 'none',
                                            fontFamily: 'var(--font-display)',
                                            fontSize: '0.78rem',
                                            fontWeight: 700,
                                            letterSpacing: '0.04em',
                                            marginBottom: 8,
                                            transition: 'opacity 0.2s',
                                        }}
                                        onMouseOver={e => e.currentTarget.style.opacity = '0.88'}
                                        onMouseOut={e => e.currentTarget.style.opacity = '1'}
                                    >
                                        <span>📜</span>
                                        Get Your Certificate
                                    </a>

                                    {/* Sign out */}
                                    <button
                                        onClick={() => { signOut(); setDropdownOpen(false) }}
                                        style={{
                                            width: '100%',
                                            padding: '9px 14px',
                                            borderRadius: 10,
                                            border: '1px solid rgba(193,122,42,0.25)',
                                            background: 'transparent',
                                            color: 'var(--warm-gray)',
                                            fontFamily: 'var(--font-body)',
                                            fontSize: '0.78rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            textAlign: 'center',
                                        }}
                                        onMouseOver={e => {
                                            e.currentTarget.style.background = 'rgba(193,122,42,0.08)';
                                            e.currentTarget.style.color = 'var(--plum)';
                                        }}
                                        onMouseOut={e => {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = 'var(--warm-gray)';
                                        }}
                                    >
                                        Sign out
                                    </button>

                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={() => signIn('google')}
                        style={{ fontSize: '0.85rem', color: 'var(--saffron)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-body)' }}
                    >
                        Sign In
                    </button>
                )}
            </div>
        </nav>
    );
}