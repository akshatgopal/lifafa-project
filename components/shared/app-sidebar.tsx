"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import Image from "next/image";
import {
  LayoutGrid,
  Camera,
  Users,
  MessageSquare,
  Settings,
  Sun,
  Moon,
  Repeat,
  CalendarDays,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useWeddingStore } from "@/store/wedding-store";

const navItems = [
  { href: "/dashboard", icon: LayoutGrid, label: "Ledger" },
  { href: "/capture", icon: Camera, label: "Capture" },
  { href: "/guests", icon: Users, label: "Guests" },
  { href: "/munshi", icon: MessageSquare, label: "Ask Munshi" },
];

function formatDate(date: string | null | undefined): string | null {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function AppSidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const wedding = useWeddingStore((s) => s.wedding);

  const dateLabel = formatDate(wedding?.event_date);

  return (
    <Sidebar>
      {/* Header — py-4 matches page header padding so the border aligns */}
      <SidebarHeader className="py-4 px-4 border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/15 ring-1 ring-primary/30 overflow-hidden">
            <Image src="/munshi.png" alt="Lifafa logo" width={32} height={32} className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col gap-1 leading-none min-w-0">
            <span
              className="truncate text-[15px] font-semibold leading-tight tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-playfair)" }}
              title={wedding?.event_name ?? "Lifafa"}
            >
              {wedding?.event_name ?? "Lifafa"}
            </span>
            <span className="flex items-center gap-1 truncate text-[11px] text-muted-foreground">
              {dateLabel ? (
                <>
                  <CalendarDays className="h-3 w-3" strokeWidth={1.75} />
                  {dateLabel}
                </>
              ) : (
                "Your Digital Munshi"
              )}
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* Nav */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-3">
              {navItems.map(({ href, icon: Icon, label }) => {
                const active = pathname.startsWith(href);
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link href={href}>
                        <Icon strokeWidth={active ? 2 : 1.5} />
                        {label}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer — always pinned to bottom */}
      <SidebarFooter className="p-3 gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/weddings">
                <Repeat strokeWidth={1.5} />
                Switch wedding
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <Separator />

        {/* Settings + theme toggle */}
        <div className="flex items-center gap-1">
          <SidebarMenu className="flex-1">
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/settings">
                  <Settings strokeWidth={1.5} />
                  Settings
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title={theme === "dark" ? "Switch to light" : "Switch to dark"}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" strokeWidth={1.75} />
            ) : (
              <Moon className="h-4 w-4" strokeWidth={1.75} />
            )}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
