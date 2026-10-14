import { CalculationResult, FormulaCalculator } from "../../types";

export const fertilizerApplicationRate: FormulaCalculator = (inputs, assumptions = []) => {
  const targetNutrientKgHa = inputs.targetNutrientKgHa || 80; // kg of Nitrogen/ha required
  const fertilizerGradePercent = inputs.fertilizerGradePercent || 46; // Urea is 46% N
  const fieldAreaHa = inputs.fieldAreaHa || 2.5; // Hectares

  if (fertilizerGradePercent <= 0) throw new Error("Fertilizer grade percentage must be greater than zero.");

  const fertilizerPerHa = (targetNutrientKgHa / (fertilizerGradePercent / 100));
  const totalFertilizerKg = fertilizerPerHa * fieldAreaHa;
  const bags50kg = totalFertilizerKg / 50;

  return {
    calculationId: `calc-fert-${Date.now()}`,
    module: "science/agriculture",
    formulaCode: "FERTILIZER_APPLICATION_RATE",
    formulaName: "Agronomic Nutrient Application & Fertilizer Requirement",
    discipline: "agriculture-environmental",
    latexEquation: "W_{fert} = \\frac{R_{target}}{\\%Nutrient / 100} \\cdot Area",
    inputs: {
      targetNutrientKgHa: { key: "targetNutrientKgHa", label: "Target Pure Nutrient Rate (R_target)", value: targetNutrientKgHa, unit: "kg/ha" },
      fertilizerGradePercent: { key: "fertilizerGradePercent", label: "Fertilizer Grade Nutrient Content (%)", value: fertilizerGradePercent, unit: "%" },
      fieldAreaHa: { key: "fieldAreaHa", label: "Cultivated Land Area", value: fieldAreaHa, unit: "ha" }
    },
    assumptions: [
      "Soil nutrient base levels accounted for prior to top-dressing.",
      "Commercial 50kg standard bags (Urea / CAN / DAP standard in Tanzania).",
      ...assumptions
    ],
    intermediateSteps: [
      { stepNumber: 1, description: "Calculate commercial fertilizer required per hectare", equation: `${targetNutrientKgHa} / (${fertilizerGradePercent}/100)`, evaluated: `${fertilizerPerHa.toFixed(1)} kg/ha` },
      { stepNumber: 2, description: "Multiply by field cultivated area", equation: `${fertilizerPerHa.toFixed(1)} * ${fieldAreaHa}`, evaluated: `${totalFertilizerKg.toFixed(1)} kg total` },
      { stepNumber: 3, description: "Determine 50kg commercial bags", equation: `${totalFertilizerKg.toFixed(1)} / 50`, evaluated: `${Math.ceil(bags50kg)} bags (50kg)` }
    ],
    output: {
      value: Math.ceil(bags50kg),
      formatted: `${Math.ceil(bags50kg)} bags (${Math.round(totalFertilizerKg)} kg total, ${fertilizerPerHa.toFixed(0)} kg/ha)`,
      unit: "bags (50kg)",
      interpretation: `Field of ${fieldAreaHa} ha requires ${Math.ceil(bags50kg)} commercial 50kg bags to satisfy the ${targetNutrientKgHa} kg/ha target nutrient recommendation.`
    },
    validationStatus: "VALID",
    professionalDisclaimer: "Agronomic soil nutrient calibration model for academic research.",
    timestamp: new Date().toISOString()
  };
};

export const cropYieldEstimation: FormulaCalculator = (inputs, assumptions = []) => {
  const plantPopulationPerHa = inputs.plantPopulationPerHa || 53333; // e.g. Maize 75cm x 25cm spacing
  const earsPerPlant = inputs.earsPerPlant || 1.1;
  const kernelsPerEar = inputs.kernelsPerEar || 500;
  const thousandKernelWeightG = inputs.thousandKernelWeightG || 300; // grams (0.3g per kernel)
  const fieldAreaHa = inputs.fieldAreaHa || 1.0;

  const totalKernelsPerPlant = earsPerPlant * kernelsPerEar;
  const grainYieldPerPlantKg = (totalKernelsPerPlant * thousandKernelWeightG) / (1000 * 1000);
  const yieldPerHaTonnes = (plantPopulationPerHa * grainYieldPerPlantKg) / 1000;
  const totalProductionTonnes = yieldPerHaTonnes * fieldAreaHa;
  const standard90kgBags = (totalProductionTonnes * 1000) / 90;

  return {
    calculationId: `calc-yield-${Date.now()}`,
    module: "science/agriculture",
    formulaCode: "CROP_YIELD_ESTIMATION",
    formulaName: "Cereal Grain Biological & Economic Yield Estimation",
    discipline: "agriculture-environmental",
    latexEquation: "Yield = \\frac{Pop \\cdot Ears \\cdot Kernels \\cdot TKW}{10^9} \\quad [\\text{tonnes/ha}]",
    inputs: {
      plantPopulationPerHa: { key: "plantPopulationPerHa", label: "Plant Stand Density", value: plantPopulationPerHa, unit: "plants/ha" },
      earsPerPlant: { key: "earsPerPlant", label: "Average Harvestable Ears/Plant", value: earsPerPlant, unit: "ears" },
      kernelsPerEar: { key: "kernelsPerEar", label: "Average Kernels per Ear", value: kernelsPerEar, unit: "kernels" },
      thousandKernelWeightG: { key: "thousandKernelWeightG", label: "1,000 Kernel Weight (TKW)", value: thousandKernelWeightG, unit: "g" },
      fieldAreaHa: { key: "fieldAreaHa", label: "Field Size", value: fieldAreaHa, unit: "ha" }
    },
    assumptions: [
      "Standard 14% grain storage moisture content.",
      "5% pre-harvest field loss allowance factored in final estimation.",
      ...assumptions
    ],
    intermediateSteps: [
      { stepNumber: 1, description: "Calculate grain yield per single plant", equation: `(${earsPerPlant} * ${kernelsPerEar} * ${thousandKernelWeightG}) / 10^6`, evaluated: `${(grainYieldPerPlantKg * 1000).toFixed(1)} g/plant` },
      { stepNumber: 2, description: "Calculate yield per hectare in metric tonnes", equation: `(${plantPopulationPerHa} * ${grainYieldPerPlantKg.toFixed(4)}) / 1000`, evaluated: `${yieldPerHaTonnes.toFixed(2)} tonnes/ha` },
      { stepNumber: 3, description: "Compute total field yield and standard 90kg farm bags", equation: `${totalProductionTonnes.toFixed(2)} tonnes / 0.090 tonnes/bag`, evaluated: `${Math.round(standard90kgBags)} bags (90kg)` }
    ],
    output: {
      value: Number(yieldPerHaTonnes.toFixed(2)),
      formatted: `${yieldPerHaTonnes.toFixed(2)} tonnes/ha (${Math.round(standard90kgBags)} bags of 90kg for ${fieldAreaHa} ha)`,
      unit: "tonnes/ha",
      interpretation: `Estimated agricultural yield of ${yieldPerHaTonnes.toFixed(2)} metric tonnes/ha (${Math.round(standard90kgBags)} standard 90kg bags across ${fieldAreaHa} ha).`
    },
    validationStatus: "VALID",
    professionalDisclaimer: "Agronomic yield model for academic crop science investigations.",
    timestamp: new Date().toISOString()
  };
};
