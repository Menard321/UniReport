import fs from "fs";
import path from "path";

export interface SystemPricing {
  singleDocumentExportTzs: number;
  semesterPassTzs: number;
  studentMonthlyTzs: number;
  proMonthlyTzs: number;
  institutionalYearlyTzs: number;
  currency: string;
  lastUpdatedBy?: string;
  lastUpdatedAt?: string;
}

export const DEFAULT_PRICING: SystemPricing = {
  singleDocumentExportTzs: 5000,
  semesterPassTzs: 15000,
  studentMonthlyTzs: 10000,
  proMonthlyTzs: 25000,
  institutionalYearlyTzs: 450000,
  currency: "TZS",
  lastUpdatedBy: "System Default",
  lastUpdatedAt: new Date().toISOString(),
};

const DATA_DIR = path.join(process.cwd(), "data");
const PRICING_FILE = path.join(DATA_DIR, "system-pricing.json");

let memoryCache: SystemPricing | null = null;

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Returns the active system pricing configuration.
 * Reads from disk cache or memory cache, falling back to defaults.
 */
export async function getSystemPricing(): Promise<SystemPricing> {
  if (memoryCache && process.env.NODE_ENV === "production") {
    return memoryCache;
  }

  try {
    ensureDataDir();
    if (fs.existsSync(PRICING_FILE)) {
      const raw = fs.readFileSync(PRICING_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      memoryCache = {
        singleDocumentExportTzs: Number(parsed.singleDocumentExportTzs) || DEFAULT_PRICING.singleDocumentExportTzs,
        semesterPassTzs: Number(parsed.semesterPassTzs) || DEFAULT_PRICING.semesterPassTzs,
        studentMonthlyTzs: Number(parsed.studentMonthlyTzs) || DEFAULT_PRICING.studentMonthlyTzs,
        proMonthlyTzs: Number(parsed.proMonthlyTzs) || DEFAULT_PRICING.proMonthlyTzs,
        institutionalYearlyTzs: Number(parsed.institutionalYearlyTzs) || DEFAULT_PRICING.institutionalYearlyTzs,
        currency: parsed.currency || "TZS",
        lastUpdatedBy: parsed.lastUpdatedBy || "Administrator",
        lastUpdatedAt: parsed.lastUpdatedAt || new Date().toISOString(),
      };
      return memoryCache;
    }
  } catch (err) {
    console.error("Error reading system pricing, using defaults:", err);
  }

  memoryCache = { ...DEFAULT_PRICING };
  return memoryCache;
}

/**
 * Updates system pricing, validates values, commits to disk, and refreshes cache.
 */
export async function updateSystemPricing(
  updates: Partial<SystemPricing>,
  adminIdentifier: string = "admin@unireport.tz"
): Promise<SystemPricing> {
  const current = await getSystemPricing();

  const nextPricing: SystemPricing = {
    ...current,
    singleDocumentExportTzs:
      updates.singleDocumentExportTzs !== undefined && !isNaN(Number(updates.singleDocumentExportTzs))
        ? Math.max(0, Math.round(Number(updates.singleDocumentExportTzs)))
        : current.singleDocumentExportTzs,
    semesterPassTzs:
      updates.semesterPassTzs !== undefined && !isNaN(Number(updates.semesterPassTzs))
        ? Math.max(0, Math.round(Number(updates.semesterPassTzs)))
        : current.semesterPassTzs,
    studentMonthlyTzs:
      updates.studentMonthlyTzs !== undefined && !isNaN(Number(updates.studentMonthlyTzs))
        ? Math.max(0, Math.round(Number(updates.studentMonthlyTzs)))
        : current.studentMonthlyTzs,
    proMonthlyTzs:
      updates.proMonthlyTzs !== undefined && !isNaN(Number(updates.proMonthlyTzs))
        ? Math.max(0, Math.round(Number(updates.proMonthlyTzs)))
        : current.proMonthlyTzs,
    institutionalYearlyTzs:
      updates.institutionalYearlyTzs !== undefined && !isNaN(Number(updates.institutionalYearlyTzs))
        ? Math.max(0, Math.round(Number(updates.institutionalYearlyTzs)))
        : current.institutionalYearlyTzs,
    currency: "TZS",
    lastUpdatedBy: adminIdentifier,
    lastUpdatedAt: new Date().toISOString(),
  };

  try {
    ensureDataDir();
    fs.writeFileSync(PRICING_FILE, JSON.stringify(nextPricing, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing system pricing file:", err);
  }

  memoryCache = nextPricing;
  return nextPricing;
}

/**
 * Resets pricing back to default values.
 */
export async function resetSystemPricingToDefaults(adminIdentifier: string = "admin@unireport.tz"): Promise<SystemPricing> {
  return updateSystemPricing(DEFAULT_PRICING, adminIdentifier);
}
