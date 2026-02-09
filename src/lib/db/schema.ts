import { pgTable, serial, text, timestamp, boolean, jsonb, integer, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    role: text("role", { enum: ["admin", "grafik"] }).notNull().default("admin"),
    name: text("name"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const emailConfigs = pgTable("email_configs", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(), // e.g., "Main CZ", "Info SK"
    email: text("email").notNull(),
    imapHost: text("imap_host").notNull(),
    imapPort: integer("imap_port").notNull().default(993),
    imapUser: text("imap_user").notNull(),
    imapPasswordEncrypted: text("imap_password_encrypted").notNull(),
    smtpHost: text("smtp_host").notNull(),
    smtpPort: integer("smtp_port").notNull().default(465),
    smtpUser: text("smtp_user").notNull(),
    smtpPasswordEncrypted: text("smtp_password_encrypted").notNull(),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
});

export const templates = pgTable("templates", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    subject: text("subject").notNull(),
    body: text("body").notNull(), // HTML content
    language: text("language", { enum: ["sk", "cz"] }).notNull().default("sk"),
    placeholders: jsonb("placeholders").$type<string[]>(), // Array of placeholder keys
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const appSettings = pgTable("app_settings", {
    id: serial("id").primaryKey(),
    key: text("key").notNull().unique(), // e.g., "crm_api_url", "crm_api_key", "groq_api_key", "system_prompt"
    value: text("value"), // Encrypted if sensitive
    isEncrypted: boolean("is_encrypted").default(false),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const emails = pgTable("emails", {
    id: serial("id").primaryKey(),
    messageId: text("message_id").unique(),
    subject: text("subject"),
    from: text("from").notNull(),
    to: text("to").notNull(),
    body: text("body"), // Original body
    receivedAt: timestamp("received_at"),

    // AI Processing
    aiClassification: text("ai_classification"), // "lead", "order", "spam", etc.
    aiDraft: text("ai_draft"),

    // Status
    status: text("status", { enum: ["new", "processed", "drafted", "sent", "pending_approval", "error"] }).default("new"),
    crmStatus: text("crm_status"), // Status from CRM

    configId: integer("config_id").references(() => emailConfigs.id),
    createdAt: timestamp("created_at").defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
    id: serial("id").primaryKey(),
    action: text("action").notNull(),
    details: jsonb("details"),
    performedBy: text("performed_by"), // "system", "user:ID"
    createdAt: timestamp("created_at").defaultNow(),
});
