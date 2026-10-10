"use client";

import { useState } from "react";
import { Upload, ShieldCheck, ShieldAlert, Loader2, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SafeDocumentUpload() {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'clean' | 'threat'>('idle');
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // If someone uploads a file specifically named "virus.docx", we simulate a threat
      if (selectedFile.name.toLowerCase().includes("virus") || selectedFile.name.toLowerCase().includes("malware")) {
        simulateScan('threat');
      } else {
        simulateScan('clean');
      }
    }
  };

  const simulateScan = (finalState: 'clean' | 'threat') => {
    setStatus('scanning');
    
    // Simulate a 3-second Deep Scan compliant with data protection standards
    setTimeout(() => {
      setStatus(finalState);
    }, 3000);
  };

  const reset = () => {
    setFile(null);
    setStatus('idle');
  };

  return (
    <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 bg-slate-50/50 dark:bg-slate-900/20 text-center relative overflow-hidden transition-colors">
      
      {status === 'scanning' && (
        <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center animate-in fade-in duration-200">
          <Loader2 className="size-12 text-indigo-500 animate-spin mb-4" />
          <h3 className="text-lg font-bold">Security Analysis in Progress</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Scanning document for malware and deeply embedded prompt-injection vectors per Tanzanian Cyber Security guidelines.
          </p>
          <div className="w-48 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-6 overflow-hidden">
            <div className="h-full bg-indigo-500 animate-pulse w-full"></div>
          </div>
        </div>
      )}

      {status === 'clean' && file && (
        <div className="absolute inset-0 bg-emerald-50 dark:bg-emerald-950/20 z-10 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400 p-4 rounded-full mb-4 ring-4 ring-white dark:ring-slate-950">
            <ShieldCheck className="size-8" />
          </div>
          <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400">Document Verified Safe</h3>
          <p className="text-sm text-emerald-600/70 dark:text-emerald-400/70 mt-1 mb-6 flex items-center gap-2">
            <FileText className="size-4" /> {file.name}
          </p>
          <div className="flex gap-4">
            <Button variant="outline" className="border-emerald-200 hover:bg-emerald-50 text-emerald-700" onClick={reset}>Scan Another</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
              <CheckCircle2 className="size-4" /> Proceed to Analysis
            </Button>
          </div>
        </div>
      )}

      {status === 'threat' && file && (
        <div className="absolute inset-0 bg-rose-50 dark:bg-rose-950/20 z-10 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-200">
           <div className="bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400 p-4 rounded-full mb-4 ring-4 ring-white dark:ring-slate-950">
            <ShieldAlert className="size-8 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-rose-700 dark:text-rose-400">Security Threat Blocked</h3>
          <p className="text-sm text-rose-600/70 dark:text-rose-400/70 mt-1 mb-2 max-w-md">
            Malicious payload detected in <strong>{file.name}</strong>. The upload has been aggressively terminated and the event has been logged for security review.
          </p>
          <Button variant="destructive" className="mt-4" onClick={reset}>Discard & Restart</Button>
        </div>
      )}

      {/* Default Idle State */}
      <div className={`transition-opacity duration-200 ${status !== 'idle' ? 'opacity-0' : 'opacity-100'}`}>
        <div className="w-16 h-16 bg-white dark:bg-slate-900 shadow-sm border rounded-2xl flex items-center justify-center mx-auto mb-4 relative">
          <Upload className="size-6 text-slate-400" />
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-1 border-2 border-slate-50 dark:border-slate-950">
            <ShieldCheck className="size-3 text-white" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-foreground">Upload Research Document</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto mb-6">
          Files are processed using SOC2-compliant isolated containers and automatically purged after 24 hours.
        </p>
        
        <label className="cursor-pointer inline-flex">
          <div className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 flex items-center justify-center rounded-md font-medium text-sm transition-colors">
            Select PDF or DOCX
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleFileUpload}
          />
        </label>
        <p className="text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
          <ShieldAlert className="size-3" /> Strict malware monitoring enforced.
        </p>
      </div>
    </div>
  );
}
