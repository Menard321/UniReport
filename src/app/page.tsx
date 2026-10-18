"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  BookOpenText, 
  CheckCircle2, 
  ShieldCheck, 
  GraduationCap, 
  Building2, 
  Library, 
  ScrollText,
  Sparkles,
  Layers,
  FileCheck2,
  Stethoscope,
  Briefcase,
  Compass,
  Check,
  ChevronRight,
  Quote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TANZANIA_ACADEMIC_CATALOG } from "@/data/tanzania-academic-catalog";

const REPORT_CAROUSEL_ITEMS = [
  {
    discipline: "Engineering & Technology",
    title: "Final Year Project (FYP)",
    institution: "UDSM / DIT / MUST Standard",
    badge: "Hardware & Software",
    desc: "Rigorous methodology with circuit schematics, system architecture, and empirical test matrices.",
    gradient: "from-blue-600/10 via-indigo-600/10 to-teal-500/10 border-blue-500/30",
    tagColor: "text-blue-400 bg-blue-500/10 border-blue-500/20"
  },
  {
    discipline: "Practical Training",
    title: "Industrial Field Attachment",
    institution: "8-Week Carrier Standard",
    badge: "Weekly Logbooks",
    desc: "Daily task activity logs, supervisor sign-offs, and industrial challenge evaluations.",
    gradient: "from-teal-600/10 via-emerald-600/10 to-cyan-500/10 border-teal-500/30",
    tagColor: "text-teal-400 bg-teal-500/10 border-teal-500/20"
  },
  {
    discipline: "Health & Allied Sciences",
    title: "Clinical Case Study & Log",
    institution: "MUHAS / UDOM Standard",
    badge: "Patient Case History",
    desc: "Structured diagnostic criteria, clinical findings, pharmacotherapy logs, and ethical clearance.",
    gradient: "from-rose-600/10 via-pink-600/10 to-purple-500/10 border-rose-500/30",
    tagColor: "text-rose-400 bg-rose-500/10 border-rose-500/20"
  },
  {
    discipline: "Education & Pedagogy",
    title: "Teaching Practice Portfolio",
    institution: "DUCE / UDOM / SUA Standard",
    badge: "Lesson Plan Matrix",
    desc: "Bloom's taxonomy lesson plans, classroom management reflections, and assessment rubrics.",
    gradient: "from-amber-600/10 via-orange-600/10 to-yellow-500/10 border-amber-500/30",
    tagColor: "text-amber-400 bg-amber-500/10 border-amber-500/20"
  },
  {
    discipline: "Business & Economics",
    title: "Research Proposal & Feasibility",
    institution: "CBE / IFM / IAA Standard",
    badge: "Financial Models",
    desc: "Capital budgeting, NPV/IRR computations, market demand analysis, and APA7 references.",
    gradient: "from-purple-600/10 via-violet-600/10 to-indigo-500/10 border-purple-500/30",
    tagColor: "text-purple-400 bg-purple-500/10 border-purple-500/20"
  },
  {
    discipline: "Computing & Data Sciences",
    title: "Algorithm Benchmarking & Lab",
    institution: "IEEE Conference Format",
    badge: "Complexity & Graphs",
    desc: "Big-O runtime analysis, experimental dataset evaluations, and reproducible code references.",
    gradient: "from-cyan-600/10 via-blue-600/10 to-teal-500/10 border-cyan-500/30",
    tagColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
  }
];

const TESTIMONIAL_ITEMS = [
  { student: "Neema Mwangi", uni: "UDSM (CoICT)", text: "Formatted my entire 80-page computer science dissertation to faculty guidelines in minutes.", role: "BSc Computer Science" },
  { student: "Baraka Juma", uni: "DIT (Civil Eng)", text: "The structural calculation tables and bending moment outputs passed external defense with zero revisions.", role: "BEng Civil" },
  { student: "Dr. L. Mushi", uni: "UDOM", text: "Finally an academic platform that respects Tanzanian institutional preliminary page formatting.", role: "Lecturer & Supervisor" },
  { student: "Amina Kassim", uni: "MUHAS", text: "The clinical case study logbook structure saved me two full weeks of manual formatting.", role: "Doctor of Medicine" },
  { student: "Kelvin Shirima", uni: "SUA (Agriculture)", text: "Generated ANOVA tables and field trial evaluations adhering strictly to faculty standards.", role: "BSc Agronomy" },
  { student: "Hellen Mosha", uni: "IFM (Finance)", text: "Capital budgeting calculations with live financial ratios directly integrated into my thesis.", role: "BSc Banking & Finance" }
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 4500);
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col min-h-screen" suppressHydrationWarning>
        
        {/* HERO SECTION */}
        <section 
          className="relative pt-24 pb-32 overflow-hidden border-b border-border/40 bg-cover bg-center bg-no-repeat bg-slate-50 dark:bg-slate-950"
          style={{ backgroundImage: "url('/logos/background.jpeg')" }}
          suppressHydrationWarning
        >
          {/* Subtle soft background tint for optimal text contrast */}
          <div className="absolute inset-0 bg-white/40 dark:bg-slate-950/70 pointer-events-none" />
          
          <div className="container px-4 md:px-6 relative z-10 mx-auto text-center max-w-4xl">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mb-6 font-heading text-primary dark:text-white">
                Academic Reports, <br /> Built Around Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-400 dark:from-teal-400 dark:to-teal-200">University.</span>
              </h1>
              <p className="mt-6 text-lg tracking-tight text-muted-foreground max-w-2xl mx-auto md:text-xl">
                The AI-powered academic workspace that respects your university's formatting, verifies every citation, and puts academic accuracy before writing speed.
              </p>
              
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register">
                  <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base shadow-lg hover:shadow-xl transition-all" variant="accent">
                    Create Your Report
                    <ArrowRight className="ml-2 size-5" />
                  </Button>
                </Link>
                <Link href="/features">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                    Explore Features
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* DUAL-DIRECTION UNIVERSITIES & TESTIMONIALS HORIZONTAL MARQUEE */}
        <section className="border-t border-b border-border/40 bg-slate-50/50 dark:bg-slate-900/20 py-10 overflow-hidden space-y-6">
          <div className="container mx-auto px-4 text-center">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Trusted Across Higher Learning Institutions in Tanzania
            </p>
          </div>

          {/* Row 1: Leftward Scrolling University Logos */}
          <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
            <div className="group flex overflow-hidden p-1 [--gap:1.5rem] [--duration:60s]">
              <div className="flex shrink-0 justify-around gap-8 md:gap-12 animate-marquee-track">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <div key={idx} className="flex shrink-0 gap-8 md:gap-12 items-center">
                    {TANZANIA_ACADEMIC_CATALOG.map((item, i) => (
                      <Link
                        key={i}
                        href="/universities"
                        className="flex flex-col items-center gap-1.5 hover:scale-110 transition-transform duration-300 cursor-pointer group/uni"
                      >
                        <img 
                          src={item.logoUrl}
                          alt={`${item.shortName} Official Logo`}
                          className="w-14 h-14 md:w-16 md:h-16 object-contain shadow-sm rounded-xl bg-white dark:bg-slate-950 p-1 border border-border/80 group-hover/uni:border-teal-500/60 transition-colors" 
                        />
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 group-hover/uni:text-teal-600 dark:group-hover/uni:text-teal-400 transition-colors">
                          {item.shortName}
                        </span>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Rightward (Reverse) Scrolling Testimonials Ticker */}
          <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
            <div className="group flex overflow-hidden p-1 [--gap:1.5rem] [--duration:48s]">
              <div className="flex shrink-0 justify-around gap-6 animate-marquee-reverse-track">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <div key={idx} className="flex shrink-0 gap-6 items-center">
                    {TESTIMONIAL_ITEMS.map((item, i) => (
                      <div 
                        key={i} 
                        className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-teal-500/50 transition-colors cursor-default whitespace-nowrap"
                      >
                        <Quote className="size-3.5 text-teal-600 shrink-0 opacity-70" />
                        <span className="text-xs text-foreground font-medium max-w-sm truncate">
                          "{item.text}"
                        </span>
                        <div className="flex items-center gap-1.5 border-l border-border pl-2.5">
                          <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400">{item.student}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">({item.uni})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <style dangerouslySetInnerHTML={{__html: `
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(calc(-50% - var(--gap)/2)); }
            }
            @keyframes marquee_reverse {
              0% { transform: translateX(calc(-50% - var(--gap)/2)); }
              100% { transform: translateX(0); }
            }
            @keyframes marquee_carousel {
              0% { transform: translateX(0); }
              100% { transform: translateX(calc(-50% - 1rem)); }
            }
            .animate-marquee-track {
              animation: marquee 42s linear infinite;
            }
            .animate-marquee-reverse-track {
              animation: marquee_reverse 48s linear infinite;
            }
            .animate-marquee-carousel-track {
              animation: marquee_carousel 38s linear infinite;
            }
            @media (hover: hover) {
              .animate-marquee-track:hover,
              .animate-marquee-reverse-track:hover,
              .animate-marquee-carousel-track:hover {
                animation-play-state: paused;
              }
            }
            @media (prefers-reduced-motion: reduce) {
              .animate-marquee-track,
              .animate-marquee-reverse-track,
              .animate-marquee-carousel-track {
                animation-play-state: paused;
              }
            }
          `}} />
        </section>

        {/* HOW IT WORKS SECTION — INTERACTIVE HORIZONTAL STEP PROGRESSION */}
        <section className="py-20 md:py-28 bg-white dark:bg-slate-950 px-4 md:px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-3">
                <Sparkles className="size-3.5 text-teal-600" />
                <span>Deterministic Lifecycle Execution</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-3 text-primary dark:text-white">
                How UniReportTZ Works
              </h2>
              <p className="text-muted-foreground text-base max-w-xl mx-auto">
                A guided, intelligent research workflow designed around Tanzanian university formats.
              </p>
            </div>

            {/* Horizontal Interactive Step Navigation Bar */}
            <div className="relative mb-12">
              <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-teal-500 to-indigo-600 transition-all duration-700 ease-out"
                  style={{ width: `${(activeStep / 3) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 relative z-10">
                {[
                  { step: "01", title: "Requirements", label: "Institution & Guide" },
                  { step: "02", title: "Evidence Data", label: "Upload & Methodology" },
                  { step: "03", title: "AI Drafting", label: "Citations & Checks" },
                  { step: "04", title: "Validated Export", label: "DOCX & Verified PDF" }
                ].map((item, idx) => {
                  const isActive = activeStep === idx;
                  const isPassed = activeStep > idx;

                  return (
                    <button
                      key={item.step}
                      type="button"
                      onClick={() => setActiveStep(idx)}
                      className={`flex flex-col items-center p-3 rounded-2xl border text-center transition-all duration-300 ${
                        isActive
                          ? "bg-white dark:bg-slate-900 border-teal-500 shadow-lg shadow-teal-500/10 scale-105"
                          : isPassed
                            ? "bg-slate-50 dark:bg-slate-900/60 border-teal-500/40 opacity-90"
                            : "bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold font-mono mb-1.5 transition-colors ${
                        isActive
                          ? "bg-teal-600 text-white shadow-md shadow-teal-600/30"
                          : isPassed
                            ? "bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300"
                            : "bg-slate-200 dark:bg-slate-800 text-muted-foreground"
                      }`}>
                        {isPassed ? <Check className="size-3.5" /> : item.step}
                      </div>
                      <span className="text-xs font-bold text-foreground">{item.title}</span>
                      <span className="text-[10px] text-muted-foreground hidden sm:block">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Step Horizontal Animated Showcase Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-6 md:p-10 shadow-2xl text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-mono font-semibold border border-teal-500/30">
                    Phase 0{activeStep + 1} of 04
                  </div>

                  {activeStep === 0 && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-left-4 duration-300">
                      <h3 className="text-2xl font-bold font-heading">Institutional Requirements Alignment</h3>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        Select your university from our verified Tanzania catalog (UDSM, UDOM, SUA, DIT, CBE, IFM). The engine adapts cover pages, required preliminary sections, font specifications, and referencing guidelines (APA7, IEEE, Harvard).
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">✓ Verified Cover Page</span>
                        <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">✓ Roman Numeral Prelims</span>
                        <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">✓ Department Guidelines</span>
                      </div>
                    </div>
                  )}

                  {activeStep === 1 && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-left-4 duration-300">
                      <h3 className="text-2xl font-bold font-heading">Evidence & Research Input Ingestion</h3>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        Upload your approved project proposal, experimental datasets, field logbook notes, or survey responses. UniReportTZ uses Retrieval-Augmented Generation (RAG) strictly anchored to your data.
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-teal-900/40 text-teal-300 border border-teal-700/50">✓ Zero Hallucination Mode</span>
                        <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">✓ CSV/Excel & PDF Ingestion</span>
                        <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">✓ Primary Research Anchor</span>
                      </div>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-left-4 duration-300">
                      <h3 className="text-2xl font-bold font-heading">Deterministic Drafting & Live Verification</h3>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        The engine writes with discipline-specific rigor while executing real mathematical computations (Euler beam deflection, ANOVA, capital budgeting NPV, Big-O algorithm analysis). Live citation checks query Crossref & OpenAlex for verified DOIs.
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-indigo-900/40 text-indigo-300 border border-indigo-700/50">✓ Crossref Verified DOIs</span>
                        <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">✓ Deterministic Math Engine</span>
                        <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">✓ Academic Terminology</span>
                      </div>
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-left-4 duration-300">
                      <h3 className="text-2xl font-bold font-heading">Compliance Audit & Publication Export</h3>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        Our multi-tier Compliance Auditor verifies font size, 1.5 line spacing, 1-inch margins, preliminary page numbering, and table caption standards before generating publication-grade DOCX and print-ready PDF files.
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-emerald-900/40 text-emerald-300 border border-emerald-700/50">✓ 100% Guideline Audit</span>
                        <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">✓ Perfect DOCX Hierarchy</span>
                        <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">✓ Print-Ready PDF</span>
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <Link href="/auth/register">
                      <Button variant="accent" size="sm" className="font-semibold shadow-md">
                        Try Step 0{activeStep + 1} in Workspace
                        <ArrowRight className="ml-1.5 size-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Interactive Mock Preview Box */}
                <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4 shadow-inner text-xs font-mono space-y-2">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-teal-500 animate-pulse" />
                      Execution Monitor
                    </span>
                    <span>Tanzania Standard Engine</span>
                  </div>

                  {activeStep === 0 && (
                    <div className="space-y-1.5 text-slate-300 pt-1">
                      <p className="text-teal-400 font-bold">&gt; Target: University of Dar es Salaam (UDSM)</p>
                      <p>&gt; Faculty: College of Information & Comm. Tech (CoICT)</p>
                      <p>&gt; Referencing: IEEE Transactions Standard</p>
                      <p>&gt; Binding Spec: 40mm Left Margin, 25mm Right/Top/Bottom</p>
                      <p className="text-emerald-400">&gt; Status: Institutional Guideline Template Active</p>
                    </div>
                  )}

                  {activeStep === 1 && (
                    <div className="space-y-1.5 text-slate-300 pt-1">
                      <p className="text-teal-400 font-bold">&gt; Ingesting Proposal & Field Data...</p>
                      <p>&gt; Parsed: 14 Interview Transcripts + 1 Raw Dataset</p>
                      <p>&gt; Knowledge Chunks: 124 Vectorized Tokens</p>
                      <p>&gt; Evidence Constraint: Hallucination Penalty = MAX</p>
                      <p className="text-emerald-400">&gt; Status: Grounding Index Ready</p>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div className="space-y-1.5 text-slate-300 pt-1">
                      <p className="text-teal-400 font-bold">&gt; Synthesizing Chapter 4: Data Presentation</p>
                      <p>&gt; Computing: Chi-Square Test & p-value (p = 0.018)</p>
                      <p>&gt; Crossref Check: "Mushi et al., 2023" &rarr; Validated DOI</p>
                      <p>&gt; Generated: Figure 4.1 Architecture Flowchart (SVG)</p>
                      <p className="text-emerald-400">&gt; Status: Academic Rigor Score = 98.4%</p>
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div className="space-y-1.5 text-slate-300 pt-1">
                      <p className="text-teal-400 font-bold">&gt; Running Multi-Tier Compliance Audit...</p>
                      <p>&gt; Margins Check: PASS (1.5" Left, 1.0" Right)</p>
                      <p>&gt; Prelims Check: PASS (i - viii Roman Numeral)</p>
                      <p>&gt; Exporting: Microsoft Word (.docx) + Vector PDF</p>
                      <p className="text-emerald-400">&gt; Status: Approved for Department Submission</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MULTI-DISCIPLINE REPORT TYPES HORIZONTAL CAROUSEL */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900/60 border-t border-border/40 overflow-hidden">
          <div className="container mx-auto px-4 md:px-6 mb-10 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary dark:text-teal-400 text-xs font-bold mb-3">
              <Layers className="size-3.5" />
              <span>Multi-Discipline Engine</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-primary dark:text-white mb-3">
              Built for Every Tanzanian Academic Discipline
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              From engineering hardware projects to medical clinical logs and teaching portfolios. Hover to inspect.
            </p>
          </div>

          {/* Infinite Horizontal Carousel Track */}
          <div className="relative w-full overflow-hidden">
            <div className="group flex overflow-hidden p-2 [--gap:1.5rem]">
              <div className="flex shrink-0 gap-6 animate-marquee-carousel-track">
                {Array.from({ length: 2 }).map((_, loopIdx) => (
                  <div key={loopIdx} className="flex shrink-0 gap-6">
                    {REPORT_CAROUSEL_ITEMS.map((item, i) => (
                      <div
                        key={i}
                        className={`w-80 md:w-96 rounded-2xl p-6 bg-white dark:bg-slate-900 border ${item.gradient} shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className={`text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded-full border ${item.tagColor}`}>
                              {item.discipline}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {item.badge}
                            </span>
                          </div>

                          <h3 className="text-lg font-bold font-heading text-foreground mb-1.5">
                            {item.title}
                          </h3>

                          <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 mb-3">
                            {item.institution}
                          </p>

                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {item.desc}
                          </p>
                        </div>

                        <div className="pt-5 mt-5 border-t border-border/60 flex items-center justify-between text-xs font-semibold">
                          <span className="text-primary dark:text-teal-400 flex items-center gap-1 group-hover:underline">
                            Start With Template
                            <ChevronRight className="size-3.5" />
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            Auto-Formatted
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* EVIDENCE BASED REPORTING */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900 px-4 md:px-6 border-y border-border/50">
          <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center rounded-lg bg-red-100/50 dark:bg-red-900/20 px-3 py-1 text-sm font-medium text-red-800 dark:text-red-400 mb-6">
                <ShieldCheck className="size-4 mr-2" /> Academic Integrity First
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6 text-primary dark:text-white">Evidence-based generation, not fabricated information.</h2>
              <p className="text-lg text-muted-foreground mb-8">
                UniReportTZ is not a generic chatbot. We prevent hallucinations through strict Retrieval-Augmented Generation (RAG). Every generated paragraph must be backed by scholarly sources or your uploaded evidence.
              </p>
              
              <ul className="space-y-4">
                {["Live Citation Verification via Crossref/OpenAlex", "Detects unsupported claims instantly", "Prevents model hallucination of experimental data"].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="size-6 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl bg-white dark:bg-slate-950 p-6 flex flex-col gap-4 transition-all duration-300 hover:shadow-teal-500/10 hover:border-teal-500/30">
               {/* Mock UI Preview */}
               <div className="flex border-b border-border pb-4 items-center justify-between">
                 <h4 className="font-semibold flex items-center gap-2"><ScrollText className="size-4 text-teal-600" /> Literature Review</h4>
                 <span className="text-xs font-mono bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-400 px-2 py-1 rounded">100% Verified Citations</span>
               </div>
               <div className="space-y-3 text-sm text-muted-foreground pb-4 relative">
                 <p className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">Recent studies demonstrate that the adoption of e-learning platforms in Tanzanian universities significantly improves student engagement <span className="text-teal-600 font-medium">(Mushi et al., 2023)</span>.</p>
                 <div className="absolute right-0 top-1 mr-4 mt-2 px-2 py-1 bg-white border shadow text-xs rounded text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                    ✓ DOI: 10.1234/edu.tz.2023
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* SUPPORTED REPORTS & UNIVERSITIES */}
        <section className="py-24 px-4 md:px-6">
          <div className="container mx-auto">
             <h2 className="text-3xl font-bold font-heading text-center mb-16 text-primary dark:text-white">Supporting the Complete Academic Lifecycle</h2>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="group p-8 border border-border/80 rounded-2xl bg-white dark:bg-slate-900/60 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/50 motion-reduce:hover:transform-none">
                 <BookOpenText className="size-10 text-primary mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3" />
                 <h3 className="text-xl font-bold mb-3 transition-colors duration-200 group-hover:text-primary dark:group-hover:text-teal-400">Undergraduate Projects</h3>
                 <p className="text-muted-foreground">From initial research proposals to the final bound dissertation, adhering perfectly to your department's format.</p>
               </div>
               <div className="group p-8 border border-border/80 rounded-2xl bg-white dark:bg-slate-900/60 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-teal-500/5 hover:border-teal-500/50 motion-reduce:hover:transform-none">
                 <Building2 className="size-10 text-teal-600 mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
                 <h3 className="text-xl font-bold mb-3 transition-colors duration-200 group-hover:text-teal-600 dark:group-hover:text-teal-400">Field & Training Reports</h3>
                 <p className="text-muted-foreground">Log daily activities effortlessly and compile them into structured internship or industrial training reports.</p>
               </div>
               <div className="group p-8 border border-border/80 rounded-2xl bg-white dark:bg-slate-900/60 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-500/5 hover:border-amber-500/50 motion-reduce:hover:transform-none">
                 <Library className="size-10 text-[#F59E0B] mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3" />
                 <h3 className="text-xl font-bold mb-3 transition-colors duration-200 group-hover:text-amber-600 dark:group-hover:text-amber-400">Postgrad Research</h3>
                 <p className="text-muted-foreground">Advanced qualitative and quantitative analysis workspaces designed specifically for Masters and PhD scholars.</p>
               </div>
             </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 md:px-6 bg-primary text-white text-center">
           <div className="container mx-auto max-w-3xl">
             <GraduationCap className="size-16 mx-auto mb-8 opacity-90 text-teal-400" />
             <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 tracking-tight">Stop Formatting. Start Writing.</h2>
             <p className="text-lg md:text-xl text-primary-foreground/80 mb-10">Join students from all universities and higher learning institutions across Tanzania in writing smarter, publication-grade academic reports.</p>
             <Link href="/auth/register">
               <Button size="lg" className="h-14 px-10 text-lg bg-teal-500 hover:bg-teal-400 text-slate-900 border-none shadow-xl">
                 Create Your Account
               </Button>
             </Link>
           </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
