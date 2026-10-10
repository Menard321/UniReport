"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, ChevronDown, Download, FileText, MessageSquareMore, MoreVertical, RefreshCw, Sparkles, BookOpenText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AIEditorPage() {
  const [content, setContent] = useState(`Chapter 1: Introduction\n\n1.1 Background of the Study\nThe integration of Artificial Intelligence (AI) in academic settings has revolutionized the way research is conducted globally...`);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* EDITOR NAVBAR */}
      <header className="h-[60px] bg-white dark:bg-slate-900 border-b flex items-center justify-between px-4 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><ArrowLeft className="size-4" /></Button>
          </Link>
          <div className="h-6 w-[1px] bg-border mx-2"></div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">Assessment of AI in Tanzanian Education</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400 border border-teal-200 dark:border-teal-800/50">UDSM</span>
            </div>
            <p className="text-[11px] text-muted-foreground flex items-center"><Check className="size-3 mr-1 text-emerald-500" /> Saved to cloud</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground mr-4">
            <span className="font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">2,450 words</span>
          </div>
          <Button variant="outline" size="sm" className="hidden sm:flex h-8 gap-2">
            <MessageSquareMore className="size-4" /> Share
          </Button>
          <Button size="sm" className="h-8 gap-2 bg-primary">
            <Download className="size-4" /> Export DOCX
            <div className="w-[1px] h-4 bg-primary-foreground/30 mx-1"></div>
            <ChevronDown className="size-3" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT COMPONENT OUTLINE (Hidden on small screens) */}
        <aside className="w-64 bg-slate-50/50 dark:bg-slate-900/30 border-r flex-col hidden lg:flex">
          <div className="p-4 border-b">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Project Structure</h4>
            <div className="space-y-1">
              {[
                { title: "Title Page", active: false },
                { title: "Abstract", active: false },
                { title: "Chapter 1: Introduction", active: true },
                { title: "Chapter 2: Literature Review", active: false },
                { title: "Chapter 3: Methodology", active: false },
                { title: "References", active: false }
              ].map((item, i) => (
                <button key={i} className={`w-full text-left px-3 py-1.5 text-sm rounded ${item.active ? 'bg-white dark:bg-slate-800 font-medium shadow-sm border border-border text-primary dark:text-white' : 'text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-foreground'}`}>
                  {item.title}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 mt-auto border-t">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-muted-foreground">Completion</span>
              <span className="font-bold text-teal-600 dark:text-teal-400">18%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5">
              <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: "18%" }}></div>
            </div>
          </div>
        </aside>

        {/* CENTER WRITING CANVAS */}
        <main className="flex-1 bg-slate-100 dark:bg-slate-950 overflow-y-auto w-full relative">
           
           {/* Editor Toolbar */}
           <div className="sticky top-4 mx-auto w-max bg-white dark:bg-slate-900 rounded-full shadow-md border px-4 py-2 flex items-center gap-2 z-10">
              <Button variant="ghost" size="icon" className="h-8 w-8"><strong className="font-serif">B</strong></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8"><em className="font-serif">I</em></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8"><u className="font-serif">U</u></Button>
              <div className="w-[1px] h-5 bg-border mx-1"></div>
              <Button variant="ghost" size="sm" className="h-8 text-xs font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-900/30">
                <BookOpenText className="size-3.5 mr-1.5" /> Cite Source
              </Button>
           </div>

           {/* A4 Paper Wrapper */}
           <div className="max-w-[800px] min-h-[1056px] bg-white dark:bg-slate-900 mx-auto my-8 shadow-sm border p-12 md:p-20 relative">
             <div className="outline-none min-h-full font-serif text-[15px] md:text-[16px] leading-loose text-foreground" contentEditable spellCheck="false" suppressContentEditableWarning>
               <h1 className="text-2xl font-bold mb-4 font-sans text-center">Chapter 1: Introduction</h1>
               
               <h2 className="text-lg font-bold mb-2 mt-8 font-sans">1.1 Background of the Study</h2>
               <p className="mb-4">The integration of Artificial Intelligence (AI) in academic settings has revolutionized the way research is conducted globally. Within the context of Tanzanian higher learning institutions, the adoption has been markedly gradual, restricted primarily by infrastructural challenges and policy gaps <span className="text-teal-600 bg-teal-50 dark:bg-teal-900/30 px-1 rounded cursor-pointer">(Mushi et al., 2023)</span>.</p>
               <p className="mb-4">Historically, the reliance on traditional pedagogy at institutions such as the University of Dar es Salaam necessitated manual literature curation. However, post-2020 statistics illustrate a 40% uptick in digital resource reliance <span className="text-teal-600 bg-teal-50 dark:bg-teal-900/30 px-1 rounded cursor-pointer">(Tanzania Commission for Universities, 2021)</span>.</p>
               
               <div className="relative my-6 select-none" contentEditable={false}>
                  <div className="absolute -left-3 top-0 bottom-0 w-1 bg-amber-400 rounded-full"></div>
                  <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-r-lg rounded-l-sm p-4 text-sm font-sans flex items-start gap-3">
                     <Sparkles className="size-5 text-amber-500 shrink-0 mt-0.5" />
                     <div>
                       <p className="text-amber-900 dark:text-amber-200 mb-3">
                         <strong>AI Suggestion:</strong> Your background lacks a clear transition into the problem statement. Would you like to generate a bridging paragraph discussing the specific gap in student reporting workflows?
                       </p>
                       <div className="flex gap-2">
                         <Button size="sm" variant="outline" className="h-7 text-xs border-amber-200 hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-800 text-amber-800 dark:text-amber-100">Dismiss</Button>
                         <Button size="sm" className="h-7 text-xs bg-amber-500 hover:bg-amber-600 text-white shadow-none">Generate Bridge</Button>
                       </div>
                     </div>
                  </div>
               </div>
             </div>
           </div>
        </main>

        {/* RIGHT AI ASSISTANT PANEL */}
        <aside className="w-80 bg-white dark:bg-slate-900 border-l flex-col hidden xl:flex">
          <div className="h-14 border-b flex items-center px-4 shrink-0 font-medium text-sm gap-2 text-foreground">
             <Sparkles className="size-4 inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent fill-teal-100 dark:fill-teal-900" /> 
             <span>Academic Assistant</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            
            {/* Action Tools */}
            <div className="space-y-2">
               <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Writing Actions</h4>
               {[
                 { label: "Continue Writing", icon: FileText },
                 { label: "Improve Academic Tone", icon: RefreshCw },
                 { label: "Translate concept to Kiswahili", icon: MessageSquareMore },
                 { label: "Find Missing Evidence", icon: BookOpenText }
               ].map((action, i) => (
                 <button key={i} className="w-full flex items-center gap-3 p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-950 hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 text-left text-sm transition-colors group">
                    <action.icon className="size-4 text-muted-foreground group-hover:text-teal-600" />
                    <span className="font-medium text-foreground">{action.label}</span>
                 </button>
               ))}
            </div>

            <div className="border border-border rounded-xl p-4 bg-slate-50 dark:bg-slate-950">
               <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5"><Check className="size-3 text-emerald-500" /> Quality Check</h4>
               <p className="text-xs text-muted-foreground mb-3">Your section meets 2/3 formatting requirements for standard Dissertations.</p>
               <Button variant="outline" size="sm" className="w-full h-8 text-xs font-medium">Run Validator</Button>
            </div>

          </div>
        </aside>
      </div>
    </div>
  );
}
