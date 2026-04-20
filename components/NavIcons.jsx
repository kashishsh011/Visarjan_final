'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { icon: '🏠', label: 'Home', path: '/' },
  { icon: '🌸', label: 'Items', path: '/items' },
  { icon: '🗺', label: 'Map', path: '/map' },
  { icon: '🏆', label: 'Impact', path: '/impact' },
  { icon: '🤝', label: 'Partner', path: '/partner' },
];

export default function NavIcons({ navReady }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {navReady && (
        <motion.nav
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          style={{
            position: 'fixed', bottom: 24, left: '50%',
            x: '-50%', zIndex: 1000,
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px',
            background: 'rgba(8,6,4,0.78)', backdropFilter: 'blur(24px)',
            borderRadius: 50, border: '1px solid rgba(255,179,0,0.22)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.7)',
          }}
          id="main-nav"
        >
          {NAV_ITEMS.map((item, i) => (
            <motion.button
              key={item.path}
              initial={{ opacity: 0, y: 40, scale: 0.7 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 320, damping: 18 }}
              onClick={() => router.push(item.path)}
              className={`nav-bubble ${pathname === item.path ? 'active' : ''}`}
              title={item.label}
              id={`nav-${item.label.toLowerCase()}`}
              whileHover={{ scale: 1.13, y: -3 }}
              whileTap={{ scale: 0.9 }}
            >
              <span style={{ fontSize: 22, lineHeight: 1 }}>{item.icon}</span>
            </motion.button>
          ))}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
