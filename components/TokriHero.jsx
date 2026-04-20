'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

export default function TokriHero({ onTransitionComplete }) {
  const sectionRef = useRef(null);
  const tokriWrap = useRef(null);
  const [frame, setFrame] = useState('tokri2');
  const [glowActive, setGlowActive] = useState(false);
  const done = useRef(false);

  const fireTransition = useCallback(() => {
    if (done.current) return;
    done.current = true;
    const flash = document.getElementById('flash-overlay');
    if (flash) {
      flash.style.transition = 'opacity 60ms linear';
      flash.style.opacity = '1';
      setTimeout(() => {
        setFrame('tokri1');
        setGlowActive(true);
        flash.style.transition = 'opacity 150ms linear';
        flash.style.opacity = '0';
        if (tokriWrap.current) {
          gsap.fromTo(tokriWrap.current, { scale: 1.16 }, { scale: 1, duration: 0.4, ease: 'power3.out' });
        }
        window.dispatchEvent(new Event('visarjan:navReady'));
        onTransitionComplete?.();
      }, 80);
    }
  }, [onTransitionComplete]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    gsap.registerPlugin(ScrollTrigger);

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=120%',
      pin: true,
      pinSpacing: true,
      onLeave: fireTransition,
    });

    const onWheel = () => fireTransition();
    window.addEventListener('wheel', onWheel, { passive: true, once: true });
    window.addEventListener('touchend', onWheel, { once: true });

    return () => {
      st.kill();
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchend', onWheel);
    };
  }, [fireTransition]);

  return (
    <section
      ref={sectionRef}
      style={{
        width: '100%', height: '100vh', position: 'relative',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', overflow: 'hidden',
      }}
    >
      {glowActive && <div className="diya-glow" />}
      <div
        ref={tokriWrap}
        style={{
          position: 'relative', zIndex: 2,
          width: 'min(58vw, 500px)', height: 'min(58vw, 500px)',
        }}
      >
        <Image
          src={frame === 'tokri2' ? '/tokri2.png' : '/tokri1.png'}
          alt={frame === 'tokri2' ? 'Pooja thali top view' : 'Pooja tokri front view'}
          fill style={{ objectFit: 'contain' }} priority unoptimized
        />
      </div>
    </section>
  );
}
