"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EmailAccountsSettings() {
    const [loading, setLoading] = useState(true);
    const [accounts, setAccounts] = useState<any[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch("/api/email-configs")
            .then(res => res.json())
            .then(json => {
                setAccounts(Array.isArray(json) ? json : []);
                setLoading(false);
            });
    }, []);

    const handleAdd = () => {
        setAccounts([...accounts, {
            name: "Nové konto",
            email: "",
            imapHost: "",
            imapPort: 993,
            imapUser: "",
            imapPassword: "",
            smtpHost: "",
            smtpPort: 465,
            smtpUser: "",
            smtpPassword: ""
        }]);
    };

    const handleSave = async (acc: any) => {
        setSaving(true);
        try {
            const res = await fetch("/api/email-configs", {
                method: "POST",
                body: JSON.stringify(acc),
            });
            if (res.ok) {
                toast.success("Konto uložené");
                // refresh list
                const updated = await fetch("/api/email-configs").then(r => r.json());
                setAccounts(updated);
            } else toast.error("Chyba pri ukladaní");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>E-mailové Schránky</CardTitle>
                    <CardDescription>Správa pripojených IMAP/SMTP účtov.</CardDescription>
                </div>
                <Button size="sm" onClick={handleAdd}>
                    <Plus className="mr-2 h-4 w-4" /> Pridať konto
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                {accounts.length === 0 && <p className="text-muted-foreground text-center py-4">Žiadne kontá nie sú nastavené.</p>}
                {accounts.map((acc, idx) => (
                    <div key={idx} className="border p-4 rounded-lg space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label>Názov konta</Label>
                                <Input value={acc.name} onChange={e => {
                                    const newAccs = [...accounts];
                                    newAccs[idx].name = e.target.value;
                                    setAccounts(newAccs);
                                }} />
                            </div>
                            <div className="space-y-1">
                                <Label>E-mail</Label>
                                <Input value={acc.email} onChange={e => {
                                    const newAccs = [...accounts];
                                    newAccs[idx].email = e.target.value;
                                    setAccounts(newAccs);
                                }} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* IMAP */}
                            <div className="space-y-2 border-t pt-2">
                                <h4 className="font-semibold text-sm">IMAP (Prichádzajúce)</h4>
                                <Input placeholder="Host" value={acc.imapHost} onChange={e => {
                                    const newAccs = [...accounts]; newAccs[idx].imapHost = e.target.value; setAccounts(newAccs);
                                }} />
                                <Input placeholder="Password" type="password" value={acc.imapPassword} onChange={e => {
                                    const newAccs = [...accounts]; newAccs[idx].imapPassword = e.target.value; setAccounts(newAccs);
                                }} />
                            </div>
                            {/* SMTP */}
                            <div className="space-y-2 border-t pt-2">
                                <h4 className="font-semibold text-sm">SMTP (Odchádzajúce)</h4>
                                <Input placeholder="Host" value={acc.smtpHost} onChange={e => {
                                    const newAccs = [...accounts]; newAccs[idx].smtpHost = e.target.value; setAccounts(newAccs);
                                }} />
                                <Input placeholder="Password" type="password" value={acc.smtpPassword} onChange={e => {
                                    const newAccs = [...accounts]; newAccs[idx].smtpPassword = e.target.value; setAccounts(newAccs);
                                }} />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button size="sm" onClick={() => handleSave(acc)}>Uložiť</Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
