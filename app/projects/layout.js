import { getPublishedCmsData } from '@/lib/cms-server';
import { createPageMetadata } from '@/lib/seo';

export async function generateMetadata() {
  const cms = await getPublishedCmsData();
  const seo = cms.pageContent?.seo?.pages?.projects || {};
  return createPageMetadata({ ...seo, pathname: '/projects', siteName: cms.siteConfig?.name });
}

export default function ProjectsLayout({ children }) {
  return <>{children}</>;
}
