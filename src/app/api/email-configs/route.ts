import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { emailConfigs } from "@/lib/db/schema";
import { encrypt } from "@/lib/encryption";
import { eq } from "drizzle-orm";

export async function GET() {
    try {
        const configs = await db.select().from(emailConfigs);
        // Don't return passwords back to the UI (mask them)
        const maskedConfigs = configs.map(c => ({
            ...c,
            imapPasswordEncrypted: c.imapPasswordEncrypted ? "********" : "",
            smtpPasswordEncrypted: c.smtpPasswordEncrypted ? "********" : "",
        }));
        return NextResponse.json(maskedConfigs);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch configs" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { id, imapPassword, smtpPassword, ...rest } = body;

        const data: any = { ...rest };
        if (imapPassword && imapPassword !== "********") {
            data.imapPasswordEncrypted = encrypt(imapPassword);
        }
        if (smtpPassword && smtpPassword !== "********") {
            data.smtpPasswordEncrypted = encrypt(smtpPassword);
        }

        if (id) {
            await db.update(emailConfigs).set(data).where(eq(emailConfigs.id, id));
        } else {
            await db.insert(emailConfigs).values(data);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Email config save error:", error);
        return NextResponse.json({ error: "Failed to save email config" }, { status: 500 });
    }
}
