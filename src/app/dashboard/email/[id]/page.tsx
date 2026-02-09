import { notFound } from "next/navigation";
import { db } from "@/lib/db/drizzle";
import { emails } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { StatusSelect } from "./status-select"; // New client component

interface PageProps {
    params: Promise<{ id: string }>;
}

async function getEmail(id: string) {
    const result = await db.select().from(emails).where(eq(emails.id, parseInt(id))).limit(1);
    return result[0] || null;
}

export default async function EmailDetailPage({ params }: PageProps) {
    // Await params first (Next.js 15+ requirement for dynamic routes)
    const { id } = await params;

    const email = await getEmail(id);

    if (!email) {
        notFound();
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Left Column: Original Email */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-xl">{email.subject}</CardTitle>
                                <CardDescription>
                                    Od: {email.from} <br />
                                    Dátum: {email.receivedAt ? new Date(email.receivedAt).toLocaleString() : "-"}
                                </CardDescription>
                            </div>
                            <StatusSelect id={email.id} currentStatus={email.status || "new"} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="whitespace-pre-wrap text-sm text-foreground/80">
                            {email.body}
                        </div>
                    </CardContent>
                </Card>

                {/* CRM Info Panel (Mock) */}
                <Card>
                    <CardHeader>
                        <CardTitle>CRM Informácie</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm">
                            <p><strong>Status v CRM:</strong> {email.crmStatus || "Neznámy"}</p>
                            <p><strong>Objednávky:</strong> Žiadne nájdené (Mock)</p>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <Button variant="outline" size="sm">Otvoriť v CRM</Button>
                            <Button variant="outline" size="sm">Spárovať manuálne</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: AI Analysis & Draft */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>AI Analýza</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <span className="font-semibold text-sm">Klasifikácia: </span>
                            <Badge variant="outline">{email.aiClassification}</Badge>
                        </div>
                        {/* Reasoning would go here if we stored it */}
                        <Separator />
                        <div>
                            <h4 className="font-semibold mb-2 text-sm">Návrh odpovede (AI)</h4>
                            <Textarea
                                className="min-h-[200px]"
                                defaultValue={email.aiDraft || "AI zatiaľ nevygenerovala odpoveď."}
                            />
                        </div>
                        <div className="flex gap-2 justify-end">
                            <Button variant="secondary">Pregenerovať</Button>
                            <Button>Odoslať odpoveď</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
