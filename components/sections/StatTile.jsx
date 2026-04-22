'use client';     //stat-tile.jsx//
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

function useCounter(end, duration, active) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let frame = 0;
    const total = Math.round(duration / 16);
    const step = end / total;
    const timer = setInterval(() => {
      frame++;
      setCount(Math.min(Math.round(step * frame), end));
      if (frame >= total) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [active, end, duration]);
  return count;
}

export default function StatTile({ label, value, suffix = '', delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const numStr = value.replace(/[^0-9]/g, '');
  const end = parseInt(numStr, 10) || 0;
  const displaySuffix = value.replace(/[0-9]/g, '');
  const count = useCounter(end, 2000, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 44 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.52, delay, ease: 'easeOut' }}
      whileHover={{ scale: 1.04, y: -4 }}
      className="warm-card"
      style={{ padding: '32px 28px', textAlign: 'center', flex: 1, minWidth: 180, cursor: 'default' }}
    >
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(2rem, 5vw, 3rem)',
        fontWeight: 900,
        color: 'var(--plum)',
        lineHeight: 1.1,
      }}>
        {inView ? count.toLocaleString() + displaySuffix : '0' + displaySuffix}
      </div>
      <div style={{ color: 'var(--warm-gray)', marginTop: 10, fontSize: '0.88rem', letterSpacing: '0.04em', fontFamily: 'var(--font-body)' }}>
        {label}
      </div>
    </motion.div>
  );
}
