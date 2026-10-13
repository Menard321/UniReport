"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  GraduationCap,
  Search,
  FileText,
  BadgeCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  RotateCcw,
  Sliders,
  Layers,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  BookOpen,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface UniversityItem {
  id: string;
  name: string;
  shortName: string;
  logoUrl?: string;
  hasVerifiedTemplate?: boolean;
  templateCount?: number;
}

interface ReportTypeItem {
  id: string;
  name: string;
  code: string;
  description?: string;
}

interface TemplateSectionItem {
  id: string;
  title: string;
  description?: string;
  order: number;
  is_required: boolean;
}

interface ResolvedTemplateData {
  template_id: string;
  template_name: string;
  template_code: string;
  status: string;
  version: {
    id: string;
    version_number: string;
    file_format: string;
  };
  university: {
    id: string;
    name: string;
    short_name: string;
  };
  report_type: {
    id: string;
    name: string;
    code: string;
  };
  sections: TemplateSectionItem[];
  formatting_rules: Record<string, any>;
}

export default function NewReportWizardPage() {
  const router = useRouter();

  // State
  const [universities, setUniversities] = useState<UniversityItem[]>([]);
  const [reportTypes, setReportTypes] = useState<ReportTypeItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUni, setSelectedUni] = useState<UniversityItem | null>(null);
  const [selectedReportType, setSelectedReportType] = useState<string>("FIELDWORK");
  
  // Template Resolution State
  const [resolvedTemplate, setResolvedTemplate] = useState<ResolvedTemplateData | null>(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  const [templateError, setTemplateError] = useState<string | null>(null);

  // Metadata form
  const [title, setTitle] = useState("");
  const [faculty, setFaculty] = useState("");
  const [programme, setProgramme] = useState("");
  const [academicYear, setAcademicYear] = useState("2025/2026");
  const [organization, setOrganization] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [targetPages, setTargetPages] = useState("10");

  const [isInitializing, setIsInitializing] = useState(false);

  // 1. Load Universities and Report Types
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [uniRes, rtRes] = await Promise.all([
          fetch("/api/universities"),
          fetch("/api/report-types"),
        ]);

        if (uniRes.ok) {
          const uniData = await uniRes.json();
          if (Array.isArray(uniData.universities)) {
            setUniversities(uniData.universities);
            // Default select UDSM or first university
            const defaultUni =
              uniData.universities.find((u: UniversityItem) => u.shortName.toUpperCase() === "UDSM") ||
              uniData.universities[0];
            setSelectedUni(defaultUni || null);
          }
        }

        if (rtRes.ok) {
          const rtData = await rtRes.json();
          if (Array.isArray(rtData.reportTypes)) {
            setReportTypes(rtData.reportTypes);
          }
        }
      } catch (err) {
        console.error("Failed to load initial wizard data:", err);
      }
    }
    loadInitialData();
  }, []);

  // 2. Resolve template whenever university or report type changes
  const resolveCurrentTemplate = async (uni: UniversityItem | null, rtCode: string) => {
    if (!uni) return;
    setIsLoadingTemplate(true);
    setTemplateError(null);

    try {
      const res = await fetch(
        `/api/templates/resolve?university=${encodeURIComponent(uni.shortName)}&reportType=${encodeURIComponent(rtCode)}`
      );
      const data = await res.json();

      if (res.ok && data.template) {
        setResolvedTemplate(data.template);
        if (!title) {
          setTitle(`${rtCode === "FIELDWORK" ? "Industrial Attachment Report" : "Academic Project"} - ${uni.shortName}`);
        }
      } else {
        setResolvedTemplate(null);
        setTemplateError(data.message || `No active verified template found for ${uni.name}.`);
      }
    } catch (err) {
      console.error("Error resolving template:", err);
      setTemplateError("Failed to reach the template resolution service. Please try again.");
    } finally {
      setIsLoadingTemplate(false);
    }
  };

  useEffect(() => {
    if (selectedUni) {
      resolveCurrentTemplate(selectedUni, selectedReportType);
    }
  }, [selectedUni, selectedReportType]);

  // Filtered universities list for search
  const filteredUniversities = useMemo(() => {
    if (!searchQuery.trim()) return universities;
    const q = searchQuery.toLowerCase();
    return universities.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.shortName.toLowerCase().includes(q)
    );
  }, [universities, searchQuery]);

  // Handle report initialization
  const handleInitializeReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUni) return;

    setIsInitializing(true);
    try {
      const defaultTitle = title.trim() || `${selectedReportType} Report - ${selectedUni.shortName}`;
      
      const payload = {
        title: defaultTitle,
        content: `# ${defaultTitle}\n\n**INSTITUTION:** ${selectedUni.name} (${selectedUni.shortName})\n**ACADEMIC YEAR:** ${academicYear}\n**FACULTY:** ${faculty || "Faculty of Science and Technology"}\n**PROGRAMME:** ${programme || "Bachelor Degree"}\n**TARGET LENGTH:** ${targetPages} Pages\n\nAdhering to official template: ${resolvedTemplate?.template_name || "National Standard"}`,
        toolType: selectedReportType === "FIELDWORK" ? "field-report" : "fyp-generator",
        metadata: {
          universityId: selectedUni.id,
          universityShortName: selectedUni.shortName,
          universityName: selectedUni.name,
          reportType: selectedReportType,
          templateId: resolvedTemplate?.template_id,
          templateVersionId: resolvedTemplate?.version?.id,
          targetPages,
          faculty,
          programme,
          academicYear,
          organization,
          supervisor,
        }
      };

      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.document?.id) {
        if (selectedReportType === "FIELDWORK") {
          router.push(`/dashboard/tools/field-report?docId=${data.document.id}`);
        } else {
          router.push(`/dashboard/tools/fyp-generator?docId=${data.document.id}`);
        }
      } else {
        // Fallback redirection to field report creator
        router.push("/dashboard/tools/field-report");
      }
    } catch (err) {
      console.error("Failed to initialize report:", err);
      router.push("/dashboard/tools/field-report");
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <Link
            href="/dashboard/create"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 mb-2 transition"
          >
            <ArrowLeft className="size-3.5" /> Back to Creation Options
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight flex items-center gap-3">
            <Building2 className="size-7 text-primary" /> Universal Report Generator
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create an academic report structured dynamically around your specific university guidelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60 flex items-center gap-1.5">
            <ShieldCheck className="size-4" /> All Institutions Supported
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: SELECTION CONTROLS */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: CHOOSE UNIVERSITY */}
          <div className="p-6 border rounded-2xl bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Building2 className="size-4 text-primary" /> 1. Select Higher Learning Institution
              </label>
              {selectedUni && (
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                  {selectedUni.shortName} Selected
                </span>
              )}
            </div>

            {/* SEARCH INPUT */}
            <div className="relative">
              <Search className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search university by name or abbreviation (e.g. UDSM, IFM, CBE)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* UNIVERSITY PILLS / SELECTOR */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {filteredUniversities.map((uni) => {
                const isSelected = selectedUni?.id === uni.id || selectedUni?.shortName === uni.shortName;
                return (
                  <button
                    key={uni.id || uni.shortName}
                    type="button"
                    onClick={() => setSelectedUni(uni)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition flex flex-col justify-between gap-2 ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 border-border/80 text-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold text-sm tracking-tight">{uni.shortName}</span>
                      {uni.hasVerifiedTemplate && (
                        <BadgeCheck
                          className={`size-4 ${
                            isSelected ? "text-primary-foreground" : "text-teal-600 dark:text-teal-400"
                          }`}
                        />
                      )}
                    </div>
                    <span
                      className={`text-[11px] line-clamp-1 ${
                        isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                      }`}
                    >
                      {uni.name}
                    </span>
                  </button>
                );
              })}
              {filteredUniversities.length === 0 && (
                <div className="col-span-full py-6 text-center text-xs text-muted-foreground">
                  No institution found matching &ldquo;{searchQuery}&rdquo;.
                </div>
              )}
            </div>
          </div>

          {/* STEP 2: CHOOSE REPORT TYPE */}
          <div className="p-6 border rounded-2xl bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <BookOpen className="size-4 text-primary" /> 2. Choose Report Category
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(reportTypes.length > 0
                ? reportTypes
                : [
                    {
                      id: "fieldwork",
                      name: "Field Practical Training (IPT)",
                      code: "FIELDWORK",
                      description: "Industrial training, internship, and field attachment logbook report.",
                    },
                    {
                      id: "fyp",
                      name: "Final Year Project (FYP)",
                      code: "FYP",
                      description: "Undergraduate capstone design or research project report.",
                    },
                    {
                      id: "dissertation",
                      name: "Dissertation & Proposal",
                      code: "DISSERTATION",
                      description: "Postgraduate Masters / PhD proposal and bound thesis chapters.",
                    },
                  ]
              ).map((rt) => {
                const isSelected = selectedReportType.toUpperCase() === rt.code.toUpperCase();
                return (
                  <button
                    key={rt.id || rt.code}
                    type="button"
                    onClick={() => setSelectedReportType(rt.code)}
                    className={`p-4 rounded-xl border text-left transition ${
                      isSelected
                        ? "bg-teal-50/70 dark:bg-teal-950/40 border-teal-500 text-teal-950 dark:text-teal-100 shadow-sm"
                        : "bg-background border-border/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-sm">{rt.name}</span>
                      {isSelected && <CheckCircle2 className="size-4 text-teal-600 dark:text-teal-400" />}
                    </div>
                    {rt.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {rt.description}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: METADATA DETAILS */}
          <form onSubmit={handleInitializeReport} className="p-6 border rounded-2xl bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Sliders className="size-4 text-primary" /> 3. Document Details & Scope
            </label>

            <div>
              <label className="text-xs font-bold text-muted-foreground block mb-1">Report Title</label>
              <input
                type="text"
                required
                className="w-full p-3 rounded-lg border text-sm bg-background"
                placeholder="e.g. Field Practical Training Report at Tanzania Ports Authority (TPA)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Faculty / Department</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border text-sm bg-background"
                  placeholder="e.g. CoICT - Computer Science"
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Degree Programme</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border text-sm bg-background"
                  placeholder="e.g. BSc in Computer Science"
                  value={programme}
                  onChange={(e) => setProgramme(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Academic Year</label>
                <select
                  className="w-full p-3 rounded-lg border text-sm bg-background font-semibold"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                >
                  <option value="">-- Select Academic Year --</option>
                  <option value="2026/2027">2026/2027</option>
                  <option value="2025/2026">2025/2026</option>
                  <option value="2024/2025">2024/2025</option>
                  <option value="2023/2024">2023/2024</option>
                  <option value="2022/2023">2022/2023</option>
                  <option value="2021/2022">2021/2022</option>
                  <option value="2020/2021">2020/2021</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Target Page Count</label>
                <select
                  className="w-full p-3 rounded-lg border text-sm bg-background font-semibold"
                  value={targetPages}
                  onChange={(e) => setTargetPages(e.target.value)}
                >
                  <option value="5">5 Pages (~1,750 Words - Short Attachment)</option>
                  <option value="10">10 Pages (~3,500 Words - Standard IPT Report)</option>
                  <option value="15">15 Pages (~5,250 Words - Comprehensive Industrial Report)</option>
                  <option value="25">25+ Pages (~8,750 Words - Exhaustive Project Report)</option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isInitializing || isLoadingTemplate || !selectedUni}
              className="w-full h-12 text-sm font-bold gap-2 mt-2"
            >
              {isInitializing ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Initializing Institutional Blueprint...
                </>
              ) : (
                <>
                  Launch Guided Creator <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </form>
        </div>

        {/* RIGHT COLUMN: DYNAMIC RESOLVED TEMPLATE PREVIEW CARD */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 border rounded-2xl bg-white dark:bg-slate-900 shadow-sm sticky top-6 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Layers className="size-4 text-teal-600" /> Template Blueprint Preview
              </h3>
              {isLoadingTemplate && (
                <span className="text-xs text-teal-600 flex items-center gap-1 font-medium">
                  <Loader2 className="size-3.5 animate-spin" /> Resolving...
                </span>
              )}
            </div>

            {/* LOADING STATE */}
            {isLoadingTemplate && (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <Loader2 className="size-8 text-teal-600 animate-spin" />
                <p className="text-xs text-muted-foreground">
                  Resolving official guidelines for <strong>{selectedUni?.shortName}</strong>...
                </p>
              </div>
            )}

            {/* ERROR STATE */}
            {!isLoadingTemplate && templateError && (
              <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-800/80 bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 space-y-3">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="size-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold">Standard Template Fallback Active</h4>
                    <p className="text-xs text-amber-800/90 dark:text-amber-300/90 mt-1 leading-relaxed">
                      {templateError} The system will apply the National Higher Education Standard (OUT / TCU compliant).
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => resolveCurrentTemplate(selectedUni, selectedReportType)}
                  className="w-full text-xs gap-1.5 h-8 border-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40"
                >
                  <RotateCcw className="size-3.5" /> Retry Resolution
                </Button>
              </div>
            )}

            {/* RESOLVED TEMPLATE DETAILS */}
            {!isLoadingTemplate && resolvedTemplate && (
              <div className="space-y-5">
                {/* TEMPLATE IDENTITY CARD */}
                <div className="p-4 rounded-xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                      <BadgeCheck className="size-4 text-teal-600 dark:text-teal-400" />
                      {resolvedTemplate.template_name}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-teal-200 dark:bg-teal-900 text-teal-800 dark:text-teal-300">
                      {resolvedTemplate.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-teal-100 dark:border-teal-900/50">
                      <span className="text-[10px] text-muted-foreground block">Format Standard</span>
                      <strong className="text-foreground">{resolvedTemplate.version.file_format || "DOCX Standard"}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-teal-100 dark:border-teal-900/50">
                      <span className="text-[10px] text-muted-foreground block">Version</span>
                      <strong className="text-foreground">v{resolvedTemplate.version.version_number || "1.0.0"}</strong>
                    </div>
                  </div>
                </div>

                {/* REQUIRED CHAPTERS CHECKLIST */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center justify-between">
                    <span>Required Chapter Sequence</span>
                    <span className="text-[11px] font-semibold text-primary">
                      {resolvedTemplate.sections.length} Chapters
                    </span>
                  </h4>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {resolvedTemplate.sections.map((sec, idx) => (
                      <div
                        key={sec.id || idx}
                        className="p-3 rounded-xl border bg-slate-50/60 dark:bg-slate-800/40 border-border/80 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between font-bold text-foreground">
                          <span className="flex items-center gap-2">
                            <span className="size-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px]">
                              {idx + 1}
                            </span>
                            {sec.title}
                          </span>
                          {sec.is_required && (
                            <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                              Mandatory
                            </span>
                          )}
                        </div>
                        {sec.description && (
                          <p className="text-[11px] text-muted-foreground pl-7 leading-relaxed">
                            {sec.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* FORMATTING RULES BADGE */}
                {resolvedTemplate.formatting_rules && (
                  <div className="pt-3 border-t space-y-2 text-xs">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Institution Typography & Margins
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {resolvedTemplate.formatting_rules.font?.family && (
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-800 dark:text-slate-200">
                          Font: {resolvedTemplate.formatting_rules.font.family} ({resolvedTemplate.formatting_rules.font.body_size || 12}pt)
                        </span>
                      )}
                      {resolvedTemplate.formatting_rules.spacing?.line_spacing && (
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-800 dark:text-slate-200">
                          Spacing: {resolvedTemplate.formatting_rules.spacing.line_spacing}x
                        </span>
                      )}
                      {resolvedTemplate.formatting_rules.referencing?.style && (
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-800 dark:text-slate-200">
                          Ref: {resolvedTemplate.formatting_rules.referencing.style.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
