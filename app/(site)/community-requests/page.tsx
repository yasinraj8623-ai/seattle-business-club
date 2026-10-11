import Image from "next/image";
import type { Metadata } from "next";
import { FadeIn } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Community Requests",
  description: "Community Requests are coming soon to Seattle Business Club.",
  alternates: { canonical: "/community-requests" },
  openGraph: {
    type: "website",
    url: "/community-requests",
    siteName: "Seattle Business Club",
    locale: "en_US",
    title: "Community Requests | Seattle Business Club",
    description: "Community Requests are coming soon to Seattle Business Club.",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Seattle Business Club" }],
  },
};

export default function CommunityRequestsPage() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <Image
          src="/images/community-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover object-center"
        />
        {/* <div className="absolute inset-0 -z-10 bg-black/30" /> */}

        <div className="relative mx-auto flex min-h-180 max-w-[1600px] items-center justify-center px-5 pb-20 pt-40 sm:px-6 md:min-h-[820px] md:px-10">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <h2 className="text-sm font-bold uppercase tracking-wide text-[#4A5DF9]">Community Requests</h2>
            <h1 className="mt-5 bg-[linear-gradient(90deg,#93B1EB_0%,#4A5DF9_100%)] bg-clip-text font-outfit text-4xl font-semibold leading-[120%] text-transparent sm:text-5xl md:text-6xl">
              Coming Soon
            </h1>

            <div className="mt-12 space-y-6 text-base leading-[150%] text-white sm:text-lg md:text-xl">
              <p>
                Have an idea, need support, or want to connect with Seattle&rsquo;s business community? We&rsquo;re
                building a space for you.
              </p>
              <p>
                Join the club and stay connected. Be part of the community, discover opportunities, and help shape
                what&rsquo;s next.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
