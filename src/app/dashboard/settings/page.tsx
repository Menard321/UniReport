import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { SettingsForm } from "./SettingsForm";
import { Building2, ShieldEllipsis } from "lucide-react";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session || !session.userId) redirect("/auth/login");

  const user = await db.user.findUnique({
    where: { id: session.userId as string },
  });

  if (!user) redirect("/auth/login");

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal details and security configuration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Main Settings Panel */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-6 border-b pb-4">Profile Information</h2>
            <SettingsForm initialName={user.name || ""} initialEmail={user.email || ""} />
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-teal-50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/50 rounded-2xl p-5 shadow-sm text-teal-900 dark:text-teal-100">
            <div className="flex items-center gap-2 mb-3">
              <ShieldEllipsis className="size-5 text-teal-600 dark:text-teal-400" />
              <h3 className="font-bold">Role Capabilities</h3>
            </div>
            <p className="text-sm opacity-80 mb-4 tracking-tight leading-relaxed">
              You are currently logged in as a <strong>{user.role}</strong>. This dictates your ability to bypass academic limits and access admin portals.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="size-5 text-muted-foreground" />
              <h3 className="font-bold text-foreground">University Bind</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Your account is globally bound tracking to local compliance networks.
            </p>
            <div className="text-xs font-mono bg-white dark:bg-slate-800 p-2 rounded border">
              ORG-ID: TZ-UDSM-009
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
