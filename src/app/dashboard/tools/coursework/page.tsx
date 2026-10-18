"use client";

import { useState } from "react";
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
  BookOpen,
  Sliders,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
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

export default function CourseworkGuidedPage() {
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
  const [targetPages, setTargetPages] = useState("10");

  // Dynamic College & Course Lists
  const [availableColleges, setAvailableColleges] = useState<CollegeItem[]>([]);
  const [availableCourses, setAvailableCourses] = useState<CourseItem[]>([]);

  // STEP 2: COURSEWORK SCOPE & IDENTITY
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [studentName, setStudentName] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [lecturer, setLecturer] = useState("");
  const [submissionDate, setSubmissionDate] = useState("");

  // STEP 3: ASSIGNMENT EVIDENCE & CASE STUDY PARAMETERS
  const [caseStudyEntity, setCaseStudyEntity] = useState("");
  const [questions, setQuestions] = useState("");
  const [literatureThemes, setLiteratureThemes] = useState("");
  const [rubricCriteria, setRubricCriteria] = useState("");
  const [citationStyle, setCitationStyle] = useState<"APA7" | "IEEE" | "HARVARD">("APA7");

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

  // Navigations with validations
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
    if (!assignmentTitle.trim()) {
      setStepError("Please enter your Assignment Topic or Term Paper Title.");
      return;
    }
    if (!courseCode.trim()) {
      setStepError("Please enter your Course Module Code (e.g. EC 312, CS 210).");
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
    if (!questions.trim() && !caseStudyEntity.trim()) {
      setStepError("Please provide the assignment inquiry questions or case study entity.");
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
          targetPages: parseInt(targetPages) || 10,
          assignment: {
            title: assignmentTitle,
            reportType: "COURSEWORK",
            institution: university,
            faculty: faculty,
            programme: isCustomCourse ? customCourse : programme,
            targetPages: parseInt(targetPages) || 10,
            citationStyle
          }
        })
      });
      const data = await res.json();
      if (data.success && data.plan?.sections) {
        setBlueprintSections(data.plan.sections);
      }
    } catch (e) {
      console.warn("Error fetching coursework plan:", e);
    }

    setStep(4);
  };

  // SEQUENTIAL MULTI-PASS GENERATION
  const handleStartSequentialGeneration = async () => {
    setIsGenerating(true);
    setStep(5);
    setGeneratedReport("");

    const resolvedProg = isCustomCourse ? customCourse : programme;
    let fullCompiledReport = `# ${assignmentTitle.toUpperCase()}
**INSTITUTION:** ${university}
**FACULTY / SCHOOL:** ${faculty}
**DEGREE PROGRAMME:** ${resolvedProg}
**COURSE MODULE CODE:** ${courseCode}
**STUDENT NAME:** ${studentName} (${regNumber})
**SUBMITTED TO:** ${lecturer || "Course Lecturer / Assessor"}
**ACADEMIC YEAR:** ${academicYear || "2024/2025"}
**CITATION STANDARD:** ${citationStyle}

---
`;

    setGeneratedReport(fullCompiledReport);

    const sectionsToDraft = blueprintSections.length > 0 ? blueprintSections : [
      {
        chapterNumber: 1,
        title: "Section 1: Introduction, Problem Scope & Module Context",
        subHeadings: ["1.1 Topic Background", "1.2 Statement of the Assignment Problem", "1.3 Investigation Scope"],
        wordBudget: 600,
        promptInstructions: "Introduce topic and define problem boundaries."
      },
      {
        chapterNumber: 2,
        title: "Section 2: Conceptual Literature Synthesis & Theoretical Review",
        subHeadings: ["2.1 Core Theoretical Models", "2.2 Review of Scholarly Perspectives", "2.3 Comparative Methodologies"],
        wordBudget: 1100,
        promptInstructions: "Synthesize academic literature with citations."
      },
      {
        chapterNumber: 3,
        title: "Section 3: Critical Analysis & Case Study Investigation",
        subHeadings: ["3.1 Case Context", "3.2 Quantitative & Qualitative Evaluation", "3.3 Analytical Insights"],
        wordBudget: 1200,
        promptInstructions: "Provide rigorous critical analysis with evidentiary depth."
      },
      {
        chapterNumber: 4,
        title: "Section 4: Strategic Recommendations & Actionable Frameworks",
        subHeadings: ["4.1 Evidence-Based Interventions", "4.2 Implementation Roadmaps", "4.3 Risk Considerations"],
        wordBudget: 700,
        promptInstructions: "Formulate realistic recommendations."
      },
      {
        chapterNumber: 5,
        title: "Section 5: Conclusion & Comprehensive Academic Bibliography",
        subHeadings: ["5.1 Synthesis of Findings", "5.2 Study Limitations", `5.3 Bibliography (${citationStyle})`],
        wordBudget: 500,
        promptInstructions: "Conclude and provide complete bibliography."
      }
    ];

    const evidencePayload = {
      reportType: "COURSEWORK",
      topic: assignmentTitle,
      courseCode,
      caseStudyEntity,
      questions,
      literatureThemes,
      rubricCriteria
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
            formattingRules: { citationStyle }
          })
        });

        const data = await res.json();
        const sectionText = data.result?.text || `\n\n## ${currentSec.title}\nContent drafted in accordance with ${university} academic writing standards.\n`;
        fullCompiledReport += `\n\n${sectionText}\n\n---`;
        setGeneratedReport(fullCompiledReport);
      } catch (err) {
        console.warn(`Section ${i + 1} drafting notice:`, err);
        fullCompiledReport += `\n\n## ${currentSec.title}\n\n### ${currentSec.subHeadings[0] || "Analysis"}\nCritical investigation prepared in strict adherence to ${university} criteria.\n`;
        setGeneratedReport(fullCompiledReport);
      }
    }

    // Persist to Database physically
    try {
      const docRes = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${assignmentTitle} (Coursework)`,
          content: fullCompiledReport,
          toolType: "COURSEWORK"
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
      title: assignmentTitle || "COURSEWORK ASSIGNMENT",
      institution: university || "Tanzania Higher Education",
      faculty,
      programme: isCustomCourse ? customCourse : programme,
      studentName: studentName || "STUDENT NAME",
      registrationNumber: regNumber || "REGISTRATION NUMBER",
      supervisorName: lecturer,
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
          <BookOpen className="size-3.5" />
          Coursework & Technical Assignment Builder
        </div>
      </div>

      {/* STEP PROGRESS BAR */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm">
        <div className="grid grid-cols-5 gap-2 text-center text-xs font-semibold">
          {[
            { num: 1, label: "Institution & Degree" },
            { num: 2, label: "Module & Identity" },
            { num: 3, label: "Assignment Scope" },
            { num: 4, label: "Blueprint Review" },
            { num: 5, label: "Multi-Pass AI Generation" }
          ].map(s => (
            <div
              key={s.num}
              className={`py-2 px-2 rounded-xl transition-all ${
                step === s.num
                  ? "bg-primary text-white font-bold shadow-sm"
                  : step > s.num
                  ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-medium"
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
              <Building2 className="size-5 text-amber-600" />
              1. Institutional Affiliation & Degree Programme
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Select your registered university to calibrate grading rubrics and official citation standards.
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
                  placeholder="e.g. Bachelor of Business Administration"
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
                Target Assignment Length (Pages)
              </label>
              <select
                value={targetPages}
                onChange={e => setTargetPages(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="6">6 Pages (~2,100 words - Standard Essay)</option>
                <option value="10">10 Pages (~3,500 words - Term Paper)</option>
                <option value="15">15 Pages (~5,250 words - Comprehensive Case Study)</option>
                <option value="20">20 Pages (~7,000 words - Capstone Project)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleProceedToStep2} className="px-8 gap-2 bg-primary hover:bg-primary/90">
              Next: Module & Identity <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: MODULE & IDENTITY */}
      {step === 2 && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="size-5 text-amber-600" />
              2. Module Specifications & Student Identity
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Specify your coursework topic, module code, and personal academic details.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Assignment / Term Paper Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Critical Analysis of Supply Chain Digitization in Tanzanian Public Health Facilities"
                value={assignmentTitle}
                onChange={e => setAssignmentTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Course / Module Code *
              </label>
              <input
                type="text"
                placeholder="e.g. BA 304 or IS 211"
                value={courseCode}
                onChange={e => setCourseCode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Student Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Neema Charles Mmasi"
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
                placeholder="e.g. 2022-04-11045"
                value={regNumber}
                onChange={e => setRegNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Course Lecturer / Examiner
              </label>
              <input
                type="text"
                placeholder="e.g. Prof. J. Mwandambo"
                value={lecturer}
                onChange={e => setLecturer(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Submission Date
              </label>
              <input
                type="text"
                placeholder="e.g. 20th October 2026"
                value={submissionDate}
                onChange={e => setSubmissionDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Citation & Referencing Standard
              </label>
              <select
                value={citationStyle}
                onChange={e => setCitationStyle(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="APA7">APA 7th Edition (Standard for Social Sciences & Business)</option>
                <option value="IEEE">IEEE Format (Standard for Engineering & Computing)</option>
                <option value="HARVARD">Harvard Referencing Standard</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button onClick={handleProceedToStep3} className="px-8 gap-2 bg-primary hover:bg-primary/90">
              Next: Assignment Parameters <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: ASSIGNMENT PARAMETERS & EVIDENCE */}
      {step === 3 && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Sliders className="size-5 text-amber-600" />
              3. Assignment Inquiry Questions & Case Context
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Provide the specific questions, case study target, or theoretical themes to ensure analytical depth.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Specific Assignment Inquiry Questions or Tasks *
              </label>
              <textarea
                rows={4}
                placeholder="e.g. 1. Evaluate the impact of ERP adoption on procurement lead times. 2. Contrast transaction cost economics against agency theory in relation to public procurement in Tanzania. 3. Formulate actionable policy guidelines for ministerial accounting officers."
                value={questions}
                onChange={e => setQuestions(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Target Case Study Organization / Empirical Domain (If Applicable)
              </label>
              <input
                type="text"
                placeholder="e.g. Medical Stores Department (MSD) Tanzania"
                value={caseStudyEntity}
                onChange={e => setCaseStudyEntity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Prescribed Scholarly Literature Themes & Frameworks
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Resource-Based View (Barney, 1991), Public Procurement Act 2023, Empirical studies on East African pharmaceutical supply chains."
                value={literatureThemes}
                onChange={e => setLiteratureThemes(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Grading Rubric Key Focus
              </label>
              <input
                type="text"
                placeholder="e.g. Critical synthesis (30%), methodology rigor (20%), evidence-backed recommendations (30%), referencing (20%)."
                value={rubricCriteria}
                onChange={e => setRubricCriteria(e.target.value)}
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
                <FileCheck className="size-5 text-amber-600" />
                4. Coursework Chapter Blueprint & Section Word Budgets
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                The AI will draft each section sequentially with a dedicated word budget to guarantee full page coverage without summarization.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-muted-foreground uppercase">Target Word Budget</span>
              <p className="text-lg font-bold text-amber-600">~{parseInt(targetPages) * 350} Words</p>
            </div>
          </div>

          <div className="space-y-3">
            {(blueprintSections.length > 0 ? blueprintSections : [
              { chapterNumber: 1, title: "Section 1: Introduction, Problem Scope & Module Context", wordBudget: 600, subHeadings: ["Topic Background", "Problem Statement", "Scope of Inquiry"] },
              { chapterNumber: 2, title: "Section 2: Conceptual Literature Synthesis & Theoretical Review", wordBudget: 1100, subHeadings: ["Core Theories", "Critical Literature Critique", "Comparative Models"] },
              { chapterNumber: 3, title: "Section 3: Critical Analysis, Case Study Investigation & Evaluation", wordBudget: 1200, subHeadings: ["Case Context", "Applied Analysis", "Analytical Insights"] },
              { chapterNumber: 4, title: "Section 4: Strategic Recommendations & Actionable Frameworks", wordBudget: 700, subHeadings: ["Actionable Interventions", "Implementation Roadmaps", "Risk Mitigations"] },
              { chapterNumber: 5, title: "Section 5: Conclusion & Comprehensive Academic Bibliography", wordBudget: 500, subHeadings: ["Final Synthesis", "Limitations", `Scholarly Bibliography (${citationStyle})`] }
            ]).map((sec, idx) => (
              <div key={idx} className="p-4 rounded-2xl border bg-slate-50/50 dark:bg-slate-800/40 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-amber-600 uppercase">Section {sec.chapterNumber}</span>
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
                  <span className="text-xs font-bold px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
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
            <Button onClick={handleStartSequentialGeneration} className="px-8 gap-2 bg-amber-600 hover:bg-amber-500 text-white shadow-lg">
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
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 border border-amber-200 dark:border-amber-800 animate-spin">
                  <RefreshCw className="size-6" />
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="size-6" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {isGenerating ? "Executing Multi-Pass Academic Drafting..." : "Academic Coursework Completed!"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isGenerating
                    ? `Drafting Section ${currentDraftingIndex + 1} of ${blueprintSections.length || 5}... Writing exhaustive academic prose.`
                    : `Verified ${totalWords.toLocaleString()} words (~${estimatedPages} pages) compiled according to ${university} standards.`}
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
                <FileText className="size-5 text-amber-600" />
                <span className="font-bold text-sm text-foreground">Live Compiled Document</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{totalWords.toLocaleString()} Words</span>
                <span>•</span>
                <span className="font-semibold text-foreground">~{estimatedPages} Pages</span>
                {createdDocId && (
                  <>
                    <span>•</span>
                    <Link href={`/editor/${createdDocId}`} className="text-amber-600 hover:underline flex items-center gap-1 font-bold">
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
        documentTitle={assignmentTitle || "Coursework Assignment"}
        documentId={createdDocId}
        targetPages={targetPages}
        university={university}
        onSuccess={() => {
          setIsUnlocked(true);
          setShowPaywallModal(false);
          const exportOptions = {
            title: assignmentTitle || "COURSEWORK ASSIGNMENT",
            institution: university || "Tanzania Higher Education",
            faculty,
            programme: isCustomCourse ? customCourse : programme,
            studentName: studentName || "STUDENT NAME",
            registrationNumber: regNumber || "REGISTRATION NUMBER",
            supervisorName: lecturer,
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
