"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function GeneralSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState({ appName: "" });

    useEffect(() => {
        fetch("/api/settings")
            .then(res => res.json())
            .then(json => {
                setData({ appName: json.appName || "" });
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
            if (res.ok) toast.success("Nastavenia uložené");
            else toast.error("Chyba pri ukladaní");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Všeobecné nastavenia</CardTitle>
                <CardDescription>Základné nastavenia aplikácie.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="appName">Názov aplikácie</Label>
                    <Input
                        type="text"
                        id="appName"
                        value={data.appName}
                        onChange={e => setData({ ...data, appName: e.target.value })}
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
