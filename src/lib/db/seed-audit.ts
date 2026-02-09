import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { auditLogs } from "./schema";

if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not defined");
}

const client = postgres(process.env.POSTGRES_URL, { prepare: false });
const db = drizzle(client);

async function main() {
    console.log("Seeding dummy audit logs...");

    await db.insert(auditLogs).values([
        {
            action: "EMAIL_FETCH",
            performedBy: "system",
            details: { count: 3, source: "IMAP" },
            createdAt: new Date(),
        },
        {
            action: "USER_LOGIN",
            performedBy: "admin@example.com",
            details: { ip: "127.0.0.1" },
            createdAt: new Date(Date.now() - 3600000),
        },
        {
            action: "SETTINGS_UPDATE",
            performedBy: "user:1",
            details: { module: "CRM" },
            createdAt: new Date(Date.now() - 7200000),
        },
    ]);

    console.log("Dummy audit logs seeded.");
    process.exit(0);
}

main().catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
