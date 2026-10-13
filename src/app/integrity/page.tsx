import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Scale,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Award
} from "lucide-react";

export const metadata: Metadata = {
  title: "Academic Integrity Policy | UniReportTZ",
  description: "Learn about UniReportTZ's strict ethical standards, responsible AI writing guidelines, and commitment to TCU compliance and academic rigor in Tanzania.",
};

export default function IntegrityPage() {
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
        
        {/* HERO SECTION */}
        <section className="relative pt-16 pb-20 md:pt-20 md:pb-24 bg-slate-900 text-white overflow-hidden border-b border-slate-800">
          <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:32px_32px]" />
          <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-5xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-teal-400 uppercase mb-6">
              <ShieldCheck className="size-4" /> ETHICAL SCHOLARSHIP STANDARD
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading leading-tight mb-6">
              Academic Integrity & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-200">
                Responsible AI Writing Policy
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
              UniReportTZ is engineered as a cognitive accelerator and structure architect for scholars, students, and researchers across Tanzania. Our mission is to elevate academic quality while strictly defending academic honesty, authentic learning, and institutional compliance.
            </p>
          </div>
        </section>

        {/* CORE PILLARS */}
        <section className="py-16 px-4 md:px-6 container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="size-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
                <BookOpen className="size-5" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Scholarship Support, Not Substitution</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The platform provides structural organization, literature synthesis, and formatting compliance. It does not replace the scholar's critical thinking, primary fieldwork, or intellectual responsibility.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="size-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Scale className="size-5" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Zero Falsification Policy</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                UniReportTZ strictly prohibits fabricating field logs, supervisor signatures, empirical datasets, or simulated research results. AI output must reflect verified field observations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="size-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <Award className="size-5" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">TCU Guidelines Alignment</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our templates and citation models adhere to the standards outlined by the Tanzania Commission for Universities (TCU) and individual institutional handbooks (UDSM, UDOM, SUA, DIT, MUST).
              </p>
            </div>
          </div>

          {/* DETAILED POLICY SECTIONS */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-sm space-y-12">
            
            {/* Section 1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400">01</span>
                <h2 className="text-2xl font-bold font-heading text-foreground">Permissible and Recommended Uses</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                UniReportTZ encourages the ethical use of artificial intelligence to enhance scholarly writing in the following authorized capacities:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  "Drafting academic outlines and structuring chapter hierarchies.",
                  "Refining grammar, academic tone, and scholarly phrasing.",
                  "Formatting citations according to APA 7th, IEEE, or Harvard styles.",
                  "Structuring logbook observations into comprehensive attachment chapters.",
                  "Generating research gap analyses from verified published literature.",
                  "Formatting documents into institution-ready margins, typography, and cover pages."
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="size-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400">02</span>
                <h2 className="text-2xl font-bold font-heading text-foreground">Prohibited Activities & Misconduct</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                The following actions violate our terms of service and Tanzanian academic honor codes:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  "Submitting unreviewed AI-generated text without reading and understanding it.",
                  "Fabricating field placement companies, supervisor names, or dates.",
                  "Inventing experimental laboratory readings or fabricated questionnaire statistics.",
                  "Claiming full sole authorship of unverified AI drafts without intellectual contribution.",
                  "Attempting to bypass institutional similarity detection software through adversarial obfuscation.",
                  "Uploading classified institutional data or confidential enterprise records without permission."
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 text-xs sm:text-sm text-rose-900 dark:text-rose-300">
                    <AlertTriangle className="size-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3 */}
            <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400">03</span>
                <h2 className="text-2xl font-bold font-heading text-foreground">The Student's Final Responsibility</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                Before submitting any field report, dissertation proposal, or thesis draft generated or assisted by UniReportTZ to an examination board, supervisor, or university portal (such as UDSM ARIS, UDOM SRIS, or SUA SUASIS), students must:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-slate-700 dark:text-slate-300 pl-2">
                <li>Read through every paragraph to verify factual alignment with actual fieldwork conducted.</li>
                <li>Verify all citations against primary literature (Google Scholar, ResearchGate, African Journals Online).</li>
                <li>Obtain formal verification and approval from your assigned industry/academic supervisor.</li>
                <li>Ensure compliance with your university's specific policy on AI tools in coursework.</li>
              </ul>
            </div>

            {/* Help Callout */}
            <div className="p-6 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-base text-teal-900 dark:text-teal-200">Have Questions Regarding Institutional Guidelines?</h4>
                <p className="text-xs text-teal-700 dark:text-teal-300">
                  Our academic compliance desk coordinates directly with university guidelines to ensure students stay compliant.
                </p>
              </div>
              <Link href="/contact" className="shrink-0">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold">
                  Contact Compliance Desk <ArrowRight className="size-3.5 ml-1.5" />
                </Button>
              </Link>
            </div>

          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
