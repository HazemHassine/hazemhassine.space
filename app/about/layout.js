import { getPublishedCmsData } from '@/lib/cms-server';

export async function generateMetadata() {
  const cms = await getPublishedCmsData();
  return cms.pageContent?.seo?.pages?.about || {};
}

export default function AboutLayout({ children }) {
  return <>{children}</>;
}
