'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { label: 'About',       href: '/#about' },
  { label: 'AI Analyzer', href: '/items' },
  { label: 'Drop Points', href: '/map' },
  { label: 'Impact',      href: '/impact' },
  { label: 'Partners',    href: '/partner' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 32);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // On non-home pages, always show scrolled style
  const isHome = pathname === '/';
  const showSolid = scrolled || !isHome;

  return (
    <header
      id="main-navbar"
      className={`vis-navbar ${showSolid ? 'scrolled' : 'top'}`}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}
    >
      {/* Logo */}
      <Link href="/" className="nav-logo" style={{ textDecoration: 'none' }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '1.2rem',
          color: 'var(--plum)',
        }}>
          Visarjan
        </span>
        <span style={{
          fontFamily: 'var(--font-hindi)',
          fontWeight: 400,
          fontSize: '0.9rem',
          color: 'var(--saffron)',
          marginLeft: 4,
        }}>
          विसर्जन
        </span>
      </Link>

      {/* Center nav links */}
      <nav aria-label="Main navigation">
        <ul className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px,2.5vw,36px)', listStyle: 'none', margin: 0, padding: 0 }}>
          {NAV_LINKS.map(link => (
            <li key={link.label}>
              <Link
                href={link.href}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: 'var(--warm-brown)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--saffron)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--warm-brown)'}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Right CTA */}
      <Link
        href="/map"
        className="nav-cta"
        id="nav-find-drop"
        style={{ textDecoration: 'none' }}
      >
        Find Drop Point →
      </Link>

      {/* Mobile hamburger */}
      <button
        aria-label="Toggle menu"
        onClick={() => setMenuOpen(o => !o)}
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 8,
        }}
        id="nav-hamburger"
        className="nav-hamburger"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--plum)" strokeWidth="2">
          {menuOpen
            ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
            : <><line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" /></>
          }
        </svg>
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0, right: 0,
          background: 'rgba(255,240,250,0.97)',
          backdropFilter: 'blur(18px)',
          padding: '16px 24px 24px',
          boxShadow: '0 8px 32px rgba(61,26,58,0.12)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                fontWeight: 500,
                color: 'var(--warm-brown)',
                textDecoration: 'none',
                padding: '4px 0',
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/map" className="nav-cta" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', textAlign: 'center', marginTop: 8 }}>
            Find Drop Point →
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .nav-cta { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
