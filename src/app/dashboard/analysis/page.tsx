"use client";

import { useState } from "react";
import { ArrowLeft, BarChart3, Database, FileSpreadsheet, Play, Settings2, Table, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AnalysisWorkspacePage() {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="flex items-center justify-between pb-4 border-b">
         <div className="flex items-center gap-4">
           <Link href="/dashboard">
             <Button variant="ghost" size="icon"><ArrowLeft className="size-4" /></Button>
           </Link>
           <div>
             <h1 className="text-xl font-bold font-heading text-foreground">Quantitative Analysis</h1>
             <p className="text-sm text-muted-foreground flex items-center"><Database className="size-3 mr-1" /> dataset_survey_results_2023.csv (245 rows)</p>
           </div>
         </div>
         <Button className="bg-primary"><Play className="size-4 mr-2" /> Run Analysis</Button>
      </div>

      <div className="flex flex-1 overflow-hidden mt-4 gap-6">
        {/* Left Toolbar */}
        <aside className="w-72 bg-white dark:bg-slate-900 border rounded-xl shadow-sm flex flex-col">
          <div className="p-4 border-b font-semibold flex items-center gap-2">
            <Settings2 className="size-4 text-teal-600" /> Configuration
          </div>
          <div className="p-4 space-y-6 overflow-y-auto">
             <div className="space-y-2">
               <label className="text-xs font-semibold uppercase text-muted-foreground">Test Type</label>
               <select className="w-full text-sm h-10 border rounded px-3 bg-background outline-none">
                 <option>Descriptive Statistics</option>
                 <option>Correlation Analysis</option>
                 <option>Frequency Distribution</option>
                 <option>Chi-square Test</option>
               </select>
             </div>
             
             <div className="space-y-2">
               <label className="text-xs font-semibold uppercase text-muted-foreground">Variables</label>
               <div className="space-y-2">
                 {["Age Group", "Gender", "Platform Used", "Performance Index"].map((v, i) => (
                   <label key={i} className="flex items-center gap-2 p-2 border rounded hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                     <input type="checkbox" className="accent-teal-600" defaultChecked={i === 2 || i === 3} />
                     <span className="text-sm">{v}</span>
                   </label>
                 ))}
               </div>
             </div>
          </div>
        </aside>

        {/* Center Canvas */}
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950 rounded-xl border relative">
           
           <div className="flex border-b bg-white dark:bg-slate-900">
             <button className="px-6 py-3 border-b-2 border-teal-600 text-teal-700 dark:text-teal-400 font-semibold text-sm flex items-center gap-2"><BarChart3 className="size-4" /> Visualizations</button>
             <button className="px-6 py-3 text-muted-foreground hover:text-foreground font-medium text-sm flex items-center gap-2"><Table className="size-4" /> Data Table</button>
           </div>
           
           <div className="flex-1 p-6 overflow-y-auto space-y-6">
              
              <div className="bg-white dark:bg-slate-900 border rounded-xl p-6 shadow-sm">
                <h3 className="font-bold mb-4 font-heading border-b pb-2">Platform Used vs Performance Index</h3>
                <div className="h-64 w-full flex items-end justify-around gap-4 pt-10">
                   {/* CSS Chart mockup */}
                   <div className="w-full h-full flex items-end justify-center gap-8 relative border-b border-l pb-1">
                      <div className="absolute left-[-25px] flex flex-col justify-between h-full text-xs text-muted-foreground pb-1">
                        <span>100</span><span>75</span><span>50</span><span>25</span>
                      </div>
                      
                      <div className="relative w-16 group">
                        <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-t-sm h-[45%]"></div>
                        <div className="absolute -bottom-6 w-full text-center text-xs font-medium">Moodle</div>
                      </div>
                      <div className="relative w-16 group">
                        <div className="w-full bg-teal-500 rounded-t-sm h-[85%] relative shadow-[0_0_15px_rgba(20,184,166,0.3)]"></div>
                        <div className="absolute -bottom-6 w-full text-center text-xs font-medium">UniReportTZ</div>
                      </div>
                      <div className="relative w-16 group">
                        <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-t-sm h-[60%]"></div>
                        <div className="absolute -bottom-6 w-full text-center text-xs font-medium">Canvas</div>
                      </div>
                   </div>
                </div>
              </div>
              
              <div className="bg-teal-50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-900/30 rounded-xl p-5">
                <h4 className="font-bold text-teal-800 dark:text-teal-400 mb-2 flex items-center gap-2"><Sparkles className="size-4" /> AI Generated Summary</h4>
                <p className="text-sm text-teal-900 dark:text-teal-200 leading-relaxed">
                  Based on the descriptive analysis, the data indicates a significant positive correlation (r = 0.72) between the utilization of the <strong>UniReportTZ</strong> platform and the <em>Performance Index</em>. Students utilizing the platform scored an average of 85%, outperforming the baseline by 40%. The visualizations confirm the hypothesis that structured reporting tools improve academic outcomes.
                </p>
                <div className="mt-4 flex justify-end">
                   <Button size="sm" className="bg-teal-600">Insert to Report Canvas</Button>
                </div>
              </div>

           </div>
        </main>
      </div>
    </div>
  );
}
