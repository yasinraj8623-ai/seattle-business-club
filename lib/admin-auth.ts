import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const COOKIE = "sbc_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const sign = (v: string) => createHmac("sha256", process.env.ADMIN_SESSION_SECRET!).update(v).digest("hex");
const digest = (v: string) => createHash("sha256").update(v).digest();

export function passwordMatches(input: string) {
  return timingSafeEqual(digest(input), digest(process.env.ADMIN_PASSWORD!));
}

export async function createSession() {
  const exp = String(Date.now() + MAX_AGE * 1000);
  (await cookies()).set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete({ name: COOKIE, path: "/admin" });
}

export async function isAdmin() {
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const [exp, sig] = value.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const expected = sign(exp);
  return sig.length === expected.length && timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
