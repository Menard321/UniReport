"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Check,
  ChevronRight,
  FileCheck,
  FileText,
  Sparkles,
  RefreshCw,
  Copy,
  Download,
  ShieldCheck,
  Loader2,
  GraduationCap,
  FlaskConical,
  Sliders,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocxCompilerEngine } from "@/lib/export/docx-compiler";
import { DocumentExportPaywallModal } from "@/components/billing/DocumentExportPaywallModal";
import {
  getUniversitiesCatalog,
  getUniversityByShortName,
  getCollegesForUniversity,
  getCoursesForCollege,
  CollegeItem,
  CourseItem
} from "@/data/tanzania-academic-catalog";

interface BlueprintSection {
  chapterNumber: number;
  title: string;
  subHeadings: string[];
  wordBudget: number;
  promptInstructions: string;
}

export default function LabReportGuidedPage() {
  const [step, setStep] = useState(1);
  const [stepError, setStepError] = useState("");

  // Universities Catalog
  const catalogUniversities = getUniversitiesCatalog();

  // STEP 1: INSTITUTION & PROGRAMME (ZERO STATIC DATA)
  const [selectedUniShortName, setSelectedUniShortName] = useState("");
  const [university, setUniversity] = useState("");
  const [selectedCollegeId, setSelectedCollegeId] = useState("");
  const [faculty, setFaculty] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [programme, setProgramme] = useState("");
  const [customCourse, setCustomCourse] = useState("");
  const [isCustomCourse, setIsCustomCourse] = useState(false);
  const [academicYear, setAcademicYear] = useState("");
  const [targetPages, setTargetPages] = useState("8");

  // Dynamic College & Course Lists
  const [availableColleges, setAvailableColleges] = useState<CollegeItem[]>([]);
  const [availableCourses, setAvailableCourses] = useState<CourseItem[]>([]);

  // STEP 2: LAB CONTEXT & STUDENT IDENTITY
  const [experimentTitle, setExperimentTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [labFacility, setLabFacility] = useState("");
  const [studentName, setStudentName] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [instructor, setInstructor] = useState("");
  const [labDate, setLabDate] = useState("");

  // STEP 3: EXPERIMENTAL PARAMETERS & AUTHENTIC EVIDENCE
  const [apparatus, setApparatus] = useState("");
  const [variables, setVariables] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [procedure, setProcedure] = useState("");
  const [observations, setObservations] = useState("");
  const [safetyPrecautions, setSafetyPrecautions] = useState("");

  // STEP 4 & 5: SEQUENTIAL GENERATION STATE
  const [blueprintSections, setBlueprintSections] = useState<BlueprintSection[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentDraftingIndex, setCurrentDraftingIndex] = useState(0);
  const [generatedReport, setGeneratedReport] = useState("");
  const [createdDocId, setCreatedDocId] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [selectedExportFormat, setSelectedExportFormat] = useState<"pdf" | "doc">("pdf");

  // Institution Selection Sync
  const handleUniversityChange = (shortName: string) => {
    setSelectedUniShortName(shortName);
    setStepError("");
    if (!shortName) {
      setUniversity("");
      setAvailableColleges([]);
      setSelectedCollegeId("");
      setFaculty("");
      setAvailableCourses([]);
      setSelectedCourseId("");
      setProgramme("");
      return;
    }
    const uni = getUniversityByShortName(shortName);
    if (uni) {
      setUniversity(uni.name);
      const cols = getCollegesForUniversity(shortName);
      setAvailableColleges(cols);
      setSelectedCollegeId("");
      setFaculty("");
      setAvailableCourses([]);
      setSelectedCourseId("");
      setProgramme("");
    }
  };

  const handleCollegeChange = (colId: string) => {
    setSelectedCollegeId(colId);
    setStepError("");
    if (!colId) {
      setFaculty("");
      setAvailableCourses([]);
      setSelectedCourseId("");
      setProgramme("");
      return;
    }
    const col = availableColleges.find(c => c.id === colId);
    if (col) {
      setFaculty(col.name);
      const crs = getCoursesForCollege(selectedUniShortName, colId);
      setAvailableCourses(crs);
      setSelectedCourseId("");
      setProgramme("");
      setIsCustomCourse(false);
    }
  };

  const handleCourseChange = (crsId: string) => {
    setSelectedCourseId(crsId);
    setStepError("");
    if (!crsId) {
      setProgramme("");
      setIsCustomCourse(false);
      return;
    }
    if (crsId === "custom") {
      setIsCustomCourse(true);
      setProgramme(customCourse);
      return;
    }
    setIsCustomCourse(false);
    const crs = availableCourses.find(c => c.id === crsId);
    if (crs) {
      setProgramme(crs.name);
    }
  };

  // Navigations with strict validations
  const handleProceedToStep2 = () => {
    if (!selectedUniShortName) {
      setStepError("Please select your Higher Learning Institution.");
      return;
    }
    if (!selectedCollegeId) {
      setStepError("Please select your Faculty or Department.");
      return;
    }
    if (!selectedCourseId || (isCustomCourse && !customCourse.trim())) {
      setStepError("Please select or specify your Degree Programme.");
      return;
    }
    setStepError("");
    setStep(2);
  };

  const handleProceedToStep3 = () => {
    if (!experimentTitle.trim()) {
      setStepError("Please enter the official Experiment Title.");
      return;
    }
    if (!courseCode.trim()) {
      setStepError("Please enter the Course / Module Code (e.g. ME 211, CS 301).");
      return;
    }
    if (!studentName.trim() || !regNumber.trim()) {
      setStepError("Please provide your Student Full Name and Registration Number.");
      return;
    }
    setStepError("");
    setStep(3);
  };

  const handleProceedToStep4 = async () => {
    if (!apparatus.trim()) {
      setStepError("Please list the Laboratory Apparatus & Instruments used.");
      return;
    }
    if (!procedure.trim()) {
      setStepError("Please describe the experimental procedure or testing steps.");
      return;
    }
    setStepError("");

    // Request Blueprint from Orchestrator
    try {
      const res = await fetch("/api/v1/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actionType: "CREATE_PLAN",
          institution: university,
          targetPages: parseInt(targetPages) || 8,
          assignment: {
            title: experimentTitle,
            reportType: "LAB_REPORT",
            institution: university,
            faculty: faculty,
            programme: isCustomCourse ? customCourse : programme,
            targetPages: parseInt(targetPages) || 8,
            citationStyle: "IEEE"
          }
        })
      });
      const data = await res.json();
      if (data.success && data.plan?.sections) {
        setBlueprintSections(data.plan.sections);
      }
    } catch (e) {
      console.warn("Error fetching lab plan:", e);
    }

    setStep(4);
  };

  // SEQUENTIAL MULTI-PASS CHAPTER GENERATION
  const handleStartSequentialGeneration = async () => {
    setIsGenerating(true);
    setStep(5);
    setGeneratedReport("");

    const resolvedProg = isCustomCourse ? customCourse : programme;
    let fullCompiledReport = `# ${experimentTitle.toUpperCase()}
**INSTITUTION:** ${university}
**FACULTY / DEPARTMENT:** ${faculty}
**PROGRAMME:** ${resolvedProg}
**COURSE CODE:** ${courseCode}
**STUDENT NAME:** ${studentName} (${regNumber})
**LABORATORY FACILITY:** ${labFacility || "University Departmental Laboratory"}
**DATE OF EXPERIMENT:** ${labDate || "Academic Term"}
**SUPERVISOR / INSTRUCTOR:** ${instructor || "Departmental Lab Technician"}

---
`;

    setGeneratedReport(fullCompiledReport);

    const sectionsToDraft = blueprintSections.length > 0 ? blueprintSections : [
      {
        chapterNumber: 1,
        title: "Section 1: Experiment Title, Objectives & Theoretical Principles",
        subHeadings: ["1.1 Scientific Rationale", "1.2 Theoretical Principles & Governing Laws", "1.3 Stated Hypotheses"],
        wordBudget: 600,
        promptInstructions: "Explain the scientific rationale and formulas."
      },
      {
        chapterNumber: 2,
        title: "Section 2: Laboratory Apparatus, Materials & Calibration",
        subHeadings: ["2.1 Apparatus & Specifications", "2.2 Material Reagents", "2.3 Calibration Protocols"],
        wordBudget: 600,
        promptInstructions: "Detail apparatus and calibration."
      },
      {
        chapterNumber: 3,
        title: "Section 3: Experimental Methodology & Operating Procedures",
        subHeadings: ["3.1 Variables Identification", "3.2 Procedural Workflow", "3.3 Safety Protocols"],
        wordBudget: 750,
        promptInstructions: "State variables and chronological procedure."
      },
      {
        chapterNumber: 4,
        title: "Section 4: Data Acquisition, Observations & Calculations",
        subHeadings: ["4.1 Tabulation of Readings", "4.2 Applied Equations", "4.3 Step-by-Step Calculations"],
        wordBudget: 850,
        promptInstructions: "Present markdown tables and sample calculations."
      },
      {
        chapterNumber: 5,
        title: "Section 5: Scientific Discussion & Error Analysis",
        subHeadings: ["5.1 Critical Evaluation", "5.2 Comparison with Standards", "5.3 Sources of Error"],
        wordBudget: 650,
        promptInstructions: "Critically discuss findings and calculate error."
      },
      {
        chapterNumber: 6,
        title: "Section 6: Conclusions & Practical Recommendations",
        subHeadings: ["6.1 Hypothesis Validation", "6.2 Engineering Takeaways", "6.3 Recommendations"],
        wordBudget: 450,
        promptInstructions: "Formulate decisive conclusions and recommendations."
      }
    ];

    const evidencePayload = {
      reportType: "LAB_REPORT",
      experimentTitle,
      courseCode,
      labName: labFacility,
      apparatus,
      variables,
      hypothesis,
      procedure,
      observations,
      safetyPrecautions
    };

    // Sequential Loop
    for (let i = 0; i < sectionsToDraft.length; i++) {
      setCurrentDraftingIndex(i);
      const currentSec = sectionsToDraft[i];

      try {
        const res = await fetch("/api/v1/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actionType: "DRAFT_SECTION",
            institution: university,
            chapterTitle: currentSec.title,
            subHeadings: currentSec.subHeadings,
            wordBudget: currentSec.wordBudget,
            promptInstructions: currentSec.promptInstructions,
            evidenceData: evidencePayload,
            formattingRules: { citationStyle: "IEEE" }
          })
        });

        const data = await res.json();
        const sectionText = data.result?.text || `\n\n## ${currentSec.title}\nContent generated in compliance with ${university} lab guidelines.\n`;
        fullCompiledReport += `\n\n${sectionText}\n\n---`;
        setGeneratedReport(fullCompiledReport);
      } catch (err) {
        console.warn(`Section ${i + 1} drafting notice:`, err);
        fullCompiledReport += `\n\n## ${currentSec.title}\n\n### ${currentSec.subHeadings[0] || "Overview"}\nExperimental investigation performed in accordance with ${university} laboratory protocol.\n`;
        setGeneratedReport(fullCompiledReport);
      }
    }

    // Persist to Database physically
    try {
      const docRes = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${experimentTitle} (Lab Report)`,
          content: fullCompiledReport,
          toolType: "LAB_REPORT"
        })
      });
      const docData = await docRes.json();
      if (docData && docData.document?.id) {
        setCreatedDocId(docData.document.id);
      }
    } catch (e) {
      console.warn("Document save note:", e);
    }

    setIsGenerating(false);
  };

  const handleCopy = () => {
    if (!generatedReport) return;
    if (!isUnlocked) {
      setShowPaywallModal(true);
      return;
    }
    navigator.clipboard.writeText(generatedReport);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handleExport = async (format: "pdf" | "doc" = "pdf") => {
    if (!generatedReport) return;
    setSelectedExportFormat(format);

    const exportOptions = {
      title: experimentTitle || "LABORATORY REPORT",
      institution: university || "Tanzanian Higher Learning Institution",
      institutionShortName: selectedUniShortName || undefined,
      logoUrl: selectedUniShortName ? getUniversityByShortName(selectedUniShortName)?.logoUrl : undefined,
      reportType: "LABORATORY PRACTICAL REPORT",
      faculty,
      programme: isCustomCourse ? customCourse : programme,
      studentName: studentName || "STUDENT NAME",
      registrationNumber: regNumber || "REGISTRATION NUMBER",
      supervisorName: instructor,
      academicYear,
      content: generatedReport
    };

    if (isUnlocked) {
      if (format === "doc") {
        DocxCompilerEngine.downloadDocxFile(exportOptions);
      } else {
        DocxCompilerEngine.openPdfPrintWindow(exportOptions);
      }
      return;
    }

    try {
      const res = await fetch("/api/v1/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: createdDocId,
          format,
          options: exportOptions
        })
      });

      const data = await res.json();
      if (res.status === 402 || data.requiresPayment) {
        setShowPaywallModal(true);
      } else if (data.success) {
        setIsUnlocked(true);
        if (format === "doc") {
          DocxCompilerEngine.downloadDocxFile(exportOptions);
        } else {
          DocxCompilerEngine.openPdfPrintWindow(exportOptions);
        }
      }
    } catch (e) {
      setShowPaywallModal(true);
    }
  };

  const handleExportDocx = () => handleExport("doc");
  const handleExportPdf = () => handleExport("pdf");

  const totalWords = generatedReport.split(/\s+/).filter(Boolean).length;
  const estimatedPages = Math.max(1, Math.round(totalWords / 350));

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* HEADER & BREADCRUMBS */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/create">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Back to Report Creator
          </Button>
        </Link>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
          <FlaskConical className="size-3.5" />
          Guided Laboratory Report Builder
        </div>
      </div>

      {/* STEP PROGRESS BAR */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm">
        <div className="grid grid-cols-5 gap-2 text-center text-xs font-semibold">
          {[
            { num: 1, label: "Institution & Degree" },
            { num: 2, label: "Experiment Context" },
            { num: 3, label: "Parameters & Data" },
            { num: 4, label: "Blueprint Review" },
            { num: 5, label: "Multi-Pass AI Generation" }
          ].map(s => (
            <div
              key={s.num}
              className={`py-2 px-2 rounded-xl transition-all ${
                step === s.num
                  ? "bg-primary text-white font-bold shadow-sm"
                  : step > s.num
                  ? "bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 font-medium"
                  : "text-muted-foreground bg-slate-50 dark:bg-slate-800/40"
              }`}
            >
              <span className="block text-[11px] opacity-80">Step {s.num}</span>
              <span className="truncate block">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {stepError && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-sm flex items-center gap-2">
          <AlertCircle className="size-4 shrink-0" />
          <span>{stepError}</span>
        </div>
      )}

      {/* STEP 1: INSTITUTION & PROGRAMME */}
      {step === 1 && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Building2 className="size-5 text-teal-600" />
              1. Institutional Affiliation & Degree Programme
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Select your registered Tanzanian university to automatically configure official laboratory formatting rules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Higher Learning Institution *
              </label>
              <select
                value={selectedUniShortName}
                onChange={e => handleUniversityChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="">-- Choose University --</option>
                {catalogUniversities.map(u => (
                  <option key={u.id} value={u.shortName}>
                    {u.shortName} - {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Faculty / School / Department *
              </label>
              <select
                disabled={!selectedUniShortName}
                value={selectedCollegeId}
                onChange={e => handleCollegeChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
              >
                <option value="">-- Choose Faculty / Department --</option>
                {availableColleges.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Degree Programme *
              </label>
              <select
                disabled={!selectedCollegeId}
                value={selectedCourseId}
                onChange={e => handleCourseChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
              >
                <option value="">-- Choose Degree Programme --</option>
                {availableCourses.map(crs => (
                  <option key={crs.id} value={crs.id}>
                    {crs.name}
                  </option>
                ))}
                <option value="custom">-- Custom Programme (Type Below) --</option>
              </select>
            </div>

            {isCustomCourse && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                  Custom Degree Programme Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. BSc in Telecommunications Engineering"
                  value={customCourse}
                  onChange={e => setCustomCourse(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Academic Year *
              </label>
              <input
                type="text"
                placeholder="e.g. 2024/2025"
                value={academicYear}
                onChange={e => setAcademicYear(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Target Lab Report Length (Pages)
              </label>
              <select
                value={targetPages}
                onChange={e => setTargetPages(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="5">5 Pages (~1,750 words)</option>
                <option value="8">8 Pages (~2,800 words - Standard)</option>
                <option value="12">12 Pages (~4,200 words - In-Depth)</option>
                <option value="15">15 Pages (~5,250 words - Comprehensive)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleProceedToStep2} className="px-8 gap-2 bg-primary hover:bg-primary/90">
              Next: Experiment Context <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: EXPERIMENT CONTEXT & IDENTITY */}
      {step === 2 && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <FlaskConical className="size-5 text-teal-600" />
              2. Experiment Specifications & Student Identity
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Provide your official course code, experiment topic, and investigator details for the formal cover page.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Official Experiment Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Determination of Young's Modulus of Steel Wire via Searle's Apparatus"
                value={experimentTitle}
                onChange={e => setExperimentTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Course / Module Code *
              </label>
              <input
                type="text"
                placeholder="e.g. PHYS 101 or ME 215"
                value={courseCode}
                onChange={e => setCourseCode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Laboratory Facility / Unit
              </label>
              <input
                type="text"
                placeholder="e.g. Department of Mechanical Testing Laboratory"
                value={labFacility}
                onChange={e => setLabFacility(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Student Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Juma Ally Mwamba"
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Registration / Student ID Number *
              </label>
              <input
                type="text"
                placeholder="e.g. 2023-04-08912"
                value={regNumber}
                onChange={e => setRegNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Lab Instructor / Technologist Name
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. K. Mushi"
                value={instructor}
                onChange={e => setInstructor(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Date of Experiment Execution
              </label>
              <input
                type="text"
                placeholder="e.g. 14th October 2026"
                value={labDate}
                onChange={e => setLabDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button onClick={handleProceedToStep3} className="px-8 gap-2 bg-primary hover:bg-primary/90">
              Next: Parameters & Observations <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: EXPERIMENTAL PARAMETERS & EVIDENCE */}
      {step === 3 && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Sliders className="size-5 text-teal-600" />
              3. Authentic Experimental Evidence & Data
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Input your actual laboratory apparatus, procedures, and raw observation values to prevent generic AI fluff.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Apparatus & Instruments Used (Include Models & Tolerances) *
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Searle's apparatus, micrometer screw gauge (precision 0.01 mm), slotted weights (0.5 kg each), meter rule, spirit level, optical micrometer."
                value={apparatus}
                onChange={e => setApparatus(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                  Experimental Variables
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Independent: Applied Load (N). Dependent: Wire Extension (mm). Controlled: Room temperature, wire length."
                  value={variables}
                  onChange={e => setVariables(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                  Stated Hypothesis / Theoretical Expectation
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Wire elongation will vary linearly with applied load adhering to Hooke's Law up to elastic limit."
                  value={hypothesis}
                  onChange={e => setHypothesis(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Step-by-Step Experimental Procedure *
              </label>
              <textarea
                rows={4}
                placeholder="e.g. 1. Measured initial diameter at 5 points with micrometer. 2. Suspended reference wire with dead load to remove kinks. 3. Added slotted loads progressively by 0.5 kg intervals up to 4.0 kg, noting micrometer readings. 4. Unloaded progressively to test for hysteresis."
                value={procedure}
                onChange={e => setProcedure(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Raw Observation Data & Numerical Readings
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Initial wire length L = 2.45 m; Diameter d = 0.56 mm; Readings: Load 0.5kg -> ext 0.12mm; 1.0kg -> 0.24mm; 1.5kg -> 0.35mm; 2.0kg -> 0.48mm; 2.5kg -> 0.59mm."
                value={observations}
                onChange={e => setObservations(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none font-mono text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Safety Precautions & Lab Hazards Observed
              </label>
              <input
                type="text"
                placeholder="e.g. Safety goggles worn, gradual loading to avoid sudden snapping, secure floor perimeter."
                value={safetyPrecautions}
                onChange={e => setSafetyPrecautions(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button onClick={handleProceedToStep4} className="px-8 gap-2 bg-primary hover:bg-primary/90">
              Generate Blueprint <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: BLUEPRINT REVIEW */}
      {step === 4 && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <FileCheck className="size-5 text-teal-600" />
                4. Laboratory Report Blueprint & Chapter Plan
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                The report engine will draft each section sequentially with a dedicated word budget to produce an exhaustive, publication-grade laboratory report.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-muted-foreground uppercase">Target Depth</span>
              <p className="text-lg font-bold text-teal-600">~{parseInt(targetPages) * 350} Words</p>
            </div>
          </div>

          <div className="space-y-3">
            {(blueprintSections.length > 0 ? blueprintSections : [
              { chapterNumber: 1, title: "Section 1: Experiment Title, Objectives & Theoretical Principles", wordBudget: 600, subHeadings: ["Scientific Rationale", "Governing Formulas", "Testable Hypothesis"] },
              { chapterNumber: 2, title: "Section 2: Laboratory Apparatus, Materials & Calibration", wordBudget: 600, subHeadings: ["Apparatus List", "Instrument Specifications", "Calibration Procedures"] },
              { chapterNumber: 3, title: "Section 3: Experimental Methodology & Operating Procedures", wordBudget: 750, subHeadings: ["Variables Definition", "Step-by-step Procedure", "Safety Measures"] },
              { chapterNumber: 4, title: "Section 4: Data Acquisition, Observations & Mathematical Calculations", wordBudget: 850, subHeadings: ["Raw Data Tabulation", "Governing Equations", "Step-by-step Calculations"] },
              { chapterNumber: 5, title: "Section 5: Scientific Discussion & Quantitative Error Analysis", wordBudget: 650, subHeadings: ["Critical Interpretation", "Theoretical Comparison", "Sources of Uncertainty"] },
              { chapterNumber: 6, title: "Section 6: Conclusions, Engineering Implications & Recommendations", wordBudget: 450, subHeadings: ["Hypothesis Verdict", "Practical Takeaways", "Lab Recommendations"] }
            ]).map((sec, idx) => (
              <div key={idx} className="p-4 rounded-2xl border bg-slate-50/50 dark:bg-slate-800/40 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-teal-600 uppercase">Section {sec.chapterNumber}</span>
                  <h4 className="font-bold text-sm text-foreground">{sec.title}</h4>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {sec.subHeadings?.map((sh, sIdx) => (
                      <span key={sIdx} className="text-[11px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border text-muted-foreground">
                        {sh}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-xs font-bold px-2 py-1 rounded-md bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                    ~{sec.wordBudget} words
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(3)}>
              Back
            </Button>
            <Button onClick={handleStartSequentialGeneration} className="px-8 gap-2 bg-teal-600 hover:bg-teal-500 text-white shadow-lg">
              <Sparkles className="size-4" /> Start Multi-Pass Generation
            </Button>
          </div>
        </div>
      )}

      {/* STEP 5: LIVE MULTI-PASS GENERATION PROGRESS & VIEWER */}
      {step === 5 && (
        <div className="space-y-6">
          {/* GENERATION STATUS BANNER */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {isGenerating ? (
                <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 border border-teal-200 dark:border-teal-800 animate-spin">
                  <RefreshCw className="size-6" />
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="size-6" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {isGenerating ? "Executing Multi-Pass Academic Drafting..." : "Academic Laboratory Report Completed!"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isGenerating
                    ? `Drafting Section ${currentDraftingIndex + 1} of ${blueprintSections.length || 6}... Writing exhaustive scientific prose.`
                    : `Verified ${totalWords.toLocaleString()} words (~${estimatedPages} pages) compiled according to ${university} guidelines.`}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={isGenerating || !generatedReport}
                className="gap-1.5 text-xs"
              >
                {!isUnlocked ? <Lock className="size-3.5 text-amber-500" /> : <Copy className="size-3.5" />}
                {copyFeedback ? "Copied!" : "Copy Text"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPdf}
                disabled={isGenerating || !generatedReport}
                className="gap-1.5 text-xs border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 font-semibold hover:bg-teal-50 dark:hover:bg-teal-950/40"
              >
                {!isUnlocked ? <Lock className="size-3.5 text-amber-500" /> : <Download className="size-3.5" />}
                Print / PDF
              </Button>
              <Button
                size="sm"
                onClick={handleExportDocx}
                disabled={isGenerating || !generatedReport}
                className={`gap-1.5 text-xs font-bold shadow-sm ${
                  isUnlocked 
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                    : "bg-teal-600 hover:bg-teal-700 text-white"
                }`}
              >
                {!isUnlocked ? <Lock className="size-3.5 text-amber-200" /> : <Download className="size-3.5" />}
                {isUnlocked ? "Download Word (.docx)" : "Unlock & Download Word"}
              </Button>
            </div>
          </div>

          {/* DOCUMENT VIEWER */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-border shadow-sm font-sans leading-relaxed">
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <div className="flex items-center gap-2">
                <FileText className="size-5 text-teal-600" />
                <span className="font-bold text-sm text-foreground">Live Compiled Document</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{totalWords.toLocaleString()} Words</span>
                <span>•</span>
                <span className="font-semibold text-foreground">~{estimatedPages} Pages</span>
                {createdDocId && (
                  <>
                    <span>•</span>
                    <Link href={`/editor/${createdDocId}`} className="text-teal-600 hover:underline flex items-center gap-1 font-bold">
                      Open in Editor <ExternalLink className="size-3" />
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-800 dark:text-slate-200 max-h-[600px] overflow-y-auto pr-2">
              {generatedReport || "Initializing multi-pass academic generation..."}
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT EXPORT PAYWALL MODAL */}
      <DocumentExportPaywallModal
        isOpen={showPaywallModal}
        onClose={() => setShowPaywallModal(false)}
        documentTitle={experimentTitle || "Laboratory Practical Report"}
        documentId={createdDocId}
        targetPages={targetPages}
        university={university}
        onSuccess={() => {
          setIsUnlocked(true);
          setShowPaywallModal(false);
          const exportOptions = {
            title: experimentTitle || "LABORATORY REPORT",
            institution: university || "Tanzanian Higher Learning Institution",
            institutionShortName: selectedUniShortName || undefined,
            logoUrl: selectedUniShortName ? getUniversityByShortName(selectedUniShortName)?.logoUrl : undefined,
            reportType: "LABORATORY PRACTICAL REPORT",
            faculty,
            programme: isCustomCourse ? customCourse : programme,
            studentName: studentName || "STUDENT NAME",
            registrationNumber: regNumber || "REGISTRATION NUMBER",
            supervisorName: instructor,
            academicYear,
            content: generatedReport
          };
          if (selectedExportFormat === "doc") {
            DocxCompilerEngine.downloadDocxFile(exportOptions);
          } else {
            DocxCompilerEngine.openPdfPrintWindow(exportOptions);
          }
        }}
      />
    </div>
  );
}
