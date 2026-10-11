import Image from "next/image";
import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import { FadeIn, Reveal } from "@/components/motion/reveal";
import ContactForm from "./_components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Got a question, a collab idea, or want to learn more about Seattle Business Club? Get in touch.",
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    url: "/contact",
    siteName: "Seattle Business Club",
    locale: "en_US",
    title: "Contact Us | Seattle Business Club",
    description: "Got a question, a collab idea, or want to learn more about Seattle Business Club? Get in touch.",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Seattle Business Club" }],
  },
};

const details = [
  { icon: Mail, title: "Email", value: "hello@seattlebusinessclub.com" },
  { icon: MapPin, title: "Location", value: "Capitol Hill, Seattle WA" },
];

export default function ContactPage() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <Image
          src="/images/contact-page-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-black/30" />

        <div className="relative mx-auto max-w-[1600px] px-5 pb-16 pt-36 sm:px-6 sm:pt-40 md:px-10 md:pb-25 md:pt-48">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <h2 className="text-sm font-bold uppercase tracking-wide text-[#4A5DF9]">Get in touch</h2>
            <h1 className="mt-4 font-outfit text-4xl font-medium leading-[120%] text-white sm:text-5xl">Contact Us</h1>
            <p className="mt-4 text-base leading-[150%] text-white sm:text-lg">
              Got a question, a collab idea, or just wanna learn more about Seattle Business Club? We&rsquo;re here for
              it!
            </p>
          </FadeIn>

          <div className="mx-auto mt-12 grid max-w-5xl gap-10 md:mt-16 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            <Reveal className="space-y-8 lg:pt-4">
              {details.map(({ icon: Icon, title, value }) => (
                <div key={title} className="flex items-start gap-4">
                  <Icon className="mt-1 size-5 shrink-0 text-[#5B9CFF]" />
                  <div className="space-y-1">
                    <p className="text-lg font-medium text-white">{title}</p>
                    <p className="text-sm text-white/80">{value}</p>
                  </div>
                </div>
              ))}
            </Reveal>

            <Reveal delay={0.1}>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
