import { HelpCircle, BookOpen, MessageSquare, ShieldCheck } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight flex items-center gap-3">
          <HelpCircle className="size-8 text-primary" /> Help & Tanzanian Academic Support
        </h1>
        <p className="text-muted-foreground mt-1">
          Guidance on institutional formatting, report workflows, and academic integrity policies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border rounded-2xl bg-white dark:bg-slate-900 shadow-sm">
          <BookOpen className="size-8 text-teal-600 mb-3" />
          <h3 className="font-bold text-base mb-1">University Formatting Guides</h3>
          <p className="text-xs text-muted-foreground">Access UDSM, DIT, MUST, SUA, and IFM official report writing handbooks.</p>
        </div>
        <div className="p-6 border rounded-2xl bg-white dark:bg-slate-900 shadow-sm">
          <ShieldCheck className="size-8 text-blue-600 mb-3" />
          <h3 className="font-bold text-base mb-1">Academic Integrity Policy</h3>
          <p className="text-xs text-muted-foreground">Learn how UniReportTZ ensures data evidence traceability without inventing fake data.</p>
        </div>
        <div className="p-6 border rounded-2xl bg-white dark:bg-slate-900 shadow-sm">
          <MessageSquare className="size-8 text-purple-600 mb-3" />
          <h3 className="font-bold text-base mb-1">24/7 Student Support</h3>
          <p className="text-xs text-muted-foreground">Get help with DOCX exporting, billing inquiries, or technical support.</p>
        </div>
      </div>
    </div>
  );
}
