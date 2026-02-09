"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function AISettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState({ groqApiKey: "", defaultSystemPrompt: "" });

    useEffect(() => {
        fetch("/api/settings")
            .then(res => res.json())
            .then(json => {
                setData({
                    groqApiKey: json.groqApiKey || "",
                    defaultSystemPrompt: json.defaultSystemPrompt || ""
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
            if (res.ok) toast.success("AI nastavenia uložené");
            else toast.error("Chyba pri ukladaní");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>AI Model (Groq)</CardTitle>
                <CardDescription>Nastavenia umelej inteligencie.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="groqKey">Groq API Key</Label>
                    <Input
                        type="password"
                        id="groqKey"
                        value={data.groqApiKey}
                        onChange={e => setData({ ...data, groqApiKey: e.target.value })}
                    />
                </div>
                <div className="grid w-full gap-1.5">
                    <Label htmlFor="systemPrompt">System Prompt</Label>
                    <Textarea
                        id="systemPrompt"
                        rows={5}
                        value={data.defaultSystemPrompt}
                        onChange={e => setData({ ...data, defaultSystemPrompt: e.target.value })}
                    />
                    <p className="text-sm text-muted-foreground">Definujte osobnosť a pravidlá správania pre AI agenta.</p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Uložiť
                </Button>
            </CardContent>
        </Card>
    );
}
