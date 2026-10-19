import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

// Ensure DATABASE_URL is loaded into process.env even if dev server started before .env was created
if (!process.env.DATABASE_URL) {
  try {
    const envPath = path.join(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          const eqIdx = trimmed.indexOf("=");
          if (eqIdx > 0) {
            const key = trimmed.substring(0, eqIdx).trim();
            let val = trimmed.substring(eqIdx + 1).trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.slice(1, -1);
            }
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn("[DB] Could not load .env file:", err);
  }
}

declare global {
  var prisma: (PrismaClient & Record<string, any>) | undefined;
}

const createPrismaClient = () => {
  return new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  }) as PrismaClient & Record<string, any>;
};

export const db: PrismaClient & Record<string, any> = global.prisma || createPrismaClient();
export const prisma = db;

if (process.env.NODE_ENV !== "production") {
  global.prisma = db;
}
