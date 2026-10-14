import { jwtVerify, SignJWT } from "jose";
import crypto from "crypto";

const RESET_SECRET = process.env.SESSION_SECRET || "uni-report-tz-super-secret-key-2026";
const encodedKey = new TextEncoder().encode(RESET_SECRET);

export interface ChallengePayload {
  userId: string;
  identifier: string;
  codeHash: string;
  attempts: number;
}

export interface ResetAuthorizationPayload {
  userId: string;
  authorized: boolean;
}

/**
 * Generates a cryptographically random 6-digit OTP string.
 */
export function generateOtpCode(): string {
  const num = crypto.randomInt(100000, 999999);
  return num.toString();
}

/**
 * Creates an HMAC hash of the OTP code to store in the signed ticket.
 */
export function hashOtpCode(code: string): string {
  return crypto.createHmac("sha256", RESET_SECRET).update(code.trim()).digest("hex");
}

/**
 * Masks an email or phone number for safe display on the UI.
 * e.g., "scholar@udsm.ac.tz" -> "s***r@udsm.ac.tz"
 * e.g., "+255754123456" -> "+255 754 *** *56"
 */
export function maskIdentifier(identifier: string): string {
  const trimmed = identifier.trim();
  if (trimmed.includes("@")) {
    const [local, domain] = trimmed.split("@");
    if (local.length <= 2) {
      return `${local[0]}***@${domain}`;
    }
    return `${local[0]}***${local[local.length - 1]}@${domain}`;
  }

  // Phone number masking
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length >= 9) {
    const prefix = trimmed.startsWith("+255") ? "+255 " : trimmed.startsWith("0") ? "0" : "";
    const core = digits.startsWith("255") ? digits.substring(3) : digits.startsWith("0") ? digits.substring(1) : digits;
    const lead = core.substring(0, 2);
    const trail = core.substring(core.length - 2);
    return `${prefix}${lead}* *** **${trail}`;
  }

  return "***";
}

/**
 * Issues a signed challenge ticket containing the hashed OTP and user ID (expires in 15 minutes).
 */
export async function createChallengeTicket(userId: string, identifier: string, code: string): Promise<string> {
  const codeHash = hashOtpCode(code);
  const payload: ChallengePayload = {
    userId,
    identifier,
    codeHash,
    attempts: 0,
  };

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(encodedKey);
}

/**
 * Validates the submitted 6-digit code against the signed challenge ticket.
 * Returns a reset authorization token if valid, or null.
 */
export async function verifyChallengeCode(ticket: string, submittedCode: string): Promise<{ valid: boolean; error?: string; resetToken?: string }> {
  try {
    const { payload } = await jwtVerify(ticket, encodedKey, {
      algorithms: ["HS256"],
    });

    const challenge = payload as unknown as ChallengePayload;
    if (!challenge.userId || !challenge.codeHash) {
      return { valid: false, error: "Invalid verification ticket format." };
    }

    const expectedHash = challenge.codeHash;
    const submittedHash = hashOtpCode(submittedCode);

    if (expectedHash !== submittedHash) {
      return { valid: false, error: "The 6-digit verification code you entered is incorrect." };
    }

    // Generate a 10-minute reset token allowing the user to update their password
    const resetToken = await new SignJWT({ userId: challenge.userId, authorized: true })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(challenge.userId)
      .setIssuedAt()
      .setExpirationTime("10m")
      .sign(encodedKey);

    return { valid: true, resetToken };
  } catch (err: any) {
    if (err?.code === "ERR_JWT_EXPIRED") {
      return { valid: false, error: "Verification code has expired. Please request a new one." };
    }
    return { valid: false, error: "Verification token is invalid or expired." };
  }
}

/**
 * Verifies a reset token and returns the authorized userId if valid.
 */
export async function verifyResetToken(resetToken: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(resetToken, encodedKey, {
      algorithms: ["HS256"],
    });

    const authPayload = payload as unknown as ResetAuthorizationPayload;
    if (authPayload.authorized && authPayload.userId) {
      return authPayload.userId;
    }
    return null;
  } catch {
    return null;
  }
}
