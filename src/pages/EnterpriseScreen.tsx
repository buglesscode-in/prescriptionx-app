// src/pages/EnterpriseScreen.tsx

import { useState, useEffect, useCallback } from 'react';
import {
  getEnterprisesByUid,
  softDeleteEnterprise,
  EnterpriseData,
} from '@/firebase/enterpriseService';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { Edit, Trash2, PlusCircle, Loader2 } from 'lucide-react';
import EnterpriseFormModal from '@/components/EnterpriseFormModal';
import { useAuth } from '@/context/authContextDefinition';

// Define initial state for a clean form

export default function EnterpriseScreen() {
  const { currentUser } = useAuth();
  const [enterprises, setEnterprises] = useState<EnterpriseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEnterprise, setEditingEnterprise] = useState<EnterpriseData | null>(null);

  // State for Alert Dialog Confirmation
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string; name: string } | null>(
    null
  );

  // --- Data Fetcher ---
  const fetchEnterprises = useCallback(() => {
    if (!currentUser?.uid) return;

    setLoading(true);
    getEnterprisesByUid(currentUser.uid)
      .then(setEnterprises)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [currentUser]);

  useEffect(() => {
    fetchEnterprises();
  }, [fetchEnterprises]);

  // --- Handlers ---
  const handleEdit = (enterprise: EnterpriseData) => {
    setEditingEnterprise(enterprise);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingEnterprise(null);
    setIsModalOpen(true);
  };

  // Prepares the Alert Dialog state
  const prepareSoftDelete = (id: string, hospitalName: string) => {
    setDeleteConfirmation({ id, name: hospitalName });
  };

  // Executes deletion after user confirms in the AlertDialog
  const executeSoftDelete = async () => {
    if (!deleteConfirmation) return;

    const { id, name } = deleteConfirmation;

    try {
      await softDeleteEnterprise(id);

      // Optimistically update the UI
      setEnterprises((prev) => prev.filter((e) => e.id !== id));
      setError(null);
    } catch (err: any) {
      setError(err.message || `Failed to archive profile: ${name}.`);
    } finally {
      setDeleteConfirmation(null); // Close the confirmation dialog
    }
  };

  const handleModalClose = (success?: boolean) => {
    setIsModalOpen(false);
    setEditingEnterprise(null);
    if (success) {
      fetchEnterprises();
    }
  };

  if (loading)
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        <p className="text-xl text-gray-600 dark:text-gray-400">Loading Enterprise List...</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-0 md:mx-auto space-y-4 p-0">
      {/* Table Header and Create Button (Responsive Stacking) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 space-y-4 sm:space-y-0">
        <h2 className="text-2xl sm:text-3xl font-bold">Managed Enterprise Profiles</h2>
        <Button onClick={handleCreate} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Profile
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900 border border-destructive rounded-md text-destructive dark:text-red-300">
          Error: {error}
        </div>
      )}

      {/* Enterprise Table (Responsive Scroll) */}
      <div className="border rounded-lg overflow-x-auto">
        <Table className="min-w-full">
          {' '}
          {/* min-w-full ensures it takes full width for scroll */}
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Hospital Name</TableHead>
              {/* 💥 HIDDEN ON MOBILE 💥 */}
              <TableHead className="hidden sm:table-cell">Doctor</TableHead>
              <TableHead className="hidden sm:table-cell">License No.</TableHead>
              <TableHead className="w-[120px] sm:w-[150px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enterprises.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No active enterprise profiles found.
                </TableCell>
              </TableRow>
            ) : (
              enterprises.map((enterprise) => (
                <TableRow key={enterprise.id}>
                  <TableCell className="font-medium">{enterprise.hospitalName}</TableCell>
                  {/* 💥 HIDDEN ON MOBILE 💥 */}
                  <TableCell className="hidden sm:table-cell">{enterprise.doctorName}</TableCell>
                  <TableCell className="hidden sm:table-cell">{enterprise.licenseNumber}</TableCell>

                  {/* Action Buttons (Condensed on Mobile) */}
                  <TableCell className="text-right space-x-1 sm:space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(enterprise)}>
                      <Edit className="h-4 w-4" />
                    </Button>

                    {enterprise.id && (
                      <Button
                        variant="destructive"
                        size="icon" // 💥 Change to icon size 💥
                        onClick={() => prepareSoftDelete(enterprise.id!, enterprise.hospitalName)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Form Modal */}
      <EnterpriseFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        initialData={editingEnterprise}
        userUid={currentUser?.uid || ''}
      />

      {/* ALERT DIALOG COMPONENT */}
      <AlertDialog open={!!deleteConfirmation} onOpenChange={() => setDeleteConfirmation(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete the profile for
              <span className="font-semibold text-destructive"> {deleteConfirmation?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeSoftDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Yes, Soft Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
