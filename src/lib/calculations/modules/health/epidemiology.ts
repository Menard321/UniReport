import { CalculationResult, FormulaCalculator } from "../../types";

export const oddsRatio: FormulaCalculator = (inputs, assumptions = []) => {
  const exposedCases = inputs.exposedCases || 45; // a
  const exposedControls = inputs.exposedControls || 20; // b
  const unexposedCases = inputs.unexposedCases || 15; // c
  const unexposedControls = inputs.unexposedControls || 60; // d

  if (exposedControls <= 0 || unexposedCases <= 0) throw new Error("Cell values must be greater than zero for Odds Ratio computation.");

  const or = (exposedCases * unexposedControls) / (exposedControls * unexposedCases);
  const seLnOr = Math.sqrt((1 / exposedCases) + (1 / exposedControls) + (1 / unexposedCases) + (1 / unexposedControls));
  const ciLower = Math.exp(Math.log(or) - 1.96 * seLnOr);
  const ciUpper = Math.exp(Math.log(or) + 1.96 * seLnOr);

  return {
    calculationId: `calc-or-${Date.now()}`,
    module: "health/epidemiology",
    formulaCode: "ODDS_RATIO",
    formulaName: "Epidemiological 2x2 Contingency Odds Ratio (OR)",
    discipline: "health-sciences",
    latexEquation: "OR = \\frac{a \\cdot d}{b \\cdot c}, \\quad 95\\%\\text{ CI} = \\exp(\\ln(OR) \\pm 1.96 \\cdot SE)",
    inputs: {
      exposedCases: { key: "exposedCases", label: "Exposed Cases (a)", value: exposedCases, unit: "patients" },
      exposedControls: { key: "exposedControls", label: "Exposed Controls (b)", value: exposedControls, unit: "patients" },
      unexposedCases: { key: "unexposedCases", label: "Unexposed Cases (c)", value: unexposedCases, unit: "patients" },
      unexposedControls: { key: "unexposedControls", label: "Unexposed Controls (d)", value: unexposedControls, unit: "patients" }
    },
    assumptions: [
      "Case-control study design with verified diagnosis criteria.",
      "Zero PII: all patient data de-identified and aggregated.",
      ...assumptions
    ],
    intermediateSteps: [
      { stepNumber: 1, description: "Calculate numerator (a * d)", equation: `${exposedCases} * ${unexposedControls}`, evaluated: `${exposedCases * unexposedControls}` },
      { stepNumber: 2, description: "Calculate denominator (b * c)", equation: `${exposedControls} * ${unexposedCases}`, evaluated: `${exposedControls * unexposedCases}` },
      { stepNumber: 3, description: "Compute Odds Ratio = (a * d) / (b * c)", equation: `${exposedCases * unexposedControls} / ${exposedControls * unexposedCases}`, evaluated: `${or.toFixed(2)}` },
      { stepNumber: 4, description: "Compute 95% Confidence Interval", equation: `exp(ln(${or.toFixed(2)}) ± 1.96 * ${seLnOr.toFixed(3)})`, evaluated: `[${ciLower.toFixed(2)} - ${ciUpper.toFixed(2)}]` }
    ],
    output: {
      value: Number(or.toFixed(2)),
      formatted: `OR = ${or.toFixed(2)} (95% CI: ${ciLower.toFixed(2)} - ${ciUpper.toFixed(2)})`,
      unit: "ratio",
      interpretation: or > 1.0 && ciLower > 1.0 
        ? `Statistically significant positive association (OR = ${or.toFixed(2)}); exposed individuals have higher odds of the clinical outcome.`
        : (or < 1.0 && ciUpper < 1.0 
          ? `Statistically significant protective factor (OR = ${or.toFixed(2)}).`
          : `No statistically significant association at 95% confidence level (CI spans 1.0).`)
    },
    validationStatus: "VALID",
    professionalDisclaimer: "Epidemiological bio-statistical output for academic health research.",
    timestamp: new Date().toISOString()
  };
};

export const relativeRisk: FormulaCalculator = (inputs, assumptions = []) => {
  const exposedEvents = inputs.exposedEvents || 30; // a
  const exposedTotal = inputs.exposedTotal || 100; // n1 = a + b
  const unexposedEvents = inputs.unexposedEvents || 10; // c
  const unexposedTotal = inputs.unexposedTotal || 100; // n2 = c + d

  const riskExposed = exposedEvents / exposedTotal;
  const riskUnexposed = unexposedEvents / unexposedTotal;
  const rr = riskExposed / riskUnexposed;

  return {
    calculationId: `calc-rr-${Date.now()}`,
    module: "health/epidemiology",
    formulaCode: "RELATIVE_RISK",
    formulaName: "Cohort Study Relative Risk / Risk Ratio (RR)",
    discipline: "health-sciences",
    latexEquation: "RR = \\frac{a / (a + b)}{c / (c + d)} = \\frac{R_{exposed}}{R_{unexposed}}",
    inputs: {
      exposedEvents: { key: "exposedEvents", label: "Events in Exposed (a)", value: exposedEvents, unit: "cases" },
      exposedTotal: { key: "exposedTotal", label: "Total Exposed Group (n₁)", value: exposedTotal, unit: "cohort" },
      unexposedEvents: { key: "unexposedEvents", label: "Events in Unexposed (c)", value: unexposedEvents, unit: "cases" },
      unexposedTotal: { key: "unexposedTotal", label: "Total Unexposed Group (n₂)", value: unexposedTotal, unit: "cohort" }
    },
    assumptions: [
      "Prospective or retrospective cohort study design with prospective follow-up.",
      ...assumptions
    ],
    intermediateSteps: [
      { stepNumber: 1, description: "Calculate incidence risk in exposed (a / n₁)", equation: `${exposedEvents} / ${exposedTotal}`, evaluated: `${(riskExposed * 100).toFixed(1)}%` },
      { stepNumber: 2, description: "Calculate incidence risk in unexposed (c / n₂)", equation: `${unexposedEvents} / ${unexposedTotal}`, evaluated: `${(riskUnexposed * 100).toFixed(1)}%` },
      { stepNumber: 3, description: "Compute Relative Risk = R_exp / R_unexp", equation: `${riskExposed.toFixed(3)} / ${riskUnexposed.toFixed(3)}`, evaluated: `${rr.toFixed(2)}` }
    ],
    output: {
      value: Number(rr.toFixed(2)),
      formatted: `RR = ${rr.toFixed(2)} (${(riskExposed * 100).toFixed(0)}% vs ${(riskUnexposed * 100).toFixed(0)}%)`,
      unit: "ratio",
      interpretation: rr > 1.0 
        ? `Exposed cohort has ${rr.toFixed(1)}x greater risk of developing the outcome compared to unexposed individuals.` 
        : `Exposed cohort has reduced or comparable risk.`
    },
    validationStatus: "VALID",
    professionalDisclaimer: "Cohort clinical analytics for medical and public health education.",
    timestamp: new Date().toISOString()
  };
};

export const bodyMassIndex: FormulaCalculator = (inputs, assumptions = []) => {
  const weightKg = inputs.weight || 70; // kg
  const heightM = inputs.height || 1.75; // meters

  if (heightM <= 0) throw new Error("Height must be greater than zero.");

  const bmi = weightKg / Math.pow(heightM, 2);
  let category = "Normal Weight (18.5 - 24.9 kg/m²)";
  if (bmi < 18.5) category = "Underweight (< 18.5 kg/m²)";
  else if (bmi >= 25 && bmi < 30) category = "Overweight (25.0 - 29.9 kg/m²)";
  else if (bmi >= 30) category = "Obese Class (>= 30.0 kg/m²)";

  return {
    calculationId: `calc-bmi-${Date.now()}`,
    module: "health/epidemiology",
    formulaCode: "BODY_MASS_INDEX",
    formulaName: "Quetelet Body Mass Index (BMI)",
    discipline: "health-sciences",
    latexEquation: "\\text{BMI} = \\frac{\\text{Weight (kg)}}{[\\text{Height (m)}]^2}",
    inputs: {
      weight: { key: "weight", label: "Patient Weight", value: weightKg, unit: "kg" },
      height: { key: "height", label: "Patient Stature/Height", value: heightM, unit: "m" }
    },
    assumptions: [
      "Adult anthropometric standard (WHO classification).",
      ...assumptions
    ],
    intermediateSteps: [
      { stepNumber: 1, description: "Square height in meters", equation: `(${heightM})^2`, evaluated: `${Math.pow(heightM, 2).toFixed(4)} m²` },
      { stepNumber: 2, description: "Divide weight by height squared", equation: `${weightKg} / ${Math.pow(heightM, 2).toFixed(4)}`, evaluated: `${bmi.toFixed(1)} kg/m²` }
    ],
    output: {
      value: Number(bmi.toFixed(1)),
      formatted: `${bmi.toFixed(1)} kg/m² (${category})`,
      unit: "kg/m²",
      interpretation: `Anthropometric index: ${category}.`
    },
    validationStatus: "VALID",
    professionalDisclaimer: "Clinical academic assessment. Not for direct patient triage without doctor evaluation.",
    timestamp: new Date().toISOString()
  };
};
