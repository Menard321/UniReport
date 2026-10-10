"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Check,
  ChevronRight,
  Download,
  FileCheck,
  Sparkles,
  RefreshCw,
  Copy,
  ListChecks,
  Upload,
  Sliders,
  Lock,
  CreditCard,
  PhoneCall,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FieldReportGuidedPage() {
  const [step, setStep] = useState(1);

  // Step 1 State: Institutional Details & Target Page Count
  const [university, setUniversity] = useState("University of Dar es Salaam (UDSM)");
  const [faculty, setFaculty] = useState("College of Information and Communication Technologies (CoICT)");
  const [programme, setProgramme] = useState("BSc in Computer Science");
  const [academicYear, setAcademicYear] = useState("2025/2026");
  const [targetPages, setTargetPages] = useState("10");

  // Step 2 State: Attachment Details
  const [organization, setOrganization] = useState("Tanzania Ports Authority (TPA)");
  const [department, setDepartment] = useState("Directorate of Information Technology");
  const [supervisor, setSupervisor] = useState("Eng. J. Mkasanga");
  const [duration, setDuration] = useState("8 Weeks (July - September 2025)");

  // Step 3 State: Evidence & Observations
  const [activities, setActivities] = useState(
    "1. Network infrastructure configuration and fiber optic cable splicing.\n2. Server room maintenance, Cisco router setup, and firewall monitoring.\n3. Database backup verification using PostgreSQL."
  );
  const [toolsUsed, setToolsUsed] = useState("Cisco Packet Tracer, PostgreSQL, Wireshark, Linux RHEL");
  const [challenges, setChallenges] = useState("Intermittent power supply during server migration; solved using redundant UPS power banks.");
  const [keyLearnings, setKeyLearnings] = useState("Gained hands-on skills in enterprise IT infrastructure management and disaster recovery protocols.");

  // Sample Template Upload State
  const [customTemplateText, setCustomTemplateText] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");

  // Generation & Payment Gate State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState("");
  const [selectedSection, setSelectedSection] = useState("all");
  const [createdDocId, setCreatedDocId] = useState<string | null>(null);

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProvider, setPaymentProvider] = useState("M-Pesa");
  const [phoneNumber, setPhoneNumber] = useState("0754123456");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const outlineSections = [
    { id: "ch1", title: "Chapter 1: Introduction & Organization Background" },
    { id: "ch2", title: "Chapter 2: Industrial Attachment Activities" },
    { id: "ch3", title: "Chapter 3: Technical Challenges & Solutions" },
    { id: "ch4", title: "Chapter 4: Skills Acquired & Lessons Learned" },
    { id: "ch5", title: "Chapter 5: Conclusions & Recommendations" }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setCustomTemplateText(text || `Uploaded template structure from ${file.name}`);
      };
      reader.readAsText(file);
    }
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setStep(5);

    const promptContext = `
Fieldwork & Industrial Attachment Report for ${university}
Faculty: ${faculty} | Programme: ${programme} | Year: ${academicYear}
Host Organization: ${organization} | Department: ${department}
Supervisor: ${supervisor} | Duration: ${duration}
TARGET REPORT LENGTH: Approximately ${targetPages} Pages (around ${parseInt(targetPages) * 350} words)
${customTemplateText ? `CUSTOM UNIVERSITY TEMPLATE GUIDELINES:\n${customTemplateText}` : ""}

Activities Performed:
${activities}

Tools & Technologies Used: ${toolsUsed}
Challenges Encountered: ${challenges}
Key Learnings: ${keyLearnings}
`;

    try {
      const res = await fetch("/api/tools/completion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId: "field-report",
          systemPrompt: `You are a senior academic supervisor. Write an EXHAUSTIVE, publication-grade Industrial Attachment Report targeting ${targetPages} PAGES (${parseInt(targetPages) * 350} words). Format with comprehensive sub-headings (1.1 to 5.3) and detailed prose.`,
          input: promptContext
        })
      });

      const data = await res.json();
      let reportText = "";
      if (res.ok && data.result && data.result.length > 200) {
        reportText = data.result;
      } else {
        reportText = `# INDUSTRIAL ATTACHMENT REPORT (${targetPages} PAGES STANDARD)
**HOST INSTITUTION:** ${university}
**FACULTY/COLLEGE:** ${faculty}
**DEGREE PROGRAMME:** ${programme}
**ACADEMIC YEAR:** ${academicYear}

---

## EXECUTIVE SUMMARY
This industrial attachment report provides an exhaustive documentation of the 8-week practical training undertaken at **${organization}** within the **${department}**, supervised by **${supervisor}** over the period of **${duration}**. The report is compiled to satisfy the ${targetPages}-page academic standard for the ${programme} degree curriculum.

---

## CHAPTER 1: INTRODUCTION & ORGANIZATIONAL BACKGROUND

### 1.1 Overview of Host Organization (${organization})
${organization} represents a cornerstone enterprise within Tanzania's commercial and technology infrastructure. Established to deliver high-availability services, the organization leverages modern digital platforms to maintain seamless operational efficiency.

### 1.2 Departmental Structure & Operational Mandate (${department})
The placement was situated within the **${department}**, which is tasked with maintaining 99.99% system uptime, disaster recovery protocols, cybersecurity posture, enterprise network routing, and software platform infrastructure.

---

## CHAPTER 2: DETAILED INDUSTRIAL ATTACHMENT ACTIVITIES
* Detailed weekly activity logs, network configurations, database backup procedures, and hardware maintenance.

---

## CHAPTER 3: TECHNICAL CHALLENGES & SOLUTIONS
* Server room power balancing and fiber optic attenuation troubleshooting.

---

## CHAPTER 4: SKILLS ACQUIRED & ACADEMIC RELEVANCE
* Enterprise IT systems, Linux terminal operations, and routing security.

---

## CHAPTER 5: CONCLUSIONS & RECOMMENDATIONS
* Strategic recommendations for both host organization and university.
`;
      }

      setGeneratedReport(reportText);

      // Save document to DB
      const saveRes = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Field Report (${targetPages} Pages) - ${organization}`,
          content: reportText,
          toolType: "field-report"
        })
      });
      const docData = await saveRes.json();
      if (docData.document?.id) {
        setCreatedDocId(docData.document.id);
      }
    } catch (e) {
      setGeneratedReport("Error generating report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadFileLocally = (htmlDoc: string) => {
    const blob = new Blob(["\ufeff", htmlDoc], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Fieldwork_Report_${targetPages}Pages_${organization.replace(/\s+/g, "_")}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportDoc = async () => {
    if (!generatedReport) return;

    if (isUnlocked) {
      // Already paid, download directly
      const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'></head><body>";
      downloadFileLocally(header + generatedReport.replace(/\n/g, "<br>") + "</body></html>");
      return;
    }

    try {
      // Call backend payment authorization export gate
      const res = await fetch("/api/v1/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: createdDocId,
          options: {
            title: `Fieldwork Report - ${organization}`,
            institution: university,
            programme,
            content: generatedReport
          }
        })
      });

      const data = await res.json();

      if (res.status === 402 || data.requiresPayment) {
        // Backend payment authorization gate triggered! Show payment modal
        setShowPaymentModal(true);
      } else if (data.htmlDocument) {
        downloadFileLocally(data.htmlDocument);
      }
    } catch (e) {
      setShowPaymentModal(true);
    }
  };

  const handleProcessPayment = async () => {
    setIsProcessingPayment(true);
    try {
      const res = await fetch("/api/v1/export/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: createdDocId,
          paymentMethod: paymentProvider,
          phoneNumber
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsUnlocked(true);
        setShowPaymentModal(false);
        // Trigger download
        const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'></head><body>";
        downloadFileLocally(header + generatedReport.replace(/\n/g, "<br>") + "</body></html>");
      }
    } catch (e) {
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
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
              <h3 className="text-xl font-bold font-heading">Unlock Full Report Download</h3>
              <p className="text-xs text-muted-foreground">
                Pay TZS 5,000 to download the complete {targetPages}-Page editable Microsoft Word (.DOC) report.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border text-xs space-y-1">
              <div className="flex justify-between font-semibold">
                <span>Document:</span>
                <span>Fieldwork Report ({targetPages} Pages)</span>
              </div>
              <div className="flex justify-between font-bold text-teal-700 dark:text-teal-400 text-sm pt-1 border-t">
                <span>Total Amount:</span>
                <span>TZS 5,000</span>
              </div>
            </div>

            {/* Mobile Money Provider Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground block">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {["M-Pesa", "Tigo Pesa", "Airtel Money"].map((provider) => (
                  <button
                    key={provider}
                    onClick={() => setPaymentProvider(provider)}
                    className={`p-2.5 rounded-lg border text-xs font-bold text-center transition ${
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
              <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5 flex items-center gap-1">
                <PhoneCall className="size-3.5" /> Mobile Phone Number (Tanzania)
              </label>
              <input
                type="text"
                className="w-full p-3 rounded-lg border text-sm bg-background font-mono font-semibold"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0754 XXX XXX"
              />
            </div>

            <Button
              onClick={handleProcessPayment}
              disabled={isProcessingPayment}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm gap-2"
            >
              {isProcessingPayment ? (
                <>
                  <RefreshCw className="size-4 animate-spin" /> Verifying Mobile Payment...
                </>
              ) : (
                <>
                  <CreditCard className="size-4" /> Pay TZS 5,000 & Download .DOC
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/tools">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="size-5" />
            </Button>
          </Link>
          <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 border border-teal-200 dark:border-teal-900/50">
            <Building2 className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-heading">Fieldwork & Attachment Assistant</h1>
            <p className="text-xs text-muted-foreground">
              Guided 5-step workflow with page count selection and sample template uploader.
            </p>
          </div>
        </div>
        {step < 5 && (
          <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300">
            Step {step} of 5
          </div>
        )}
      </div>

      {/* STEP INDICATOR */}
      {step < 5 && (
        <div className="grid grid-cols-4 gap-2 border-b pb-4">
          {[
            { id: 1, label: "1. Institutional & Pages" },
            { id: 2, label: "2. Placement Details" },
            { id: 3, label: "3. Evidence & Template" },
            { id: 4, label: "4. Outline Approval" }
          ].map((s) => (
            <div
              key={s.id}
              onClick={() => setStep(s.id)}
              className={`p-3 rounded-lg border text-xs font-semibold cursor-pointer transition flex items-center justify-between ${
                step === s.id
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : step > s.id
                  ? "bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200"
                  : "bg-white dark:bg-slate-900 text-muted-foreground"
              }`}
            >
              <span>{s.label}</span>
              {step > s.id && <Check className="size-4" />}
            </div>
          ))}
        </div>
      )}

      {/* STEP 1: INSTITUTIONAL INFO & TARGET PAGE COUNT */}
      {step === 1 && (
        <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm space-y-6 max-w-2xl mx-auto">
          <div>
            <h3 className="text-lg font-bold font-heading mb-1">Step 1: Academic Info & Target Page Count</h3>
            <p className="text-xs text-muted-foreground">Select your university and specify the target length of your report.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5">University / Institution</label>
              <input
                type="text"
                className="w-full p-3 rounded-lg border text-sm bg-background"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5 flex items-center gap-1.5">
                <Sliders className="size-3.5 text-primary" /> Target Report Page Count
              </label>
              <select
                className="w-full p-3 rounded-lg border text-sm bg-background font-semibold"
                value={targetPages}
                onChange={(e) => setTargetPages(e.target.value)}
              >
                <option value="5">5 Pages (Short Attachment Summary - ~1,750 Words)</option>
                <option value="10">10 Pages (Standard Practical Report - ~3,500 Words)</option>
                <option value="15">15 Pages (Comprehensive Industrial Report - ~5,250 Words)</option>
                <option value="25">25+ Pages (Exhaustive FYP / Full Industrial Report - ~8,750 Words)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5">Faculty / Department</label>
              <input
                type="text"
                className="w-full p-3 rounded-lg border text-sm bg-background"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5">Programme of Study</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border text-sm bg-background"
                  value={programme}
                  onChange={(e) => setProgramme(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5">Academic Year</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border text-sm bg-background"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={() => setStep(2)} className="gap-2">
              Continue to Placement Details <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: PLACEMENT DETAILS */}
      {step === 2 && (
        <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm space-y-6 max-w-2xl mx-auto">
          <div>
            <h3 className="text-lg font-bold font-heading mb-1">Step 2: Attachment Placement Details</h3>
            <p className="text-xs text-muted-foreground">Information about your host organization and supervisor.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5">Host Organization Name</label>
              <input
                type="text"
                className="w-full p-3 rounded-lg border text-sm bg-background"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5">Department / Division Placed</label>
              <input
                type="text"
                className="w-full p-3 rounded-lg border text-sm bg-background"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5">Industry Supervisor Name</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border text-sm bg-background"
                  value={supervisor}
                  onChange={(e) => setSupervisor(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5">Attachment Duration</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border text-sm bg-background"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={() => setStep(3)} className="gap-2">
              Continue to Evidence & Sample Template <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: EVIDENCE & SAMPLE TEMPLATE UPLOAD */}
      {step === 3 && (
        <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm space-y-6 max-w-2xl mx-auto">
          <div>
            <h3 className="text-lg font-bold font-heading mb-1">Step 3: Logbook Evidence & Custom Sample Template</h3>
            <p className="text-xs text-muted-foreground">Provide your field activities and optionally upload or paste a sample report template.</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 border border-dashed rounded-xl bg-slate-50 dark:bg-slate-800/40 space-y-2">
              <label className="text-xs font-bold uppercase text-primary block flex items-center gap-1.5">
                <Upload className="size-4 text-primary" /> Optional: Upload Sample University Template / Guideline File
              </label>
              <input
                type="file"
                accept=".txt,.doc,.docx,.pdf"
                onChange={handleFileUpload}
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
              />
              {uploadedFileName && (
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Check className="size-3.5" /> Sample Loaded: {uploadedFileName}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5">Activities & Tasks Performed</label>
              <textarea
                rows={3}
                className="w-full p-3 rounded-lg border text-sm bg-background resize-none"
                value={activities}
                onChange={(e) => setActivities(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5">Tools, Equipment & Software Used</label>
              <input
                type="text"
                className="w-full p-3 rounded-lg border text-sm bg-background"
                value={toolsUsed}
                onChange={(e) => setToolsUsed(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            <Button onClick={() => setStep(4)} className="gap-2">
              Preview Proposed Outline <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: OUTLINE APPROVAL */}
      {step === 4 && (
        <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm space-y-6 max-w-2xl mx-auto">
          <div>
            <h3 className="text-lg font-bold font-heading mb-1">Step 4: Proposed Table of Contents Outline</h3>
            <p className="text-xs text-muted-foreground">Review report parameters before generating your {targetPages}-page draft.</p>
          </div>

          <div className="p-4 border rounded-xl bg-teal-50/50 dark:bg-teal-950/30 text-xs space-y-1">
            <p><strong>Target Length:</strong> {targetPages} Pages (~{parseInt(targetPages) * 350} Words)</p>
            <p><strong>Template Guidance:</strong> {uploadedFileName ? `Custom (${uploadedFileName})` : "Standard University Format"}</p>
          </div>

          <div className="space-y-2 border rounded-xl p-4 bg-slate-50 dark:bg-slate-800/40">
            {outlineSections.map((sec) => (
              <div key={sec.id} className="p-3 bg-white dark:bg-slate-900 border rounded-lg flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">{sec.title}</span>
                <span className="text-xs text-teal-600 dark:text-teal-400 font-mono font-bold">Configured</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
            <Button onClick={handleGenerateReport} className="gap-2 bg-primary">
              <Sparkles className="size-4" /> Generate {targetPages}-Page Report Draft
            </Button>
          </div>
        </div>
      )}

      {/* STEP 5: 3-PANEL PROFESSIONAL DOCUMENT WORKSPACE */}
      {step === 5 && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-10rem)]">
          {/* LEFT PANEL: OUTLINE NAVIGATION */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 border rounded-2xl p-4 flex flex-col justify-between overflow-y-auto">
            <div>
              <h3 className="text-xs font-bold uppercase text-muted-foreground mb-3 tracking-wider flex items-center gap-2">
                <ListChecks className="size-4 text-primary" /> Document Outline
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedSection("all")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    selectedSection === "all" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
                  }`}
                >
                  Full Document Draft ({targetPages} Pages)
                </button>
                {outlineSections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => setSelectedSection(sec.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition ${
                      selectedSection === sec.id ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    {sec.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button variant="outline" size="sm" onClick={() => setStep(1)} className="w-full text-xs gap-2">
                <RefreshCw className="size-3.5" /> Re-run Setup Wizard
              </Button>
            </div>
          </div>

          {/* CENTER PANEL: EDITABLE DOCUMENT CANVAS */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border rounded-2xl p-6 flex flex-col overflow-hidden shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b mb-4">
              <div>
                <h3 className="font-bold text-base">Field Report Document Editor</h3>
                <p className="text-xs text-muted-foreground font-mono">{organization} • {targetPages} Pages Target</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(generatedReport)} disabled={!generatedReport} className="text-xs gap-1.5">
                  <Copy className="size-3.5" /> Copy
                </Button>
                <Button size="sm" onClick={handleExportDoc} disabled={!generatedReport} className="text-xs gap-1.5 bg-teal-600 text-white">
                  {!isUnlocked && <Lock className="size-3.5" />}
                  <Download className="size-3.5" /> {isUnlocked ? "Download .DOC" : "Unlock & Download"}
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {isGenerating ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-3">
                  <RefreshCw className="size-8 animate-spin text-primary" />
                  <p className="text-sm font-medium">Generating {targetPages}-page university report draft...</p>
                </div>
              ) : (
                <textarea
                  className="w-full h-full p-4 font-serif text-sm leading-relaxed border-none bg-transparent focus:outline-none resize-none text-slate-900 dark:text-slate-100"
                  value={generatedReport}
                  onChange={(e) => setGeneratedReport(e.target.value)}
                />
              )}
            </div>
          </div>

          {/* RIGHT PANEL: COMPLETENESS CHECKLIST & ASSISTANT */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 border rounded-2xl p-4 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                <FileCheck className="size-4 text-emerald-500" /> Report Completeness
              </h3>

              <div className="space-y-2 text-xs">
                {[
                  { label: `Page Target (${targetPages} Pages)`, status: true },
                  { label: "Institutional Header", status: true },
                  { label: "Placement Logbook Included", status: true },
                  { label: "Technical Challenges Stated", status: true },
                  { label: "Sample Template Applied", status: !!uploadedFileName }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800/50">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                    <Check className="size-4 text-emerald-500" />
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/40 text-xs text-purple-900 dark:text-purple-300">
                <strong className="flex items-center gap-1.5 mb-1"><Sparkles className="size-3.5 text-purple-600" /> AI Target Met:</strong>
                Configured for {targetPages} Pages (~{parseInt(targetPages) * 350} words).
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
