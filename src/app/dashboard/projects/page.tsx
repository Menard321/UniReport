import Link from "next/link";
import { FolderKanban, Plus, FileText, Calendar, ArrowRight, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function ProjectsPage() {
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
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight flex items-center gap-3">
            <FolderKanban className="size-8 text-primary" /> My Academic Projects
          </h1>
          <p className="text-muted-foreground mt-1">
            Access and manage all your AI-generated reports, literature reviews, and research drafts stored in PostgreSQL.
          </p>
        </div>
        <Link href="/dashboard/tools">
          <Button className="gap-2">
            <Plus className="size-4" /> New Project
          </Button>
        </Link>
      </div>

      {/* Projects Grid */}
      {user.documents.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border rounded-2xl p-12 text-center shadow-sm max-w-md mx-auto my-12">
          <div className="w-16 h-16 bg-teal-50 dark:bg-teal-950/40 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="size-8" />
          </div>
          <h3 className="text-lg font-bold mb-2">No Projects Created Yet</h3>
          <p className="text-sm text-muted-foreground mb-6">
            You haven't saved any academic reports or AI tool outputs to your database workspace yet.
          </p>
          <Link href="/dashboard/tools">
            <Button className="w-full gap-2">
              <BookOpen className="size-4" /> Explore Academic Tools
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.documents.map((doc: any) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-slate-900 border rounded-xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-900/50 uppercase tracking-wider">
                    {doc.toolType || "Academic Report"}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="size-3" />
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition line-clamp-1 mb-2">
                  {doc.title || "Untitled Report"}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-6 leading-relaxed">
                  {doc.content || "No preview available."}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/60">
                <span className="text-xs font-mono text-muted-foreground">
                  {(doc.content.length / 1024).toFixed(1)} KB
                </span>
                <Link href={`/dashboard/tools/${doc.toolType || "lit-review"}`}>
                  <Button variant="ghost" size="sm" className="gap-1 text-xs">
                    Open Tool <ArrowRight className="size-3" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
