/**
 * Types for the Configurable Discipline Registry in UniReportTZ.
 */

export type ProfileStatus = 
  | "VERIFIED_PRODUCTION" 
  | "BETA" 
  | "EXPERIMENTAL" 
  | "AWAITING_VERIFICATION";

export interface InputFieldDefinition {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "number" | "checkbox" | "file";
  placeholder?: string;
  description?: string;
  required: boolean;
  options?: Array<{ label: string; value: string }>;
  unit?: string;
  validationRegex?: string;
}

export interface CalculationModuleMeta {
  id: string;
  name: string;
  description: string;
  supportedFormulas: string[];
  unitStandard: "SI" | "METRIC" | "CURRENCY_TZS";
}

export interface DiagramTypeMeta {
  type: string;
  label: string;
  syntax: "MERMAID" | "SVG_CHART" | "MATRIX_TABLE";
  description: string;
}

export interface ValidationRuleMeta {
  code: string;
  name: string;
  severity: "ERROR" | "WARNING" | "INFO";
  description: string;
}

export interface DisciplineProfile {
  id: string;
  name: string;
  slug: string;
  category: "STEM" | "HEALTH" | "HUMANITIES" | "COMMERCE" | "EDUCATION";
  status: ProfileStatus;
  statusNotes?: string;
  supportedReportTypes: string[];
  requiredInputs: InputFieldDefinition[];
  calculationModules: CalculationModuleMeta[];
  diagramTypes: DiagramTypeMeta[];
  validationRules: ValidationRuleMeta[];
  aiDirectives: string[];
  safetyDisclaimers?: string[];
  provenance: {
    sourceStandard: string;
    verifiedBy: string;
    lastAuditDate: string;
  };
}
