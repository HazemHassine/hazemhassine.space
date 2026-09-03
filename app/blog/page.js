import Sidebar from '@/components/Sidebar';
import MobileMenu from '@/components/MobileMenu';
import SectionReveal from '@/components/SectionReveal';
import { getAllPosts } from '@/lib/markdown';
import Link from 'next/link';
import { getPublishedCmsData } from '@/lib/cms-server';
import { createPageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const cms = await getPublishedCmsData();
  const seo = cms.pageContent?.seo?.pages?.blog || {};
  return createPageMetadata({ ...seo, pathname: '/blog', siteName: cms.siteConfig?.name });
}

export default async function BlogPage({ cmsData } = {}) {
  const posts = await getAllPosts();
  const cms = cmsData || await getPublishedCmsData();
  const copy = cms.pageContent?.blog || {};

  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full bg-background">
      <Sidebar />
      <MobileMenu />

      <main className="flex-1 flex flex-col md:ml-[180px] min-h-screen border-l border-border-primary relative z-10 pt-16 md:pt-0">
        <div className="flex-1 px-6 py-12 md:px-12 md:py-20 flex justify-center">
          <div className="flex-1 flex flex-col w-full max-w-5xl">
            {/* HEADER */}
            <div className="mb-12 border-b border-border-primary pb-4">
              <h1 className="font-[family-name:var(--font-display)] text-[32px] font-bold uppercase text-primary tracking-tight">
                {copy.title || 'BLOG / NOTES'}
              </h1>
            </div>

            {/* BLOG ENTRIES LIST */}
            <div className="flex-1 flex flex-col w-full max-w-5xl">
              {posts.map((post, index) => (
                <SectionReveal key={post.slug} delay={index * 0.1}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="blog-row group block relative border-b border-border-primary py-6 hover:bg-surface-hover transition-colors"
                  >
                    <div className="flex items-center justify-between gap-4 w-full">
                      <div className="flex min-w-0 flex-1 items-center space-x-8">
                        <span className="w-12 shrink-0 font-[family-name:var(--font-mono)] text-[11px] font-medium tracking-[0.04em] leading-[1.2] text-text-muted">
                          {(index + 1).toString().padStart(3, '0')}
                        </span>
                        <span className="min-w-0 font-[family-name:var(--font-mono)] text-[17px] font-medium tracking-wide text-secondary-fixed-dim group-hover:text-primary leading-[1.75]">
                          {post.title}
                        </span>
                      </div>
                      <span className="flex shrink-0 items-center gap-4 whitespace-nowrap font-[family-name:var(--font-mono)] text-[11px] font-medium tracking-[0.04em] leading-[1.2] text-text-dim">
                        <span className="hidden md:inline">{post.readTime}</span>
                        <span>{post.date}</span>
                      </span>
                    </div>

                    <div className="hover-thumbnail absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-40 border border-primary-fixed z-10 pointer-events-none overflow-hidden bg-surface opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-surface-container-high w-full h-full flex items-center justify-center p-4">
                         <p className="font-[family-name:var(--font-mono)] text-[10px] text-text-muted text-center line-clamp-4">{post.excerpt}</p>
                      </div>
                      <div className="absolute inset-0 bg-primary-container mix-blend-overlay opacity-20"></div>
                    </div>
                  </Link>
                </SectionReveal>
              ))}
              {posts.length === 0 && (
                <p className="py-12 font-[family-name:var(--font-mono)] text-[13px] text-text-muted">
                  {copy.emptyState || 'No published articles yet.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
