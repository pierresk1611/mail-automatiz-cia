"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function CRMSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState({ crmUrl: "", crmApiKey: "" });

    useEffect(() => {
        fetch("/api/settings")
            .then(res => res.json())
            .then(json => {
                setData({
                    crmUrl: json.crmUrl || "",
                    crmApiKey: json.crmApiKey || ""
                });
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/settings", {
                method: "POST",
                body: JSON.stringify(data),
            });
            if (res.ok) toast.success("CRM nastavenia uložené");
            else toast.error("Chyba pri ukladaní");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>CRM Konfigurácia</CardTitle>
                <CardDescription>Napojenie na externý CRM systém.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="crmUrl">CRM API URL</Label>
                    <Input
                        type="url"
                        id="crmUrl"
                        value={data.crmUrl}
                        onChange={e => setData({ ...data, crmUrl: e.target.value })}
                    />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="crmKey">API Kľúč</Label>
                    <Input
                        type="password"
                        id="crmKey"
                        value={data.crmApiKey}
                        onChange={e => setData({ ...data, crmApiKey: e.target.value })}
                    />
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Uložiť
                </Button>
            </CardContent>
        </Card>
    );
}
