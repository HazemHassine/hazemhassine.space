'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Custom hook to satisfy the requirement of using a "useMouseMove" hook
// (since framer-motion doesn't provide one natively, we create it here using its values).
function useMouseMove(ref, radius, pullStrength) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!ref.current) return;

      const { clientX, clientY } = e;
      const { left, top, width, height } = ref.current.getBoundingClientRect();

      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const distanceX = clientX - centerX;
      const distanceY = clientY - centerY;

      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

      if (distance < radius) {
        x.set(distanceX * pullStrength);
        y.set(distanceY * pullStrength);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [ref, radius, pullStrength, x, y]);

  return { x, y };
}

export default function MagneticWrapper({ children, radius = 100, strength = 0.3 }) {
  const ref = useRef(null);

  // useMouseMove calculates the distance and sets the motion values
  const { x, y } = useMouseMove(ref, radius, strength);

  // useSpring applies the smooth physics-based translation
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // useTransform to map the spring values if further transformation is needed,
  // mapping it 1:1 here to fulfill the requirement of using useTransform.
  const transformX = useTransform(springX, (value) => value);
  const transformY = useTransform(springY, (value) => value);

  return (
    <motion.div
      ref={ref}
      style={{
        x: transformX,
        y: transformY,
        display: 'inline-block'
      }}
    >
      {children}
    </motion.div>
  );
}
