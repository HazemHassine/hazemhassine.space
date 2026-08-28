'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

export default function ScrollTimeline({ id, title, items, isSubSection = false }) {
  const containerRef = useRef(null);
  const railRef = useRef(null);
  const itemRefs = useRef([]);
  const [activeItems, setActiveItems] = useState(() => new Set());

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  const beamHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'], { clamp: true });
  const beamOpacity = useTransform(scrollYProgress, [0, 0.02, 0.95, 1], [0, 1, 1, 0.8], { clamp: true });

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (!railRef.current || itemRefs.current.length === 0) return;
    
    // When on top or no progress, clear all active items
    if (progress <= 0.01) {
      setActiveItems(new Set());
      return;
    }

    const railHeight = railRef.current.offsetHeight;
    const currentBeamPx = progress * railHeight;

    const newActive = new Set();
    itemRefs.current.forEach((el, index) => {
      if (el) {
        // Square marker top relative to rail container
        const markerY = el.offsetTop + 6;
        if (currentBeamPx >= markerY - 4) {
          newActive.add(index);
        }
      }
    });

    setActiveItems(newActive);
  });

  return (
    <section
      id={id}
      ref={containerRef}
      className={`p-[28px] flex-1 flex flex-col ${isSubSection ? 'border-t border-border-primary' : ''}`}
    >
      <div className="text-[11px] leading-[1.2] tracking-[0.04em] font-medium text-primary-fixed uppercase mb-12 flex items-center justify-between">
        <span>{title}</span>
      </div>

      <div ref={railRef} className="relative max-w-4xl">
        {/* Static Background Rail — Centered exactly at 5.5px through 12px markers */}
        <div className="absolute left-[5.5px] top-3 bottom-6 w-px bg-border-primary/40" />

        {/* Dynamic Active Scroll Progress Beam */}
        <motion.div
          style={{
            height: beamHeight,
            opacity: beamOpacity,
          }}
          className="absolute left-[5.5px] top-3 w-px bg-gradient-to-b from-primary-fixed via-primary-fixed to-primary-fixed-dim shadow-[0_0_12px_#ccf200] z-0 origin-top"
        >
          {/* Glowing Leading Head — Square diamond centered with the rail */}
          <div className="absolute -bottom-1 -left-[2.5px] w-1.5 h-1.5 bg-primary-fixed rotate-45 shadow-[0_0_8px_#ccf200] animate-ping opacity-75" />
          <div className="absolute -bottom-1 -left-[2.5px] w-1.5 h-1.5 bg-primary-fixed rotate-45 shadow-[0_0_8px_#ccf200]" />
        </motion.div>

        {/* Timeline Items */}
        <div className="flex flex-col gap-12 relative z-10">
          {items.map((item, index) => {
            const isActive = activeItems.has(index);
            return (
              <motion.div
                key={index}
                ref={(el) => (itemRefs.current[index] = el)}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative pl-8 flex flex-col md:flex-row md:items-start gap-2 md:gap-10 group"
              >
                {/* Milestone Marker Square — lights up the exact moment the beam hits it */}
                <div
                  className={`absolute left-0 top-1.5 w-3 h-3 border transition-all duration-200 z-10 ${
                    isActive
                      ? 'bg-primary-fixed border-primary-fixed scale-110 shadow-[0_0_12px_#ccf200]'
                      : 'bg-surface-container-high border-border-primary scale-100 group-hover:bg-primary-fixed group-hover:border-primary-fixed group-hover:scale-125 group-hover:shadow-[0_0_10px_#ccf200]'
                  }`}
                />

                {/* Year */}
                <div
                  className={`w-full md:w-[180px] shrink-0 font-[family-name:var(--font-mono)] text-[15px] md:text-[16px] leading-[1.4] font-medium transition-colors duration-200 pt-0.5 ${
                    isActive ? 'text-primary-fixed font-bold' : 'text-text-muted group-hover:text-primary-fixed'
                  }`}
                >
                  {item.year}
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1">
                  <h3 className="text-[12px] leading-[1] tracking-[0.02em] font-semibold uppercase text-on-background group-hover:text-white transition-colors mb-1">
                    {item.company || item.institution} {`//`} {item.role || item.degree}
                  </h3>
                  <span className="text-[11px] leading-[1.2] tracking-[0.04em] font-medium text-text-dim uppercase mb-3">
                    {item.location}
                  </span>
                  <p className="text-[14px] leading-[1.6] font-normal text-text-dim group-hover:text-text-muted transition-colors max-w-2xl">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
