import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { emails, auditLogs } from "./schema";

if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not defined");
}

const client = postgres(process.env.POSTGRES_URL, { prepare: false });
const db = drizzle(client);

async function main() {
    const emailCount = await db.select().from(emails);
    const auditCount = await db.select().from(auditLogs);

    console.log(`Emails in DB: ${emailCount.length}`);
    console.log(`Audit Logs in DB: ${auditCount.length}`);

    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
