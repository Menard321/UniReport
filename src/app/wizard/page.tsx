"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check, ChevronRight, FileUp, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEPS = [
  "Report Type",
  "Requirements",
  "Research Details",
  "Upload Materials",
  "Report Plan",
  "Review"
];

const stepVariants: Variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: "spring", stiffness: 320, damping: 30 },
      opacity: { duration: 0.22 },
    },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
    transition: {
      x: { type: "spring", stiffness: 320, damping: 30 },
      opacity: { duration: 0.18 },
    },
  }),
};

export default function ReportWizardPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const nextStep = () => {
    setDirection(1);
    setCurrentStep((prev) => Math.min(prev + 1, 6));
  };

  const prevStep = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const goToStep = (stepNumber: number) => {
    if (stepNumber === currentStep) return;
    if (stepNumber <= currentStep || stepNumber === currentStep + 1) {
      setDirection(stepNumber > currentStep ? 1 : -1);
      setCurrentStep(stepNumber);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* HEADER */}
      <header className="h-16 border-b bg-white dark:bg-slate-900 flex items-center px-6 sticky top-0 z-10 shrink-0 justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="relative size-7 rounded-md overflow-hidden flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="UniReportTZ Logo"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <span className="font-bold font-heading text-lg text-primary dark:text-white hidden sm:block">UniReportTZ</span>
          </Link>
        </div>
        <div className="text-sm font-medium bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-muted-foreground flex gap-2 items-center border">
           Draft Status: <span className="text-amber-500 flex items-center"><span className="size-2 rounded-full bg-amber-500 mr-1 animate-pulse"></span> Unsaved</span>
        </div>
      </header>

      {/* TOP PROGRESS BAR */}
      <div className="w-full bg-white dark:bg-slate-900 border-b py-4 px-4 overflow-x-auto shrink-0 scrollbar-hide">
        <div className="max-w-4xl mx-auto flex items-center justify-between min-w-[600px]">
          {STEPS.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isActive = stepNumber === currentStep;
            const isAccessible = stepNumber <= currentStep || stepNumber === currentStep + 1;
            
            return (
              <div key={step} className="flex items-center">
                <button
                  type="button"
                  onClick={() => goToStep(stepNumber)}
                  disabled={!isAccessible}
                  className={cn(
                    "flex flex-col items-center gap-2 relative transition-all group focus:outline-none",
                    isAccessible ? "cursor-pointer" : "cursor-not-allowed opacity-45"
                  )}
                >
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold font-mono transition-all z-10",
                    isActive ? "border-teal-600 bg-teal-600 text-white shadow-md shadow-teal-500/25 scale-110" : 
                    isCompleted ? "border-teal-600 bg-teal-50 text-teal-600 dark:bg-teal-900/30" : 
                    "border-muted-foreground/30 bg-background text-muted-foreground group-hover:border-teal-500/50"
                  )}>
                    {isCompleted ? <Check className="size-4" /> : stepNumber}
                  </div>
                  <span className={cn(
                    "text-xs font-semibold whitespace-nowrap absolute top-10 transition-colors",
                    isActive ? "text-primary dark:text-white font-bold" : "text-muted-foreground"
                  )}>{step}</span>
                </button>
                {index < STEPS.length - 1 && (
                  <div className={cn(
                    "h-[2px] w-12 sm:w-16 md:w-24 mx-2 transition-colors duration-300",
                    isCompleted ? "bg-teal-600" : "bg-muted"
                  )} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* WIZARD CONTENT AREA WITH HORIZONTAL MOTION */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="max-w-2xl mx-auto py-12 px-4 pb-32">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full"
            >
              {/* STEP 1: REPORT TYPE */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold font-heading mb-2">Select Report Type</h2>
                    <p className="text-muted-foreground">What kind of academic document are you preparing?</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: "proposal", title: "Research Proposal", desc: "Chapters 1-3 outline." },
                      { id: "dissertation", title: "Dissertation/Thesis", desc: "Full undergraduate or master's report." },
                      { id: "industrial", title: "Industrial Training", desc: "Internship or field attachment report." },
                      { id: "literature", title: "Literature Review", desc: "Standalone systematic review." },
                      { id: "practical", title: "Laboratory Report", desc: "Scientific practical reports." },
                      { id: "assignment", title: "Coursework / Essay", desc: "Standard academic assignments." }
                    ].map((type) => (
                      <label key={type.id} className="relative flex cursor-pointer rounded-lg border bg-white dark:bg-slate-900 p-4 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition focus-within:ring-2 focus-within:ring-teal-500">
                        <input type="radio" name="reportType" value={type.id} className="sr-only" defaultChecked={type.id === "dissertation"} />
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground text-base mb-1">{type.title}</span>
                          <span className="text-xs text-muted-foreground">{type.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: REQUIREMENTS */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold font-heading mb-2">Academic Requirements</h2>
                    <p className="text-muted-foreground">Your profile defaults to UDSM settings. Adjust if needed.</p>
                  </div>

                  <div className="space-y-5 bg-white dark:bg-slate-900 p-6 rounded-xl border shadow-sm">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Institution Guideline Overlay</label>
                      <select className="w-full h-11 px-3 border rounded-md bg-background outline-none">
                        <option value="udsm" defaultValue="udsm">University of Dar es Salaam (Standard Template v2.4)</option>
                        <option value="generic">Generic Academic Standard</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Referencing Style</label>
                        <select className="w-full h-11 px-3 border rounded-md bg-background outline-none">
                          <option value="apa" defaultValue="apa">APA 7th Edition</option>
                          <option value="harvard">Harvard</option>
                          <option value="ieee">IEEE</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Target Language</label>
                        <select className="w-full h-11 px-3 border rounded-md bg-background outline-none">
                          <option value="en" defaultValue="en">English (UK)</option>
                          <option value="sw">Kiswahili</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: RESEARCH DETAILS */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold font-heading mb-2">Describe the Research</h2>
                    <p className="text-muted-foreground">Provide the foundational parameters of your study.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Working Title</label>
                      <input type="text" placeholder="e.g. Assessment of AI Integration in Tanzanian Universities..." className="w-full h-11 px-3 rounded-md border outline-none bg-white dark:bg-slate-900" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">General Objective</label>
                      <textarea placeholder="The main goal of this research is to..." className="w-full h-24 px-3 py-2 rounded-md border outline-none bg-white dark:bg-slate-900 resize-none"></textarea>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center justify-between">
                        Specific Objectives (Optional)
                        <span className="text-xs text-muted-foreground">The AI can help define these later</span>
                      </label>
                      <textarea placeholder="1. To evaluate..." className="w-full h-24 px-3 py-2 rounded-md border outline-none bg-white dark:bg-slate-900 resize-none"></textarea>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: UPLOAD MATERIALS */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold font-heading mb-2">Upload Supporting Evidence</h2>
                    <p className="text-muted-foreground">Provide datasets, literature, or supervisor notes to ground the generation.</p>
                  </div>

                  <div className="border-2 border-dashed border-border rounded-xl p-10 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer text-center">
                    <div className="p-4 bg-primary/10 rounded-full mb-4 text-primary">
                      <FileUp className="size-8" />
                    </div>
                    <h3 className="font-semibold mb-1">Click to upload or drag files here</h3>
                    <p className="text-xs text-muted-foreground max-w-sm">Supported files: PDF, DOCX, TXT, CSV, XLSX. Maximum 10MB per file. Data is processed securely.</p>
                  </div>
                </div>
              )}

              {/* STEP 5: REPORT PLAN BUILDER */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold font-heading mb-2">Review Report Plan</h2>
                    <p className="text-muted-foreground">The AI has generated an outline based on your university guidelines.</p>
                  </div>

                  <div className="flex justify-between items-center bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-900/50 p-4 rounded-xl mb-6">
                     <div>
                       <h4 className="font-semibold text-teal-800 dark:text-teal-300 text-sm flex items-center"><Sparkles className="size-4 mr-2" /> Outline Generated</h4>
                       <p className="text-xs text-teal-700/70 dark:text-teal-400 mt-1">Structured based on predefined Institutional Template.</p>
                     </div>
                     <Button variant="outline" size="sm" className="bg-white dark:bg-slate-950">Regenerate</Button>
                  </div>

                  <div className="space-y-3 pl-4 border-l-2 border-slate-200 dark:border-slate-800">
                    {["1.0 Introduction", "2.0 Literature Review", "3.0 Methodology", "4.0 Results & Findings", "5.0 Discussion", "6.0 Conclusion"].map((ch, i) => (
                      <div key={i} className="relative before:absolute before:-left-[21px] before:top-3 before:h-2 before:w-2 before:rounded-full before:bg-slate-300 dark:before:bg-slate-700 p-3 bg-white dark:bg-slate-900 border rounded-lg shadow-sm text-sm font-medium">
                        {ch}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 6: VERIFICATION & INITIALIZATION */}
              {currentStep === 6 && (
                <div className="space-y-6 text-center py-10">
                  <div className="inline-flex size-20 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400 mb-6 border-4 border-white dark:border-slate-950 shadow-xl">
                     <Check className="size-10" />
                  </div>
                  <h2 className="text-3xl font-bold font-heading mb-2">Project Initialized</h2>
                  <p className="text-muted-foreground max-w-sm mx-auto mb-10">Your academic constraints, data variables, and framework outline are locked in.</p>
                  
                  <Link href="/editor/p-new">
                    <Button size="lg" className="h-14 px-10 text-base shadow-lg bg-teal-600 hover:bg-teal-500">
                       Open AI Academic Workspace
                       <ArrowRight className="ml-2 size-5" />
                    </Button>
                  </Link>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 p-4 border-t bg-white/80 dark:bg-slate-900/80 backdrop-blur shrink-0 supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Button variant="ghost" onClick={prevStep} disabled={currentStep === 1} className={currentStep === 1 || currentStep === 6 ? "invisible" : ""}>
            <ArrowLeft className="mr-2 size-4" /> Back
          </Button>
          
          {currentStep < 6 && (
            <Button onClick={nextStep} className="px-8 bg-primary">
              {currentStep === 5 ? "Confirm & Create Project" : "Continue"} <ChevronRight className="ml-2 size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
