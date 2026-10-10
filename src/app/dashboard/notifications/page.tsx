import { Bell, CheckCircle2 } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight flex items-center gap-3">
          <Bell className="size-8 text-primary" /> Notification Center
        </h1>
        <p className="text-muted-foreground mt-1">
          Activity alerts, generation job completions, and quota notifications.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm space-y-3">
        <div className="p-4 border rounded-xl bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-5 text-emerald-500" />
            <div>
              <h4 className="font-bold text-sm">System Update Applied</h4>
              <p className="text-xs text-muted-foreground">UniReportTZ Master Workspace upgraded with Google Sora & Inter fonts and dynamic PostgreSQL metrics.</p>
            </div>
          </div>
          <span className="text-xs text-muted-foreground font-mono">Just now</span>
        </div>
      </div>
    </div>
  );
}
