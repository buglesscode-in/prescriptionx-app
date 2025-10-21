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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "@/context/authContextDefinition";
import { getEnterprisesByUid } from "@/firebase/prescriptionService";
import { EnterpriseData } from "@/interfaces/enterprise";

type Medication = {
  id: number;
  name: string;
  regimen: string;
  mealTime: "Before Meal" | "After Meal" | "With Meal";
  duration: string;
  frequency: "Daily" | "Weekly" | "Twice a day" | "As needed";
  remarks: string;
};

// --- Component Props ---
interface PrescriptionFormModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  userUid: string;
}

// --- Initial Data ---
const initialMedications: Medication[] = [
  { id: 1, name: "Glyciphage sr 500mg", regimen: "Morning Night", mealTime: "After Meal", duration: "30 Days", frequency: "Daily", remarks: "No Remarks" },
  { id: 2, name: "Quick d3 nano shots (60k)", regimen: "Morning", mealTime: "Before Meal", duration: "30 Days", frequency: "Weekly", remarks: "No Remarks" },
  { id: 3, name: "Nutraliebe chromium picolinate 500mcg capsule", regimen: "Afternoon Night", mealTime: "After Meal", duration: "30 Days", frequency: "Daily", remarks: "No Remarks" },
  { id: 4, name: "Ubicar", regimen: "Afternoon", mealTime: "After Meal", duration: "30 Days", frequency: "Daily", remarks: "No Remarks" },
  { id: 5, name: "Febutac 40mg tablet", regimen: "Morning", mealTime: "After Meal", duration: "30 Days", frequency: "Daily", remarks: "No Remarks" },
];

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
  // --- State Management ---
  const { currentUser } = useAuth();

  const [medications, setMedications] =
    useState<Medication[]>(initialMedications);
  const [advice, setAdvice] = useState(initialAdvice);
  const [notes, setNotes] = useState(initialNotes);

  // --- State for Clinics ---
  const [enterpriseList, setEnterpriseList] = useState<EnterpriseData[]>([]);
  const [selectedEnterprise, setSelectedEnterprise] =
    useState<EnterpriseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const fetchEnterprises = useCallback(() => {
    if (!currentUser?.uid) return;

    setIsLoading(true);
    setError(null); // Clear previous errors
    getEnterprisesByUid(currentUser.uid)
      .then((fetchedList) => {
        setEnterpriseList(fetchedList);
        // --- Set Default Selection ---
        if (fetchedList.length > 0) {
          setSelectedEnterprise(fetchedList[0]); // Select the first clinic
        } else {
          setSelectedEnterprise(null); // Handle empty list case
        }
      })
      .catch((err) => {
        setError(err.message);
        setEnterpriseList([]); // Clear list on error
        setSelectedEnterprise(null); // Clear selection on error
      })
      .finally(() => setIsLoading(false));
  }, [currentUser]);

  // --- Reset Form on Modal Open ---
  useEffect(() => {
    if (isOpen) {
      // 1. Reset all form fields to their initial state
      setMedications(initialMedications);
      setAdvice(initialAdvice);
      setNotes(initialNotes);

      // 2. Fetch clinic data (which will now also set the default)
      fetchEnterprises();
    }
  }, [isOpen, fetchEnterprises]); // Runs whenever modal is opened

  // --- Clinic Change Handler ---
  const handleClinicChange = (id: string) => { // Parameter is 'id'
    const newSelected = enterpriseList.find(
      (clinic) => clinic.id === id // Find by ID
    );
    if (newSelected) {
      setSelectedEnterprise(newSelected);
    }
  };

  // --- (Medication handlers remain the same) ---
  const handleMedicationChange = (id: number, field: keyof Medication, value: string) => {
    setMedications((currentMeds) =>
      currentMeds.map((med) => (med.id === id ? { ...med, [field]: value } : med))
    );
  };
  const addMedicationRow = () => {
    const newId = Math.max(0, ...medications.map((m) => m.id)) + 1;
    setMedications([...medications, { id: newId, name: "", regimen: "", mealTime: "After Meal", duration: "30 Days", frequency: "Daily", remarks: "" }]);
  };
  const removeMedicationRow = (id: number) => {
    setMedications((currentMeds) => currentMeds.filter((med) => med.id !== id));
  };

  // --- Save Handler ---
  const handleSaveChanges = () => {
    const finalPrescription = {
      userUid: userUid,
      clinicId: selectedEnterprise?.id,
      clinicName: selectedEnterprise?.hospitalName,
      medications,
      advice,
      notes,
    };
    console.log("Saving Prescription:", finalPrescription);
    onClose(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto p-8">
        {/* === HEADER === */}
        <div className="flex justify-between items-start">
          {/* Left Side: Title + Dropdown */}
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">Medical Prescription</h1>
            <Select
              value={selectedEnterprise?.id} // Use ID
              onValueChange={handleClinicChange}
              disabled={isLoading || enterpriseList.length === 0}
            >
              <SelectTrigger className="w-[250px]">
                {isLoading ? (
                  <span className="flex items-center text-muted-foreground">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading Clinics...
                  </span>
                ) : (
                  <SelectValue placeholder="Select a Clinic" />
                )}
              </SelectTrigger>
              <SelectContent>
                {enterpriseList.map((clinic) => (
                  <SelectItem key={clinic.id} value={clinic.id}> {/* Use ID */}
                    {clinic.hospitalName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          {/* Right Side: Dynamic Doctor Info (using your fields) */}
          <div className="text-right text-xs text-muted-foreground min-w-[200px]">
            {selectedEnterprise ? (
              <>
                <p className="font-bold text-base text-black">
                  {selectedEnterprise.doctorName}
                </p>
                <p>License no: {selectedEnterprise.licenseNumber}</p>
              </>
            ) : !isLoading ? (
              <p>No clinic selected.</p>
            ) : null}
          </div>
        </div>
        {/* === END HEADER === */}

        <Separator className="my-4" />

        {/* === PATIENT INFO (Corrected 2-Row Layout) === */}
        <div className="grid grid-cols-5 gap-x-4 gap-y-1 text-sm">
          {/* Row 1: Labels */}
          <div className="font-semibold">Patient</div>
          <div className="font-semibold">Weight</div>
          <div className="font-semibold">Height</div>
          <div className="font-semibold">BMI</div>
          <div className="font-semibold">Date</div>

          {/* Row 2: Values */}
          <div>Salman (M, None yrs)</div>
          <div><span className="italic text-muted-foreground">[Redacted] Kg</span></div>
          <div><span className="italic text-muted-foreground">[Redacted] m</span></div>
          <div><span className="italic text-muted-foreground">[Redacted]</span></div>
          <div>24.09.2025</div>
        </div>

        <Separator className="my-4" />

        {/* === PATIENT HISTORY === */}
        <div className="space-y-1">
          <h4 className="font-semibold text-red-600">Patient History</h4>
          <p className="text-sm italic text-muted-foreground">
            [Patient history details redacted]
          </p>
        </div>

        <Separator className="my-4" />

        {/* === DIAGNOSIS === */}
        <div className="space-y-1">
          <h4 className="font-semibold text-red-600">Diagnosis</h4>
          <p className="text-sm italic text-muted-foreground">
            [Diagnosis details redacted]
          </p>
        </div>

        <Separator className="my-4" />

        {/* === Rx (EDITABLE TABLE) === */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Rx</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={addMedicationRow}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Medicine
            </Button>
          </div>

          <div className="border rounded-md">
            <Table>
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
                {medications.map((med, index) => (
                  <TableRow key={med.id}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell>
                      <Input
                        value={med.name}
                        onChange={(e) =>
                          handleMedicationChange(med.id, "name", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={med.regimen}
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
                        onValueChange={(
                          value: "Before Meal" | "After Meal" | "With Meal"
                        ) => handleMedicationChange(med.id, "mealTime", value)}
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
                        value={med.duration}
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
                        onValueChange={(
                          value:
                            | "Daily"
                            | "Weekly"
                            | "Twice a day"
                            | "As needed"
                        ) =>
                          handleMedicationChange(med.id, "frequency", value)
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
                          <SelectItem value="As needed">As needed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={med.remarks}
                        onChange={(e) =>
                          handleMedicationChange(
                            med.id,
                            "remarks",
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMedicationRow(med.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* === ADVICE & NOTES (EDITABLE - Matches Image Layout) === */}
        <div className="space-y-4 mt-6">
          <div className="space-y-1">
            <h4 className="font-semibold">Advice</h4>
            <Textarea
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-1">
            <h4 className="font-semibold">Notes</h4>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
            <p className="text-sm font-semibold underline pt-1">
              Do not discontinue or change dosage without medical supervision.
            </p>
          </div>
        </div>

        {/* === FOOTER === */}
        <DialogFooter className="mt-6">
          <Button type="button" variant="secondary" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}