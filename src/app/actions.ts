"use server";

import { db } from "@/lib/db/drizzle";
import { emails } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateEmailStatus(id: number, status: string) {
    try {
        await db.update(emails)
            .set({ status: status as any }) // Type assertion needed if enum is strict
            .where(eq(emails.id, id));

        revalidatePath("/dashboard/inbox");
        revalidatePath(`/dashboard/email/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to update status:", error);
        return { success: false, error: "Failed to update status" };
    }
}
