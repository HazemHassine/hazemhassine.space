'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import MobileMenu from '@/components/MobileMenu';
import SectionReveal from '@/components/SectionReveal';
import { siteConfig, experience, education } from '@/lib/data';
import { skillsWithProvenance, skillCategories } from '@/lib/skillsData';

export default function AboutPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSkillId, setSelectedSkillId] = useState(skillsWithProvenance[0].id);

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
                <button className="flex items-center gap-2 px-3 py-2 bg-surface-container border border-border-primary text-primary-fixed hover:border-primary-fixed hover:bg-surface-hover transition-colors text-[11px] font-semibold uppercase tracking-wider">
                  <span>[ DOWNLOAD CV ]</span>
                  <span className="material-symbols-outlined text-[15px]">download</span>
                </button>
                <Link
                  href="/contact"
                  className="flex items-center gap-2 px-3 py-2 bg-transparent border border-border-muted text-text-muted hover:border-border-primary hover:text-on-surface transition-colors text-[11px] font-semibold uppercase tracking-wider"
                >
                  <span>[ CONTACT ]</span>
                </Link>
              </div>
            </div>

            {/* Col 2 — Capabilities & Stack (4 cols) */}
            <div className="lg:col-span-4 p-[28px] border-b lg:border-b-0 lg:border-r border-border-primary bg-surface/50 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[11px] leading-[1.2] tracking-[0.04em] font-medium text-primary-fixed uppercase">
                  {`//`} CAPABILITIES & STACK
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1 mb-5 pb-3 border-b border-border-muted">
                {skillCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      const matching = cat.id === 'all' ? skillsWithProvenance : skillsWithProvenance.filter(s => s.category === cat.id);
                      if (matching.length > 0 && !matching.some(s => s.id === selectedSkillId)) {
                        setSelectedSkillId(matching[0].id);
                      }
                    }}
                    className={`text-[10px] px-2 py-1 uppercase tracking-wider transition-all font-mono ${
                      selectedCategory === cat.id
                        ? 'bg-primary-fixed text-on-primary-fixed font-bold'
                        : 'bg-surface-container-low text-text-muted hover:text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Skills Interactive Rows */}
              <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto max-h-[460px] pr-1">
                {filteredSkills.map((skill) => {
                  const isSelected = skill.id === activeSkill.id;
                  return (
                    <button
                      key={skill.id}
                      onClick={() => setSelectedSkillId(skill.id)}
                      onMouseEnter={() => setSelectedSkillId(skill.id)}
                      className={`w-full text-left p-2.5 border transition-all flex items-center justify-between group ${
                        isSelected
                          ? 'bg-primary-fixed/10 border-primary-fixed text-on-surface pl-3.5 shadow-[inset_3px_0_0_0_#ccf200]'
                          : 'bg-surface-container-lowest/60 border-border-muted hover:border-border-primary hover:bg-surface-hover text-text-muted hover:text-on-surface'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`material-symbols-outlined text-[18px] transition-colors ${
                          isSelected ? 'text-primary-fixed' : 'text-text-dim group-hover:text-text-muted'
                        }`}>
                          {skill.icon}
                        </span>
                        <span className="text-[11px] font-semibold tracking-wider uppercase truncate">
                          {skill.shortName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[9px] px-1.5 py-0.5 uppercase tracking-wider font-mono border ${
                          isSelected
                            ? 'border-primary-fixed/40 bg-primary-fixed/20 text-primary-fixed font-bold'
                            : 'border-border-muted bg-surface text-text-dim'
                        }`}>
                          {skill.tag}
                        </span>
                        <span className={`text-[12px] font-mono transition-transform ${
                          isSelected ? 'text-primary-fixed translate-x-0.5' : 'text-transparent'
                        }`}>
                          →
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-border-muted flex items-center justify-between text-[10px] text-text-dim font-mono">
                <span>SELECT OR HOVER TO VIEW DETAILS</span>
              </div>
            </div>

            {/* Col 3 — Skill Details (4 cols) */}
            <div className="lg:col-span-4 p-[28px] bg-surface-container-lowest flex flex-col justify-between relative overflow-hidden">
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

                {/* Provenance & Where Used */}
                <div className="mb-6">
                  <div className="text-[10px] font-mono text-primary-fixed uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <span>WHERE I USED THIS:</span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {activeSkill.provenance.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-surface border border-border-primary hover:border-primary-fixed/50 transition-colors flex flex-col gap-1 text-[11px]"
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

                        <div className="text-[10px] text-text-dim uppercase font-mono">
                          {item.role}
                        </div>
                        
                        <p className="text-[11px] leading-[1.5] text-text-muted mt-1">
                          {item.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Associated Stack / Ecosystem Tags */}
              <div className="pt-4 border-t border-border-primary">
                <div className="text-[9px] font-mono text-text-dim uppercase tracking-wider mb-2">
                  ASSOCIATED STACK & TOOLING
                </div>
                <div className="flex flex-wrap gap-1">
                  {activeSkill.ecosystem.map((tool, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 bg-surface-container-low border border-border-muted text-text-muted"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </section>
        </SectionReveal>

        {/* BOTTOM SECTION — Experience Timeline */}
        <SectionReveal>
          <section id="experience" className="p-[28px] flex-1 flex flex-col">
            <div className="text-[11px] leading-[1.2] tracking-[0.04em] font-medium text-primary-fixed uppercase mb-12">
              {`//`} EXPERIENCE TIMELINE
            </div>

            <div className="relative max-w-4xl">
              <div className="absolute left-[5px] top-2 bottom-2 w-px bg-primary-fixed/20" />
              
              <div className="flex flex-col gap-12">
                {experience.map((item, index) => (
                  <div key={index} className="relative pl-8 md:pl-32 flex flex-col md:flex-row group">
                    <div className="absolute left-0 top-1.5 w-3 h-3 bg-primary-fixed border border-background transition-transform group-hover:scale-125" />
                    
                    <div className="md:absolute md:left-8 font-[family-name:var(--font-mono)] text-[17px] leading-[1.75] font-normal text-primary-fixed mb-1 md:mb-0">
                      {item.year}
                    </div>
                    
                    <div className="flex flex-col">
                      <h3 className="text-[12px] leading-[1] tracking-[0.02em] font-semibold uppercase text-on-background mb-1">
                        {item.company} {`//`} {item.role}
                      </h3>
                      <span className="text-[11px] leading-[1.2] tracking-[0.04em] font-medium text-text-muted uppercase mb-3">
                        {item.location}
                      </span>
                      <p className="text-[14px] leading-[1.6] font-normal text-text-dim max-w-2xl">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </SectionReveal>

        {/* BOTTOM SECTION — Education Timeline */}
        <SectionReveal>
          <section id="education" className="p-[28px] flex-1 flex flex-col border-t border-border-primary">
            <div className="text-[11px] leading-[1.2] tracking-[0.04em] font-medium text-primary-fixed uppercase mb-12">
              {`//`} EDUCATION TIMELINE
            </div>

            <div className="relative max-w-4xl">
              <div className="absolute left-[5px] top-2 bottom-2 w-px bg-primary-fixed/20" />
              
              <div className="flex flex-col gap-12">
                {education.map((item, index) => (
                  <div key={index} className="relative pl-8 md:pl-32 flex flex-col md:flex-row group">
                    <div className="absolute left-0 top-1.5 w-3 h-3 bg-primary-fixed border border-background" />
                    
                    <div className="md:absolute md:left-8 font-[family-name:var(--font-mono)] text-[17px] leading-[1.75] font-normal text-primary-fixed mb-1 md:mb-0">
                      {item.year}
                    </div>
                    
                    <div className="flex flex-col">
                      <h3 className="text-[12px] leading-[1] tracking-[0.02em] font-semibold uppercase text-on-background mb-1">
                        {item.institution} {`//`} {item.degree}
                      </h3>
                      <span className="text-[11px] leading-[1.2] tracking-[0.04em] font-medium text-text-muted uppercase mb-3">
                        {item.location}
                      </span>
                      <p className="text-[14px] leading-[1.6] font-normal text-text-dim max-w-2xl">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </SectionReveal>
      </main>
    </>
  );
}
