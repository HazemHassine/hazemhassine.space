'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function TiltCard({ children, className = '', ...props }) {
  const ref = useRef(null);
  const glareRef = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 350, damping: 28 });
  const mouseYSpring = useSpring(y, { stiffness: 350, damping: 28 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['4deg', '-4deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-4deg', '4deg']);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / rect.width - 0.5;
    const yPct = mouseY / rect.height - 0.5;

    x.set(xPct);
    y.set(yPct);

    if (glareRef.current) {
      glareRef.current.style.background = `radial-gradient(circle 130px at ${(mouseX / rect.width) * 100}% ${(mouseY / rect.height) * 100}%, rgba(204, 242, 0, 0.12), transparent 70%)`;
    }
  };

  const handleMouseEnter = () => {
    if (glareRef.current) glareRef.current.style.opacity = '1';
  };

  const handleMouseLeave = () => {
    if (glareRef.current) glareRef.current.style.opacity = '0';
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`relative overflow-hidden will-change-transform ${className}`}
      {...props}
    >
      {/* Dynamic Cursor Light Glare — Zero React re-renders, direct GPU acceleration */}
      <div
        ref={glareRef}
        className="pointer-events-none absolute inset-0 transition-opacity duration-200 z-0 opacity-0 will-change-[opacity,background]"
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
