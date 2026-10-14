import { CalculationResult, FormulaCalculator } from "../../types";

export const beamBendingStress: FormulaCalculator = (inputs, assumptions = []) => {
  const M = inputs.moment || 25000; // N.m (Bending Moment)
  const y = inputs.distanceNeutralAxis || 0.15; // m (Distance from neutral axis)
  const I = inputs.momentOfInertia || 0.000125; // m^4 (Second moment of area)

  if (I <= 0) throw new Error("Moment of inertia (I) must be greater than zero.");

  const stressPa = (M * y) / I;
  const stressMPa = stressPa / 1e6;

  return {
    calculationId: `calc-stress-${Date.now()}`,
    module: "engineering/structural",
    formulaCode: "BEAM_BENDING_STRESS",
    formulaName: "Euler-Bernoulli Elastic Bending Stress",
    discipline: "engineering",
    latexEquation: "\\sigma = \\frac{M \\cdot y}{I}",
    inputs: {
      moment: { key: "moment", label: "Bending Moment (M)", value: M, unit: "N·m" },
      distanceNeutralAxis: { key: "distanceNeutralAxis", label: "Neutral Axis Distance (y)", value: y, unit: "m" },
      momentOfInertia: { key: "momentOfInertia", label: "Moment of Inertia (I)", value: I, unit: "m⁴" },
    },
    assumptions: [
      "Linear elastic isotropic material behavior (Hooke's Law applies).",
      "Cross-section remains plane before and after bending.",
      ...assumptions
    ],
    intermediateSteps: [
      { stepNumber: 1, description: "Calculate numerator (M * y)", equation: `${M} * ${y}`, evaluated: `${M * y} N·m²` },
      { stepNumber: 2, description: "Divide by second moment of area (I)", equation: `(${M * y}) / ${I}`, evaluated: `${stressPa.toFixed(2)} Pa` },
      { stepNumber: 3, description: "Convert to MegaPascals (MPa)", equation: `${stressPa.toFixed(2)} / 10^6`, evaluated: `${stressMPa.toFixed(3)} MPa` }
    ],
    output: {
      value: Number(stressMPa.toFixed(2)),
      formatted: `${stressMPa.toFixed(2)} MPa`,
      unit: "MPa",
      interpretation: stressMPa < 250 ? "Stress within yield strength for typical structural mild steel (fy = 250 MPa)." : "Stress exceeds typical mild steel yield; higher grade steel or enlarged cross-section required."
    },
    validationStatus: "VALID",
    professionalDisclaimer: "Conceptual academic design calculation. Requires formal review by an ERB-registered professional engineer.",
    timestamp: new Date().toISOString()
  };
};

export const beamDeflection: FormulaCalculator = (inputs, assumptions = []) => {
  const loadN = inputs.load || 15000; // Point load in Newtons
  const lengthM = inputs.length || 5.0; // Beam span in meters
  const E = inputs.youngsModulus || 200e9; // Young's Modulus in Pa (Steel = 200 GPa)
  const I = inputs.momentOfInertia || 0.000125; // m^4

  // Simply supported beam with center point load: delta = (P * L^3) / (48 * E * I)
  const numerator = loadN * Math.pow(lengthM, 3);
  const denominator = 48 * E * I;
  const deflectionM = numerator / denominator;
  const deflectionMm = deflectionM * 1000;
  const spanRatio = (lengthM * 1000) / deflectionMm;

  return {
    calculationId: `calc-deflect-${Date.now()}`,
    module: "engineering/structural",
    formulaCode: "BEAM_DEFLECTION",
    formulaName: "Simply Supported Beam Maximum Midspan Deflection",
    discipline: "engineering",
    latexEquation: "\\delta_{max} = \\frac{P \\cdot L^3}{48 \\cdot E \\cdot I}",
    inputs: {
      load: { key: "load", label: "Center Point Load (P)", value: loadN, unit: "N" },
      length: { key: "length", label: "Span Length (L)", value: lengthM, unit: "m" },
      youngsModulus: { key: "youngsModulus", label: "Elastic Modulus (E)", value: E, unit: "Pa" },
      momentOfInertia: { key: "momentOfInertia", label: "Second Moment of Area (I)", value: I, unit: "m⁴" }
    },
    assumptions: [
      "Simply supported boundary conditions at both ends.",
      "Self-weight of beam neglected in initial sizing.",
      ...assumptions
    ],
    intermediateSteps: [
      { stepNumber: 1, description: "Calculate P * L^3", equation: `${loadN} * (${lengthM})^3`, evaluated: `${numerator.toLocaleString()} N·m³` },
      { stepNumber: 2, description: "Calculate 48 * E * I", equation: `48 * ${(E/1e9)}e9 * ${I}`, evaluated: `${denominator.toExponential(4)}` },
      { stepNumber: 3, description: "Evaluate midspan deflection", equation: `${numerator} / ${denominator}`, evaluated: `${deflectionMm.toFixed(2)} mm` }
    ],
    output: {
      value: Number(deflectionMm.toFixed(2)),
      formatted: `${deflectionMm.toFixed(2)} mm (Span/δ = ${Math.round(spanRatio)})`,
      unit: "mm",
      interpretation: deflectionMm <= (lengthM * 1000) / 360 ? "Deflection satisfies standard Eurocode / BS deflection limit of Span/360." : "Deflection exceeds standard serviceability limit (Span/360); stiffer member required."
    },
    validationStatus: "VALID",
    professionalDisclaimer: "Structural serviceability check for academic coursework.",
    timestamp: new Date().toISOString()
  };
};

export const concreteMixProportions: FormulaCalculator = (inputs, assumptions = []) => {
  const volumeM3 = inputs.volume || 1.0; // Cubic meters of concrete
  const cementRatio = inputs.cementRatio || 1;
  const sandRatio = inputs.sandRatio || 2;
  const aggregateRatio = inputs.aggregateRatio || 4; // 1:2:4 Grade C20
  const waterCementRatio = inputs.waterCementRatio || 0.50;

  const totalParts = cementRatio + sandRatio + aggregateRatio;
  // Standard dry volume multiplier: 1.54 to 1.57 (account for voids)
  const dryVolume = volumeM3 * 1.54;
  const cementVol = (cementRatio / totalParts) * dryVolume;
  const cementKg = cementVol * 1440; // Density of cement = 1440 kg/m^3
  const cementBags50kg = cementKg / 50;

  const sandVol = (sandRatio / totalParts) * dryVolume;
  const sandTonnes = (sandVol * 1600) / 1000; // Density of sand = 1600 kg/m^3

  const aggregateVol = (aggregateRatio / totalParts) * dryVolume;
  const aggregateTonnes = (aggregateVol * 1500) / 1000; // Density of coarse agg = 1500 kg/m^3

  const waterLitres = cementKg * waterCementRatio;

  return {
    calculationId: `calc-concrete-${Date.now()}`,
    module: "engineering/structural",
    formulaCode: "CONCRETE_MIX_PROPORTIONS",
    formulaName: "Nominal Concrete Batching Mix Proportions (1:2:4)",
    discipline: "engineering",
    latexEquation: "V_{dry} = 1.54 \\cdot V_{wet}, \\quad W_{cement} = \\frac{Ratio_{c}}{\\sum Ratio} \\cdot V_{dry} \\cdot \\rho_c",
    inputs: {
      volume: { key: "volume", label: "Wet Concrete Volume", value: volumeM3, unit: "m³" },
      waterCementRatio: { key: "waterCementRatio", label: "Water-to-Cement Ratio (w/c)", value: waterCementRatio, unit: "ratio" }
    },
    assumptions: [
      "Standard Grade C20 nominal mix proportion (1 : 2 : 4).",
      "54% dry volume bulking allowance for inter-particle void filling.",
      "50 kg commercial cement bags (Twiga / Simba / Dangote Cement standard in Tanzania).",
      ...assumptions
    ],
    intermediateSteps: [
      { stepNumber: 1, description: "Calculate dry volume with 1.54 allowance", equation: `${volumeM3} * 1.54`, evaluated: `${dryVolume.toFixed(2)} m³` },
      { stepNumber: 2, description: "Calculate cement mass", equation: `(${cementRatio}/${totalParts}) * ${dryVolume.toFixed(2)} * 1440`, evaluated: `${cementKg.toFixed(1)} kg (${Math.ceil(cementBags50kg)} bags)` },
      { stepNumber: 3, description: "Calculate fine and coarse aggregate mass", equation: `Sand: ${sandVol.toFixed(2)}m³ (${sandTonnes.toFixed(2)}t); Agg: ${aggregateVol.toFixed(2)}m³ (${aggregateTonnes.toFixed(2)}t)`, evaluated: `${(sandTonnes + aggregateTonnes).toFixed(2)} tonnes aggregate` },
      { stepNumber: 4, description: "Calculate mixing water", equation: `${cementKg.toFixed(1)} * ${waterCementRatio}`, evaluated: `${waterLitres.toFixed(1)} Litres` }
    ],
    output: {
      value: Math.ceil(cementBags50kg),
      formatted: `${Math.ceil(cementBags50kg)} bags cement (50kg), ${sandTonnes.toFixed(2)}t sand, ${aggregateTonnes.toFixed(2)}t coarse aggregate, ${Math.round(waterLitres)}L water`,
      unit: "bags cement",
      interpretation: `For ${volumeM3} m³ of Grade C20 concrete, batch requires ${Math.ceil(cementBags50kg)} bags cement, ${sandTonnes.toFixed(2)}t sand, and ${aggregateTonnes.toFixed(2)}t gravel.`
    },
    validationStatus: "VALID",
    professionalDisclaimer: "Nominal batching guide. Structural load-bearing members require BS 8500 / EN 206 trial mix test cubes.",
    timestamp: new Date().toISOString()
  };
};
