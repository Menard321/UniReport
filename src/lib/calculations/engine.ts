import { CalculationResult, FormulaCalculator } from "./types";
import { ohmsLawPower, threePhasePower } from "./modules/engineering/electrical";
import { beamBendingStress, beamDeflection, concreteMixProportions } from "./modules/engineering/structural";
import { reynoldsNumber, darcyWeisbachHeadLoss } from "./modules/engineering/fluids";
import { currentRatio, quickRatio, debtToEquity, grossProfitMargin } from "./modules/business/financial-ratios";
import { netPresentValue, breakEvenPoint } from "./modules/business/capital-budgeting";
import { yamaneSampleSize, kishLeslieFormula } from "./modules/health/sampling";
import { oddsRatio, relativeRisk, bodyMassIndex } from "./modules/health/epidemiology";
import { fertilizerApplicationRate, cropYieldEstimation } from "./modules/science/agriculture";
import { shannonWienerDiversity, waterQualityBodCod } from "./modules/science/environmental";
import { bigOEstimator, bandwidthSizing, dbStorageEstimator } from "./modules/computing/metrics";

export class CalculationEngine {
  private static registry: Map<string, FormulaCalculator> = new Map();

  static {
    // 1. Engineering Modules
    this.register("OHMS_LAW_POWER", ohmsLawPower);
    this.register("THREE_PHASE_POWER", threePhasePower);
    this.register("BEAM_BENDING_STRESS", beamBendingStress);
    this.register("BEAM_DEFLECTION", beamDeflection);
    this.register("CONCRETE_MIX_PROPORTIONS", concreteMixProportions);
    this.register("REYNOLDS_NUMBER", reynoldsNumber);
    this.register("DARCY_WEISBACH_HEAD_LOSS", darcyWeisbachHeadLoss);

    // 2. Business & Economics Modules
    this.register("CURRENT_RATIO", currentRatio);
    this.register("QUICK_RATIO", quickRatio);
    this.register("DEBT_TO_EQUITY", debtToEquity);
    this.register("GROSS_PROFIT_MARGIN", grossProfitMargin);
    this.register("NET_PRESENT_VALUE", netPresentValue);
    this.register("BREAK_EVEN_POINT", breakEvenPoint);

    // 3. Health Sciences & Epidemiology Modules
    this.register("YAMANE_SAMPLE_SIZE", yamaneSampleSize);
    this.register("KISH_LESLIE_FORMULA", kishLeslieFormula);
    this.register("ODDS_RATIO", oddsRatio);
    this.register("RELATIVE_RISK", relativeRisk);
    this.register("BODY_MASS_INDEX", bodyMassIndex);

    // 4. Agriculture & Environmental Science Modules
    this.register("FERTILIZER_APPLICATION_RATE", fertilizerApplicationRate);
    this.register("CROP_YIELD_ESTIMATION", cropYieldEstimation);
    this.register("SHANNON_WIENER_DIVERSITY", shannonWienerDiversity);
    this.register("WATER_QUALITY_BOD_COD", waterQualityBodCod);

    // 5. Computing & IT Modules
    this.register("BIG_O_ESTIMATOR", bigOEstimator);
    this.register("BANDWIDTH_SIZING", bandwidthSizing);
    this.register("DB_STORAGE_ESTIMATOR", dbStorageEstimator);
  }

  public static register(formulaCode: string, calculator: FormulaCalculator) {
    this.registry.set(formulaCode, calculator);
  }

  public static calculate(formulaCode: string, inputs: Record<string, number>, assumptions?: string[]): CalculationResult {
    const calc = this.registry.get(formulaCode);
    if (!calc) {
      throw new Error(`Formula code "${formulaCode}" is not registered in the calculation engine.`);
    }
    return calc(inputs, assumptions);
  }

  public static getSupportedFormulas(): string[] {
    return Array.from(this.registry.keys());
  }

  public static hasFormula(formulaCode: string): boolean {
    return this.registry.has(formulaCode);
  }
}
