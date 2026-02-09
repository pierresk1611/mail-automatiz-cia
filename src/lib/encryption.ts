import "server-only";
import { createCipheriv, createDecipheriv, randomBytes, createHash } from "crypto";

const ALGORITHM = "aes-256-cbc";

function getKey() {
    const key = process.env.ENCRYPTION_KEY;
    if (!key) {
        throw new Error("ENCRYPTION_KEY is not defined in environment variables");
    }
    // Use a hash to ensure 32 bytes
    return createHash("sha256").update(key).digest();
}

export function encrypt(text: string): string {
    if (!text) return "";
    const iv = randomBytes(16);
    const cipher = createCipheriv(ALGORITHM, getKey(), iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    // Return IV + Encrypted data
    return `${iv.toString("hex")}:${encrypted}`;
}

export function decrypt(text: string): string {
    if (!text) return "";
    const parts = text.split(":");
    if (parts.length !== 2) return text; // Not encrypted or invalid format

    const iv = Buffer.from(parts[0], "hex");
    const encryptedText = parts[1];
    const decipher = createDecipheriv(ALGORITHM, getKey(), iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}
