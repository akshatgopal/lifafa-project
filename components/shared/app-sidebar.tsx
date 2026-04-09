"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LayoutGrid,
  Camera,
  Users,
  MessageSquare,
  Settings,
  Gift,
  Mail,
  Activity,
  Sun,
  Moon,
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

const navItems = [
  { href: "/dashboard", icon: LayoutGrid, label: "Ledger" },
  { href: "/capture", icon: Camera, label: "Capture" },
  { href: "/guests", icon: Users, label: "Guests" },
  { href: "/munshi", icon: MessageSquare, label: "Ask Munshi" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <Sidebar>
      {/* Header — py-4 matches page header padding so the border aligns */}
      <SidebarHeader className="py-4 px-4 border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/15 ring-1 ring-primary/30">
            <Mail className="h-4 w-4 text-primary" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col gap-1 leading-none min-w-0">
            <span
              className="text-[22px] font-semibold leading-tight tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Lifafa
            </span>
            <span className="text-[13px] text-muted-foreground truncate">
              Your Digital Munshi
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
        {/* Live activity */}
        <div className="flex items-center gap-2.5 rounded-md bg-sidebar-accent/70 px-3 py-2.5">
          <div className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-70 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <div className="flex flex-col leading-none min-w-0">
            <span className="text-[12px] font-medium text-foreground">3 Pending</span>
            <span className="text-[10px] text-muted-foreground">AI processing</span>
          </div>
          <Activity className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground/40" strokeWidth={1.5} />
        </div>

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
