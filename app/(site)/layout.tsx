import SmoothScroll from "@/components/scroll/SmoothScroll";
import Footer from "@/components/Footer";
import Navber from "@/components/Navber";
import JsonLd from "@/components/JsonLd";

const siteUrl = "https://seattlebusinessclub.com";
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
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={siteSchema} />
      <Navber />
      <SmoothScroll>
        {children}
        <Footer />
      </SmoothScroll>
    </>
  );
}
