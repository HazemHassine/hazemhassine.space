'use client';

import { usePathname } from 'next/navigation';
import { useCms } from '@/components/CmsProvider';

export default function TopBar() {
  const pathname = usePathname();
  const { navigation, siteConfig } = useCms();
  const currentNav = navigation.find(
    (item) => item.href === pathname || (item.href !== '/' && pathname.startsWith(item.href))
  ) || { label: 'HOME' };

  return (
    <div className="sticky top-0 z-30 h-12 border-b border-border-primary bg-background px-[28px] hidden md:flex items-center justify-between">
      <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-primary-fixed-dim">
        {siteConfig.role}
      </span>
      <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-wider text-primary-fixed">
        / {currentNav.label}
      </span>
    </div>
  );
}
