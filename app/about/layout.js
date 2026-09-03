import { getPublishedCmsData } from '@/lib/cms-server';
import { createPageMetadata } from '@/lib/seo';

export async function generateMetadata() {
  const cms = await getPublishedCmsData();
  const seo = cms.pageContent?.seo?.pages?.about || {};
  return createPageMetadata({ ...seo, pathname: '/about', siteName: cms.siteConfig?.name });
}

export default function AboutLayout({ children }) {
  return <>{children}</>;
}
