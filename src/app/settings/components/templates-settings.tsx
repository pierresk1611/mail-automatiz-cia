"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Plus, Edit2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function TemplatesSettings() {
    const [loading, setLoading] = useState(true);
    const [templates, setTemplates] = useState<any[]>([]);
    const [editing, setEditing] = useState<any>(null);

    useEffect(() => {
        fetch("/api/templates")
            .then(res => res.json())
            .then(json => {
                setTemplates(Array.isArray(json) ? json : []);
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        if (!editing) return;
        try {
            const res = await fetch("/api/templates", {
                method: "POST",
                body: JSON.stringify(editing),
            });
            if (res.ok) {
                toast.success("Šablóna uložená");
                setEditing(null);
                const updated = await fetch("/api/templates").then(r => r.json());
                setTemplates(updated);
            } else toast.error("Chyba pri ukladaní");
        } catch (e) {
            toast.error("Chyba pripojenia");
        }
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Šablóny odpovedí</CardTitle>
                        <CardDescription>Správa preddefinovaných textov pre AI.</CardDescription>
                    </div>
                    <Button size="sm" onClick={() => setEditing({ name: "", subject: "", body: "" })}>
                        <Plus className="mr-2 h-4 w-4" /> Nová šablóna
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {templates.map((tpl, i) => (
                            <div key={i} className="border p-4 rounded-lg flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold">{tpl.name}</h4>
                                    <p className="text-sm text-muted-foreground truncate max-w-[200px]">{tpl.subject}</p>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => setEditing(tpl)}>
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {editing && (
                <Card>
                    <CardHeader>
                        <CardTitle>{editing.id ? "Upraviť šablónu" : "Nová šablóna"}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <Label>Názov šablóny</Label>
                            <Input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <Label>Predmet (vzor)</Label>
                            <Input value={editing.subject} onChange={e => setEditing({ ...editing, subject: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <Label>Text šablóny</Label>
                            <Textarea rows={8} value={editing.body} onChange={e => setEditing({ ...editing, body: e.target.value })} />
                            <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1">
                                Dostupné premenné: {"{{zakaznik}}"}, {"{{objednavka}}"}, {"{{datum}}"}
                            </p>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setEditing(null)}>Zrušiť</Button>
                            <Button onClick={handleSave}>Uložiť šablónu</Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
