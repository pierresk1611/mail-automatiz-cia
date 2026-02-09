import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { emails } from "./schema";

if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not defined");
}

const client = postgres(process.env.POSTGRES_URL, { prepare: false });
const db = drizzle(client);

async function main() {
    console.log("Seeding dummy emails...");

    await db.insert(emails).values([
        {
            from: "jan.novak@example.com",
            to: "info@mojeshop.sk",
            subject: "Otázka ohľadom dostupnosti",
            body: "Dobrý deň, kedy bude dostupný produkt X?",
            status: "new",
            aiClassification: "LEAD",
            receivedAt: new Date(),
        },
        {
            from: "peter.svoboda@example.cz",
            to: "objednavky@mojeshop.cz",
            subject: "Objednávka č. 2024001",
            body: "Posielam potvrdenie o úhrade.",
            status: "processed",
            aiClassification: "ORDER",
            crmStatus: "Uhradená",
            receivedAt: new Date(Date.now() - 3600000), // 1 hour ago
        },
        {
            from: "newsletter@spam.com",
            to: "info@mojeshop.sk",
            subject: "Najlepšia ponuka",
            body: "Kliknite sem...",
            status: "processed",
            aiClassification: "SPAM",
            receivedAt: new Date(Date.now() - 7200000), // 2 hours ago
        },
    ]);

    console.log("Dummy emails seeded.");
    process.exit(0);
}

main().catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
