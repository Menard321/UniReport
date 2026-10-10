"use client";

import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { UserProfileMenu } from "@/components/layout/UserProfileMenu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-white dark:bg-slate-900 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
             <h2 className="text-lg font-semibold font-heading hidden sm:block text-foreground">Workspace</h2>
          </div>
          <div className="flex items-center gap-4">
            <NotificationCenter />
            <UserProfileMenu />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
