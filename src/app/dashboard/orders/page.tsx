import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package } from "lucide-react";

export default function OrdersPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Objednávky</h1>
                <p className="text-muted-foreground">Správa a sledovanie zákazníckych objednávok.</p>
            </div>
            <Card className="flex flex-col items-center justify-center py-20 bg-muted/20">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <CardHeader className="text-center">
                    <CardTitle>Pripravujeme...</CardTitle>
                    <CardDescription>
                        Sekcia objednávok bude dostupná čoskoro. Tu budú zobrazené objednávky spárované s e-mailami.
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
}
