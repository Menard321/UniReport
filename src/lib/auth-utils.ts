/**
 * Authentication and phone normalization helpers for UniReportTZ.
 * Handles Tanzanian mobile numbers (Vodacom, Tigo, Airtel, Halotel, TTCL)
 * as well as international formats.
 */

export function cleanPhoneInput(raw: string): string {
  return raw.trim().replace(/[\s\-\(\)\.]/g, "");
}

/**
 * Normalizes any Tanzanian or international phone number to canonical E.164 format (+255XXXXXXXXX)
 */
export function normalizePhone(rawPhone: string): string {
  const cleaned = cleanPhoneInput(rawPhone);
  if (!cleaned) return "";

  // If already starts with +255
  if (cleaned.startsWith("+255") && cleaned.length === 13) {
    return cleaned;
  }

  // If starts with 255 (without plus)
  if (cleaned.startsWith("255") && cleaned.length === 12) {
    return `+${cleaned}`;
  }

  // If starts with 0 (e.g., 0754123456 or 0655123456)
  if (cleaned.startsWith("0") && cleaned.length === 10) {
    return `+255${cleaned.substring(1)}`;
  }

  // If starts directly with 7 or 6 (9 digits, e.g. 754123456)
  if ((cleaned.startsWith("7") || cleaned.startsWith("6")) && cleaned.length === 9) {
    return `+255${cleaned}`;
  }

  // If starts with + (international number)
  if (cleaned.startsWith("+")) {
    return cleaned;
  }

  return cleaned;
}

/**
 * Returns multiple common representations of a phone number to ensure
 * reliable lookup in the database regardless of how the user typed it.
 */
export function getPhoneLookupVariants(raw: string): string[] {
  const cleaned = cleanPhoneInput(raw);
  if (!cleaned) return [];

  const normalized = normalizePhone(cleaned);
  const variants = new Set<string>();

  variants.add(raw.trim());
  variants.add(cleaned);
  if (normalized) {
    variants.add(normalized);
  }

  // If Tanzanian normalized format (+2557XXXXXXXX or +2556XXXXXXXX)
  if (normalized.startsWith("+255") && normalized.length === 13) {
    const local = "0" + normalized.substring(4); // e.g. 0712345678
    const withoutPlus = normalized.substring(1); // e.g. 255712345678
    const digitsOnly = normalized.substring(4); // e.g. 712345678
    variants.add(local);
    variants.add(withoutPlus);
    variants.add(digitsOnly);
  }

  return Array.from(variants).filter((v) => v.length >= 7);
}

/**
 * Validates whether an input looks like a valid phone number.
 */
export function isValidPhoneNumber(raw: string): boolean {
  const cleaned = cleanPhoneInput(raw);
  if (!cleaned) return false;
  
  // Basic validation: must contain 9 to 15 digits, optionally prefixed by +
  return /^\+?[0-9]{9,15}$/.test(cleaned);
}
