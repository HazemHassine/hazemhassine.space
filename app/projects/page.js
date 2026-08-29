'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import MobileMenu from '@/components/MobileMenu';
import SectionReveal from '@/components/SectionReveal';
import TiltCard from '@/components/TiltCard';
import { getProjectThumbnail } from '@/lib/data';
import { useCms } from '@/components/CmsProvider';

const IN_PROGRESS_PROJECTS = new Set(['arbiter', 'repotrajectory', 'gitaudit']);

function ProjectCard({ project, index, onTagClick, activeTag }) {
  const [imageError, setImageError] = useState(false);
  const thumbnailUrl = getProjectThumbnail(project);
  const projectStatus = project.status || (
    IN_PROGRESS_PROJECTS.has(project.slug) ? 'STILL IN PROGRESS' : null
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="w-full"
    >
      <TiltCard className="border-b border-border-primary bg-surface/70 hover:bg-surface hover:border-primary-fixed/70 transition-colors duration-300 group relative">
        <Link
          href={project.href}
          className="block py-5 md:py-6 px-4 md:px-6 w-full cursor-pointer"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 lg:gap-8 relative z-10">
            
            {/* Mobile Top Header: Number & Title Header */}
            <div className="flex items-center justify-between md:hidden w-full pb-2 border-b border-border-muted">
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-mono font-bold text-primary-fixed bg-surface-container-high px-2 py-0.5 border border-border-primary">
                  {project.id}
                </span>
                <h2 className="font-[family-name:var(--font-display)] text-lg font-bold uppercase text-primary group-hover:text-primary-fixed transition-colors">
                  {project.title}
                </h2>
              </div>
              <span className="text-[11px] font-mono text-primary-fixed flex items-center gap-1">
                VIEW [ → ]
              </span>
            </div>

            {/* Desktop Number Column with Brutalist Index */}
            <div className="hidden md:flex flex-col items-center justify-center md:w-12 shrink-0">
              <span className="text-terminal-button font-mono font-bold text-text-muted group-hover:text-primary-fixed transition-colors">
                {project.id}
              </span>
              <span className="text-[9px] font-mono text-text-dim mt-0.5 group-hover:text-primary-fixed/70 transition-colors">
                NODE
              </span>
            </div>

            {/* Main Info Column */}
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="flex flex-wrap items-center gap-2.5 mb-1">
                <h2 className="hidden md:block font-[family-name:var(--font-display)] text-xl font-bold uppercase text-primary group-hover:text-primary-fixed leading-tight transition-colors duration-300">
                  {project.title}
                </h2>
                {projectStatus && (
                  <span className="inline-flex items-center gap-1.5 border border-primary-fixed/60 bg-primary-fixed/10 px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider text-primary-fixed">
                    <span className="h-1.5 w-1.5 bg-primary-fixed" aria-hidden="true"></span>
                    {projectStatus}
                  </span>
                )}
                {project.categoryLabel && (
                  <span className="hidden md:inline-flex text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 border border-border-primary text-text-dim group-hover:border-primary-fixed/40 group-hover:text-primary-fixed/80 transition-colors">
                    {project.categoryLabel}
                  </span>
                )}
              </div>
              <div className="text-[11px] font-mono text-secondary-fixed uppercase mb-2 tracking-wide font-medium">
                {project.subtitle}
              </div>
              <p className="text-[13px] leading-relaxed text-text-dim max-w-xl font-mono">
                {project.description}
              </p>
            </div>

            {/* Tech Stack Column (Interactive Tag Badges) */}
            <div className="w-full md:w-44 shrink-0">
              <div className="text-[9px] font-mono text-text-dim uppercase tracking-wider mb-2 hidden md:block">
                TECH ARSENAL
              </div>
              <div className="flex flex-wrap md:flex-col gap-1.5">
                {project.tech.map((tech, techIndex) => {
                  const isTagActive = activeTag === tech;
                  return (
                    <button
                      key={techIndex}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onTagClick(tech);
                      }}
                      className={`text-[10px] font-mono text-left px-2 py-0.5 border transition-all flex items-center gap-1.5 w-fit ${
                        isTagActive
                          ? 'border-primary-fixed bg-primary-fixed text-surface font-bold shadow-[0_0_8px_rgba(204,242,0,0.3)]'
                          : 'border-border-muted bg-surface-container-low text-text-muted hover:border-primary-fixed hover:text-primary'
                      }`}
                    >
                      <span className="w-1 h-1 bg-primary-fixed rounded-full"></span>
                      <span>{tech}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dedicated Thumbnail Column with Scanline Hover */}
            <div className="w-full md:w-48 lg:w-56 shrink-0 flex items-center justify-center">
              <div className="w-full h-36 md:h-28 relative border border-border-primary bg-surface-container-high overflow-hidden group-hover:border-primary-fixed transition-all duration-300 shadow-md group-hover:shadow-[0_0_15px_rgba(204,242,0,0.15)]">
                {thumbnailUrl && !imageError ? (
                  <>
                    <Image
                      src={thumbnailUrl}
                      alt={`${project.title} Preview`}
                      fill
                      priority={index < 2}
                      sizes="(max-width: 768px) 100vw, 240px"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      onError={() => setImageError(true)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-1.5 py-0.5 border border-border-primary text-[9px] font-mono text-primary-fixed">
                      EXPLORE ↗
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-2.5 text-center bg-surface-container-low relative">
                    <div className="grid-background absolute inset-0 opacity-20 pointer-events-none"></div>
                    <span className="material-symbols-outlined text-text-dim text-[20px] mb-0.5">terminal</span>
                    <span className="font-[family-name:var(--font-mono)] text-[10px] font-bold text-text-muted tracking-wider uppercase truncate max-w-full">
                      {project.title}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop CTA Column */}
            <div className="hidden md:flex md:w-28 shrink-0 md:justify-end items-center">
              <span className="px-3 py-1.5 bg-surface-container border border-border-primary text-text-muted group-hover:border-primary-fixed group-hover:bg-primary-fixed group-hover:text-surface transition-all duration-300 text-[11px] font-mono font-bold uppercase tracking-wider">
                [ VIEW ]
              </span>
            </div>

          </div>
        </Link>
      </TiltCard>
    </motion.div>
  );
}

export default function ProjectsPage() {
  const { projects, siteConfig, pageContent } = useCms();
  const copy = pageContent?.projects || {};
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTag, setActiveTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const projectCategories = useMemo(() => [
    { id: 'all', label: 'ALL PROJECTS' },
    ...Array.from(new Map(projects.map((project) => [
      project.category,
      { id: project.category, label: project.categoryLabel || project.category },
    ])).values()).filter((category) => category.id),
  ], [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'all' || project.category === selectedCategory;
      const matchesTag = !activeTag || project.tech.includes(activeTag);
      const matchesSearch =
        !searchQuery ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tech.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesTag && matchesSearch;
    });
  }, [projects, selectedCategory, activeTag, searchQuery]);

  const handleTagClick = (tag) => {
    setActiveTag((prev) => (prev === tag ? null : tag));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-surface-dim grid-background relative font-[family-name:var(--font-mono)]">
      <div className="noise-overlay"></div>

      <Sidebar />

      <div className="flex-1 flex flex-col relative w-full md:ml-[180px]">
        <TopBar />
        <MobileMenu />

        <main className="flex-1 p-[20px] sm:p-[28px] md:p-12 lg:p-20 pt-28 md:pt-12 flex flex-col max-w-[1300px] w-full mx-auto min-h-screen">
          
          {/* HEADER & TELEMETRY */}
          <SectionReveal delay={0.08}>
            <div className="mb-8">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border-primary mb-6">
                <div className="flex items-center gap-2.5 text-[11px] font-mono text-primary-fixed uppercase tracking-wider">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-fixed opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-fixed"></span>
                  </span>
                  <span>{copy.telemetryLabel || 'SYSTEM TELEMETRY'}: ALL {projects.length} PROJECTS ONLINE</span>
                </div>
                <div className="text-[11px] text-text-dim uppercase font-mono">
                  FILTERED: <strong className="text-primary-fixed">{filteredProjects.length}</strong> / {projects.length}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase text-primary mb-3 leading-tight tracking-tight">
                    {copy.title || '/ PROJECTS'}
                  </h1>
                  <p className="text-body-md text-text-muted max-w-2xl font-mono leading-relaxed">
                    {copy.introduction || 'Engineered AI systems, agent-enabled control planes, explainable analytics pipelines, and interactive developer tools.'}
                  </p>
                </div>

                {/* Search Bar Input */}
                <div className="relative w-full md:w-72">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-dim text-[18px]">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={copy.searchPlaceholder || 'SEARCH CODEBASES...'}
                    className="w-full bg-surface border border-border-primary pl-9 pr-8 py-2 text-[12px] font-mono text-primary placeholder:text-text-dim focus:outline-none focus:border-primary-fixed transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-dim hover:text-primary text-[12px] font-mono"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>
          </SectionReveal>

          {/* INTERACTIVE CATEGORY FILTER PILLS WITH GLIDING SPRING INDICATOR */}
          <SectionReveal delay={0.12}>
            <div className="mb-6 pb-4 border-b border-border-primary flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-1.5">
                {projectCategories.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  const count =
                    cat.id === 'all'
                      ? projects.length
                      : projects.filter((p) => p.category === cat.id).length;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setActiveTag(null);
                      }}
                      className="relative text-[11px] px-3 py-1.5 uppercase tracking-wider font-mono transition-colors"
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-project-category"
                          className="absolute inset-0 bg-primary-fixed"
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                      )}
                      <span
                        className={`relative z-10 font-bold flex items-center gap-1.5 ${
                          isActive ? 'text-surface' : 'text-text-muted hover:text-primary'
                        }`}
                      >
                        <span>{cat.label}</span>
                        <span className={`text-[9px] px-1 py-0.2 font-mono ${
                          isActive ? 'bg-surface/20 text-surface' : 'bg-surface border border-border-muted text-text-dim'
                        }`}>
                          {count}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {activeTag && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-text-dim uppercase">TAG FILTER:</span>
                  <span className="text-[10px] font-mono font-bold text-primary-fixed bg-primary-fixed/10 border border-primary-fixed/30 px-2 py-0.5 flex items-center gap-1.5">
                    {activeTag}
                    <button onClick={() => setActiveTag(null)} className="hover:text-white">×</button>
                  </span>
                </div>
              )}
            </div>
          </SectionReveal>

          {/* PROJECT LIST */}
          <div className="flex flex-col border-t border-border-primary flex-1">
            <AnimatePresence mode="popLayout">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    onTagClick={handleTagClick}
                    activeTag={activeTag}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-12 text-center bg-surface border border-border-primary my-6 flex flex-col items-center justify-center gap-3"
                >
                  <span className="material-symbols-outlined text-text-dim text-[32px]">
                    filter_alt_off
                  </span>
                  <div className="text-[14px] font-mono font-bold text-text-muted uppercase">
                    NO MATCHING PROJECTS FOUND
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setActiveTag(null);
                      setSearchQuery('');
                    }}
                    className="px-4 py-1.5 bg-surface-container border border-primary-fixed text-primary-fixed text-[11px] font-mono font-bold uppercase hover:bg-primary-fixed hover:text-surface transition-colors"
                  >
                    [ RESET ALL FILTERS ]
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* FOOTER */}
          <SectionReveal delay={0.25}>
            <footer className="mt-auto border-t border-border-primary p-[20px] sm:p-[28px] flex justify-between items-center text-text-dim text-meta-label mt-16">
              <div>{siteConfig.copyright}</div>
              <div className="flex gap-6 font-mono text-[11px]">
                <Link href="/" className="hover:text-primary-fixed transition-colors">
                  [ HOME ]
                </Link>
                <Link href="/about" className="hover:text-primary-fixed transition-colors">
                  [ ABOUT & TIMELINE ]
                </Link>
              </div>
            </footer>
          </SectionReveal>

        </main>
      </div>
    </div>
  );
}
