import { notFound } from "next/navigation";
import CmsProvider from "@/components/CmsProvider";
import { getClientCmsData, getDraftCmsData } from "@/lib/cms-server";
import HomePage from "@/app/page";
import AboutPage from "@/app/about/page";
import ProjectsPage from "@/app/projects/page";
import ProjectPage from "@/app/projects/[slug]/page";
import BlogPage from "@/app/blog/page";
import ContactPage from "@/app/contact/page";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "CMS Draft Preview",
  robots: { index: false, follow: false },
};

export default async function CmsPreviewPage({ params }) {
  const { path = [] } = await params;
  const cms = await getDraftCmsData();
  const clientCms = getClientCmsData(cms);
  let page;

  if (path.length === 0) {
    page = <HomePage cmsData={cms} />;
  } else if (path[0] === "about" && path.length === 1) {
    page = <AboutPage />;
  } else if (path[0] === "projects" && path.length === 1) {
    page = <ProjectsPage />;
  } else if (path[0] === "projects" && path[1]) {
    page = <ProjectPage params={Promise.resolve({ slug: path[1] })} cmsData={cms} />;
  } else if (path[0] === "blog" && path.length === 1) {
    page = <BlogPage cmsData={cms} />;
  } else if (path[0] === "contact" && path.length === 1) {
    page = <ContactPage />;
  } else {
    notFound();
  }

  return <CmsProvider initialData={clientCms}>{page}</CmsProvider>;
}

