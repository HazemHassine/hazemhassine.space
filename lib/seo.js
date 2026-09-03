const SITE_URL = "https://hazemhassine.space";

/**
 * Builds the browser, search, and social metadata from the content already
 * stored for a page.  Keeping this in one place means a post or project only
 * needs its normal title, summary, and optional image.
 */
export function createPageMetadata({
  title,
  description,
  pathname = "/",
  siteName = "Hazem Hassine",
  type = "website",
  image,
}) {
  const images = image ? [{ url: image, alt: title }] : undefined;

  return {
    title,
    description,
    alternates: { canonical: pathname },
    openGraph: {
      title,
      description,
      url: pathname,
      siteName,
      type,
      images,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images,
    },
  };
}

export { SITE_URL };
