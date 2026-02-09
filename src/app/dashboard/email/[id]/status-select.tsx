"use client";

import * as React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { updateEmailStatus } from "@/app/actions";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface StatusSelectProps {
    id: number;
    currentStatus: string;
}

export function StatusSelect({ id, currentStatus }: StatusSelectProps) {
    const [status, setStatus] = React.useState(currentStatus);
    const [isPending, startTransition] = React.useTransition();

    const handleValueChange = (value: string) => {
        setStatus(value);
        startTransition(async () => {
            const result = await updateEmailStatus(id, value);
            if (result.success) {
                toast.success("Status aktualizovaný");
            } else {
                toast.error("Chyba pri aktualizácii statusu");
                // Revert on error if needed
            }
        });
    };

    return (
        <div className="flex items-center gap-2">
            {/* Optionally verify loading state */}
            <Select onValueChange={handleValueChange} defaultValue={currentStatus}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="new">Nová</SelectItem>
                    <SelectItem value="processed">Spracovaná</SelectItem>
                    <SelectItem value="drafted">Draft</SelectItem>
                    <SelectItem value="pending_approval">Čaká na schválenie</SelectItem>
                    <SelectItem value="sent">Odoslaná</SelectItem>
                    <SelectItem value="error">Chyba</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
