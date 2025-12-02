import { useState, useEffect, useCallback } from 'react';
import { getUserTemplates, deleteTemplate } from '@/firebase/templateService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

import { Edit, Trash2, PlusCircle, Loader2, Search, FileText, Pill } from 'lucide-react';
import { useAuth } from '@/context/authContextDefinition';
import { TemplateData } from '@/interfaces/template';
import { TemplateModal } from '@/components/TemplateModal';
import { Badge } from '@/components/ui/badge';

// Template Screen Component
export default function TemplateScreen() {
  const { currentUser } = useAuth();
  const [templates, setTemplates] = useState<TemplateData[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<TemplateData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TemplateData | null>(null);

  // State for Alert Dialog Confirmation
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string; name: string } | null>(
    null
  );

  // --- Data Fetcher ---
  const fetchTemplates = useCallback(() => {
    if (!currentUser?.uid) return;

    setLoading(true);
    getUserTemplates(currentUser.uid)
      .then((data) => {
        setTemplates(data);
        setFilteredTemplates(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [currentUser]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = templates.filter((t) => t.templateName.toLowerCase().includes(lowerQuery));
    setFilteredTemplates(filtered);
  }, [searchQuery, templates]);

  // --- Handlers ---
  const handleEdit = (template: TemplateData) => {
    setEditingTemplate(template);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingTemplate(null);
    setIsModalOpen(true);
  };

  const prepareDelete = (id: string, templateName: string) => {
    setDeleteConfirmation({ id, name: templateName });
  };

  const executeDelete = async () => {
    if (!deleteConfirmation) return;

    const { id, name } = deleteConfirmation;

    try {
      await deleteTemplate(id);

      // Optimistically update the UI
      const newTemplates = templates.filter((t) => t.id !== id);
      setTemplates(newTemplates);
      setFilteredTemplates(
        newTemplates.filter((t) => t.templateName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setError(null);
    } catch (err: any) {
      setError(err.message || `Failed to delete template: ${name}.`);
    } finally {
      setDeleteConfirmation(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTemplate(null);
    fetchTemplates();
  };

  if (loading)
    return (
      <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-xl font-medium text-muted-foreground">Loading Templates...</p>
      </div>
    );

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
          <p className="text-muted-foreground mt-1">Manage your prescription templates.</p>
        </div>
        <Button
          onClick={handleCreate}
          size="lg"
          className="gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          <PlusCircle className="h-5 w-5" />
          Create Template
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          className="pl-10 max-w-md h-10 bg-background/50 backdrop-blur-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive flex items-center gap-2">
          <span>Error: {error}</span>
        </div>
      )}

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-xl bg-muted/30">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-medium">No templates found</h3>
          <p className="text-muted-foreground mt-1">
            {searchQuery
              ? 'Try adjusting your search query.'
              : 'Create your first template to get started.'}
          </p>
          {!searchQuery && (
            <Button variant="link" onClick={handleCreate} className="mt-2 text-primary">
              Create New Template
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className="group hover:shadow-lg transition-all duration-300 border-muted/60 hover:border-primary/50"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary/80" />
                      {template.templateName}
                    </CardTitle>
                    <CardDescription>
                      Created on {new Date().toLocaleDateString()}{' '}
                      {/* Placeholder date if not in data */}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {template.medications.length} Meds
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Includes:</div>
                  <div className="flex flex-wrap gap-2">
                    {template.medications.slice(0, 3).map((med, idx) => (
                      <Badge key={idx} variant="outline" className="bg-background/50">
                        <Pill className="h-3 w-3 mr-1 opacity-70" />
                        {med.name}
                      </Badge>
                    ))}
                    {template.medications.length > 3 && (
                      <Badge variant="outline" className="bg-muted/50">
                        +{template.medications.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-3 border-t bg-muted/20 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(template)}
                  className="hover:bg-primary/10 hover:text-primary"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                {template.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => prepareDelete(template.id!, template.templateName)}
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
      <TemplateModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        userUid={currentUser?.uid || ''}
        editingTemplate={editingTemplate}
      />

      {/* Alert Dialog */}
      <AlertDialog open={!!deleteConfirmation} onOpenChange={() => setDeleteConfirmation(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{' '}
              <span className="font-semibold text-foreground">"{deleteConfirmation?.name}"</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete Template
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
