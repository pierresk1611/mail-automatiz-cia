import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
    console.warn("POSTGRES_URL is not defined. Database connection will likely fail.");
}

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString || "postgres://localhost:5432/placeholder", { prepare: false });
export const db = drizzle(client, { schema });

