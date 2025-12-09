import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Building2, Calendar, AlertTriangle, FileCheck, Plus, Sparkles, FolderOpen, Upload } from 'lucide-react';
import { ClientWithProject, TaskStatus, Subtask, Document } from '@/types/project';
import { RequirementBoard } from './RequirementBoard';
import { DocumentManager } from './DocumentManager';
import { AddScopeDialog } from './AddScopeDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ClientWorkspaceProps {
  client: ClientWithProject;
  onBack: () => void;
  onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask: (requirementId: string, title: string) => void;
  onDeleteTask?: (taskId: string) => void;
  onUpdateTask?: (taskId: string, updates: Partial<Subtask>) => void;
  onAddRequirement?: (projectId: string, title: string, description: string, isAdditionalScope: boolean) => void;
  onDeleteRequirement?: (requirementId: string) => void;
  onUpdateRequirement?: (requirementId: string, updates: { title: string; description: string }) => void;
  onAddDocument?: (clientId: string, name: string, type: Document['type'], fileUrl: string) => void;
  onDeleteDocument?: (docId: string) => void;
}

export function ClientWorkspace({ 
  client, 
  onBack, 
  onTaskStatusChange, 
  onAddTask,
  onDeleteTask,
  onUpdateTask,
  onAddRequirement,
  onDeleteRequirement,
  onUpdateRequirement,
  onAddDocument,
  onDeleteDocument,
}: ClientWorkspaceProps) {
  const project = client.projects[0];
  const hasAgreement = client.documents?.some(d => d.type === 'agreement') ?? false;
  const isPending = !hasAgreement;
  
  const coreRequirements = project?.requirements.filter(r => !r.is_additional_scope) || [];
  const additionalScope = project?.requirements.filter(r => r.is_additional_scope) || [];

  const [docManagerOpen, setDocManagerOpen] = useState(false);
  const [addScopeOpen, setAddScopeOpen] = useState(false);

  const handleAddScope = (title: string, description: string) => {
    if (project && onAddRequirement) {
      onAddRequirement(project.id, title, description, true);
    }
  };

  const handleUploadAgreement = () => {
    setDocManagerOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Warning Banner */}
      {isPending && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-warning/10 border-b border-warning/30 px-6 py-3"
        >
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-warning">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Agreement Pending - Work at own risk</span>
            </div>
            <Button variant="warning" size="sm" onClick={handleUploadAgreement}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Agreement
            </Button>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">{client.name}</h1>
                  {project && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{project.name}</span>
                      <span>•</span>
                      <Badge variant={project.status === 'In Progress' ? 'info' : 'muted'}>
                        {project.status}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {project && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
                </div>
              )}
              
              <Button variant="ghost" onClick={() => setDocManagerOpen(true)} className="gap-2">
                <FolderOpen className="w-4 h-4" />
                Documents
              </Button>
              
              <Badge 
                variant={isPending ? 'destructive' : 'success'} 
                className="gap-1 cursor-pointer"
                onClick={() => setDocManagerOpen(true)}
              >
                <FileCheck className="w-3 h-3" />
                {isPending ? 'Pending' : 'Signed'}
              </Badge>

              <Button variant="glow" className="gap-2" onClick={() => setAddScopeOpen(true)}>
                <Plus className="w-4 h-4" />
                Add New Scope
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {project ? (
          <div className="space-y-8">
            {/* Progress Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">Project Progress</h2>
                <span className="text-2xl font-bold text-gradient">{project.progress}%</span>
              </div>
              <div className="progress-bar h-3">
                <motion.div
                  className="progress-bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </motion.div>

            {/* Core Requirements */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Core Requirements
              </h2>
              <div className="space-y-4">
                {coreRequirements.map((req, index) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <RequirementBoard
                      requirement={req}
                      onTaskStatusChange={onTaskStatusChange}
                      onAddTask={onAddTask}
                      onDeleteTask={onDeleteTask}
                      onUpdateTask={onUpdateTask}
                      onDeleteRequirement={onDeleteRequirement}
                      onUpdateRequirement={onUpdateRequirement}
                    />
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Additional Scope */}
            {additionalScope.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-warning" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Additional Scope
                  </h2>
                  <Badge variant="scope">{additionalScope.length} new</Badge>
                </div>
                <div className="space-y-4">
                  {additionalScope.map((req, index) => (
                    <motion.div
                      key={req.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <RequirementBoard
                        requirement={req}
                        onTaskStatusChange={onTaskStatusChange}
                        onAddTask={onAddTask}
                        onDeleteTask={onDeleteTask}
                        onUpdateTask={onUpdateTask}
                        onDeleteRequirement={onDeleteRequirement}
                        onUpdateRequirement={onUpdateRequirement}
                      />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No active project found
          </div>
        )}
      </main>

      {/* Document Manager Dialog */}
      {onAddDocument && onDeleteDocument && (
        <DocumentManager
          open={docManagerOpen}
          onOpenChange={setDocManagerOpen}
          clientId={client.id}
          clientName={client.name}
          documents={client.documents || []}
          onAddDocument={onAddDocument}
          onDeleteDocument={onDeleteDocument}
        />
      )}

      {/* Add Scope Dialog */}
      <AddScopeDialog
        open={addScopeOpen}
        onOpenChange={setAddScopeOpen}
        onAdd={handleAddScope}
      />
    </div>
  );
}