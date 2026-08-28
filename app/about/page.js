'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import MobileMenu from '@/components/MobileMenu';
import SectionReveal from '@/components/SectionReveal';
import TiltCard from '@/components/TiltCard';
import ScrollTimeline from '@/components/ScrollTimeline';
import { siteConfig, experience, education } from '@/lib/data';
import { skillsWithProvenance, skillCategories } from '@/lib/skillsData';

export default function AboutPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSkillId, setSelectedSkillId] = useState(skillsWithProvenance[0].id);
  const [activeTag, setActiveTag] = useState(null);

  const filteredSkills = selectedCategory === 'all'
    ? skillsWithProvenance
    : skillsWithProvenance.filter((s) => s.category === selectedCategory);

  const activeSkill = skillsWithProvenance.find((s) => s.id === selectedSkillId) || filteredSkills[0] || skillsWithProvenance[0];

  return (
    <>
      <Sidebar />
      <main className="md:ml-[150px] min-h-screen flex flex-col pt-16 md:pt-0">
        <TopBar />
        <MobileMenu />

        {/* TOP SECTION — 3 Columns: Bio | Skills Selector | Skill Details */}
        <SectionReveal>
          <section className="grid grid-cols-1 lg:grid-cols-12 border-b border-border-primary min-h-[580px]">
            
            {/* Col 1 — About Me (4 cols) */}
            <div className="lg:col-span-4 p-[28px] border-b lg:border-b-0 lg:border-r border-border-primary flex flex-col justify-between">
              <div>
                <div className="text-[11px] leading-[1.2] tracking-[0.04em] font-medium text-primary-fixed uppercase mb-8">
                  {`//`} ABOUT ME
                </div>
                
                <h1 className="font-[family-name:var(--font-display)] text-[28px] md:text-[32px] leading-[1.1] tracking-[-0.02em] font-bold uppercase mb-6">
                  I&apos;M HAZEM, A SOFTWARE ENGINEER BASED IN BIELEFELD, GERMANY.
                </h1>
                
                <div className="flex flex-col gap-4 text-[13px] leading-[1.65] font-normal text-text-muted">
                  {siteConfig.bio.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-border-muted flex flex-col gap-1.5">
                  <div className="text-[10px] text-text-dim uppercase tracking-wider font-semibold">CURRENT FOCUS</div>
                  <div className="text-[12px] text-on-surface font-medium">
                    M.Sc. Intelligent Interactive Systems @ Bielefeld University
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-3 py-2 bg-surface-container border border-border-primary text-primary-fixed hover:border-primary-fixed hover:bg-surface-hover transition-colors text-[11px] font-semibold uppercase tracking-wider"
                >
                  <span>[ DOWNLOAD CV ]</span>
                  <span className="material-symbols-outlined text-[15px]">download</span>
                </motion.button>
                <Link
                  href="/contact"
                  className="flex items-center gap-2 px-3 py-2 bg-transparent border border-border-muted text-text-muted hover:border-border-primary hover:text-on-surface transition-colors text-[11px] font-semibold uppercase tracking-wider"
                >
                  <span>[ CONTACT ]</span>
                </Link>
              </div>
            </div>

            {/* Col 2 — Capabilities & Stack (4 cols) with Floating Active Indicator */}
            <div className="lg:col-span-4 p-[28px] border-b lg:border-b-0 lg:border-r border-border-primary bg-surface/50 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[11px] leading-[1.2] tracking-[0.04em] font-medium text-primary-fixed uppercase">
                  {`//`} CAPABILITIES & STACK
                </div>
              </div>

              {/* Category Filter Pills with Floating Indicator */}
              <div className="flex flex-wrap gap-1 mb-5 pb-3 border-b border-border-muted">
                {skillCategories.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        const matching = cat.id === 'all' ? skillsWithProvenance : skillsWithProvenance.filter(s => s.category === cat.id);
                        if (matching.length > 0 && !matching.some(s => s.id === selectedSkillId)) {
                          setSelectedSkillId(matching[0].id);
                        }
                      }}
                      className="relative text-[10px] px-2.5 py-1 uppercase tracking-wider font-mono transition-colors"
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-category-pill"
                          className="absolute inset-0 bg-primary-fixed"
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                      )}
                      <span className={`relative z-10 font-medium ${
                        isActive ? 'text-on-primary-fixed font-bold' : 'text-text-muted hover:text-on-surface'
                      }`}>
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Skills Interactive Rows with Floating Active Indicator */}
              <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto max-h-[460px] pr-1">
                {filteredSkills.map((skill) => {
                  const isSelected = skill.id === activeSkill.id;
                  return (
                    <button
                      key={skill.id}
                      onClick={() => setSelectedSkillId(skill.id)}
                      onMouseEnter={() => setSelectedSkillId(skill.id)}
                      className={`relative w-full text-left p-2.5 border transition-all flex items-center justify-between group overflow-hidden ${
                        isSelected
                          ? 'border-primary-fixed text-on-surface'
                          : 'border-border-muted hover:border-border-primary hover:bg-surface-hover text-text-muted hover:text-on-surface'
                      }`}
                    >
                      {/* Floating Active Indicator */}
                      {isSelected && (
                        <motion.div
                          layoutId="active-skill-pill"
                          className="absolute inset-0 bg-primary-fixed/10 border-l-[3px] border-l-primary-fixed shadow-[inset_0_0_15px_rgba(204,242,0,0.05)]"
                          transition={{ type: 'spring', stiffness: 700, damping: 45 }}
                        />
                      )}

                      <div className="relative z-10 flex items-center gap-2.5 min-w-0">
                        <span className={`material-symbols-outlined text-[18px] transition-colors ${
                          isSelected ? 'text-primary-fixed' : 'text-text-dim group-hover:text-text-muted'
                        }`}>
                          {skill.icon}
                        </span>
                        <span className="text-[11px] font-semibold tracking-wider uppercase truncate">
                          {skill.shortName}
                        </span>
                      </div>

                      <div className="relative z-10 flex items-center gap-2 shrink-0">
                        <span className={`text-[9px] px-1.5 py-0.5 uppercase tracking-wider font-mono border transition-colors ${
                          isSelected
                            ? 'border-primary-fixed/40 bg-primary-fixed/20 text-primary-fixed font-bold'
                            : 'border-border-muted bg-surface text-text-dim'
                        }`}>
                          {skill.tag}
                        </span>
                        <motion.span
                          animate={{ x: isSelected ? 2 : 0, opacity: isSelected ? 1 : 0 }}
                          transition={{ duration: 0.15 }}
                          className="text-[12px] font-mono text-primary-fixed"
                        >
                          →
                        </motion.span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-border-muted flex items-center justify-between text-[10px] text-text-dim font-mono">
                <span>SELECT OR HOVER TO VIEW DETAILS</span>
              </div>
            </div>

            {/* Col 3 — Skill Details (4 cols) with Fast AnimatePresence & TiltCards */}
            <div className="lg:col-span-4 p-[28px] bg-surface-container-lowest flex flex-col justify-between relative overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={activeSkill.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col justify-between h-full"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4 border-b border-border-primary pb-3">
                      <div className="text-[11px] leading-[1.2] tracking-[0.04em] font-medium text-primary-fixed uppercase flex items-center gap-1.5">
                        <span>{`//`} DETAILS</span>
                      </div>
                    </div>

                    {/* Active Skill Title & Tag */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="material-symbols-outlined text-primary-fixed text-[22px]">
                          {activeSkill.icon}
                        </span>
                        <h2 className="text-[16px] font-bold uppercase tracking-wider text-on-surface">
                          {activeSkill.name}
                        </h2>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] px-2 py-0.5 bg-primary-fixed text-on-primary-fixed font-bold uppercase tracking-wider">
                          {activeSkill.categoryLabel}
                        </span>
                        <span className="text-[9px] px-2 py-0.5 bg-surface border border-border-primary text-text-muted font-mono uppercase">
                          {activeSkill.tag}
                        </span>
                      </div>
                    </div>

                    {/* Summary */}
                    <p className="text-[12px] leading-[1.6] text-text-muted mb-6 bg-surface/80 p-3 border border-border-muted">
                      {activeSkill.summary}
                    </p>

                    {/* Provenance & Where Used — with TiltCard Magnetic Hover */}
                    <div className="mb-6">
                      <div className="text-[10px] font-mono text-primary-fixed uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                        <span>WHERE I USED THIS:</span>
                      </div>

                      <div className="flex flex-col gap-2.5">
                        {activeSkill.provenance.map((item, idx) => (
                          <TiltCard
                            key={idx}
                            className="p-3 bg-surface border border-border-primary hover:border-primary-fixed/60 shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-[11px]"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[8px] px-1 py-0.2 font-mono uppercase tracking-wider ${
                                  item.badge === 'WORK'
                                    ? 'bg-primary-fixed/20 text-primary-fixed border border-primary-fixed/40'
                                    : item.badge === 'RESEARCH'
                                    ? 'bg-tertiary-container/30 text-tertiary-fixed border border-tertiary-fixed/40'
                                    : 'bg-surface-container-high text-on-surface border border-border-primary'
                                }`}>
                                  [{item.badge}]
                                </span>
                                <span className="font-bold uppercase text-on-surface">
                                  {item.entity}
                                </span>
                              </div>
                              {item.link.startsWith('http') ? (
                                <a
                                  href={item.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-primary-fixed hover:underline flex items-center gap-0.5"
                                >
                                  REPO ↗
                                </a>
                              ) : (
                                <a
                                  href={item.link}
                                  className="text-[10px] text-text-dim hover:text-primary-fixed flex items-center gap-0.5"
                                >
                                  TIMELINE ↓
                                </a>
                              )}
                            </div>

                            <div className="text-[10px] text-text-dim uppercase font-mono mt-1">
                              {item.role}
                            </div>
                            
                            <p className="text-[11px] leading-[1.5] text-text-muted mt-1.5">
                              {item.summary}
                            </p>
                          </TiltCard>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Associated Stack / Interactive Tag Badges */}
                  <div className="pt-4 border-t border-border-primary">
                    <div className="text-[9px] font-mono text-text-dim uppercase tracking-wider mb-2">
                      ASSOCIATED STACK & TOOLING
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {activeSkill.ecosystem.map((tool, i) => {
                        const isTagSelected = activeTag === tool;
                        return (
                          <motion.button
                            key={i}
                            whileHover={{ scale: 1.06, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveTag(isTagSelected ? null : tool)}
                            className={`text-[10px] font-mono px-2 py-0.5 border transition-all ${
                              isTagSelected
                                ? 'bg-primary-fixed text-on-primary-fixed font-bold border-primary-fixed shadow-[0_0_8px_rgba(204,242,0,0.3)]'
                                : 'bg-surface-container-low border-border-muted text-text-muted hover:border-primary-fixed/50 hover:text-on-surface'
                            }`}
                          >
                            {tool}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </section>
        </SectionReveal>

        {/* BOTTOM SECTION — Unified Tri-Mode Timeline with Active Scroll Progress Beam */}
        <SectionReveal>
          <ScrollTimeline
            id="timeline"
            experience={experience}
            education={education}
          />
        </SectionReveal>
      </main>
    </>
  );
}
