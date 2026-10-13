"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, BookOpenText, CheckCircle2, ShieldCheck, GraduationCap, Building2, Library, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
              <div className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50/90 px-3.5 py-1 text-sm font-medium text-teal-800 mb-8 dark:border-teal-900/50 dark:bg-teal-900/40 dark:text-teal-300 shadow-sm backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-teal-500 mr-2 animate-pulse"></span>
                Now supporting major Universities across Tanzania
              </div>
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

        {/* UNIVERSITIES MARQUEE */}
        <section className="border-t border-b border-border/40 bg-slate-50/50 dark:bg-slate-900/20 py-10 overflow-hidden">
          <div className="container mx-auto px-4 text-center mb-6">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Trusted by students from</p>
          </div>
          <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
            <div className="group flex overflow-hidden p-2 [--gap:1rem] [--duration:40s]">
              <div className="flex shrink-0 justify-around gap-8 md:gap-16 [animation:marquee_var(--duration)_linear_infinite] group-hover:[animation-play-state:paused]">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <div key={idx} className="flex shrink-0 gap-8 md:gap-16">
                    {[
                      { shortName: "UDSM", logo: "/logos/UDSM.jpeg" },
                      { shortName: "UDOM", logo: "/logos/UDOM.png" },
                      { shortName: "SUA", logo: "/logos/SUA.jpeg" },
                      { shortName: "ARDHI", logo: "/logos/ARDHI.jpeg" },
                      { shortName: "DIT", logo: "/logos/DIT.jpeg" },
                      { shortName: "CBE", logo: "/logos/CBE.png" },
                      { shortName: "IFM", logo: "/logos/IFM.jpeg" },
                      { shortName: "MUST", logo: "/logos/MUST.jpeg" },
                      { shortName: "MUHAS", logo: "/logos/MUHAS.jpeg" },
                      { shortName: "NIT", logo: "/logos/NIT.jpeg" },
                      { shortName: "IAA", logo: "/logos/IAA.jpeg" }
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 hover:scale-105 transition-all cursor-pointer">
                        <img 
                          src={item.logo}
                          alt={`${item.shortName} Official Logo`}
                          className="w-16 h-16 md:w-20 md:h-20 object-contain shadow-md rounded-2xl bg-white dark:bg-slate-950 p-1.5 border border-border/80" 
                        />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.shortName}</span>
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
          `}} />
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="py-20 md:py-28 bg-white dark:bg-slate-950 px-4 md:px-6">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-primary dark:text-white">How It Works</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">A guided, intelligent research process that ensures your final report meets rigorous academic standards.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Select Requirements", desc: "Choose your university template, department, and referencing style." },
                { step: "02", title: "Provide Research Data", desc: "Upload your proposal, raw dataset, and methodology." },
                { step: "03", title: "Intelligent Drafting", desc: "Our AI drafts sections based strictly on your uploaded evidence." },
                { step: "04", title: "Export Validated Report", desc: "Export perfectly formatted DOCX or print-ready PDF files." }
              ].map((item, i) => (
                <div 
                  key={i} 
                  className="group relative flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-teal-500/5 hover:border-teal-500/50 hover:bg-white dark:hover:bg-slate-900/90 motion-reduce:hover:transform-none"
                >
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl mb-6 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:bg-teal-600 group-hover:shadow-teal-500/20">{item.step}</div>
                  <h3 className="text-xl font-bold mb-3 transition-colors duration-200 group-hover:text-primary dark:group-hover:text-teal-400">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
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
