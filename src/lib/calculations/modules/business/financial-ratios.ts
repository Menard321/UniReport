import { CalculationResult, FormulaCalculator } from "../../types";

export const currentRatio: FormulaCalculator = (inputs, assumptions = []) => {
  const currentAssets = inputs.currentAssets || 45000000;
  const currentLiabilities = inputs.currentLiabilities || 25000000;

  if (currentLiabilities <= 0) throw new Error("Current liabilities must be greater than zero.");

  const ratio = currentAssets / currentLiabilities;

  return {
    calculationId: `calc-cr-${Date.now()}`,
    module: "business/financial-ratios",
    formulaCode: "CURRENT_RATIO",
    formulaName: "Working Capital Current Ratio",
    discipline: "business-economics",
    latexEquation: "\\text{Current Ratio} = \\frac{\\text{Current Assets}}{\\text{Current Liabilities}}",
    inputs: {
      currentAssets: { key: "currentAssets", label: "Current Assets", value: currentAssets, unit: "TZS" },
      currentLiabilities: { key: "currentLiabilities", label: "Current Liabilities", value: currentLiabilities, unit: "TZS" }
    },
    assumptions: [
      "Assets realizable within 12 months.",
      "Liabilities due within current operating cycle.",
      ...assumptions
    ],
    intermediateSteps: [
      { stepNumber: 1, description: "Divide Current Assets by Current Liabilities", equation: `${currentAssets.toLocaleString()} / ${currentLiabilities.toLocaleString()}`, evaluated: `${ratio.toFixed(2)}x` }
    ],
    output: {
      value: Number(ratio.toFixed(2)),
      formatted: `${ratio.toFixed(2)} : 1`,
      unit: "ratio",
      interpretation: ratio >= 1.5 ? "Healthy short-term liquidity buffer (>= 1.5:1)." : "Constrained working capital liquidity (< 1.5:1); entity may face short-term debt servicing pressure."
    },
    validationStatus: "VALID",
    professionalDisclaimer: "Ratio analysis based on reported balance sheet entries.",
    timestamp: new Date().toISOString()
  };
};

export const quickRatio: FormulaCalculator = (inputs, assumptions = []) => {
  const currentAssets = inputs.currentAssets || 45000000;
  const inventory = inputs.inventory || 15000000;
  const currentLiabilities = inputs.currentLiabilities || 25000000;

  if (currentLiabilities <= 0) throw new Error("Current liabilities must be greater than zero.");

  const quickAssets = currentAssets - inventory;
  const ratio = quickAssets / currentLiabilities;

  return {
    calculationId: `calc-qr-${Date.now()}`,
    module: "business/financial-ratios",
    formulaCode: "QUICK_RATIO",
    formulaName: "Acid-Test Quick Ratio",
    discipline: "business-economics",
    latexEquation: "\\text{Quick Ratio} = \\frac{\\text{Current Assets} - \\text{Inventory}}{\\text{Current Liabilities}}",
    inputs: {
      currentAssets: { key: "currentAssets", label: "Current Assets", value: currentAssets, unit: "TZS" },
      inventory: { key: "inventory", label: "Inventory / Stock", value: inventory, unit: "TZS" },
      currentLiabilities: { key: "currentLiabilities", label: "Current Liabilities", value: currentLiabilities, unit: "TZS" }
    },
    assumptions: [
      "Inventory excluded due to longer liquidation cycle.",
      "Prepaid expenses assumed negligible.",
      ...assumptions
    ],
    intermediateSteps: [
      { stepNumber: 1, description: "Compute Quick Assets = Current Assets - Inventory", equation: `${currentAssets.toLocaleString()} - ${inventory.toLocaleString()}`, evaluated: `TZS ${quickAssets.toLocaleString()}` },
      { stepNumber: 2, description: "Divide Quick Assets by Current Liabilities", equation: `${quickAssets.toLocaleString()} / ${currentLiabilities.toLocaleString()}`, evaluated: `${ratio.toFixed(2)}x` }
    ],
    output: {
      value: Number(ratio.toFixed(2)),
      formatted: `${ratio.toFixed(2)} : 1`,
      unit: "ratio",
      interpretation: ratio >= 1.0 ? "Strong liquid solvency without relying on inventory sales (>= 1.0:1)." : "Sub-optimal quick liquidity (< 1.0:1); reliance on slow inventory turnover."
    },
    validationStatus: "VALID",
    professionalDisclaimer: "Solvency indicator for corporate accounting assessment.",
    timestamp: new Date().toISOString()
  };
};

export const debtToEquity: FormulaCalculator = (inputs, assumptions = []) => {
  const totalDebt = inputs.totalDebt || 60000000;
  const totalEquity = inputs.totalEquity || 40000000;

  if (totalEquity <= 0) throw new Error("Total equity must be greater than zero.");

  const ratio = totalDebt / totalEquity;

  return {
    calculationId: `calc-dte-${Date.now()}`,
    module: "business/financial-ratios",
    formulaCode: "DEBT_TO_EQUITY",
    formulaName: "Solvency Debt-to-Equity Ratio",
    discipline: "business-economics",
    latexEquation: "\\text{Debt-to-Equity} = \\frac{\\text{Total Debt}}{\\text{Shareholders' Equity}}",
    inputs: {
      totalDebt: { key: "totalDebt", label: "Total Debt (Short + Long Term)", value: totalDebt, unit: "TZS" },
      totalEquity: { key: "totalEquity", label: "Shareholders' Equity", value: totalEquity, unit: "TZS" }
    },
    assumptions: [
      "Book value of debt and equity used.",
      ...assumptions
    ],
    intermediateSteps: [
      { stepNumber: 1, description: "Divide Total Debt by Shareholders' Equity", equation: `${totalDebt.toLocaleString()} / ${totalEquity.toLocaleString()}`, evaluated: `${ratio.toFixed(2)}x` }
    ],
    output: {
      value: Number(ratio.toFixed(2)),
      formatted: `${ratio.toFixed(2)}x (${(ratio * 100).toFixed(0)}%)`,
      unit: "ratio",
      interpretation: ratio <= 1.5 ? "Prudent financial leverage structure (<= 1.5x)." : "High financial leverage (> 1.5x); entity carries substantial debt-servicing exposure."
    },
    validationStatus: "VALID",
    professionalDisclaimer: "Capital structure assessment for corporate finance coursework.",
    timestamp: new Date().toISOString()
  };
};

export const grossProfitMargin: FormulaCalculator = (inputs, assumptions = []) => {
  const revenue = inputs.revenue || 120000000;
  const costOfGoodsSold = inputs.costOfGoodsSold || 75000000;

  if (revenue <= 0) throw new Error("Revenue must be greater than zero.");

  const grossProfit = revenue - costOfGoodsSold;
  const marginPercentage = (grossProfit / revenue) * 100;

  return {
    calculationId: `calc-gpm-${Date.now()}`,
    module: "business/financial-ratios",
    formulaCode: "GROSS_PROFIT_MARGIN",
    formulaName: "Profitability Gross Profit Margin",
    discipline: "business-economics",
    latexEquation: "\\text{Gross Margin} = \\frac{\\text{Revenue} - \\text{COGS}}{\\text{Revenue}} \\times 100\\%",
    inputs: {
      revenue: { key: "revenue", label: "Total Sales Revenue", value: revenue, unit: "TZS" },
      costOfGoodsSold: { key: "costOfGoodsSold", label: "Cost of Goods Sold (COGS)", value: costOfGoodsSold, unit: "TZS" }
    },
    assumptions: [
      "COGS incorporates direct materials, direct labor, and production overhead.",
      ...assumptions
    ],
    intermediateSteps: [
      { stepNumber: 1, description: "Compute Gross Profit = Revenue - COGS", equation: `${revenue.toLocaleString()} - ${costOfGoodsSold.toLocaleString()}`, evaluated: `TZS ${grossProfit.toLocaleString()}` },
      { stepNumber: 2, description: "Divide Gross Profit by Revenue and convert to %", equation: `(${grossProfit.toLocaleString()} / ${revenue.toLocaleString()}) * 100`, evaluated: `${marginPercentage.toFixed(1)}%` }
    ],
    output: {
      value: Number(marginPercentage.toFixed(2)),
      formatted: `${marginPercentage.toFixed(1)}% (TZS ${grossProfit.toLocaleString()})`,
      unit: "%",
      interpretation: `Business retains ${marginPercentage.toFixed(1)}% of sales revenue after covering direct production costs.`
    },
    validationStatus: "VALID",
    professionalDisclaimer: "Income statement analysis for business academic reporting.",
    timestamp: new Date().toISOString()
  };
};
