"use client";

import { useState } from "react";
import { 
  FileCheck, 
  Search, 
  Plus, 
  Filter, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ChevronRight, 
  Edit3, 
  Eye, 
  History, 
  Upload, 
  X,
  BookOpen,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Guideline {
  id: string;
  university: string;
  reportType: string;
  citationStyle: "APA 7th" | "IEEE" | "Harvard" | "Chicago";
  version: string;
  status: "PUBLISHED" | "VERIFIED" | "PENDING_VERIFICATION" | "DRAFT";
  effectiveYear: string;
  reviewer: string;
  verifiedAt: string;
  requiredChapters: string[];
  formatting: {
    font: string;
    fontSize: string;
    lineSpacing: string;
    leftMargin: string;
    otherMargins: string;
  };
}

export default function AdminGuidelinesPage() {
  const [guidelines, setGuidelines] = useState<Guideline[]>([
    {
      id: "g_udsm_fyp",
      university: "UDSM (CoICT)",
      reportType: "Final Year Project (FYP)",
      citationStyle: "IEEE",
      version: "v3.2 (2025/2026)",
      status: "PUBLISHED",
      effectiveYear: "2025 - Present",
      reviewer: "Prof. N. Mvungi (Verified)",
      verifiedAt: "2026-08-14",
      requiredChapters: [
        "Chapter 1: Introduction & Background",
        "Chapter 2: Literature Review & Related Work",
        "Chapter 3: Methodology & System Requirements",
        "Chapter 4: System Design & Architecture",
        "Chapter 5: Implementation, Testing & Results",
        "Chapter 6: Conclusion, Limitations & Recommendations"
      ],
      formatting: {
        font: "Times New Roman",
        fontSize: "10 pt Body (14pt / 12pt Headings)",
        lineSpacing: "1.5 Lines",
        leftMargin: "1.5 inches (Binding)",
        otherMargins: "1.0 inch"
      }
    },
    {
      id: "g_sua_pt",
      university: "SUA (Agriculture)",
      reportType: "Practical Training (PT / IPT)",
      citationStyle: "Harvard",
      version: "v2.0 (2025)",
      status: "PUBLISHED",
      effectiveYear: "2024 - Present",
      reviewer: "Dr. E. Kiranga",
      verifiedAt: "2026-07-20",
      requiredChapters: [
        "Chapter 1: Introduction & Company Profile",
        "Chapter 2: Departmental Operations",
        "Chapter 3: Tasks Executed & Technical Skills",
        "Chapter 4: Challenges, Solutions & Evaluation",
        "Chapter 5: Recommendations & Conclusion"
      ],
      formatting: {
        font: "Times New Roman",
        fontSize: "10 pt Body (14pt / 12pt Headings)",
        lineSpacing: "1.5 Lines",
        leftMargin: "1.25 inches",
        otherMargins: "1.0 inch"
      }
    },
    {
      id: "g_udom_diss",
      university: "UDOM (CIVE)",
      reportType: "Postgraduate Masters Dissertation",
      citationStyle: "APA 7th",
      version: "v4.1 (2026)",
      status: "VERIFIED",
      effectiveYear: "2026 - Present",
      reviewer: "Dr. K. Mtebe",
      verifiedAt: "2026-09-10",
      requiredChapters: [
        "Chapter 1: Introduction & Research Problem",
        "Chapter 2: Theoretical & Literature Review",
        "Chapter 3: Research Design & Methodology",
        "Chapter 4: Data Analysis & Empirical Findings",
        "Chapter 5: Discussion & Synthesis",
        "Chapter 6: Summary & Policy Implications"
      ],
      formatting: {
        font: "Times New Roman",
        fontSize: "10 pt Body (14pt / 12pt Headings)",
        lineSpacing: "2.0 (Double Spaced)",
        leftMargin: "1.5 inches",
        otherMargins: "1.0 inch"
      }
    },
    {
      id: "g_dit_eng",
      university: "DIT (Engineering)",
      reportType: "Final Year Design Project",
      citationStyle: "IEEE",
      version: "v2.4",
      status: "PENDING_VERIFICATION",
      effectiveYear: "2025/2026",
      reviewer: "Academic Committee",
      verifiedAt: "Pending",
      requiredChapters: [
        "Chapter 1: Project Overview & Objectives",
        "Chapter 2: Theoretical Background",
        "Chapter 3: Engineering Design Calculations",
        "Chapter 4: Prototype Construction & Assembly",
        "Chapter 5: Performance Testing & Costing",
        "Chapter 6: Conclusion & Safety Recommendations"
      ],
      formatting: {
        font: "Times New Roman",
        fontSize: "10 pt Body (14pt / 12pt Headings)",
        lineSpacing: "1.5 Lines",
        leftMargin: "1.5 inches",
        otherMargins: "1.0 inch"
      }
    }
  ]);

  const [search, setSearch] = useState("");
  const [selectedGuideline, setSelectedGuideline] = useState<Guideline | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [feedback, setFeedback] = useState("");

  const filtered = guidelines.filter((g) => {
    const matchesSearch = 
      g.university.toLowerCase().includes(search.toLowerCase()) ||
      g.reportType.toLowerCase().includes(search.toLowerCase()) ||
      g.citationStyle.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || g.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (id: string, newStatus: Guideline["status"]) => {
    setGuidelines(guidelines.map(g => g.id === id ? { ...g, status: newStatus } : g));
    if (selectedGuideline && selectedGuideline.id === id) {
      setSelectedGuideline({ ...selectedGuideline, status: newStatus });
    }
    setFeedback(`Guideline status updated to ${newStatus}`);
    setTimeout(() => setFeedback(""), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight flex items-center gap-2">
            <FileCheck className="size-6 text-teal-400" />
            Academic Guidelines & Formats
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Configure institutional chapter blueprints, formatting margins, and citation compliance rules.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="text-xs bg-teal-500 text-slate-950 hover:bg-teal-400 font-semibold"
            onClick={() => {
              const newG: Guideline = {
                id: `g_${Date.now()}`,
                university: "New Institution",
                reportType: "Final Year Project",
                citationStyle: "APA 7th",
                version: "v1.0",
                status: "DRAFT",
                effectiveYear: "2026",
                reviewer: "Pending Assignment",
                verifiedAt: "Pending",
                requiredChapters: [
                  "Chapter 1: Introduction",
                  "Chapter 2: Literature Review",
                  "Chapter 3: Methodology",
                  "Chapter 4: Results",
                  "Chapter 5: Conclusion"
                ],
                formatting: {
                  font: "Times New Roman",
                  fontSize: "12 pt",
                  lineSpacing: "1.5 Lines",
                  leftMargin: "1.5 inches",
                  otherMargins: "1.0 inch"
                }
              };
              setGuidelines([newG, ...guidelines]);
              setSelectedGuideline(newG);
              setIsDetailModalOpen(true);
            }}
          >
            <Plus className="size-3.5 mr-1.5" /> Create Guideline Spec
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg text-xs text-teal-300 flex items-center gap-2">
          <CheckCircle2 className="size-4 shrink-0" />
          {feedback}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="size-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search university, report type, or citation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Filter className="size-3.5 text-slate-500" />
          <span>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 px-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="VERIFIED">Verified</option>
            <option value="PENDING_VERIFICATION">Pending Verification</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
      </div>

      {/* Guidelines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((g) => (
          <div
            key={g.id}
            className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-5 shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                    {g.university}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5">{g.reportType}</h3>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                  g.status === "PUBLISHED"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : g.status === "VERIFIED"
                    ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                    : g.status === "PENDING_VERIFICATION"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-slate-800 text-slate-400"
                }`}>
                  {g.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 my-3 py-2.5 px-3 bg-slate-950/60 rounded-lg border border-slate-800 text-[11px] font-mono">
                <div>
                  <span className="text-slate-500 block">Style</span>
                  <strong className="text-slate-200">{g.citationStyle}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Version</span>
                  <strong className="text-slate-200">{g.version}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Effective</span>
                  <strong className="text-slate-200">{g.effectiveYear}</strong>
                </div>
              </div>

              <div className="space-y-1.5 mt-3">
                <span className="text-[11px] text-slate-400 font-semibold block">Required Chapters ({g.requiredChapters.length}):</span>
                <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                  {g.requiredChapters.slice(0, 3).map((ch, idx) => (
                    <div key={idx} className="text-[11px] text-slate-300 flex items-center gap-1.5 truncate">
                      <span className="size-1 rounded-full bg-teal-400 shrink-0" />
                      {ch}
                    </div>
                  ))}
                  {g.requiredChapters.length > 3 && (
                    <div className="text-[10px] text-slate-500 font-mono italic">
                      + {g.requiredChapters.length - 3} more sections defined
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 font-mono truncate">
                Verifier: {g.reviewer}
              </span>
              <button
                onClick={() => {
                  setSelectedGuideline(g);
                  setIsDetailModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold text-xs flex items-center gap-1 transition-colors border border-slate-700"
              >
                Inspect Spec <ChevronRight className="size-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Guideline Specification Modal Dialog */}
      {isDetailModalOpen && selectedGuideline && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                  {selectedGuideline.university}
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {selectedGuideline.reportType} Blueprint Specification
                </h3>
              </div>
              <button onClick={() => setIsDetailModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="size-5" />
              </button>
            </div>

            {/* Status Transition Control Bar */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Current Status: <strong className="text-white">{selectedGuideline.status}</strong></span>
              <div className="flex items-center gap-2">
                {selectedGuideline.status !== "PUBLISHED" && (
                  <Button
                    size="sm"
                    className="text-xs bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold"
                    onClick={() => handleUpdateStatus(selectedGuideline.id, "PUBLISHED")}
                  >
                    Publish to Students
                  </Button>
                )}
                {selectedGuideline.status !== "VERIFIED" && selectedGuideline.status !== "PUBLISHED" && (
                  <Button
                    size="sm"
                    className="text-xs bg-teal-600 text-white hover:bg-teal-500"
                    onClick={() => handleUpdateStatus(selectedGuideline.id, "VERIFIED")}
                  >
                    Mark Verified
                  </Button>
                )}
              </div>
            </div>

            {/* Formatting specs */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
                Typography & Margin Standards
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-950/70 p-3.5 rounded-lg border border-slate-800 font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">Typeface</span>
                  <span className="text-slate-200 font-semibold">{selectedGuideline.formatting.font}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Font Size</span>
                  <span className="text-slate-200 font-semibold">{selectedGuideline.formatting.fontSize}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Line Spacing</span>
                  <span className="text-slate-200 font-semibold">{selectedGuideline.formatting.lineSpacing}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Left Margin (Binding)</span>
                  <span className="text-slate-200 font-semibold">{selectedGuideline.formatting.leftMargin}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Top/Right/Bottom</span>
                  <span className="text-slate-200 font-semibold">{selectedGuideline.formatting.otherMargins}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Citation Rule</span>
                  <span className="text-teal-400 font-semibold">{selectedGuideline.citationStyle}</span>
                </div>
              </div>
            </div>

            {/* Chapters */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
                Structured Chapter Hierarchy
              </h4>
              <div className="space-y-1.5 bg-slate-950/70 p-3.5 rounded-lg border border-slate-800">
                {selectedGuideline.requiredChapters.map((ch, idx) => (
                  <div key={idx} className="p-2 bg-slate-900 rounded border border-slate-800/80 text-xs text-slate-200 flex items-center justify-between">
                    <span>{ch}</span>
                    <span className="text-[10px] font-mono text-teal-400">Section {idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDetailModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
