import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function CustomersPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Zákazníci</h1>
                <p className="text-muted-foreground">Databáza a história interakcií so zákazníkmi.</p>
            </div>
            <Card className="flex flex-col items-center justify-center py-20 bg-muted/20">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <CardHeader className="text-center">
                    <CardTitle>Pripravujeme...</CardTitle>
                    <CardDescription>
                        Sekcia zákazníkov bude dostupná čoskoro. Tu nájdete profily zákazníkov a históriu ich komunikácie.
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
}
