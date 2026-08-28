'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

export default function ScrollTimeline({ id = 'timeline', experience = [], education = [] }) {
  const [activeTab, setActiveTab] = useState('experience');
  const containerRef = useRef(null);
  const railRef = useRef(null);
  const itemRefs = useRef([]);
  const [activeItems, setActiveItems] = useState(() => new Set());
  const [railBounds, setRailBounds] = useState({ top: 12, height: 400 });

  // Formatted Experience Items
  const formattedExperience = experience.map((item) => ({
    ...item,
    companyOrInst: item.company,
    roleOrDegree: item.role,
    type: item.company.includes('BASIRA') ? 'RESEARCH' : 'WORK',
  }));

  // Formatted Education Items
  const formattedEducation = education.map((item) => ({
    ...item,
    companyOrInst: item.institution,
    roleOrDegree: item.degree,
    type: 'EDU',
  }));

  // Combined reverse-chronological list
  const combinedList = [
    formattedEducation.find((e) => e.year.includes('Present')),
    formattedExperience.find((e) => e.company === 'SIEMENS'),
    formattedExperience.find((e) => e.company.includes('ISIE')),
    formattedEducation.find((e) => e.institution.includes('PASSAU')),
    formattedExperience.find((e) => e.company.includes('BASIRA')),
    formattedExperience.find((e) => e.company.includes('MAKE IT HAPPEN')),
    formattedEducation.find((e) => e.institution.includes('MONASTIR')),
  ].filter(Boolean);

  const tabs = [
    { id: 'experience', label: 'EXPERIENCE', count: formattedExperience.length },
    { id: 'education', label: 'EDUCATION', count: formattedEducation.length },
    { id: 'all', label: 'COMBINED ALL', count: combinedList.length },
  ];

  const currentItems =
    activeTab === 'experience'
      ? formattedExperience
      : activeTab === 'education'
      ? formattedEducation
      : combinedList;

  // Viewport scroll tracking:
  // Starts when container reaches comfortable reading zone (70% viewport),
  // reaches 100% when user reaches the absolute bottom of the page ('end end').
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 70%', 'end end'],
  });

  // Calculate exact rail bounds from first square marker to last square marker
  const measureRailBounds = useCallback(() => {
    const validRefs = itemRefs.current.filter(Boolean);
    if (validRefs.length === 0) return;

    const firstEl = validRefs[0];
    const lastEl = validRefs[validRefs.length - 1];

    const firstMarkerCenterY = firstEl.offsetTop + 6;
    const lastMarkerCenterY = lastEl.offsetTop + 6;
    const totalHeight = Math.max(lastMarkerCenterY - firstMarkerCenterY, 50);

    setRailBounds({
      top: firstMarkerCenterY,
      height: totalHeight,
    });
  }, []);

  // Evaluate which items are active based on the current beam position
  const evaluateActiveItems = useCallback(
    (progress) => {
      const currentProgress = progress !== undefined ? progress : scrollYProgress.get();
      const validRefs = itemRefs.current.filter(Boolean);

      // If at top or 0 progress, clear all active items
      if (currentProgress <= 0.005) {
        setActiveItems(new Set());
        return;
      }

      const firstY = railBounds.top;
      const totalH = railBounds.height;
      const currentBeamY = firstY + currentProgress * totalH;

      const newActive = new Set();

      if (validRefs.length === currentItems.length) {
        validRefs.forEach((el, index) => {
          if (el) {
            const markerCenterY = el.offsetTop + 6;
            // Activate when beam hits or passes the marker
            if (currentBeamY >= markerCenterY - 4) {
              newActive.add(index);
            }
          }
        });
      } else {
        // Mathematical fallback
        const total = currentItems.length;
        for (let i = 0; i < total; i++) {
          const threshold = total > 1 ? i / (total - 1) : 0;
          if (currentProgress >= threshold - 0.03) {
            newActive.add(i);
          }
        }
      }

      setActiveItems(newActive);
    },
    [currentItems.length, railBounds, scrollYProgress]
  );

  // Synchronous scroll tracking
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    evaluateActiveItems(progress);
  });

  // Re-measure and re-evaluate when tab changes or items update
  useEffect(() => {
    itemRefs.current = [];
    measureRailBounds();

    // Immediate evaluation
    evaluateActiveItems(scrollYProgress.get());

    // RAF & delayed checks to ensure layout reflow measurements are exact
    const rafId = requestAnimationFrame(() => {
      measureRailBounds();
      evaluateActiveItems(scrollYProgress.get());
    });

    const timer = setTimeout(() => {
      measureRailBounds();
      evaluateActiveItems(scrollYProgress.get());
    }, 50);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, [activeTab, evaluateActiveItems, measureRailBounds, scrollYProgress]);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      measureRailBounds();
      evaluateActiveItems(scrollYProgress.get());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [evaluateActiveItems, measureRailBounds, scrollYProgress]);

  const beamHeight = useTransform(
    scrollYProgress,
    [0, 1],
    [0, railBounds.height],
    { clamp: true }
  );

  const beamOpacity = useTransform(
    scrollYProgress,
    [0, 0.01, 0.98, 1],
    [0, 1, 1, 1],
    { clamp: true }
  );

  return (
    <section
      id={id}
      ref={containerRef}
      className="p-[28px] flex-1 flex flex-col"
    >
      {/* Header with Tri-Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-12 border-b border-border-primary/40 pb-4">
        <div className="text-[11px] leading-[1.2] tracking-[0.04em] font-medium text-primary-fixed uppercase flex items-center gap-2">
          <span>{`//`} TIMELINE</span>
          <span className="text-[10px] font-mono text-text-dim">
            [{activeTab.toUpperCase()}]
          </span>
        </div>

        {/* Tri-Mode Switcher Pills with layoutId Slide */}
        <div className="flex items-center gap-1 bg-surface-container-lowest border border-border-primary p-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative px-3 py-1 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider transition-colors"
              >
                {isActive && (
                  <motion.div
                    layoutId="active-timeline-tab"
                    className="absolute inset-0 bg-primary-fixed"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <span className={`relative z-10 font-medium ${
                  isActive ? 'text-on-primary-fixed font-bold' : 'text-text-muted hover:text-on-surface'
                }`}>
                  {tab.id === 'all' ? (
                    <>
                      <span className="hidden sm:inline">COMBINED </span>ALL ({tab.count})
                    </>
                  ) : (
                    <>
                      {tab.label} ({tab.count})
                    </>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div ref={railRef} className="relative max-w-4xl">
        {/* Static Background Rail — Spans precisely from center of first square to center of last square */}
        <div
          style={{
            top: `${railBounds.top}px`,
            height: `${railBounds.height}px`,
          }}
          className="absolute left-[5.5px] w-px bg-border-primary/40"
        />

        {/* Dynamic Active Scroll Progress Beam */}
        <motion.div
          style={{
            top: `${railBounds.top}px`,
            height: beamHeight,
            opacity: beamOpacity,
          }}
          className="absolute left-[5.5px] w-px bg-primary-fixed shadow-[0_0_10px_#ccf200] z-0 origin-top"
        >
          {/* Glowing Leading Head — Square diamond centered with the rail */}
          <div className="absolute -bottom-1 -left-[2.5px] w-1.5 h-1.5 bg-primary-fixed rotate-45 shadow-[0_0_8px_#ccf200] animate-ping opacity-75" />
          <div className="absolute -bottom-1 -left-[2.5px] w-1.5 h-1.5 bg-primary-fixed rotate-45 shadow-[0_0_8px_#ccf200]" />
        </motion.div>

        {/* Timeline Items with Fast AnimatePresence on Tab Switch */}
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-12 relative z-10"
          >
            {currentItems.map((item, index) => {
              const isActive = activeItems.has(index);
              return (
                <div
                  key={`${activeTab}-${item.year}-${index}`}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
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
                    <div className="flex items-center gap-2 mb-1">
                      {activeTab === 'all' && item.type && (
                        <span className={`text-[8px] px-1 py-0.2 font-mono uppercase tracking-wider ${
                          item.type === 'WORK'
                            ? 'bg-primary-fixed/20 text-primary-fixed border border-primary-fixed/40'
                            : item.type === 'RESEARCH'
                            ? 'bg-tertiary-container/30 text-tertiary-fixed border border-tertiary-fixed/40'
                            : 'bg-surface-container-high text-on-surface border border-border-primary'
                        }`}>
                          [{item.type}]
                        </span>
                      )}
                      <h3 className="text-[12px] leading-[1] tracking-[0.02em] font-semibold uppercase text-on-background group-hover:text-white transition-colors">
                        {item.companyOrInst} {`//`} {item.roleOrDegree}
                      </h3>
                    </div>

                    <span className="text-[11px] leading-[1.2] tracking-[0.04em] font-medium text-text-dim uppercase mb-3">
                      {item.location}
                    </span>
                    <p className="text-[14px] leading-[1.6] font-normal text-text-dim group-hover:text-text-muted transition-colors max-w-2xl">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
