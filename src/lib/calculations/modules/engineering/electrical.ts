import { CalculationResult, FormulaCalculator } from "../../types";

export const ohmsLawPower: FormulaCalculator = (inputs, assumptions = []) => {
  const voltage = inputs.voltage || 230; // Volts
  const current = inputs.current || 10; // Amperes
  const powerWatts = voltage * current;
  const powerKw = powerWatts / 1000;
  const resistance = current > 0 ? voltage / current : 0;

  return {
    calculationId: `calc-elec-${Date.now()}`,
    module: "engineering/electrical",
    formulaCode: "OHMS_LAW_POWER",
    formulaName: "AC/DC Single-Phase Electrical Power & Impedance",
    discipline: "engineering",
    latexEquation: "P = V \\cdot I, \\quad R = \\frac{V}{I}",
    inputs: {
      voltage: { key: "voltage", label: "RMS Voltage (V)", value: voltage, unit: "V" },
      current: { key: "current", label: "Current (I)", value: current, unit: "A" }
    },
    assumptions: [
      "Unity power factor (cos φ = 1.0) assumed for purely resistive load.",
      "Standard Tanzanian single-phase nominal grid voltage (230V / 50Hz).",
      ...assumptions
    ],
    intermediateSteps: [
      { stepNumber: 1, description: "Compute active power P = V * I", equation: `${voltage} * ${current}`, evaluated: `${powerWatts.toFixed(1)} W` },
      { stepNumber: 2, description: "Compute load equivalent resistance R = V / I", equation: `${voltage} / ${current}`, evaluated: `${resistance.toFixed(2)} Ω` }
    ],
    output: {
      value: Number(powerKw.toFixed(2)),
      formatted: `${powerKw.toFixed(2)} kW (${powerWatts.toFixed(0)} W, ${resistance.toFixed(2)} Ω)`,
      unit: "kW",
      interpretation: `Electrical circuit dissipates ${powerKw.toFixed(2)} kW with circuit impedance of ${resistance.toFixed(2)} ohms.`
    },
    validationStatus: "VALID",
    professionalDisclaimer: "Electrical calculations are academic estimates. Installation requires compliance with TANESCO and IEE wiring regulations.",
    timestamp: new Date().toISOString()
  };
};

export const threePhasePower: FormulaCalculator = (inputs, assumptions = []) => {
  const lineVoltage = inputs.lineVoltage || 400; // Volts (Standard 400V 3-phase in Tanzania)
  const lineCurrent = inputs.lineCurrent || 25; // Amperes
  const powerFactor = inputs.powerFactor || 0.85; // cos phi

  const apparentPowerVa = Math.sqrt(3) * lineVoltage * lineCurrent;
  const activePowerWatts = apparentPowerVa * powerFactor;
  const activePowerKw = activePowerWatts / 1000;
  const reactivePowerKvar = (apparentPowerVa * Math.sin(Math.acos(powerFactor))) / 1000;

  return {
    calculationId: `calc-3phase-${Date.now()}`,
    module: "engineering/electrical",
    formulaCode: "THREE_PHASE_POWER",
    formulaName: "Three-Phase Balanced AC Active & Reactive Power",
    discipline: "engineering",
    latexEquation: "P = \\sqrt{3} \\cdot V_L \\cdot I_L \\cdot \\cos(\\phi)",
    inputs: {
      lineVoltage: { key: "lineVoltage", label: "Line-to-Line Voltage (V_L)", value: lineVoltage, unit: "V" },
      lineCurrent: { key: "lineCurrent", label: "Line Current (I_L)", value: lineCurrent, unit: "A" },
      powerFactor: { key: "powerFactor", label: "Operating Power Factor (cos φ)", value: powerFactor, unit: "dimensionless" }
    },
    assumptions: [
      "Balanced symmetrical three-phase load.",
      "Pure sinusoidal waveform at 50Hz nominal grid frequency.",
      ...assumptions
    ],
    intermediateSteps: [
      { stepNumber: 1, description: "Calculate apparent power S = sqrt(3) * V_L * I_L", equation: `1.732 * ${lineVoltage} * ${lineCurrent}`, evaluated: `${(apparentPowerVa / 1000).toFixed(2)} kVA` },
      { stepNumber: 2, description: "Calculate real power P = S * cos(phi)", equation: `${(apparentPowerVa / 1000).toFixed(2)} * ${powerFactor}`, evaluated: `${activePowerKw.toFixed(2)} kW` },
      { stepNumber: 3, description: "Calculate reactive power Q = sqrt(S^2 - P^2)", equation: `sqrt(${((apparentPowerVa/1000)**2).toFixed(1)} - ${(activePowerKw**2).toFixed(1)})`, evaluated: `${reactivePowerKvar.toFixed(2)} kVAR` }
    ],
    output: {
      value: Number(activePowerKw.toFixed(2)),
      formatted: `${activePowerKw.toFixed(2)} kW (${(apparentPowerVa/1000).toFixed(2)} kVA, ${reactivePowerKvar.toFixed(2)} kVAR)`,
      unit: "kW",
      interpretation: `Three-phase industrial load draws ${activePowerKw.toFixed(2)} kW active power at ${powerFactor} power factor.`
    },
    validationStatus: "VALID",
    professionalDisclaimer: "Design estimate. Industrial motor and switchgear sizing requires certified electrical engineering review.",
    timestamp: new Date().toISOString()
  };
};
