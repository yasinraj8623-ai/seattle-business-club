import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin · Seattle Business Club",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-gray-50 text-[#1E1E1E]">{children}</div>;
}
