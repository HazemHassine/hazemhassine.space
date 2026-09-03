import { Inter, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import PageTransition from "@/components/PageTransition";
import ChatWrapper from "@/components/ChatWrapper";
import "./globals.css";
import CustomCursor from "../components/CustomCursor";
import CmsProvider from "@/components/CmsProvider";
import { getClientCmsData, getPublishedCmsData } from "@/lib/cms-server";
import { createPageMetadata, SITE_URL } from "@/lib/seo";

const inter = Inter({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export async function generateMetadata() {
  const cms = await getPublishedCmsData();
  const seo = cms.pageContent?.seo || {};
  const title = seo.siteTitle || "HAZEM HASSINE | Software Engineer";
  const description = seo.siteDescription || cms.siteConfig?.tagline;

  return {
    metadataBase: new URL(SITE_URL),
    ...createPageMetadata({
      title,
      description,
      siteName: cms.siteConfig?.name || "Hazem Hassine",
    }),
    keywords: seo.keywords,
    authors: [{ name: cms.siteConfig?.name || "Hazem Hassine" }],
  };
}

export default async function RootLayout({ children }) {
  const cms = await getPublishedCmsData();

  return (
    <html lang="en" className={`${inter.variable} ${ibmPlexMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen relative">
        <CustomCursor />
        <div className="noise-overlay" />
        <CmsProvider initialData={getClientCmsData(cms)}>
          <PageTransition>
            {children}
          </PageTransition>
        </CmsProvider>
        <ChatWrapper />
        <Analytics />
      </body>
    </html>
  );
}
