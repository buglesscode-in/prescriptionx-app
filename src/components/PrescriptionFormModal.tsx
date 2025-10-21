"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash2, Loader2, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/authContextDefinition";
import { getEnterprisesByUid } from "@/firebase/prescriptionService";
import { EnterpriseData } from "@/interfaces/enterprise";
import { getUserTemplates, addTemplate } from "@/firebase/templateService"; // <-- ADDED addTemplate
import { TemplateData } from "@/interfaces/template";
import { SaveTemplateNameModal } from "@/components/SaveTemplateNameModal"; // <-- ADDED Import for the new modal
// --- Local Medication Type ---
type Medication = {
  id: string;
  name: string;
  regimen: string;
  mealTime: "Before Meal" | "After Meal" | "With Meal";
  duration: string;
  frequency: "Daily" | "Weekly" | "Twice a day" | "As needed";
  remarks: string;
  sourceTemplateId?: string;
};

// --- Component Props ---
interface PrescriptionFormModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  userUid: string;
}

// --- Initial Data ---
const initialMedications: Medication[] = []; // Start empty is often better
const initialAdvice =
  "High protein diet(calorie deficit - low carb), good hydration of minimum 3L/day, work out for atleast 45 mins/day.";
const initialNotes =
  "Take all medications strictly as prescribed and consume as exactly instructed by the doctor.";

// --- The Modal Component ---
export function PrescriptionFormModal({
  isOpen,
  onClose,
  userUid,
}: PrescriptionFormModalProps) {
  // --- State ---
  const { currentUser } = useAuth();
  const [medications, setMedications] = useState<Medication[]>(initialMedications);
  const [advice, setAdvice] = useState(initialAdvice);
  const [notes, setNotes] = useState(initialNotes);
  const [enterpriseList, setEnterpriseList] = useState<EnterpriseData[]>([]);
  const [selectedEnterprise, setSelectedEnterprise] = useState<EnterpriseData | null>(null);
  const [isLoadingClinics, setIsLoadingClinics] = useState(false);
  const [clinicError, setClinicError] = useState<string | null>(null);
  const [allTemplates, setAllTemplates] = useState<TemplateData[]>([]);
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);
  const [templateError, setTemplateError] = useState<string | null>(null);
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([]);

  // --- ADDED: State for Save Template Modal ---
  const [isSaveTemplateModalOpen, setIsSaveTemplateModalOpen] = useState(false);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false); // Loading state for template save


  // --- Fetch Clinics ---
  const fetchEnterprises = useCallback(() => {
    // ... (fetchEnterprises function remains the same)
    if (!userUid) return;
    setIsLoadingClinics(true);
    setClinicError(null);
    getEnterprisesByUid(userUid)
      .then((fetchedList) => {
        setEnterpriseList(fetchedList);
        if (fetchedList.length > 0) {
          setSelectedEnterprise(fetchedList[0]);
        } else {
          setSelectedEnterprise(null);
        }
      })
      .catch((err) => {
        console.error("Error fetching clinics:", err);
        setClinicError(err.message || "Failed to load clinics.");
        setEnterpriseList([]);
        setSelectedEnterprise(null);
      })
      .finally(() => setIsLoadingClinics(false));
  }, [userUid]);

  // --- Reset Form on Modal Open / User Change ---
  useEffect(() => {
    // ... (useEffect logic remains the same)
    if (isOpen && userUid) {
      setMedications(initialMedications); // Reset meds
      setAdvice(initialAdvice);
      setNotes(initialNotes);
      setSelectedTemplateIds([]); // Reset template selection
      setIsSaveTemplateModalOpen(false); // Ensure name modal is closed
      setIsSavingTemplate(false);      // Reset template saving state
      fetchEnterprises(); // Fetch clinics (will also set default)

      // Fetch templates
      setIsTemplateLoading(true);
      setTemplateError(null);
      getUserTemplates(userUid)
        .then(setAllTemplates)
        .catch((err) => {
          console.error("Error fetching templates:", err);
          setTemplateError(err.message || "Failed to load templates.");
          setAllTemplates([]);
        })
        .finally(() => setIsTemplateLoading(false));
    } else if (!isOpen) {
      // Optional cleanup when closing
      setMedications([]);
      setAdvice(initialAdvice);
      setNotes(initialNotes);
      setSelectedEnterprise(null);
      setEnterpriseList([]);
      setAllTemplates([]);
      setSelectedTemplateIds([]);
      setClinicError(null);
      setTemplateError(null);
      setIsSaveTemplateModalOpen(false); // Ensure name modal is closed on outer close
      setIsSavingTemplate(false);
    }
  }, [isOpen, userUid, fetchEnterprises]);

  // --- Clinic Change Handler ---
  const handleClinicChange = (clinicId: string) => {
    // ... (handleClinicChange function remains the same)
    const newSelected = enterpriseList.find(
      (clinic) => clinic.id === clinicId
    );
    setSelectedEnterprise(newSelected || null);
  };

  // --- Medication handlers ---
  const handleMedicationChange = (id: string, field: keyof Medication, value: string) => {
    // ... (handleMedicationChange function remains the same)
    setMedications((currentMeds) =>
      currentMeds.map((med) => (med.id === id ? { ...med, [field]: value } : med))
    );
  };
  const addMedicationRow = () => {
    // ... (addMedicationRow function remains the same)
    const newId = crypto.randomUUID();
    setMedications([...medications, { id: newId, name: "", regimen: "", mealTime: "After Meal", duration: "30 Days", frequency: "Daily", remarks: "" }]);
  };
  const removeMedicationRow = (id: string) => {
    // ... (removeMedicationRow function remains the same)
    setMedications((currentMeds) => currentMeds.filter((med) => med.id !== id));
  };

  // --- Template Toggle Handler ---
  const handleTemplateToggle = (templateId: string, isChecked: boolean) => {
    // ... (handleTemplateToggle function remains the same)
    setTemplateError(null); // Clear errors on interaction
    if (isChecked) {
      const template = allTemplates.find((t) => t.id === templateId);
      if (!template) {
        setTemplateError("Could not find selected template.");
        return;
      }
      const existingIds = new Set(medications.map(m => m.id));
      const newMedsFromTemplate = template.medications
        .filter(med => med.id && !existingIds.has(med.id)) // Skip missing IDs & duplicates
        .map((med) => ({
          ...med,
          id: med.id,
          sourceTemplateId: templateId,
          name: med.name || "",
          regimen: med.regimen || "",
          mealTime: med.mealTime || "After Meal",
          duration: med.duration || "",
          frequency: med.frequency || "Daily",
          remarks: med.remarks || "",
        }));
      const skippedCount = template.medications.length - newMedsFromTemplate.length;
      if (skippedCount > 0) {
        console.warn(`Skipped ${skippedCount} medication(s) from template '${template.templateName}' due to missing IDs or duplicates.`);
      }
      setMedications((currentMeds) => [...currentMeds, ...newMedsFromTemplate]);
      setSelectedTemplateIds((prev) => [...prev, templateId]);
    } else {
      setMedications((currentMeds) =>
        currentMeds.filter((med) => med.sourceTemplateId !== templateId)
      );
      setSelectedTemplateIds((prev) =>
        prev.filter((id) => id !== templateId)
      );
    }
  };

  // --- Save Prescription Handler ---
  const handleSavePrescription = () => {
    // Renamed from handleSaveChanges for clarity
    // ... (logic remains the same as previous handleSaveChanges)
    const filledMedications = medications.filter(med => med.name.trim() !== '');
    const finalPrescription = {
      userUid: userUid,
      clinicId: selectedEnterprise?.id || null,
      clinicName: selectedEnterprise?.hospitalName || null,
      medications: filledMedications.map(({ id, sourceTemplateId, ...rest }) => rest), // Strip local fields
      advice,
      notes,
      createdAt: new Date().toISOString(),
    };

    if (!finalPrescription.clinicId) {
      setClinicError("Please select a clinic.");
      return;
    }
    console.log("Saving Prescription:", finalPrescription);
    // TODO: Add actual Firebase save logic here
    onClose(true);
  };

  // --- ADDED: Handlers for Save As Template ---
  const handleOpenSaveTemplateModal = () => {
    const filledMedications = medications.filter(med => med.name.trim() !== '');
    if (filledMedications.length === 0) {
      // Optionally show an error that you can't save an empty template
      setTemplateError("Cannot save an empty medication list as a template.");
      return;
    }
    setTemplateError(null); // Clear previous errors
    setIsSaveTemplateModalOpen(true);
  };

  const handleSaveAsTemplate = async (templateName: string) => {
    // This function is passed to SaveTemplateNameModal
    const filledMedications = medications.filter(med => med.name.trim() !== '');

    if (filledMedications.length === 0) {
      // This check is slightly redundant due to the check in handleOpenSaveTemplateModal, but good for safety
      throw new Error("Cannot save an empty medication list."); // Throw error to be caught by name modal
    }

    const templateMeds = filledMedications.map(({ sourceTemplateId, ...rest }) => rest); // Strip local fields

    setIsSavingTemplate(true);
    try {
      await addTemplate({
        templateName: templateName,
        medications: templateMeds,
        userUid: userUid, // Make sure userUid is correct
      });
      console.log("Template saved successfully:", templateName);
      setIsSaveTemplateModalOpen(false); // Close name modal on success

      // Optionally show a success toast/message here
    } catch (error: any) {
      console.error("Failed to save template:", error);
      // Rethrow the error so it's displayed in the SaveTemplateNameModal
      throw new Error(error.message || "An unknown error occurred while saving the template.");
    } finally {
      setIsSavingTemplate(false);
    }
  };
  // --- END ADDED Handlers ---

  const selectedTemplateCount = selectedTemplateIds.length;

  return (
    <> {/* Use Fragment to render multiple top-level elements */}
      <Dialog open={isOpen} onOpenChange={() => onClose()}>
        <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto p-8">
          {/* === HEADER (Previous Style) === */}
          {/* ... (Header JSX remains the same) ... */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold">Medical Prescription</h1>
              <Select
                value={selectedEnterprise?.id || ""}
                onValueChange={handleClinicChange}
                disabled={isLoadingClinics || enterpriseList.length === 0}
              >
                <SelectTrigger className="w-[250px]">
                  {isLoadingClinics ? (
                    <span className="flex items-center text-muted-foreground">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading Clinics...
                    </span>
                  ) : (
                    <SelectValue placeholder="Select a Clinic *" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {enterpriseList.length === 0 && !isLoadingClinics ? (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">No clinics found.</div>
                  ) : (
                    enterpriseList.map((clinic) => (
                      <SelectItem key={clinic.id} value={clinic.id}>
                        {clinic.hospitalName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {clinicError && <p className="text-sm text-red-500">{clinicError}</p>}
            </div>
            <div className="text-right text-xs text-muted-foreground min-w-[200px]">
              {selectedEnterprise ? (
                <>
                  <p className="font-bold text-base text-black">
                    {selectedEnterprise.doctorName}
                  </p>
                  <p>License no: {selectedEnterprise.licenseNumber}</p>
                </>
              ) : !isLoadingClinics ? (
                enterpriseList.length > 0 ? <p>Select Clinic</p> : <p>No clinics available.</p>
              ) : null}
            </div>
          </div>
          <Separator className="my-4" />

          {/* === PATIENT INFO (Previous 5-Col Style) === */}
          {/* ... (Patient Info JSX remains the same) ... */}
          <div className="grid grid-cols-5 gap-x-4 gap-y-1 text-sm">
            <div className="font-semibold">Patient</div>
            <div className="font-semibold">Weight</div>
            <div className="font-semibold">Height</div>
            <div className="font-semibold">BMI</div>
            <div className="font-semibold">Date</div>
            <div>Salman (M, None yrs)</div>
            <div><span className="italic text-muted-foreground">[Redacted] Kg</span></div>
            <div><span className="italic text-muted-foreground">[Redacted] m</span></div>
            <div><span className="italic text-muted-foreground">[Redacted]</span></div>
            <div>{new Date().toLocaleDateString('en-IN')}</div>
          </div>
          <Separator className="my-4" />

          {/* === PATIENT HISTORY / DIAGNOSIS (Placeholders) === */}
          {/* ... (History/Diagnosis JSX remains the same) ... */}
          <div className="space-y-1">
            <h4 className="font-semibold text-red-600">Patient History</h4>
            <p className="text-sm italic text-muted-foreground">
              [Patient history details redacted]
            </p>
          </div>
          <Separator className="my-4" />
          <div className="space-y-1">
            <h4 className="font-semibold text-red-600">Diagnosis</h4>
            <p className="text-sm italic text-muted-foreground">
              [Diagnosis details redacted]
            </p>
          </div>
          <Separator className="my-4" />

          {/* === Rx SECTION === */}
          {/* ... (Rx Section JSX remains largely the same, including the multi-select dropdown) ... */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Rx</h3>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[220px] justify-between"
                      disabled={isTemplateLoading || allTemplates.length === 0}
                    >
                      {isTemplateLoading ? (
                        <span className="flex items-center text-muted-foreground">
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading...
                        </span>
                      ) : (
                        <span className="truncate">
                          {selectedTemplateCount === 0 ? "Load from Template" : `${selectedTemplateCount} Template(s) Selected`}
                        </span>
                      )}
                      <ChevronDown className="h-4 w-4 opacity-50 ml-2 flex-shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                    <DropdownMenuLabel>Medication Templates</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {allTemplates.length > 0 ? (
                      allTemplates.map((template) => (
                        <DropdownMenuCheckboxItem
                          key={template.id}
                          checked={selectedTemplateIds.includes(template.id)}
                          onCheckedChange={(checked) => handleTemplateToggle(template.id, !!checked)}
                          onSelect={(e) => e.preventDefault()}
                        >
                          {template.templateName}
                        </DropdownMenuCheckboxItem>
                      ))
                    ) : (
                      <DropdownMenuLabel className="font-normal text-muted-foreground px-2 py-1.5 text-sm">
                        No templates found.
                      </DropdownMenuLabel>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" size="sm" onClick={addMedicationRow} className="flex-shrink-0">
                  <PlusCircle className="h-4 w-4 mr-2" /> Add Medicine
                </Button>
              </div>
            </div>
            {templateError && <p className="text-sm text-red-500 text-right mt-1">{templateError}</p>}
            <div className="border rounded-md overflow-x-auto">
              <Table className="min-w-[900px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead className="min-w-[200px]">Medicine Name</TableHead>
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
                      <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">No medications added.</TableCell>
                    </TableRow>
                  ) : (
                    medications.map((med, index) => (
                      <TableRow key={med.id}>
                        <TableCell className="text-center">{index + 1}</TableCell>
                        <TableCell><Input value={med.name} placeholder="Medicine Name" onChange={(e) => handleMedicationChange(med.id, "name", e.target.value)} /></TableCell>
                        <TableCell><Input value={med.regimen} placeholder="e.g., 1-0-1" onChange={(e) => handleMedicationChange(med.id, "regimen", e.target.value)} /></TableCell>
                        <TableCell>
                          <Select value={med.mealTime} onValueChange={(v: any) => handleMedicationChange(med.id, "mealTime", v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="After Meal">After Meal</SelectItem>
                              <SelectItem value="Before Meal">Before Meal</SelectItem>
                              <SelectItem value="With Meal">With Meal</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell><Input value={med.duration} placeholder="e.g., 30 Days" onChange={(e) => handleMedicationChange(med.id, "duration", e.target.value)} /></TableCell>
                        <TableCell>
                          <Select value={med.frequency} onValueChange={(v: any) => handleMedicationChange(med.id, "frequency", v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Daily">Daily</SelectItem>
                              <SelectItem value="Weekly">Weekly</SelectItem>
                              <SelectItem value="Twice a day">Twice a day</SelectItem>
                              <SelectItem value="As needed">As needed</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell><Input value={med.remarks} placeholder="Optional" onChange={(e) => handleMedicationChange(med.id, "remarks", e.target.value)} /></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => removeMedicationRow(med.id)} className="h-8 w-8">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>


          {/* === ADVICE & NOTES === */}
          {/* ... (Advice & Notes JSX remains the same) ... */}
          <div className="space-y-4 mt-6">
            <div className="space-y-1">
              <h4 className="font-semibold">Advice</h4>
              <Textarea value={advice} onChange={(e) => setAdvice(e.target.value)} rows={3} placeholder="Enter advice..." />
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold">Notes</h4>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Enter notes..." />
            </div>
          </div>

          {/* === FOOTER === */}
          <DialogFooter className="mt-6">
            <Button type="button" variant="secondary" onClick={() => onClose()}>
              Cancel
            </Button>
            {/* --- MODIFIED: Save As Template Button --- */}
            <Button
              type="button"
              variant="outline" // Changed variant
              onClick={handleOpenSaveTemplateModal}
              disabled={medications.filter(med => med.name.trim() !== '').length === 0 || isSavingTemplate} // Disable if no meds or saving
            >
              Save As Template
            </Button>
            <Button
              type="button"
              onClick={handleSavePrescription} // Changed handler name
              // Optionally disable print/save prescription if saving template
              disabled={true}
            >
              Print {/* Assuming this button saves and triggers print */}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- ADDED: Render the SaveTemplateNameModal --- */}
      <SaveTemplateNameModal
        isOpen={isSaveTemplateModalOpen}
        onClose={() => setIsSaveTemplateModalOpen(false)}
        onSave={handleSaveAsTemplate}
        isLoading={isSavingTemplate} // Pass loading state down
      />
    </>
  );
}