"use client";

import { useState } from "react";
import { 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Layers, 
  Cpu, 
  GitFork, 
  ShieldCheck, 
  FileText, 
  X, 
  Sparkles,
  Calculator,
  ShieldAlert,
  Award,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompiledReportSpecification } from "@/lib/requirements/types";

interface PreFlightReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  specification: CompiledReportSpecification | null;
  compiledCalculations?: any[];
  compiledDiagrams?: any[];
  auditReport?: any;
  onConfirm: () => void;
  isGenerating?: boolean;
}

export function PreFlightReviewModal({
  isOpen,
  onClose,
  specification,
  compiledCalculations = [],
  compiledDiagrams = [],
  auditReport,
  onConfirm,
  isGenerating = false
}: PreFlightReviewModalProps) {
  const [activeTab, setActiveTab] = useState<"SPEC" | "AUDIT">("SPEC");

  if (!isOpen || !specification) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b flex items-start justify-between bg-slate-50/70 dark:bg-slate-950/40 rounded-t-2xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 uppercase tracking-wider">
                Pre-Flight Specification Review
              </span>
              <span className="text-xs text-muted-foreground">Tier 1–6 Precedence Verified</span>
              {auditReport && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                  auditReport.overallScore >= 80 
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300"
                    : "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300"
                }`}>
                  Audit Score: {auditReport.overallScore}/100
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold font-heading text-foreground">
              {specification.metadata.reportTitle}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {specification.metadata.universityName} • {specification.metadata.reportType}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Tab selection if audit report exists */}
        {auditReport && (
          <div className="px-6 pt-3 flex gap-2 border-b bg-slate-50/30 dark:bg-slate-900">
            <button
              onClick={() => setActiveTab("SPEC")}
              className={`pb-2 text-xs font-semibold px-3 border-b-2 transition ${
                activeTab === "SPEC"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Report Specification & Artifacts
            </button>
            <button
              onClick={() => setActiveTab("AUDIT")}
              className={`pb-2 text-xs font-semibold px-3 border-b-2 transition flex items-center gap-1.5 ${
                activeTab === "AUDIT"
                  ? "border-teal-600 text-teal-700 dark:text-teal-300"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Award className="size-3.5" />
              7-Tier Compliance Audit Results
            </button>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          
          {activeTab === "AUDIT" && auditReport ? (
            /* Compliance Audit Report View */
            <div className="space-y-4">
              <div className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase font-bold text-muted-foreground">Overall Compliance Rating</div>
                  <div className="text-2xl font-bold font-heading text-foreground mt-0.5">
                    {auditReport.overallScore}% - {auditReport.isCompliant ? "Institutional Standard Compliant" : "Needs Review"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Audited across Structural, Numerical, Visual, Citation, Privacy, Discipline & Render benchmarks.
                  </p>
                </div>
                <div className={`size-14 rounded-full flex items-center justify-center font-bold text-lg border-2 ${
                  auditReport.overallScore >= 80 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-400 dark:bg-emerald-950 dark:text-emerald-300"
                    : "bg-amber-50 text-amber-700 border-amber-400 dark:bg-amber-950 dark:text-amber-300"
                }`}>
                  {auditReport.overallScore}%
                </div>
              </div>

              {/* 7 Checks Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Verification Checkpoints</h4>
                {Object.entries(auditReport.checks || {}).map(([key, check]: [string, any]) => (
                  <div key={key} className="p-3 border rounded-xl bg-background flex items-start gap-3">
                    {check.passed ? (
                      <CheckCircle className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : check.severity === "ERROR" ? (
                      <XCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="size-4 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-foreground">{check.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          check.passed 
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : check.severity === "ERROR"
                            ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        }`}>
                          {check.passed ? "Passed" : check.severity}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{check.details}</p>
                      {check.remediation && (
                        <p className="text-[11px] text-teal-700 dark:text-teal-400 mt-1 bg-teal-50/50 dark:bg-teal-950/30 p-1.5 rounded">
                          💡 Remediation: {check.remediation}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Specification Review View */
            <>
              {/* Conflicts & Overrides Alert Banner */}
              {specification.conflicts && specification.conflicts.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 p-4 rounded-xl text-amber-900 dark:text-amber-200">
                  <div className="flex items-center gap-2 font-semibold text-xs uppercase tracking-wider mb-2">
                    <AlertTriangle className="size-4 text-amber-600" />
                    Institutional Precedence Notice
                  </div>
                  {specification.conflicts.map((conflict, i) => (
                    <p key={i} className="text-xs leading-relaxed">
                      <strong>{conflict.field}:</strong> {conflict.resolution} ({conflict.highTierRule.source} takes precedence over {conflict.lowTierRule.source}).
                    </p>
                  ))}
                </div>
              )}

              {/* Core Institutional Rules */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block">Citation Standard</span>
                  <span className="font-semibold text-sm text-primary">{specification.formatting.citationStyle}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block">Target Depth</span>
                  <span className="font-semibold text-sm">{specification.totalTargetWords.toLocaleString()} words</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block">Font & Margins</span>
                  <span className="font-semibold text-sm">{specification.formatting.fontFamily} (1.5" bind)</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block">Discipline Profile</span>
                  <span className="font-semibold text-sm capitalize">{specification.disciplineDirectives.disciplineId}</span>
                </div>
              </div>

              {/* Section Blueprint */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
                    <Layers className="size-4 text-primary" />
                    Compiled Chapter Blueprint ({specification.sections.length} Chapters)
                  </h3>
                </div>
                <div className="divide-y border rounded-xl overflow-hidden bg-background">
                  {specification.sections.map((sec) => (
                    <div key={sec.id} className="p-3 flex items-start justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                      <div>
                        <div className="font-semibold text-xs text-foreground flex items-center gap-2">
                          <span className="size-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center">
                            {sec.chapterNumber}
                          </span>
                          {sec.title}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                          {sec.subHeadings.join(" • ")}
                        </div>
                      </div>
                      <div className="text-right whitespace-nowrap">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-foreground">
                          ~{sec.wordBudget} words
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deterministic Calculations Preview */}
              {compiledCalculations && compiledCalculations.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-xs uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
                    <Calculator className="size-4 text-teal-600" />
                    Deterministic Mathematical Calculations (Zero AI Math Hallucination)
                  </h3>
                  <div className="space-y-2">
                    {compiledCalculations.map((calc: any, i: number) => (
                      <div key={i} className="p-3 bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/40 rounded-xl text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-teal-900 dark:text-teal-200">{calc.formulaName}</span>
                          <span className="font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-teal-200 text-teal-800 dark:text-teal-300 font-bold">
                            {calc.output?.formatted || calc.output?.value}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-[11px] italic">
                          Formula: {calc.latexEquation} • {calc.output?.interpretation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Structured Diagrams Preview */}
              {compiledDiagrams && compiledDiagrams.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-xs uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
                    <GitFork className="size-4 text-indigo-600" />
                    Structured Diagrams & Visuals ({compiledDiagrams.length} Diagrams Ready)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {compiledDiagrams.map((diag: any, i: number) => (
                      <div key={i} className="p-2.5 border rounded-xl bg-slate-50/50 dark:bg-slate-800/40 text-xs flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-indigo-600 shrink-0" />
                        <div className="truncate">
                          <div className="font-semibold text-foreground truncate">{diag.title}</div>
                          <div className="text-[10px] text-muted-foreground uppercase">{diag.diagramType} ({diag.format})</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Safety & Integrity Disclaimers */}
              {specification.disciplineDirectives.safetyWarnings && (
                <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-red-800 dark:text-red-200 text-xs">
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="size-4 text-red-600" />
                    Professional Review Requirement
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {specification.disciplineDirectives.safetyWarnings[0]}
                  </p>
                </div>
              )}

              {/* Ethical Safeguards Banner (e.g. Health Zero PII / NIMR) */}
              {specification.disciplineDirectives.ethicalSafeguards && (
                <div className="p-3 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/50 rounded-xl text-teal-800 dark:text-teal-200 text-xs">
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <ShieldAlert className="size-4 text-teal-600" />
                    Ethical Safeguards & Privacy Enforced
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {specification.disciplineDirectives.ethicalSafeguards[0]}
                  </p>
                </div>
              )}
            </>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40 rounded-b-2xl">
          <Button variant="outline" onClick={onClose} disabled={isGenerating}>
            Modify Inputs
          </Button>
          <Button onClick={onConfirm} disabled={isGenerating} className="gap-2 bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
            {isGenerating ? "Orchestrating Report..." : "Confirm & Begin Exhaustive Generation"}
          </Button>
        </div>

      </div>
    </div>
  );
}
