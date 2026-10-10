import { FileText, Clock } from "lucide-react";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function DocumentsPage() {
  const session = await getSession();
  if (!session || !session.userId) redirect("/auth/login");

  const user = await db.user.findUnique({
    where: { id: session.userId as string },
    include: {
      documents: {
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  if (!user) redirect("/auth/login");

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight flex items-center gap-3">
          <FileText className="size-8 text-primary" /> Recent Documents
        </h1>
        <p className="text-muted-foreground mt-1">
          View all saved report versions and document history stored in PostgreSQL.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm space-y-3">
        {user.documents.length === 0 ? (
          <p className="text-sm text-center text-muted-foreground py-8">No saved documents found in database.</p>
        ) : (
          user.documents.map((doc: any) => (
            <div key={doc.id} className="p-4 border rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm">{doc.title || "Report"}</h4>
                <p className="text-xs text-muted-foreground">{doc.toolType} • {new Date(doc.updatedAt).toLocaleString()}</p>
              </div>
              <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded">
                {(doc.content.length / 1024).toFixed(1)} KB
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
