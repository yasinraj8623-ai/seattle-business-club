import type { Metadata } from "next";

export const baseOpenGraph: NonNullable<Metadata["openGraph"]> = {
  type: "website",
  siteName: "Seattle Business Club",
  locale: "en_US",
  images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Seattle Business Club" }],
};
