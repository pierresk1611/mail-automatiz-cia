"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettings } from "./components/general-settings";
import { CRMSettings } from "./components/crm-settings";
import { AISettings } from "./components/ai-settings";
import { EmailAccountsSettings } from "./components/email-accounts-settings";
import { TemplatesSettings } from "./components/templates-settings";

export default function SettingsPage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Nastavenia</h1>
            <Tabs defaultValue="general" className="w-full">
                <TabsList className="mb-4 grid grid-cols-2 md:grid-cols-5 h-auto">
                    <TabsTrigger value="general">Všeobecné</TabsTrigger>
                    <TabsTrigger value="crm">CRM Integrácia</TabsTrigger>
                    <TabsTrigger value="ai">AI & Groq</TabsTrigger>
                    <TabsTrigger value="emails">E-mailové Kontá</TabsTrigger>
                    <TabsTrigger value="templates">Šablóny</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <GeneralSettings />
                </TabsContent>

                <TabsContent value="crm">
                    <CRMSettings />
                </TabsContent>

                <TabsContent value="ai">
                    <AISettings />
                </TabsContent>

                <TabsContent value="emails">
                    <EmailAccountsSettings />
                </TabsContent>

                <TabsContent value="templates">
                    <TemplatesSettings />
                </TabsContent>
            </Tabs>
        </div>
    );
}

