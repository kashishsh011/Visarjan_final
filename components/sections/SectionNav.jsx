'use client';     //section-nav.jsx//
import { useEffect, useState } from 'react';
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                            width: 28, height: 28, borderRadius: '50%',
                            border: '2px solid var(--saffron)',
                            background: 'linear-gradient(135deg, var(--saffron), #FFB300)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.75rem', fontWeight: 700, color: '#fff',
                            fontFamily: 'var(--font-display)',
                        }}>
                            {session.user.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <span style={{ fontSize: '0.85rem', color: 'var(--plum)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                            {session.user.name?.split(' ')[0]}
                        </span>
                        <button
                            onClick={() => signOut()}
                            style={{ fontSize: '0.8rem', color: 'var(--saffron)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                        >
                            Sign out
                        </button>
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