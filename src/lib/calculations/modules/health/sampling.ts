import { CalculationResult, FormulaCalculator } from "../../types";

export const yamaneSampleSize: FormulaCalculator = (inputs, assumptions = []) => {
  const N = inputs.populationSize || 1000;
  const e = inputs.marginOfError || 0.05; // 5% margin of error

  if (N <= 0 || e <= 0) throw new Error("Population size and margin of error must be positive.");

  const denominator = 1 + N * Math.pow(e, 2);
  const sampleSize = N / denominator;
  const roundedSample = Math.ceil(sampleSize);

  return {
    calculationId: `calc-yamane-${Date.now()}`,
    module: "health/sampling",
    formulaCode: "YAMANE_SAMPLE_SIZE",
    formulaName: "Taro Yamane Finite Population Sample Size",
    discipline: "health-sciences",
    latexEquation: "n = \\frac{N}{1 + N \\cdot e^2}",
    inputs: {
      populationSize: { key: "populationSize", label: "Finite Population (N)", value: N, unit: "individuals" },
      marginOfError: { key: "marginOfError", label: "Margin of Error (e)", value: e, unit: "fraction (e.g. 0.05 for 5%)" }
    },
    assumptions: [
      "Confidence level assumed at 95% (standard p = 0.5 maximum variability).",
      "Finite population with homogeneous dispersion.",
      ...assumptions
    ],
    intermediateSteps: [
      { stepNumber: 1, description: "Calculate N * e^2", equation: `${N} * (${e})^2`, evaluated: `${(N * Math.pow(e, 2)).toFixed(4)}` },
      { stepNumber: 2, description: "Add 1 to denominator", equation: `1 + ${(N * Math.pow(e, 2)).toFixed(4)}`, evaluated: `${denominator.toFixed(4)}` },
      { stepNumber: 3, description: "Divide population by denominator", equation: `${N} / ${denominator.toFixed(4)}`, evaluated: `${sampleSize.toFixed(2)}` }
    ],
    output: {
      value: roundedSample,
      formatted: `${roundedSample} participants`,
      unit: "participants",
      interpretation: `For a population of ${N.toLocaleString()} with ±${(e * 100).toFixed(0)}% precision, a minimum sample size of ${roundedSample} respondents is mathematically required.`
    },
    validationStatus: "VALID",
    professionalDisclaimer: "Research methodology calculation. Consult institutional ethics committee (IRB/NIMR) on sampling feasibility.",
    timestamp: new Date().toISOString()
  };
};

export const kishLeslieFormula: FormulaCalculator = (inputs, assumptions = []) => {
  const Z = inputs.zScore || 1.96; // 95% confidence
  const p = inputs.prevalence || 0.50; // Expected proportion / prevalence (50% for maximum sample)
  const q = 1 - p;
  const d = inputs.precision || 0.05; // Absolute precision (5%)

  const numerator = Math.pow(Z, 2) * p * q;
  const denominator = Math.pow(d, 2);
  const sampleSize = numerator / denominator;
  const roundedSample = Math.ceil(sampleSize);

  return {
    calculationId: `calc-kish-${Date.now()}`,
    module: "health/sampling",
    formulaCode: "KISH_LESLIE_FORMULA",
    formulaName: "Kish-Leslie Single Proportion Cross-Sectional Sample Size",
    discipline: "health-sciences",
    latexEquation: "n = \\frac{Z^2 \\cdot p \\cdot (1 - p)}{d^2}",
    inputs: {
      zScore: { key: "zScore", label: "Z-score for Confidence Level (Z)", value: Z, unit: "dimensionless (1.96 for 95% CI)" },
      prevalence: { key: "prevalence", label: "Anticipated Proportion/Prevalence (p)", value: p, unit: "fraction" },
      precision: { key: "precision", label: "Absolute Precision / Margin of Error (d)", value: d, unit: "fraction" }
    },
    assumptions: [
      "Target population is large (infinite population assumption).",
      "Simple random sampling design.",
      ...assumptions
    ],
    intermediateSteps: [
      { stepNumber: 1, description: "Calculate Z^2 * p * (1 - p)", equation: `(${Z})^2 * ${p} * ${q.toFixed(2)}`, evaluated: `${numerator.toFixed(4)}` },
      { stepNumber: 2, description: "Calculate d^2", equation: `(${d})^2`, evaluated: `${denominator.toFixed(6)}` },
      { stepNumber: 3, description: "Compute sample n = numerator / denominator", equation: `${numerator.toFixed(4)} / ${denominator.toFixed(6)}`, evaluated: `${sampleSize.toFixed(2)}` }
    ],
    output: {
      value: roundedSample,
      formatted: `${roundedSample} participants`,
      unit: "participants",
      interpretation: `Cross-sectional health study with ${(p * 100).toFixed(0)}% estimated prevalence and ±${(d * 100).toFixed(1)}% precision requires a minimum sample of ${roundedSample} participants.`
    },
    validationStatus: "VALID",
    professionalDisclaimer: "Standard epidemiological sampling formula. Adjust for design effect if multi-stage cluster sampling is employed.",
    timestamp: new Date().toISOString()
  };
};
