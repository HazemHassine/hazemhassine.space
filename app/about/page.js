'use client';

import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import MobileMenu from '@/components/MobileMenu';
import SectionReveal from '@/components/SectionReveal';
import { siteConfig, skills, techStack, experience } from '@/lib/data';

export default function AboutPage() {
  return (
    <>
      <Sidebar />
      <main className="md:ml-[150px] min-h-screen flex flex-col pt-16 md:pt-0">
        <TopBar />
        <MobileMenu />
        <SectionReveal>
          <section className="grid grid-cols-1 md:grid-cols-12 border-b border-border-primary min-h-[500px]">
            {/* Col 1 — About Me */}
            <div className="md:col-span-4 p-[28px] border-b md:border-b-0 md:border-r border-border-primary flex flex-col">
              <div className="text-[11px] leading-[1.2] tracking-[0.04em] font-medium text-primary-fixed uppercase mb-8">
                {`//`} ABOUT ME
              </div>
              
              <h1 className="font-[family-name:var(--font-display)] text-[32px] leading-[1.1] tracking-[-0.02em] font-bold uppercase mb-8">
                I&apos;M HAZEM, A SOFTWARE ENGINEER BASED IN BIELEFELD, GERMANY.
              </h1>
              
              <div className="flex flex-col gap-4 text-[14px] leading-[1.6] font-normal text-text-muted flex-1">
                {siteConfig.bio.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              <button className="mt-8 self-start flex items-center gap-2 text-primary-fixed hover:text-primary-fixed-dim transition-colors">
                <span className="text-[12px] leading-[1] tracking-[0.02em] font-semibold uppercase">[ DOWNLOAD CV ]</span>
                <span className="material-symbols-outlined text-[16px]">download</span>
              </button>
            </div>

            {/* Col 2 — Skills */}
            <div className="md:col-span-4 p-[28px] border-b md:border-b-0 md:border-r border-border-primary bg-surface flex flex-col">
              <div className="text-[11px] leading-[1.2] tracking-[0.04em] font-medium text-primary-fixed uppercase mb-8">
                {`//`} SKILLS
              </div>

              <div className="flex flex-col gap-6 flex-1">
                {skills.map((skill, index) => (
                  <div key={index} className="grid grid-cols-2 items-center gap-4">
                    <span className="text-[11px] leading-[1.2] tracking-[0.04em] font-medium text-on-surface uppercase">
                      {skill.name}
                    </span>
                    <div className="flex gap-1 h-2 w-full max-w-[120px] ml-auto">
                      {[1, 2, 3, 4, 5].map((segment) => (
                        <div
                          key={segment}
                          className={`flex-1 ${
                            segment <= skill.level ? 'bg-primary-fixed' : 'bg-surface-variant'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-8 self-start text-[12px] leading-[1] tracking-[0.02em] font-semibold uppercase text-primary-fixed hover:text-primary-fixed-dim transition-colors">
                [ VIEW ALL SKILLS ]
              </button>
            </div>

            {/* Col 3 — Tech Stack */}
            <div className="md:col-span-4 p-[28px] flex flex-col">
              <div className="text-[11px] leading-[1.2] tracking-[0.04em] font-medium text-primary-fixed uppercase mb-8">
                {`//`} TECH STACK
              </div>

              <div className="grid grid-cols-3 gap-px bg-border-primary border border-border-primary flex-1 content-start aspect-square w-full">
                {techStack.map((tech, index) => (
                  <div
                    key={index}
                    className="bg-background flex flex-col items-center justify-center p-4 hover:bg-surface transition-colors cursor-default aspect-square"
                  >
                    <span className="material-symbols-outlined text-3xl text-on-surface mb-2">
                      {tech.icon}
                    </span>
                    <span className="text-[10px] text-text-muted leading-[1.2] tracking-[0.04em] font-medium uppercase text-center">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </SectionReveal>

        {/* BOTTOM SECTION — Experience Timeline */}
        <SectionReveal>
          <section className="p-[28px] flex-1 flex flex-col">
            <div className="text-[11px] leading-[1.2] tracking-[0.04em] font-medium text-primary-fixed uppercase mb-12">
              {`//`} EXPERIENCE TIMELINE
            </div>

            <div className="relative max-w-4xl">
              <div className="absolute left-[5px] top-2 bottom-2 w-px bg-primary-fixed/20" />
              
              <div className="flex flex-col gap-12">
                {experience.map((item, index) => (
                  <div key={index} className="relative pl-8 md:pl-32 flex flex-col md:flex-row group">
                    <div className="absolute left-0 top-1.5 w-3 h-3 bg-primary-fixed border border-background" />
                    
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

            <button className="mt-16 self-start text-[12px] leading-[1] tracking-[0.02em] font-semibold uppercase text-primary-fixed hover:text-primary-fixed-dim transition-colors">
              [ VIEW FULL TIMELINE ]
            </button>
          </section>
        </SectionReveal>
      </main>
    </>
  );
}
