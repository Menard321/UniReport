"use client";

import { useState, useEffect } from "react";
import { GraduationCap, BookOpen, ShieldCheck, ArrowRight, CheckCircle2, Building2 } from "lucide-react";

export function StartupLoader() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(12);
  const [statusMessage, setStatusMessage] = useState("Connecting to Tanzania Higher Education Portal...");

  useEffect(() => {
    setMounted(true);

    const stages = [
      { at: 25, text: "Loading Tanzanian University Catalog (UDSM, UDOM, SUA, DIT, MUST)..." },
      { at: 50, text: "Applying Institutional Guidelines (Times New Roman 10pt / 14pt)..." },
      { at: 75, text: "Calibrating TCU Official Chapter Margins & Binding Standards..." },
      { at: 92, text: "Verifying Academic Citation Modules (APA 7th, IEEE, Harvard)..." },
      { at: 100, text: "Academic Workspace Ready" }
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setFading(true);
            setTimeout(() => setVisible(false), 600);
          }, 350);
          return 100;
        }

        const increment = Math.floor(Math.random() * 9) + 7;
        const next = Math.min(prev + increment, 100);

        const activeStage = stages.find((s) => next >= s.at && prev < s.at);
        if (activeStage) {
          setStatusMessage(activeStage.text);
        }

        if (next >= 100) {
          clearInterval(interval);
          setStatusMessage("Academic Workspace Ready");
          setTimeout(() => {
            setFading(true);
            setTimeout(() => setVisible(false), 600);
          }, 400);
          return 100;
        }

        return next;
      });
    }, 85);

    return () => clearInterval(interval);
  }, []);

  const handleSkip = () => {
    setFading(true);
    setTimeout(() => setVisible(false), 300);
  };

  if (!mounted || !visible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-white text-slate-800 transition-all duration-600 ease-out select-none ${
        fading ? "opacity-0 pointer-events-none scale-102" : "opacity-100 scale-100"
      }`}
      aria-label="Loading UniReportTZ Platform"
    >
      {/* Background ambient light effects (Clean White & Emerald Green) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-100/60 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[450px] h-[450px] bg-green-50/80 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Subtle academic geometric watermark */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.07] pointer-events-none" />

      {/* Main Brand Card Container */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-8 py-10 mx-4 bg-white/90 backdrop-blur-xl rounded-3xl border border-emerald-100/90 shadow-[0_20px_60px_-15px_rgba(16,185,129,0.12)] text-center space-y-6">
        
        {/* Official Crest Badge */}
        <div className="relative flex items-center justify-center">
          <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-emerald-500/20 via-green-400/20 to-teal-400/20 blur-md" />
          <div className="relative size-20 rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-800 p-4 shadow-xl shadow-emerald-700/25 flex items-center justify-center ring-4 ring-emerald-50">
            <GraduationCap className="size-10 text-white" />
            <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md border border-emerald-100">
              <CheckCircle2 className="size-4 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Brand Typography */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2.5">
            <h1 className="text-3xl font-black tracking-tight font-heading text-slate-900">
              UniReport<span className="text-emerald-600">TZ</span>
            </h1>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/90 tracking-wider">
              OFFICIAL SYSTEM
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium tracking-wide">
            Tanzania University Academic Documentation System
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full space-y-2.5 pt-1">
          <div className="flex items-center justify-between text-xs font-sans text-slate-600">
            <span className="truncate max-w-[270px] text-left text-[11px] text-emerald-800 font-semibold">
              {statusMessage}
            </span>
            <span className="font-bold text-emerald-600 pl-2 text-sm font-mono">{progress}%</span>
          </div>

          <div className="w-full h-2.5 bg-emerald-50 rounded-full overflow-hidden p-0.5 border border-emerald-200/80 shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 rounded-full transition-all duration-150 ease-out shadow-sm shadow-emerald-600/40"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Institutional Standards Badges */}
        <div className="flex items-center justify-center gap-2.5 text-[11px] text-slate-600 font-medium pt-1 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50/70 border border-emerald-100 text-emerald-800">
            <Building2 className="size-3 text-emerald-600" /> TCU Standards
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200/80 text-slate-700">
            <ShieldCheck className="size-3 text-emerald-600" /> Times New Roman
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200/80 text-slate-700">
            <BookOpen className="size-3 text-emerald-600" /> APA & IEEE
          </span>
        </div>

        {/* Quick entry button */}
        <button
          onClick={handleSkip}
          type="button"
          className="text-xs text-emerald-700 hover:text-emerald-800 bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200/70 px-4 py-1.5 rounded-full flex items-center gap-1.5 font-medium transition-all cursor-pointer group shadow-xs"
        >
          <span>Enter Academic Portal</span>
          <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
        </button>

      </div>
    </div>
  );
}
