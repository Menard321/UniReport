/**
 * Types for the Professional Deterministic Calculation Engine in UniReportTZ.
 * Eliminates AI hallucination on mathematical and scientific calculations.
 */

export interface FormulaInputParam {
  key: string;
  label: string;
  value: number;
  unit: string;
  description?: string;
  min?: number;
  max?: number;
}

export interface IntermediateStep {
  stepNumber: number;
  description: string;
  equation: string;
  evaluated: string;
}

export interface CalculationResult {
  calculationId: string;
  module: string;
  formulaCode: string;
  formulaName: string;
  discipline: string;
  latexEquation: string;
  inputs: Record<string, FormulaInputParam>;
  assumptions: string[];
  intermediateSteps: IntermediateStep[];
  output: {
    value: number;
    formatted: string;
    unit: string;
    interpretation?: string;
  };
  validationStatus: "VALID" | "WARNING" | "INVALID_INPUT";
  validationMessage?: string;
  validationWarnings?: string[];
  professionalDisclaimer: string;
  timestamp: string;
}

export type FormulaCalculator = (inputs: Record<string, number>, assumptions?: string[]) => CalculationResult;
