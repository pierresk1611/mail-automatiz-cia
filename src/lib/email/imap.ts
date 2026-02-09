import { ImapFlow } from "imapflow";
import { decrypt } from "@/lib/encryption";
import type { emailConfigs } from "@/lib/db/schema"; // Type definition
import type { InferSelectModel } from "drizzle-orm";

type EmailConfig = InferSelectModel<typeof emailConfigs>;

export async function fetchEmails(config: EmailConfig) {
    const password = decrypt(config.imapPasswordEncrypted);

    const client = new ImapFlow({
        host: config.imapHost,
        port: config.imapPort,
        secure: config.imapPort === 993,
        auth: {
            user: config.imapUser,
            pass: password,
        },
        logger: false,
    });

    await client.connect();

    const lock = await client.getMailboxLock("INBOX");
    const emails = [];

    try {
        // Fetch unseen emails
        // For now, let's fetch the last 10 emails or strictly unseen
        // In a real app, we should use 'seen' flag or track UID
        // Let's fetch messages that are NOT \Seen
        const messages = client.fetch({ seen: false }, {
            envelope: true,
            source: true,
            uid: true,
            flags: true,
            bodyStructure: true
        });

        for await (const message of messages) {
            // Parse message content (simplified for now)
            // In production, use 'mailparser' to parse source properly
            // We will need to return raw source or basic fields
            emails.push({
                uid: message.uid,
                seq: message.seq,
                envelope: message.envelope,
                source: message.source, // Buffer
                flags: message.flags
            });
        }
    } finally {
        lock.release();
    }

    await client.logout();
    return emails;
}

// Helper to verify connection
export async function verifyImapConnection(config: Partial<EmailConfig> & { password?: string }) {
    const password = config.password || (config.imapPasswordEncrypted ? decrypt(config.imapPasswordEncrypted) : "");
    if (!password) throw new Error("No password provided");

    const client = new ImapFlow({
        host: config.imapHost!,
        port: config.imapPort || 993,
        secure: (config.imapPort || 993) === 993,
        auth: {
            user: config.imapUser!,
            pass: password,
        },
        logger: false,
    });

    await client.connect();
    await client.logout();
    return true;
}
