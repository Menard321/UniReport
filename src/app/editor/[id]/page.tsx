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
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocxCompilerEngine } from "@/lib/export/docx-compiler";

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

  // Editor UI state
  const [viewMode, setViewMode] = useState<"split" | "edit" | "preview">("split");
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Image Upload state & refs
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Payment Modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
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
  }, [title, content, docId]);

  // 2. Save document to API
  const handleSave = async () => {
    if (!docId || isSaving) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/documents/${docId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content
        })
      });

      if (res.ok) {
        setHasUnsavedChanges(false);
        const now = new Date();
        setLastSavedTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      } else {
        alert("Failed to save changes. Please try again.");
      }
    } catch (e) {
      console.error("Save error:", e);
      alert("Error saving document to cloud.");
    } finally {
      setIsSaving(false);
    }
  };

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
      alert("Please select an image smaller than 8MB.");
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

        const imageMarkdown = `\n\n![Figure: ${userCaption}](${dataUrl})\n*Figure: ${userCaption}*\n\n`;

        // Insert at textarea cursor or append
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
        setIsUploadingImage(false);
        // Clear input so same file can be picked again if needed
        if (fileInputRef.current) fileInputRef.current.value = "";
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Image read error:", err);
      alert("Failed to process image file.");
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
    const tableTemplate = `\n\n| Item / Parameter | Specification / Description | Remarks |\n| :--- | :--- | :--- |\n| Metric A | Standard Parameter Value | Fully Verified |\n| Metric B | Operational Reading | In Specification |\n\n`;
    insertFormatting(tableTemplate, "");
  };

  // 5. PDF Export & Payment triggers
  const handleExportPdf = () => {
    if (isPaid) {
      executePdfDownload();
    } else {
      setShowPaymentModal(true);
    }
  };

  const executePdfDownload = () => {
    // Extract metadata from content or defaults
    const uniMatch = content.match(/UNIVERSITY OF [^\n]+/i) || content.match(/COLLEGE OF [^\n]+/i);
    const detectedUni = uniMatch ? uniMatch[0].trim() : "University of Dar es Salaam";

    DocxCompilerEngine.openPdfPrintWindow({
      title: title || "Academic Field Report",
      institution: detectedUni,
      content: content
    });
  };

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
        // Automatically launch the official PDF window
        setTimeout(() => {
          executePdfDownload();
        }, 300);
      } else {
        alert(data.error || "Payment verification failed. Please try again.");
      }
    } catch (e) {
      alert("Network error processing payment. Please retry.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

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
          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border text-xs">
            <button
              onClick={() => setViewMode("edit")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors ${
                viewMode === "edit"
                  ? "bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Edit3 className="size-3.5" /> Edit
            </button>
            <button
              onClick={() => setViewMode("split")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors ${
                viewMode === "split"
                  ? "bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Columns className="size-3.5" /> Split
            </button>
            <button
              onClick={() => setViewMode("preview")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors ${
                viewMode === "preview"
                  ? "bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Eye className="size-3.5" /> Preview
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

          {/* Export / Download PDF */}
          <Button
            size="sm"
            onClick={handleExportPdf}
            className="h-8 gap-1.5 bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
          >
            <Download className="size-3.5" />
            <span>Download PDF</span>
            {!isPaid && <Lock className="size-3 ml-0.5 text-teal-200" />}
          </Button>
        </div>
      </header>

      {/* SUB-HEADER / FORMATTING TOOLBAR (Visible in Edit & Split mode) */}
      {(viewMode === "edit" || viewMode === "split") && (
        <div className="bg-white dark:bg-slate-900 border-b px-4 py-1.5 flex items-center justify-between gap-2 overflow-x-auto text-xs z-20">
          <div className="flex items-center gap-1">
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

          {/* Word & Char counter */}
          <div className="hidden lg:flex items-center gap-3 text-muted-foreground text-[11px]">
            <span>{wordCount.toLocaleString()} words</span>
            <span>•</span>
            <span>{charCount.toLocaleString()} chars</span>
          </div>
        </div>
      )}

      {/* MAIN WORKSPACE BODY */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT / EDIT PANE */}
        {(viewMode === "edit" || viewMode === "split") && (
          <div
            className={`flex flex-col bg-white dark:bg-slate-900 border-r ${
              viewMode === "split" ? "w-full lg:w-1/2" : "w-full"
            }`}
          >
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

        {/* RIGHT / LIVE ACADEMIC PREVIEW PANE */}
        {(viewMode === "preview" || viewMode === "split") && (
          <div
            className={`flex flex-col bg-slate-200 dark:bg-slate-950 overflow-y-auto ${
              viewMode === "split" ? "hidden lg:flex lg:w-1/2" : "w-full"
            }`}
          >
            <div className="bg-slate-100 dark:bg-slate-900 px-4 py-2 border-b flex items-center justify-between text-xs font-semibold text-muted-foreground sticky top-0 z-10">
              <span className="flex items-center gap-1.5">
                <Eye className="size-3.5 text-teal-600" /> Live Academic Print Preview (A4 Paper)
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExportPdf}
                className="h-6 text-[11px] text-teal-700 dark:text-teal-400 gap-1"
              >
                <Download className="size-3" /> Print Ready
              </Button>
            </div>

            {/* A4 Paper Sheet Container */}
            <div className="p-6 md:p-8 flex justify-center">
              <div className="w-full max-w-[850px] bg-white text-slate-900 shadow-xl rounded-sm p-10 md:p-14 border border-slate-300 min-h-[1100px]">
                <div
                  className="prose max-w-none font-serif text-[14px] leading-relaxed select-text"
                  dangerouslySetInnerHTML={{
                    __html: DocxCompilerEngine.formatContentToAcademicHtml(content)
                  }}
                />
              </div>
            </div>
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
              <div className="size-10 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-teal-600">
                <Download className="size-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">Unlock Official PDF Download</h3>
                <p className="text-xs text-muted-foreground">TZS {new Intl.NumberFormat("en-TZ").format(feeTzs)} one-time export fee</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-4">
              Complete payment via mobile money (M-Pesa, Tigo Pesa, Airtel Money) to instantly download your fully edited academic PDF report.
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
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 shadow-md flex items-center justify-center gap-2"
            >
              {isProcessingPayment ? (
                <>
                  <RefreshCw className="size-4 animate-spin" /> Verifying Payment...
                </>
              ) : (
                <>
                  <Check className="size-4" /> Pay TZS {new Intl.NumberFormat("en-TZ").format(feeTzs)} & Download PDF
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
