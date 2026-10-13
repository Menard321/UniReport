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
        <div className="p-6 border rounded-2xl bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div>
            <MessageSquare className="size-8 text-purple-600 mb-3" />
            <h3 className="font-bold text-base mb-1">Student Helpline & WhatsApp</h3>
            <p className="text-xs text-muted-foreground mb-3">Get real-time help with PDF exporting, mobile payments, or report formatting.</p>
          </div>
          <div className="pt-3 border-t text-xs space-y-1 font-mono">
            <a href="tel:+255627204980" className="block text-teal-600 dark:text-teal-400 font-bold hover:underline">
              📞 0627 204 980 (Halotel/Vodacom)
            </a>
            <a href="tel:+255747461380" className="block text-teal-600 dark:text-teal-400 font-bold hover:underline">
              📞 0747 461 380 (Vodacom M-Pesa)
            </a>
          </div>
        </div>
      </div>

      <div className="p-6 border rounded-2xl bg-slate-50 dark:bg-slate-900/40 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm text-foreground">Need Urgent Manual Document Unlocking?</h4>
          <p className="text-xs text-muted-foreground">
            If your mobile payment transaction requires verification, send your transaction SMS to <strong>0627204980</strong> or <strong>0747461380</strong> for immediate assistance.
          </p>
        </div>
        <div className="flex gap-2">
          <a href="https://wa.me/255627204980" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition">
            Chat on WhatsApp
          </a>
          <a href="tel:+255747461380" className="px-4 py-2 rounded-xl border bg-background text-xs font-semibold hover:bg-muted transition">
            Call Desk
          </a>
        </div>
      </div>
    </div>
  );
}
