export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { db } from "@/lib/db/drizzle";
import { emails, auditLogs } from "@/lib/db/schema";
import { count, eq, desc } from "drizzle-orm";
import { Mail, CheckCircle, AlertCircle, Clock, BarChart3 } from "lucide-react";

async function getStats() {
    const totalEmails = await db.select({ value: count() }).from(emails);
    const newEmails = await db.select({ value: count() }).from(emails).where(eq(emails.status, "new"));
    const processedEmails = await db.select({ value: count() }).from(emails).where(eq(emails.status, "processed"));
    const errorEmails = await db.select({ value: count() }).from(emails).where(eq(emails.status, "error"));

    const recentLogs = await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(5);

    return {
        total: totalEmails[0].value,
        new: newEmails[0].value,
        processed: processedEmails[0].value,
        error: errorEmails[0].value,
        recentLogs
    };
}

export default async function DashboardPage() {
    const stats = await getStats();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
                <p className="text-muted-foreground">Prehľad aktivity vášho AI e-mailového agenta.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Spolu správy</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">Všetky zachytené e-maily</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Nové / Na spracovanie</CardTitle>
                        <Clock className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.new}</div>
                        <p className="text-xs text-muted-foreground">Čakajú na AI analýzu</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Spracované</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.processed}</div>
                        <p className="text-xs text-muted-foreground">Úspešne vybavené AI agentom</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow border-l-4 border-l-red-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Chyby</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.error}</div>
                        <p className="text-xs text-muted-foreground">Vyžadujú manuálny zásah</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 shadow-sm">
                    <CardHeader>
                        <CardTitle>Trend aktivity</CardTitle>
                        <CardDescription>Graf počtu správ za posledných 7 dní.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[200px] flex items-center justify-center border-t mt-4">
                        {/* Mock chart representation */}
                        <div className="w-full flex items-end justify-between h-32 px-4 gap-2">
                            {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                                <div key={i} className="bg-primary/20 hover:bg-primary/40 transition-colors w-full rounded-t" style={{ height: `${h}%` }}></div>
                            ))}
                        </div>
                    </CardContent>
                    <div className="px-6 pb-6 text-xs text-center text-muted-foreground flex justify-between uppercase tracking-wider">
                        <span>Po</span><span>Ut</span><span>St</span><span>Št</span><span>Pi</span><span>So</span><span>Ne</span>
                    </div>
                </Card>

                <Card className="col-span-3 shadow-sm">
                    <CardHeader>
                        <CardTitle>Posledná aktivita</CardTitle>
                        <CardDescription>Najnovšie udalosti zo systému.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.recentLogs.map((log) => (
                                <div key={log.id} className="flex items-center gap-4 border-b pb-2 last:border-0 last:pb-0">
                                    <div className="bg-muted p-2 rounded-full">
                                        <BarChart3 className="h-3 w-3 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-xs font-medium leading-none">{log.action}</p>
                                        <p className="text-[10px] text-muted-foreground">
                                            {log.createdAt ? new Date(log.createdAt).toLocaleTimeString() : "-"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
