"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Building2, BookOpen, ChevronRight, Check } from "lucide-react";

export function StartupLoader() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(15);
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
          }, 400);
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
          }, 450);
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
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center transition-all duration-600 ease-out select-none ${
        fading ? "opacity-0 pointer-events-none scale-102" : "opacity-100 scale-100"
      }`}
      style={{
        backgroundImage: "url('/images/startup-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#064e3b"
      }}
      aria-label="Loading UniReportTZ Platform"
    >
      {/* Soft overlay to ensure high contrast and readability on any screen */}
      <div className="absolute inset-0 bg-emerald-950/10 backdrop-blur-[1px] pointer-events-none" />

      {/* Main Glassmorphic Card Container */}
      <div className="relative z-10 flex flex-col items-center max-w-[490px] w-full px-8 py-9 mx-4 bg-white/95 backdrop-blur-xl rounded-[32px] border border-white/90 shadow-[0_25px_70px_rgba(4,78,57,0.22),0_0_40px_rgba(16,185,129,0.12)] text-center space-y-6">
        
        {/* Official Crest Badge with Glowing Ring & Verified Seal */}
        <div className="relative flex items-center justify-center">
          <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-emerald-500/25 via-green-400/25 to-teal-400/20 blur-md" />
          <div className="relative size-20 rounded-[22px] bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-700 p-4 shadow-[0_10px_25px_rgba(5,150,105,0.4)] flex items-center justify-center ring-4 ring-white">
            <GraduationCap className="size-11 text-white drop-shadow-sm" />
            
            {/* White Checkmark Seal Badge */}
            <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow-md border border-emerald-100 flex items-center justify-center">
              <div className="size-5 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-xs">
                <Check className="size-3.5 stroke-[3]" />
              </div>
            </div>
          </div>
        </div>

        {/* Brand Typography */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-center gap-2.5">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight font-heading text-slate-900">
              UniReport<span className="text-emerald-500">TZ</span>
            </h1>
            <span className="text-[10px] font-extrabold px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/90 tracking-wider uppercase">
              OFFICIAL SYSTEM
            </span>
          </div>
          <p 
            className="text-[13px] text-slate-700 font-semibold tracking-wide"
            style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif' }}
          >
            Tanzania University Academic Documentation System
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs font-sans text-slate-700">
            <span className="truncate max-w-[320px] text-left text-[11px] text-slate-800 font-bold">
              {statusMessage}
            </span>
            <span className="font-extrabold text-emerald-600 pl-2 text-sm font-mono">{progress}%</span>
          </div>

          <div className="w-full h-3 bg-emerald-100/70 rounded-full overflow-hidden p-0.5 border border-emerald-200/80 shadow-inner relative">
            <div 
              className="h-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-400 rounded-full transition-all duration-150 ease-out shadow-[0_0_12px_rgba(16,185,129,0.7)] relative"
              style={{ width: `${progress}%` }}
            >
              {/* Bright glowing gleam dot at the tip */}
              <div className="absolute right-0.5 top-1/2 -translate-y-1/2 size-2 bg-white rounded-full shadow-[0_0_6px_#fff]" />
            </div>
          </div>
        </div>

        {/* Institutional Standards Badges (Three pills in a row) */}
        <div className="flex items-center justify-center gap-2 text-xs font-medium pt-1 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/70 text-slate-700 font-semibold shadow-xs">
            <Building2 className="size-3.5 text-emerald-600" />
            <span>TCU Standards</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/70 text-slate-700 font-semibold shadow-xs">
            <span className="text-emerald-700 font-serif font-black text-xs">Aa</span>
            <span>Times New Roman</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/70 text-slate-700 font-semibold shadow-xs">
            <BookOpen className="size-3.5 text-emerald-600" />
            <span>APA & IEEE</span>
          </span>
        </div>

        {/* Enter Academic Portal Pill Button */}
        <div className="pt-2">
          <button
            onClick={handleSkip}
            type="button"
            className="text-xs text-white font-semibold bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-700 hover:from-emerald-900 hover:to-green-800 px-6 py-2.5 rounded-full flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-[0_6px_20px_rgba(4,78,57,0.35)] ring-2 ring-emerald-500/25"
          >
            <div className="size-4 rounded-full bg-white/20 flex items-center justify-center">
              <ChevronRight className="size-3 text-white stroke-[2.5]" />
            </div>
            <span>Enter Academic Portal</span>
          </button>
        </div>

      </div>
    </div>
  );
}
