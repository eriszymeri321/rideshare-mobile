import "server-only";
import { neon } from "@neondatabase/serverless";

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Databaza nuk është konfiguruar.");
  return neon(url);
}

export function raportoGabiminNeon(vendi: string, gabimi: unknown) {
  const error = gabimi instanceof Error ? gabimi as Error & { code?: unknown } : null;
  const mesazhi = error?.message?.replace(/postgres(?:ql)?:\/\/[^\s]+/gi, "[DATABASE_URL]").slice(0, 300);
  console.error(`[RideShare] Neon query failed: ${vendi}`, {
    name: error?.name ?? "UnknownError",
    code: typeof error?.code === "string" ? error.code : undefined,
    message: mesazhi,
  });
  if (!process.env.DATABASE_URL || mesazhi?.includes("Databaza nuk është konfiguruar")) {
    return "Mungon DATABASE_URL në cilësimet e Vercel. Shtoje te Project Settings → Environment Variables dhe bëj redeploy.";
  }
  return "Nuk u lidhëm me Neon. Kontrollo Runtime Logs të këtij deploy-i në Vercel për kodin e gabimit.";
}
