'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const PortfolioChat = dynamic(() => import('./PortfolioChat'), { ssr: false });

export default function ChatWrapper() {
  const pathname = usePathname();
  const [is404, setIs404] = useState(false);

  useEffect(() => {
    const check404 = () => {
      const isHidden =
        document.body.classList.contains('hide-chatbot') ||
        pathname === '/404' ||
        pathname === '/_not-found';
      setIs404(isHidden);
    };

    check404();

    const observer = new MutationObserver(check404);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [pathname]);

  if (is404 || pathname === '/404' || pathname === '/_not-found' || pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div id="portfolio-chat-root">
      <PortfolioChat />
    </div>
  );
}
