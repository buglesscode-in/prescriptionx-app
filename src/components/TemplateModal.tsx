"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Loader2 } from "lucide-react";

// MODIFIED: Import both add and update functions
import { addTemplate, updateTemplate } from "@/firebase/templateService";
// ADDED: Import the TemplateData type from your screen
// (Adjust path if your screen file is named differently or located elsewhere)
import { TemplateData, Medication } from "@/interfaces/template";


// --- Component Props ---
interface TemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    userUid: string;
    editingTemplate: TemplateData | null; // ADDED: Prop for editing
}

/**
 * A modal for creating or editing a medication template.
 */
export function TemplateModal({
    isOpen,
    onClose,
    userUid,
    editingTemplate, // ADDED
}: TemplateModalProps) {
    // --- Internal state for this modal ---
    const [templateName, setTemplateName] = useState("");
    const [medications, setMedications] = useState<Medication[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // --- Effect to reset or populate form when opened ---
    useEffect(() => {
        if (isOpen) {
            if (editingTemplate) {
                // ADDED: Populate form for editing
                setTemplateName(editingTemplate.templateName);
                // Ensure medications have a unique local ID (like UUID) for React keys
                setMedications(
                    editingTemplate.medications.map((m) => ({
                        ...m,
                    }))
                );
            } else {
                // MODIFIED: Reset form for creating
                setTemplateName("");
                setMedications([]);
                addMedicationRow(); // Add one empty row for new templates
            }
            setIsLoading(false);
            setError(null);
        }
    }, [isOpen, editingTemplate]); // MODIFIED: Add dependency

    // --- Handlers ---
    const handleMedicationChange = (
        id: string, // <-- MODIFIED: Changed from number
        field: keyof Medication,
        value: string
    ) => {
        setMedications((currentMeds) =>
            currentMeds.map((med) => (med.id === id ? { ...med, [field]: value } : med))
        );
    };

    const addMedicationRow = () => {
        // MODIFIED: Use crypto.randomUUID() for the unique string ID
        setMedications((currentMeds) => [
            ...currentMeds,
            {
                id: crypto.randomUUID(), // <-- MODIFIED
                name: "",
                regimen: "",
                mealTime: "After Meal",
                duration: "",
                frequency: "Daily",
                remarks: "",
            },
        ]);
    };

    const removeMedicationRow = (id: string) => { // <-- MODIFIED: Changed from number
        setMedications((currentMeds) =>
            currentMeds.filter((med) => med.id !== id)
        );
    };

    // --- Save and Cancel Handlers ---
    const handleCancel = () => {
        if (isLoading) return;
        onClose();
    };

    // MODIFIED: This function now handles BOTH create and update
    const handleSaveClick = async () => {
        setError(null);
        // Filter out empty rows and remove the local 'id' field before saving
        const newMeds: Medication[] = medications.filter((m) => m.name.trim() !== "");


        // --- Validation ---
        if (templateName.trim() === "") {
            setError("Template name is required.");
            return;
        }
        if (newMeds.length === 0) {
            setError("You must add at least one medication.");
            return;
        }

        setIsLoading(true);

        try {
            if (editingTemplate) {
                // --- UPDATE LOGIC ---
                const dataToUpdate = {
                    templateName: templateName,
                    medications: newMeds,
                };
                // Ensure editingTemplate.id is not null/undefined if it's optional
                if (!editingTemplate.id) {
                    throw new Error("Cannot update template without an ID.");
                }
                await updateTemplate(editingTemplate.id, dataToUpdate);
            } else {
                // --- CREATE LOGIC ---
                await addTemplate({
                    templateName: templateName,
                    medications: newMeds,
                    userUid: userUid,
                });
            }

            setIsLoading(false);
            onClose(); // Close the modal on success
        } catch (err: any) {
            console.error("Failed to save template:", err);
            setError(err.message || "An unknown error occurred.");
            setIsLoading(false);
        }
    };

    // MODIFIED: Filter without the ID field for count
    const validMedsCount = medications.filter((m) => m.name.trim() !== "").length;
    const isSaveDisabled =
        templateName.trim() === "" || validMedsCount === 0 || isLoading;

    return (
        <Dialog open={isOpen} onOpenChange={handleCancel}>
            <DialogContent className="sm:max-w-[1000px] max-h-[85vh] overflow-y-auto p-8">
                <DialogHeader>
                    {/* MODIFIED: Dynamic Title */}
                    <DialogTitle>
                        {editingTemplate
                            ? "Edit Medication Template"
                            : "Create New Medication Template"}
                    </DialogTitle>
                    <DialogDescription>
                        {/* MODIFIED: Dynamic Description */}
                        {editingTemplate
                            ? "Update the details for this template."
                            : "Save a list of medications as a template for quick use later."}
                    </DialogDescription>
                </DialogHeader>

                {/* --- Template Name Input --- */}
                <div className="space-y-2 pt-4">
                    <Label htmlFor="templateName">Template Name *</Label>
                    <Input
                        id="templateName"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        placeholder="e.g., Standard Diabetes Meds, Post-Op Care"
                        disabled={isLoading}
                    />
                </div>

                {/* --- Add Row Button --- */}
                <div className="flex justify-end pt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={addMedicationRow}
                        disabled={isLoading}
                    >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Row
                    </Button>
                </div>

                {/* --- Editable Table --- */}
                <div className="border rounded-md mt-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-[200px]">Medicine Name *</TableHead>
                                <TableHead>Regimen</TableHead>
                                <TableHead>Meal Time</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Frequency</TableHead>
                                <TableHead>Remarks</TableHead>
                                <TableHead className="w-[50px]">Act</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {medications.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="text-center h-24 text-muted-foreground"
                                    >
                                        Click "Add Row" to start.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                medications.map((med) => (
                                    // Use med.id for the key
                                    <TableRow key={med.id}>
                                        <TableCell>
                                            <Input
                                                placeholder="e.g., Paracetamol 500mg"
                                                value={med.name}
                                                onChange={(e) =>
                                                    handleMedicationChange(med.id, "name", e.target.value)
                                                }
                                                disabled={isLoading}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                placeholder="e.g., 1-0-1"
                                                value={med.regimen}
                                                onChange={(e) =>
                                                    handleMedicationChange(
                                                        med.id,
                                                        "regimen",
                                                        e.target.value
                                                    )
                                                }
                                                disabled={isLoading}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                value={med.mealTime}
                                                onValueChange={(
                                                    value: "Before Meal" | "After Meal" | "With Meal"
                                                ) => handleMedicationChange(med.id, "mealTime", value)}
                                                disabled={isLoading}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="After Meal">After Meal</SelectItem>
                                                    <SelectItem value="Before Meal">
                                                        Before Meal
                                                    </SelectItem>
                                                    <SelectItem value="With Meal">With Meal</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                placeholder="e.g., 30 Days"
                                                value={med.duration}
                                                onChange={(e) =>
                                                    handleMedicationChange(
                                                        med.id,
                                                        "duration",
                                                        e.target.value
                                                    )
                                                }
                                                disabled={isLoading}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                value={med.frequency}
                                                onValueChange={(
                                                    value:
                                                        | "Daily"
                                                        | "Weekly"
                                                        | "Twice a day"
                                                        | "As needed"
                                                ) =>
                                                    handleMedicationChange(med.id, "frequency", value)
                                                }
                                                disabled={isLoading}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Daily">Daily</SelectItem>
                                                    <SelectItem value="Weekly">Weekly</SelectItem>
                                                    <SelectItem value="Twice a day">
                                                        Twice a day
                                                    </SelectItem>
                                                    <SelectItem value="As needed">As needed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                placeholder="Optional"
                                                value={med.remarks}
                                                onChange={(e) =>
                                                    handleMedicationChange(
                                                        med.id,
                                                        "remarks",
                                                        e.target.value
                                                    )
                                                }
                                                disabled={isLoading}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeMedicationRow(med.id)}
                                                disabled={isLoading}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* --- Error Message --- */}
                {error && <p className="text-sm text-red-500 pt-2">{error}</p>}

                {/* --- Footer --- */}
                <DialogFooter className="mt-6">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleCancel}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSaveClick}
                        disabled={isSaveDisabled}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : // MODIFIED: Dynamic Button Text
                            editingTemplate ? (
                                "Save Changes"
                            ) : (
                                "Save Template"
                            )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}