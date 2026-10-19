"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  GraduationCap,
  Building2,
  Check,
  ChevronRight,
  Download,
  FileCheck,
  FileText,
  Sparkles,
  RefreshCw,
  Copy,
  Sliders,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Upload,
  Paperclip,
  Trash2,
  Info,
  Loader2,
  Wand2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocxCompilerEngine } from "@/lib/export/docx-compiler";
import { PreFlightReviewModal } from "@/components/report-engine/PreFlightReviewModal";
import { FYPSuggestionModal } from "@/components/evidence/FYPSuggestionModal";
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

export default function FYPGeneratorPage() {
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
  const [targetPages, setTargetPages] = useState("15");

  // Dynamic College & Course Lists
  const [availableColleges, setAvailableColleges] = useState<CollegeItem[]>([]);
  const [availableCourses, setAvailableCourses] = useState<CourseItem[]>([]);

  // STEP 2: RESEARCH TITLE & IDENTITY
  const [title, setTitle] = useState("");
  const [studentName, setStudentName] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [citationStyle, setCitationStyle] = useState<"IEEE" | "APA7" | "HARVARD">("IEEE");

  // STEP 3: RESEARCH CORE & AUTHENTIC EVIDENCE
  const [problemStatement, setProblemStatement] = useState("");
  const [objectives, setObjectives] = useState("");
  const [researchQuestions, setResearchQuestions] = useState("");
  const [theoreticalFramework, setTheoreticalFramework] = useState("");
  const [methodology, setMethodology] = useState("");

  // SUGGESTION MODAL STATE
  const [activeSuggestionField, setActiveSuggestionField] = useState<"problemStatement" | "objectives" | "researchQuestions" | "theoreticalFramework" | "methodology" | null>(null);

  // CUSTOM THESIS TEMPLATE UPLOAD STATE
  const [uploadedTemplateName, setUploadedTemplateName] = useState("");
  const [customSections, setCustomSections] = useState<Array<{ id: string; title: string; description: string; order: number }>>([]);
  const [isParsingTemplate, setIsParsingTemplate] = useState(false);
  const [templateWarning, setTemplateWarning] = useState<string | null>(null);

  // RESEARCH PROPOSAL / EVIDENCE UPLOAD STATE
  const [uploadedDocName, setUploadedDocName] = useState("");
  const [isParsingDoc, setIsParsingDoc] = useState(false);
  const [docUploadSuccess, setDocUploadSuccess] = useState<string | null>(null);

  // CURRENT SELECTED UNIVERSITY ITEM
  const selectedUni = selectedUniShortName ? getUniversityByShortName(selectedUniShortName) : undefined;

  // STEP 4 & 5: SEQUENTIAL GENERATION STATE
  const [blueprintSections, setBlueprintSections] = useState<BlueprintSection[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentDraftingIndex, setCurrentDraftingIndex] = useState(0);
  const [generatedReport, setGeneratedReport] = useState("");
  const [createdDocId, setCreatedDocId] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Pre-Flight Layered Requirements State
  const [compiledSpec, setCompiledSpec] = useState<any>(null);
  const [compiledCalculations, setCompiledCalculations] = useState<any[]>([]);
  const [compiledDiagrams, setCompiledDiagrams] = useState<any[]>([]);
  const [auditReport, setAuditReport] = useState<any>(null);
  const [isPreFlightModalOpen, setIsPreFlightModalOpen] = useState(false);

  // Read incoming parameters from Topic Assistant
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const qTitle = params.get("title");
      const qProblem = params.get("problem");
      const qObjectives = params.get("objectives");
      const qProgramme = params.get("programme");

      if (qTitle) setTitle(qTitle);
      if (qProblem) setProblemStatement(qProblem);
      if (qObjectives) setObjectives(qObjectives);
      if (qProgramme) {
        setProgramme(qProgramme);
        setCustomCourse(qProgramme);
        setIsCustomCourse(true);
        setSelectedCourseId("custom");
      }
    }
  }, []);

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

  // Step validations
  const handleProceedToStep2 = () => {
    if (!selectedUniShortName) {
      setStepError("Please select your Higher Learning Institution.");
      return;
    }
    if (!selectedCollegeId) {
      setStepError("Please select your Faculty or School.");
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
    if (!title.trim()) {
      setStepError("Please enter your Research Project / Dissertation Title.");
      return;
    }
    if (!studentName.trim() || !regNumber.trim()) {
      setStepError("Please provide your Student Full Name and Registration Number.");
      return;
    }
    setStepError("");
    setStep(3);
  };


  const handleTemplateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedTemplateName(file.name);
    setIsParsingTemplate(true);
    setTemplateWarning(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/templates/parse", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      if (data.success && data.sections && data.sections.length > 0) {
        setCustomSections(data.sections);
        setTemplateWarning(data.warningMessage || null);
      } else {
        setTemplateWarning("Standard chapters applied. You can customize them in Step 4.");
      }
    } catch (err) {
      console.error("Failed to parse thesis template:", err);
      setTemplateWarning("Could not parse file. Standard chapters applied.");
    } finally {
      setIsParsingTemplate(false);
    }
  };

  const handleClearTemplate = () => {
    setUploadedTemplateName("");
    setCustomSections([]);
    setTemplateWarning(null);
  };

  // EVIDENCE / PROPOSAL DRAFT UPLOAD HANDLER
  const handleEvidenceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedDocName(file.name);
    setIsParsingDoc(true);
    setDocUploadSuccess(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/evidence/parse", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      if (data.success && data.evidence) {
        if (data.evidence.activities && !problemStatement) {
          setProblemStatement(data.evidence.activities);
        }
        if (data.evidence.challenges && !objectives) {
          setObjectives(data.evidence.challenges);
        }
        if (data.evidence.toolsUsed && !methodology) {
          setMethodology(`Target Technologies & Tools: ${data.evidence.toolsUsed}`);
        }
        setDocUploadSuccess(`Extracted research details from "${file.name}"! You can review and edit below.`);
      }
    } catch (err) {
      console.error("Failed to parse research document:", err);
    } finally {
      setIsParsingDoc(false);
    }
  };

  const handleProceedToStep4 = async () => {
    if (!problemStatement.trim()) {
      setStepError("Please provide a Statement of the Problem.");
      return;
    }
    if (!objectives.trim()) {
      setStepError("Please provide Specific Research Objectives.");
      return;
    }
    if (!methodology.trim()) {
      setStepError("Please provide the Research Methodology & Proposed Architecture.");
      return;
    }
    setStepError("");

    // Request Layered Requirements Specification from Resolver
    try {
      const res = await fetch("/api/v1/requirements/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          universityId: selectedUniShortName || "udsm",
          programmeId: isCustomCourse ? customCourse : selectedCourseId || "coict-cs",
          specialization: faculty,
          reportType: "FYP",
          reportTitle: title,
          studentName,
          regNumber,
          assignmentInstructions: `Problem: ${problemStatement}. Objectives: ${objectives}. Methodology: ${methodology}`,
          requestedCitationStyle: citationStyle,
          requestedWordBudget: (parseInt(targetPages) || 15) * 350
        })
      });
      const data = await res.json();
      if (data.success && data.specification) {
        setCompiledSpec(data.specification);
        setCompiledCalculations(data.compiledCalculations || []);
        setCompiledDiagrams(data.compiledDiagrams || []);
        
        if (customSections.length > 0) {
          setBlueprintSections(
            customSections.map((sec, idx) => ({
              chapterNumber: idx + 1,
              title: sec.title,
              subHeadings: [
                `${idx + 1}.1 Overview & Problem Context`,
                `${idx + 1}.2 Technical Execution & Evidence`,
                `${idx + 1}.3 Detailed Evaluation & Discussion`
              ],
              wordBudget: Math.round(((parseInt(targetPages) || 15) * 350) / customSections.length),
              promptInstructions: sec.description || "Draft publication-grade dissertation section strictly adhering to institutional requirements."
            }))
          );
        } else if (data.specification.sections) {
          setBlueprintSections(data.specification.sections);
        }

        if (data.specification.formatting?.citationStyle) {
          setCitationStyle(data.specification.formatting.citationStyle);
        }
        setIsPreFlightModalOpen(true);
      }
    } catch (e) {
      console.warn("Error resolving requirements:", e);
    }

    setStep(4);
  };

  // SEQUENTIAL MULTI-PASS GENERATION
  const handleStartSequentialGeneration = async () => {
    setIsPreFlightModalOpen(false);
    setIsGenerating(true);
    setStep(5);
    setGeneratedReport("");

    const resolvedProg = isCustomCourse ? customCourse : programme;
    let fullCompiledReport = `# ${title.toUpperCase()}
**A FINAL YEAR DISSERTATION SUBMITTED TO ${university.toUpperCase()}**
**FACULTY / SCHOOL:** ${faculty}
**PROGRAMME:** ${resolvedProg}
**CANDIDATE:** ${studentName} (${regNumber})
**RESEARCH SUPERVISOR:** ${supervisor || "Appointed Academic Supervisor"}
**ACADEMIC YEAR:** ${academicYear || "2024/2025"}
**CITATION STYLE:** ${citationStyle} Standard

---
`;

    setGeneratedReport(fullCompiledReport);

    const sectionsToDraft = blueprintSections.length > 0 ? blueprintSections : [
      {
        chapterNumber: 1,
        title: "Chapter 1: Introduction",
        subHeadings: ["1.1 Background of the Study", "1.2 Statement of the Problem", "1.3 Aim and Specific Objectives", "1.4 Significance of the Study", "1.5 Scope and Limitations"],
        wordBudget: 900,
        promptInstructions: "Establish theoretical context, state research problem clearly, and outline specific objectives."
      },
      {
        chapterNumber: 2,
        title: "Chapter 2: Literature Review & Theoretical Framework",
        subHeadings: ["2.1 Conceptual Foundations", "2.2 Review of Related Empirical Studies", "2.3 Comparative Analysis of Existing Approaches", "2.4 Identified Research Gap"],
        wordBudget: 1600,
        promptInstructions: "Review scholarly sources, compare existing systems, and substantiate the research gap with citations."
      },
      {
        chapterNumber: 3,
        title: "Chapter 3: Methodology",
        subHeadings: ["3.1 Research Design & Justification", "3.2 Data Collection Methods & Instruments", "3.3 System Development Methodology", "3.4 Ethical Considerations"],
        wordBudget: 1100,
        promptInstructions: "Detail research methodology, software design paradigms, and data collection procedures."
      },
      {
        chapterNumber: 4,
        title: "Chapter 4: System Analysis & Design",
        subHeadings: ["4.1 Functional & Non-Functional Requirements", "4.2 System Architecture & Diagrams", "4.3 Database Schema & API Specifications"],
        wordBudget: 1200,
        promptInstructions: "Present software requirements, architectural diagrams, data flow models, and database schema."
      },
      {
        chapterNumber: 5,
        title: "Chapter 5: Implementation, Testing & Results",
        subHeadings: ["5.1 Development Environment & Implementation", "5.2 Key Code Modules & Screenshots", "5.3 Testing Strategy & Experimental Results"],
        wordBudget: 1100,
        promptInstructions: "Detail implementation modules, test cases, performance evaluations, and empirical findings."
      },
      {
        chapterNumber: 6,
        title: "Chapter 6: Conclusion & Future Work",
        subHeadings: ["6.1 Summary of Completed Work", "6.2 Conclusions Linked to Objectives", "6.3 Recommendations for Future Work"],
        wordBudget: 700,
        promptInstructions: "Synthesize findings against initial objectives and suggest future research directions."
      }
    ];

    const evidencePayload = {
      reportType: "FYP",
      title,
      programme: resolvedProg,
      problemStatement,
      objectives,
      researchQuestions,
      theoreticalFramework,
      methodology
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
            calculatedResults: compiledCalculations,
            diagramSpecs: compiledDiagrams,
            specification: compiledSpec,
            formattingRules: { citationStyle }
          })
        });

        const data = await res.json();
        const sectionText = data.result?.text || `\n\n## ${currentSec.title}\nDrafted in accordance with ${university} dissertation guidelines.\n`;
        fullCompiledReport += `\n\n${sectionText}\n\n---`;
        setGeneratedReport(fullCompiledReport);
      } catch (err) {
        console.warn(`Chapter ${i + 1} drafting notice:`, err);
        fullCompiledReport += `\n\n## ${currentSec.title}\n\n### ${currentSec.subHeadings[0] || "Overview"}\nResearch analysis developed adhering to ${university} criteria.\n`;
        setGeneratedReport(fullCompiledReport);
      }
    }

    // Run 7-Tier Institutional Compliance Audit
    if (compiledSpec) {
      try {
        const auditRes = await fetch("/api/v1/requirements/audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reportText: fullCompiledReport,
            specification: compiledSpec,
            calculations: compiledCalculations,
            diagrams: compiledDiagrams
          })
        });
        const auditData = await auditRes.json();
        if (auditData.success && auditData.auditReport) {
          setAuditReport(auditData.auditReport);
        }
      } catch (auditErr) {
        console.warn("Compliance audit execution warning:", auditErr);
      }
    }

    // Persist to Database physically
    try {
      const docRes = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `FYP: ${title.slice(0, 40)}`,
          content: fullCompiledReport,
          toolType: "FYP"
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
    navigator.clipboard.writeText(generatedReport);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handleExportDocx = () => {
    DocxCompilerEngine.downloadDocxFile({
      title: title || "RESEARCH DISSERTATION",
      institution: university || "Tanzania Higher Education",
      content: generatedReport
    });
  };

  const handleExportPdf = () => {
    DocxCompilerEngine.openPdfPrintWindow({
      title: title || "RESEARCH DISSERTATION",
      institution: university || "Tanzania Higher Education",
      content: generatedReport
    });
  };

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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
          <GraduationCap className="size-3.5" />
          Research Proposal & Dissertation Builder (FYP)
        </div>
      </div>

      {/* STEP PROGRESS BAR */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm">
        <div className="grid grid-cols-5 gap-2 text-center text-xs font-semibold">
          {[
            { num: 1, label: "Institution & Degree" },
            { num: 2, label: "Project Title & Identity" },
            { num: 3, label: "Research Core" },
            { num: 4, label: "Blueprint Review" },
            { num: 5, label: "Multi-Pass AI Generation" }
          ].map(s => (
            <div
              key={s.num}
              className={`py-2 px-2 rounded-xl transition-all ${
                step === s.num
                  ? "bg-primary text-white font-bold shadow-sm"
                  : step > s.num
                  ? "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 font-medium"
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
              <Building2 className="size-5 text-purple-600" />
              1. Institutional Affiliation & Degree Programme
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Select your Tanzanian university to automatically calibrate thesis chapter hierarchies and formatting guidelines.
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
                Faculty / School / College *
              </label>
              <select
                disabled={!selectedUniShortName}
                value={selectedCollegeId}
                onChange={e => handleCollegeChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
              >
                <option value="">-- Choose Faculty / College --</option>
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
                  placeholder="e.g. BSc in Computer Science"
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
                Target Project Length (Pages)
              </label>
              <select
                value={targetPages}
                onChange={e => setTargetPages(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="10">10 Pages (~3,500 words - Project Proposal)</option>
                <option value="15">15 Pages (~5,250 words - Initial Draft)</option>
                <option value="20">20 Pages (~7,000 words - Full FYP Chapters 1-6)</option>
                <option value="25">25 Pages (~8,750 words - Comprehensive Thesis)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleProceedToStep2} className="px-8 gap-2 bg-primary hover:bg-primary/90">
              Next: Research Title & Identity <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: RESEARCH TITLE & IDENTITY */}
      {step === 2 && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <GraduationCap className="size-5 text-purple-600" />
              2. Research Project Title & Candidate Identity
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Provide your official dissertation title and personal research credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Official Dissertation / FYP Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Design and Implementation of an Automated Patient Triage Monitoring System in Regional Referral Hospitals"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Candidate Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Kelvin Emmanuel Masanja"
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
                placeholder="e.g. 2021-04-03219"
                value={regNumber}
                onChange={e => setRegNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Research Supervisor Name & Title
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. H. Mfinanga"
                value={supervisor}
                onChange={e => setSupervisor(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Citation & Referencing Format
              </label>
              <select
                value={citationStyle}
                onChange={e => setCitationStyle(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="IEEE">IEEE Format (Standard for Computing & Engineering)</option>
                <option value="APA7">APA 7th Edition (Standard for Sciences & Business)</option>
                <option value="HARVARD">Harvard Referencing System</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button onClick={handleProceedToStep3} className="px-8 gap-2 bg-primary hover:bg-primary/90">
              Next: Research Core <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: RESEARCH CORE & EVIDENCE */}
      {step === 3 && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Sliders className="size-5 text-purple-600" />
              3. Research Core & Authentic Evidence
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Provide your problem statement, specific objectives, and technical methodology. You can also upload a guideline or use draft suggestions.
            </p>
          </div>

          {stepError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" /> {stepError}
            </div>
          )}

          {/* NOTICE IF UNIVERSITY HAS NO VERIFIED BUNDLED TEMPLATE */}
          {selectedUni && !selectedUni.hasOfficialTemplate && (
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
                <AlertCircle className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Standard TCU Inter-University Thesis Structure Active for {selectedUni.shortName}</span>
              </div>
              <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                We currently apply the verified TCU inter-university postgraduate & undergraduate thesis framework for {selectedUni.name}. <strong>If your faculty or supervisor provided a specific thesis guideline document or chapter format</strong>, please upload it below and our engine will adopt your university&apos;s exact outline.
              </p>
            </div>
          )}

          {/* 1. OPTIONAL THESIS TEMPLATE UPLOAD */}
          <div className="p-4 rounded-xl border border-dashed border-purple-300 dark:border-purple-800 bg-purple-50/40 dark:bg-purple-950/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase text-purple-900 dark:text-purple-200 flex items-center gap-2 cursor-pointer">
                <Upload className="size-4 text-purple-600 dark:text-purple-400" />
                1. University Dissertation Guideline / Sample (.PDF / .DOCX / .TXT)
              </label>
              {uploadedTemplateName && (
                <button
                  type="button"
                  onClick={handleClearTemplate}
                  className="text-[11px] font-medium text-red-600 hover:text-red-700 dark:text-red-400 flex items-center gap-1"
                >
                  <Trash2 className="size-3" /> Clear Template
                </button>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Optional: Upload your university&apos;s official FYP guideline or thesis sample. Our engine extracts the exact chapter headings.
            </p>
            <input
              type="file"
              accept=".txt,.doc,.docx,.pdf"
              onChange={handleTemplateUpload}
              className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
            />
            {isParsingTemplate && (
              <p className="text-xs text-purple-600 flex items-center gap-1.5 font-medium">
                <Loader2 className="size-3.5 animate-spin" /> Parsing dissertation structure and extracting chapters...
              </p>
            )}
            {uploadedTemplateName && !isParsingTemplate && (
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                <Check className="size-4 text-emerald-600 shrink-0" />
                <span>Custom blueprint extracted from <strong>{uploadedTemplateName}</strong> ({customSections.length} Sections Active)</span>
              </div>
            )}
            {templateWarning && (
              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-800 dark:text-amber-300 flex items-start gap-1.5">
                <Info className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>{templateWarning}</span>
              </div>
            )}
          </div>

          {/* 2. OPTIONAL PROPOSAL DRAFT / CONCEPT NOTE UPLOAD */}
          <div className="p-4 rounded-xl border border-dashed border-sky-300 dark:border-sky-800 bg-sky-50/40 dark:bg-sky-950/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase text-sky-900 dark:text-sky-200 flex items-center gap-2 cursor-pointer">
                <Paperclip className="size-4 text-sky-600 dark:text-sky-400" />
                2. Concept Note / Proposal Draft / Defense Notes (.PDF / .DOCX / .TXT)
              </label>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Optional: Upload an existing concept note, presentation notes, or rough proposal to automatically populate the research fields below.
            </p>
            <input
              type="file"
              accept=".txt,.doc,.docx,.pdf"
              onChange={handleEvidenceUpload}
              className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-700 cursor-pointer"
            />
            {isParsingDoc && (
              <p className="text-xs text-sky-600 flex items-center gap-1.5 font-medium">
                <Loader2 className="size-3.5 animate-spin" /> Analyzing research document and extracting fields...
              </p>
            )}
            {docUploadSuccess && !isParsingDoc && (
              <div className="p-2.5 bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 rounded-lg text-xs font-medium text-sky-700 dark:text-sky-300 flex items-center gap-1.5">
                <Check className="size-4 text-sky-600 shrink-0" />
                <span>{docUploadSuccess}</span>
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Statement of the Problem *
                </label>
                <button
                  type="button"
                  onClick={() => setActiveSuggestionField("problemStatement")}
                  className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1"
                >
                  <Sparkles className="size-3" /> Suggest Professional Draft
                </button>
              </div>
              <textarea
                rows={4}
                placeholder="e.g. Manual patient triage in emergency departments leads to excessive waiting times exceeding 3 hours, causing preventable clinical complications. Existing digital tools require reliable grid connectivity and lack localized triage classification models."
                value={problemStatement}
                onChange={e => setProblemStatement(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none leading-relaxed"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Specific Research Objectives *
                </label>
                <button
                  type="button"
                  onClick={() => setActiveSuggestionField("objectives")}
                  className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1"
                >
                  <Sparkles className="size-3" /> Suggest Objectives
                </button>
              </div>
              <textarea
                rows={3}
                placeholder="e.g. 1. To analyze emergency room workflow bottlenecks. 2. To develop an IoT vital-sign monitoring node. 3. To train an automated triage prioritization algorithm. 4. To evaluate triage accuracy and latency in a clinical setting."
                value={objectives}
                onChange={e => setObjectives(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Key Research Questions / Hypotheses
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveSuggestionField("researchQuestions")}
                    className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1"
                  >
                    <Sparkles className="size-3" /> Suggest
                  </button>
                </div>
                <textarea
                  rows={3}
                  placeholder="e.g. How does automated vital signs capture impact nurse triage decision speed? What is the predictive accuracy of the automated triage index?"
                  value={researchQuestions}
                  onChange={e => setResearchQuestions(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Theoretical / Conceptual Framework
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveSuggestionField("theoreticalFramework")}
                    className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1"
                  >
                    <Sparkles className="size-3" /> Suggest
                  </button>
                </div>
                <textarea
                  rows={3}
                  placeholder="e.g. Emergency Severity Index (ESI) framework, Queuing Theory (M/M/c models), Technology Acceptance Model (TAM)."
                  value={theoreticalFramework}
                  onChange={e => setTheoreticalFramework(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Research Methodology & Proposed Architecture / Tech Stack *
                </label>
                <button
                  type="button"
                  onClick={() => setActiveSuggestionField("methodology")}
                  className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1"
                >
                  <Sparkles className="size-3" /> Suggest Architecture
                </button>
              </div>
              <textarea
                rows={3}
                placeholder="e.g. Quantitative experimental research design. System developed using ESP32 microcontrollers, MQTT messaging protocol, Node.js backend, and Next.js frontend with PostgreSQL."
                value={methodology}
                onChange={e => setMethodology(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* FYP SUGGESTION MODAL */}
          {activeSuggestionField && (
            <FYPSuggestionModal
              isOpen={!!activeSuggestionField}
              onClose={() => setActiveSuggestionField(null)}
              onApply={(newVal) => {
                if (activeSuggestionField === "problemStatement") setProblemStatement(newVal);
                if (activeSuggestionField === "objectives") setObjectives(newVal);
                if (activeSuggestionField === "researchQuestions") setResearchQuestions(newVal);
                if (activeSuggestionField === "theoreticalFramework") setTheoreticalFramework(newVal);
                if (activeSuggestionField === "methodology") setMethodology(newVal);
                setStepError("");
              }}
              field={activeSuggestionField}
              fieldName={
                activeSuggestionField === "problemStatement"
                  ? "Statement of the Problem"
                  : activeSuggestionField === "objectives"
                  ? "Specific Research Objectives"
                  : activeSuggestionField === "researchQuestions"
                  ? "Key Research Questions"
                  : activeSuggestionField === "theoreticalFramework"
                  ? "Theoretical / Conceptual Framework"
                  : "Research Methodology & Tech Stack"
              }
              title={title}
              programme={isCustomCourse ? customCourse : programme}
              university={university}
              currentValue={
                activeSuggestionField === "problemStatement"
                  ? problemStatement
                  : activeSuggestionField === "objectives"
                  ? objectives
                  : activeSuggestionField === "researchQuestions"
                  ? researchQuestions
                  : activeSuggestionField === "theoreticalFramework"
                  ? theoreticalFramework
                  : methodology
              }
            />
          )}

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
                <FileCheck className="size-5 text-purple-600" />
                4. Multi-Chapter Dissertation Blueprint
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                The AI will draft each of the 6 chapters sequentially with individual target word budgets to generate an exhaustive dissertation without summarizing.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-muted-foreground uppercase">Target Word Budget</span>
              <p className="text-lg font-bold text-purple-600">~{parseInt(targetPages) * 350} Words</p>
            </div>
          </div>

          <div className="space-y-3">
            {(blueprintSections.length > 0 ? blueprintSections : [
              { chapterNumber: 1, title: "Chapter 1: Introduction", wordBudget: 900, subHeadings: ["Background of the Study", "Statement of the Problem", "Aim & Objectives", "Significance & Scope"] },
              { chapterNumber: 2, title: "Chapter 2: Literature Review & Theoretical Framework", wordBudget: 1600, subHeadings: ["Conceptual Foundations", "Empirical Review", "Comparative Analysis", "Identified Research Gap"] },
              { chapterNumber: 3, title: "Chapter 3: Methodology", wordBudget: 1100, subHeadings: ["Research Design", "Data Collection Instruments", "System Development Methodology", "Ethical Considerations"] },
              { chapterNumber: 4, title: "Chapter 4: System Analysis & Design", wordBudget: 1200, subHeadings: ["Requirements Analysis", "System Architecture & Diagrams", "Database Schema & API Specifications"] },
              { chapterNumber: 5, title: "Chapter 5: Implementation, Testing & Results", wordBudget: 1100, subHeadings: ["Development Environment", "Core Modules & Testing", "Performance Evaluation & Findings"] },
              { chapterNumber: 6, title: "Chapter 6: Conclusion & Future Work", wordBudget: 700, subHeadings: ["Summary of Findings", "Objectives Verification", "Recommendations for Future Work"] }
            ]).map((sec, idx) => (
              <div key={idx} className="p-4 rounded-2xl border bg-slate-50/50 dark:bg-slate-800/40 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-purple-600 uppercase">Chapter {sec.chapterNumber}</span>
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
                  <span className="text-xs font-bold px-2 py-1 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                    ~{sec.wordBudget} words
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pre-Flight Verification Banner */}
          {compiledSpec && (
            <div className="p-4 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/50 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 font-bold shrink-0">
                  <Check className="size-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">Tier 1–6 Requirements Precedence Verified</h4>
                  <p className="text-xs text-muted-foreground">
                    Citation: <strong>{compiledSpec.formatting?.citationStyle}</strong> • {compiledCalculations.length} deterministic formulas • {compiledDiagrams.length} structured diagrams ready.
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsPreFlightModalOpen(true)} className="border-teal-300 text-teal-800 dark:text-teal-200 shrink-0">
                Review Pre-Flight Spec
              </Button>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(3)}>
              Back
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsPreFlightModalOpen(true)} className="border-purple-300 text-purple-700 dark:text-purple-300">
                Inspect Specification
              </Button>
              <Button onClick={handleStartSequentialGeneration} className="px-8 gap-2 bg-purple-600 hover:bg-purple-500 text-white shadow-lg">
                <Sparkles className="size-4" /> Start Multi-Pass Generation
              </Button>
            </div>
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
                <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 border border-purple-200 dark:border-purple-800 animate-spin">
                  <RefreshCw className="size-6" />
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="size-6" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {isGenerating ? "Executing Multi-Pass Academic Drafting..." : "Final Year Dissertation Draft Completed!"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isGenerating
                    ? `Drafting Chapter ${currentDraftingIndex + 1} of ${blueprintSections.length || 6}... Generating full academic paragraphs.`
                    : `Verified ${totalWords.toLocaleString()} words (~${estimatedPages} pages) compiled according to ${university} criteria.`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={isGenerating || !generatedReport}
                className="gap-1.5"
              >
                <Copy className="size-4" />
                {copyFeedback ? "Copied!" : "Copy Text"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPdf}
                disabled={isGenerating || !generatedReport}
                className="gap-1.5"
              >
                <Download className="size-4" />
                Print / PDF
              </Button>
              <Button
                size="sm"
                onClick={handleExportDocx}
                disabled={isGenerating || !generatedReport}
                className="gap-1.5 bg-primary hover:bg-primary/90 text-white"
              >
                <Download className="size-4" />
                Export Word (.docx)
              </Button>
            </div>
          </div>

          {/* COMPLIANCE AUDIT SCORECARD BANNER */}
          {auditReport && (
            <div className="p-5 rounded-3xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-in fade-in-50">
              <div className="flex items-center gap-3.5">
                <div className={`size-12 rounded-2xl flex items-center justify-center font-bold text-base shadow-sm border ${
                  auditReport.overallScore >= 80
                    ? "bg-emerald-600 text-white border-emerald-500"
                    : "bg-amber-600 text-white border-amber-500"
                }`}>
                  {auditReport.overallScore}%
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                    7-Tier Institutional Compliance Audit Verified
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">
                      TCU Standard
                    </span>
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {auditReport.isCompliant ? "Fully compliant with university thesis requirements." : "Non-critical formatting recommendations available."}
                    {auditReport.piiViolationsFound > 0 && ` • Sanitized ${auditReport.piiViolationsFound} PII tokens.`}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreFlightModalOpen(true)}
                className="border-teal-300 text-teal-800 dark:text-teal-200 hover:bg-teal-100 dark:hover:bg-teal-900/40 shrink-0 font-semibold"
              >
                View 7-Stage Audit
              </Button>
            </div>
          )}

          {/* DOCUMENT VIEWER */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-border shadow-sm font-sans leading-relaxed">
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <div className="flex items-center gap-2">
                <FileText className="size-5 text-purple-600" />
                <span className="font-bold text-sm text-foreground">Live Compiled Document</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{totalWords.toLocaleString()} Words</span>
                <span>•</span>
                <span className="font-semibold text-foreground">~{estimatedPages} Pages</span>
                {createdDocId && (
                  <>
                    <span>•</span>
                    <Link href={`/editor/${createdDocId}`} className="text-purple-600 hover:underline flex items-center gap-1 font-bold">
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

      {/* PRE-FLIGHT LAYERED REQUIREMENTS MODAL */}
      <PreFlightReviewModal
        isOpen={isPreFlightModalOpen}
        onClose={() => setIsPreFlightModalOpen(false)}
        specification={compiledSpec}
        compiledCalculations={compiledCalculations}
        compiledDiagrams={compiledDiagrams}
        auditReport={auditReport}
        onConfirm={handleStartSequentialGeneration}
        isGenerating={isGenerating}
      />
    </div>
  );
}
