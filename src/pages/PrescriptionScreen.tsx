import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText, Stethoscope } from 'lucide-react';
import { useAuth } from '@/context/authContextDefinition';
import { PrescriptionFormModal } from '@/components/PrescriptionFormModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrescriptionScreen() {
  const { currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="flex flex-col items-center justify-center space-y-8 py-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">New Prescription</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create professional prescriptions in seconds. Select a template or start from scratch.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 w-full max-w-3xl">
          <Card
            className="hover:shadow-lg transition-all cursor-pointer border-primary/20 hover:border-primary"
            onClick={handleCreate}
          >
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                <PlusCircle className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Create New</CardTitle>
              <CardDescription>Start a blank prescription</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button size="lg" className="w-full">
                Start Consultation
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer border-muted hover:border-primary/50 opacity-80 hover:opacity-100">
            <CardHeader className="text-center">
              <div className="mx-auto bg-blue-500/10 p-4 rounded-full mb-4">
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
              <CardTitle>Use Template</CardTitle>
              <CardDescription>Load a saved template</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="outline" size="lg" className="w-full" onClick={handleCreate}>
                Select Template
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="bg-muted/30 p-6 rounded-xl w-full max-w-3xl flex items-start gap-4">
          <Stethoscope className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
          <div className="space-y-1">
            <h3 className="font-semibold">Pro Tip</h3>
            <p className="text-sm text-muted-foreground">
              You can save any prescription as a template for future use. Just click "Save as
              Template" in the prescription form.
            </p>
          </div>
        </div>
      </div>

      <PrescriptionFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        userUid={currentUser?.uid || ''}
      />
    </div>
  );
}
