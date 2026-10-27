"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
  ListChecks,
  Upload,
  Sliders,
  Lock,
  CreditCard,
  PhoneCall,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  X,
  BadgeCheck,
  Loader2,
  GraduationCap,
  User,
  BookOpen,
  Calendar,
  FileSpreadsheet,
  ExternalLink,
  Download,
  Wand2,
  AlertCircle,
  Info,
  Paperclip,
  Trash2,
  Printer,
  FileEdit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocxCompilerEngine, DocxExportOptions } from "@/lib/export/docx-compiler";
import { SuggestionModal } from "@/components/evidence/SuggestionModal";
import { ComprehensiveFieldReportSuggestionModal } from "@/components/evidence/ComprehensiveFieldReportSuggestionModal";
import { DocumentExportPaywallModal } from "@/components/billing/DocumentExportPaywallModal";
import { DocumentDownloadSelectorModal, ExportFormatType } from "@/components/export/DocumentDownloadSelectorModal";
import {
  TANZANIA_ACADEMIC_CATALOG,
  getUniversitiesCatalog,
  getUniversityByShortName,
  getCollegesForUniversity,
  getCoursesForCollege,
  CollegeItem,
  CourseItem
} from "@/data/tanzania-academic-catalog";
import {
  UniversityTemplateEngine,
  InstitutionalTemplateBlueprint
} from "@/lib/templates/university-template-engine";
import AcademicAlerts from "@/lib/sweetalert";

interface TemplateSection {
  id: string;
  title: string;
  description?: string;
  order: number;
}

interface ResolvedTemplate {
  template_id: string;
  template_name: string;
  template_code: string;
  status: string;
  sections: TemplateSection[];
  formatting_rules: Record<string, any>;
}

export default function FieldReportGuidedPage() {
  const [step, setStep] = useState(1);

  // Dynamic Universities Catalog
  const catalogUniversities = getUniversitiesCatalog();

  // STEP 1: ACADEMIC INSTITUTION & PROGRAMME HIERARCHY (ZERO STATIC / DEFAULT DATA)
  const [selectedUniShortName, setSelectedUniShortName] = useState("");
  const [university, setUniversity] = useState("");
  const [selectedCollegeId, setSelectedCollegeId] = useState("");
  const [faculty, setFaculty] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [programme, setProgramme] = useState("");
  const [customCourse, setCustomCourse] = useState("");
  const [isCustomCourse, setIsCustomCourse] = useState(false);
  const [targetPages, setTargetPages] = useState("10");
  const [academicYear, setAcademicYear] = useState("");
  const [customAcademicYear, setCustomAcademicYear] = useState("");
  const [isCustomAcademicYear, setIsCustomAcademicYear] = useState(false);
  const resolvedAcademicYear = isCustomAcademicYear ? customAcademicYear.trim() : academicYear.trim();

  // STEP 2: STUDENT IDENTITY & REPORT TITLE (ZERO STATIC / DEFAULT DATA)
  const [reportTitle, setReportTitle] = useState("");
  const [studentName, setStudentName] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [organization, setOrganization] = useState("");
  const [department, setDepartment] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [duration, setDuration] = useState("");

  // STEP 3: ATTACHMENT EVIDENCE & OBSERVATIONS (ZERO STATIC / DEFAULT DATA)
  const [activities, setActivities] = useState("");
  const [toolsUsed, setToolsUsed] = useState("");
  const [challenges, setChallenges] = useState("");
  const [keyLearnings, setKeyLearnings] = useState("");
  const [activeSuggestionField, setActiveSuggestionField] = useState<"activities" | "toolsUsed" | "challenges" | "keyLearnings" | null>(null);
  const [showComprehensiveModal, setShowComprehensiveModal] = useState(false);
  const [stepError, setStepError] = useState("");
  const [canvasViewMode, setCanvasViewMode] = useState<"formatted" | "raw">("formatted");

  // CUSTOM TEMPLATE UPLOAD & URL STATE
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [customSections, setCustomSections] = useState<Array<{ id: string; title: string; description: string; order: number; subsections?: string[] }>>([]);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [templateUrlInput, setTemplateUrlInput] = useState("");
  const [urlFetchError, setUrlFetchError] = useState("");
  const [uploadWarning, setUploadWarning] = useState<string | null>(null);

  // STUDENT EVIDENCE / LOGBOOK UPLOAD STATE
  const [uploadedEvidenceFileName, setUploadedEvidenceFileName] = useState("");
  const [isParsingEvidence, setIsParsingEvidence] = useState(false);
  const [evidenceUploadSuccess, setEvidenceUploadSuccess] = useState<string | null>(null);

  // SERVER-SIDE TEMPLATE RESOLUTION (FOR AUDIT COMPATIBILITY)
  const [resolvedTemplate, setResolvedTemplate] = useState<ResolvedTemplate | null>(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);

  // GENERATION & WORKSPACE STATE
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState("");
  const [selectedSection, setSelectedSection] = useState("all");
  const [createdDocId, setCreatedDocId] = useState<string | null>(null);

  // PAYMENT MODAL STATE
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
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<"pdf" | "cover" | "doc">("pdf");
  const [showDownloadSelector, setShowDownloadSelector] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [generationPhase, setGenerationPhase] = useState<string>("");
  const [generationProgress, setGenerationProgress] = useState<number>(0);

  // CURRENT SELECTED UNIVERSITY ITEM
  const selectedUni = selectedUniShortName ? getUniversityByShortName(selectedUniShortName) : undefined;

  // CASCADING DROPDOWN COLLECTIONS
  const availableColleges: CollegeItem[] = selectedUniShortName ? getCollegesForUniversity(selectedUniShortName) : [];
  const availableCourses: CourseItem[] = (selectedUniShortName && selectedCollegeId) ? getCoursesForCollege(selectedUniShortName, selectedCollegeId) : [];

  // INSTITUTIONAL TEMPLATE BLUEPRINT (CONTEXT-AWARE FOR SPECIALIZED DISCIPLINES)
  const activeBlueprint: InstitutionalTemplateBlueprint = UniversityTemplateEngine.resolveTemplate(
    selectedUniShortName,
    {
      college: faculty,
      programme: isCustomCourse ? customCourse : programme,
      taskDescription: reportTitle,
      activities
    }
  );

  const resolveUniversityTemplate = async (shortName: string) => {
    if (!shortName) return;
    setIsLoadingTemplate(true);
    try {
      const q = new URLSearchParams({
        university: shortName,
        report_type: "FIELDWORK",
      });
      if (faculty) q.append("college", faculty);
      const effectiveProg = isCustomCourse ? customCourse : programme;
      if (effectiveProg) q.append("programme", effectiveProg);

      const res = await fetch(`/api/templates/resolve?${q.toString()}`);
      const json = await res.json();
      if (json.success && json.data) {
        setResolvedTemplate(json.data);
      }
    } catch (err) {
      console.error("Failed to resolve server template:", err);
    } finally {
      setIsLoadingTemplate(false);
    }
  };

  // FETCH SERVER-SIDE TEMPLATE WHEN UNIVERSITY, FACULTY, OR PROGRAMME CHANGES
  useEffect(() => {
    if (selectedUniShortName) {
      resolveUniversityTemplate(selectedUniShortName);
    } else {
      setResolvedTemplate(null);
    }
  }, [selectedUniShortName, faculty, programme, customCourse, isCustomCourse]);

  // INITIAL URL PARAMETERS CHECK (?institution=UDSM)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const inst = params.get("institution");
      if (inst) {
        handleUniversityChange(inst);
      }
    }
  }, []);

  // UNIVERSITY SELECTION HANDLER (RESETS AND RELOADS COLLEGES & COURSES)
  const handleUniversityChange = (shortName: string) => {
    setSelectedUniShortName(shortName);
    setStepError("");
    if (!shortName) {
      setUniversity("");
      setSelectedCollegeId("");
      setFaculty("");
      setSelectedCourseId("");
      setProgramme("");
      setIsCustomCourse(false);
      setCustomCourse("");
      setResolvedTemplate(null);
      return;
    }
    const uni = getUniversityByShortName(shortName);
    if (uni) {
      setUniversity(`${uni.name} (${uni.shortName})`);
    } else {
      setUniversity(shortName);
    }
    // Pure live data: reset downstream selections so the user chooses their actual college & course
    setSelectedCollegeId("");
    setFaculty("");
    setSelectedCourseId("");
    setProgramme("");
    setIsCustomCourse(false);
    setCustomCourse("");
  };

  // COLLEGE SELECTION HANDLER (RESETS AND RELOADS COURSES)
  const handleCollegeChange = (colId: string) => {
    setSelectedCollegeId(colId);
    setStepError("");
    if (!colId) {
      setFaculty("");
      setSelectedCourseId("");
      setProgramme("");
      setIsCustomCourse(false);
      setCustomCourse("");
      return;
    }
    if (colId === "custom") {
      setFaculty("");
      setSelectedCourseId("custom");
      setProgramme("");
      setIsCustomCourse(true);
      return;
    }
    const foundCol = availableColleges.find((c) => c.id === colId);
    if (foundCol) {
      setFaculty(foundCol.name);
      setSelectedCourseId("");
      setProgramme("");
      setIsCustomCourse(false);
      setCustomCourse("");
    }
  };

  // COURSE SELECTION HANDLER
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
    const foundCrs = availableCourses.find((c) => c.id === crsId);
    if (foundCrs) {
      setProgramme(foundCrs.name);
    }
  };

  // STEP NAVIGATION VALIDATIONS
  const handleProceedToStep2 = () => {
    if (!selectedUniShortName) {
      setStepError("Please select your Higher Learning Institution.");
      return;
    }
    if (!selectedCollegeId) {
      setStepError("Please select your College, Faculty, or School.");
      return;
    }
    if (selectedCollegeId === "custom" && !faculty.trim()) {
      setStepError("Please specify the title of your custom College or Faculty.");
      return;
    }
    if (!selectedCourseId) {
      setStepError("Please select your Degree or Diploma Programme.");
      return;
    }
    if (isCustomCourse && !customCourse.trim()) {
      setStepError("Please type your Degree Programme title.");
      return;
    }
    if (!resolvedAcademicYear) {
      setStepError("Please select your Academic Year (e.g. 2024/2025).");
      return;
    }
    setStepError("");
    setStep(2);
  };

  const handleProceedToStep3 = () => {
    if (!reportTitle.trim()) {
      setStepError("Please enter your official Report Title.");
      return;
    }
    if (!studentName.trim()) {
      setStepError("Please enter your Student Full Name.");
      return;
    }
    if (!regNumber.trim()) {
      setStepError("Please enter your Student Registration Number.");
      return;
    }
    if (!yearOfStudy) {
      setStepError("Please select your Year of Study.");
      return;
    }
    if (!organization.trim()) {
      setStepError("Please enter the Host Organization Name.");
      return;
    }
    setStepError("");
    setStep(3);
  };

  const handleProceedToStep4 = () => {
    if (!activities.trim()) {
      setStepError("Please provide the practical activities and tasks performed during your attachment.");
      return;
    }
    setStepError("");
    setStep(4);
  };

  // CUSTOM TEMPLATE UPLOAD & PARSER
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsParsingFile(true);
    setUrlFetchError("");

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
        AcademicAlerts.toast(`Template Loaded: ${file.name} (${data.sections.length} Chapters)`, "success");
        setUploadWarning(data.warningMessage || null);
      } else {
        // Fallback default custom chapters
        setCustomSections([
          { id: "c1", title: "Chapter 1: Organization Overview & Placement Mandate", description: `From ${file.name}`, order: 1 },
          { id: "c2", title: "Chapter 2: Technical Duties & Fieldwork Implementation", description: `From ${file.name}`, order: 2 },
          { id: "c3", title: "Chapter 3: Industrial Challenges & Problem Solving", description: `From ${file.name}`, order: 3 },
          { id: "c4", title: "Chapter 4: Skills Acquired & Curriculum Relevance", description: `From ${file.name}`, order: 4 },
          { id: "c5", title: "Chapter 5: Conclusions & Actionable Recommendations", description: `From ${file.name}`, order: 5 }
        ]);
        setUploadWarning("Using standard TCU inter-university chapters. You can customize them in Step 4.");
      }
    } catch (err) {
      console.error("Failed to parse uploaded template:", err);
      setUploadWarning("Could not parse file. Standard chapters provided for review.");
    } finally {
      setIsParsingFile(false);
    }
  };

  // URL TEMPLATE FETCH & PARSER
  const handleUrlFetch = async () => {
    if (!templateUrlInput.trim()) return;
    setIsParsingFile(true);
    setUrlFetchError("");

    try {
      const res = await fetch("/api/templates/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: templateUrlInput.trim() })
      });

      const data = await res.json();
      if (res.ok && data.success && data.sections && data.sections.length > 0) {
        setCustomSections(data.sections);
        setUploadedFileName(data.fileName || "Custom University Template URL");
        AcademicAlerts.toast(`Template fetched from URL (${data.sections.length} Chapters)`, "success");
      } else {
        setUrlFetchError(data.error || "Could not parse document structure from the provided URL.");
        AcademicAlerts.error("Template URL Error", data.error || "Could not parse document structure from URL.");
      }
    } catch (err: any) {
      setUrlFetchError(err.message || "Failed to reach template URL.");
      AcademicAlerts.error("Template URL Error", err.message || "Failed to reach template URL.");
    } finally {
      setIsParsingFile(false);
    }
  };

  // LOCAL TEMPLATE FILE LOADER (FROM templates/ REPOSITORY)
  const handleLocalTemplateSelect = async (filename: string) => {
    if (!filename) return;
    setIsParsingFile(true);
    setUrlFetchError("");

    try {
      const res = await fetch("/api/templates/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateFile: filename })
      });

      const data = await res.json();
      if (res.ok && data.success && data.sections && data.sections.length > 0) {
        setCustomSections(data.sections);
        setUploadedFileName(filename);
        AcademicAlerts.success("Official Template Activated", `Loaded ${filename} with official university chapters and Times New Roman 10pt standards.`);
      } else {
        setUrlFetchError(data.error || "Could not parse document structure from template.");
        AcademicAlerts.error("Template Error", data.error || "Could not parse template.");
      }
    } catch (err: any) {
      setUrlFetchError(err.message || "Failed to load local template file.");
      AcademicAlerts.error("Template Error", err.message || "Failed to load local template file.");
    } finally {
      setIsParsingFile(false);
    }
  };

  const handleClearCustomTemplate = () => {
    setUploadedFileName("");
    setCustomSections([]);
    setUploadWarning(null);
  };

  // STUDENT EVIDENCE FILE UPLOADER (EXTRACTS LOGBOOK / FIELD TASKS)
  const handleEvidenceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedEvidenceFileName(file.name);
    setIsParsingEvidence(true);
    setEvidenceUploadSuccess(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/evidence/parse", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      if (data.success && data.evidence) {
        if (data.evidence.activities) setActivities(data.evidence.activities);
        if (data.evidence.toolsUsed) setToolsUsed(data.evidence.toolsUsed);
        if (data.evidence.challenges) setChallenges(data.evidence.challenges);
        if (data.evidence.keyLearnings) setKeyLearnings(data.evidence.keyLearnings);
        setEvidenceUploadSuccess(`Successfully extracted tasks, tools, and challenges from "${file.name}" into your work log below! You can preview and edit.`);
        setStepError("");
      } else {
        setStepError("Could not extract text from the evidence document. You can still use the suggestion drafts below.");
      }
    } catch (err) {
      console.error("Failed to parse evidence file:", err);
      setStepError("Error processing evidence file. Please enter details or use suggestions below.");
    } finally {
      setIsParsingEvidence(false);
    }
  };

  // DYNAMIC OUTLINE SECTIONS (CUSTOM UPLOAD > ACTIVE INSTITUTIONAL BLUEPRINT > NATIONAL STANDARD)
  const outlineSections: Array<{ id: string; title: string; description: string; subsections?: string[] }> = customSections && customSections.length > 0
    ? customSections.map((sec, idx) => ({
        id: sec.id || `custom-sec-${idx}`,
        title: sec.title,
        description: sec.description || "Custom uploaded template requirement",
        subsections: sec.subsections || []
      }))
    : activeBlueprint && activeBlueprint.chapters && activeBlueprint.chapters.length > 0
      ? activeBlueprint.chapters.map((ch) => ({
          id: ch.id,
          title: `${ch.number}: ${ch.title}`,
          description: ch.description || "",
          subsections: ch.subsections || []
        }))
      : resolvedTemplate && resolvedTemplate.sections && resolvedTemplate.sections.length > 0
        ? resolvedTemplate.sections.map((sec, idx) => ({
            id: `sec-${sec.id || idx}`,
            title: sec.title,
            description: sec.description || "",
            subsections: [] as string[]
          }))
        : [
            { id: "ch1", title: "Chapter 1: Introduction & Organization Background", description: "Background and mandate.", subsections: [] },
            { id: "ch2", title: "Chapter 2: Industrial Attachment Activities", description: "Daily operations and tasks.", subsections: [] },
            { id: "ch3", title: "Chapter 3: Technical Challenges & Solutions", description: "Analysis and mitigation.", subsections: [] },
            { id: "ch4", title: "Chapter 4: Skills Acquired & Lessons Learned", description: "Curriculum relevance.", subsections: [] },
            { id: "ch5", title: "Chapter 5: Conclusions & Recommendations", description: "Strategic suggestions.", subsections: [] }
          ];

  // COMPILED EXPORT OPTIONS & MULTI-SHEET A4 CANVAS LOGIC
  const buildExportOptions = useCallback((): DocxExportOptions => {
    const effectiveProgramme = (isCustomCourse ? customCourse : programme).trim();
    const effectiveStudentName = studentName.trim();
    const effectiveRegNumber = regNumber.trim();
    const effectiveOrg = organization.trim();
    const effectiveSupervisor = supervisor.trim();
    const effectiveDept = department.trim() || (faculty ? `${faculty} Technical Unit` : "");
    const effectiveAcademicYear = resolvedAcademicYear || "2024/2025";
    const effectiveDuration = duration.trim() || "8 Weeks";
    const effectiveSubmissionDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    return {
      title: reportTitle || `Fieldwork Report (${targetPages} Pages) - ${effectiveOrg || "Host Enterprise"}`,
      institution: university,
      institutionShortName: selectedUniShortName,
      logoUrl: selectedUni?.logoUrl,
      reportType: activeBlueprint?.coverPageLayout?.headerTitle || "FIELD PRACTICAL TRAINING REPORT",
      faculty,
      department: effectiveDept,
      programme: effectiveProgramme || "[DEGREE PROGRAMME REQUIRED]",
      studentName: effectiveStudentName || "[STUDENT NAME REQUIRED]",
      registrationNumber: effectiveRegNumber || "[REGISTRATION NUMBER REQUIRED]",
      yearOfStudy: yearOfStudy || "2",
      organization: effectiveOrg || "[HOST ENTERPRISE REQUIRED]",
      fieldSupervisor: effectiveSupervisor || "[FIELD SUPERVISOR REQUIRED]",
      universitySupervisor: effectiveSupervisor || "[ACADEMIC SUPERVISOR REQUIRED]",
      supervisorName: effectiveSupervisor,
      academicYear: effectiveAcademicYear,
      attachmentPeriod: effectiveDuration,
      submissionDate: effectiveSubmissionDate,
      content: generatedReport
    };
  }, [
    isCustomCourse, customCourse, programme, studentName, regNumber, organization,
    supervisor, department, faculty, resolvedAcademicYear, duration, reportTitle,
    targetPages, university, selectedUniShortName, selectedUni, activeBlueprint,
    yearOfStudy, generatedReport
  ]);

  const effectiveExportOptions = useMemo(() => buildExportOptions(), [buildExportOptions]);

  const contentSheets = useMemo(() => {
    if (!generatedReport) return [];
    const formattedHtml = DocxCompilerEngine.formatContentToAcademicHtml(generatedReport, effectiveExportOptions);
    return DocxCompilerEngine.splitContentIntoA4Sheets(formattedHtml);
  }, [generatedReport, effectiveExportOptions]);

  const effectiveCh1Index = useMemo(() => {
    const idx = contentSheets.findIndex(s => 
      /<h1[^>]*class="[^"]*chapter-title[^"]*"[^>]*>\s*CHAPTER\s+(?:1|ONE)\b/i.test(s) ||
      /<h1[^>]*id="ch-1"[^>]*>/i.test(s)
    );
    return idx >= 0 ? idx : 6;
  }, [contentSheets]);

  // REPORT GENERATION ENGINE (PHASED STEPPER)
  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setStep(5);
    setGenerationProgress(12);
    setGenerationPhase("Phase 1: Validating Student Identity & Formulating Cover Page...");

    const sections = outlineSections;
    let secStep = 0;
    const progressTimer = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev < 20) {
          setGenerationPhase("Phase 1: Validating Student Identity & Formulating Cover Page...");
          return prev + 4;
        } else if (prev < 35) {
          setGenerationPhase("Phase 2: Compiling Preliminaries (Declaration, Approval, Abstract, TOC)...");
          return prev + 4;
        } else if (prev < 85) {
          const currentSec = sections[secStep % sections.length];
          secStep++;
          setGenerationPhase(`Synthesizing ${currentSec ? currentSec.title : "Chapter Content"}...`);
          return prev + 4;
        } else if (prev < 95) {
          setGenerationPhase("Synthesizing Concluding Observations, References & Appendices...");
          return prev + 2;
        }
        return prev;
      });
    }, 850);

    const effectiveCollege = faculty.trim() || (selectedUniShortName === "UDSM" ? "College of Information and Communication Technologies (CoICT)" : "");
    const effectiveProgramme = (isCustomCourse ? customCourse : programme).trim() || (selectedUniShortName === "UDSM" ? "BSc in Computer Science" : "[DEGREE PROGRAMME REQUIRED]");
    const effectiveStudent = studentName.trim() || "[STUDENT NAME REQUIRED]";
    const effectiveReg = regNumber.trim() || "[REGISTRATION NUMBER REQUIRED]";
    const effectiveOrg = organization.trim() || "[HOST ENTERPRISE REQUIRED]";
    const effectiveDept = department.trim() || (effectiveCollege ? `${effectiveCollege} Unit` : "Technical Operations Unit");
    const effectiveSupervisor = supervisor.trim() || "[FIELD SUPERVISOR REQUIRED]";
    const effectiveAcademicYear = resolvedAcademicYear || "2024/2025";
    const effectiveDuration = duration.trim() || "8 Weeks";

    // Build authentic, publication-grade academic report matching official institutional standards
    const institutionalReport = UniversityTemplateEngine.generateFullAcademicReportContent({
      reportTitle: reportTitle || "FIELD PRACTICAL TRAINING REPORT",
      studentName: effectiveStudent,
      regNumber: effectiveReg,
      yearOfStudy: yearOfStudy || "Year 2",
      university: university || selectedUni?.name || "Tanzanian Higher Learning Institution",
      uniShortName: selectedUniShortName || selectedUni?.shortName || "HLI",
      college: effectiveCollege,
      programme: effectiveProgramme,
      organization: effectiveOrg,
      department: effectiveDept,
      supervisor: effectiveSupervisor,
      academicYear: effectiveAcademicYear,
      duration: effectiveDuration,
      activities,
      toolsUsed,
      challenges,
      keyLearnings,
      targetPages,
      customSections: customSections && customSections.length > 0 ? customSections : undefined,
      uploadedTemplateName: uploadedFileName || undefined
    });

    const dynamicCover = UniversityTemplateEngine.generateOfficialUdsmCoverPage({
      reportTitle: reportTitle || "FIELD PRACTICAL TRAINING REPORT",
      studentName: effectiveStudent,
      regNumber: effectiveReg,
      yearOfStudy,
      university,
      college: effectiveCollege,
      programme: effectiveProgramme,
      organization: effectiveOrg,
      department: effectiveDept,
      supervisor: effectiveSupervisor,
      academicYear: effectiveAcademicYear
    });

    const promptContext = `
${dynamicCover}

${uploadedFileName && customSections.length > 0 
  ? `CUSTOM UPLOADED UNIVERSITY SAMPLE STANDARD (${uploadedFileName}):
The student uploaded an official approved university sample report / attachment guideline.
You MUST follow this exact chapter outline and include all extracted subsections:
${outlineSections.map((s, idx) => `Chapter ${idx + 1}: ${s.title}${s.subsections?.length ? ` (Subsections: ${s.subsections.join(", ")})` : ""} - ${s.description}`).join("\n")}`
  : `INSTITUTIONAL FORMAT BLUEPRINT (${activeBlueprint.institutionName}):
Source Template Standard: ${activeBlueprint.sourceFile}
${activeBlueprint.guidelineRules.join("\n")}

REQUIRED CHAPTER HIERARCHY:
${outlineSections.map((s, idx) => `Section ${idx + 1}: ${s.title} - ${s.description}`).join("\n")}`}

TARGET REPORT LENGTH: Approximately ${targetPages} Pages (around ${parseInt(targetPages) * 350} words)

STUDENT'S PRACTICAL EVIDENCE & WORK LOG:
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
          systemPrompt: `You are an authentic Tanzanian university undergraduate student writing your official Industrial Field Practical Training report for ${university}.
Follow these strict writing style instructions:
1. TONE & VOCABULARY: Write in clear, natural, professional English like a real human student. Use simple, direct sentences.
2. BAN ALL AI CLICHÉS: DO NOT use robotic buzzwords or academic jargon such as "exhaustive pedagogical synthesis", "systematic paradigm", "tapestry", "plethora", "delve into", "beacon of excellence", "testament to", "multifaceted", or "serves as an intensive learning laboratory". 
3. REAL STUDENT VOICE: Describe your practical work from a realistic, first-person or professional perspective (e.g., "During my training at ${organization}, I worked in the ${department || "technical"} unit under the supervision of ${supervisor || "my supervisor"}. My daily tasks included...").
4. CONCRETE DETAILS: Focus on practical daily realities: tools used (${toolsUsed || "standard equipment"}), specific steps carried out, real challenges faced, and how they were solved.
5. ACADEMIC STRUCTURE: Maintain the official ${uploadedFileName && customSections.length > 0 ? `uploaded sample (${uploadedFileName})` : activeBlueprint.shortName} chapter hierarchy (${outlineSections.map((s, idx) => s.title).join(", ")}, Preliminary Pages, References, Appendices).
6. COVER PAGE & CREDENTIALS: You MUST include the exact student cover page with real credentials (${studentName || "STUDENT NAME"}, Reg No: ${regNumber || "REGISTRATION NUMBER"}).
7. DIAGRAMS & TABLES: Include Figure 1.1 Organogram, Figure 2.1 Process Flowchart, and Table 2.1 Comparative Matrix. Target approximately ${targetPages} pages (${parseInt(targetPages) * 350} words).`,
          input: promptContext
        })
      });

      const data = await res.json();
      let reportText = institutionalReport;
      if (res.ok && data.result && data.result.length > 2500 && (data.result.includes("CHAPTER") || data.result.includes("Chapter"))) {
        let finalReport = data.result;
        if ((!finalReport.includes("<svg") || !finalReport.includes("DECLARATION")) && institutionalReport.includes("<svg")) {
          finalReport = UniversityTemplateEngine.reinjectVisualsIfMissing(finalReport, institutionalReport);
        }
        reportText = finalReport;
      }

      setGeneratedReport(reportText);

      // Save document to DB
      const saveRes = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: reportTitle || `Field Report (${targetPages} Pages) - ${organization}`,
          content: reportText,
          toolType: "field-report"
        })
      });
      const docData = await saveRes.json();
      if (docData.document?.id) {
        setCreatedDocId(docData.document.id);
      }
    } catch (e) {
      setGeneratedReport(institutionalReport);
    } finally {
      clearInterval(progressTimer);
      setGenerationProgress(100);
      setGenerationPhase("Phase 8: Performing Pagination Audit & Enforcing Chapter Breaks Complete");
      setIsGenerating(false);
    }
  };

  const handleOpenInEditor = async () => {
    if (!generatedReport) return;
    let targetDocId = createdDocId;

    if (!targetDocId) {
      try {
        const res = await fetch("/api/documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: reportTitle || `Fieldwork Report (${targetPages} Pages) - ${organization || "Practical Training"}`,
            content: generatedReport,
            toolType: "field-report"
          })
        });
        const docData = await res.json();
        if (docData.document?.id) {
          targetDocId = docData.document.id;
          setCreatedDocId(targetDocId);
        }
      } catch (e) {
        console.error("Auto-save document error:", e);
      }
    }

    if (targetDocId) {
      window.open(`/editor/${targetDocId}`, "_blank");
    } else {
      window.open("/dashboard/documents", "_blank");
    }
  };

  const handleExport = async (format: "pdf" | "cover" | "doc" = "pdf") => {
    if (!generatedReport) return;
    setSelectedFormat(format);

    // Check for placeholders per unreportTZ Section 10
    const placeholders = generatedReport.match(/\[MISSING:[^\]]+\]|\[ADD [^\]]+\]/g);
    if (placeholders && placeholders.length > 0) {
      AcademicAlerts.warning(
        "Unresolved Placeholders",
        `Your report contains ${placeholders.length} unresolved placeholder(s) (${placeholders.slice(0, 2).join(", ")}). You can edit them in the editor before final submission.`
      );
    }

    const exportOptions = buildExportOptions();

    if (isUnlocked) {
      if (format === "cover") {
        DocxCompilerEngine.openCoverPageOnlyPdfWindow(exportOptions);
      } else if (format === "doc") {
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
          format: format === "doc" ? "doc" : "pdf",
          options: exportOptions
        })
      });

      const data = await res.json();
      if (res.status === 402 || data.requiresPayment) {
        setShowPaymentModal(true);
      } else if (data.success) {
        setIsUnlocked(true);
        if (format === "cover") {
          DocxCompilerEngine.openCoverPageOnlyPdfWindow(exportOptions);
        } else if (format === "doc") {
          DocxCompilerEngine.downloadDocxFile(exportOptions);
        } else {
          DocxCompilerEngine.openPdfPrintWindow(exportOptions);
        }
      }
    } catch (e) {
      setShowPaymentModal(true);
    }
  };



  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* REUSABLE DOCUMENT EXPORT PAYWALL MODAL */}
      <DocumentExportPaywallModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        documentTitle={reportTitle || `Fieldwork Report (${targetPages} Pages)`}
        documentId={createdDocId}
        targetPages={targetPages}
        university={university}
        onSuccess={() => {
          setIsUnlocked(true);
          setShowPaymentModal(false);
          const opts = buildExportOptions();
          if (selectedFormat === "cover") {
            DocxCompilerEngine.openCoverPageOnlyPdfWindow(opts);
          } else if (selectedFormat === "doc") {
            DocxCompilerEngine.downloadDocxFile(opts);
          } else {
            DocxCompilerEngine.openPdfPrintWindow(opts);
          }
        }}
      />

      {/* DOCUMENT DOWNLOAD SELECTOR MODAL */}
      <DocumentDownloadSelectorModal
        isOpen={showDownloadSelector}
        onClose={() => setShowDownloadSelector(false)}
        documentTitle={reportTitle || `Fieldwork Report (${targetPages} Pages)`}
        isUnlocked={isUnlocked}
        onSelectFormat={(fmt) => handleExport(fmt)}
        onUnlockRequired={(fmt) => {
          setSelectedFormat(fmt);
          setShowDownloadSelector(false);
          setShowPaymentModal(true);
        }}
      />

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
            <h1 className="text-2xl font-bold font-heading">Fieldwork & Industrial Attachment Assistant</h1>
            <p className="text-xs text-muted-foreground">
              Official institutional format reproduction, dynamic cascading academic hierarchy, and print-ready PDF export.
            </p>
          </div>
        </div>
      </div>

      {/* STEP INDICATOR */}
      {step < 5 && (
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 1, label: "1. Institution & Course" },
            { id: 2, label: "2. Student & Title" },
            { id: 3, label: "3. Tasks & Template" },
            { id: 4, label: "4. Outline Preview" }
          ].map((s) => (
            <div
              key={s.id}
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition ${
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

      {/* STEP 1: INSTITUTION, COLLEGE & COURSE HIERARCHY */}
      {step === 1 && (
        <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm space-y-6 max-w-2xl mx-auto">
          <div>
            <h3 className="text-lg font-bold font-heading mb-1 flex items-center gap-2">
              <GraduationCap className="size-5 text-primary" /> Step 1: Academic Institution & Programme Hierarchy
            </h3>
            <p className="text-xs text-muted-foreground">
              Select your university to automatically reload its official colleges and degree programmes.
            </p>
          </div>

          {stepError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-2">
              <X className="size-4 shrink-0" /> {stepError}
            </div>
          )}

          <div className="space-y-4">
            {/* LEVEL 1: UNIVERSITY */}
            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5 flex items-center justify-between">
                <span>Select Higher Learning Institution in Tanzania</span>
                {isLoadingTemplate && (
                  <span className="text-[11px] text-teal-600 flex items-center gap-1 font-normal">
                    <Loader2 className="size-3 animate-spin" /> Verifying standard...
                  </span>
                )}
              </label>
              <select
                className="w-full p-3 rounded-lg border text-sm bg-background font-semibold"
                value={selectedUniShortName}
                onChange={(e) => handleUniversityChange(e.target.value)}
              >
                <option value="">-- Select Higher Learning Institution in Tanzania --</option>
                {catalogUniversities.map((uni) => (
                  <option key={uni.id} value={uni.shortName}>
                    {uni.name} ({uni.shortName}) {uni.hasOfficialTemplate ? "✓ Verified Template" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* TEMPLATE STATUS BADGE & UNVERIFIED UNIVERSITY UPLOAD CALLOUT */}
            {selectedUniShortName && (
              customSections.length > 0 ? (
                <div className="p-3.5 border rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                      <BadgeCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                      Custom Blueprint Active: {uploadedFileName || "Uploaded Sample"} ({customSections.length} Chapters Extracted)
                    </span>
                    <button
                      type="button"
                      onClick={handleClearCustomTemplate}
                      className="text-[11px] text-red-600 hover:text-red-700 dark:text-red-400 font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="size-3" /> Reset to TCU Standard
                    </button>
                  </div>
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                    Your report will be built strictly around the {customSections.length} chapters and subsections extracted from your uploaded university sample report.
                  </p>
                </div>
              ) : activeBlueprint.hasVerifiedSample ? (
                <div className="p-3.5 border rounded-xl bg-teal-50/60 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                      <BadgeCheck className="size-4 text-teal-600 dark:text-teal-400" />
                      Official Format: {activeBlueprint.institutionName} ({activeBlueprint.sourceFile})
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-teal-200 dark:bg-teal-900 text-teal-800 dark:text-teal-300">
                      VERIFIED
                    </span>
                  </div>
                  <p className="text-[11px] text-teal-800 dark:text-teal-300">
                    {activeBlueprint.chapters.length} Official Chapter Sections • Times New Roman (10pt Body, 14pt/12pt Headings) • Decimal Headings • Visual Diagrams & Comparative Tables
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-700/80 bg-amber-50/70 dark:bg-amber-950/30 space-y-3 shadow-sm">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wide">
                          No Official Verified Sample Report Found for {selectedUni?.shortName || activeBlueprint.institutionName}
                        </h4>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                          Upload Custom Sample
                        </span>
                      </div>
                      <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                        To ensure your report is built strictly around your university&apos;s approved structure, upload your faculty&apos;s sample report or attachment guideline document (<strong>.PDF</strong>, <strong>.DOCX</strong>, <strong>.TXT</strong>).
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1 border-t border-amber-200/60 dark:border-amber-800/50">
                    <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-dashed border-amber-400 dark:border-amber-600 hover:border-amber-500 rounded-lg text-xs font-semibold text-amber-900 dark:text-amber-200 cursor-pointer transition shadow-sm">
                      <Upload className="size-4 text-amber-600" />
                      <span>{isParsingFile ? "Parsing University Sample..." : "Upload Sample Report / Guideline (.PDF / .DOCX)"}</span>
                      <input
                        type="file"
                        accept=".txt,.doc,.docx,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={isParsingFile}
                      />
                    </label>
                    <span className="text-[11px] text-amber-700 dark:text-amber-400 text-center sm:text-left self-center font-medium">
                      or proceed with TCU 5-Chapter Standard
                    </span>
                  </div>
                </div>
              )
            )}

            {/* LEVEL 2: COLLEGE / FACULTY */}
            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5">
                College / Faculty / School {selectedUniShortName ? `(Found at ${selectedUniShortName})` : ""}
              </label>
              <select
                disabled={!selectedUniShortName}
                className="w-full p-3 rounded-lg border text-sm bg-background font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                value={selectedCollegeId}
                onChange={(e) => handleCollegeChange(e.target.value)}
              >
                <option value="">{selectedUniShortName ? "-- Select College / School / Faculty --" : "-- Select University First --"}</option>
                {availableColleges.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name} ({col.shortName})
                  </option>
                ))}
                {selectedUniShortName && <option value="custom">-- Other / Specify Custom Faculty --</option>}
              </select>
              {selectedCollegeId === "custom" && (
                <input
                  type="text"
                  placeholder="Type your faculty or college name..."
                  className="w-full p-2.5 rounded-lg border text-sm mt-2 bg-background"
                  value={faculty}
                  onChange={(e) => {
                    setFaculty(e.target.value);
                    setStepError("");
                  }}
                />
              )}
            </div>

            {/* LEVEL 3: COURSE / DEGREE PROGRAMME */}
            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5">
                Degree / Diploma Programme
              </label>
              <select
                disabled={!selectedCollegeId || selectedCollegeId === "custom"}
                className="w-full p-3 rounded-lg border text-sm bg-background font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                value={selectedCourseId}
                onChange={(e) => handleCourseChange(e.target.value)}
              >
                <option value="">{selectedCollegeId ? "-- Select Degree / Diploma Programme --" : "-- Select College First --"}</option>
                {availableCourses.map((crs) => (
                  <option key={crs.id} value={crs.id}>
                    {crs.name}
                  </option>
                ))}
                {selectedCollegeId && <option value="custom">-- Other / Specify Custom Programme --</option>}
              </select>

              {isCustomCourse && (
                <input
                  type="text"
                  placeholder="Type your degree programme name..."
                  className="w-full p-2.5 rounded-lg border text-sm mt-2 bg-background"
                  value={customCourse}
                  onChange={(e) => {
                    setCustomCourse(e.target.value);
                    setProgramme(e.target.value);
                    setStepError("");
                  }}
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5 flex items-center gap-1.5">
                  <Sliders className="size-3.5 text-primary" /> Target Report Pages
                </label>
                <select
                  className="w-full p-3 rounded-lg border text-sm bg-background font-semibold"
                  value={targetPages}
                  onChange={(e) => setTargetPages(e.target.value)}
                >
                  <option value="5">5 Pages (~1,750 Words)</option>
                  <option value="10">10 Pages (~3,500 Words - Standard)</option>
                  <option value="15">15 Pages (~5,250 Words)</option>
                  <option value="25">25+ Pages (~8,750 Words)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5 flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-primary" /> Academic Year
                </label>
                <select
                  className="w-full p-3 rounded-lg border text-sm bg-background font-semibold"
                  value={isCustomAcademicYear ? "custom" : academicYear}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "custom") {
                      setIsCustomAcademicYear(true);
                      setAcademicYear("custom");
                    } else {
                      setIsCustomAcademicYear(false);
                      setAcademicYear(val);
                    }
                    setStepError("");
                  }}
                >
                  <option value="">-- Select Academic Year --</option>
                  <option value="2026/2027">2026/2027</option>
                  <option value="2025/2026">2025/2026</option>
                  <option value="2024/2025">2024/2025</option>
                  <option value="2023/2024">2023/2024</option>
                  <option value="2022/2023">2022/2023</option>
                  <option value="2021/2022">2021/2022</option>
                  <option value="2020/2021">2020/2021</option>
                  <option value="2019/2020">2019/2020</option>
                  <option value="2018/2019">2018/2019</option>
                  <option value="custom">Other / Custom Year...</option>
                </select>

                {isCustomAcademicYear && (
                  <input
                    type="text"
                    placeholder="Enter Custom Academic Year (e.g. 2017/2018)"
                    className="w-full p-2.5 mt-2 rounded-lg border text-sm bg-background font-semibold"
                    value={customAcademicYear}
                    onChange={(e) => {
                      setCustomAcademicYear(e.target.value);
                      setStepError("");
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handleProceedToStep2} className="gap-2">
              Continue to Student Credentials <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: STUDENT IDENTITY & REPORT TITLE (ZERO STATIC / DEFAULT DATA) */}
      {step === 2 && (
        <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm space-y-6 max-w-2xl mx-auto">
          <div>
            <h3 className="text-lg font-bold font-heading mb-1 flex items-center gap-2">
              <User className="size-5 text-primary" /> Step 2: Student Identity & Cover Page Credentials
            </h3>
            <p className="text-xs text-muted-foreground">
              These details will dynamically populate your official cover page with zero static or dummy data.
            </p>
          </div>

          {stepError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-2">
              <X className="size-4 shrink-0" /> {stepError}
            </div>
          )}

          <div className="space-y-4">
            {/* REPORT TITLE */}
            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5 flex items-center gap-1">
                <BookOpen className="size-3.5 text-primary" /> Official Report Title (Appears on Cover Page)
              </label>
              <textarea
                rows={2}
                className="w-full p-3 rounded-lg border text-sm bg-background font-semibold uppercase resize-none"
                placeholder="e.g. FIELD PRACTICAL TRAINING REPORT ON AGRO-PROCESSING AND FOOD QUALITY ASSURANCE"
                value={reportTitle}
                onChange={(e) => {
                  setReportTitle(e.target.value);
                  setStepError("");
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5">Student Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Menard John Mushi"
                  className="w-full p-3 rounded-lg border text-sm bg-background font-medium"
                  value={studentName}
                  onChange={(e) => {
                    setStudentName(e.target.value);
                    setStepError("");
                  }}
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5">Registration Number</label>
                <input
                  type="text"
                  placeholder="e.g. 2022-04-08912"
                  className="w-full p-3 rounded-lg border text-sm bg-background font-mono"
                  value={regNumber}
                  onChange={(e) => {
                    setRegNumber(e.target.value);
                    setStepError("");
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5">Year of Study</label>
                <select
                  className="w-full p-3 rounded-lg border text-sm bg-background font-medium"
                  value={yearOfStudy}
                  onChange={(e) => {
                    setYearOfStudy(e.target.value);
                    setStepError("");
                  }}
                >
                  <option value="">-- Select Year of Study --</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="5th Year">5th Year</option>
                  <option value="Postgraduate / Master">Postgraduate / Master</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5">Duration of Attachment</label>
                <input
                  type="text"
                  placeholder="e.g. 8 Weeks (July - September 2024)"
                  className="w-full p-3 rounded-lg border text-sm bg-background font-medium"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5">Host Organization</label>
                <input
                  type="text"
                  placeholder="e.g. Bakhresa Food Products Limited / TTCL"
                  className="w-full p-3 rounded-lg border text-sm bg-background font-medium"
                  value={organization}
                  onChange={(e) => {
                    setOrganization(e.target.value);
                    setStepError("");
                  }}
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5">Department Placed</label>
                <input
                  type="text"
                  placeholder="e.g. Quality Control & Processing Unit"
                  className="w-full p-3 rounded-lg border text-sm bg-background font-medium"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5">Academic / Field Supervisor</label>
              <input
                type="text"
                placeholder="e.g. Dr. A. Mwakyusa / Eng. J. Mtambo"
                className="w-full p-3 rounded-lg border text-sm bg-background font-medium"
                value={supervisor}
                onChange={(e) => setSupervisor(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={() => { setStepError(""); setStep(1); }}>Back</Button>
            <Button onClick={handleProceedToStep3} className="gap-2">
              Continue to Activities & Evidence <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: WORK ACTIVITIES & CUSTOM TEMPLATE UPLOAD */}
      {step === 3 && (
        <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm space-y-6 max-w-2xl mx-auto">
          <div>
            <h3 className="text-lg font-bold font-heading mb-1 flex items-center gap-2">
              <FileSpreadsheet className="size-5 text-primary" /> Step 3: Practical Work Activities & Template Upload
            </h3>
            <p className="text-xs text-muted-foreground">
              Provide your attachment duties. You can also upload a custom university guideline file.
            </p>
          </div>

          {stepError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-2">
              <X className="size-4 shrink-0" /> {stepError}
            </div>
          )}

          <div className="space-y-4">
            {/* NOTICE IF UNIVERSITY HAS NO VERIFIED BUNDLED TEMPLATE */}
            {selectedUni && !selectedUni.hasOfficialTemplate && (
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
                  <AlertCircle className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Standard TCU Inter-University Format Active for {selectedUni.shortName}</span>
                </div>
                <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                  We currently use the verified Tanzania Commission for Universities (TCU) inter-university standard structure for {selectedUni.name}. <strong>If your faculty or supervisor gave you a custom sample template or guideline document</strong>, upload it below and our engine will adopt your university&apos;s exact chapter outline automatically.
                </p>
              </div>
            )}

            {/* 1. CUSTOM TEMPLATE UPLOAD & URL */}
            <div className="p-4 rounded-xl border border-dashed border-teal-300 dark:border-teal-800 bg-teal-50/40 dark:bg-teal-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase text-teal-900 dark:text-teal-200 flex items-center gap-2 cursor-pointer">
                  <Upload className="size-4 text-teal-600 dark:text-teal-400" />
                  1. University Guideline / Sample Template (.PDF / .DOCX / .TXT / URL)
                </label>
                {uploadedFileName && (
                  <button
                    type="button"
                    onClick={handleClearCustomTemplate}
                    className="text-[11px] font-medium text-red-600 hover:text-red-700 dark:text-red-400 flex items-center gap-1"
                  >
                    <Trash2 className="size-3" /> Clear Template
                  </button>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Optional: Upload your university&apos;s official attachment guideline or provide a link. Our engine extracts the exact chapter headings and Times New Roman (10pt/14pt/12pt) hierarchy automatically.
              </p>

              {/* Option 1: File Upload */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Option A: Upload File (.DOCX / .PDF / .TXT)</span>
                <input
                  type="file"
                  accept=".txt,.doc,.docx,.pdf"
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-600 file:text-white hover:file:bg-teal-700 cursor-pointer"
                />
              </div>

              {/* Option 2: Template URL */}
              <div className="space-y-1 pt-1 border-t border-teal-200/50 dark:border-teal-800/40">
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Option B: Paste Template / Guideline URL</span>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.university.edu/guidelines/field_report_template.docx"
                    value={templateUrlInput}
                    onChange={(e) => {
                      setTemplateUrlInput(e.target.value);
                      setUrlFetchError("");
                    }}
                    className="flex-1 p-2 rounded-lg border text-xs bg-background"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleUrlFetch}
                    disabled={isParsingFile || !templateUrlInput.trim()}
                    className="text-xs shrink-0"
                  >
                    {isParsingFile ? <Loader2 className="size-3 animate-spin mr-1" /> : <ExternalLink className="size-3 mr-1" />}
                    Fetch Template
                  </Button>
                </div>
                {urlFetchError && (
                  <p className="text-xs text-red-500 font-medium flex items-center gap-1 pt-1">
                    <X className="size-3.5" /> {urlFetchError}
                  </p>
                )}
              </div>

              {/* Option 3: Pre-loaded Official Templates from templates/ */}
              <div className="space-y-1 pt-1 border-t border-teal-200/50 dark:border-teal-800/40">
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Option C: Select Pre-loaded Institutional File (templates/ folder)</span>
                <select
                  disabled={isParsingFile}
                  onChange={(e) => handleLocalTemplateSelect(e.target.value)}
                  className="w-full p-2 rounded-lg border text-xs bg-background"
                  defaultValue=""
                >
                  <option value="">-- Choose Official University File From Repository --</option>
                  <option value="UDSM.docx">University of Dar es Salaam — UDSM.docx (Word Document)</option>
                  <option value="ARTHI IT REPORT 2_110443.pdf">Ardhi University — ARTHI IT REPORT 2_110443.pdf</option>
                  <option value="CBE FIELD REPORT FORMAT .pdf">College of Business Education — CBE FIELD REPORT FORMAT .pdf</option>
                  <option value="IFM FIELD REPORT SAMPLE.pdf">Institute of Finance Management — IFM FIELD REPORT SAMPLE.pdf</option>
                  <option value="NIT FIELD REPORT.pdf">National Institute of Transport — NIT FIELD REPORT.pdf</option>
                  <option value="FIELD REPORT SAMPLE.pdf">National Higher Learning Benchmark — FIELD REPORT SAMPLE.pdf</option>
                </select>
              </div>

              {isParsingFile && (
                <p className="text-xs text-teal-600 flex items-center gap-1.5 font-medium pt-1">
                  <Loader2 className="size-3.5 animate-spin" /> Parsing document structure, section arrangement, and chapter headings...
                </p>
              )}
              {uploadedFileName && !isParsingFile && (
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span>Custom blueprint extracted from <strong>{uploadedFileName}</strong> ({customSections.length} Sections Active)</span>
                </div>
              )}
              {uploadWarning && (
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-800 dark:text-amber-300 flex items-start gap-1.5">
                  <Info className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>{uploadWarning}</span>
                </div>
              )}
            </div>

            {/* 2. STUDENT PRACTICAL EVIDENCE / LOGBOOK UPLOAD */}
            <div className="p-4 rounded-xl border border-dashed border-sky-300 dark:border-sky-800 bg-sky-50/40 dark:bg-sky-950/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase text-sky-900 dark:text-sky-200 flex items-center gap-2 cursor-pointer">
                  <Paperclip className="size-4 text-sky-600 dark:text-sky-400" />
                  2. Student Attachment Evidence / Logbook / Rough Notes (.PDF / .DOCX / .TXT)
                </label>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Optional: Have a daily logbook, supervisor remark sheet, or raw draft notes? Upload them here to automatically populate your tasks, tools, and challenges below.
              </p>
              <input
                type="file"
                accept=".txt,.doc,.docx,.pdf"
                onChange={handleEvidenceUpload}
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-700 cursor-pointer"
              />
              {isParsingEvidence && (
                <p className="text-xs text-sky-600 flex items-center gap-1.5 font-medium">
                  <Loader2 className="size-3.5 animate-spin" /> Analyzing evidence file and extracting activities, tools, and challenges...
                </p>
              )}
              {evidenceUploadSuccess && !isParsingEvidence && (
                <div className="p-2.5 bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 rounded-lg text-xs font-medium text-sky-700 dark:text-sky-300 flex items-center gap-1.5">
                  <Check className="size-4 text-sky-600 shrink-0" />
                  <span>{evidenceUploadSuccess}</span>
                </div>
              )}
            </div>

            {/* SINGLE SUGGESTION BANNER FOR ALL 4 FIELDS BASED STRICTLY ON REPORT TITLE */}
            <div className="p-4 rounded-xl border border-teal-200 dark:border-teal-850 bg-gradient-to-r from-teal-50/90 via-emerald-50/60 to-cyan-50/90 dark:from-teal-950/40 dark:via-emerald-950/25 dark:to-cyan-950/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-teal-600 text-white shadow-xs">
                    <Sparkles className="size-4" />
                  </span>
                  <span className="text-xs font-bold text-teal-950 dark:text-teal-200">
                    Smart AI Suggestion from Report Title
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300">
                    All 4 Fields
                  </span>
                </div>
                <p className="text-[11px] text-teal-850 dark:text-teal-300/90 leading-relaxed">
                  {reportTitle.trim() ? (
                    <>
                      Generates defense-ready duties, tools, challenges, and learnings for:{" "}
                      <strong className="text-teal-950 dark:text-teal-100 uppercase">
                        &quot;{reportTitle.trim()}&quot;
                      </strong>
                      . You can review and edit before accepting.
                    </>
                  ) : (
                    "Generates professional activities, tools, equipment, challenges, and key learnings strictly based on your report title. You can review and edit before accepting."
                  )}
                </p>
              </div>
              <Button
                type="button"
                onClick={() => setShowComprehensiveModal(true)}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2.5 h-auto shrink-0 shadow-sm gap-2"
              >
                <Sparkles className="size-3.5" />
                Auto-Suggest All 4 Fields
              </Button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase text-muted-foreground">Activities & Tasks Performed</label>
              </div>
              <textarea
                rows={3}
                placeholder="Describe your daily operations, assignments, tests, or engineering duties (e.g. 1. Routine maintenance on equipment... 2. Quality testing and sample analysis... 3. Process optimization...)"
                className="w-full p-3 rounded-lg border text-sm bg-background resize-none leading-relaxed"
                value={activities}
                onChange={(e) => {
                  setActivities(e.target.value);
                  setStepError("");
                }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase text-muted-foreground">Tools, Equipment & Software Used</label>
              </div>
              <input
                type="text"
                placeholder="e.g. Spectrophotometer, Refractometer, Wireshark, Multimeter, Linux Terminal..."
                className="w-full p-3 rounded-lg border text-sm bg-background"
                value={toolsUsed}
                onChange={(e) => setToolsUsed(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Challenges Encountered</label>
                </div>
                <textarea
                  rows={2}
                  placeholder="e.g. Calibration drift on sensors during peak production; mitigated by daily recalibration protocols."
                  className="w-full p-3 rounded-lg border text-sm bg-background resize-none"
                  value={challenges}
                  onChange={(e) => setChallenges(e.target.value)}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Key Learnings</label>
                </div>
                <textarea
                  rows={2}
                  placeholder="e.g. Hands-on mastery of industrial process control, standard operating procedure compliance, and workplace safety."
                  className="w-full p-3 rounded-lg border text-sm bg-background resize-none"
                  value={keyLearnings}
                  onChange={(e) => setKeyLearnings(e.target.value)}
                />
              </div>
            </div>

            {/* COMPREHENSIVE TITLE-BASED ALL-IN-ONE SUGGESTION MODAL */}
            {showComprehensiveModal && (
              <ComprehensiveFieldReportSuggestionModal
                isOpen={showComprehensiveModal}
                onClose={() => setShowComprehensiveModal(false)}
                onApply={(suggestedData) => {
                  setActivities(suggestedData.activities);
                  setToolsUsed(suggestedData.toolsUsed);
                  setChallenges(suggestedData.challenges);
                  setKeyLearnings(suggestedData.keyLearnings);
                  setStepError("");
                }}
                reportTitle={reportTitle}
                onUpdateTitle={(newTitle) => setReportTitle(newTitle)}
                organization={organization}
                department={department}
                programmeId={selectedCourseId || programme}
                duration={duration}
                currentValues={{
                  activities,
                  toolsUsed,
                  challenges,
                  keyLearnings
                }}
              />
            )}
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={() => { setStepError(""); setStep(2); }}>Back</Button>
            <Button onClick={handleProceedToStep4} className="gap-2">
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

          {/* CREDENTIALS SUMMARY BOX */}
          <div className="p-4 border rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Student:</span>
              <strong className="text-foreground">{studentName || "Not specified"} ({regNumber || "No Reg No"})</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Programme:</span>
              <strong className="text-foreground">{isCustomCourse ? customCourse : programme}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Faculty / College:</span>
              <strong className="text-foreground">{faculty} • {university}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Host Entity:</span>
              <strong className="text-foreground">{organization} ({department})</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Template Format:</span>
              <strong className="text-teal-600 dark:text-teal-400">
                {uploadedFileName ? `Custom (${uploadedFileName})` : `${activeBlueprint.institutionName} (${activeBlueprint.sourceFile})`}
              </strong>
            </div>
          </div>

          <div className="space-y-2 border rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/30 max-h-72 overflow-y-auto">
            {outlineSections.map((sec, idx) => (
              <div key={sec.id} className="p-3 bg-white dark:bg-slate-900 border rounded-lg flex items-start justify-between text-sm">
                <div className="space-y-1">
                  <span className="font-semibold text-foreground block">{sec.title}</span>
                  <span className="text-xs text-muted-foreground block">{sec.description}</span>
                  {sec.subsections && sec.subsections.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {sec.subsections.map((sub: string, sIdx: number) => (
                        <span key={sIdx} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                          {sub}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-xs text-teal-600 dark:text-teal-400 font-mono font-bold shrink-0 ml-2">Section {idx + 1}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
            <Button onClick={handleGenerateReport} className="gap-2 bg-primary">
              <Sparkles className="size-4" /> Generate {targetPages}-Page University Draft
            </Button>
          </div>
        </div>
      )}

      {/* STEP 5: DOCUMENT WORKSPACE & PDF EXPORT */}
      {step === 5 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT PANEL: TABLE OF CONTENTS NAVIGATION */}
          <div className="bg-white dark:bg-slate-900 border rounded-2xl p-5 flex flex-col h-full shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b mb-3">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <ListChecks className="size-4 text-primary" /> Table of Contents
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="text-xs h-7">
                Edit Parameters
              </Button>
            </div>

            <div className="space-y-1.5 overflow-y-auto flex-1 pr-1">
              <button
                onClick={() => setSelectedSection("all")}
                className={`w-full text-left p-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition ${
                  selectedSection === "all"
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800 text-muted-foreground"
                }`}
              >
                <span>Full Generated Report Draft</span>
                <span className="text-[10px] font-mono">{targetPages} Pages</span>
              </button>

              {outlineSections.map((sec, idx) => (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSection(sec.id)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                    selectedSection === sec.id
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800 text-muted-foreground"
                  }`}
                >
                  <span className="truncate pr-2">{sec.title}</span>
                  <span className="text-[10px] text-muted-foreground shrink-0">Sec {idx + 1}</span>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t mt-3 space-y-2 text-xs">
              <div className="p-3 bg-teal-50/50 dark:bg-teal-950/30 rounded-xl border border-teal-100 dark:border-teal-900/40">
                <span className="font-bold text-teal-800 dark:text-teal-300 block mb-1">Institutional Format:</span>
                <p className="text-muted-foreground text-[11px]">
                  {uploadedFileName ? `Custom (${uploadedFileName})` : `${activeBlueprint.institutionName} Official Standard`}
                </p>
              </div>
            </div>
          </div>

          {/* CENTER PANEL: EDITABLE DOCUMENT CANVAS */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border rounded-2xl p-6 flex flex-col overflow-hidden shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b mb-3">
              <div>
                <h3 className="font-bold text-base truncate max-w-md">{reportTitle || "Industrial Practical Training Report"}</h3>
                <p className="text-xs text-muted-foreground font-mono">
                  {studentName || "Student"} • {faculty || "Faculty"} • {targetPages} Pages Target
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* CANVAS VIEW MODE SWITCHER */}
                <div className="flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setCanvasViewMode("formatted")}
                    className={`px-2.5 py-1 rounded-md transition font-medium flex items-center gap-1.5 ${
                      canvasViewMode === "formatted"
                        ? "bg-white dark:bg-slate-700 shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <FileCheck className="size-3.5" /> Official View
                  </button>
                  <button
                    type="button"
                    onClick={() => setCanvasViewMode("raw")}
                    className={`px-2.5 py-1 rounded-md transition font-medium flex items-center gap-1.5 ${
                      canvasViewMode === "raw"
                        ? "bg-white dark:bg-slate-700 shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <FileText className="size-3.5" /> Raw Text
                  </button>
                </div>

                {/* PREVIEW & EDIT IN FULL EDITOR (OPENS IN NEW TAB) */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleOpenInEditor} 
                  disabled={!generatedReport} 
                  className="text-xs gap-1.5 border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 shadow-sm transition"
                  title="Open document in a new tab to edit text and upload figures/images"
                >
                  <ExternalLink className="size-3.5 text-teal-600" />
                  Preview & Edit
                </Button>

                {/* DOWNLOAD ACTIONS: CHOOSE BETWEEN DOCX & PDF */}
                <Button 
                  size="sm" 
                  onClick={() => setShowDownloadSelector(true)} 
                  disabled={!generatedReport} 
                  className="text-xs gap-1.5 font-bold shadow-sm bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white"
                  title="Choose download format: Microsoft Word (.docx) or PDF"
                >
                  <Download className="size-3.5" />
                  <span>Download Options</span>
                  <ChevronDown className="size-3 opacity-80" />
                  {!isUnlocked && <Lock className="size-3 text-amber-200" />}
                </Button>

                {/* DIRECT WORD (.DOCX) DOWNLOAD */}
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleExport("doc")} 
                  disabled={!generatedReport} 
                  className="text-xs gap-1.5 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/40"
                  title={!isUnlocked ? "Unlock to download editable Microsoft Word document (.docx)" : "Download editable Microsoft Word document (.docx / .doc)"}
                >
                  {!isUnlocked ? <Lock className="size-3.5 text-amber-500" /> : <FileEdit className="size-3.5 text-blue-600" />}
                  Word (.docx)
                </Button>

                {/* DIRECT PDF DOWNLOAD */}
                <Button 
                  size="sm" 
                  onClick={() => handleExport("pdf")} 
                  disabled={!generatedReport} 
                  className={`text-xs gap-1.5 font-bold shadow-sm transition ${
                    isUnlocked
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-teal-600 hover:bg-teal-700 text-white"
                  }`}
                  title={!isUnlocked ? "Complete payment to unlock and download full PDF" : "Download full official PDF document"}
                >
                  {!isUnlocked ? <Lock className="size-3.5 text-amber-200" /> : <Printer className="size-3.5" />}
                  {isUnlocked ? "Download PDF" : "Unlock & Download PDF"}
                </Button>

                {/* COVER ONLY */}
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => handleExport("cover")} 
                  disabled={!generatedReport} 
                  className="text-xs gap-1 border border-slate-200 dark:border-slate-800 text-muted-foreground hover:text-foreground font-medium"
                  title="Export official university cover page only as PDF"
                >
                  <GraduationCap className="size-3.5 text-teal-600" />
                  Cover
                </Button>
              </div>
            </div>

            <div 
              className={`flex-1 overflow-y-auto relative ${!isUnlocked ? 'select-none' : ''}`}
              onCopy={(e) => {
                if (!isUnlocked) {
                  e.preventDefault();
                  setShowPaymentModal(true);
                }
              }}
              onContextMenu={(e) => {
                if (!isUnlocked) {
                  e.preventDefault();
                }
              }}
              onKeyDown={(e) => {
                if (!isUnlocked && (e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "C" || e.key === "x" || e.key === "X")) {
                  e.preventDefault();
                  setShowPaymentModal(true);
                }
              }}
            >
              {isGenerating ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4 py-16 px-6 max-w-xl mx-auto">
                  <div className="relative size-16 flex items-center justify-center">
                    <RefreshCw className="size-12 animate-spin text-teal-600" />
                    <span className="absolute font-bold text-xs text-slate-800 dark:text-slate-100">{generationProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-teal-600 h-full transition-all duration-500 rounded-full"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{generationPhase || `Generating ${targetPages}-page official university report draft...`}</p>
                    <p className="text-xs text-muted-foreground">Formatting institutional cover page, preliminary sections, organogram and process flowcharts...</p>
                  </div>
                </div>
              ) : canvasViewMode === "formatted" ? (
                <div className="a4-document-canvas rounded-xl overflow-y-auto max-h-[820px] border border-slate-200 dark:border-slate-800">
                  {/* Sheet 1: Cover Page */}
                  <div className="a4-document-sheet p-8 sm:p-12 relative flex flex-col justify-between">
                    <div className="absolute top-3 right-4 text-[10px] uppercase tracking-wider text-slate-400 font-sans font-semibold">
                      Sheet 1: Official University Cover
                    </div>
                    <div 
                      dangerouslySetInnerHTML={{
                        __html: DocxCompilerEngine.compileCoverPageHtml(effectiveExportOptions)
                      }} 
                    />
                    <div className="text-center text-[10px] text-slate-400 font-sans mt-2">
                      [Page 1 — Official Cover Page]
                    </div>
                  </div>

                  {/* Sheets 2+: Preliminaries & Individual Chapters */}
                  {contentSheets.length > 0 ? (
                    contentSheets.map((sheetHtml, idx) => (
                      <div key={idx} className="a4-document-sheet p-8 sm:p-14 relative font-serif text-[11pt] leading-relaxed">
                        <div className="absolute top-3 right-4 text-[10px] uppercase tracking-wider text-slate-400 font-sans font-semibold">
                          Sheet {idx + 2} of {contentSheets.length + 1}
                        </div>
                        <div 
                          className="prose max-w-none text-slate-900"
                          dangerouslySetInnerHTML={{ __html: sheetHtml }} 
                        />
                        <div className="text-center text-xs text-slate-500 font-serif mt-10 pt-4 border-t border-slate-200">
                          {idx < effectiveCh1Index 
                            ? `— ${DocxCompilerEngine.toRoman(idx + 1)} —` 
                            : `— Page ${idx - effectiveCh1Index + 1} —`}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="a4-document-sheet p-8 sm:p-14 relative font-serif text-[11pt] leading-relaxed">
                      <div 
                        className="prose max-w-none text-slate-900"
                        dangerouslySetInnerHTML={{
                          __html: DocxCompilerEngine.formatContentToAcademicHtml(generatedReport, effectiveExportOptions)
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative h-full">
                  <textarea
                    readOnly={!isUnlocked}
                    className={`w-full h-full p-4 font-mono text-xs leading-relaxed border-none bg-transparent focus:outline-none resize-none text-slate-900 dark:text-slate-100 ${
                      !isUnlocked ? 'cursor-default select-none' : ''
                    }`}
                    value={generatedReport}
                    onChange={(e) => isUnlocked && setGeneratedReport(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
