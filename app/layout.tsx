import type { Metadata, Viewport } from "next";
import { Manrope, Outfit } from "next/font/google";
import SmoothScroll from "@/components/scroll/SmoothScroll";
import "./globals.css";
import Footer from "@/components/Footer";
import Navber from "@/components/Navber";
import JsonLd from "@/components/JsonLd";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const siteUrl = "https://seattlebusinessclub.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Seattle Business Club",
    template: "%s | Seattle Business Club",
  },
  description: "Helping Seattle businesses get discovered, connected, and growing.",
  applicationName: "Seattle Business Club",
  alternates: { canonical: "/" },

  // Facebook / LinkedIn / WhatsApp / Slack, etc.
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Seattle Business Club",
    locale: "en_US",
    title: "Seattle Business Club",
    description: "Helping Seattle businesses get discovered, connected, and growing.",
    images: [
      {
        url: "/images/og-image.png", // 1200x630
        width: 1200,
        height: 630,
        alt: "Seattle Business Club",
      },
    ],
  },

  // Twitter / X
  twitter: {
    card: "summary_large_image",
    title: "Seattle Business Club",
    description: "Helping Seattle businesses get discovered, connected, and growing.",
    images: ["/images/og-image.png"],
    // site: "@xhandle",
    // creator: "@xhandle",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#4A5DF9",
  width: "device-width",
  initialScale: 1,
};

const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Seattle Business Club",
      url: siteUrl,
      logo: `${siteUrl}/logo.png`, // PNG, 112x112 px minimum
      email: "contact@seattlebusinessclub.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Seattle",
        addressRegion: "WA",
        addressCountry: "US",
      },
      // sameAs: ["https://www.instagram.com/[insta-handle]", "https://www.linkedin.com/company/[pagename]"],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Seattle Business Club",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-manrope">
        <JsonLd data={siteSchema} />
        <Navber />
        <SmoothScroll>
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
