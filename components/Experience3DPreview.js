'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { animate, stagger } from 'animejs';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import MobileMenu from '@/components/MobileMenu';
import { useCms } from '@/components/CmsProvider';
import { getExperienceArtifactProfile } from '@/lib/experience-artifacts';
import styles from './Experience3DPreview.module.css';

const ExperienceWireframeScene = dynamic(
  () => import('@/components/ExperienceWireframeScene'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center font-mono text-[10px] tracking-[0.18em] text-text-dim">
        INITIALIZING WEBGL…
      </div>
    ),
  }
);

export default function Experience3DPreview() {
  const { experience } = useCms();
  const [activeIndex, setActiveIndex] = useState(0);
  const [inspectedPart, setInspectedPart] = useState(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const pageRef = useRef(null);
  const detailRef = useRef(null);
  const activeRailRef = useRef(null);
  const inspectionRef = useRef(null);
  const activeExperience = experience[activeIndex] || experience[0];
  const activeProfile = activeExperience
    ? getExperienceArtifactProfile(activeExperience.company, activeIndex)
    : getExperienceArtifactProfile();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReduceMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);
    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    if (reduceMotion || !pageRef.current) return undefined;

    const entrance = animate(pageRef.current.querySelectorAll('[data-preview-reveal]'), {
      opacity: { from: 0 },
      y: { from: 16 },
      duration: 650,
      delay: stagger(70),
      ease: 'outExpo',
    });

    return () => entrance.revert();
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return undefined;

    const animations = [];

    if (detailRef.current) {
      animations.push(animate(detailRef.current.children, {
        opacity: { from: 0 },
        y: { from: 10 },
        duration: 420,
        delay: stagger(45),
        ease: 'outExpo',
      }));

    }

    if (activeRailRef.current) {
      animations.push(animate(activeRailRef.current, {
        scaleY: { from: 0 },
        duration: 380,
        ease: 'outExpo',
      }));
    }

    return () => animations.forEach((animation) => animation.revert());
  }, [activeIndex, reduceMotion]);

  useEffect(() => {
    if (reduceMotion || !inspectionRef.current || !inspectedPart) return undefined;

    const inspection = animate(inspectionRef.current, {
      opacity: { from: 0 },
      y: { from: 8 },
      duration: 260,
      ease: 'outExpo',
    });

    return () => inspection.revert();
  }, [inspectedPart, reduceMotion]);

  const selectExperience = (index) => {
    setActiveIndex(index);
    setInspectedPart(null);
  };

  if (!activeExperience) return null;

  return (
    <>
      <Sidebar />
      <main ref={pageRef} className="min-h-screen bg-surface-dim pt-16 md:ml-[180px] md:pt-0">
        <TopBar />
        <MobileMenu />

        <div className="px-5 py-8 md:px-8 lg:px-12 lg:py-10">
          <header data-preview-reveal className="mb-10 border-b border-border-primary pb-8">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/about#timeline"
                className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-fixed transition-colors hover:text-primary"
              >
                <span aria-hidden="true">←</span>
                BACK TO ABOUT
              </Link>
              <span className="border border-primary-fixed/30 bg-primary-fixed/10 px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-primary-fixed">
                EXPERIMENT / NOT IN NAVIGATION
              </span>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.42fr)] lg:items-end">
              <div>
                <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-primary-fixed">
                  {'// ABOUT TIMELINE / INTERACTION STUDY'}
                </p>
                <h1 className="max-w-4xl font-[family-name:var(--font-display)] text-[clamp(38px,6vw,86px)] font-extrabold uppercase leading-[0.88] tracking-[-0.055em] text-primary">
                  Experience<br />as a signal.
                </h1>
              </div>
              <p className="max-w-md font-mono text-[12px] leading-[1.7] text-text-muted lg:justify-self-end">
                Hover or focus a role to translate its work into a distinct wireframe system. The text stays primary; motion supplies context.
              </p>
            </div>
          </header>

          <section className="grid items-start gap-8 xl:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)] xl:gap-12">
            <div data-preview-reveal>
              <div className="mb-5 flex items-center justify-between border-b border-border-muted pb-3 font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim">
                <span>Professional timeline</span>
                <span>{String(experience.length).padStart(2, '0')} nodes</span>
              </div>

              <div className="relative">
                <div className="absolute bottom-0 left-[6px] top-0 w-px bg-border-primary" aria-hidden="true" />

                <div className="flex flex-col gap-3">
                  {experience.map((item, index) => {
                    const profile = getExperienceArtifactProfile(item.company, index);
                    const isActive = activeIndex === index;

                    return (
                      <button
                        key={`${item.company}-${item.year}`}
                        type="button"
                        aria-pressed={isActive}
                        onPointerEnter={() => selectExperience(index)}
                        onFocus={() => selectExperience(index)}
                        onClick={() => selectExperience(index)}
                        className={`${styles.timelineItem} ${isActive ? styles.timelineItemActive : ''} group relative ml-0 grid w-full grid-cols-[28px_minmax(0,1fr)] gap-3 py-5 pr-4 text-left md:grid-cols-[28px_150px_minmax(0,1fr)] md:gap-5 md:py-6`}
                      >
                        <span
                          className={`${styles.timelineMarker} ${isActive ? styles.timelineMarkerActive : ''} relative z-10 mt-1 block h-[13px] w-[13px] border border-border-primary bg-surface-container-high`}
                          aria-hidden="true"
                        />

                        <span className={`font-mono text-[12px] font-semibold tracking-[0.04em] transition-colors ${isActive ? 'text-primary-fixed' : 'text-text-muted'}`}>
                          {item.year}
                        </span>

                        <span className="col-start-2 min-w-0 md:col-start-3">
                          <span className="mb-2 flex flex-wrap items-center gap-2">
                            <span className={`font-[family-name:var(--font-display)] text-[17px] font-bold uppercase leading-tight transition-colors ${isActive ? 'text-primary' : 'text-on-surface'}`}>
                              {item.company}
                            </span>
                            <span className={`border px-1.5 py-0.5 font-mono text-[8px] tracking-[0.12em] transition-colors ${isActive ? 'border-primary-fixed/50 bg-primary-fixed/10 text-primary-fixed' : 'border-border-muted text-text-dim'}`}>
                              {profile.index}
                            </span>
                          </span>
                          <span className="mb-2 block font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted">
                            {item.role} · {item.location}
                          </span>
                          <span className={`block max-w-2xl font-mono text-[12px] leading-[1.65] transition-colors ${isActive ? 'text-text-muted' : 'text-text-dim'}`}>
                            {item.description}
                          </span>
                        </span>

                        {isActive && (
                          <span
                            ref={activeRailRef}
                            className="absolute inset-y-0 left-0 w-px bg-primary-fixed shadow-[0_0_14px_rgba(204,242,0,0.7)]"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <aside data-preview-reveal className={`${styles.viewportPanel} overflow-hidden border border-border-primary bg-surface xl:sticky xl:top-20`}>
              <div className={`${styles.sceneStage} relative h-[390px] sm:h-[460px]`}>
                <div className={styles.stageGrid} aria-hidden="true" />
                <ExperienceWireframeScene
                  mode={activeProfile.mode}
                  reducedMotion={Boolean(reduceMotion)}
                  onInspect={setInspectedPart}
                />

                {inspectedPart && (
                  <div
                    ref={inspectionRef}
                    data-inspection
                    className="pointer-events-none absolute bottom-4 left-4 right-4 max-w-[360px] border-l-2 border-primary-fixed bg-black/85 px-4 py-3 backdrop-blur-sm"
                  >
                    <div className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-primary-fixed">
                      {inspectedPart.label}
                    </div>
                    <p className="font-mono text-[10px] leading-[1.55] text-text-muted">
                      {inspectedPart.description}
                    </p>
                  </div>
                )}
              </div>

              <div className="min-h-[170px] border-t border-border-primary p-5 sm:p-6">
                  <div ref={detailRef}>
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <h2 className="font-[family-name:var(--font-display)] text-[22px] font-bold uppercase tracking-[-0.02em] text-primary">
                        {activeProfile.title}
                      </h2>
                      <span className="bg-primary-fixed px-2 py-1 font-mono text-[9px] font-bold tracking-[0.1em] text-on-primary-fixed">
                        {activeProfile.signal}
                      </span>
                    </div>
                    <p className="mb-4 font-mono text-[12px] leading-[1.65] text-text-muted">
                      {activeProfile.note}
                    </p>
                    <div className="flex items-center gap-2 border-t border-border-muted pt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-text-dim">
                      <span className="text-primary-fixed">Active role</span>
                      <span>/</span>
                      <span className="truncate">{activeExperience.company}</span>
                    </div>
                  </div>
              </div>
            </aside>
          </section>

          <footer className="mt-12 grid gap-4 border-t border-border-primary pt-6 font-mono text-[10px] uppercase tracking-[0.12em] text-text-dim sm:grid-cols-3">
            <p><span className="text-primary-fixed">01 /</span> Timeline remains scannable</p>
            <p><span className="text-primary-fixed">02 /</span> One visual metaphor per role</p>
            <p><span className="text-primary-fixed">03 /</span> Reduced-motion aware</p>
          </footer>
        </div>
      </main>
    </>
  );
}
