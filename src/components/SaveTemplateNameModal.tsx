// src/components/SaveTemplateNameModal.tsx
"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SaveTemplateNameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (templateName: string) => Promise<void>; // Make onSave async
    isLoading: boolean; // Receive loading state from parent
}

export function SaveTemplateNameModal({
    isOpen,
    onClose,
    onSave,
    isLoading,
}: SaveTemplateNameModalProps) {
    const [templateName, setTemplateName] = useState("");
    const [error, setError] = useState<string | null>(null);

    // Reset name when modal opens
    useEffect(() => {
        if (isOpen) {
            setTemplateName("");
            setError(null);
        }
    }, [isOpen]);

    const handleSaveClick = async () => {
        setError(null);
        if (templateName.trim() === "") {
            setError("Template name cannot be empty.");
            return;
        }
        // Call the async onSave passed from the parent
        try {
            await onSave(templateName.trim());
            // Parent will handle closing on success
        } catch (err: any) {
            setError(err.message || "Failed to save template.");
            // Don't close on error
        }
    };

    const handleCancel = () => {
        if (isLoading) return; // Don't close while parent is loading
        onClose();
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleCancel}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Save as Template</DialogTitle>
                    <DialogDescription>
                        Enter a name for this medication list to save it as a reusable template.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="template-name" className="text-right">
                            Name *
                        </Label>
                        <Input
                            id="template-name"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            className="col-span-3"
                            placeholder="e.g., Standard Diabetes Meds"
                            disabled={isLoading}
                        />
                    </div>
                    {error && <p className="col-span-4 text-sm text-red-500 text-center">{error}</p>}
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSaveClick} disabled={isLoading || templateName.trim() === ""}>
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
                            </>
                        ) : (
                            "Save Template"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}