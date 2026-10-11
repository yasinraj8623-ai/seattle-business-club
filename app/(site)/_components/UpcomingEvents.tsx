import Image from "next/image";
import { and, asc, eq, gte } from "drizzle-orm";
import { db } from "@/db";
import { events } from "@/db/schema";
import { BADGE_LABEL, formatEventDate, formatTime, seattleToday } from "@/lib/events";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import UnderlineLinkButton from "@/components/ui/UnderlineLinkButton";
import MagneticLinkButton from "@/components/ui/MagneticLinkButton";

export default async function UpcomingEvents() {
  const upcoming = await db
    .select()
    .from(events)
    .where(and(eq(events.published, true), gte(events.date, seattleToday())))
    .orderBy(asc(events.date), asc(events.startTime))
    .limit(6);

  return (
    <section id="network-events">
      <div className="max-w-[1600px] mx-auto px-5 sm:px-6 md:px-10">
        <div className="border-x border-gray-200 py-14 md:py-25 space-y-10 md:space-y-18">
          <Reveal className="px-4 sm:px-6 space-y-3">
            <h2 className="text-sm font-bold text-[#4A5DF9] tracking-wide">UPCOMING EVENTS</h2>
            <div className="flex items-center justify-between gap-5 md:gap-10">
              <h3 className="text-[#1E1E1E] text-[28px] sm:text-[32px] md:text-[40px] font-medium leading-[120%]">
                Come meet the people{" "}
                <span className="bg-[linear-gradient(90deg,#93B1EB_0%,#4A5DF9_100%)] bg-clip-text text-transparent font-bold inline">
                  building Seattle
                </span>
              </h3>
              <div>
                <MagneticLinkButton className="text-nowrap" href="https://www.eventbrite.com" variant="secondary">
                  Explore Events
                </MagneticLinkButton>
              </div>
            </div>
          </Reveal>

          {upcoming.length === 0 ? (
            <p className="px-4 sm:px-6 py-10 border-y border-gray-200 text-[#1E1E1E]/60">
              No upcoming events right now. Check back soon.
            </p>
          ) : (
            <StaggerGroup className="border-t border-gray-200">
              {upcoming.map((event) => {
                const { label, weekday } = formatEventDate(event.date);
                return (
                  <StaggerItem
                    key={event.id}
                    className="flex flex-col gap-4 sm:gap-6 md:grid md:grid-cols-[auto_1fr] md:gap-x-6 md:gap-y-3 lg:flex lg:flex-row lg:gap-8 py-4 px-4 sm:px-6 border-b border-gray-200"
                  >
                    <div className="min-w-46 flex items-baseline gap-2 sm:gap-1.5 md:col-span-2 md:row-start-1">
                      <p className="text-[#1E1E1E] text-xl sm:text-[24px] leading-[120%] tracking-[-0.6px] font-outfit">
                        {label}
                      </p>
                      <p className="text-[#1E1E1E]/60 text-sm leading-[140%] tracking-[0.6px] uppercase">{weekday}</p>
                    </div>

                    <div className="relative md:h-36 lg:h-45 aspect-3/2 rounded-xs overflow-hidden shrink-0 md:col-start-1 md:row-start-2">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        sizes="(min-width: 1024px) 270px, (min-width: 768px) 216px, 100vw"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-col gap-4 sm:gap-6 md:col-start-2 md:row-start-2 md:justify-between lg:contents">
                      <div className="flex-1 space-y-2 sm:space-y-3 lg:self-end">
                        <h3 className="text-[#1E1E1E] font-outfit text-xl sm:text-2xl md:text-3xl leading-[120%] tracking-[-0.6px]">
                          {event.title}
                        </h3>
                        <p className="text-[#1E1E1E]/60 leading-[120%]">
                          {formatTime(event.startTime)} – {formatTime(event.endTime)} · {event.location}
                        </p>
                      </div>

                      <div className="lg:self-start">
                        <UnderlineLinkButton href={event.href || "https://www.eventbrite.com"}>
                          {BADGE_LABEL[event.badge]}
                        </UnderlineLinkButton>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerGroup>
          )}
        </div>
      </div>
    </section>
  );
}
