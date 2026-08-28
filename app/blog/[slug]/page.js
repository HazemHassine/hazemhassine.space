import { getPostBySlug, getAllPosts } from '@/lib/markdown';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import MobileMenu from '@/components/MobileMenu';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);
  if (!post) return { title: 'Not Found' };
  
  return {
    title: `${post.title} | HAZEM HASSINE`,
    description: post.summary,
  };
}

export default async function BlogPost({ params }) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full bg-background">
      <Sidebar />
      <MobileMenu />

      <main className="flex-1 flex flex-col md:ml-[180px] min-h-screen border-l border-border-primary relative z-10 pt-16 md:pt-0">
        <article className="flex-1 px-6 py-12 md:px-12 md:py-20 flex justify-center">
          <div className="flex-1 flex flex-col w-full max-w-3xl">
            
            <Link href="/blog" className="font-[family-name:var(--font-mono)] text-[12px] text-text-muted hover:text-primary-fixed transition-colors mb-12 inline-block">
              ← BACK TO BLOG
            </Link>

            <header className="mb-16 border-b border-border-primary pb-8">
              <div className="flex items-center gap-4 font-[family-name:var(--font-mono)] text-[11px] font-medium tracking-[0.04em] text-text-dim mb-6 uppercase">
                <span>{post.date}</span>
                <span className="w-1 h-1 bg-border-primary rounded-full"></span>
                <span className="text-primary-fixed">{post.readTime}</span>
              </div>
              <h1 className="font-[family-name:var(--font-display)] text-[40px] md:text-[56px] font-bold leading-[1.1] tracking-tight text-primary mb-6">
                {post.title}
              </h1>
              {post.summary && (
                <p className="font-[family-name:var(--font-mono)] text-[16px] text-secondary-fixed-dim leading-[1.6]">
                  {post.summary}
                </p>
              )}
            </header>

            <div className="prose-brutalist">
              <ReactMarkdown
                components={{
                  h1: ({node, ...props}) => <h1 className="font-[family-name:var(--font-display)] text-[32px] font-bold mt-12 mb-6 text-primary tracking-tight" {...props} />,
                  h2: ({node, ...props}) => <h2 className="font-[family-name:var(--font-display)] text-[24px] font-bold mt-10 mb-4 text-primary tracking-tight" {...props} />,
                  h3: ({node, ...props}) => <h3 className="font-[family-name:var(--font-display)] text-[18px] font-bold mt-8 mb-4 text-primary tracking-tight" {...props} />,
                  p: ({node, ...props}) => <p className="font-[family-name:var(--font-mono)] text-[15px] text-text-muted leading-[1.8] mb-6" {...props} />,
                  a: ({node, ...props}) => <a className="text-primary-fixed hover:text-primary transition-colors border-b border-primary-fixed/30 hover:border-primary" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-inside font-[family-name:var(--font-mono)] text-[15px] text-text-muted mb-6 flex flex-col gap-2" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal list-inside font-[family-name:var(--font-mono)] text-[15px] text-text-muted mb-6 flex flex-col gap-2" {...props} />,
                  li: ({node, ...props}) => <li className="leading-[1.8]" {...props} />,
                  blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-primary-fixed pl-6 py-2 my-8 bg-surface-dim font-[family-name:var(--font-mono)] text-[15px] text-secondary-fixed italic" {...props} />,
                  code: ({node, inline, ...props}) => 
                    inline 
                      ? <code className="bg-surface-container-high text-primary px-1.5 py-0.5 text-[13px] font-[family-name:var(--font-mono)] border border-border-primary" {...props} />
                      : <div className="bg-[#0a0a0a] border border-border-primary p-4 my-8 overflow-x-auto"><code className="text-[13px] text-primary-fixed font-[family-name:var(--font-mono)] whitespace-pre" {...props} /></div>,
                  hr: ({node, ...props}) => <hr className="border-t border-border-primary my-12" {...props} />
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
            
          </div>
        </article>
      </main>
    </div>
  );
}
