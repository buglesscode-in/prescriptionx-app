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
import { getEnterprisesByUid } from "@/firebase/prescriptionService";
import { EnterpriseData } from "@/interfaces/enterprise";
import { getUserTemplates, addTemplate } from "@/firebase/templateService";
import { TemplateData, MedicationData } from "@/interfaces/template";
import { SaveTemplateNameModal } from "@/components/SaveTemplateNameModal";

type Medication = MedicationData & {
  sourceTemplateId?: string;
};

// --- Component Props ---
interface PrescriptionFormModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  userUid: string;
}

// --- Initial Data ---
const initialMedications: Medication[] = [];

// --- The Modal Component ---
export function PrescriptionFormModal({
  isOpen,
  onClose,
  userUid,
}: PrescriptionFormModalProps) {
  // --- State ---
  const [medications, setMedications] =
    useState<Medication[]>([]);
  const [advice, setAdvice] = useState("");
  const [notes, setNotes] = useState("");
  const [enterpriseList, setEnterpriseList] = useState<EnterpriseData[]>([]);
  const [selectedEnterprise, setSelectedEnterprise] =
    useState<EnterpriseData | null>(null);
  const [isLoadingClinics, setIsLoadingClinics] = useState(false);
  const [clinicError, setClinicError] = useState<string | null>(null);
  const [allTemplates, setAllTemplates] = useState<TemplateData[]>([]);
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);
  const [templateError, setTemplateError] = useState<string | null>(null);
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([]);

  // --- State for Save Template Modal ---
  const [isSaveTemplateModalOpen, setIsSaveTemplateModalOpen] = useState(false);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);

  // --- State for Patient Info ---
  const [patientDetails, setPatientDetails] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientWeight, setPatientWeight] = useState("");
  const [patientHeight, setPatientHeight] = useState("");
  const [patientBmi, setPatientBmi] = useState("");

  // --- Fetch Clinics ---
  const fetchEnterprises = useCallback(() => {
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
    if (isOpen && userUid) {
      setMedications(initialMedications);
      setAdvice("");
      setNotes("");
      setSelectedTemplateIds([]);

      setPatientDetails("");
      setPatientAge("");
      setPatientWeight("");
      setPatientHeight("");
      setPatientBmi("");

      setIsSaveTemplateModalOpen(false);
      setIsSavingTemplate(false);
      fetchEnterprises();

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
      setAdvice("");
      setNotes("");
      setSelectedEnterprise(null);
      setEnterpriseList([]);
      setAllTemplates([]);
      setSelectedTemplateIds([]);
      setClinicError(null);
      setTemplateError(null);

      setPatientDetails("");
      setPatientAge("");
      setPatientWeight("");
      setPatientHeight("");
      setPatientBmi("");

      setIsSaveTemplateModalOpen(false);
      setIsSavingTemplate(false);
    }
  }, [isOpen, userUid, fetchEnterprises]);

  // --- Clinic Change Handler ---
  const handleClinicChange = (clinicId: string) => {
    const newSelected = enterpriseList.find(
      (clinic) => clinic.id === clinicId
    );
    setSelectedEnterprise(newSelected || null);
  };

  // --- Medication handlers ---

  // --- THIS IS THE MODIFIED FUNCTION ---
  const handleMedicationChange = (
    id: string,
    field: keyof Medication,
    value: string
  ) => {

    if (field === "regimen") {
      // 1. Filter: Allow only '0' and '1'
      let filteredDigits = value.replace(/[^01]/g, '');

      // 2. Truncate to a max of 3 digits
      if (filteredDigits.length > 3) {
        filteredDigits = filteredDigits.substring(0, 3);
      }

      // 3. Re-join them with hyphens
      // Example: "1" -> "1"
      // Example: "11" -> "1-1"
      // Example: "101" -> "1-0-1"
      const formatted = filteredDigits.split('').join('-');

      // 4. Set the new formatted value
      setMedications((currentMeds) =>
        currentMeds.map((med) => (med.id === id ? { ...med, [field]: formatted } : med))
      );

    } else {
      // Default behavior for all other fields
      setMedications((currentMeds) =>
        currentMeds.map((med) => (med.id === id ? { ...med, [field]: value } : med))
      );
    }
  };
  // --- END OF MODIFIED FUNCTION ---

  const addMedicationRow = () => {
    const newId = crypto.randomUUID();
    setMedications([
      ...medications,
      {
        id: newId,
        name: "",
        regimen: "",
        mealTime: "After Meal",
        duration: "30 Days",
        frequency: "Daily",
        remarks: "",
      },
    ]);
  };
  const removeMedicationRow = (id: string) => {
    setMedications((currentMeds) => currentMeds.filter((med) => med.id !== id));
  };

  // --- Template Toggle Handler ---
  const handleTemplateToggle = (templateId: string, isChecked: boolean) => {
    setTemplateError(null);
    if (isChecked) {
      const template = allTemplates.find((t) => t.id === templateId);
      if (!template) {
        setTemplateError("Could not find selected template.");
        return;
      }
      const existingIds = new Set(medications.map((m) => m.id));
      const newMedsFromTemplate = template.medications
        .filter((med) => med.id && !existingIds.has(med.id))
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
      const skippedCount =
        template.medications.length - newMedsFromTemplate.length;
      if (skippedCount > 0) {
        console.warn(
          `Skipped ${skippedCount} medication(s) from template '${template.templateName}' due to missing IDs or duplicates.`
        );
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
    // NOTE: You may want to add validation here to ensure regimen.length === 5
    // e.g., if (med.regimen.length > 0 && med.regimen.length < 5) { ... show error ... }

    const filledMedications = medications.filter(
      (med) => med.name.trim() !== ""
    );
    const finalPrescription = {
      userUid: userUid,
      clinicId: selectedEnterprise?.id || null,
      clinicName: selectedEnterprise?.hospitalName || null,

      patientDetails: patientDetails,
      patientAge: patientAge,
      patientWeight: patientWeight,
      patientHeight: patientHeight,
      patientBmi: patientBmi,

      medications: filledMedications.map(
        ({ id, sourceTemplateId, ...rest }) => rest
      ),
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

  // --- Handlers for Save As Template ---
  const handleOpenSaveTemplateModal = () => {
    const filledMedications = medications.filter(
      (med) => med.name.trim() !== ""
    );
    if (filledMedications.length === 0) {
      setTemplateError("Cannot save an empty medication list as a template.");
      return;
    }
    setTemplateError(null);
    setIsSaveTemplateModalOpen(true);
  };

  const handleSaveAsTemplate = async (templateName: string) => {
    const filledMedications = medications.filter(
      (med) => med.name.trim() !== ""
    );

    if (filledMedications.length === 0) {
      throw new Error("Cannot save an empty medication list.");
    }

    const templateMeds = filledMedications.map(
      ({ sourceTemplateId, ...rest }) => rest
    );

    setIsSavingTemplate(true);
    try {
      await addTemplate({
        templateName: templateName,
        medications: templateMeds,
        userUid: userUid,
      });
      console.log("Template saved successfully:", templateName);
      setIsSaveTemplateModalOpen(false);
    } catch (error: any) {
      console.error("Failed to save template:", error);
      throw new Error(
        error.message ||
        "An unknown error occurred while saving the template."
      );
    } finally {
      setIsSavingTemplate(false);
    }
  };
  // --- END Handlers ---

  const selectedTemplateCount = selectedTemplateIds.length;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => onClose()}>
        <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto p-8">
          {/* === HEADER === */}
          <div className="flex justify-between items-start">
            <div className="flex items-end gap-4">
              <h1 className="text-3xl font-bold">Medical Prescription</h1>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-muted-foreground">
                  Select Enterprise
                </label>
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
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        No clinics found.
                      </div>
                    ) : (
                      enterpriseList.map((clinic) => (
                        <SelectItem key={clinic.id} value={clinic.id}>
                          {clinic.hospitalName}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {clinicError && (
                  <p className="text-sm text-red-500">{clinicError}</p>
                )}
              </div>
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
                enterpriseList.length > 0 ? (
                  <p>Select Clinic</p>
                ) : (
                  <p>No clinics available.</p>
                )
              ) : null}
            </div>
          </div>
          <Separator className="my-4" />

          {/* === PATIENT INFO (MODIFIED for 6-Col & Age) === */}
          <div className="grid grid-cols-6 gap-x-4 gap-y-1 text-sm items-center">
            <div className="font-semibold">Patient</div>
            <div className="font-semibold">Age</div>
            <div className="font-semibold">Weight</div>
            <div className="font-semibold">Height</div>
            <div className="font-semibold">BMI</div>
            <div className="font-semibold">Date</div>
            {/* --- Editable Fields --- */}
            <Input
              value={patientDetails}
              onChange={(e) => setPatientDetails(e.target.value)}
              placeholder="Name"
              className="text-sm h-9"
            />
            <Input
              value={patientAge}
              onChange={(e) => setPatientAge(e.target.value)}
              placeholder="e.g., 30 yrs"
              className="text-sm h-9"
            />
            <Input
              value={patientWeight}
              onChange={(e) => setPatientWeight(e.target.value)}
              placeholder="e.g., 75 Kg"
              className="text-sm h-9"
            />
            <Input
              value={patientHeight}
              onChange={(e) => setPatientHeight(e.target.value)}
              placeholder="e.g., 1.8 m"
              className="text-sm h-9"
            />
            <Input
              value={patientBmi}
              onChange={(e) => setPatientBmi(e.target.value)}
              placeholder="e.g., 23.1"
              className="text-sm h-9"
            />
            <div>{new Date().toLocaleDateString("en-IN")}</div>
          </div>
          <Separator className="my-4" />

          {/* === PATIENT HISTORY / DIAGNOSIS (Placeholders) === */}
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
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                          Loading...
                        </span>
                      ) : (
                        <span className="truncate">
                          {selectedTemplateCount === 0
                            ? "Load from Template"
                            : `${selectedTemplateCount} Template(s) Selected`}
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
                          onCheckedChange={(checked) =>
                            handleTemplateToggle(template.id, !!checked)
                          }
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addMedicationRow}
                  className="flex-shrink-0"
                >
                  <PlusCircle className="h-4 w-4 mr-2" /> Add Medicine
                </Button>
              </div>
            </div>
            {templateError && (
              <p className="text-sm text-red-500 text-right mt-1">
                {templateError}
              </p>
            )}
            <div className="border rounded-md overflow-x-auto">
              <Table className="min-w-[900px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead className="min-w-[200px]">
                      Medicine Name
                    </TableHead>
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
                        colSpan={8}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No medications added.
                      </TableCell>
                    </TableRow>
                  ) : (
                    medications.map((med, index) => (
                      <TableRow key={med.id}>
                        <TableCell className="text-center">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <Input
                            value={med.name}
                            placeholder="Medicine Name"
                            onChange={(e) =>
                              handleMedicationChange(
                                med.id,
                                "name",
                                e.target.value
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={med.regimen}
                            placeholder="e.g., 1-0-1"
                            onChange={(e) =>
                              handleMedicationChange(
                                med.id,
                                "regimen",
                                e.target.value
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={med.mealTime}
                            onValueChange={(v: any) =>
                              handleMedicationChange(med.id, "mealTime", v)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="After Meal">
                                After Meal
                              </SelectItem>
                              <SelectItem value="Before Meal">
                                Before Meal
                              </SelectItem>
                              <SelectItem value="With Meal">
                                With Meal
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            value={med.duration}
                            placeholder="e.g., 30 Days"
                            onChange={(e) =>
                              handleMedicationChange(
                                med.id,
                                "duration",
                                e.target.value
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={med.frequency}
                            onValueChange={(v: any) =>
                              handleMedicationChange(med.id, "frequency", v)
                            }
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
                              <SelectItem value="As needed">
                                As needed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            value={med.remarks}
                            placeholder="Optional"
                            onChange={(e) =>
                              handleMedicationChange(
                                med.id,
                                "remarks",
                                e.target.value
                              )
                            }
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeMedicationRow(med.id)}
                            className="h-8 w-8"
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
          </div>

          {/* === ADVICE & NOTES === */}
          <div className="space-y-4 mt-6">
            <div className="space-y-1">
              <h4 className="font-semibold">Advice</h4>
              <Textarea
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
                rows={3}
                placeholder="Enter advice..."
              />
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold">Notes</h4>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Enter notes..."
              />
            </div>
          </div>

          {/* === FOOTER === */}
          <DialogFooter className="mt-6">
            <Button type="button" variant="secondary" onClick={() => onClose()}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleOpenSaveTemplateModal}
              disabled={
                medications.filter((med) => med.name.trim() !== "").length ===
                0 || isSavingTemplate
              }
            >
              Save As Template
            </Button>
            <Button
              type="button"
              onClick={handleSavePrescription}
              disabled={true} // Still disabled as per original code
            >
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Render the SaveTemplateNameModal --- */}
      <SaveTemplateNameModal
        isOpen={isSaveTemplateModalOpen}
        onClose={() => setIsSaveTemplateModalOpen(false)}
        onSave={handleSaveAsTemplate}
        isLoading={isSavingTemplate}
      />
    </>
  );
}