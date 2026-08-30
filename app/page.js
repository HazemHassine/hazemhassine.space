import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import MobileMenu from '@/components/MobileMenu';
import SectionReveal from '@/components/SectionReveal';
import Marquee from '@/components/Marquee';
import { getAllPosts } from '@/lib/markdown';
import { getPublishedCmsData } from '@/lib/cms-server';

export const dynamic = 'force-dynamic';

export default async function Home({ cmsData } = {}) {
  const cms = cmsData || await getPublishedCmsData();
  const { siteConfig, experience, projects } = cms;
  const pageContent = cms.pageContent?.home || {};
  const blogPosts = await getAllPosts();

  return (
    <>
      <Sidebar />
      <main className="md:ml-[180px] min-h-screen flex flex-col">
        <TopBar />
        <MobileMenu />

        <HeroSection siteConfig={siteConfig} projects={projects} />

        {/* MARQUEE SECTION */}
        <Marquee items={pageContent.marquee} />

        {/* LOWER GRID SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_1.35fr_1fr] flex-grow bg-border-primary gap-[1px]">
          {/* Experience Column */}
          <div data-highlight-id="home-experience" className="bg-surface h-full flex flex-col">
            <SectionReveal>
              <div className="p-5 md:p-[28px] lg:p-8 flex flex-col h-full">
                <div className="font-[family-name:var(--font-mono)] text-[11px] font-medium tracking-[0.04em] leading-[1.2] text-text-muted uppercase mb-8">
                  {pageContent.experienceLabel || '/ EXPERIENCE'}
                </div>
                <div className="flex-grow flex flex-col">
                  {experience.map((exp, i) => {
                    const expId = `experience-${exp.company.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
                    return (
                      <div
                        key={i}
                        data-highlight-id={expId}
                        className="grid grid-cols-[80px_1fr] py-4 border-b border-border-muted group hover:bg-surface-hover transition-colors rounded-sm"
                      >
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
                    );
                  })}
                </div>
                <div className="pt-8 mt-auto">
                  <Link 
                    href="/about" 
                    className="font-[family-name:var(--font-mono)] text-[12px] font-semibold tracking-[0.02em] text-primary-fixed hover:text-primary transition-colors"
                  >
                    {pageContent.timelineCta || '[ FULL TIMELINE ]'}
                  </Link>
                </div>
              </div>
            </SectionReveal>
          </div>

          {/* Projects Grid */}
          <div data-highlight-id="home-projects" className="bg-border-primary h-full flex flex-col gap-[1px]">
            <div className="bg-surface p-5 pb-4 md:p-[28px] lg:p-8 md:pb-4">
              <div className="font-[family-name:var(--font-mono)] text-[11px] font-medium tracking-[0.04em] leading-[1.2] text-text-muted uppercase">
                {pageContent.projectsLabel || '/ PROJECTS'}
              </div>
            </div>
            <SectionReveal delay={0.1}>
              <div className="grid grid-cols-2 gap-[1px] flex-grow bg-border-primary">
                {projects.slice(0, 4).map((project, i) => {
                  const projectSlug = project.slug || project.href?.replace('/projects/', '') || `project-${i}`;
                  return (
                    <div
                      key={i}
                      data-highlight-id={`project-${projectSlug}`}
                      className="bg-surface relative group overflow-hidden flex items-end p-4 min-h-[120px]"
                    >
                      <div className="absolute inset-0 bg-surface-container-high grayscale opacity-50 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute inset-0 border border-transparent group-hover:border-primary-fixed transition-colors pointer-events-none z-10"></div>
                      <Link href={project.href} className="relative z-20 w-full h-full flex items-end">
                        <span className="font-[family-name:var(--font-mono)] text-[12px] font-semibold tracking-[0.02em] text-primary group-hover:text-primary-fixed transition-colors">
                          {project.title}
                        </span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </SectionReveal>
            <div className="bg-surface p-4 text-center mt-auto">
              <Link 
                href="/projects" 
                className="font-[family-name:var(--font-mono)] text-[12px] font-semibold tracking-[0.02em] text-primary-fixed hover:text-primary transition-colors"
              >
                {pageContent.projectsCta || '[ VIEW ALL PROJECTS ]'}
              </Link>
            </div>
          </div>

          {/* Blog Column */}
          <div data-highlight-id="home-blog" className="bg-surface h-full flex flex-col">
            <SectionReveal delay={0.2}>
              <div className="p-5 md:p-[28px] lg:p-8 flex flex-col h-full">
                <div className="font-[family-name:var(--font-mono)] text-[11px] font-medium tracking-[0.04em] leading-[1.2] text-text-muted uppercase mb-8">
                  {pageContent.blogLabel || '/ BLOG'}
                </div>
                <div className="flex-grow flex flex-col gap-6">
                  {blogPosts.slice(0, 3).map((post, i) => (
                    <Link
                      key={post.slug || i}
                      href={`/blog/${post.slug}`}
                      data-highlight-id={`blog-${post.slug}`}
                      className="group block"
                    >
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
                    {pageContent.blogCta || '[ READ ALL ARTICLES ]'}
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
