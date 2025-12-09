import { motion } from 'framer-motion';
import { ArrowLeft, Building2, Calendar, AlertTriangle, FileCheck, Plus, Sparkles } from 'lucide-react';
import { ClientWithProject, TaskStatus } from '@/types/project';
import { RequirementBoard } from './RequirementBoard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ClientWorkspaceProps {
  client: ClientWithProject;
  onBack: () => void;
  onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask: (requirementId: string, title: string) => void;
}

export function ClientWorkspace({ client, onBack, onTaskStatusChange, onAddTask }: ClientWorkspaceProps) {
  const project = client.projects[0];
  const isPending = client.agreement_status === 'Pending';
  
  const coreRequirements = project?.requirements.filter(r => !r.is_additional_scope) || [];
  const additionalScope = project?.requirements.filter(r => r.is_additional_scope) || [];

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
            <Button variant="warning" size="sm">
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
              
              <Badge variant={isPending ? 'destructive' : 'success'} className="gap-1">
                <FileCheck className="w-3 h-3" />
                {client.agreement_status}
              </Badge>

              <Button variant="glow" className="gap-2">
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
    </div>
  );
}
