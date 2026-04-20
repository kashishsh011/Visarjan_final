'use client';
import { motion } from 'framer-motion';

export default function PillSelect({ items, selected, onToggle }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
      {items.map((item) => {
        const sel = selected.includes(item.id);
        return (
          <motion.button
            key={item.id}
            onClick={() => onToggle(item.id)}
            className={`pill-btn${sel ? ' selected' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            id={`pill-${item.id}`}
          >
            <span>{item.emoji}</span>
            <span>{item.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
