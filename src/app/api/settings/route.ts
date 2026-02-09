import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { appSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { encrypt, decrypt } from "@/lib/encryption";

export async function GET() {
    try {
        const allSettings = await db.select().from(appSettings);
        const result: Record<string, string> = {};

        for (const s of allSettings) {
            result[s.key] = s.isEncrypted && s.value ? "********" : (s.value || "");
        }

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        for (const [key, value] of Object.entries(body)) {
            if (typeof value !== "string") continue;

            const isEncrypted = key.toLowerCase().includes("key") || key.toLowerCase().includes("password");
            let finalValue = value;

            if (isEncrypted) {
                if (value === "********") continue; // Don't overwrite with mask
                finalValue = encrypt(value);
            }

            const existing = await db.select().from(appSettings).where(eq(appSettings.key, key)).limit(1);

            if (existing.length > 0) {
                await db.update(appSettings)
                    .set({ value: finalValue, isEncrypted, updatedAt: new Date() })
                    .where(eq(appSettings.key, key));
            } else {
                await db.insert(appSettings).values({
                    key,
                    value: finalValue,
                    isEncrypted
                });
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Settings save error:", error);
        return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
    }
}
