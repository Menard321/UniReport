"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Sparkles,
  Copy,
  Download,
  FileText,
  RefreshCw,
  Lock,
  CreditCard,
  PhoneCall,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Check,
  X,
  GraduationCap,
  BookOpen,
  Sliders,
  CheckCircle2,
  ExternalLink,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TOOLS } from "@/lib/tools-config";
import { DocxCompilerEngine } from "@/lib/export/docx-compiler";

export default function ToolPage() {
  const params = useParams();
  const toolId = params.toolId as string;
  const tool = TOOLS.find(t => t.id === toolId);

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [createdDocId, setCreatedDocId] = useState<string | null>(null);

  // Specialized Research Assistant States
  // 1. Topic Assistant
  const [progField, setProgField] = useState("");
  const [interestDomain, setInterestDomain] = useState("");
  const [geoScope, setGeoScope] = useState("");
  const [academicLevel, setAcademicLevel] = useState("Undergraduate FYP");

  // 2. Literature Review Assistant
  const [lrTopic, setLrTopic] = useState("");
  const [lrTheories, setLrTheories] = useState("");
  const [lrPapers, setLrPapers] = useState("");
  const [lrCitation, setLrCitation] = useState<"APA7" | "IEEE" | "HARVARD">("APA7");

  // 3. Methodology Assistant
  const [mResearchType, setMResearchType] = useState("Engineering & Software System Development");
  const [mQuestions, setMQuestions] = useState("");
  const [mPopulation, setMPopulation] = useState("");
  const [mTools, setMTools] = useState("");

  // Payment Gate State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMode, setPaymentMode] = useState<"mobile" | "card">("mobile");
  const [paymentProvider, setPaymentProvider] = useState("M-Pesa");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [showSimBankingFallback, setShowSimBankingFallback] = useState(false);
  const [selectedBank, setSelectedBank] = useState<"CRDB" | "NMB">("CRDB");
  const [bankReference, setBankReference] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("0627204980");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<"pdf" | "doc">("pdf");
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [feeTzs, setFeeTzs] = useState(5000);

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

  if (!tool) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Tool Not Found</h2>
        <Link href="/dashboard/tools">
          <Button variant="outline">
            <ArrowLeft className="size-4 mr-2" /> Back to Toolkit
          </Button>
        </Link>
      </div>
    );
  }

  const handleGenerate = async (customInput?: string) => {
    const textToSubmit = customInput || input;
    if (!textToSubmit.trim()) return;
    
    setIsGenerating(true);
    setOutput("");

    try {
      const response = await fetch("/api/tools/completion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId, systemPrompt: tool.systemPrompt, input: textToSubmit })
      });
      
      const data = await response.json();
      const text = data.result || "No response received.";
      
      for (let i = 0; i <= text.length; i++) {
        setOutput(text.slice(0, i));
        await new Promise(r => setTimeout(r, 6));
      }

      // Persist to database physically
      if (text.length > 20) {
        const docRes = await fetch("/api/documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: `${tool.title} Output`,
            content: text,
            toolType: toolId
          })
        });
        const docData = await docRes.json();
        if (docData && docData.id) {
          setCreatedDocId(docData.id);
        }
      }

    } catch (e) {
      setOutput("Error generating response. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateTopics = () => {
    if (!progField.trim() || !interestDomain.trim()) {
      alert("Please enter your Degree Programme and Area of Interest.");
      return;
    }
    const promptText = `Degree Programme / Discipline: ${progField}
Area of Interest & Problem Domain: ${interestDomain}
Target Case Study / Geographic Scope: ${geoScope || "Tanzanian Higher Education / National Context"}
Academic Level: ${academicLevel}

Please generate 3 to 4 defense-ready, publication-grade academic research topic proposals complying with TCU and university guidelines. For each topic, provide a formal title, a 2-paragraph problem statement, specific measurable objectives, feasibility notes, and expected contribution.`;
    handleGenerate(promptText);
  };

  const handleGenerateLitReview = () => {
    if (!lrTopic.trim()) {
      alert("Please enter your Approved Research Title / Topic.");
      return;
    }
    const promptText = `Approved Research Topic: ${lrTopic}
Governing Theoretical Frameworks / Models: ${lrTheories || "Standard academic models"}
Key Empirical Studies / Authors Context: ${lrPapers || "Recent empirical literature in Tanzania and East Africa"}
Citation Format: ${lrCitation} Standard

Please synthesize an exhaustive Chapter 2 Literature Review adhering to university dissertation standards. Include:
2.1 Conceptual Foundations & Variables
2.2 Theoretical Framework Review
2.3 Empirical Literature Critique
2.4 Identified Research Gap (Pengo la Utafiti)
2.5 Conceptual Framework Summary Matrix (tabulated in Markdown)`;
    handleGenerate(promptText);
  };

  const handleGenerateMethodology = () => {
    if (!mQuestions.trim()) {
      alert("Please enter your Research Questions or Hypotheses.");
      return;
    }
    const promptText = `Research Nature: ${mResearchType}
Governing Research Questions / Hypotheses: ${mQuestions}
Target Population & Study Boundary: ${mPopulation || "Target operational context"}
Data Collection Instruments & Tech Stack: ${mTools || "Primary data collection instruments"}

Please architect a rigorous, defense-ready Chapter 3 Methodology adhering to Tanzanian university standards. Include Research Philosophy & Design justification (citing methodology authorities such as Kothari, Creswell, or Saunders), Target Population with Yamane or Cochran sample size calculation formula, Instruments & Reliability (Cronbach's Alpha), Data Analysis Plan, and Ethical Clearances (COSTECH).`;
    handleGenerate(promptText);
  };

  const downloadDocLocally = (content: string) => {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
                   "xmlns:w='urn:schemas-microsoft-com:office:word' " +
                   "xmlns='http://www.w3.org/TR/REC-html40'>" +
                   "<head><meta charset='utf-8'><title>" + tool.title + "</title></head><body>";
    const footer = "</body></html>";
    const htmlContent = header + content.replace(/\n/g, "<br>") + footer;
    
    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${tool.id}-academic-export-${Date.now()}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    if (!output) return;
    if (!isUnlocked) {
      setShowPaymentModal(true);
      return;
    }
    navigator.clipboard.writeText(output);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handleExport = async (format: "pdf" = "pdf") => {
    if (!output) return;
    setSelectedFormat("pdf");

    if (isUnlocked) {
      DocxCompilerEngine.openPdfPrintWindow({
        title: `${tool.title} Output`,
        institution: "Tanzania Higher Education Research Repository",
        content: output
      });
      return;
    }

    try {
      const res = await fetch("/api/v1/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: createdDocId,
          format: "pdf",
          options: {
            title: `${tool.title} Output`,
            institution: "Tanzania Higher Education Research Repository",
            content: output
          }
        })
      });

      const data = await res.json();
      if (res.status === 402 || data.requiresPayment) {
        setShowPaymentModal(true);
      } else if (data.success) {
        setIsUnlocked(true);
        DocxCompilerEngine.openPdfPrintWindow({
          title: `${tool.title} Output`,
          institution: "Tanzania Higher Education Research Repository",
          content: output
        });
      }
    } catch (e) {
      setShowPaymentModal(true);
    }
  };

  const handleProcessPayment = async () => {
    if (paymentMode === "mobile") {
      if (!phoneNumber.match(/^(06|07)\d{8}$/)) {
        alert("Please enter a valid Tanzanian phone number (e.g. 0627204980 / 0747461380)");
        return;
      }
    } else {
      if (showSimBankingFallback) {
        if (!bankReference.trim()) {
          alert("Please enter your transaction reference number.");
          return;
        }
      } else {
        const cleanCard = cardNumber.replace(/\s/g, "");
        if (cleanCard.length !== 16) {
          alert("Please enter a valid 16-digit card number.");
          return;
        }
        if (!cardName.trim()) {
          alert("Please enter the cardholder name.");
          return;
        }
        if (cardExpiry.length !== 5) {
          alert("Please enter a valid expiration date (MM/YY).");
          return;
        }
        if (cardCvv.length < 3) {
          alert("Please enter a valid 3-digit CVV / security code.");
          return;
        }
      }
    }

    setIsProcessingPayment(true);
    try {
      const res = await fetch("/api/v1/export/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: createdDocId,
          paymentMethod: paymentMode === "mobile" 
            ? paymentProvider 
            : showSimBankingFallback 
              ? selectedBank 
              : "Card",
          phoneNumber: paymentMode === "mobile" ? phoneNumber : undefined,
          bankName: paymentMode === "card" && showSimBankingFallback ? selectedBank : undefined,
          bankReference: paymentMode === "card" && showSimBankingFallback ? bankReference : undefined,
          cardholderName: paymentMode === "card" && !showSimBankingFallback ? cardName : undefined,
          last4: paymentMode === "card" && !showSimBankingFallback ? cardNumber.replace(/\s/g, "").slice(-4) : undefined,
          cardBrand: paymentMode === "card" && !showSimBankingFallback ? (cardNumber.startsWith("4") ? "Visa" : "Mastercard") : undefined
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsUnlocked(true);
        setShowPaymentModal(false);

        // Instantly execute PDF print/download
        DocxCompilerEngine.openPdfPrintWindow({
          title: `${tool.title} Output`,
          institution: "Tanzania Higher Education Research Repository",
          content: output
        });
      } else {
        alert(data.error || "Payment verification failed. Please try again.");
      }
    } catch (e) {
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="size-5" />
            </button>

            <div className="text-center space-y-1">
              <div className="size-12 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-600 mx-auto flex items-center justify-center mb-2">
                <Lock className="size-6" />
              </div>
              <h3 className="text-xl font-bold font-heading">Unlock Tool Output & Exports</h3>
              <p className="text-xs text-muted-foreground">
                Pay TZS {new Intl.NumberFormat("en-TZ").format(feeTzs)} via <strong>Mobile Money</strong> or <strong>Bank Card</strong> to download publication-ready <strong>PDF</strong> and unlock <strong>Clipboard Copying</strong>.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border text-xs space-y-1">
              <div className="flex justify-between font-semibold">
                <span>Module:</span>
                <span>{tool.title}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Access:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">PDF Download + Copy Access</span>
              </div>
              <div className="flex justify-between font-bold text-teal-700 dark:text-teal-400 text-sm pt-1 border-t">
                <span>Total Amount:</span>
                <span>TZS {new Intl.NumberFormat("en-TZ").format(feeTzs)}</span>
              </div>
            </div>

            {/* Mode Switcher: Mobile Money vs Bank Card */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMode("mobile")}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  paymentMode === "mobile"
                    ? "border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300"
                    : "bg-background text-muted-foreground"
                }`}
              >
                <PhoneCall className="size-3.5" /> Mobile Money
              </button>
              <button
                type="button"
                onClick={() => setPaymentMode("card")}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  paymentMode === "card"
                    ? "border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300"
                    : "bg-background text-muted-foreground"
                }`}
              >
                <CreditCard className="size-3.5" /> Bank Card
              </button>
            </div>

            {paymentMode === "mobile" ? (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-muted-foreground block">Select Operator</label>
                  <div className="grid grid-cols-4 gap-2">
                    {["M-Pesa", "Tigo Pesa", "Airtel Money", "Halopesa"].map((provider) => (
                      <button
                        key={provider}
                        type="button"
                        onClick={() => setPaymentProvider(provider)}
                        className={`p-2 rounded-lg border text-xs font-bold text-center transition ${
                          paymentProvider === provider
                            ? "border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300"
                            : "bg-background text-muted-foreground"
                        }`}
                      >
                        {provider}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground block mb-1 flex items-center justify-between">
                    <span>Mobile Phone Number</span>
                    <span className="text-[10px] text-teal-600 font-mono">Helpline: 0627204980 / 0747461380</span>
                  </label>
                  <input
                    type="text"
                    className="w-full p-2.5 rounded-lg border text-sm bg-background font-mono font-semibold"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="0627204980 / 0747461380"
                  />
                </div>
              </div>
            ) : !showSimBankingFallback ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-2.5 rounded-lg border text-sm bg-background font-medium uppercase"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="e.g. JOHN M. DOE"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">
                    16-Digit Card Number
                  </label>
                  <input
                    type="text"
                    className="w-full p-2.5 rounded-lg border text-sm bg-background font-mono"
                    value={cardNumber}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
                      setCardNumber(raw.replace(/(\d{4})(?=\d)/g, "$1 "));
                    }}
                    placeholder="4123 4567 8901 2345"
                    maxLength={19}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      className="w-full p-2.5 rounded-lg border text-sm bg-background font-mono text-center"
                      value={cardExpiry}
                      onChange={(e) => {
                        let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
                        if (raw.length >= 2) raw = raw.slice(0, 2) + "/" + raw.slice(2);
                        setCardExpiry(raw);
                      }}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">
                      CVV / CVN
                    </label>
                    <input
                      type="password"
                      className="w-full p-2.5 rounded-lg border text-sm bg-background font-mono text-center"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="3 digits"
                      maxLength={4}
                    />
                  </div>
                </div>

                <div className="pt-1.5 border-t text-center">
                  <button
                    type="button"
                    onClick={() => setShowSimBankingFallback(true)}
                    className="text-[11px] text-teal-600 hover:underline font-semibold inline-flex items-center gap-1"
                  >
                    <span>Paying via SimBanking or Wakala instead?</span>
                    <ChevronDown className="size-3" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase text-muted-foreground block">Select Bank</label>
                  <button
                    type="button"
                    onClick={() => setShowSimBankingFallback(false)}
                    className="text-xs text-teal-600 hover:underline font-semibold flex items-center gap-0.5"
                  >
                    <ChevronUp className="size-3" /> Back to Card
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBank("CRDB")}
                    className={`p-2 rounded-lg border text-xs font-bold text-center transition ${
                      selectedBank === "CRDB"
                        ? "border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300"
                        : "bg-background text-muted-foreground"
                    }`}
                  >
                    CRDB SimBanking
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedBank("NMB")}
                    className={`p-2 rounded-lg border text-xs font-bold text-center transition ${
                      selectedBank === "NMB"
                        ? "border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300"
                        : "bg-background text-muted-foreground"
                    }`}
                  >
                    NMB Direct
                  </button>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account:</span>
                    <span className="font-mono font-bold text-teal-700 dark:text-teal-300">
                      {selectedBank === "CRDB" ? "0152899450000" : "22310089456"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lipa Namba:</span>
                    <span className="font-mono font-bold text-foreground">
                      {selectedBank === "CRDB" ? "5678901" : "4567890"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">
                    Bank Reference / Receipt Code
                  </label>
                  <input
                    type="text"
                    className="w-full p-2.5 rounded-lg border text-sm bg-background font-mono uppercase"
                    value={bankReference}
                    onChange={(e) => setBankReference(e.target.value)}
                    placeholder="e.g. CRDB-TX98234"
                  />
                </div>
              </div>
            )}

            <Button
              onClick={handleProcessPayment}
              disabled={isProcessingPayment}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm gap-2"
            >
              {isProcessingPayment ? (
                <>
                  <RefreshCw className="size-4 animate-spin" /> Verifying Payment...
                </>
              ) : (
                <>
                  <CreditCard className="size-4" /> Pay TZS 5,000 & Download PDF
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-6 border-b pb-4">
        <Link href="/dashboard/tools">
          <Button variant="ghost" size="icon" className="shrink-0 rounded-full">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${tool.color}`}>
          <tool.icon className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{tool.title}</h1>
          <p className="text-sm text-muted-foreground">{tool.description}</p>
        </div>
      </div>

      {/* Split Pane Workspace */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Left Side: Specialized Input Configuration */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4 min-h-0 bg-white dark:bg-slate-900 border rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
            <span className="font-semibold text-sm flex items-center gap-2">
              <Sliders className="size-4 text-teal-600" />
              {toolId === "topic-assistant" 
                ? "Research Topic Parameters" 
                : toolId === "lit-review" 
                ? "Literature Review Scope" 
                : toolId === "methodology" 
                ? "Methodology Specifications" 
                : "Provide Context"}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-muted-foreground uppercase tracking-wider">
              {toolId === "topic-assistant" || toolId === "lit-review" || toolId === "methodology" ? "Guided Engine" : "Assistant"}
            </span>
          </div>

          <div className="p-5 flex-1 flex flex-col gap-4 overflow-y-auto">
            {toolId === "topic-assistant" ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                    Degree Programme / Academic Discipline *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BSc in Computer Science, BBA in Finance, Civil Engineering"
                    value={progField}
                    onChange={(e) => setProgField(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-input text-sm bg-background font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                    Area of Interest & Problem Domain *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. IoT in Soil Moisture Monitoring, Mobile Banking Churn, Solar Microgrids"
                    value={interestDomain}
                    onChange={(e) => setInterestDomain(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-input text-sm bg-background font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                    Target Case Study / Geographic Scope
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Morogoro Agricultural Corridor, Dar es Salaam Regional Hospitals"
                    value={geoScope}
                    onChange={(e) => setGeoScope(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-input text-sm bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                    Academic Level
                  </label>
                  <select
                    value={academicLevel}
                    onChange={(e) => setAcademicLevel(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-input text-sm bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value="Undergraduate FYP">Undergraduate Final Year Project (FYP)</option>
                    <option value="Master's Thesis">Master's Dissertation / Thesis</option>
                    <option value="Diploma Project">Ordinary Diploma Project</option>
                  </select>
                </div>
              </div>
            ) : toolId === "lit-review" ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                    Approved Research Title / Topic *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Impact of Electronic Invoicing on VAT Compliance in Tanzania"
                    value={lrTopic}
                    onChange={(e) => setLrTopic(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-input text-sm bg-background font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                    Governing Theoretical Frameworks / Models
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Technology Acceptance Model (TAM), Agency Theory, Resource-Based View"
                    value={lrTheories}
                    onChange={(e) => setLrTheories(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-input text-sm bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                    Key Authors / Empirical Literature Extracts
                  </label>
                  <textarea
                    rows={4}
                    placeholder="e.g. Paste abstract/findings from 2-4 key papers (e.g. Mushi 2021 found X, TRA 2023 reported Y)."
                    value={lrPapers}
                    onChange={(e) => setLrPapers(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-input text-sm bg-background leading-relaxed focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                    Citation Standard
                  </label>
                  <select
                    value={lrCitation}
                    onChange={(e) => setLrCitation(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-input text-sm bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value="APA7">APA 7th Edition</option>
                    <option value="IEEE">IEEE Citation Format</option>
                    <option value="HARVARD">Harvard Referencing Standard</option>
                  </select>
                </div>
              </div>
            ) : toolId === "methodology" ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                    Research Methodology Nature *
                  </label>
                  <select
                    value={mResearchType}
                    onChange={(e) => setMResearchType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-input text-sm bg-background font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value="Engineering & Software System Development">Engineering & Software System Development (Prototype / IoT / ML)</option>
                    <option value="Empirical Survey & Social Sciences">Empirical Survey & Social Sciences (Questionnaires, SPSS, Interviews)</option>
                    <option value="Scientific Practical Experiment">Scientific Practical Experiment (Physical / Chemical Tests)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                    Governing Research Questions / Hypotheses *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. 1. What is the impact of automated irrigation on crop yield? 2. What is the system diagnostic accuracy?"
                    value={mQuestions}
                    onChange={(e) => setMQuestions(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-input text-sm bg-background leading-relaxed focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                    Target Population & Study Scope
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 250 Registered Agro-dealers in Morogoro, 50,000 transaction log records"
                    value={mPopulation}
                    onChange={(e) => setMPopulation(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-input text-sm bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                    Data Collection Instruments & Tech Stack
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Self-administered questionnaires, Python PyTorch, MQTT, PostgreSQL"
                    value={mTools}
                    onChange={(e) => setMTools(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-input text-sm bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="text-sm font-medium">What should the assistant know?</div>
                <textarea
                  className="flex-1 w-full p-4 rounded-xl border bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  placeholder={tool.placeholders.input}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 p-4 rounded-xl text-sm text-amber-800 dark:text-amber-400">
                  <span className="font-bold flex items-center gap-2 mb-2"><Sparkles className="size-4" /> Pro Tip:</span>
                  {tool.placeholders.context}
                </div>
              </>
            )}
          </div>

          <div className="p-4 border-t bg-slate-50 dark:bg-slate-800/50">
            {toolId === "topic-assistant" ? (
              <Button 
                className="w-full h-12 shadow-md gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold" 
                onClick={handleGenerateTopics}
                disabled={isGenerating || !progField.trim() || !interestDomain.trim()}
              >
                {isGenerating ? <RefreshCw className="size-5 animate-spin" /> : <Sparkles className="size-5" />}
                {isGenerating ? "Scoping Research Topics..." : "Generate 4 Scoped Research Proposals"}
              </Button>
            ) : toolId === "lit-review" ? (
              <Button 
                className="w-full h-12 shadow-md gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold" 
                onClick={handleGenerateLitReview}
                disabled={isGenerating || !lrTopic.trim()}
              >
                {isGenerating ? <RefreshCw className="size-5 animate-spin" /> : <Sparkles className="size-5" />}
                {isGenerating ? "Synthesizing Chapter 2..." : "Synthesize Thematic Literature Review"}
              </Button>
            ) : toolId === "methodology" ? (
              <Button 
                className="w-full h-12 shadow-md gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold" 
                onClick={handleGenerateMethodology}
                disabled={isGenerating || !mQuestions.trim()}
              >
                {isGenerating ? <RefreshCw className="size-5 animate-spin" /> : <Sparkles className="size-5" />}
                {isGenerating ? "Architecting Methodology..." : "Architect Defense-Ready Methodology"}
              </Button>
            ) : (
              <Button 
                className="w-full h-12 shadow-md gap-2" 
                onClick={() => handleGenerate()}
                disabled={isGenerating || !input.trim()}
              >
                {isGenerating ? <RefreshCw className="size-5 animate-spin" /> : <Sparkles className="size-5" />}
                {isGenerating ? "Generating..." : "Generate Output"}
              </Button>
            )}
          </div>
        </div>

        {/* Right Side: Output Viewer */}
        <div className="w-full lg:w-1/2 flex flex-col h-full bg-slate-50 border dark:bg-slate-900/50 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b flex justify-between items-center bg-white dark:bg-slate-900">
            <span className="font-semibold text-sm flex items-center gap-2">
              Output Generation
              {isGenerating && <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />}
            </span>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className={`h-8 gap-1.5 text-xs transition ${
                  !isUnlocked 
                    ? 'border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40' 
                    : ''
                }`}
                disabled={!output} 
                onClick={handleCopy}
                title={!isUnlocked ? "Payment required to copy output" : "Copy to clipboard"}
              >
                {!isUnlocked ? <Lock className="size-3.5 text-amber-500" /> : <Copy className="size-3.5" />}
                {copyFeedback ? "Copied!" : !isUnlocked ? "Copy (Locked)" : "Copy"}
              </Button>
              <Button 
                size="sm" 
                className="h-8 gap-1.5 text-xs bg-rose-600 hover:bg-rose-700 text-white font-medium shadow-sm transition"
                disabled={!output} 
                onClick={() => handleExport("pdf")}
                title={!isUnlocked ? "Payment required to download PDF" : "Download PDF Document"}
              >
                {!isUnlocked ? <Lock className="size-3.5" /> : <FileText className="size-3.5" />}
                {isUnlocked ? "Download PDF" : "Unlock & Download PDF"}
              </Button>
            </div>
          </div>

          <div 
            className={`flex-1 p-6 overflow-y-auto whitespace-pre-wrap font-serif text-slate-800 dark:text-slate-200 leading-relaxed relative ${
              output && !isUnlocked ? 'select-none' : ''
            }`}
            onCopy={(e) => {
              if (output && !isUnlocked) {
                e.preventDefault();
                setShowPaymentModal(true);
              }
            }}
            onContextMenu={(e) => {
              if (output && !isUnlocked) {
                e.preventDefault();
              }
            }}
            onKeyDown={(e) => {
              if (output && !isUnlocked && (e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "C" || e.key === "x" || e.key === "X")) {
                e.preventDefault();
                setShowPaymentModal(true);
              }
            }}
          >
            {output ? (
              <div className="relative">
                {/* PIPELINE HAND-OFF ACTION BANNER */}
                {toolId === "topic-assistant" && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-xl mb-4 flex items-center justify-between gap-3 font-sans">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="size-5 text-amber-600 shrink-0" />
                      <span className="text-xs font-semibold text-amber-950 dark:text-amber-200">
                        Ready to develop your thesis? Carry your topic into the FYP Builder.
                      </span>
                    </div>
                    <Link href={`/dashboard/tools/fyp-generator?programme=${encodeURIComponent(progField)}`}>
                      <Button size="sm" className="bg-amber-600 hover:bg-amber-500 text-white gap-1.5 text-xs font-bold shrink-0">
                        Launch FYP Builder <ArrowRight className="size-3.5" />
                      </Button>
                    </Link>
                  </div>
                )}

                {(toolId === "lit-review" || toolId === "methodology") && (
                  <div className="p-3 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 rounded-xl mb-4 flex items-center justify-between gap-3 font-sans">
                    <div className="flex items-center gap-2">
                      <BookOpen className="size-5 text-teal-600 shrink-0" />
                      <span className="text-xs font-semibold text-teal-950 dark:text-teal-200">
                        Attach this section to your multi-chapter Final Year Project.
                      </span>
                    </div>
                    <Link href="/dashboard/tools/fyp-generator">
                      <Button size="sm" className="bg-teal-600 hover:bg-teal-500 text-white gap-1.5 text-xs font-bold shrink-0">
                        Open FYP Builder <ArrowRight className="size-3.5" />
                      </Button>
                    </Link>
                  </div>
                )}

                {output}
                {!isUnlocked && (
                  <div className="mt-8 pt-4 border-t text-center text-xs text-slate-400 uppercase font-mono tracking-wider font-sans">
                    — Preview Mode • Payment Required to Copy or Export —
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 gap-4 font-sans">
                <tool.icon className="size-16 stroke-[1px]" />
                <p>Awaiting input parameters to generate...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
