import { cookies } from "next/headers";
import { SidebarInset, SidebarProvider } from "@/components/ui/shadcn/sidebar";
import { requireAdmin } from "@/lib/admin-auth";
import { AppSidebar } from "../_components/app-sidebar";
import AppHeader from "../_components/app-header";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin(); // layouts don't re-run on navigation, so pages still check too
  const defaultOpen = (await cookies()).get("sidebar_state")?.value !== "false";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="flex flex-1 flex-col p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
