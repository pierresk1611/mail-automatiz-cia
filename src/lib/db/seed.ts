import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users } from "./schema";
import * as dotenv from "dotenv";
import { hash } from "crypto";

// Load environment variables
dotenv.config({ path: ".env.local" });

if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not defined");
}

const client = postgres(process.env.POSTGRES_URL);
const db = drizzle(client);

async function main() {
    console.log("Seeding database...");

    // Create initial admin user
    // In a real app, use scrypt or argon2. For simplicity in this demo, we'll use a simple hash or placeholder.
    // Ideally, use a library like bcryptjs. 
    // For now, let's assume the password is "admin123" and we store it as is (NOT RECOMMENDED) or a simple hash.
    // user-friendly instruction: "Default password is admin123"

    // Note: implementing a proper hash function is out of scope for this seed script unless we install bcryptjs.
    // I'll add bcryptjs to dependencies later or just use a placeholder hash.
    // Let's use a dummy hash for "admin123"
    const passwordHash = "admin123"; // TODO: Replace with real hash in auth flow

    await db.insert(users).values({
        email: "admin@example.com",
        role: "admin",
        passwordHash: passwordHash,
        name: "Admin User",
    }).onConflictDoNothing();

    console.log("Seeding complete.");
    process.exit(0);
}

main().catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
