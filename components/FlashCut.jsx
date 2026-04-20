'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function FlashCut({ onComplete }) {
  const overlayRef = useRef(null);
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const el = overlayRef.current || document.getElementById('flash-overlay');
    if (!el) return;

    // Flash: 0 → 1 in 60ms, hold, then 1 → 0 in 150ms
    el.style.transition = 'opacity 60ms linear';
    el.style.opacity = '1';

    setTimeout(() => {
      el.style.transition = 'opacity 150ms linear';
      el.style.opacity = '0';
      setTimeout(() => {
        onComplete?.();
      }, 150);
    }, 80);
  }, [onComplete]);

  return null;
}
