"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { UserProfileMenu } from "@/components/layout/UserProfileMenu";
import { Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <DashboardSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <header className="h-16 shrink-0 border-b bg-white dark:bg-slate-900 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="size-5" />
            </button>
            <h2 className="text-lg font-semibold font-heading hidden sm:block text-foreground">Workspace</h2>
          </div>
          <div className="flex items-center gap-3">
            <NotificationCenter />
            <UserProfileMenu />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
