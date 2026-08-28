import { getPublishedCmsData } from '@/lib/cms-server';

export async function generateMetadata() {
  const cms = await getPublishedCmsData();
  return cms.pageContent?.seo?.pages?.projects || {};
}

export default function ProjectsLayout({ children }) {
  return <>{children}</>;
}
