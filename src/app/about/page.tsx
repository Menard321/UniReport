import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Target, 
  Compass, 
  Award, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  Zap, 
  FileText, 
  UploadCloud, 
  LayoutList, 
  FileCheck2, 
  Download,
  ExternalLink,
  ChevronRight
} from "lucide-react";

export const metadata: Metadata = {
  title: "About UniReportTZ | Academic Reporting, Built Around Your University",
  description: "Discover how UniReportTZ supports structured academic reporting through AI-assisted writing, document formatting, research organization, and responsible academic practices.",
  openGraph: {
    title: "About UniReportTZ",
    description: "Academic Reports, Built Around Your University.",
    images: ["/logos/libray.jpeg"],
  },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col min-h-screen bg-white dark:bg-slate-950">
        
        {/* SECTION B: HERO */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden bg-slate-900 text-white">
          {/* Subtle Background Mesh */}
          <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:32px_32px]" />
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Copy */}
              <div className="lg:col-span-6 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-teal-400 uppercase">
                  ABOUT UNIREPORTTZ
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-tight">
                  Academic Reporting, <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-200">
                    Reimagined for Every Student.
                  </span>
                </h1>
                
                <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                  UniReportTZ helps students and researchers organize their ideas, develop detailed academic reports, and prepare documents around their institution's requirements through a guided, AI-assisted reporting workflow.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                  <Link href="/features">
                    <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base shadow-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold border-none">
                      Explore the Platform <ArrowRight className="ml-2 size-4" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base border-slate-700 text-slate-200 hover:bg-slate-800">
                      How It Works
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Column: UDSM New Library Photograph */}
              <div className="lg:col-span-6">
                <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group">
                  <img
                    src="/logos/libray.jpeg"
                    alt="Students collaborating outside the New Library at the University of Dar es Salaam."
                    className="w-full h-[340px] sm:h-[420px] object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                    loading="eager"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* SECTION C: OUR STORY */}
        <section className="py-20 md:py-28 px-4 md:px-6 bg-slate-50 dark:bg-slate-900/50 border-b border-border/50">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">BACKGROUND & CONTEXT</span>
              <h2 className="text-3xl md:text-4xl font-bold font-heading mt-2 text-foreground">Why We Built UniReportTZ</h2>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none text-base md:text-lg leading-relaxed text-muted-foreground space-y-6">
              <p>
                Academic reporting involves more than putting words on a page. Students must understand their topics, organize evidence, follow academic structures, reference credible sources, and prepare documents that meet their institution's requirements.
              </p>
              <p>
                These demands can make report preparation difficult and time-consuming, particularly when students have to manage research and other academic responsibilities at the same time.
              </p>
              <p>
                <strong className="text-foreground">UniReportTZ</strong> is designed to make this process more organized. It brings report planning, structured writing assistance, document formatting, revision, and export into one guided experience.
              </p>
              <p>
                Our goal is not simply to produce pages of text. It is to help users develop clearer, better-structured reports while remaining responsible for their research, evidence, and final submissions.
              </p>
            </div>
          </div>
        </section>


        {/* SECTION D: MISSION AND VISION */}
        <section className="py-20 md:py-28 px-4 md:px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* OUR MISSION */}
              <div className="group p-8 md:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-2xl hover:-translate-y-2.5 hover:border-teal-500/60 dark:hover:border-teal-500/60 transition-all duration-300 ease-out relative overflow-hidden flex flex-col justify-between cursor-pointer select-none">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-bl-full pointer-events-none transition-all duration-500 group-hover:scale-125 group-hover:bg-teal-500/20 group-hover:w-44 group-hover:h-44" />
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-teal-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-teal-500/30">
                    <Target className="size-7" />
                  </div>
                  <h3 className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-2">OUR PURPOSE</h3>
                  <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground mb-4 transition-colors duration-200 group-hover:text-teal-600 dark:group-hover:text-teal-400">OUR MISSION</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    To simplify academic report development through accessible AI-assisted technology that supports structured writing, clear communication, responsible research, and institution-aware document preparation.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-400">
                  <span>Driven by institutional compliance</span>
                  <span className="flex items-center gap-1 transition-transform duration-300 group-hover:translate-x-1.5 font-bold">
                    Learn more <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </div>

              {/* OUR VISION */}
              <div className="group p-8 md:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-2xl hover:-translate-y-2.5 hover:border-blue-500/60 dark:hover:border-blue-500/60 transition-all duration-300 ease-out relative overflow-hidden flex flex-col justify-between cursor-pointer select-none">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full pointer-events-none transition-all duration-500 group-hover:scale-125 group-hover:bg-blue-500/20 group-hover:w-44 group-hover:h-44" />
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/30">
                    <Compass className="size-7" />
                  </div>
                  <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">OUR AMBITION</h3>
                  <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground mb-4 transition-colors duration-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">OUR VISION</h2>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    To become a trusted academic reporting platform that makes high-quality report development more accessible to students, researchers, and professionals across Tanzania and beyond.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <span>Advancing Tanzanian academic rigor</span>
                  <span className="flex items-center gap-1 transition-transform duration-300 group-hover:translate-x-1.5 font-bold">
                    Learn more <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* SECTION E: OUR CORE VALUES */}
        <section className="py-20 md:py-28 px-4 md:px-6 bg-slate-50 dark:bg-slate-900/40 border-y border-border/50">
          <div className="container mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">GUIDING PRINCIPLES</span>
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mt-2">Our Core Values</h2>
              <p className="text-muted-foreground mt-3">The foundational principles that guide how we build technology for higher education.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                {
                  icon: Award,
                  title: "Academic Quality",
                  desc: "Encourage detailed, coherent, well-structured reports supported by relevant evidence."
                },
                {
                  icon: ShieldCheck,
                  title: "Academic Integrity",
                  desc: "Encourage original thinking, appropriate attribution, accurate referencing, and compliance with institutional rules."
                },
                {
                  icon: Lock,
                  title: "Privacy & Security",
                  desc: "Protect uploaded templates, research materials, generated documents, personal information, and account data."
                },
                {
                  icon: Sparkles,
                  title: "Responsible Innovation",
                  desc: "Use AI to support research and writing while keeping users involved in reviewing and validating their work."
                },
                {
                  icon: Zap,
                  title: "Accessibility & Efficiency",
                  desc: "Make report planning, development, formatting, and revision easier to navigate."
                }
              ].map((val, idx) => (
                <div key={idx} className="group relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm flex flex-col justify-between hover:shadow-xl hover:-translate-y-2 hover:border-teal-500/50 transition-all duration-300 cursor-default overflow-hidden">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-teal-500/25">
                      <val.icon className="size-5" />
                    </div>
                    <h3 className="font-bold text-base text-foreground mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{val.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{val.desc}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-400 w-0 group-hover:w-full transition-all duration-300" />
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* SECTION F: HOW UNIREPORTTZ WORKS */}
        <section id="how-it-works" className="py-20 md:py-28 px-4 md:px-6 scroll-mt-16">
          <div className="container mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">WORKFLOW STEPPER</span>
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mt-2">How UniReportTZ Works</h2>
              <p className="text-muted-foreground mt-3">A structured 5-step guided process from raw research to verified final submission.</p>
            </div>

            {/* Stepper Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
              {[
                {
                  step: "01",
                  icon: FileText,
                  title: "Start Your Report",
                  desc: "Supply your report topic, project details, or specific assignment requirements."
                },
                {
                  step: "02",
                  icon: UploadCloud,
                  title: "Upload Requirements",
                  desc: "Provide an authorized university template, sample report, rubric, or formatting guide."
                },
                {
                  step: "03",
                  icon: LayoutList,
                  title: "Plan Structure",
                  desc: "Develop an outline, organizing chapters, subsections, research questions, and evidence."
                },
                {
                  step: "04",
                  icon: FileCheck2,
                  title: "Develop & Review",
                  desc: "Draft section-by-section with source management, factual verification, and consistency checks."
                },
                {
                  step: "05",
                  icon: Download,
                  title: "Format & Export",
                  desc: "Review your final report and export to formatted DOCX or print-ready PDF files."
                }
              ].map((st, i) => (
                <div key={i} className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm hover:shadow-xl hover:-translate-y-2 hover:border-teal-500/50 transition-all duration-300 cursor-default overflow-hidden">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-extrabold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2.5 py-1 rounded-md transition-colors duration-300 group-hover:bg-teal-600 group-hover:text-white">
                        STEP {st.step}
                      </span>
                      <st.icon className="size-5 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:scale-110 transition-all duration-300" />
                    </div>
                    <h3 className="font-bold text-base text-foreground mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{st.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{st.desc}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-400 w-0 group-hover:w-full transition-all duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* SECTION G: ACADEMIC INTEGRITY COMMITMENT */}
        <section className="py-20 px-4 md:px-6 bg-slate-900 text-white">
          <div className="container mx-auto max-w-4xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-semibold text-teal-400 uppercase">
              <ShieldCheck className="size-4" /> RESPONSIBLE AI USE
            </div>

            <h2 className="text-3xl md:text-4xl font-bold font-heading text-white">Technology That Supports Learning</h2>

            <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
              UniReportTZ is designed to support the report development process, not to replace a student's understanding or responsibility. Users should review generated content, verify sources, confirm the accuracy of facts and findings, and follow their institution's rules on AI-assisted work.
            </p>

            <p className="text-slate-400 text-sm max-w-2xl mx-auto">
              The platform must not fabricate research findings, references, interviews, or experimental data. When evidence is missing, users are prompted to supply it.
            </p>

            <div className="pt-4">
              <Link href="/integrity">
                <Button variant="outline" className="border-slate-700 text-teal-400 hover:bg-slate-800 gap-2">
                  Read Our Academic Integrity Policy <ExternalLink className="size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>


        {/* SECTION H: PRIVACY AND TRUST */}
        <section className="py-20 px-4 md:px-6 border-b border-border/50">
          <div className="container mx-auto max-w-4xl text-center space-y-6">
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">DATA PROTECTION</span>
            <h2 className="text-3xl font-bold font-heading text-foreground">Your Research Deserves Respect</h2>
            
            <p className="text-muted-foreground text-base max-w-2xl mx-auto leading-relaxed">
              Academic drafts, research documents, report samples, and personal information should be handled with care. UniReportTZ is designed around access controls and privacy-conscious processing so users can work with their materials in a protected environment.
            </p>

            <div className="flex flex-wrap justify-center gap-6 pt-4 text-sm font-semibold text-teal-600 dark:text-teal-400">
              <Link href="/privacy" className="hover:underline flex items-center gap-1">Privacy Policy <ChevronRight className="size-3.5" /></Link>
              <Link href="/terms" className="hover:underline flex items-center gap-1">Terms of Service <ChevronRight className="size-3.5" /></Link>
              <Link href="/contact" className="hover:underline flex items-center gap-1">Contact Support <ChevronRight className="size-3.5" /></Link>
            </div>
          </div>
        </section>


        {/* SECTION I: FINAL CALL TO ACTION */}
        <section className="py-24 px-4 md:px-6 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white text-center">
          <div className="container mx-auto max-w-3xl space-y-6">
            <h2 className="text-3xl md:text-5xl font-extrabold font-heading tracking-tight">Start Building Better Reports.</h2>
            <p className="text-lg md:text-xl text-slate-300">
              Bring your topic, research materials, and report requirements together in one guided workspace.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/auth/register">
                <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold border-none shadow-xl">
                  Get Started
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 text-lg border-slate-700 text-slate-200 hover:bg-slate-800">
                  Learn How It Works
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
