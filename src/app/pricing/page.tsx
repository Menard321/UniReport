"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { 
  CheckCircle2, 
  Sparkles,
  FileText, 
  ShieldCheck, 
  Smartphone, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  Lock, 
  GraduationCap,
  Building2,
  FileCheck,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TzPaymentGateway } from "@/components/billing/TzPaymentGateway";

export default function PricingPage() {
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ id: string; name: string; amount: number }>({
    id: "STUDENT",
    name: "Single Report Unlock",
    amount: 5000
  });

  const [pricingConfig, setPricingConfig] = useState({
    singleDocumentExportTzs: 5000,
    semesterPassTzs: 15000,
    studentMonthlyTzs: 10000,
  });

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    fetch("/api/pricing")
      .then((r) => r.json())
      .then((d) => {
        if (d.pricing) {
          setPricingConfig({
            singleDocumentExportTzs: d.pricing.singleDocumentExportTzs || 5000,
            semesterPassTzs: d.pricing.semesterPassTzs || 15000,
            studentMonthlyTzs: d.pricing.studentMonthlyTzs || 10000,
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleOpenCheckout = (planId: string, planName: string, amount: number) => {
    setSelectedPlan({ id: planId, name: planName, amount });
    setShowCheckout(true);
  };

  const faqs = [
    {
      q: "Can I generate and preview my report for free before paying?",
      a: "Yes! UniReportTZ provides 100% free report generation and full on-screen proof preview across all 22 Tanzanian universities. You can review all chapters, customize your outline, and edit your practical evidence without paying a single shilling. You only pay TZS 5,000 when you are satisfied with the draft and wish to download the official, unwatermarked PDF or Word (.docx) document."
    },
    {
      q: "How does the mobile money payment work?",
      a: "When you click 'Unlock & Download', select your mobile operator (Vodacom M-Pesa, Tigo Pesa, Airtel Money, or HaloPesa) and enter your 10-digit phone number. A secure USSD push prompt will appear directly on your phone screen. Enter your secret PIN to authorize the payment. Once confirmed, your document unlocks instantly and the download begins automatically."
    },
    {
      q: "What is the difference between Single Report Unlock and the Semester Pass?",
      a: "The Single Report Unlock (TZS 5,000) unlocks one specific document permanently with lifetime re-download and editing access. The Semester All-Access Pass (TZS 15,000) gives you unlimited downloads for all documents across all 4 generators (Field Practical Training, Final Year Project Dissertation, Lab Reports, and Coursework) for a full 6-month academic semester."
    },
    {
      q: "Can I re-download my document later if I make edits?",
      a: "Absolutely. Once a document is unlocked, it remains permanently accessible in your student dashboard. You can re-open it, refine your logbook notes, update figures, and re-download fresh PDF or Word copies at any time without paying again."
    },
    {
      q: "Are CRDB SimBanking, NMB Direct, and Visa/Mastercard supported?",
      a: "Yes. In addition to all 4 Tanzanian mobile networks, we accept CRDB SimBanking, NMB Direct/Wakala transfers, and international Visa/Mastercard bank cards for students or supervisors paying with payment cards."
    },
    {
      q: "Does the output match my university's official submission guidelines?",
      a: "Yes. Our engine incorporates official formatting blueprints for 22 Tanzanian higher learning institutions (UDSM, DIT, MUST, SUA, UDOM, ARU, OUT, SUZA, TIA, SAUT, SJUIT, TUMAINI, UAUT, HKMU, KCMUCo, MoCU, MU, and more), adhering to TCU standards with authentic cover pages, preliminary declarations, and grading rubrics."
    }
  ];

  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
        
        {/* HERO SECTION */}
        <section className="py-16 md:py-24 text-center px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-gradient opacity-10 pointer-events-none" />
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight mb-6">
              Free to Generate. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">
                Pay Only When You Download.
              </span>
            </h1>

            <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
              Generate and inspect full 10–20 page reports matching your university's official format on screen for <strong>TZS 0</strong>. Unlock defense-ready PDF & Word exports with instant mobile money.
            </p>

            {/* TRUST BADGES BAR */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-slate-600 dark:text-slate-400 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border shadow-2xs font-medium">
                <CheckCircle2 className="size-3.5 text-teal-600" /> Free On-Screen Proof Preview
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border shadow-2xs font-medium">
                <CheckCircle2 className="size-3.5 text-teal-600" /> Instant M-Pesa & Tigo Pesa USSD
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border shadow-2xs font-medium">
                <CheckCircle2 className="size-3.5 text-teal-600" /> Lifetime Re-Download Access
              </span>
            </div>
          </div>
        </section>

        {/* PRICING TIERS GRID */}
        <section className="pb-20 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              
              {/* CARD 1: FREE CORE */}
              <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Free Preview</h3>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      Proof Mode
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Inspect your full report on screen before committing any funds.
                  </p>
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">TZS 0</span>
                    <span className="text-xs text-muted-foreground ml-1.5 font-normal">/ permanent</span>
                  </div>

                  <ul className="space-y-3 mb-8 text-sm">
                    {[
                      "Full report generation across all 22 universities",
                      "Complete on-screen draft inspection",
                      "Customize chapters & table of contents outline",
                      "Add practical logbook activities & equipment",
                      "Watermarked proof draft view"
                    ].map((ft, i) => (
                      <li key={i} className="flex gap-2.5 items-start">
                        <CheckCircle2 className="size-4 text-teal-600 shrink-0 mt-0.5" />
                        <span className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">{ft}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href="/register" className="w-full">
                  <Button variant="outline" className="w-full py-5 rounded-2xl text-xs font-bold border-slate-300 dark:border-slate-700">
                    Start Generating Free
                  </Button>
                </Link>
              </div>

              {/* CARD 2: SINGLE REPORT UNLOCK (HERO TIER) */}
              <div className="p-7 rounded-3xl bg-gradient-to-b from-teal-900 to-slate-900 text-white border-2 border-teal-500 shadow-2xl relative flex flex-col justify-between transform md:-translate-y-2">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[11px] font-extrabold px-3.5 py-1 rounded-full shadow-md tracking-wider uppercase flex items-center gap-1">
                  <Sparkles className="size-3 fill-current" /> Most Popular Choice
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2 pt-2">
                    <h3 className="text-xl font-bold text-white">Single Report Unlock</h3>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-800/80 text-teal-200">
                      One-Time
                    </span>
                  </div>
                  <p className="text-xs text-teal-200/90 mb-4">
                    Ideal for students completing their industrial attachment or single course paper.
                  </p>
                  <div className="mb-6">
                    <span className="text-4xl font-black text-white">
                      TZS {new Intl.NumberFormat("en-TZ").format(pricingConfig.singleDocumentExportTzs)}
                    </span>
                    <span className="text-xs text-teal-300 ml-1.5 font-normal">/ document</span>
                  </div>

                  <ul className="space-y-3 mb-8 text-sm">
                    {[
                      "Watermark permanently removed",
                      "Official university cover page & signature blocks",
                      "Clean PDF & editable Word (.docx) downloads",
                      "Full clipboard copying & text export unlocked",
                      "Lifetime re-download access from dashboard",
                      "Instant activation via M-Pesa, Tigo Pesa, Airtel",
                      "Zero recurring monthly charges"
                    ].map((ft, i) => (
                      <li key={i} className="flex gap-2.5 items-start">
                        <CheckCircle2 className="size-4 text-teal-400 shrink-0 mt-0.5" />
                        <span className="text-slate-100 text-xs leading-relaxed font-medium">{ft}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <Button 
                    onClick={() => handleOpenCheckout("STUDENT", "Single Report Unlock", pricingConfig.singleDocumentExportTzs)}
                    className="w-full py-5 rounded-2xl text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-lg hover:shadow-teal-500/25 transition gap-1.5"
                  >
                    Unlock Single Report (TZS 5,000)
                    <ArrowRight className="size-3.5" />
                  </Button>
                  <p className="text-[10px] text-center text-teal-300/80 mt-2 font-mono">
                    USSD push sent to phone • Instant download
                  </p>
                </div>
              </div>

              {/* CARD 3: SEMESTER ALL-ACCESS PASS */}
              <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border-2 border-teal-600/40 dark:border-teal-500/30 shadow-md flex flex-col justify-between hover:border-teal-600 transition">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Semester Pass</h3>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                      Best Value
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    For final-year & postgraduate students doing Fieldwork + FYP thesis + Labs.
                  </p>
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                      TZS {new Intl.NumberFormat("en-TZ").format(pricingConfig.semesterPassTzs)}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1.5 font-normal">/ semester (6 mo)</span>
                  </div>

                  <ul className="space-y-3 mb-8 text-sm">
                    {[
                      "Unlimited downloads across all 4 report tools",
                      "Field Reports + FYP Thesis + Labs + Coursework",
                      "Advanced IEEE, APA 7th & Vancouver citations",
                      "AI drafting & professional notes polishing",
                      "Defense preparation checklist & rubrics",
                      "Priority AI generation speed & no token limits",
                      "Full 6-month uninterrupted access"
                    ].map((ft, i) => (
                      <li key={i} className="flex gap-2.5 items-start">
                        <CheckCircle2 className="size-4 text-teal-600 shrink-0 mt-0.5" />
                        <span className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">{ft}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  onClick={() => handleOpenCheckout("PRO", "Semester All-Access Pass", pricingConfig.semesterPassTzs)}
                  variant="default" 
                  className="w-full py-5 rounded-2xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md gap-1.5"
                >
                  Get Semester Pass (TZS 15,000)
                  <Zap className="size-3.5 fill-current" />
                </Button>
              </div>

              {/* CARD 4: INSTITUTIONAL & DEPARTMENT */}
              <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Institutional</h3>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      Colleges & Labs
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    For departments, faculties, and university research laboratories.
                  </p>
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">Custom</span>
                    <span className="text-xs text-muted-foreground ml-1.5 font-normal">/ volume license</span>
                  </div>

                  <ul className="space-y-3 mb-8 text-sm">
                    {[
                      "Unlimited student & supervisor seats",
                      "Custom departmental guidelines pre-loaded",
                      "Supervisor grading rubrics & audit dashboard",
                      "Anti-plagiarism & citation verification API",
                      "Dedicated SLA, training & institutional billing"
                    ].map((ft, i) => (
                      <li key={i} className="flex gap-2.5 items-start">
                        <CheckCircle2 className="size-4 text-teal-600 shrink-0 mt-0.5" />
                        <span className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">{ft}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href="/contact" className="w-full">
                  <Button variant="outline" className="w-full py-5 rounded-2xl text-xs font-bold border-slate-300 dark:border-slate-700">
                    Contact Faculty Sales
                  </Button>
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* PAYMENT METHODS & SUPPORT FOOTER BAR */}
        <section className="py-10 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  Supported Payment Channels in Tanzania
                </h4>
                <p className="text-xs text-muted-foreground">
                  Instant automated activation with zero manual delays.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border text-xs font-bold text-slate-700 dark:text-slate-200">
                  Vodacom M-Pesa
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border text-xs font-bold text-slate-700 dark:text-slate-200">
                  Tigo Pesa
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border text-xs font-bold text-slate-700 dark:text-slate-200">
                  Airtel Money
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border text-xs font-bold text-slate-700 dark:text-slate-200">
                  HaloPesa
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs font-bold text-teal-700 dark:text-teal-300">
                  CRDB SimBanking
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs font-bold text-teal-700 dark:text-teal-300">
                  NMB Direct
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border text-xs font-bold text-slate-700 dark:text-slate-200">
                  Visa / Mastercard
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-teal-600" /> 256-bit TLS Encrypted Transactions
              </span>
              <span>•</span>
              <span>Direct Student Support Hotline:</span>
              <a href="tel:+255627204980" className="text-teal-600 dark:text-teal-400 font-mono font-bold hover:underline">
                0627 204 980
              </a>
              <span>/</span>
              <a href="tel:+255747461380" className="text-teal-600 dark:text-teal-400 font-mono font-bold hover:underline">
                0747 461 380
              </a>
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-slate-900 dark:text-white mb-2">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-muted-foreground">
                Everything you need to know about report generation, previewing, and mobile money downloads.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div 
                    key={idx}
                    className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden transition"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-slate-900 dark:text-white"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="size-4 text-teal-600 shrink-0" />
                      ) : (
                        <ChevronDown className="size-4 text-muted-foreground shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <p className="text-xs text-muted-foreground mb-4">
                Have questions before starting your report? Reach out to our academic support team.
              </p>
              <Link href="/contact">
                <Button variant="outline" size="sm" className="rounded-xl text-xs font-semibold">
                  Contact Academic Support
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Checkout Modal */}
      {showCheckout && (
        <TzPaymentGateway 
          planName={selectedPlan.name}
          planId={selectedPlan.id}
          amount={selectedPlan.amount}
          onSuccess={() => {
            setShowCheckout(false);
            window.location.href = "/dashboard";
          }}
          onCancel={() => setShowCheckout(false)}
        />
      )}

      <Footer />
    </>
  );
}
