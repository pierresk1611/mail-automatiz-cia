import { Badge } from "@/components/ui/badge";
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
import { emails } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
// import AppLayout from "@/components/layout/AppLayout"; // We might wrap this in layout.tsx instead

async function getEmails() {
    // Fetch emails from DB
    const data = await db.select().from(emails).orderBy(desc(emails.receivedAt));
    return data;
}

export default async function InboxPage() {
    const emailList = await getEmails();

    return (
        <div className="grid gap-4 md:gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Prijaté správy</CardTitle>
                    <CardDescription>
                        Prehľad všetkých spracovaných e-mailov a ich statusov.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Status</TableHead>
                                <TableHead>Odosielateľ</TableHead>
                                <TableHead className="hidden md:table-cell">Predmet</TableHead>
                                <TableHead className="hidden md:table-cell">Kategória</TableHead>
                                <TableHead className="text-right">Dátum</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {emailList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                        Žiadne e-maily na zobrazenie.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                emailList.map((email) => (
                                    <TableRow key={email.id} className="cursor-pointer hover:bg-muted/50">
                                        <TableCell>
                                            <a href={`/dashboard/email/${email.id}`} className="block h-full w-full">
                                                <Badge variant={
                                                    email.status === "new" ? "default" :
                                                        email.status === "processed" ? "secondary" :
                                                            email.status === "error" ? "destructive" : "outline"
                                                }>
                                                    {email.status}
                                                </Badge>
                                            </a>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <a href={`/dashboard/email/${email.id}`} className="block h-full w-full">
                                                {email.from}
                                            </a>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <a href={`/dashboard/email/${email.id}`} className="block h-full w-full">
                                                {email.subject}
                                            </a>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <Badge variant="outline">{email.aiClassification || "N/A"}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {email.receivedAt ? new Date(email.receivedAt).toLocaleDateString() : "-"}
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
