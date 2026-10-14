"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  FolderKanban,
  FileText,
  PlusCircle,
  Wand2,
  FileSpreadsheet,
  Search,
  BookMarked,
  BarChart3,
  History,
  Users,
  Bell,
  CreditCard,
  Settings,
  HelpCircle,
  Crown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function DashboardSidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navigationGroups = [
    {
      title: "WORKSPACE",
      items: [
        { href: "/dashboard", label: "Overview", icon: Home },
        { href: "/dashboard/projects", label: "My Projects", icon: FolderKanban },
        { href: "/dashboard/documents", label: "Recent Documents", icon: FileText },
      ],
    },
    {
      title: "CREATE",
      items: [
        { href: "/dashboard/create", label: "New Report", icon: PlusCircle },
        { href: "/dashboard/tools", label: "Academic Tools", icon: Wand2 },
        { href: "/dashboard/templates", label: "Templates", icon: FileSpreadsheet },
      ],
    },
    {
      title: "RESEARCH",
      items: [
        { href: "/dashboard/research", label: "Research Assistant", icon: Search },
        { href: "/dashboard/sources", label: "Sources & Citations", icon: BookMarked },
        { href: "/dashboard/analysis", label: "Data Analysis", icon: BarChart3 },
      ],
    },
    {
      title: "WORKFLOW",
      items: [
        { href: "/dashboard/history", label: "Review History", icon: History },
        { href: "/dashboard/collaboration", label: "Collaboration", icon: Users },
        { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
      ],
    },
    {
      title: "ACCOUNT",
      items: [
        { href: "/dashboard/billing", label: "Usage & Plans", icon: CreditCard },
        { href: "/dashboard/settings", label: "Settings", icon: Settings },
        { href: "/dashboard/help", label: "Help & Support", icon: HelpCircle },
      ],
    },
  ];

  return (
    <aside className="w-64 border-r bg-slate-50/70 dark:bg-slate-900/60 hidden md:flex flex-col min-h-screen">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-border/60 bg-white dark:bg-slate-950" suppressHydrationWarning>
        <Link href="/dashboard" className="flex items-center gap-2.5" suppressHydrationWarning>
          <div className="relative size-8 rounded-lg overflow-hidden flex items-center justify-center shrink-0" suppressHydrationWarning>
            <Image
              src="/logo.png"
              alt="UniReportTZ Logo"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </div>
          <span className="font-bold font-heading text-lg text-primary dark:text-white tracking-tight" suppressHydrationWarning>
            UniReportTZ
          </span>
        </Link>
      </div>
      
      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-5 px-4 space-y-6">
        {navigationGroups.map((group) => (
          <div key={group.title}>
            <div className="px-2 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              {group.title}
            </div>
            <nav className="space-y-0.5">
              {group.items.map((link) => {
                const isActive = mounted
                  ? pathname === link.href || (link.href !== "/dashboard" && pathname?.startsWith(link.href))
                  : false;

                return (
                  <Link key={link.href} href={link.href}>
                    <span
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition-all",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm dark:bg-primary dark:text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <link.icon className="size-4 opacity-80" />
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
      
      {/* Dynamic Subscription Footer */}
      <div className="p-4 border-t border-border/60 bg-white dark:bg-slate-950">
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 dark:from-teal-950/40 dark:to-emerald-950/40 dark:border-teal-900/50 mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-teal-800 dark:text-teal-400">STUDENT ACCOUNT</span>
            <Crown className="size-4 text-amber-500" />
          </div>
          <div className="w-full bg-teal-200/50 dark:bg-teal-900/60 rounded-full h-1.5 mb-2">
            <div className="bg-teal-600 dark:bg-teal-400 h-1.5 rounded-full" style={{ width: "40%" }}></div>
          </div>
          <p className="text-[10px] text-muted-foreground font-medium mb-3">2 of 5 Projects Used</p>
          <Link href="/dashboard/billing">
            <Button size="sm" className="w-full text-xs h-7 bg-teal-600 hover:bg-teal-700 text-white border-none shadow-sm">
              Upgrade to Pro
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  );
}
