import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Library,
  FileText,
  BookOpen,
  Download,
  ArrowRight,
  Sparkles,
  Layers,
  GraduationCap,
  BookmarkCheck,
  CheckCircle2
} from "lucide-react";

export const metadata: Metadata = {
  title: "Academic Resource Library | UniReportTZ",
  description: "Browse standardized report templates, citation style guides, and thesis blueprints designed for Tanzanian higher education institutions.",
};

const RESOURCES = [
  {
    category: "Report Templates",
    title: "Standard Practical Fieldwork / IPT Report Template",
    desc: "Complete 4-chapter structure covering organizational profile, technical tasks, attachment challenges, and conclusions according to TCU guidelines.",
    format: "PDF & DOCX Ready",
    toolLink: "/dashboard/tools/field-report",
    badge: "Most Popular"
  },
  {
    category: "Dissertation Frameworks",
    title: "Final Year Project (FYP) Engineering & Computer Science",
    desc: "5-chapter blueprint including problem formulation, literature matrix, methodology, system architectural design, and experimental evaluation.",
    format: "IEEE & APA Formatted",
    toolLink: "/dashboard/tools/fyp-generator",
    badge: "50-70 Pages"
  },
  {
    category: "Citation Standards",
    title: "APA 7th Edition & IEEE Citation Quick Reference",
    desc: "Rules and examples for citing journal articles, Tanzanian government gazettes, NBS datasets, and conference proceedings.",
    format: "Style Guide",
    toolLink: "/dashboard/tools/citation-machine",
    badge: "Academic Standard"
  },
  {
    category: "Literature Review",
    title: "Thematic Literature Synthesis & Gap Matrix",
    desc: "Methodological framework for grouping empirical literature by themes, identifying research gaps, and establishing conceptual frameworks.",
    format: "Synthesis Blueprint",
    toolLink: "/dashboard/tools/lit-review",
    badge: "Research Tool"
  },
  {
    category: "Executive Documents",
    title: "Dissertation Abstract & Executive Summary Guide",
    desc: "Standard 250-word structured academic abstract framework covering context, objective, methods, key findings, and practical implications.",
    format: "Writing Guide",
    toolLink: "/dashboard/tools/abstract-generator",
    badge: "Instant Draft"
  },
  {
    category: "Research Methodology",
    title: "Qualitative & Quantitative Research Design Rubric",
    desc: "Comprehensive sampling techniques, data collection instruments, and statistical reliability guidelines for university dissertations.",
    format: "Methodology Guide",
    toolLink: "/dashboard/tools/methodology",
    badge: "TCU Aligned"
  }
];

export default function LibraryPage() {
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
        
        {/* HERO SECTION */}
        <section className="relative pt-16 pb-20 bg-slate-900 text-white overflow-hidden border-b border-slate-800">
          <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:32px_32px]" />
          <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-teal-400 uppercase mb-6">
              <Library className="size-4" /> KNOWLEDGE & TEMPLATES REPOSITORY
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading leading-tight mb-4">
              Academic Resource Library
            </h1>
            <p className="text-base text-slate-300 max-w-2xl mx-auto">
              Access standardized academic templates, citation style guides, and thesis frameworks built around Tanzanian university specifications.
            </p>
          </div>
        </section>

        {/* RESOURCE CARDS */}
        <section className="py-16 px-4 md:px-6 container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {RESOURCES.map((item, idx) => (
              <div 
                key={idx} 
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                      {item.category}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">{item.format}</span>
                  <Link href={item.toolLink}>
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white text-xs gap-1.5 shadow-sm">
                      Open Tool <ArrowRight className="size-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* CALLOUT BANNER */}
          <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-teal-800/40">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl font-bold font-heading">Need a Custom Departmental Template?</h3>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                If your university faculty has unique formatting or margin guidelines not featured here, upload your PDF rubric or guideline document into our AI wizard.
              </p>
            </div>
            <Link href="/dashboard/create" className="shrink-0">
              <Button size="lg" className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold border-none shadow-lg">
                Upload Custom Guide <Sparkles className="size-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
