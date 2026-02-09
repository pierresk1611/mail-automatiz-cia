import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { templates } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
    try {
        const data = await db.select().from(templates);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { id, ...data } = body;

        if (id) {
            await db.update(templates).set(data).where(eq(templates.id, id));
        } else {
            await db.insert(templates).values(data);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to save template" }, { status: 500 });
    }
}
// DELETE implementation could be added here or in a separate [id] route
