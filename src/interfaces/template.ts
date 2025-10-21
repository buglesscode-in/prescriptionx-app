export type Medication = {
    id: string; // Keep this as number for local state key management
    name: string;
    regimen: string;
    mealTime: "Before Meal" | "After Meal" | "With Meal";
    duration: string;
    frequency: "Daily" | "Weekly" | "Twice a day" | "As needed";
    remarks: string;
};

export type TemplateData = {
    id?: string
    isDeleted: boolean;
    templateName: string;
    medications: Medication[];
}