import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Scale, FileText, CheckCircle2, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | UniReportTZ",
  description: "Terms and conditions governing the use of the UniReportTZ academic platform, mobile money billing, and report generation services.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
        
        {/* HERO SECTION */}
        <section className="relative pt-16 pb-16 md:pt-20 md:pb-20 bg-slate-900 text-white overflow-hidden border-b border-slate-800">
          <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:32px_32px]" />
          <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-teal-400 uppercase mb-6">
              <Scale className="size-4" /> LEGAL AGREEMENT
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading leading-tight mb-4">
              Terms of Service
            </h1>
            <p className="text-sm sm:text-base text-slate-300">
              Last Updated: October 2026 • Effective for all users registered on UniReportTZ in Tanzania and East Africa.
            </p>
          </div>
        </section>

        {/* CONTENT */}
        <section className="py-16 px-4 md:px-6 container mx-auto max-w-4xl">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-sm space-y-10 text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed">
            
            <div className="space-y-3">
              <h2 className="text-xl md:text-2xl font-bold font-heading text-foreground">1. Acceptance of Terms</h2>
              <p>
                By creating an account, browsing the UniReportTZ website, or utilizing any of our AI-assisted academic report generators, you enter into a binding legal contract with UniReportTZ Platform. If you do not accept these terms, you must discontinue using our services immediately.
              </p>
            </div>

            <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-8">
              <h2 className="text-xl md:text-2xl font-bold font-heading text-foreground">2. Student Intellectual Property Ownership</h2>
              <p>
                You retain full ownership, copyright, and academic credit for all original research notes, logbook entries, and raw data you upload to the platform. Documents synthesized using our platform belong to you for academic submission purposes, subject to adherence to institutional research rules.
              </p>
            </div>

            <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-8">
              <h2 className="text-xl md:text-2xl font-bold font-heading text-foreground">3. Mobile Payment Terms & Document Unlocking</h2>
              <p>
                UniReportTZ provides free real-time previews for generated academic documents. To download editable Microsoft Word (.DOC) files, publication-standard PDF documents, or copy generated text, users must complete payment via supported Tanzanian mobile money gateways (M-Pesa, Tigo Pesa, Airtel Money, Halopesa) or hold an active Pro/Institutional plan.
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs md:text-sm text-muted-foreground">
                <li>All prices are billed in Tanzanian Shillings (TZS) unless stated otherwise.</li>
                <li>Digital downloads and unlocked documents are fulfilled immediately upon network verification.</li>
                <li>Document unlock fees are non-refundable once the full editable Word or PDF document has been downloaded.</li>
              </ul>
            </div>

            <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-8">
              <h2 className="text-xl md:text-2xl font-bold font-heading text-foreground">4. Acceptable Use & Account Security</h2>
              <p>
                Users are solely responsible for safeguarding their login credentials. Accounts cannot be shared or sold. Any attempt to scrape, reverse-engineer, overload, or bypass the server-side payment gates of UniReportTZ will result in immediate account termination and permanent blacklisting.
              </p>
            </div>

            <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-8">
              <h2 className="text-xl md:text-2xl font-bold font-heading text-foreground">5. Academic Disclaimer & Limitation of Liability</h2>
              <p>
                UniReportTZ is an AI-powered academic writing assistant, not a human university faculty member or grading supervisor. UniReportTZ does not guarantee specific grades, marks, or degree awards. Users must review and authenticate all output before formal academic defense or submission.
              </p>
            </div>

            <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-8">
              <h2 className="text-xl md:text-2xl font-bold font-heading text-foreground">6. Contact & Legal Notices</h2>
              <p>
                For legal inquiries or dispute notices, contact our administration desk at <Link href="/contact" className="text-teal-600 dark:text-teal-400 font-medium underline">legal@unireport.co.tz</Link> or through our physical liaison in Dar es Salaam, Tanzania.
              </p>
            </div>

          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
