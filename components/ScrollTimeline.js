'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

export default function ScrollTimeline({ id = 'timeline', experience = [], education = [] }) {
  const [activeTab, setActiveTab] = useState('experience');
  const containerRef = useRef(null);
  const railRef = useRef(null);
  const itemRefs = useRef([]);
  const [activeItems, setActiveItems] = useState(() => new Set());

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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  const beamHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'], { clamp: true });
  const beamOpacity = useTransform(scrollYProgress, [0, 0.02, 0.95, 1], [0, 1, 1, 0.8], { clamp: true });

  const evaluateActiveItems = useCallback((progress) => {
    if (!railRef.current) return;
    const currentProgress = progress !== undefined ? progress : scrollYProgress.get();

    if (currentProgress <= 0.01) {
      setActiveItems(new Set());
      return;
    }

    const railHeight = railRef.current.offsetHeight;
    const currentBeamPx = currentProgress * railHeight;

    const newActive = new Set();
    const validRefs = itemRefs.current.filter(Boolean);

    if (validRefs.length === currentItems.length) {
      validRefs.forEach((el, index) => {
        if (el) {
          const markerY = el.offsetTop + 6;
          if (currentBeamPx >= markerY - 6) {
            newActive.add(index);
          }
        }
      });
    } else {
      // Proportional fallback while refs mount
      const total = currentItems.length;
      for (let i = 0; i < total; i++) {
        const threshold = total > 1 ? i / (total - 1) : 0;
        if (currentProgress >= threshold - 0.04) {
          newActive.add(i);
        }
      }
    }

    setActiveItems(newActive);
  }, [currentItems.length, scrollYProgress]);

  // Handle scroll events
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    evaluateActiveItems(progress);
  });

  // Re-evaluate immediately when tab changes
  useEffect(() => {
    itemRefs.current = [];
    evaluateActiveItems(scrollYProgress.get());

    const rafId = requestAnimationFrame(() => {
      evaluateActiveItems(scrollYProgress.get());
    });

    const timer = setTimeout(() => {
      evaluateActiveItems(scrollYProgress.get());
    }, 60);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, [activeTab, evaluateActiveItems, scrollYProgress]);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => evaluateActiveItems(scrollYProgress.get());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [evaluateActiveItems, scrollYProgress]);

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
        {/* Static Background Rail */}
        <div className="absolute left-[5.5px] top-3 bottom-6 w-px bg-border-primary/40" />

        {/* Dynamic Active Scroll Progress Beam */}
        <motion.div
          style={{
            height: beamHeight,
            opacity: beamOpacity,
          }}
          className="absolute left-[5.5px] top-3 w-px bg-gradient-to-b from-primary-fixed via-primary-fixed to-primary-fixed-dim shadow-[0_0_12px_#ccf200] z-0 origin-top"
        >
          {/* Glowing Leading Head */}
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
                  {/* Milestone Marker Square */}
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
