import { CalculationResult, FormulaCalculator } from "../../types";

export const reynoldsNumber: FormulaCalculator = (inputs, assumptions = []) => {
  const density = inputs.density || 1000; // kg/m^3 (Water)
  const velocity = inputs.velocity || 1.5; // m/s
  const diameter = inputs.diameter || 0.05; // m (Pipe diameter)
  const viscosity = inputs.viscosity || 0.001; // Pa.s (Water at 20C)

  const reynolds = (density * velocity * diameter) / viscosity;
  const flowRegime = reynolds < 2000 
    ? "Laminar Flow (Re < 2,000)" 
    : (reynolds > 4000 ? "Turbulent Flow (Re > 4,000)" : "Transitional Flow (2,000 <= Re <= 4,000)");

  return {
    calculationId: `calc-fluid-${Date.now()}`,
    module: "engineering/fluids",
    formulaCode: "REYNOLDS_NUMBER",
    formulaName: "Reynolds Number Fluid Flow Regime",
    discipline: "engineering",
    latexEquation: "Re = \\frac{\\rho \\cdot v \\cdot D}{\\mu}",
    inputs: {
      density: { key: "density", label: "Fluid Density (ρ)", value: density, unit: "kg/m³" },
      velocity: { key: "velocity", label: "Flow Velocity (v)", value: velocity, unit: "m/s" },
      diameter: { key: "diameter", label: "Internal Pipe Diameter (D)", value: diameter, unit: "m" },
      viscosity: { key: "viscosity", label: "Dynamic Viscosity (μ)", value: viscosity, unit: "Pa·s" }
    },
    assumptions: [
      "Newtonian fluid behavior at uniform temperature.",
      "Fully developed pipe flow.",
      ...assumptions
    ],
    intermediateSteps: [
      { stepNumber: 1, description: "Calculate inertial forces (rho * v * D)", equation: `${density} * ${velocity} * ${diameter}`, evaluated: `${(density * velocity * diameter).toFixed(2)}` },
      { stepNumber: 2, description: "Divide by viscous forces (mu)", equation: `${(density * velocity * diameter).toFixed(2)} / ${viscosity}`, evaluated: `${reynolds.toFixed(0)}` }
    ],
    output: {
      value: Math.round(reynolds),
      formatted: `Re = ${Math.round(reynolds).toLocaleString()}`,
      unit: "dimensionless",
      interpretation: flowRegime
    },
    validationStatus: "VALID",
    professionalDisclaimer: "Fluid mechanics modeling for academic analysis.",
    timestamp: new Date().toISOString()
  };
};

export const darcyWeisbachHeadLoss: FormulaCalculator = (inputs, assumptions = []) => {
  const frictionFactor = inputs.frictionFactor || 0.02; // Darcy friction factor f
  const lengthM = inputs.length || 100; // Pipe length in meters
  const diameterM = inputs.diameter || 0.10; // Pipe diameter in meters (100mm)
  const velocityMs = inputs.velocity || 1.8; // Velocity in m/s
  const gravity = 9.81; // m/s^2

  // h_f = f * (L / D) * (v^2 / (2 * g))
  const headLossM = frictionFactor * (lengthM / diameterM) * (Math.pow(velocityMs, 2) / (2 * gravity));
  const pressureLossKpa = (1000 * gravity * headLossM) / 1000;

  return {
    calculationId: `calc-headloss-${Date.now()}`,
    module: "engineering/fluids",
    formulaCode: "DARCY_WEISBACH_HEAD_LOSS",
    formulaName: "Darcy-Weisbach Pipe Friction Head Loss",
    discipline: "engineering",
    latexEquation: "h_f = f \\cdot \\frac{L}{D} \\cdot \\frac{v^2}{2g}",
    inputs: {
      frictionFactor: { key: "frictionFactor", label: "Darcy Friction Factor (f)", value: frictionFactor, unit: "dimensionless" },
      length: { key: "length", label: "Pipe Length (L)", value: lengthM, unit: "m" },
      diameter: { key: "diameter", label: "Internal Diameter (D)", value: diameterM, unit: "m" },
      velocity: { key: "velocity", label: "Flow Velocity (v)", value: velocityMs, unit: "m/s" }
    },
    assumptions: [
      "Incompressible fluid (water, density = 1000 kg/m³).",
      "Minor losses from fittings and valves evaluated separately.",
      ...assumptions
    ],
    intermediateSteps: [
      { stepNumber: 1, description: "Calculate L / D geometric ratio", equation: `${lengthM} / ${diameterM}`, evaluated: `${(lengthM / diameterM).toFixed(1)}` },
      { stepNumber: 2, description: "Calculate velocity head v^2 / (2*g)", equation: `(${velocityMs})^2 / (2 * 9.81)`, evaluated: `${(Math.pow(velocityMs, 2) / (2 * gravity)).toFixed(3)} m` },
      { stepNumber: 3, description: "Multiply by friction factor f", equation: `${frictionFactor} * ${(lengthM / diameterM).toFixed(1)} * ${(Math.pow(velocityMs, 2) / (2 * gravity)).toFixed(3)}`, evaluated: `${headLossM.toFixed(2)} m` }
    ],
    output: {
      value: Number(headLossM.toFixed(2)),
      formatted: `${headLossM.toFixed(2)} m of water head (${pressureLossKpa.toFixed(1)} kPa loss)`,
      unit: "m",
      interpretation: `Frictional resistance results in ${headLossM.toFixed(2)} m head loss (${pressureLossKpa.toFixed(1)} kPa) across ${lengthM}m pipeline.`
    },
    validationStatus: "VALID",
    professionalDisclaimer: "Hydraulic pipe network design model for academic engineering assessment.",
    timestamp: new Date().toISOString()
  };
};
