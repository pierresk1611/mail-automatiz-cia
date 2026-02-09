import nodemailer from "nodemailer";
import { decrypt } from "@/lib/encryption";
import type { emailConfigs } from "@/lib/db/schema";
import type { InferSelectModel } from "drizzle-orm";

type EmailConfig = InferSelectModel<typeof emailConfigs>;

export async function createTransporter(config: EmailConfig) {
    const password = decrypt(config.smtpPasswordEncrypted);

    return nodemailer.createTransport({
        host: config.smtpHost,
        port: config.smtpPort,
        secure: config.smtpPort === 465, // true for 465, false for other ports
        auth: {
            user: config.smtpUser,
            pass: password,
        },
    });
}

export async function sendEmail(
    config: EmailConfig,
    to: string,
    subject: string,
    html: string,
    replyTo?: string
) {
    const transporter = await createTransporter(config);

    const info = await transporter.sendMail({
        from: `"${config.name}" <${config.email}>`, // sender address
        to,
        subject,
        html,
        replyTo: replyTo || config.email,
    });

    return info;
}

export async function verifySmtpConnection(config: Partial<EmailConfig> & { password?: string }) {
    const password = config.password || (config.smtpPasswordEncrypted ? decrypt(config.smtpPasswordEncrypted) : "");
    if (!password) throw new Error("No password provided");

    const transporter = nodemailer.createTransport({
        host: config.smtpHost,
        port: config.smtpPort || 465,
        secure: (config.smtpPort || 465) === 465,
        auth: {
            user: config.smtpUser,
            pass: password,
        },
    });

    await transporter.verify();
    return true;
}
