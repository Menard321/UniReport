import { Check, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUBSCRIPTION_TIERS } from "@/lib/subscriptions";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { BillingInteractive } from "./BillingInteractive";

export default async function BillingDashboard() {
  const session = await getSession();
  if (!session || !session.userId) redirect("/auth/login");

  const user = await db.user.findUnique({
    where: { id: session.userId as string },
    include: { subscription: true }
  });

  if (!user || !user.subscription) redirect("/auth/login");
  const sub = user.subscription;

  // Find tier metadata
  const currentTierMeta = SUBSCRIPTION_TIERS.find(t => t.id === sub.tier) || SUBSCRIPTION_TIERS[0];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight">Billing & Subscriptions</h1>
        <p className="text-muted-foreground mt-2">
          Manage your academic workspace limits, upgrade your plan, or view your payment history.
        </p>
      </div>

      {/* Current Usage Card */}
      <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold">Current Plan: {currentTierMeta.name}</h2>
            <p className="text-sm text-muted-foreground">You are currently on the {currentTierMeta.name} tier. {sub.isActive ? "Active" : "Inactive"}</p>
          </div>
          <div className="bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 px-4 py-2 rounded-lg text-sm font-bold border border-teal-200 dark:border-teal-900/50 flex items-center gap-2">
            <ShieldCheck className="size-4" /> Valid Account
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Projects</span>
              <span>{sub.projectsUsed} / {currentTierMeta.limits.maxProjects === -1 ? '∞' : currentTierMeta.limits.maxProjects}</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full" 
                style={{ width: `${currentTierMeta.limits.maxProjects === -1 ? 10 : (sub.projectsUsed / currentTierMeta.limits.maxProjects) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>AI Tasks (Tokens)</span>
              <span>{Math.round(sub.aiTokensUsed / 1000)}k / {Math.round(currentTierMeta.limits.aiTokens / 1000)}k</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full" 
                style={{ width: `${(sub.aiTokensUsed / currentTierMeta.limits.aiTokens) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Cloud Storage</span>
              <span>{sub.storageUsedMb.toFixed(1)}MB / {currentTierMeta.limits.storageMb}MB</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full" 
                style={{ width: `${(sub.storageUsedMb / currentTierMeta.limits.storageMb) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <BillingInteractive currentTierId={sub.tier} />
    </div>
  );
}
