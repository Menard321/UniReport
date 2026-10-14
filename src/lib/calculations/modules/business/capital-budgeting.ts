import { CalculationResult, FormulaCalculator } from "../../types";

export const netPresentValue: FormulaCalculator = (inputs, assumptions = []) => {
  const initialOutlay = inputs.initialOutlay || 10000000; // TZS
  const discountRate = inputs.discountRate || 0.12; // 12% Cost of capital
  const annualCashFlow = inputs.annualCashFlow || 3500000; // TZS per year
  const years = inputs.years || 4;

  let pvSum = 0;
  const steps: any[] = [];
  for (let t = 1; t <= years; t++) {
    const pv = annualCashFlow / Math.pow(1 + discountRate, t);
    pvSum += pv;
    steps.push({
      stepNumber: t,
      description: `Year ${t} Present Value: ${annualCashFlow.toLocaleString()} / (1 + ${discountRate})^${t}`,
      equation: `${annualCashFlow} / ${(Math.pow(1 + discountRate, t)).toFixed(4)}`,
      evaluated: `TZS ${Math.round(pv).toLocaleString()}`
    });
  }

  const npv = pvSum - initialOutlay;

  return {
    calculationId: `calc-npv-${Date.now()}`,
    module: "business/capital-budgeting",
    formulaCode: "NET_PRESENT_VALUE",
    formulaName: "Capital Budgeting Net Present Value (NPV)",
    discipline: "business-economics",
    latexEquation: "NPV = \\sum_{t=1}^{n} \\frac{CF_t}{(1 + r)^t} - C_0",
    inputs: {
      initialOutlay: { key: "initialOutlay", label: "Initial Investment Outlay (C₀)", value: initialOutlay, unit: "TZS" },
      discountRate: { key: "discountRate", label: "Discount Rate / Cost of Capital (r)", value: discountRate, unit: "fraction" },
      annualCashFlow: { key: "annualCashFlow", label: "Annual Net Inflow (CF)", value: annualCashFlow, unit: "TZS" },
      years: { key: "years", label: "Project Duration (n)", value: years, unit: "years" }
    },
    assumptions: [
      "Even annual cash flows received at end of each operating period.",
      "Discount rate reflects opportunity cost of capital in Tanzania.",
      ...assumptions
    ],
    intermediateSteps: [
      ...steps,
      {
        stepNumber: years + 1,
        description: "Deduct initial capital expenditure (C₀)",
        equation: `TZS ${Math.round(pvSum).toLocaleString()} - TZS ${initialOutlay.toLocaleString()}`,
        evaluated: `TZS ${Math.round(npv).toLocaleString()}`
      }
    ],
    output: {
      value: Math.round(npv),
      formatted: `TZS ${Math.round(npv).toLocaleString()}`,
      unit: "TZS",
      interpretation: npv > 0 ? "NPV is positive (> 0); project is financially viable and adds economic value." : "NPV is negative (< 0); project fails to meet the required hurdle rate."
    },
    validationStatus: "VALID",
    professionalDisclaimer: "Financial modeling calculation for business project analysis.",
    timestamp: new Date().toISOString()
  };
};

export const breakEvenPoint: FormulaCalculator = (inputs, assumptions = []) => {
  const fixedCosts = inputs.fixedCosts || 18000000; // TZS
  const unitSellingPrice = inputs.unitSellingPrice || 25000; // TZS per unit
  const unitVariableCost = inputs.unitVariableCost || 15000; // TZS per unit

  const contributionMargin = unitSellingPrice - unitVariableCost;
  if (contributionMargin <= 0) throw new Error("Selling price must exceed variable cost per unit.");

  const breakEvenUnits = fixedCosts / contributionMargin;
  const breakEvenRevenue = breakEvenUnits * unitSellingPrice;
  const cmRatio = (contributionMargin / unitSellingPrice) * 100;

  return {
    calculationId: `calc-bep-${Date.now()}`,
    module: "business/capital-budgeting",
    formulaCode: "BREAK_EVEN_POINT",
    formulaName: "Cost-Volume-Profit Break-Even Analysis",
    discipline: "business-economics",
    latexEquation: "Q_{BEP} = \\frac{FC}{P - VC}, \\quad CM\\% = \\frac{P - VC}{P} \\times 100\\%",
    inputs: {
      fixedCosts: { key: "fixedCosts", label: "Total Annual Fixed Costs (FC)", value: fixedCosts, unit: "TZS" },
      unitSellingPrice: { key: "unitSellingPrice", label: "Selling Price per Unit (P)", value: unitSellingPrice, unit: "TZS" },
      unitVariableCost: { key: "unitVariableCost", label: "Variable Cost per Unit (VC)", value: unitVariableCost, unit: "TZS" }
    },
    assumptions: [
      "Constant selling price and variable cost per unit across operational volume.",
      "All units produced are sold (no inventory accumulation).",
      ...assumptions
    ],
    intermediateSteps: [
      { stepNumber: 1, description: "Calculate unit contribution margin (P - VC)", equation: `${unitSellingPrice} - ${unitVariableCost}`, evaluated: `TZS ${contributionMargin.toLocaleString()} per unit` },
      { stepNumber: 2, description: "Compute Break-Even Volume = FC / Unit CM", equation: `${fixedCosts.toLocaleString()} / ${contributionMargin.toLocaleString()}`, evaluated: `${Math.ceil(breakEvenUnits).toLocaleString()} units` },
      { stepNumber: 3, description: "Compute Break-Even Revenue = Volume * Selling Price", equation: `${Math.ceil(breakEvenUnits)} * ${unitSellingPrice.toLocaleString()}`, evaluated: `TZS ${Math.round(breakEvenRevenue).toLocaleString()}` }
    ],
    output: {
      value: Math.ceil(breakEvenUnits),
      formatted: `${Math.ceil(breakEvenUnits).toLocaleString()} units (TZS ${Math.round(breakEvenRevenue).toLocaleString()} revenue, CM = ${cmRatio.toFixed(0)}%)`,
      unit: "units",
      interpretation: `Firm must sell at least ${Math.ceil(breakEvenUnits).toLocaleString()} units to fully cover operational fixed costs of TZS ${fixedCosts.toLocaleString()}.`
    },
    validationStatus: "VALID",
    professionalDisclaimer: "Cost-Volume-Profit estimation for managerial accounting and business plans.",
    timestamp: new Date().toISOString()
  };
};
