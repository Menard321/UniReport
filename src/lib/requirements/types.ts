/**
 * Types for the Layered Requirements Resolution Engine in UniReportTZ.
 * Enforces strict precedence across University, Programme, Specialization,
 * Report Type, Assignment Instructions, and Professional standards.
 */

export type RequirementTier = 
  | "TIER_1_UNIVERSITY"     // Absolute authority: Cover page, margins, prelim pages, citation standard
  | "TIER_2_PROGRAMME"      // Programme guidelines & core learning outcomes
  | "TIER_3_SPECIALIZATION" // Subject-specific technical deliverables & methods
  | "TIER_4_REPORT_TYPE"    // Task-specific structure (FYP, Lab Report, Clinical Log, etc.)
  | "TIER_5_ASSIGNMENT"     // Lecturer rubric, specific student instructions & evidence
  | "TIER_6_AI_DEFAULT";    // Disciplinary scaffolding & bridging text

export interface RequirementProvenance {
  sourceTitle: string;
  issuingInstitution: string;
  sourceUrlOrRef?: string;
  verificationStatus: "VERIFIED" | "PENDING_VERIFICATION" | "STUDENT_SUPPLIED";
  verifiedDate?: string;
  reviewer?: string;
}

export interface SectionRequirement {
  id: string;
  chapterNumber?: number;
  title: string;
  description: string;
  wordBudget: number;
  mandatory: boolean;
  subHeadings: string[];
  requiredTables?: string[];
  requiredDiagrams?: string[];
  requiredCalculations?: string[];
  specialInstructions?: string[];
  governingTier: RequirementTier;
  provenance: RequirementProvenance;
}

export interface FormattingRules {
  fontFamily: string;
  fontSizePt: number;
  lineSpacing: number;
  marginInches: { top: number; right: number; bottom: number; left: number };
  citationStyle: "APA7" | "IEEE" | "HARVARD" | "CHICAGO" | "VANCOUVER" | "TURABIAN";
  preliminaryPagesOrder: string[];
  allowColorVisuals: boolean;
  governingTier: RequirementTier;
}

export interface DisciplinaryDirective {
  disciplineId: string;
  guidelines: string[];
  safetyWarnings?: string[];
  ethicalSafeguards?: string[];
  calculationPrerequisites?: string[];
  diagramPrerequisites?: string[];
}

export interface RequirementConflict {
  field: string;
  highTierRule: { tier: RequirementTier; value: any; source: string };
  lowTierRule: { tier: RequirementTier; value: any; source: string };
  resolution: string;
  requiresStudentConfirmation: boolean;
}

export interface CompiledReportSpecification {
  specificationId: string;
  timestamp: string;
  metadata: {
    universityId: string;
    universityName: string;
    programmeId: string;
    programmeName: string;
    specialization?: string;
    academicYear?: string;
    studentName?: string;
    regNumber?: string;
    reportTitle: string;
    reportType: string;
  };
  formatting: FormattingRules;
  disciplineDirectives: DisciplinaryDirective;
  sections: SectionRequirement[];
  totalTargetWords: number;
  requiredCalculations: string[];
  requiredDiagrams: string[];
  conflicts: RequirementConflict[];
  unresolvedQuestions: string[];
  provenanceList: RequirementProvenance[];
}
