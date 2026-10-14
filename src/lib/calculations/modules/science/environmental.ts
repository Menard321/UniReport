import { CalculationResult, FormulaCalculator } from "../../types";

export const shannonWienerDiversity: FormulaCalculator = (inputs, assumptions = []) => {
  // Array of counts or species abundance represented via proxy inputs
  const speciesCount = inputs.speciesCount || 5;
  const totalIndividuals = inputs.totalIndividuals || 120;
  // Uniform or default distribution calculation
  // H' = - sum(p_i * ln(p_i))
  const avgProportion = 1 / speciesCount;
  const H = -1 * speciesCount * (avgProportion * Math.log(avgProportion));
  const Hmax = Math.log(speciesCount);
  const evenness = Hmax > 0 ? H / Hmax : 1.0;

  return {
    calculationId: `calc-shannon-${Date.now()}`,
    module: "science/environmental",
    formulaCode: "SHANNON_WIENER_DIVERSITY",
    formulaName: "Shannon-Wiener Biodiversity Index (H') & Pielou's Evenness (J')",
    discipline: "agriculture-environmental",
    latexEquation: "H' = -\\sum_{i=1}^{S} p_i \\ln(p_i), \\quad J' = \\frac{H'}{\\ln(S)}",
    inputs: {
      speciesCount: { key: "speciesCount", label: "Species Richness (S)", value: speciesCount, unit: "taxa" },
      totalIndividuals: { key: "totalIndividuals", label: "Total Sampled Individuals (N)", value: totalIndividuals, unit: "specimens" }
    },
    assumptions: [
      "Random quadrant or transect sampling protocol.",
      "All distinct species in sample accurately enumerated.",
      ...assumptions
    ],
    intermediateSteps: [
      { stepNumber: 1, description: "Calculate mean relative abundance p_i = n_i / N", equation: `1 / ${speciesCount}`, evaluated: `${avgProportion.toFixed(3)}` },
      { stepNumber: 2, description: "Calculate Shannon Index H' = - sum(p_i * ln(p_i))", equation: `-${speciesCount} * (${avgProportion.toFixed(3)} * ln(${avgProportion.toFixed(3)}))`, evaluated: `${H.toFixed(3)}` },
      { stepNumber: 3, description: "Calculate Pielou Evenness J' = H' / ln(S)", equation: `${H.toFixed(3)} / ln(${speciesCount})`, evaluated: `${evenness.toFixed(3)}` }
    ],
    output: {
      value: Number(H.toFixed(2)),
      formatted: `H' = ${H.toFixed(2)} (Evenness J' = ${evenness.toFixed(2)}, Richness S = ${speciesCount})`,
      unit: "index",
      interpretation: H >= 2.0 
        ? "High ecological biodiversity and structural habitat complexity (H' >= 2.0)." 
        : "Moderate to low diversity; community structure concentrated in fewer taxa."
    },
    validationStatus: "VALID",
    professionalDisclaimer: "Ecological ecological community indexing for environmental science coursework.",
    timestamp: new Date().toISOString()
  };
};

export const waterQualityBodCod: FormulaCalculator = (inputs, assumptions = []) => {
  const bod5 = inputs.bod5 || 180; // mg/L Biological Oxygen Demand
  const cod = inputs.cod || 380; // mg/L Chemical Oxygen Demand

  if (cod <= 0) throw new Error("COD must be greater than zero.");

  const ratio = bod5 / cod;
  let biodegradability = "High Biodegradability (BOD5/COD > 0.45) - Suitable for conventional biological treatment.";
  if (ratio < 0.2) {
    biodegradability = "Poor Biodegradability (BOD5/COD < 0.20) - High toxic or recalcitrant industrial compounds; advanced chemical oxidation required.";
  } else if (ratio < 0.45) {
    biodegradability = "Moderate Biodegradability (0.20 <= BOD5/COD <= 0.45) - Acclimated biological degradation required.";
  }

  return {
    calculationId: `calc-bodcod-${Date.now()}`,
    module: "science/environmental",
    formulaCode: "WATER_QUALITY_BOD_COD",
    formulaName: "Wastewater Biodegradability Index (BOD₅ / COD Ratio)",
    discipline: "agriculture-environmental",
    latexEquation: "\\text{Biodegradability Ratio} = \\frac{\\text{BOD}_5}{\\text{COD}}",
    inputs: {
      bod5: { key: "bod5", label: "5-Day Biochemical Oxygen Demand (BOD₅)", value: bod5, unit: "mg/L" },
      cod: { key: "cod", label: "Chemical Oxygen Demand (COD)", value: cod, unit: "mg/L" }
    },
    assumptions: [
      "Standard 5-day incubation at 20°C (Standard Methods 5210 B).",
      "Dichromate reflux digestion for COD (Standard Methods 5220 C).",
      ...assumptions
    ],
    intermediateSteps: [
      { stepNumber: 1, description: "Divide BOD5 by COD concentration", equation: `${bod5} / ${cod}`, evaluated: `${ratio.toFixed(2)}` }
    ],
    output: {
      value: Number(ratio.toFixed(2)),
      formatted: `BOD₅/COD = ${ratio.toFixed(2)}`,
      unit: "ratio",
      interpretation: biodegradability
    },
    validationStatus: "VALID",
    professionalDisclaimer: "Environmental water quality parameter testing for engineering analysis.",
    timestamp: new Date().toISOString()
  };
};
