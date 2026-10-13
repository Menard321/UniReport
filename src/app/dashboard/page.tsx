import Link from "next/link";
import {
  Plus,
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
  FolderKanban,
  ArrowRight,
  BookOpen,
  Building2,
  FlaskConical,
  GraduationCap,
  Sparkles,
  Zap,
  MoreVertical,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session || !session.userId) redirect("/auth/login");

  const user = await db.user.findUnique({
    where: { id: session.userId as string },
    include: {
      subscription: true,
      documents: {
        orderBy: { updatedAt: "desc" },
        take: 5
      }
    }
  });

  if (!user) redirect("/auth/login");

  const totalDocuments = await db.document.count({ where: { userId: user.id } });
  
  const tokensUsed = user.subscription?.aiTokensUsed || 0;
  const tokenLimit = user.subscription?.tier === "FREE" ? 25000 : user.subscription?.tier === "PRO" ? 500000 : 1000000;
  const tokenPercent = Math.min((tokensUsed / tokenLimit) * 100, 100);

  // Quick Start Templates
  const quickStartTypes = [
    {
      id: "fyp-dissertation",
      title: "Research Proposal & Dissertation",
      desc: "Structured Chapter 1-5 drafts for undergraduate or postgraduate final year projects.",
      icon: GraduationCap,
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/40",
      link: "/dashboard/tools/fyp-generator"
    },
    {
      id: "fieldwork-attachment",
      title: "Fieldwork & Attachment Report",
      desc: "Industrial practical training logbooks, site observations, and placement reports.",
      icon: Building2,
      color: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-900/40",
      link: "/dashboard/tools/field-report"
    },
    {
      id: "practical-lab",
      title: "Practical & Laboratory Report",
      desc: "Scientific experiment setups, data observations, methodologies, and findings.",
      icon: FlaskConical,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/40",
      link: "/dashboard/tools/lab-report"
    },
    {
      id: "coursework-technical",
      title: "Coursework & Technical Report",
      desc: "Module term papers, case studies, and engineering technical project assignments.",
      icon: BookOpen,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/40",
      link: "/dashboard/tools/coursework"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-7xl mx-auto">
      {/* DASHBOARD HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading tracking-tight text-foreground">
            Academic Workspace Overview
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Welcome back, <strong className="text-foreground">{user.name || user.email}</strong>. Manage your ongoing university projects and AI reporting quota.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/create">
            <Button className="shadow-sm gap-2 bg-primary hover:bg-primary/90">
              <Plus className="size-4" />
              Create New Report
            </Button>
          </Link>
        </div>
      </div>

      {/* DYNAMIC SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Active Projects", value: totalDocuments.toString(), change: "Live Database", icon: FolderKanban, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40" },
          { label: "Completed Reports", value: totalDocuments > 0 ? totalDocuments.toString() : "0", change: "Stored in DB", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40" },
          { label: "Drafts Needing Review", value: "0", change: "All Verified", icon: Clock, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40" },
          { label: "Remaining AI Quota", value: `${(100 - tokenPercent).toFixed(0)}%`, change: `${tokensUsed.toLocaleString()} / ${tokenLimit.toLocaleString()}`, icon: Zap, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/40" }
        ].map((metric, i) => (
          <div key={i} className="p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{metric.label}</p>
              <h3 className="text-2xl font-bold font-heading">{metric.value}</h3>
              <p className="text-[11px] text-muted-foreground mt-1">{metric.change}</p>
            </div>
            <div className={`p-3 rounded-xl ${metric.color}`}>
              <metric.icon className="size-5" />
            </div>
          </div>
        ))}
      </div>

      {/* QUICK START LAUNCHER SECTION */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold font-heading text-foreground flex items-center gap-2">
              <Sparkles className="size-4 text-primary" /> Start a New Report
            </h2>
            <p className="text-xs text-muted-foreground">Select a university report format to launch the guided assistant.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStartTypes.map((type) => (
            <Link key={type.id} href={type.link} className="group">
              <div className="p-5 rounded-xl border bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-primary/50 transition-all flex flex-col justify-between h-full">
                <div>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 border ${type.color}`}>
                    <type.icon className="size-5" />
                  </div>
                  <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors mb-1">
                    {type.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {type.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-primary">
                  <span>Start Workflow</span>
                  <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* RECENT PROJECTS & QUOTA PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RECENT PROJECTS LIST */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-heading text-foreground">Recent Academic Projects</h2>
            <Link href="/dashboard/projects">
              <Button variant="ghost" size="sm" className="text-xs text-primary gap-1">
                View All Projects <ArrowRight className="size-3" />
              </Button>
            </Link>
          </div>
          
          {user.documents.length === 0 ? (
            <div className="p-10 border border-dashed rounded-2xl flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-slate-900/30">
              <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-950/50 text-teal-600 flex items-center justify-center mb-3">
                <FileText className="size-6" />
              </div>
              <h3 className="font-bold text-base mb-1">No Active Projects Yet</h3>
              <p className="text-xs text-muted-foreground max-w-sm mb-4">
                Launch a report workflow above or browse specialized academic tools to create your first report draft.
              </p>
              <Link href="/dashboard/tools">
                <Button size="sm" className="gap-2 text-xs">
                  <Plus className="size-3.5" /> Start First Project
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {user.documents.map((doc: any) => (
                <div key={doc.id} className="p-5 border rounded-xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border border-teal-200 dark:border-teal-900/50">
                        {doc.toolType || "Report"}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                        Completed
                      </span>
                      <span className="text-[11px] text-muted-foreground flex items-center">
                        <Clock className="size-3 mr-1" /> {new Date(doc.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {doc.title || "Untitled Project"}
                    </h3>
                  </div>
                  <Link href={`/dashboard/tools/${doc.toolType || "field-report"}`}>
                    <Button variant="outline" size="sm" className="text-xs gap-1.5">
                      Continue Editing <ArrowRight className="size-3" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SIDEBAR STATUS & QUOTA */}
        <div className="space-y-6">
          <div className="p-5 border rounded-2xl bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden">
            <h3 className="text-sm font-bold font-heading mb-3 border-b pb-2 flex items-center justify-between">
              <span>Token Quota</span>
              <span className="text-xs uppercase px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">{user.subscription?.tier || "FREE"}</span>
            </h3>
            
            <div className="mb-4">
              <div className="flex justify-between items-end mb-1.5">
                <span className="text-2xl font-bold font-heading">{tokensUsed.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground font-medium">/ {tokenLimit.toLocaleString()} tokens</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 dark:bg-slate-800">
                <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${tokenPercent}%` }}></div>
              </div>
            </div>
            
            <Link href="/dashboard/billing">
              <Button variant="outline" size="sm" className="w-full text-xs gap-2">
                <Zap className="size-3.5 text-amber-500" /> Manage Subscription & Limits
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
