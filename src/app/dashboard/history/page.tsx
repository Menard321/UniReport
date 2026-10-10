import { History, Clock, FileText } from "lucide-react";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function ReviewHistoryPage() {
  const session = await getSession();
  if (!session || !session.userId) redirect("/auth/login");

  const user = await db.user.findUnique({
    where: { id: session.userId as string },
    include: {
      documents: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) redirect("/auth/login");

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight flex items-center gap-3">
          <History className="size-8 text-primary" /> Review History
        </h1>
        <p className="text-muted-foreground mt-1">
          Chronological log of all generated documents and academic tool completions.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm">
        {user.documents.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Clock className="size-12 mx-auto mb-3 opacity-30" />
            <p>No activity history logged yet.</p>
          </div>
        ) : (
          <div className="relative border-l border-slate-200 dark:border-slate-800 ml-4 space-y-8 py-2">
            {user.documents.map((doc: any) => (
              <div key={doc.id} className="relative pl-6">
                <div className="absolute -left-2.5 top-1.5 w-5 h-5 rounded-full bg-teal-500 border-4 border-white dark:border-slate-900" />
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-base">{doc.title || "Generation"}</h4>
                    <p className="text-xs text-muted-foreground uppercase font-semibold mt-0.5">{doc.toolType || "Tool"}</p>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {new Date(doc.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="mt-2 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border line-clamp-2">
                  {doc.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
