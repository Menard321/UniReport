import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

function sanitizeDatabaseUrl(rawUrl?: string): string | undefined {
  if (!rawUrl) return rawUrl;
  try {
    // If password contains unencoded '@', e.g. postgresql://user:@password@host:port/db
    const match = rawUrl.match(/^(postgresql:\/\/[^:]+:)(.*)(@[^@\/]+:[0-9]+\/.*)$/);
    if (match) {
      const [, prefix, password, suffix] = match;
      if (!password.includes("%")) {
        return `${prefix}${encodeURIComponent(password)}${suffix}`;
      }
    }
  } catch {
    // Return original if parsing fails
  }
  return rawUrl;
}

function getDatabaseUrl(): string | undefined {
  let url = process.env.DATABASE_URL;
  if (!url) {
    try {
      const envPath = path.join(process.cwd(), ".env");
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, "utf-8");
        for (const line of content.split(/\r?\n/)) {
          const trimmed = line.trim();
          if (trimmed.startsWith("DATABASE_URL=")) {
            let val = trimmed.substring("DATABASE_URL=".length).trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.slice(1, -1);
            }
            url = val;
            process.env.DATABASE_URL = val;
            break;
          }
        }
      }
    } catch (err) {
      console.warn("[DB] Could not load .env file:", err);
    }
  }
  return sanitizeDatabaseUrl(url);
}

declare global {
  var prisma: (PrismaClient & Record<string, any>) | undefined;
}

const createPrismaClient = () => {
  const url = getDatabaseUrl();
  return new PrismaClient({
    datasourceUrl: url,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  }) as PrismaClient & Record<string, any>;
};

export const db: PrismaClient & Record<string, any> = global.prisma || createPrismaClient();
export const prisma = db;

if (process.env.NODE_ENV !== "production") {
  global.prisma = db;
}
