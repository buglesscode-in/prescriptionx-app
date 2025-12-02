import { useState, useEffect, useCallback } from 'react';
import {
  getEnterprisesByUid,
  softDeleteEnterprise,
  EnterpriseData,
} from '@/firebase/enterpriseService';
import { Button } from '@/components/ui/button';
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { Edit, Trash2, PlusCircle, Loader2, Building2, User, FileBadge } from 'lucide-react';
import EnterpriseFormModal from '@/components/EnterpriseFormModal';
import { useAuth } from '@/context/authContextDefinition';

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

  const prepareSoftDelete = (id: string, hospitalName: string) => {
    setDeleteConfirmation({ id, name: hospitalName });
  };

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
      setDeleteConfirmation(null);
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
      <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-xl font-medium text-muted-foreground">Loading Hospital Settings...</p>
      </div>
    );

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hospital Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your clinic and doctor profiles.</p>
        </div>
        <Button
          onClick={handleCreate}
          size="lg"
          className="gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          <PlusCircle className="h-5 w-5" />
          Create Profile
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive flex items-center gap-2">
          <span>Error: {error}</span>
        </div>
      )}

      {/* Enterprise Grid */}
      {enterprises.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-xl bg-muted/30">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-medium">No profiles found</h3>
          <p className="text-muted-foreground mt-1">
            Create a hospital profile to start generating prescriptions.
          </p>
          <Button variant="link" onClick={handleCreate} className="mt-2 text-primary">
            Create First Profile
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {enterprises.map((enterprise) => (
            <Card
              key={enterprise.id}
              className="group hover:shadow-lg transition-all duration-300 border-muted/60 hover:border-primary/50"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {enterprise.logoUrl ? (
                      <div className="h-14 w-14 rounded-lg border bg-white flex items-center justify-center overflow-hidden p-1 shadow-sm">
                        <img
                          src={enterprise.logoUrl}
                          alt={`${enterprise.hospitalName} logo`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-7 w-7 text-primary" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <CardTitle className="text-lg font-bold truncate leading-tight">
                      {enterprise.hospitalName}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-xs">
                      {enterprise.address}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-3 space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/30 p-2 rounded-md">
                  <User className="h-4 w-4 text-primary/70" />
                  <span className="font-medium text-foreground">{enterprise.doctorName}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/30 p-2 rounded-md">
                  <FileBadge className="h-4 w-4 text-primary/70" />
                  <span className="font-mono text-xs">{enterprise.licenseNumber}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-3 border-t bg-muted/20 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(enterprise)}
                  className="hover:bg-primary/10 hover:text-primary"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                {enterprise.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => prepareSoftDelete(enterprise.id!, enterprise.hospitalName)}
                    className="hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <EnterpriseFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        initialData={editingEnterprise}
        userUid={currentUser?.uid || ''}
      />

      {/* Alert Dialog */}
      <AlertDialog open={!!deleteConfirmation} onOpenChange={() => setDeleteConfirmation(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Profile?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the profile for{' '}
              <span className="font-semibold text-foreground">"{deleteConfirmation?.name}"</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeSoftDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete Profile
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
