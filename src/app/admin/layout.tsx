"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BarChart3,
  GraduationCap,
  FileCheck,
  ShieldCheck,
  Cpu,
  RefreshCw,
  Settings,
  Users2,
  CreditCard,
  Headphones,
  Globe,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  Search,
  ChevronRight,
  BookOpenText,
  Bell,
  Sparkles
} from "lucide-react";
import { getCurrentSession, hasPermission } from "@/lib/rbac";
import { cn } from "@/lib/utils";

interface NavGroup {
  title: string;
  items: {
    href: string;
    label: string;
    icon: any;
    badge?: string;
  }[];
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = getCurrentSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Simulated Middleware Guard
  useEffect(() => {
    if (!hasPermission(session.role, "UNIREPORT_ADMIN")) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const navGroups: NavGroup[] = [
    {
      title: "Executive & Macro",
      items: [
        { href: "/admin", label: "Overview", icon: LayoutDashboard },
        { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
      ],
    },
    {
      title: "Academic Core",
      items: [
        { href: "/admin/universities", label: "Universities & Programmes", icon: GraduationCap },
        { href: "/admin/guidelines", label: "Academic Guidelines", icon: FileCheck },
        { href: "/admin/quality", label: "Academic Quality", icon: ShieldCheck },
      ],
    },
    {
      title: "Operations & AI",
      items: [
        { href: "/admin/ai-routing", label: "AI & Model Settings", icon: Cpu },
        { href: "/admin/report-jobs", label: "Report Jobs", icon: RefreshCw },
        { href: "/admin/settings", label: "System Settings", icon: Settings },
      ],
    },
    {
      title: "Users & Commerce",
      items: [
        { href: "/admin/users", label: "Users & Roles", icon: Users2 },
        { href: "/admin/payments", label: "Payments & Plans", icon: CreditCard },
        { href: "/admin/support", label: "Support Tickets", icon: Headphones, badge: "3" },
      ],
    },
    {
      title: "Governance",
      items: [
        { href: "/admin/content", label: "Website Content", icon: Globe },
        { href: "/admin/security", label: "Security & Audit Logs", icon: ShieldAlert },
      ],
    },
  ];

  // Derive current module label for breadcrumbs
  let currentModuleLabel = "Overview";
  for (const group of navGroups) {
    const match = group.items.find(item => item.href === pathname);
    if (match) {
      currentModuleLabel = match.label;
      break;
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-800/80 bg-slate-950 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-20",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80 bg-slate-950">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <BookOpenText className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold font-heading text-sm text-white tracking-tight flex items-center gap-1.5">
                UniReportTZ
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30">Admin</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Operations Center</span>
            </div>
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono">
                {group.title}
              </div>
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all group",
                      isActive 
                        ? "bg-teal-500/15 text-teal-300 font-semibold border border-teal-500/30 shadow-sm" 
                        : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                    )}>
                      <span className="flex items-center gap-3">
                        <Icon className={cn(
                          "size-4 shrink-0 transition-colors", 
                          isActive ? "text-teal-400" : "text-slate-500 group-hover:text-slate-300"
                        )} />
                        <span>{item.label}</span>
                      </span>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          {item.badge}
                        </span>
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Admin Session Profile */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center gap-3 px-2 py-1 mb-2.5">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-teal-400 uppercase">
              {session.name ? session.name.substring(0, 2) : "AD"}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-200 truncate">{session.name || "Administrator"}</span>
              <span className="text-[10px] text-teal-400/90 font-mono truncate">{session.email}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/dashboard" className="w-full">
              <button className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-md border border-slate-800 transition-colors">
                App View
              </button>
            </Link>
            <Link href="/" className="w-full">
              <button className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-md border border-slate-800 transition-colors">
                <LogOut className="size-3" /> Exit
              </button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Operational Header */}
        <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <Menu className="size-5" />
            </button>
            
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs">
              <Link href="/admin" className="text-slate-500 hover:text-slate-300 transition-colors font-medium">Admin</Link>
              <ChevronRight className="size-3.5 text-slate-600" />
              <span className="text-slate-200 font-semibold">{currentModuleLabel}</span>
            </div>
          </div>

          {/* Quick Search & Status Indicators */}
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="size-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search resources, users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56 h-8 pl-8 pr-3 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20"
              />
            </div>

            <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Operational
            </div>

            <Link href="/admin/support" className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 relative">
              <Bell className="size-4" />
              <span className="absolute top-1 right-1 size-1.5 rounded-full bg-teal-400" />
            </Link>
          </div>
        </header>

        {/* Module Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-950 relative">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
