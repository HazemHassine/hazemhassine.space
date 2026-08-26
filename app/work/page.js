'use client';

import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import MobileMenu from '@/components/MobileMenu';
import SectionReveal from '@/components/SectionReveal';
import { projects, siteConfig } from '@/lib/data';

export default function WorkPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-surface-dim grid-background relative font-[family-name:var(--font-mono)]">
      <div className="noise-overlay"></div>
      
      <Sidebar />
      
      <div className="flex-1 flex flex-col relative w-full md:ml-[150px]">
        <TopBar />
        <MobileMenu />
        
        <main className="flex-1 p-[28px] md:p-12 lg:p-20 pt-32 md:pt-12 flex flex-col max-w-[1200px] w-full mx-auto min-h-screen">
          {/* HEADER */}
          <SectionReveal delay={0.1}>
            <div className="mb-12">
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
              <SectionReveal key={project.id} delay={0.2 + (index * 0.1)}>
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-row group border-b border-border-primary py-8 flex flex-col md:flex-row gap-8 transition-colors duration-300 relative overflow-hidden bg-surface hover:bg-surface-hover block w-full"
                >
                  {/* Number column */}
                  <div className="md:w-1/12 text-terminal-button text-text-muted group-hover:text-primary-container pl-4 pt-2">
                    {project.id}
                  </div>
                  
                  {/* Info column */}
                  <div className="md:w-5/12 flex flex-col">
                    <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold uppercase text-primary group-hover:text-primary-container leading-tight mb-2 transition-colors duration-300">
                      {project.title}
                    </h2>
                    <div className="text-meta-label text-text-muted uppercase mb-4">
                      {project.subtitle}
                    </div>
                    <p className="text-body-md text-text-dim max-w-md">
                      {project.description}
                    </p>
                  </div>
                  
                  {/* Tech column */}
                  <div className="md:w-3/12 pt-2">
                    <ul className="flex flex-col gap-3">
                      {project.tech.map((tech, techIndex) => (
                        <li key={techIndex} className="flex items-center">
                          <span className="w-1 h-1 bg-border-primary rounded-full mr-2 group-hover:bg-primary-container transition-colors duration-300"></span>
                          <span className="text-meta-label text-text-muted">
                            {tech}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* CTA column */}
                  <div className="md:w-3/12 hidden md:flex justify-end pr-4 pt-2">
                    <span className="text-terminal-button text-text-muted group-hover:text-primary-container transition-colors duration-300">
                      [ VIEW DETAILS ]
                    </span>
                  </div>

                  {/* Hover Image */}
                  <div className="absolute right-32 top-1/2 -translate-y-1/2 w-64 h-40 project-preview pointer-events-none hidden md:block border border-border-primary z-10 shadow-2xl">
                    <div className="bg-surface-container-high w-full h-full"></div>
                  </div>
                </a>
              </SectionReveal>
            ))}
          </div>

          {/* FOOTER */}
          <SectionReveal delay={0.2 + (projects.length * 0.1) + 0.1}>
            <footer className="mt-auto border-t border-border-primary p-[28px] flex justify-between items-center text-text-dim text-meta-label mt-20">
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
