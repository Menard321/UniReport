import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Lock, ShieldCheck, Database, EyeOff, Server, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy & Data Protection Policy | UniReportTZ",
  description: "Read how UniReportTZ protects your student research, uploaded templates, payment details, and personal data in accordance with Tanzanian privacy laws.",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
        
        {/* HERO SECTION */}
        <section className="relative pt-16 pb-16 md:pt-20 md:pb-20 bg-slate-900 text-white overflow-hidden border-b border-slate-800">
          <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:32px_32px]" />
          <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-teal-400 uppercase mb-6">
              <Lock className="size-4" /> DATA PROTECTION & PRIVACY
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading leading-tight mb-4">
              Privacy & Data Policy
            </h1>
            <p className="text-sm sm:text-base text-slate-300">
              Compliant with the Tanzania Personal Data Protection Act (PDPA 2022) and international security standards.
            </p>
          </div>
        </section>

        {/* CONTENT */}
        <section className="py-16 px-4 md:px-6 container mx-auto max-w-4xl">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-sm space-y-10 text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed">
            
            <div className="space-y-3">
              <h2 className="text-xl md:text-2xl font-bold font-heading text-foreground">1. Our Core Privacy Commitment</h2>
              <p>
                At UniReportTZ, we recognize that your university thesis, fieldwork logbook, and research findings represent confidential and original intellectual property. We do not sell your personal data, nor do we train public AI models on your private research drafts without your consent.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border space-y-2">
                <Database className="size-5 text-teal-600 dark:text-teal-400" />
                <h4 className="font-bold text-sm text-foreground">Encrypted Storage</h4>
                <p className="text-xs text-muted-foreground">All report records and user credentials are encrypted in our secured PostgreSQL database cluster.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border space-y-2">
                <EyeOff className="size-5 text-teal-600 dark:text-teal-400" />
                <h4 className="font-bold text-sm text-foreground">No Public Scraping</h4>
                <p className="text-xs text-muted-foreground">Your drafts are private to your authenticated session. Other students cannot read or copy your work.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border space-y-2">
                <Server className="size-5 text-teal-600 dark:text-teal-400" />
                <h4 className="font-bold text-sm text-foreground">Local Gateway</h4>
                <p className="text-xs text-muted-foreground">Mobile money transactions are processed securely through certified Tanzanian telecommunication APIs.</p>
              </div>
            </div>

            <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-8">
              <h2 className="text-xl md:text-2xl font-bold font-heading text-foreground">2. Information We Collect</h2>
              <ul className="list-disc list-inside space-y-2 pl-2 text-xs md:text-sm">
                <li><strong>Account Data:</strong> Name, university email address, university name, and department.</li>
                <li><strong>Document Inputs:</strong> Practical attachment logs, organization name, supervisor title, and custom prompt inputs.</li>
                <li><strong>Payment Metadata:</strong> Mobile telephone numbers and transaction reference IDs issued by M-Pesa, Tigo Pesa, Airtel Money, or Halopesa. (We never store debit/credit card CVV codes or mobile PINs).</li>
                <li><strong>System Telemetry:</strong> Anonymized error diagnostics and AI token consumption metrics for quality assurance.</li>
              </ul>
            </div>

            <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-8">
              <h2 className="text-xl md:text-2xl font-bold font-heading text-foreground">3. Your Data Rights</h2>
              <p>
                In accordance with the Tanzania Personal Data Protection Act (PDPA 2022), you have the right to:
              </p>
              <div className="space-y-2 text-xs md:text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-teal-600 shrink-0" />
                  <span>Request a full export of all your generated documents and citations.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-teal-600 shrink-0" />
                  <span>Request permanent deletion of your account and all associated document drafts.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-teal-600 shrink-0" />
                  <span>Review transaction logs associated with your mobile phone number.</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-8">
              <h2 className="text-xl md:text-2xl font-bold font-heading text-foreground">4. Contact Our Data Protection Officer</h2>
              <p>
                If you have questions regarding data retention or wish to exercise your data deletion rights, reach out to our privacy compliance officer at <Link href="/contact" className="text-teal-600 dark:text-teal-400 font-medium underline">privacy@unireport.co.tz</Link>.
              </p>
            </div>

          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
