import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import MobileMenu from '@/components/MobileMenu';
import SectionReveal from '@/components/SectionReveal';
import Marquee from '@/components/Marquee';
import { siteConfig, experience, projects } from '@/lib/data';
import { getAllPosts } from '@/lib/markdown';

export default function Home() {
  const blogPosts = getAllPosts();

  return (
    <>
      <Sidebar />
      <main className="md:ml-[150px] min-h-screen flex flex-col">
        <TopBar />
        <MobileMenu />

        <HeroSection siteConfig={siteConfig} projects={projects} />

        {/* MARQUEE SECTION */}
        <Marquee items={["OPEN TO WORK", "AVAILABLE FOR FREELANCE", "CREATIVE DEVELOPER"]} />

        {/* LOWER GRID SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_1.35fr_1fr] flex-grow bg-border-primary gap-[1px]">
          {/* Experience Column */}
          <div className="bg-surface h-full flex flex-col">
            <SectionReveal>
              <div className="p-[28px] lg:p-8 flex flex-col h-full">
                <div className="font-[family-name:var(--font-mono)] text-[11px] font-medium tracking-[0.04em] leading-[1.2] text-text-muted uppercase mb-8">
                  / EXPERIENCE
                </div>
                <div className="flex-grow flex flex-col">
                  {experience.map((exp, i) => (
                    <div key={i} className="grid grid-cols-[80px_1fr] py-4 border-b border-border-muted group hover:bg-surface-hover transition-colors">
                      <span className={`font-[family-name:var(--font-mono)] text-[11px] font-medium tracking-[0.04em] leading-[1.2] ${i === 0 ? 'text-primary-fixed' : 'text-text-muted group-hover:text-primary-fixed transition-colors'}`}>
                        {exp.year}
                      </span>
                      <div>
                        <div className="font-[family-name:var(--font-mono)] text-[12px] font-semibold tracking-[0.02em] text-primary leading-[1] mb-2">
                          {exp.company}
                        </div>
                        <div className="font-[family-name:var(--font-mono)] text-[11px] font-medium tracking-[0.04em] leading-[1.2] text-text-muted mb-2">
                          {exp.role}
                        </div>
                        <div className="font-[family-name:var(--font-mono)] text-[10px] font-medium tracking-[0.04em] leading-[1.2] text-text-dim">
                          {exp.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-8 mt-auto">
                  <Link 
                    href="/about" 
                    className="font-[family-name:var(--font-mono)] text-[12px] font-semibold tracking-[0.02em] text-primary-fixed hover:text-primary transition-colors"
                  >
                    [ FULL TIMELINE ]
                  </Link>
                </div>
              </div>
            </SectionReveal>
          </div>

          {/* Projects Grid */}
          <div className="bg-border-primary h-full flex flex-col gap-[1px]">
            <div className="bg-surface p-[28px] lg:p-8 pb-4">
              <div className="font-[family-name:var(--font-mono)] text-[11px] font-medium tracking-[0.04em] leading-[1.2] text-text-muted uppercase">
                / PROJECTS
              </div>
            </div>
            <SectionReveal delay={0.1}>
              <div className="grid grid-cols-2 gap-[1px] flex-grow bg-border-primary">
                {projects.slice(0, 4).map((project, i) => (
                  <div key={i} className="bg-surface relative group overflow-hidden flex items-end p-4 min-h-[120px]">
                    <div className="absolute inset-0 bg-surface-container-high grayscale opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute inset-0 border border-transparent group-hover:border-primary-fixed transition-colors pointer-events-none z-10"></div>
                    <Link href={project.href} className="relative z-20 w-full h-full flex items-end">
                      <span className="font-[family-name:var(--font-mono)] text-[12px] font-semibold tracking-[0.02em] text-primary group-hover:text-primary-fixed transition-colors">
                        {project.title}
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            </SectionReveal>
            <div className="bg-surface p-4 text-center mt-auto">
              <Link 
                href="/work" 
                className="font-[family-name:var(--font-mono)] text-[12px] font-semibold tracking-[0.02em] text-primary-fixed hover:text-primary transition-colors"
              >
                [ VIEW ALL PROJECTS ]
              </Link>
            </div>
          </div>

          {/* Blog Column */}
          <div className="bg-surface h-full flex flex-col">
            <SectionReveal delay={0.2}>
              <div className="p-[28px] lg:p-8 flex flex-col h-full">
                <div className="font-[family-name:var(--font-mono)] text-[11px] font-medium tracking-[0.04em] leading-[1.2] text-text-muted uppercase mb-8">
                  / BLOG
                </div>
                <div className="flex-grow flex flex-col gap-6">
                  {blogPosts.slice(0, 3).map((post, i) => (
                    <Link key={post.slug || i} href={`/blog/${post.slug}`} className="group block">
                      <div className="font-[family-name:var(--font-mono)] text-[10px] text-primary-fixed mb-2">{post.date}</div>
                      <div className="font-[family-name:var(--font-mono)] text-[14px] text-primary group-hover:text-primary-fixed transition-colors leading-[1.4]">{post.title}</div>
                    </Link>
                  ))}
                </div>
                <div className="pt-8 mt-auto">
                  <Link 
                    href="/blog" 
                    className="font-[family-name:var(--font-mono)] text-[12px] font-semibold tracking-[0.02em] text-primary-fixed hover:text-primary transition-colors"
                  >
                    [ READ ALL ARTICLES ]
                  </Link>
                </div>
              </div>
            </SectionReveal>
          </div>
        </section>
      </main>
    </>
  );
}
