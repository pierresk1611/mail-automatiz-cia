import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db/drizzle";
import { auditLogs } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

async function getAuditLogs() {
    return await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt));
}

export default async function AuditPage() {
    const logs = await getAuditLogs();

    return (
        <div className="grid gap-4 md:gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Audit Log</CardTitle>
                    <CardDescription>
                        Záznam všetkých akcií vykonaných systémom alebo používateľmi.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Dátum</TableHead>
                                <TableHead>Akcia</TableHead>
                                <TableHead>Používateľ</TableHead>
                                <TableHead>Detaily</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                                        Žiadne záznamy.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="whitespace-nowrap">
                                            {log.createdAt ? new Date(log.createdAt).toLocaleString() : "-"}
                                        </TableCell>
                                        <TableCell className="font-medium">{log.action}</TableCell>
                                        <TableCell>{log.performedBy || "System"}</TableCell>
                                        <TableCell className="text-muted-foreground text-sm font-mono">
                                            {log.details ? JSON.stringify(log.details) : "-"}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
