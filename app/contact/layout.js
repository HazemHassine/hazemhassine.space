import { getPublishedCmsData } from '@/lib/cms-server';
import { createPageMetadata } from '@/lib/seo';

export async function generateMetadata() {
  const cms = await getPublishedCmsData();
  const seo = cms.pageContent?.seo?.pages?.contact || {};
  return createPageMetadata({ ...seo, pathname: '/contact', siteName: cms.siteConfig?.name });
}

export default function ContactLayout({ children }) {
  return <>{children}</>;
}
