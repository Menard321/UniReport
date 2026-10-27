"use client";

import React, { useState } from "react";
import { 
  X, 
  FileText, 
  Download, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  Printer, 
  FileEdit, 
  GraduationCap, 
  ChevronRight,
  ShieldCheck,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type ExportFormatType = "doc" | "pdf" | "cover";

export interface DocumentDownloadSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  isUnlocked?: boolean;
  onSelectFormat: (format: ExportFormatType) => void;
  onUnlockRequired?: (format: ExportFormatType) => void;
  feeTzs?: number;
}

export function DocumentDownloadSelectorModal({
  isOpen,
  onClose,
  documentTitle,
  isUnlocked = true,
  onSelectFormat,
  onUnlockRequired,
  feeTzs = 5000,
}: DocumentDownloadSelectorModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormatType>("doc");

  if (!isOpen) return null;

  const handleAction = (format: ExportFormatType) => {
    if (!isUnlocked && onUnlockRequired) {
      onUnlockRequired(format);
    } else {
      onSelectFormat(format);
      onClose();
    }
  };

  const formattedFee = new Intl.NumberFormat("en-TZ", {
    style: "currency",
    currency: "TZS",
    minimumFractionDigits: 0
  }).format(feeTzs);

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="download-modal-title"
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Close dialog"
        >
          <X className="size-5" />
        </button>

        {/* MODAL HEADER */}
        <div className="p-6 pb-4 border-b bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900 shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-10 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-sm">
              <Download className="size-5" />
            </div>
            <div>
              <h2 id="download-modal-title" className="text-xl font-bold font-heading text-slate-900 dark:text-white">
                Select Document Download Format
              </h2>
              <p className="text-xs text-muted-foreground">
                Choose how you want to download: editable in Microsoft Word or official publication PDF
              </p>
            </div>
          </div>
          
          <div className="mt-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/60 px-3 py-1.5 rounded-xl truncate flex items-center gap-2">
            <FileText className="size-3.5 text-teal-600 shrink-0" />
            <span className="truncate">{documentTitle || "Academic Field Report"}</span>
          </div>
        </div>

        {/* FORMAT CARDS CONTAINER */}
        <div className="p-6 overflow-y-auto space-y-3.5">
          {/* OPTION 1: MICROSOFT WORD (.DOCX / .DOC) */}
          <div
            onClick={() => setSelectedFormat("doc")}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
              selectedFormat === "doc"
                ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-600/20 shadow-md"
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3.5">
                <div className="size-11 rounded-2xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0 shadow-sm border border-blue-200 dark:border-blue-800">
                  <FileEdit className="size-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      Microsoft Word (.docx / .doc)
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 uppercase tracking-wide">
                      Fully Editable in Word
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Download and open directly in <strong>Microsoft Word</strong> on your computer. You can freely edit text, rewrite paragraphs, insert figures, and customize typography.
                  </p>
                  
                  <div className="mt-2.5 flex flex-wrap gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                    <span className="inline-flex items-center gap-1 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                      <CheckCircle2 className="size-3 text-blue-600" /> Editable Headings & Body
                    </span>
                    <span className="inline-flex items-center gap-1 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                      <CheckCircle2 className="size-3 text-blue-600" /> Preserved Tables & Layout
                    </span>
                    <span className="inline-flex items-center gap-1 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                      <CheckCircle2 className="size-3 text-blue-600" /> Official Cover Included
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 pt-0.5">
                <div className={`size-5 rounded-full border flex items-center justify-center ${
                  selectedFormat === "doc"
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-300 dark:border-slate-600"
                }`}>
                  {selectedFormat === "doc" && <div className="size-2 rounded-full bg-white" />}
                </div>
              </div>
            </div>

            <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">
                Opens directly in Microsoft Word (Windows & Mac)
              </span>
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction("doc");
                }}
                className="h-8 text-xs font-bold gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                {!isUnlocked && <Lock className="size-3.5 text-blue-200" />}
                <Download className="size-3.5" />
                {isUnlocked ? "Download Word Document" : `Unlock & Download (${formattedFee})`}
              </Button>
            </div>
          </div>

          {/* OPTION 2: PUBLICATION VECTOR PDF (.PDF) */}
          <div
            onClick={() => setSelectedFormat("pdf")}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
              selectedFormat === "pdf"
                ? "border-teal-600 bg-teal-50/50 dark:bg-teal-950/30 ring-2 ring-teal-600/20 shadow-md"
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3.5">
                <div className="size-11 rounded-2xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 shadow-sm border border-teal-200 dark:border-teal-800">
                  <Printer className="size-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      Academic Vector PDF (.pdf)
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200 uppercase tracking-wide">
                      Publication Ready / TCU Standard
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Official publication-grade PDF conforming strictly to Tanzanian university formatting standards, Roman numeral preliminaries, and A4 printing margins.
                  </p>

                  <div className="mt-2.5 flex flex-wrap gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                    <span className="inline-flex items-center gap-1 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                      <CheckCircle2 className="size-3 text-teal-600" /> Vector University Logo
                    </span>
                    <span className="inline-flex items-center gap-1 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                      <CheckCircle2 className="size-3 text-teal-600" /> Dynamic Dot-Leader TOC
                    </span>
                    <span className="inline-flex items-center gap-1 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                      <CheckCircle2 className="size-3 text-teal-600" /> A4 Margins (1.5&quot; left binding)
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 pt-0.5">
                <div className={`size-5 rounded-full border flex items-center justify-center ${
                  selectedFormat === "pdf"
                    ? "border-teal-600 bg-teal-600 text-white"
                    : "border-slate-300 dark:border-slate-600"
                }`}>
                  {selectedFormat === "pdf" && <div className="size-2 rounded-full bg-white" />}
                </div>
              </div>
            </div>

            <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">
                Ready for instant printing or electronic submission
              </span>
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction("pdf");
                }}
                className="h-8 text-xs font-bold gap-1.5 bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
              >
                {!isUnlocked && <Lock className="size-3.5 text-teal-200" />}
                <Download className="size-3.5" />
                {isUnlocked ? "Download PDF Document" : `Unlock & Download (${formattedFee})`}
              </Button>
            </div>
          </div>

          {/* OPTION 3: COVER PAGE ONLY (.PDF) */}
          <div
            onClick={() => setSelectedFormat("cover")}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              selectedFormat === "cover"
                ? "border-slate-400 bg-slate-50 dark:bg-slate-800/60 ring-2 ring-slate-400/20"
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                  <GraduationCap className="size-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                    Official University Cover Page Only (.pdf)
                    <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 font-semibold text-slate-700 dark:text-slate-300">
                      Single Page A4
                    </span>
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Extract only the official institutional cover sheet with university crest, registration details, and supervisor signature lines for binding.
                  </p>
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction("cover");
                }}
                className="h-7 text-xs font-semibold gap-1 shrink-0 border-slate-300 dark:border-slate-700"
              >
                {!isUnlocked && <Lock className="size-3 text-amber-500" />}
                <FileText className="size-3 text-teal-600" />
                Download Cover
              </Button>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
            <span>Unlocking grants permanent re-download access in both Word and PDF.</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-xs h-8"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => handleAction(selectedFormat)}
              className={`text-xs h-8 font-bold gap-1.5 ${
                selectedFormat === "doc"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : selectedFormat === "pdf"
                    ? "bg-teal-600 hover:bg-teal-700 text-white"
                    : "bg-slate-800 hover:bg-slate-900 text-white"
              }`}
            >
              {!isUnlocked && <Lock className="size-3" />}
              {isUnlocked
                ? `Proceed to Download (${selectedFormat === "doc" ? "Word DOCX" : selectedFormat === "pdf" ? "Vector PDF" : "Cover PDF"})`
                : `Unlock & Download (${formattedFee})`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
