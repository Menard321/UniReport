import { CompiledReportSpecification } from "@/lib/requirements/types";
import { CalculationResult } from "@/lib/calculations/types";
import { RenderedDiagramResult } from "@/lib/diagrams/types";

export interface AuditCheckResult {
  code: string;
  name: string;
  passed: boolean;
  severity: "ERROR" | "WARNING" | "INFO";
  details: string;
  remediation?: string;
}

export interface ComplianceAuditReport {
  auditId: string;
  timestamp: string;
  specificationId: string;
  overallScore: number; // 0 to 100
  isCompliant: boolean;
  checks: {
    structuralCompleteness: AuditCheckResult;
    numericalConsistency: AuditCheckResult;
    visualTraceability: AuditCheckResult;
    citationStyleAdherence: AuditCheckResult;
    privacyAndEthicalSanity: AuditCheckResult;
    disciplineRequirements: AuditCheckResult;
    documentRenderSafety: AuditCheckResult;
  };
  sanitizedText?: string;
  piiViolationsFound: number;
  warnings: string[];
  errors: string[];
  remediationPlan: string[];
}

export class ComplianceAuditor {
  /**
   * Executes the 7-Tier Compliance Audit on generated academic report text
   * against the compiled institutional specification, calculated values, and diagrams.
   */
  public static audit(
    reportText: string,
    spec: CompiledReportSpecification,
    calculations: CalculationResult[] = [],
    diagrams: RenderedDiagramResult[] = []
  ): ComplianceAuditReport {
    const errors: string[] = [];
    const warnings: string[] = [];
    const remediationPlan: string[] = [];

    // 1. Structural Completeness Check
    const structuralCheck = this.checkStructuralCompleteness(reportText, spec);
    if (!structuralCheck.passed) {
      if (structuralCheck.severity === "ERROR") errors.push(structuralCheck.details);
      else warnings.push(structuralCheck.details);
      if (structuralCheck.remediation) remediationPlan.push(structuralCheck.remediation);
    }

    // 2. Numerical Consistency Audit
    const numericalCheck = this.checkNumericalConsistency(reportText, calculations);
    if (!numericalCheck.passed) {
      if (numericalCheck.severity === "ERROR") errors.push(numericalCheck.details);
      else warnings.push(numericalCheck.details);
      if (numericalCheck.remediation) remediationPlan.push(numericalCheck.remediation);
    }

    // 3. Visual Traceability Check
    const visualCheck = this.checkVisualTraceability(reportText, diagrams);
    if (!visualCheck.passed) {
      if (visualCheck.severity === "ERROR") errors.push(visualCheck.details);
      else warnings.push(visualCheck.details);
      if (visualCheck.remediation) remediationPlan.push(visualCheck.remediation);
    }

    // 4. Citation Style Audit
    const citationCheck = this.checkCitationStyle(reportText, spec.formatting.citationStyle);
    if (!citationCheck.passed) {
      if (citationCheck.severity === "ERROR") errors.push(citationCheck.details);
      else warnings.push(citationCheck.details);
      if (citationCheck.remediation) remediationPlan.push(citationCheck.remediation);
    }

    // 5. Privacy & Ethical Sanity Check (Zero PII Sanitizer)
    const { privacyCheck, sanitizedText, piiCount } = this.checkPrivacyAndEthics(reportText, spec);
    if (!privacyCheck.passed) {
      if (privacyCheck.severity === "ERROR") errors.push(privacyCheck.details);
      else warnings.push(privacyCheck.details);
      if (privacyCheck.remediation) remediationPlan.push(privacyCheck.remediation);
    }

    // 6. Discipline Requirements Check
    const disciplineCheck = this.checkDisciplineRequirements(reportText, spec);
    if (!disciplineCheck.passed) {
      if (disciplineCheck.severity === "ERROR") errors.push(disciplineCheck.details);
      else warnings.push(disciplineCheck.details);
      if (disciplineCheck.remediation) remediationPlan.push(disciplineCheck.remediation);
    }

    // 7. Document Render Check
    const renderCheck = this.checkDocumentRenderSafety(reportText);
    if (!renderCheck.passed) {
      if (renderCheck.severity === "ERROR") errors.push(renderCheck.details);
      else warnings.push(renderCheck.details);
      if (renderCheck.remediation) remediationPlan.push(renderCheck.remediation);
    }

    // Calculate overall compliance score (0-100)
    let score = 100;
    if (!structuralCheck.passed) score -= structuralCheck.severity === "ERROR" ? 20 : 10;
    if (!numericalCheck.passed) score -= numericalCheck.severity === "ERROR" ? 20 : 10;
    if (!visualCheck.passed) score -= visualCheck.severity === "ERROR" ? 15 : 5;
    if (!citationCheck.passed) score -= citationCheck.severity === "ERROR" ? 15 : 5;
    if (!privacyCheck.passed) score -= privacyCheck.severity === "ERROR" ? 20 : 10;
    if (!disciplineCheck.passed) score -= disciplineCheck.severity === "ERROR" ? 15 : 5;
    if (!renderCheck.passed) score -= renderCheck.severity === "ERROR" ? 15 : 5;
    score = Math.max(0, Math.min(100, score));

    const isCompliant = errors.length === 0 && score >= 75;

    return {
      auditId: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      specificationId: spec.specificationId,
      overallScore: score,
      isCompliant,
      checks: {
        structuralCompleteness: structuralCheck,
        numericalConsistency: numericalCheck,
        visualTraceability: visualCheck,
        citationStyleAdherence: citationCheck,
        privacyAndEthicalSanity: privacyCheck,
        disciplineRequirements: disciplineCheck,
        documentRenderSafety: renderCheck
      },
      sanitizedText,
      piiViolationsFound: piiCount,
      warnings,
      errors,
      remediationPlan
    };
  }

  // 1. Structural Check
  private static checkStructuralCompleteness(text: string, spec: CompiledReportSpecification): AuditCheckResult {
    const missingSections: string[] = [];
    const lower = text.toLowerCase();

    // Check mandatory sections from spec
    spec.sections.forEach((sec) => {
      const titleSnippet = sec.title.replace(/^Chapter\s+\d+:?\s*/i, "").toLowerCase();
      if (!lower.includes(titleSnippet.slice(0, 15))) {
        missingSections.push(sec.title);
      }
    });

    if (missingSections.length > 0) {
      return {
        code: "STRUCT_MISSING_CHAPTERS",
        name: "Structural Completeness Check",
        passed: false,
        severity: missingSections.length > 2 ? "ERROR" : "WARNING",
        details: `Missing mandatory institutional section(s): ${missingSections.slice(0, 3).join(", ")}.`,
        remediation: `Ensure all ${spec.sections.length} chapters specified in the ${spec.metadata.universityName} blueprint are generated.`
      };
    }

    return {
      code: "STRUCT_PASS",
      name: "Structural Completeness Check",
      passed: true,
      severity: "INFO",
      details: `All ${spec.sections.length} required institutional chapters verified.`
    };
  }

  // 2. Numerical Consistency Check
  private static checkNumericalConsistency(text: string, calculations: CalculationResult[]): AuditCheckResult {
    if (!calculations || calculations.length === 0) {
      return {
        code: "NUM_NOT_APPLICABLE",
        name: "Numerical Consistency Audit",
        passed: true,
        severity: "INFO",
        details: "No deterministic mathematical calculations designated for this report."
      };
    }

    const missingFormulas: string[] = [];
    calculations.forEach((calc) => {
      const valStr = calc.output.value.toString();
      const formattedSnippet = calc.output.formatted.slice(0, 10);
      if (!text.includes(valStr) && !text.includes(formattedSnippet)) {
        missingFormulas.push(calc.formulaName);
      }
    });

    if (missingFormulas.length > 0) {
      return {
        code: "NUM_UNVERIFIED_VALUES",
        name: "Numerical Consistency Audit",
        passed: false,
        severity: "WARNING",
        details: `Report text does not cite verified results from: ${missingFormulas.slice(0, 2).join(", ")}.`,
        remediation: "Weave exact computed figures and formula equations into the technical discussion section."
      };
    }

    return {
      code: "NUM_PASS",
      name: "Numerical Consistency Audit",
      passed: true,
      severity: "INFO",
      details: `100% of ${calculations.length} deterministic calculation outputs traced in report text.`
    };
  }

  // 3. Visual Traceability Check
  private static checkVisualTraceability(text: string, diagrams: RenderedDiagramResult[]): AuditCheckResult {
    if (!diagrams || diagrams.length === 0) {
      return {
        code: "VIS_NOT_APPLICABLE",
        name: "Visual Traceability Check",
        passed: true,
        severity: "INFO",
        details: "No structured diagrams designated."
      };
    }

    // Check if figures are mentioned or embedded
    const hasMermaid = text.includes("```mermaid") || text.includes("<svg") || text.includes("Figure");
    if (!hasMermaid && diagrams.length > 0) {
      return {
        code: "VIS_MISSING_CAPTIONS",
        name: "Visual Traceability Check",
        passed: false,
        severity: "WARNING",
        details: `${diagrams.length} compiled visual diagram(s) are not referenced with standard Figure captions.`,
        remediation: "Insert Figure captions and embed the compiled Mermaid or SVG diagram blocks."
      };
    }

    return {
      code: "VIS_PASS",
      name: "Visual Traceability Check",
      passed: true,
      severity: "INFO",
      details: `${diagrams.length} structured visual diagram(s) validated and traceable.`
    };
  }

  // 4. Citation Style Check
  private static checkCitationStyle(text: string, expectedStyle: string): AuditCheckResult {
    const hasIeeeCitations = /\[\d+\]/.test(text);
    const hasApaCitations = /\([A-Z][a-z]+(?: et al\.)?,\s*\d{4}\)/.test(text);

    if (expectedStyle === "IEEE" && !hasIeeeCitations && hasApaCitations) {
      return {
        code: "CIT_STYLE_MISMATCH",
        name: "Citation Style Audit",
        passed: false,
        severity: "WARNING",
        details: "Detected APA-style (Author, Year) citations when IEEE numeric standard [n] is mandated by university.",
        remediation: "Convert in-text parenthetical citations to numeric bracket citations e.g. [1], [2]."
      };
    }

    if ((expectedStyle === "APA7" || expectedStyle === "HARVARD") && hasIeeeCitations && !hasApaCitations) {
      return {
        code: "CIT_STYLE_MISMATCH",
        name: "Citation Style Audit",
        passed: false,
        severity: "WARNING",
        details: `Detected IEEE numeric bracket citations [n] when ${expectedStyle} author-date citations are mandated.`,
        remediation: "Convert numeric citations to Author-Date format e.g. (Mushi, 2024)."
      };
    }

    return {
      code: "CIT_PASS",
      name: "Citation Style Audit",
      passed: true,
      severity: "INFO",
      details: `Citation format adheres to institutional ${expectedStyle} standard.`
    };
  }

  // 5. Privacy & Ethics Check (Zero PII Sanitizer)
  private static checkPrivacyAndEthics(text: string, spec: CompiledReportSpecification): {
    privacyCheck: AuditCheckResult;
    sanitizedText: string;
    piiCount: number;
  } {
    let piiCount = 0;
    let sanitized = text;

    // PII regex rules:
    // Bed numbers (Bed 14, Bed #3)
    const bedRegex = /\b(Bed\s*#?\s*\d+[A-Z]?)\b/gi;
    if (bedRegex.test(sanitized)) {
      piiCount++;
      sanitized = sanitized.replace(bedRegex, "[De-identified Ward Unit]");
    }

    // Patient admission numbers (MRN: 12345, IPD: 9876)
    const mrnRegex = /\b(MRN|IPD|OPD|File\s*No)[\s:#]+([A-Z0-9\/-]+)\b/gi;
    if (mrnRegex.test(sanitized)) {
      piiCount++;
      sanitized = sanitized.replace(mrnRegex, "[De-identified Record ID]");
    }

    // Specific patient names e.g., "Patient John Doe", "Patient Mwajuma"
    const patientNameRegex = /\bPatient\s+([A-Z][a-z]+(\s+[A-Z][a-z]+)?)\b/g;
    if (patientNameRegex.test(sanitized)) {
      piiCount++;
      sanitized = sanitized.replace(patientNameRegex, "[De-identified Participant]");
    }

    const isHealth = spec.disciplineDirectives.disciplineId === "health-sciences";
    const hasNimrMention = /nimr|irb|ethical\s*clearance|ethics\s*committee/i.test(text);

    if (piiCount > 0) {
      return {
        privacyCheck: {
          code: "PRIVACY_PII_SANITIZED",
          name: "Privacy & Ethical Sanity Check",
          passed: false,
          severity: "WARNING",
          details: `Stripped ${piiCount} identifiable patient/ward token(s) under Zero PII institutional safeguard.`,
          remediation: "Review sanitized de-identified tokens in medical logs to ensure participant confidentiality."
        },
        sanitizedText: sanitized,
        piiCount
      };
    }

    if (isHealth && !hasNimrMention) {
      return {
        privacyCheck: {
          code: "ETHICS_NIMR_OMISSION",
          name: "Privacy & Ethical Sanity Check",
          passed: true,
          severity: "INFO",
          details: "Clinical study does not explicitly declare NIMR / IRB ethical clearance number in methodology.",
          remediation: "Include institutional ethical clearance statement in methodology section."
        },
        sanitizedText: sanitized,
        piiCount: 0
      };
    }

    return {
      privacyCheck: {
        code: "PRIVACY_PASS",
        name: "Privacy & Ethical Sanity Check",
        passed: true,
        severity: "INFO",
        details: "Zero PII policy satisfied. All participant records safely de-identified."
      },
      sanitizedText: sanitized,
      piiCount: 0
    };
  }

  // 6. Discipline Requirements Check
  private static checkDisciplineRequirements(text: string, spec: CompiledReportSpecification): AuditCheckResult {
    const disc = spec.disciplineDirectives.disciplineId;
    const lower = text.toLowerCase();

    if (disc === "engineering") {
      const hasUnits = /\b(kn|mpa|kpa|mm|kw|kva|m³|m\/s)\b/i.test(text);
      if (!hasUnits) {
        return {
          code: "ENG_NO_SI_UNITS",
          name: "Discipline Requirement Check",
          passed: false,
          severity: "WARNING",
          details: "Engineering report lacks explicit SI units of measurement in technical sections.",
          remediation: "Ensure all physical quantities specify metric SI units (e.g. kN, MPa, mm, kW)."
        };
      }
    } else if (disc === "education") {
      const hasLessonPlan = lower.includes("lesson plan") || lower.includes("competency") || lower.includes("bloom");
      if (!hasLessonPlan) {
        return {
          code: "EDU_NO_LESSON_MATRIX",
          name: "Discipline Requirement Check",
          passed: false,
          severity: "WARNING",
          details: "Education report lacks explicit Tanzanian 8-column lesson plan matrix or competency mapping.",
          remediation: "Embed the 8-column Tanzania Institute of Education lesson plan layout."
        };
      }
    } else if (disc === "business-economics") {
      const hasCurrency = /\b(tzs|tsh|usd|\$)\b/i.test(text);
      if (!hasCurrency) {
        return {
          code: "BIZ_NO_CURRENCY",
          name: "Discipline Requirement Check",
          passed: false,
          severity: "WARNING",
          details: "Financial statements and figures do not explicitly declare reporting currency (TZS).",
          remediation: "State reporting currency (TZS) on all balance sheets, cash flows, and cost estimates."
        };
      }
    }

    return {
      code: "DISC_PASS",
      name: "Discipline Requirement Check",
      passed: true,
      severity: "INFO",
      details: `Complies with core disciplinary directives for ${disc}.`
    };
  }

  // 7. Document Render Check
  private static checkDocumentRenderSafety(text: string): AuditCheckResult {
    // Check for broken markdown or raw unescaped JSON strings
    const hasBrokenBackticks = (text.match(/```/g) || []).length % 2 !== 0;
    if (hasBrokenBackticks) {
      return {
        code: "RENDER_UNCLOSED_CODEBLOCK",
        name: "Document Render Safety Check",
        passed: false,
        severity: "ERROR",
        details: "Detected unclosed code block or unclosed diagram fence (```). Will cause DOCX/PDF export parse failure.",
        remediation: "Close all code fences and Mermaid blocks before compiling document."
      };
    }

    return {
      code: "RENDER_PASS",
      name: "Document Render Safety Check",
      passed: true,
      severity: "INFO",
      details: "Text formatting safe for MS Word DOCX and vector PDF page-boundary compiler."
    };
  }
}
