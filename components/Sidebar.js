'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProtectedEmail from '@/components/ProtectedEmail';
import { useCms } from '@/components/CmsProvider';

export default function Sidebar() {
  const pathname = usePathname();
  const { navigation, siteConfig } = useCms();

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-[180px] flex-col justify-between border-r border-border-primary bg-background px-6 py-[28px] md:flex z-40">
      <div className="flex flex-col gap-12">
        <Link href="/" className="flex flex-col gap-1">
          <span className="font-[family-name:var(--font-display)] text-[32px] font-bold leading-none">
            /H/
          </span>
          <span className="font-[family-name:var(--font-mono)] text-[11px] font-medium tracking-wider text-primary-fixed uppercase">
            {siteConfig.name}
          </span>
        </Link>
        <nav className="flex flex-col gap-6">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-[family-name:var(--font-mono)] text-[13px] tracking-wider uppercase whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'translate-x-1 font-bold text-primary-fixed'
                    : 'text-on-secondary-container hover:translate-x-1 hover:text-primary-fixed'
                }`}
              >
                {item.number}. {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-text-muted hover:text-primary-fixed transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">code</span>
          </a>
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-text-muted hover:text-primary-fixed transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">groups</span>
          </a>
          <ProtectedEmail
            className="flex items-center gap-3 text-text-muted hover:text-primary-fixed transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">mail</span>
          </ProtectedEmail>
        </div>
        <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-wider uppercase text-text-dim">
          {siteConfig.copyright}
        </p>
      </div>
    </aside>
  );
}
