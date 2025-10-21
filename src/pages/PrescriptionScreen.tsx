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
import { PrescriptionFormModal } from '@/components/PrescriptionFormModal';

// Define initial state for a clean form

export default function PrescriptionScreen() {
  const { currentUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // State for Modals
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-0 md:mx-auto space-y-4 p-0">
      {/* Table Header and Create Button (Responsive Stacking) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 space-y-4 sm:space-y-0">
        <h2 className="text-2xl sm:text-3xl font-bold">Managed Enterprise Profiles</h2>
        <Button onClick={handleCreate} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Prescription
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900 border border-destructive rounded-md text-destructive dark:text-red-300">
          Error: {error}
        </div>
      )}

      {/* Form Modal */}
      {/* <EnterpriseFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        initialData={editingEnterprise}
        userUid={currentUser?.uid || ''}
      /> */}
      <PrescriptionFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        userUid={currentUser?.uid || ''}
      />

    </div>
  );
}
