"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  Check,
  RefreshCw,
  Loader2,
  X,
  BookOpen,
  Briefcase,
  Wrench,
  AlertTriangle,
  GraduationCap,
  Info,
  Pencil,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ComprehensiveFieldReportSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: {
    activities: string;
    toolsUsed: string;
    challenges: string;
    keyLearnings: string;
  }) => void;
  reportTitle: string;
  onUpdateTitle?: (newTitle: string) => void;
  organization?: string;
  department?: string;
  programmeId?: string;
  duration?: string;
  currentValues?: {
    activities: string;
    toolsUsed: string;
    challenges: string;
    keyLearnings: string;
  };
}

export function ComprehensiveFieldReportSuggestionModal({
  isOpen,
  onClose,
  onApply,
  reportTitle,
  onUpdateTitle,
  organization = "",
  department = "",
  programmeId = "",
  duration = "",
  currentValues,
}: ComprehensiveFieldReportSuggestionModalProps) {
  const [activeTitle, setActiveTitle] = useState(reportTitle || "");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Editable state for the 4 core sections
  const [activities, setActivities] = useState(currentValues?.activities || "");
  const [toolsUsed, setToolsUsed] = useState(currentValues?.toolsUsed || "");
  const [challenges, setChallenges] = useState(currentValues?.challenges || "");
  const [keyLearnings, setKeyLearnings] = useState(currentValues?.keyLearnings || "");

  // Fetch suggestions strictly based on report title
  const generateSuggestions = async (titleToUse: string) => {
    const cleanTitle = titleToUse.trim();
    if (!cleanTitle) {
      setErrorMessage("Please provide a report title to generate relevant suggestions.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/suggestions/placement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportTitle: cleanTitle,
          organization,
          department,
          programmeId,
          duration,
          mode: "all_from_title"
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const json = await res.json();
      if (json.success && json.data) {
        setActivities(json.data.activities || "");
        setToolsUsed(json.data.toolsUsed || "");
        setChallenges(json.data.challenges || "");
        setKeyLearnings(json.data.keyLearnings || "");
      } else {
        throw new Error(json.error || "Failed to generate suggestions");
      }
    } catch (err: any) {
      console.error("[COMPREHENSIVE_SUGGESTION_FETCH_ERROR]", err);
      setErrorMessage(
        "Could not load suggestions automatically. You can edit the fields below or retry."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // On open: sync title and trigger generation if not already loaded
  useEffect(() => {
    if (isOpen) {
      const currentTitle = reportTitle.trim();
      setActiveTitle(currentTitle);
      
      // If we don't have existing content in modal or if title was provided, generate
      if (currentTitle) {
        generateSuggestions(currentTitle);
      } else {
        setIsEditingTitle(true);
      }
    }
  }, [isOpen, reportTitle]);

  if (!isOpen) return null;

  const handleApplyAll = () => {
    onApply({
      activities: activities.trim(),
      toolsUsed: toolsUsed.trim(),
      challenges: challenges.trim(),
      keyLearnings: keyLearnings.trim()
    });
    if (onUpdateTitle && activeTitle.trim() && activeTitle !== reportTitle) {
      onUpdateTitle(activeTitle.trim());
    }
    onClose();
  };

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (activeTitle.trim()) {
      generateSuggestions(activeTitle.trim());
      if (onUpdateTitle) {
        onUpdateTitle(activeTitle.trim());
      }
    }
  };

  const hasAnyContent = Boolean(
    activities.trim() || toolsUsed.trim() || challenges.trim() || keyLearnings.trim()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-gradient-to-r from-teal-50/70 via-slate-50/50 to-emerald-50/70 dark:from-teal-950/30 dark:via-slate-900/50 dark:to-emerald-950/30">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-teal-600 text-white shadow-xs">
                <Sparkles className="size-4" />
              </span>
              <h2 className="text-base sm:text-lg font-bold font-heading text-foreground">
                AI Practical Training Suggestions
              </h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                All 4 Sections
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Review and edit the suggested details below before inserting them into your report.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Focus Banner: Report Title */}
        <div className="px-4 sm:px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-start sm:items-center gap-2 flex-1 min-w-0">
              <BookOpen className="size-4 text-teal-600 shrink-0 mt-0.5 sm:mt-0" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground shrink-0">
                Based on Report Title:
              </span>
              
              {!isEditingTitle ? (
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <span className="text-xs font-semibold text-foreground truncate uppercase bg-white dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                    {activeTitle || "(No title entered yet)"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEditingTitle(true)}
                    className="p-1 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                    title="Edit report title"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <input
                    type="text"
                    value={activeTitle}
                    onChange={(e) => setActiveTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleTitleSubmit();
                    }}
                    placeholder="Enter your official report title..."
                    className="flex-1 p-1.5 text-xs rounded-md border bg-background font-semibold uppercase focus:outline-none focus:ring-1 focus:ring-teal-500"
                    autoFocus
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleTitleSubmit}
                    className="text-xs h-7 px-2"
                  >
                    Set
                  </Button>
                </div>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => generateSuggestions(activeTitle)}
              disabled={isLoading || !activeTitle.trim()}
              className="text-xs h-7 gap-1.5 font-medium shrink-0 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800 hover:bg-teal-50 dark:hover:bg-teal-950/50"
            >
              {isLoading ? (
                <Loader2 className="size-3 animate-spin text-teal-600" />
              ) : (
                <RefreshCw className="size-3 text-teal-600" />
              )}
              Regenerate All from Title
            </Button>
          </div>
        </div>

        {/* Scrollable Content Body with 4 Editable Cards */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {errorMessage && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <Info className="size-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="size-8 animate-spin text-teal-600" />
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">
                  Analyzing Title: &quot;{activeTitle}&quot;
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Formulating defense-ready technical tasks, tools, challenges & learnings...
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* SECTION 1: ACTIVITIES & TASKS PERFORMED */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-3.5 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wide text-foreground flex items-center gap-1.5">
                    <Briefcase className="size-3.5 text-teal-600" />
                    1. Activities & Tasks Performed
                  </label>
                  <span className="text-[11px] text-muted-foreground italic">
                    Editable
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Specific engineering procedures, operational duties, and testing routines.
                </p>
                <textarea
                  rows={4}
                  value={activities}
                  onChange={(e) => setActivities(e.target.value)}
                  placeholder="1. Conducted technical site assessments...&#10;2. Configured and tested equipment...&#10;3. Executed preventive maintenance protocols..."
                  className="w-full text-xs p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-foreground resize-y leading-relaxed focus:outline-none focus:ring-1 focus:ring-teal-500 font-sans"
                />
              </div>

              {/* SECTION 2: TOOLS, EQUIPMENT & SOFTWARE USED */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-3.5 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wide text-foreground flex items-center gap-1.5">
                    <Wrench className="size-3.5 text-teal-600" />
                    2. Tools, Equipment & Software Used
                  </label>
                  <span className="text-[11px] text-muted-foreground italic">
                    Editable
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Instruments, diagnostic hardware, software suites, or calibration meters.
                </p>
                <textarea
                  rows={2}
                  value={toolsUsed}
                  onChange={(e) => setToolsUsed(e.target.value)}
                  placeholder="e.g. Multimeter (Fluke 87V), Wireshark, VS Code, AutoCAD, Pyranometer, Torque Wrench..."
                  className="w-full text-xs p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-foreground resize-y leading-relaxed focus:outline-none focus:ring-1 focus:ring-teal-500 font-sans"
                />
              </div>

              {/* SECTION 3: CHALLENGES ENCOUNTERED */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-3.5 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wide text-foreground flex items-center gap-1.5">
                    <AlertTriangle className="size-3.5 text-teal-600" />
                    3. Challenges Encountered & Mitigations
                  </label>
                  <span className="text-[11px] text-muted-foreground italic">
                    Editable
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Authentic operational bottlenecks and practical technical solutions applied.
                </p>
                <textarea
                  rows={3}
                  value={challenges}
                  onChange={(e) => setChallenges(e.target.value)}
                  placeholder="1. Parameter variance during operational loads; mitigated by systematic recalibration...&#10;2. Intermittent link losses; resolved by inspecting connectors and applying proper shielding..."
                  className="w-full text-xs p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-foreground resize-y leading-relaxed focus:outline-none focus:ring-1 focus:ring-teal-500 font-sans"
                />
              </div>

              {/* SECTION 4: KEY LEARNINGS & COMPETENCIES */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-3.5 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wide text-foreground flex items-center gap-1.5">
                    <GraduationCap className="size-3.5 text-teal-600" />
                    4. Key Learnings & Competencies Acquired
                  </label>
                  <span className="text-[11px] text-muted-foreground italic">
                    Editable
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Curriculum synthesis, industry standards (e.g. TBS/EWURA/OSHA), and skills.
                </p>
                <textarea
                  rows={3}
                  value={keyLearnings}
                  onChange={(e) => setKeyLearnings(e.target.value)}
                  placeholder="1. Hands-on competence in equipment diagnostic routines and compliance testing...&#10;2. Understanding of industrial workplace safety standards and standard operating procedures...&#10;3. Enhanced technical documentation and cross-departmental problem resolution..."
                  className="w-full text-xs p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-foreground resize-y leading-relaxed focus:outline-none focus:ring-1 focus:ring-teal-500 font-sans"
                />
              </div>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={handleApplyAll}
              disabled={isLoading || !hasAnyContent}
              className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold gap-1.5 shadow-sm px-4 h-9"
            >
              <Check className="size-3.5" />
              Accept & Apply All (4 Fields)
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
