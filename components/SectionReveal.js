'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function SectionReveal({ children, delay = 0, direction = 'up' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

  const directionOffset = {
    up: { y: 40, x: 0 },
    left: { x: -40, y: 0 },
    right: { x: 40, y: 0 }
  };

  const initialValues = {
    opacity: 0,
    ...directionOffset[direction]
  };

  return (
    <div ref={ref}>
      <motion.div
        initial={initialValues}
        animate={isInView ? { opacity: 1, x: 0, y: 0 } : initialValues}
        transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
