import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

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

export const metadata = {
  title: "HAZEM HASSINE | Software Engineer",
  description:
    "AI-focused software engineer building agentic systems, developer tools, and thoughtful products. MSc Intelligent Interactive Systems at Bielefeld University.",
  keywords: [
    "software engineer",
    "AI",
    "agentic systems",
    "developer tools",
    "portfolio",
    "Hazem Hassine",
  ],
  authors: [{ name: "Hazem Hassine" }],
  openGraph: {
    title: "HAZEM HASSINE | Software Engineer",
    description:
      "AI-focused software engineer building agentic systems, developer tools, and thoughtful products.",
    url: "https://hazemhassine.space",
    siteName: "Hazem Hassine",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HAZEM HASSINE | Software Engineer",
    description:
      "AI-focused software engineer building agentic systems, developer tools, and thoughtful products.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${ibmPlexMono.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen relative">
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  );
}
