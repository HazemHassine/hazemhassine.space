'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import MobileMenu from '@/components/MobileMenu';
import SectionReveal from '@/components/SectionReveal';
import { projects, siteConfig, getProjectThumbnail } from '@/lib/data';

function ProjectRowItem({ project, index }) {
  const [imageError, setImageError] = useState(false);
  const thumbnailUrl = getProjectThumbnail(project);

  return (
    <SectionReveal delay={0.15 + index * 0.08}>
      <Link
        href={project.href}
        className="project-row group border-b border-border-primary py-5 md:py-6 px-2 md:px-4 flex flex-col md:flex-row md:items-center gap-5 lg:gap-8 transition-colors duration-300 relative bg-surface hover:bg-surface-hover block w-full cursor-pointer"
      >
        {/* Number column */}
        <div className="md:w-10 text-terminal-button text-text-muted group-hover:text-primary-container shrink-0">
          {project.id}
        </div>

        {/* Info column */}
        <div className="flex-1 min-w-[200px] flex flex-col">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-bold uppercase text-primary group-hover:text-primary-container leading-tight mb-1 transition-colors duration-300">
            {project.title}
          </h2>
          <div className="text-[11px] font-mono text-text-muted uppercase mb-2 tracking-wide">
            {project.subtitle}
          </div>
          <p className="text-[13px] leading-relaxed text-text-dim max-w-md font-mono">
            {project.description}
          </p>
        </div>

        {/* Tech column */}
        <div className="md:w-40 shrink-0">
          <ul className="flex flex-col gap-1.5">
            {project.tech.map((tech, techIndex) => (
              <li key={techIndex} className="flex items-center">
                <span className="w-1 h-1 bg-border-primary rounded-full mr-2 group-hover:bg-primary-container transition-colors duration-300"></span>
                <span className="text-[11px] font-mono text-text-muted">
                  {tech}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Dedicated Thumbnail Column (Vertically Centered between Tech & Details) */}
        <div className="md:w-48 lg:w-52 shrink-0 flex items-center justify-center">
          <div className="w-full h-24 md:h-28 relative border border-border-primary bg-surface-container-high overflow-hidden group-hover:border-primary-fixed transition-colors duration-300">
            {thumbnailUrl && !imageError ? (
              <Image
                src={thumbnailUrl}
                alt={`${project.title} Preview`}
                fill
                priority={index < 2}
                sizes="(max-width: 768px) 100vw, 220px"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-2.5 text-center bg-surface-container-low relative">
                <div className="grid-background absolute inset-0 opacity-20 pointer-events-none"></div>
                <span className="material-symbols-outlined text-text-dim text-[20px] mb-0.5">terminal</span>
                <span className="font-[family-name:var(--font-mono)] text-[10px] font-bold text-text-muted tracking-wider uppercase truncate max-w-full">
                  {project.title}
                </span>
                <span className="font-[family-name:var(--font-mono)] text-[8px] text-text-dim mt-0.5 tracking-wider uppercase">
                  NO THUMBNAIL IN REPO
                </span>
              </div>
            )}
          </div>
        </div>

        {/* CTA column */}
        <div className="md:w-32 shrink-0 flex md:justify-end items-center">
          <span className="text-terminal-button text-text-muted group-hover:text-primary-container transition-colors duration-300 whitespace-nowrap">
            [ VIEW DETAILS ]
          </span>
        </div>
      </Link>
    </SectionReveal>
  );
}

export default function ProjectsPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-surface-dim grid-background relative font-[family-name:var(--font-mono)]">
      <div className="noise-overlay"></div>

      <Sidebar />

      <div className="flex-1 flex flex-col relative w-full md:ml-[180px]">
        <TopBar />
        <MobileMenu />

        <main className="flex-1 p-[28px] md:p-12 lg:p-20 pt-32 md:pt-12 flex flex-col max-w-[1200px] w-full mx-auto min-h-screen">
          {/* HEADER */}
          <SectionReveal delay={0.1}>
            <div className="mb-10">
              <h1 className="font-[family-name:var(--font-display)] text-[32px] font-bold uppercase text-primary mb-4 leading-tight tracking-tight">
                / TECHNICAL ARCHIVE
              </h1>
              <p className="text-body-md text-text-muted max-w-2xl">
                A curated selection of engineering projects, tools, and experiments focusing on full-stack development, system architecture, and AI integrations.
              </p>
            </div>
          </SectionReveal>

          {/* PROJECT LIST */}
          <div className="flex flex-col border-t border-border-primary flex-1">
            {projects.map((project, index) => (
              <ProjectRowItem key={project.id} project={project} index={index} />
            ))}
          </div>

          {/* FOOTER */}
          <SectionReveal delay={0.2 + projects.length * 0.08 + 0.1}>
            <footer className="mt-auto border-t border-border-primary p-[28px] flex justify-between items-center text-text-dim text-meta-label mt-16">
              <div>{siteConfig.copyright}</div>
              <div className="flex gap-6">
                <span className="cursor-not-allowed hover:text-text-muted transition-colors">PRIVACY POLICY</span>
                <span className="cursor-not-allowed hover:text-text-muted transition-colors">TERMS</span>
              </div>
            </footer>
          </SectionReveal>
        </main>
      </div>
    </div>
  );
}
