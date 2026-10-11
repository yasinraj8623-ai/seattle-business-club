import type { EventBadge } from "@/db/schema";

export const BADGE_LABEL: Record<EventBadge, string> = {
  limited_seats: "LIMITED SEATS",
  members_free: "MEMBERS FREE",
  open: "OPEN TO ALL",
};

const TZ = "America/Los_Angeles";

/** YYYY-MM-DD in Seattle time. */
export const seattleToday = () => new Date().toLocaleDateString("en-CA", { timeZone: TZ });

/** "14:30:00" → "2:30 PM" */
export function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

/** Date-only strings are parsed as UTC, so format in UTC to avoid off-by-one days. */
export function formatEventDate(d: string) {
  const dt = new Date(`${d}T00:00:00Z`);
  return {
    label: dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }),
    weekday: dt.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
  };
}
