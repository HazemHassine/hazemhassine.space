import { getPublishedCmsData } from '@/lib/cms-server';

export async function generateMetadata() {
  const cms = await getPublishedCmsData();
  return cms.pageContent?.seo?.pages?.contact || {};
}

export default function ContactLayout({ children }) {
  return <>{children}</>;
}
