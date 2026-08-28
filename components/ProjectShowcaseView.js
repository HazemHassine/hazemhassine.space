'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import MobileMenu from '@/components/MobileMenu';
import SectionReveal from '@/components/SectionReveal';

export default function ProjectShowcaseView({ project, adjacent }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [activeScreenshot, setActiveScreenshot] = useState(0);
  const [lightboxImage, setLightboxImage] = useState(null);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const tabs = [
    { id: 'overview', label: '// 01. OVERVIEW & PROBLEM' },
    { id: 'architecture', label: '// 02. SYSTEM ARCHITECTURE' },
    { id: 'capabilities', label: '// 03. KEY CAPABILITIES' },
    { id: 'technical', label: '// 04. DEEP DIVE & SAFETY' },
    ...(project.screenshots && project.screenshots.length > 0 ? [{ id: 'gallery', label: `// 05. GALLERY (${project.screenshots.length})` }] : []),
    { id: 'cli', label: '// 06. CLI & GETTING STARTED' },
  ];

  const heroImage = project.primaryImage || project.screenshots?.[0]?.src;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-surface-dim grid-background relative font-[family-name:var(--font-mono)] text-primary">
      <div className="noise-overlay"></div>

      <Sidebar />

      <div className="flex-1 flex flex-col relative w-full md:ml-[180px]">
        <TopBar />
        <MobileMenu />

        <main className="flex-1 p-[20px] md:p-12 lg:p-16 pt-28 md:pt-12 flex flex-col max-w-[1300px] w-full mx-auto">
          
          {/* BREADCRUMB / TOP NAVIGATION */}
          <SectionReveal delay={0.05}>
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border-primary mb-8 text-[11px] uppercase tracking-wider text-text-muted">
              <div className="flex items-center gap-2">
                <Link 
                  href="/projects" 
                  className="text-primary-fixed hover:text-primary transition-colors flex items-center gap-1 font-semibold"
                >
                  <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                  / TECHNICAL ARCHIVE
                </Link>
                <span className="text-border-primary">/</span>
                <span className="text-primary">{project.title}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center px-2 py-0.5 border border-primary-fixed/40 bg-primary-fixed/10 text-primary-fixed text-[10px] font-bold">
                  {project.status}
                </span>
                <span className="text-text-dim">ID: {project.id}</span>
              </div>
            </div>
          </SectionReveal>

          {/* HERO HEADER WITH PREVIEW BANNER */}
          <SectionReveal delay={0.1}>
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-8 items-start mb-10">
              {/* Left Column: Text Metadata */}
              <div>
                <div className="text-[11px] font-mono text-primary-fixed uppercase tracking-widest mb-3">
                  // {project.category}
                </div>
                <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase text-primary tracking-tight leading-[0.95] mb-4">
                  {project.title}
                </h1>
                <p className="text-xl md:text-2xl text-secondary-fixed font-semibold max-w-4xl leading-snug mb-4">
                  {project.subtitle}
                </p>
                <p className="text-body-md text-text-muted max-w-3xl leading-relaxed mb-6">
                  {project.headline}
                </p>

                {/* ACTION BUTTONS & METADATA BAR */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-primary-fixed text-surface font-bold text-[12px] tracking-wider uppercase hover:bg-white transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(204,242,0,0.2)]"
                    >
                      <span className="material-symbols-outlined text-[16px]">code</span>
                      [ GITHUB REPOSITORY ]
                    </a>
                  )}
                  {project.liveDemo && (
                    <a
                      href={project.liveDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-surface-container border border-primary-fixed text-primary-fixed font-bold text-[12px] tracking-wider uppercase hover:bg-primary-fixed hover:text-surface transition-all flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                      [ LIVE DEMO ]
                    </a>
                  )}
                  <div className="text-[12px] text-text-dim flex items-center gap-3">
                    <span>TIMELINE: <strong className="text-text-muted">{project.timeline}</strong></span>
                    <span className="text-border-primary">|</span>
                    <span>ROLE: <strong className="text-text-muted">{project.role}</strong></span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Visual Frame */}
              {heroImage && (
                <div 
                  onClick={() => setLightboxImage(heroImage)}
                  className="relative group border border-border-primary bg-surface-container-high overflow-hidden cursor-pointer aspect-video md:aspect-[16/10] shadow-xl hover:border-primary-fixed transition-all"
                  title="Click to view full image"
                >
                  <Image
                    src={heroImage}
                    alt={`${project.title} Preview`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="text-[10px] font-mono text-primary-fixed uppercase tracking-wider bg-black/70 px-2 py-0.5 border border-border-primary">
                      [ VISUAL PREVIEW ]
                    </span>
                    <span className="text-[11px] text-white flex items-center gap-1 bg-black/70 px-2 py-0.5 border border-border-primary">
                      <span className="material-symbols-outlined text-[14px]">zoom_in</span>
                      EXPAND
                    </span>
                  </div>
                </div>
              )}
            </div>
          </SectionReveal>

          {/* STATS TICKER GRID */}
          <SectionReveal delay={0.15}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-border-primary mb-12 border border-border-primary">
              {project.stats.map((stat, i) => (
                <div key={i} className="bg-surface p-4 flex flex-col justify-between min-h-[90px]">
                  <span className="text-[10px] text-text-muted uppercase tracking-widest mb-1">
                    {stat.label}
                  </span>
                  <span className="text-[13px] font-bold text-primary-fixed leading-tight font-mono">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </SectionReveal>

          {/* TECH STACK CHIPS */}
          <SectionReveal delay={0.18}>
            <div className="mb-10 p-5 bg-surface border border-border-primary flex flex-col md:flex-row md:items-center gap-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-text-muted shrink-0 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary-fixed">terminal</span>
                TECHNOLOGY ARSENAL:
              </div>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, i) => (
                  <span 
                    key={i} 
                    className="px-2.5 py-1 bg-surface-container-high border border-border-primary text-text-muted text-[11px] font-mono hover:border-primary-fixed hover:text-primary transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </SectionReveal>

          {/* NAVIGATION TABS */}
          <SectionReveal delay={0.2}>
            <div className="flex flex-wrap gap-[1px] bg-border-primary border border-border-primary mb-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-[12px] font-mono font-bold uppercase tracking-wider transition-colors shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-primary-fixed text-surface'
                      : 'bg-surface text-text-muted hover:bg-surface-hover hover:text-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </SectionReveal>

          {/* TAB CONTENT PANELS */}
          <div className="min-h-[450px]">
            {/* TAB 1: OVERVIEW & PROBLEM */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-8 animate-fadeIn">
                {/* Executive Summary */}
                <div className="p-6 md:p-8 bg-surface border border-border-primary">
                  <h3 className="text-[14px] font-bold uppercase tracking-wider text-primary-fixed mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">subject</span>
                    EXECUTIVE SUMMARY
                  </h3>
                  <div className="text-[14px] leading-relaxed text-text-muted space-y-4 font-mono">
                    {project.overview.map((para, idx) => (
                      <p key={idx}>{para}</p>
                    ))}
                  </div>
                </div>

                {/* Problem vs Solution Split */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* The Problem */}
                  <div className="p-6 bg-surface border border-red-500/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-2 h-full bg-red-500/60"></div>
                    <div className="text-[12px] font-bold text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">warning</span>
                      THE CORE PROBLEM
                    </div>
                    <p className="text-[13px] leading-relaxed text-text-muted font-mono">
                      {project.problemStatement.problem}
                    </p>
                  </div>

                  {/* The Solution */}
                  <div className="p-6 bg-surface border border-primary-fixed/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-2 h-full bg-primary-fixed"></div>
                    <div className="text-[12px] font-bold text-primary-fixed uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      THE ENGINEERED SOLUTION
                    </div>
                    <p className="text-[13px] leading-relaxed text-text-muted font-mono">
                      {project.problemStatement.solution}
                    </p>
                  </div>
                </div>

                {/* Key Takeaway Banner */}
                <div className="p-5 bg-surface-container-high border-l-4 border-primary-fixed border-t border-r border-b border-border-primary">
                  <span className="text-[11px] font-bold text-primary-fixed uppercase tracking-wider block mb-1">
                    KEY TAKEAWAY:
                  </span>
                  <span className="text-[13px] text-primary font-mono italic">
                    &quot;{project.problemStatement.keyTakeaway}&quot;
                  </span>
                </div>
              </div>
            )}

            {/* TAB 2: ARCHITECTURE */}
            {activeTab === 'architecture' && (
              <div className="flex flex-col gap-8 animate-fadeIn">
                {/* Architecture Overview */}
                <div className="p-6 md:p-8 bg-surface border border-border-primary">
                  <h3 className="text-[14px] font-bold uppercase tracking-wider text-primary-fixed mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">account_tree</span>
                    TOPOLOGY & SYSTEM ARCHITECTURE
                  </h3>
                  <p className="text-[13px] text-text-muted leading-relaxed font-mono mb-6">
                    {project.architecture.description}
                  </p>

                  {/* High-Resolution Diagram if available */}
                  {project.architecture.image && (
                    <div className="mb-8 border border-border-primary bg-black p-2 relative group">
                      <div 
                        onClick={() => setLightboxImage(project.architecture.image)}
                        className="relative w-full aspect-video md:aspect-[16/9] cursor-pointer overflow-hidden"
                      >
                        <Image
                          src={project.architecture.image}
                          alt="System Architecture Diagram"
                          fill
                          className="object-contain"
                          sizes="(max-width: 1200px) 100vw, 1200px"
                        />
                        <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 border border-border-primary text-[10px] text-primary-fixed font-mono flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">zoom_in</span>
                          CLICK TO ENLARGE DIAGRAM
                        </div>
                      </div>
                      <div className="p-2 text-[11px] text-text-dim text-center font-mono">
                        [FIGURE 1.0: HIGH-LEVEL ARCHITECTURE PIPELINE & DATA FLOW]
                      </div>
                    </div>
                  )}

                  {/* ASCII Diagram Container */}
                  <div className="bg-[#050505] border border-border-primary p-4 md:p-6 overflow-x-auto my-4 rounded-sm">
                    <pre className="font-mono text-[11px] md:text-[12px] text-primary-fixed leading-tight whitespace-pre">
                      {project.architecture.asciiDiagram}
                    </pre>
                  </div>
                </div>

                {/* Subsystem Layers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.architecture.layers.map((layer, i) => (
                    <div key={i} className="p-5 bg-surface border border-border-primary hover:border-primary-fixed transition-colors">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[13px] font-bold text-primary font-mono uppercase">
                          {layer.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-surface-container-high border border-border-primary text-primary-fixed font-mono">
                          LAYER 0{i + 1}
                        </span>
                      </div>
                      <p className="text-[12px] text-text-muted leading-relaxed font-mono mb-3">
                        {layer.description}
                      </p>
                      <div className="text-[10px] text-text-dim font-mono uppercase">
                        STACK: <span className="text-text-muted">{layer.tech}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: KEY CAPABILITIES */}
            {activeTab === 'capabilities' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fadeIn">
                {project.keyCapabilities.map((cap, i) => (
                  <div 
                    key={i} 
                    className="p-6 bg-surface border border-border-primary hover:border-primary-fixed transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="text-[11px] font-mono text-primary-fixed mb-2 font-bold flex items-center justify-between">
                        <span>CAPABILITY 0{i + 1}</span>
                        <span className="material-symbols-outlined text-[16px] text-text-dim group-hover:text-primary-fixed transition-colors">
                          insights
                        </span>
                      </div>
                      <h4 className="text-[15px] font-bold text-primary mb-3 font-[family-name:var(--font-display)] uppercase group-hover:text-primary-fixed transition-colors">
                        {cap.title}
                      </h4>
                      <p className="text-[13px] text-text-muted leading-relaxed font-mono">
                        {cap.description}
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-border-muted text-[10px] font-mono text-text-dim flex items-center justify-between">
                      <span>VERIFIED FEATURE</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed"></span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: TECHNICAL DEEP DIVE & SAFETY */}
            {activeTab === 'technical' && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                {project.technicalDeepDive.map((dive, i) => (
                  <div key={i} className="p-6 md:p-8 bg-surface border border-border-primary">
                    <div className="text-[11px] font-mono text-primary-fixed font-bold uppercase tracking-wider mb-2">
                      // ENGINEERING RATIONALE 0{i + 1}
                    </div>
                    <h3 className="text-[18px] font-bold text-primary font-[family-name:var(--font-display)] uppercase mb-4">
                      {dive.title}
                    </h3>
                    <p className="text-[13px] text-text-muted leading-relaxed font-mono">
                      {dive.content}
                    </p>
                  </div>
                ))}

                {/* Safety Callout Box */}
                <div className="p-6 bg-surface-container-low border border-primary-fixed/40">
                  <div className="flex items-center gap-2 text-primary-fixed font-bold text-[13px] uppercase mb-2">
                    <span className="material-symbols-outlined text-[18px]">security</span>
                    STRICT SYSTEM INVARIANTS & SAFETY GUARANTEES
                  </div>
                  <p className="text-[12px] text-text-muted font-mono leading-relaxed">
                    All operations are strictly sandboxed. There is zero arbitrary remote execution, zero unverified state transitions, and every mutated configuration maintains point-in-time rollback capability.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 5: GALLERY */}
            {activeTab === 'gallery' && project.screenshots && project.screenshots.length > 0 && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                {/* Main Viewport */}
                <div className="bg-surface border border-border-primary p-4 md:p-6">
                  <div 
                    onClick={() => setLightboxImage(project.screenshots[activeScreenshot].src)}
                    className="relative w-full aspect-video md:aspect-[16/9] border border-border-primary bg-black overflow-hidden mb-4 cursor-pointer group"
                    title="Click to view full size"
                  >
                    <Image
                      src={project.screenshots[activeScreenshot].src}
                      alt={project.screenshots[activeScreenshot].alt}
                      fill
                      className="object-contain"
                      sizes="(max-width: 1200px) 100vw, 1200px"
                    />
                    <div className="absolute bottom-3 right-3 bg-black/80 px-2.5 py-1 border border-border-primary text-[10px] text-primary-fixed font-mono flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-[14px]">fullscreen</span>
                      EXPAND FULLSCREEN
                    </div>
                  </div>
                  <div className="p-3 bg-surface-container-high border border-border-primary flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <span className="text-[12px] text-text-muted font-mono">
                      {project.screenshots[activeScreenshot].caption}
                    </span>
                    <span className="text-[10px] text-primary-fixed font-mono shrink-0 uppercase">
                      [{activeScreenshot + 1} / {project.screenshots.length}]
                    </span>
                  </div>
                </div>

                {/* Thumbnails Strip */}
                {project.screenshots.length > 1 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {project.screenshots.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveScreenshot(idx)}
                        className={`relative aspect-video border transition-all overflow-hidden bg-black ${
                          activeScreenshot === idx 
                            ? 'border-primary-fixed ring-1 ring-primary-fixed' 
                            : 'border-border-primary opacity-60 hover:opacity-100'
                        }`}
                      >
                        <Image
                          src={s.src}
                          alt={s.alt}
                          fill
                          className="object-cover"
                          sizes="200px"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 6: CLI & GETTING STARTED */}
            {activeTab === 'cli' && (
              <div className="flex flex-col gap-8 animate-fadeIn">
                {/* CLI Reference */}
                {project.cliOrApiReference && (
                  <div className="p-6 md:p-8 bg-surface border border-border-primary">
                    <h3 className="text-[14px] font-bold uppercase tracking-wider text-primary-fixed mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">terminal</span>
                      {project.cliOrApiReference.title}
                    </h3>
                    <div className="space-y-4">
                      {project.cliOrApiReference.items.map((item, idx) => (
                        <div key={idx} className="p-4 bg-[#0a0a0a] border border-border-primary flex flex-col gap-2">
                          <div className="flex items-center justify-between gap-2">
                            <code className="text-[12px] md:text-[13px] text-primary-fixed font-mono break-all">
                              $ {item.command}
                            </code>
                            <button
                              onClick={() => copyToClipboard(item.command, idx)}
                              className="px-2 py-1 bg-surface-container border border-border-primary text-[10px] text-text-muted hover:text-primary transition-colors shrink-0 uppercase"
                              title="Copy Command"
                            >
                              {copiedIndex === idx ? 'COPIED!' : 'COPY'}
                            </button>
                          </div>
                          <span className="text-[11px] text-text-dim font-mono">
                            # {item.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Getting Started Guide */}
                <div className="p-6 md:p-8 bg-surface border border-border-primary">
                  <h3 className="text-[14px] font-bold uppercase tracking-wider text-primary-fixed mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                    QUICKSTART & LOCAL SETUP
                  </h3>

                  {/* Prerequisites */}
                  <div className="mb-6 p-4 bg-surface-container-high border border-border-primary">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block mb-2">
                      PREREQUISITES:
                    </span>
                    <ul className="list-disc list-inside text-[12px] text-text-muted space-y-1 font-mono">
                      {project.gettingStarted.prerequisites.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Steps */}
                  <div className="space-y-6">
                    {project.gettingStarted.steps.map((step, idx) => (
                      <div key={idx} className="flex flex-col gap-2">
                        <span className="text-[12px] font-bold text-primary font-mono uppercase">
                          {step.title}
                        </span>
                        <div className="p-4 bg-[#0a0a0a] border border-border-primary flex items-start justify-between gap-3">
                          <pre className="text-[12px] text-text-muted font-mono leading-relaxed overflow-x-auto whitespace-pre">
                            {step.code}
                          </pre>
                          <button
                            onClick={() => copyToClipboard(step.code, `step-${idx}`)}
                            className="px-2 py-1 bg-surface-container border border-border-primary text-[10px] text-text-muted hover:text-primary transition-colors shrink-0 uppercase"
                            title="Copy snippet"
                          >
                            {copiedIndex === `step-${idx}` ? 'COPIED!' : 'COPY'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ADJACENT PROJECT FOOTER NAVIGATION */}
          <SectionReveal delay={0.25}>
            <div className="mt-16 pt-8 border-t border-border-primary grid grid-cols-1 md:grid-cols-2 gap-4">
              {adjacent.prev && (
                <Link
                  href={`/projects/${adjacent.prev.slug}`}
                  className="p-5 bg-surface border border-border-primary hover:border-primary-fixed transition-all group flex flex-col justify-between"
                >
                  <span className="text-[10px] font-mono text-text-dim uppercase tracking-wider group-hover:text-primary-fixed transition-colors">
                    ← PREVIOUS PROJECT [{adjacent.prev.id}]
                  </span>
                  <span className="text-[15px] font-bold text-primary font-[family-name:var(--font-display)] uppercase mt-2 group-hover:text-primary-fixed transition-colors">
                    {adjacent.prev.title}
                  </span>
                  <span className="text-[11px] text-text-muted font-mono truncate mt-1">
                    {adjacent.prev.subtitle}
                  </span>
                </Link>
              )}

              {adjacent.next && (
                <Link
                  href={`/projects/${adjacent.next.slug}`}
                  className="p-5 bg-surface border border-border-primary hover:border-primary-fixed transition-all group flex flex-col justify-between md:text-right"
                >
                  <span className="text-[10px] font-mono text-text-dim uppercase tracking-wider group-hover:text-primary-fixed transition-colors">
                    NEXT PROJECT [{adjacent.next.id}] →
                  </span>
                  <span className="text-[15px] font-bold text-primary font-[family-name:var(--font-display)] uppercase mt-2 group-hover:text-primary-fixed transition-colors">
                    {adjacent.next.title}
                  </span>
                  <span className="text-[11px] text-text-muted font-mono truncate mt-1">
                    {adjacent.next.subtitle}
                  </span>
                </Link>
              )}
            </div>
          </SectionReveal>

          {/* COPYRIGHT FOOTER */}
          <footer className="mt-12 pt-6 border-t border-border-primary flex flex-col sm:flex-row justify-between items-center gap-4 text-text-dim text-[11px] font-mono">
            <div>© {new Date().getFullYear()} MOHAMED HAZEM HASSINE. ALL RIGHTS RESERVED.</div>
            <Link 
              href="/projects" 
              className="text-primary-fixed hover:text-primary transition-colors"
            >
              [ RETURN TO TECHNICAL ARCHIVE ]
            </Link>
          </footer>

        </main>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-fadeIn"
          onClick={() => setLightboxImage(null)}
        >
          <div 
            className="relative max-w-6xl w-full max-h-[90vh] aspect-video border border-border-primary bg-black p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-10 right-0 text-white font-mono text-[12px] hover:text-primary-fixed transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
              [ CLOSE ESC ]
            </button>
            <div className="relative w-full h-full">
              <Image
                src={lightboxImage}
                alt="Fullscreen Preview"
                fill
                className="object-contain"
                sizes="(max-width: 1400px) 100vw, 1400px"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
