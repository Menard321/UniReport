"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Save,
  Download,
  ImagePlus,
  FileText,
  Sparkles,
  RefreshCw,
  Eye,
  Edit3,
  Columns,
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  Table as TableIcon,
  AlertCircle,
  Lock,
  Unlock,
  Phone,
  CreditCard,
  Building2,
  X,
  ChevronDown,
  Loader2,
  FileEdit,
  Printer,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocxCompilerEngine } from "@/lib/export/docx-compiler";
import AcademicAlerts from "@/lib/sweetalert";
import { DocumentDownloadSelectorModal, ExportFormatType } from "@/components/export/DocumentDownloadSelectorModal";

export default function DocumentEditorPage() {
  const params = useParams();
  const router = useRouter();
  const docId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  // Document state
  const [title, setTitle] = useState("Loading Document...");
  const [content, setContent] = useState("");
  const [toolType, setToolType] = useState("field-report");
  const [isPaid, setIsPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Editor UI state: Default to formatted DOCX Document view!
  const [viewMode, setViewMode] = useState<"document" | "markdown">("document");
  const [isEditingEnabled, setIsEditingEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Image Upload state & refs
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Payment & Download Format Modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showFormatSelectorModal, setShowFormatSelectorModal] = useState(false);
  const [pendingExportFormat, setPendingExportFormat] = useState<ExportFormatType>("doc");
  const [paymentMode, setPaymentMode] = useState<"mobile" | "card">("mobile");
  const [paymentProvider, setPaymentProvider] = useState<"M-Pesa" | "Tigo Pesa" | "Airtel Money" | "HaloPesa">("M-Pesa");
  const [phoneNumber, setPhoneNumber] = useState("0747461380");
  const [selectedBank, setSelectedBank] = useState("CRDB Bank");
  const [bankReference, setBankReference] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [feeTzs, setFeeTzs] = useState(5000);

  // Fetch active system pricing
  useEffect(() => {
    fetch("/api/pricing")
      .then((r) => r.json())
      .then((d) => {
        if (d.pricing?.singleDocumentExportTzs) {
          setFeeTzs(d.pricing.singleDocumentExportTzs);
        }
      })
      .catch(() => {});
  }, []);

  // 1. Fetch document on mount
  useEffect(() => {
    if (!docId) return;

    async function fetchDoc() {
      setIsLoading(true);
      setLoadError(null);
      try {
        const res = await fetch(`/api/documents/${docId}`);
        if (!res.ok) {
          throw new Error(`Failed to load document (Status: ${res.status})`);
        }
        const data = await res.json();
        if (data.document) {
          setTitle(data.document.title || "Academic Report");
          setContent(data.document.content || "");
          setToolType(data.document.toolType || "field-report");
          setIsPaid(Boolean(data.document.isPaid));
          setHasUnsavedChanges(false);
        } else {
          throw new Error("Document not found");
        }
      } catch (err: any) {
        console.error("Error fetching document:", err);
        setLoadError(err.message || "Failed to load document");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDoc();
  }, [docId]);

  // Direct Document ExecCommand formatter for DOCX Document mode
  const executeExecCommand = (command: string, value: string = "") => {
    if (typeof document !== "undefined") {
      document.execCommand(command, false, value);
      setHasUnsavedChanges(true);
    }
  };

  // Sync sheet text changes back into document content
  const handleSheetBlur = (index: number, newHtml: string) => {
    if (typeof document !== "undefined") {
      const sheetEls = document.querySelectorAll(".sheet-content");
      if (sheetEls.length > 0) {
        const joined = Array.from(sheetEls)
          .map((el) => el.innerHTML)
          .join("\n\n<!-- PAGE_BREAK -->\n\n");
        setContent(joined);
        setHasUnsavedChanges(true);
      }
    }
  };

  // 2. Save document to API
  const handleSave = async () => {
    if (!docId || isSaving) return;
    setIsSaving(true);
    try {
      let finalContent = content;
      // In document view, gather latest edited innerHTML from sheets
      if (viewMode === "document" && typeof document !== "undefined") {
        const sheetEls = document.querySelectorAll(".sheet-content");
        if (sheetEls.length > 0) {
          finalContent = Array.from(sheetEls)
            .map((el) => el.innerHTML)
            .join("\n\n<!-- PAGE_BREAK -->\n\n");
          setContent(finalContent);
        }
      }

      const res = await fetch(`/api/documents/${docId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: finalContent
        })
      });

      if (res.ok) {
        setHasUnsavedChanges(false);
        const now = new Date();
        setLastSavedTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
        AcademicAlerts.toast("Document saved to cloud!", "success");
      } else {
        AcademicAlerts.error("Save Failed", "Failed to save changes. Please try again.");
      }
    } catch (e) {
      console.error("Save error:", e);
      AcademicAlerts.error("Cloud Save Error", "Error saving document to cloud.");
    } finally {
      setIsSaving(false);
    }
  };

  // Keyboard shortcut Ctrl+S / Cmd+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [title, content, docId, isSaving, viewMode]);

  // 3. Insert Image / Figure into Content
  const handleTriggerImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    // Check size (max 8MB for Data URL performance)
    if (file.size > 8 * 1024 * 1024) {
      AcademicAlerts.warning("File Too Large", "Please select an image smaller than 8MB.");
      return;
    }

    setIsUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUrl = loadEvent.target?.result as string;
        if (!dataUrl) return;

        const defaultCaption = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        const userCaption = window.prompt("Enter Caption / Title for this Figure:", defaultCaption) || defaultCaption;

        if (viewMode === "document") {
          const imageHtml = `<figure class="academic-figure" style="text-align: center; margin: 16pt 0;"><img src="${dataUrl}" alt="${userCaption}" style="max-width: 85%; max-height: 400px; border-radius: 6px; border: 1px solid #cbd5e1; display: block; margin: 0 auto;" /><figcaption style="font-size: 10pt; font-style: italic; color: #475569; margin-top: 6pt;">Figure: ${userCaption}</figcaption></figure>`;
          if (typeof document !== "undefined") {
            document.execCommand("insertHTML", false, imageHtml);
            setHasUnsavedChanges(true);
          }
        } else {
          const imageMarkdown = `\n\n![Figure: ${userCaption}](${dataUrl})\n*Figure: ${userCaption}*\n\n`;
          const textarea = textareaRef.current;
          if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newContent = content.substring(0, start) + imageMarkdown + content.substring(end);
            setContent(newContent);
            setHasUnsavedChanges(true);
            setTimeout(() => {
              textarea.focus();
              textarea.selectionStart = textarea.selectionEnd = start + imageMarkdown.length;
            }, 50);
          } else {
            setContent((prev) => prev + imageMarkdown);
            setHasUnsavedChanges(true);
          }
        }
        setIsUploadingImage(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Image read error:", err);
      AcademicAlerts.error("Image Error", "Failed to process image file.");
      setIsUploadingImage(false);
    }
  };

  // 4. Formatting toolbar helpers
  const insertFormatting = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const replacement = `${prefix}${selected || "text"}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
    setHasUnsavedChanges(true);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + replacement.length - suffix.length);
    }, 50);
  };

  const insertTableTemplate = () => {
    if (viewMode === "document") {
      const tableHtml = `
      <table class="academic-table" style="width: 100%; border-collapse: collapse; margin: 14pt 0; font-size: 9.5pt;">
        <thead>
          <tr style="background-color: #f1f5f9;">
            <th style="border: 1px solid #0f172a; padding: 6pt 8pt; text-align: left;">Item / Parameter</th>
            <th style="border: 1px solid #0f172a; padding: 6pt 8pt; text-align: left;">Specification / Description</th>
            <th style="border: 1px solid #0f172a; padding: 6pt 8pt; text-align: left;">Remarks</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #0f172a; padding: 6pt 8pt;">Metric A</td>
            <td style="border: 1px solid #0f172a; padding: 6pt 8pt;">Standard Parameter Value</td>
            <td style="border: 1px solid #0f172a; padding: 6pt 8pt;">Fully Verified</td>
          </tr>
          <tr>
            <td style="border: 1px solid #0f172a; padding: 6pt 8pt;">Metric B</td>
            <td style="border: 1px solid #0f172a; padding: 6pt 8pt;">Operational Reading</td>
            <td style="border: 1px solid #0f172a; padding: 6pt 8pt;">In Specification</td>
          </tr>
        </tbody>
      </table>`;
      if (typeof document !== "undefined") {
        document.execCommand("insertHTML", false, tableHtml);
        setHasUnsavedChanges(true);
      }
    } else {
      const tableTemplate = `\n\n| Item / Parameter | Specification / Description | Remarks |\n| :--- | :--- | :--- |\n| Metric A | Standard Parameter Value | Fully Verified |\n| Metric B | Operational Reading | In Specification |\n\n`;
      insertFormatting(tableTemplate, "");
    }
  };

  // 5. Document Export & Format triggers
  const getDocumentExportOptions = () => {
    let currentContent = content;
    if (typeof document !== "undefined" && viewMode === "document") {
      const sheetEls = document.querySelectorAll(".sheet-content");
      if (sheetEls.length > 0) {
        currentContent = Array.from(sheetEls)
          .map((el) => el.innerHTML)
          .join("\n\n<!-- PAGE_BREAK -->\n\n");
      }
    }

    const uniMatch = currentContent.match(/UNIVERSITY OF DAR ES SALAAM/i) ||
                     currentContent.match(/INSTITUTE OF FINANCE MANAGEMENT/i) ||
                     currentContent.match(/NATIONAL INSTITUTE OF TRANSPORT/i) ||
                     currentContent.match(/DAR ES SALAAM INSTITUTE OF TECHNOLOGY/i) ||
                     currentContent.match(/SOKOINE UNIVERSITY OF AGRICULTURE/i) ||
                     currentContent.match(/COLLEGE OF BUSINESS EDUCATION/i) ||
                     currentContent.match(/ARDHI UNIVERSITY/i) ||
                     currentContent.match(/MBEYA UNIVERSITY OF SCIENCE AND TECHNOLOGY/i) ||
                     currentContent.match(/UNIVERSITY OF DODOMA/i) ||
                     currentContent.match(/STATE UNIVERSITY OF ZANZIBAR/i) ||
                     currentContent.match(/(?:UNIVERSITY|COLLEGE|INSTITUTE) OF [^\n<]+/i) ||
                     currentContent.match(/[A-Z\s]+ UNIVERSITY/i);
    const detectedUni = uniMatch ? uniMatch[0].replace(/<[^>]+>/g, "").trim() : "University of Dar es Salaam (UDSM)";

    const studentMatch = currentContent.match(/Student Name:\s*([^\n<]+)/i) ||
                         currentContent.match(/I,\s*([A-Za-z\s]+?),\s*declare\b/i);

    const regMatch = currentContent.match(/Reg(?:\.|\s)*No:\s*([^\n<]+)/i) ||
                     currentContent.match(/Registration(?:\s+Number|\s+No):\s*([^\n<]+)/i);

    const progMatch = currentContent.match(/Degree Programme:\s*([^\n<]+)/i) ||
                      currentContent.match(/PROGRAMME:\s*([^\n<]+)/i) ||
                      currentContent.match(/DEPARTMENT OF\s*([^\n<]+)/i);

    const orgMatch = currentContent.match(/Company\/Organization Name:\s*([^\n<]+)/i) ||
                     currentContent.match(/HOST ORGANIZATION:\s*([^\n<]+)/i) ||
                     currentContent.match(/Host Organization:\s*([^\n<]+)/i) ||
                     currentContent.match(/completed at\s+([^,\n<]+)\s+under the supervision/i);

    const supMatch = currentContent.match(/Training Officer's Name:\s*([^\n<]+)/i) ||
                     currentContent.match(/Field Supervisor:\s*([^\n<]+)/i) ||
                     currentContent.match(/Field Supervisor Signature:[\s\S]*?\n\s*([^\n\(\)<]+)/i) ||
                     currentContent.match(/Academic Supervisor's Name:\s*([^\n<]+)/i) ||
                     currentContent.match(/supervision of\s+([A-Za-z\.\s]+?)(?:\.|\n|<|,|$)/i);

    const yearMatch = currentContent.match(/Academic Year:\s*([^\n<]+)/i);
    const ptYearMatch = currentContent.match(/Practical Training Year:\s*([^\n<]+)/i);

    return {
      title: title || "Academic Field Report",
      institution: detectedUni,
      studentName: studentMatch ? studentMatch[1].replace(/<[^>]+>/g, "").trim() : undefined,
      registrationNumber: regMatch ? regMatch[1].replace(/<[^>]+>/g, "").trim() : undefined,
      programme: progMatch ? progMatch[1].replace(/<[^>]+>/g, "").trim() : undefined,
      organization: orgMatch ? orgMatch[1].replace(/<[^>]+>/g, "").trim() : undefined,
      supervisorName: supMatch ? supMatch[1].replace(/<[^>]+>/g, "").trim() : undefined,
      academicYear: yearMatch ? yearMatch[1].replace(/<[^>]+>/g, "").trim() : undefined,
      yearOfStudy: ptYearMatch ? ptYearMatch[1].replace(/<[^>]+>/g, "").trim() : "2",
      content: currentContent
    };
  };

  const executeDocxDownload = () => {
    const opts = getDocumentExportOptions();
    AcademicAlerts.toast("Downloading editable Microsoft Word document...", "info");
    DocxCompilerEngine.downloadDocxFile(opts);
  };

  const executePdfDownload = () => {
    const opts = getDocumentExportOptions();
    DocxCompilerEngine.openPdfPrintWindow(opts);
  };

  const executeCoverOnlyPdfDownload = () => {
    const opts = getDocumentExportOptions();
    DocxCompilerEngine.openCoverPageOnlyPdfWindow({
      ...opts,
      content: ""
    });
  };

  const checkPlaceholders = () => {
    const placeholders = content.match(/\[MISSING:[^\]]+\]|\[ADD [^\]]+\]/g);
    if (placeholders && placeholders.length > 0) {
      AcademicAlerts.warning(
        "Unresolved Placeholders",
        `Your document has ${placeholders.length} unfilled placeholder(s) such as ${placeholders.slice(0, 2).join(", ")}. We recommend resolving them before final submission.`
      );
    }
  };

  const handleDownloadFormat = (format: ExportFormatType) => {
    checkPlaceholders();
    setPendingExportFormat(format);

    if (isPaid) {
      if (format === "doc") {
        executeDocxDownload();
      } else if (format === "cover") {
        executeCoverOnlyPdfDownload();
      } else {
        executePdfDownload();
      }
    } else {
      setShowPaymentModal(true);
    }
  };

  const handleExportDocx = () => handleDownloadFormat("doc");
  const handleExportPdf = () => handleDownloadFormat("pdf");
  const handleExportCoverOnlyPdf = () => handleDownloadFormat("cover");

  const handleProcessPayment = async () => {
    setIsProcessingPayment(true);
    try {
      const res = await fetch("/api/v1/export/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: docId,
          paymentMethod: paymentMode === "mobile" ? paymentProvider : selectedBank,
          phoneNumber: paymentMode === "mobile" ? phoneNumber : undefined,
          bankName: paymentMode === "card" ? selectedBank : undefined,
          bankReference: paymentMode === "card" ? bankReference : undefined
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsPaid(true);
        setShowPaymentModal(false);
        // Automatically launch the user's selected format!
        setTimeout(() => {
          if (pendingExportFormat === "doc") {
            executeDocxDownload();
          } else if (pendingExportFormat === "cover") {
            executeCoverOnlyPdfDownload();
          } else {
            executePdfDownload();
          }
        }, 300);
      } else {
        AcademicAlerts.error("Payment Verification Failed", data.error || "Please try again.");
      }
    } catch (e) {
      AcademicAlerts.error("Payment Error", "Network error processing payment. Please retry.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Pre-calculate full document layout (Sheet 1: Official University Cover Page, Sheets 2+: Preliminaries & Chapters)
  const exportOptions = getDocumentExportOptions();
  const coverHtml = DocxCompilerEngine.compileCoverPageHtml(exportOptions);
  const bodyHtml = DocxCompilerEngine.formatContentToAcademicHtml(content, exportOptions);
  const contentSheets = DocxCompilerEngine.splitContentIntoA4Sheets(bodyHtml);
  const ch1Index = contentSheets.findIndex(s => 
    /<h1[^>]*class="[^"]*chapter-title[^"]*"[^>]*>\s*CHAPTER\s+(?:1|ONE)\b/i.test(s) ||
    /<h1[^>]*id="ch-1"[^>]*>/i.test(s)
  );
  const effectiveCh1Index = ch1Index >= 0 ? ch1Index : 6;
  const totalSheets = 1 + (contentSheets.length > 0 ? contentSheets.length : 1);

  // Stats
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = content.length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
        <Loader2 className="size-8 animate-spin text-teal-600 mb-4" />
        <p className="font-medium text-sm">Loading academic document into editor...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
        <AlertCircle className="size-12 text-rose-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Unable to Load Document</h2>
        <p className="text-muted-foreground text-sm max-w-md mb-6">{loadError}</p>
        <Link href="/dashboard">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="size-4" /> Return to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950">
      {/* Hidden file input for image upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleImageFileSelect}
      />

      {/* TOP EDITOR NAVIGATION BAR */}
      <header className="h-[60px] bg-white dark:bg-slate-900 border-b flex items-center justify-between px-3 md:px-6 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/tools/field-report">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" title="Back to Tool">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div className="h-5 w-[1px] bg-border mx-1"></div>
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setHasUnsavedChanges(true);
              }}
              className="font-bold text-sm bg-transparent border-none outline-none focus:ring-1 focus:ring-teal-500 rounded px-1.5 py-0.5 text-foreground w-48 sm:w-72 md:w-96 truncate"
              title="Click to rename document"
            />
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground px-1.5">
              {isSaving ? (
                <span className="flex items-center text-teal-600 dark:text-teal-400">
                  <RefreshCw className="size-3 mr-1 animate-spin" /> Saving...
                </span>
              ) : hasUnsavedChanges ? (
                <span className="flex items-center text-amber-600 dark:text-amber-400 font-medium">
                  • Unsaved changes
                </span>
              ) : (
                <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                  <Check className="size-3 mr-1" /> Saved to cloud {lastSavedTime ? `at ${lastSavedTime}` : ""}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* View Mode Switcher: DOCX Document (Default) vs Markdown Source */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border text-xs">
            <button
              onClick={() => setViewMode("document")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
                viewMode === "document"
                  ? "bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Formatted DOCX layout: cover page, table of contents and A4 sheets"
            >
              <FileText className="size-3.5" /> DOCX Document
            </button>
            <button
              onClick={() => setViewMode("markdown")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors ${
                viewMode === "markdown"
                  ? "bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Raw markdown code editor"
            >
              <Edit3 className="size-3.5" /> Source
            </button>
          </div>

          {/* Save Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className={`h-8 gap-1.5 font-medium ${
              hasUnsavedChanges
                ? "border-teal-500 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/50"
                : "text-muted-foreground"
            }`}
          >
            <Save className="size-3.5" />
            <span className="hidden sm:inline">Save</span>
          </Button>

          {/* SINGLE CLEAR DOWNLOAD BUTTON (Opens download modal for Word .docx or PDF) */}
          <Button
            size="sm"
            onClick={() => setShowFormatSelectorModal(true)}
            className="h-8 gap-1.5 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white shadow-sm font-semibold text-xs px-3.5"
            title="Download document (Choose Microsoft Word .docx or PDF)"
          >
            <Download className="size-3.5" />
            <span>Download</span>
            <ChevronDown className="size-3 opacity-80" />
            {!isPaid && <Lock className="size-3 ml-0.5 text-amber-200" />}
          </Button>
        </div>
      </header>

      {/* SUB-HEADER / FORMATTING TOOLBAR */}
      <div className="bg-white dark:bg-slate-900 border-b px-4 py-1.5 flex items-center justify-between gap-2 overflow-x-auto text-xs z-20 sticky top-[60px] shadow-xs">
        <div className="flex items-center gap-1">
          {viewMode === "document" ? (
            <>
              {/* Direct Editing Mode Toggle */}
              <button
                type="button"
                onClick={() => setIsEditingEnabled(!isEditingEnabled)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded border text-xs font-semibold mr-1.5 transition-colors ${
                  isEditingEnabled
                    ? "bg-teal-50 border-teal-300 text-teal-800 dark:bg-teal-950/60 dark:border-teal-700 dark:text-teal-300"
                    : "bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                }`}
                title={isEditingEnabled ? "Click to toggle Read-Only preview" : "Click to enable direct text editing"}
              >
                <FileEdit className="size-3.5" />
                <span>{isEditingEnabled ? "Direct Edit Mode: ON" : "Read-Only View"}</span>
              </button>

              <div className="h-4 w-[1px] bg-border mx-1"></div>

              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => executeExecCommand("bold")}
                title="Bold (Ctrl+B)"
              >
                <Bold className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => executeExecCommand("italic")}
                title="Italic (Ctrl+I)"
              >
                <Italic className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => executeExecCommand("underline")}
                title="Underline (Ctrl+U)"
              >
                <span className="font-serif font-bold text-xs underline">U</span>
              </Button>
              <div className="h-4 w-[1px] bg-border mx-1"></div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => executeExecCommand("formatBlock", "<h1>")}
                title="Chapter Heading (H1)"
              >
                <Heading1 className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => executeExecCommand("formatBlock", "<h2>")}
                title="Section Heading (H2)"
              >
                <Heading2 className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => executeExecCommand("formatBlock", "<h3>")}
                title="Sub-section Heading (H3)"
              >
                <Heading3 className="size-3.5" />
              </Button>
              <div className="h-4 w-[1px] bg-border mx-1"></div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => executeExecCommand("insertUnorderedList")}
                title="Bullet List"
              >
                <List className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={insertTableTemplate}
                title="Insert Academic Table"
              >
                <TableIcon className="size-3.5" />
              </Button>
            </>
          ) : (
            <>
              {/* Markdown Source Mode Toolbar */}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => insertFormatting("**", "**")}
                title="Bold"
              >
                <Bold className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => insertFormatting("*", "*")}
                title="Italic"
              >
                <Italic className="size-3.5" />
              </Button>
              <div className="h-4 w-[1px] bg-border mx-1"></div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => insertFormatting("\n# ", "\n")}
                title="Heading 1"
              >
                <Heading1 className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => insertFormatting("\n## ", "\n")}
                title="Heading 2"
              >
                <Heading2 className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => insertFormatting("\n### ", "\n")}
                title="Heading 3"
              >
                <Heading3 className="size-3.5" />
              </Button>
              <div className="h-4 w-[1px] bg-border mx-1"></div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => insertFormatting("\n- ", "")}
                title="Bullet List"
              >
                <List className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={insertTableTemplate}
                title="Insert Table Template"
              >
                <TableIcon className="size-3.5" />
              </Button>
            </>
          )}

          <div className="h-4 w-[1px] bg-border mx-1"></div>

          {/* Insert Image / Diagram Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleTriggerImageUpload}
            disabled={isUploadingImage}
            className="h-7 gap-1.5 text-xs font-semibold bg-teal-50 hover:bg-teal-100 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300 dark:hover:bg-teal-900/60 border-teal-200 dark:border-teal-800"
          >
            <ImagePlus className="size-3.5 text-teal-600" />
            <span>{isUploadingImage ? "Inserting..." : "Insert Image / Diagram"}</span>
          </Button>
        </div>

        {/* Total Sheets & Word Count */}
        <div className="hidden lg:flex items-center gap-3 text-muted-foreground text-[11px]">
          {viewMode === "document" && (
            <>
              <span className="font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                {totalSheets} A4 Pages (Cover + Preliminaries + Chapters)
              </span>
              <span>•</span>
            </>
          )}
          <span>{wordCount.toLocaleString()} words</span>
          <span>•</span>
          <span>{charCount.toLocaleString()} chars</span>
        </div>
      </div>

      {/* MAIN WORKSPACE BODY */}
      <div className="flex-1 flex overflow-hidden">
        {viewMode === "document" ? (
          /* FORMATTED DOCX DOCUMENT CANVAS (PRIMARY VIEW) */
          <div className="flex-1 overflow-y-auto bg-slate-200 dark:bg-slate-950">
            {/* Direct Edit Guidance Banner */}
            <div className="bg-teal-50/90 dark:bg-slate-900/90 border-b border-teal-200 dark:border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-teal-900 dark:text-teal-200 sticky top-0 z-10 backdrop-blur-xs shadow-xs">
              <span className="flex items-center gap-1.5 font-medium">
                <Sparkles className="size-3.5 text-teal-600" />
                {isEditingEnabled
                  ? "Interactive DOCX Academic Layout — Click any paragraph, heading or table to read and edit directly."
                  : "Official Academic Layout — Complete document with Cover Page and Dynamic Dot-Leader TOC."}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-muted-foreground hidden md:inline">
                  A4 Standard (210×297mm) • Times New Roman 11pt • 1.5 Spacing
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFormatSelectorModal(true)}
                  className="h-6 text-[11px] text-teal-700 dark:text-teal-400 gap-1 hover:bg-teal-100 dark:hover:bg-teal-900/40"
                >
                  <Download className="size-3" /> Export Ready
                </Button>
              </div>
            </div>

            {/* A4 DOCUMENT CANVAS */}
            <div className="a4-document-canvas py-8">
              {/* SHEET 1: OFFICIAL UNIVERSITY COVER PAGE */}
              <div className="a4-document-sheet cover-sheet" id="sheet-1">
                <div dangerouslySetInnerHTML={{ __html: coverHtml }} />
              </div>

              {/* SHEETS 2+: PRELIMINARIES & INDIVIDUAL CHAPTER SHEETS */}
              {contentSheets.map((sheetHtml, index) => {
                const isPrelim = index < effectiveCh1Index;
                const pageNumText = isPrelim
                  ? DocxCompilerEngine.toRoman(index + 1)
                  : `${index - effectiveCh1Index + 1}`;

                return (
                  <div
                    key={index}
                    className="a4-document-sheet content-sheet"
                    id={`sheet-${index + 2}`}
                  >
                    <div
                      className="sheet-content prose max-w-none font-serif text-[13.5px] leading-relaxed select-text outline-none"
                      contentEditable={isEditingEnabled}
                      suppressContentEditableWarning={true}
                      onInput={() => setHasUnsavedChanges(true)}
                      onBlur={(e) => handleSheetBlur(index, e.currentTarget.innerHTML)}
                      dangerouslySetInnerHTML={{ __html: sheetHtml }}
                    />
                    <div className="sheet-footer">
                      <span className="sheet-page-number font-serif font-bold text-slate-700">
                        {pageNumText}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* MARKDOWN SOURCE MODE (SECONDARY) */
          <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
            <div className="bg-slate-50 dark:bg-slate-950 px-4 py-2 border-b flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Edit3 className="size-3.5 text-teal-600" /> Document Markdown & Content Editor
              </span>
              <span className="text-[11px] font-normal text-muted-foreground hidden sm:inline">
                Supports Markdown, ASCII diagrams & uploaded image figures
              </span>
            </div>

            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setHasUnsavedChanges(true);
              }}
              placeholder="Paste or write your academic report content here..."
              className="flex-1 p-6 font-mono text-[13px] leading-relaxed resize-none bg-white dark:bg-slate-900 text-foreground outline-none focus:ring-0 border-none select-text"
              spellCheck="false"
            />
          </div>
        )}
      </div>

      {/* MOBILE PAYMENT MODAL FOR UNLOCKING PDF */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full border border-border p-6 relative">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="size-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className={`size-10 rounded-full flex items-center justify-center ${
                pendingExportFormat === "doc"
                  ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600"
                  : "bg-teal-100 dark:bg-teal-900/50 text-teal-600"
              }`}>
                {pendingExportFormat === "doc" ? <FileEdit className="size-5" /> : <Download className="size-5" />}
              </div>
              <div>
                <h3 className="font-bold text-base">
                  Unlock {pendingExportFormat === "doc" ? "Microsoft Word (.docx)" : "Academic PDF"} Export
                </h3>
                <p className="text-xs text-muted-foreground">TZS {new Intl.NumberFormat("en-TZ").format(feeTzs)} one-time export fee (lifetime access)</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-4">
              Complete payment via mobile money or bank deposit to instantly download your fully editable academic {pendingExportFormat === "doc" ? "Microsoft Word (.docx)" : "PDF"} document. Both formats are unlocked permanently.
            </p>

            <div className="flex rounded-lg border p-1 mb-4 bg-slate-50 dark:bg-slate-950 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMode("mobile")}
                className={`flex-1 py-1.5 font-medium rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                  paymentMode === "mobile"
                    ? "bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                <Phone className="size-3.5" /> Mobile Money
              </button>
              <button
                type="button"
                onClick={() => setPaymentMode("card")}
                className={`flex-1 py-1.5 font-medium rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                  paymentMode === "card"
                    ? "bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                <Building2 className="size-3.5" /> Bank Deposit
              </button>
            </div>

            {paymentMode === "mobile" ? (
              <div className="space-y-3 mb-6">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">Network</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["M-Pesa", "Tigo Pesa", "Airtel Money", "HaloPesa"] as const).map((prov) => (
                      <button
                        key={prov}
                        type="button"
                        onClick={() => setPaymentProvider(prov)}
                        className={`text-xs py-2 px-3 rounded-lg border text-left font-medium transition-all ${
                          paymentProvider === prov
                            ? "border-teal-500 bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-200"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        {prov}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">
                    Phone Number (Tanzania)
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0747461380 or 0627204980"
                    className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-background outline-none"
                  >
                    <option value="CRDB Bank">CRDB Bank (SimBanking)</option>
                    <option value="NMB Bank">NMB Bank (NMB Mkononi)</option>
                    <option value="NBC Bank">NBC Bank</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">
                    Transaction / Deposit Reference
                  </label>
                  <input
                    type="text"
                    value={bankReference}
                    onChange={(e) => setBankReference(e.target.value)}
                    placeholder="e.g. CRDB-TX-892102"
                    className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>
            )}

            <Button
              onClick={handleProcessPayment}
              disabled={isProcessingPayment}
              className={`w-full font-semibold py-2.5 shadow-md flex items-center justify-center gap-2 ${
                pendingExportFormat === "doc"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-teal-600 hover:bg-teal-700 text-white"
              }`}
            >
              {isProcessingPayment ? (
                <>
                  <RefreshCw className="size-4 animate-spin" /> Verifying Payment...
                </>
              ) : (
                <>
                  <Check className="size-4" /> Pay TZS {new Intl.NumberFormat("en-TZ").format(feeTzs)} & Download {pendingExportFormat === "doc" ? "Word (.docx)" : "PDF"}
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* DOCUMENT DOWNLOAD SELECTOR MODAL */}
      <DocumentDownloadSelectorModal
        isOpen={showFormatSelectorModal}
        onClose={() => setShowFormatSelectorModal(false)}
        documentTitle={title}
        isUnlocked={isPaid}
        feeTzs={feeTzs}
        onSelectFormat={(format) => handleDownloadFormat(format)}
        onUnlockRequired={(format) => {
          setPendingExportFormat(format);
          setShowFormatSelectorModal(false);
          setShowPaymentModal(true);
        }}
      />
    </div>
  );
}
