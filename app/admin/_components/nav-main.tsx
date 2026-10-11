"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, LayoutDashboard, Newspaper, Users, type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/shadcn/sidebar";

type Item = { label: string; href: string; icon: LucideIcon };

const groups: { label: string; items: Item[] }[] = [
  { label: "Overview", items: [{ label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard }] },
  { label: "Membership", items: [{ label: "Applications", href: "/admin/applications", icon: Users }] },
  {
    label: "Content",
    items: [
      { label: "Events", href: "/admin/events", icon: CalendarDays },
      { label: "Blogs", href: "/admin/blogs", icon: Newspaper },
    ],
  },
];

export default function NavMain() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const isActive = ({ href }: Item) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.label}>
          <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
          <SidebarMenu>
            {group.items.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  tooltip={item.label}
                  isActive={isActive(item)}
                  render={<Link href={item.href} onClick={() => isMobile && setOpenMobile(false)} />}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
