// src/components/EnterpriseFormModal.tsx

import { useState, useEffect, FormEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createEnterprise, updateEnterprise, EnterpriseData } from '@/firebase/enterpriseService';

interface EnterpriseFormModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  initialData: EnterpriseData | null;
  userUid: string;
}

const defaultFormData: Omit<EnterpriseData, 'createdByUid'> = {
  hospitalName: '',
  address: '',
  doctorName: '',
  licenseNumber: '',
  logoUrl: '',
};

export default function EnterpriseFormModal({
  isOpen,
  onClose,
  initialData,
  userUid,
}: EnterpriseFormModalProps) {
  const [formData, setFormData] = useState<EnterpriseData>(
    initialData ? initialData : { ...defaultFormData, createdByUid: userUid }
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync initialData prop with internal state (for editing)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ ...defaultFormData, createdByUid: userUid });
    }
  }, [initialData, userUid]);

  const isEditing = !!initialData;
  const dialogTitle = isEditing ? 'Edit Enterprise Profile' : 'Create New Enterprise Profile';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (isEditing && formData.id) {
        // UPDATE ACTION
        await updateEnterprise(formData.id, formData);
      } else {
        // CREATE ACTION
        await createEnterprise({ ...formData, createdByUid: userUid });
      }
      onClose(true); // Close modal and signal success
    } catch (err: any) {
      setError(err.message || `Failed to ${isEditing ? 'update' : 'create'} profile.`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            Enter the full details for the hospital or clinic. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 my-2 bg-red-100 text-destructive rounded-md">Error: {error}</div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hospitalName" className="text-right">
              Hospital Name
            </Label>
            <Input
              id="hospitalName"
              value={formData.hospitalName}
              onChange={handleInputChange}
              className="col-span-3"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="doctorName" className="text-right">
              Doctor In Charge
            </Label>
            <Input
              id="doctorName"
              value={formData.doctorName}
              onChange={handleInputChange}
              className="col-span-3"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="licenseNumber" className="text-right">
              License No.
            </Label>
            <Input
              id="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleInputChange}
              className="col-span-3"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="address" className="text-right pt-2">
              Address
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={handleInputChange}
              className="col-span-3"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="logoUrl" className="text-right">
              Logo URL
            </Label>
            <Input
              id="logoUrl"
              value={formData.logoUrl}
              onChange={handleInputChange}
              className="col-span-3"
              placeholder="e.g., https://your-cdn.com/logo.png"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (isEditing ? 'Updating...' : 'Creating...') : 'Save Profile'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
