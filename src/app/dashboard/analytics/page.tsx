import { BarChart3, Cpu, Database, Zap } from "lucide-react";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function AnalyticsPage() {
  const session = await getSession();
  if (!session || !session.userId) redirect("/auth/login");

  const user = await db.user.findUnique({
    where: { id: session.userId as string },
    include: { subscription: true, documents: true },
  });

  if (!user || !user.subscription) redirect("/auth/login");
  const sub = user.subscription;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight flex items-center gap-3">
          <BarChart3 className="size-8 text-primary" /> Usage & Analytics
        </h1>
        <p className="text-muted-foreground mt-1">
          Detailed metrics tracking your token usage, storage consumption, and execution stats.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/40 text-purple-600 rounded-xl">
              <Cpu className="size-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{sub.aiTokensUsed.toLocaleString()}</h3>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Tokens Consumed</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 rounded-xl">
              <Database className="size-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{sub.storageUsedMb.toFixed(2)} MB</h3>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Storage Used</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-teal-50 dark:bg-teal-950/40 text-teal-600 rounded-xl">
              <Zap className="size-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{user.documents.length}</h3>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Generated Docs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
