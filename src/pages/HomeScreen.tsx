// src/pages/TemplateScreen.tsx
// (This is the corrected version of your EnterpriseScreen.tsx)

import { useState, useEffect, useCallback } from 'react';
import {
  // ADDED: Template service functions
  getUserTemplates,
  deleteTemplate,
} from '@/firebase/templateService'; // <-- MODIFIED: Import from template service
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
import { useAuth } from '@/context/authContextDefinition';
import { TemplateData } from '@/interfaces/template';
// MODIFIED: Import the modal AND the Medication type
import { TemplateModal } from '@/components/TemplateModal';

// ADDED: Define the Template data type, including the Firestore 'id'

export default function TemplateScreen() {
  const { currentUser } = useAuth();
  const [templates, setTemplates] = useState<TemplateData[]>([]); // <-- MODIFIED
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TemplateData | null>(null); // <-- MODIFIED

  // State for Alert Dialog Confirmation
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string; name: string } | null>(
    null
  );

  // --- Data Fetcher ---
  const fetchTemplates = useCallback(() => { // <-- MODIFIED
    if (!currentUser?.uid) return;

    setLoading(true);
    getUserTemplates(currentUser.uid) // <-- MODIFIED
      .then((data) => {
        setTemplates(data);
      }) // <-- MODIFIED
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [currentUser]);

  useEffect(() => {
    fetchTemplates(); // <-- MODIFIED
  }, [fetchTemplates]);

  // --- Handlers ---
  const handleEdit = (template: TemplateData) => { // <-- MODIFIED
    setEditingTemplate(template); // <-- MODIFIED
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingTemplate(null); // <-- MODIFIED
    setIsModalOpen(true);
  };

  // Prepares the Alert Dialog state
  const prepareDelete = (id: string, templateName: string) => { // <-- MODIFIED
    setDeleteConfirmation({ id, name: templateName });
  };

  // Executes deletion after user confirms in the AlertDialog
  const executeDelete = async () => { // <-- MODIFIED
    if (!deleteConfirmation) return;

    const { id, name } = deleteConfirmation;

    try {
      await deleteTemplate(id); // <-- MODIFIED (using hard delete)

      // Optimistically update the UI
      setTemplates((prev) => prev.filter((t) => t.id !== id)); // <-- MODIFIED
      setError(null);
    } catch (err: any) {
      setError(err.message || `Failed to delete template: ${name}.`);
    } finally {
      setDeleteConfirmation(null); // Close the confirmation dialog
    }
  };

  // MODIFIED: Simplified close handler. Modal closes itself, we just refetch.
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTemplate(null);
    fetchTemplates(); // Always refetch data on close
  };

  if (loading)
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        <p className="text-xl text-gray-600 dark:text-gray-400">Loading Templates...</p> {/* MODIFIED */}
      </div>
    );

  return (
    <div className="max-w-6xl mx-0 md:mx-auto space-y-4 p-0">
      {/* Table Header and Create Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 space-y-4 sm:space-y-0">
        <h2 className="text-2xl sm:text-3xl font-bold">Managed Templates</h2>
        <Button onClick={handleCreate} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Template
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900 border border-destructive rounded-md text-destructive dark:text-red-300">
          Error: {error}
        </div>
      )}

      {/* Template Table */}
      <div className="border rounded-lg overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-muted/50">
              {/* MODIFIED Table Headers */}
              <TableHead>Template Name</TableHead>
              <TableHead className="hidden sm:table-cell">Medications</TableHead>
              <TableHead className="w-[120px] sm:w-[150px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.length === 0 ? ( // <-- MODIFIED
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground"> {/* MODIFIED colSpan */}
                  No templates found.
                </TableCell>
              </TableRow>
            ) : (
              templates.map((template) => ( // <-- MODIFIED
                <TableRow key={template.id}>
                  {/* MODIFIED Table Cells */}
                  <TableCell className="font-medium">{template.templateName}</TableCell>
                  <TableCell className="hidden sm:table-cell">{template.medications.length}</TableCell>
                  <TableCell className="text-right space-x-1 sm:space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(template)}> {/* MODIFIED */}
                      <Edit className="h-4 w-4" />
                    </Button>

                    {template.id && (
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => prepareDelete(template.id!, template.templateName)} // <-- MODIFIED
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
      <TemplateModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        userUid={currentUser?.uid || ''}
        editingTemplate={editingTemplate} // <-- ADDED: Pass editing data to modal
      />

      {/* ALERT DIALOG COMPONENT */}
      <AlertDialog open={!!deleteConfirmation} onOpenChange={() => setDeleteConfirmation(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the template:
              <span className="font-semibold text-destructive"> {deleteConfirmation?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDelete} // <-- MODIFIED
              className="bg-destructive hover:bg-destructive/90"
            >
              Yes, Delete {/* MODIFIED */}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}