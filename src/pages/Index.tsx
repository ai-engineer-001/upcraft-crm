import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { ClientWorkspace } from '@/components/workspace/ClientWorkspace';
import { useProjectData } from '@/hooks/useProjectData';
import { TaskStatus, Subtask, Document } from '@/types/project';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

const Index = () => {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const { 
    clientsWithProjects, 
    getClientById, 
    updateTaskStatus, 
    addSubtask,
    deleteSubtask,
    updateSubtask,
    addRequirement,
    deleteRequirement,
    updateRequirement,
    addDocument,
    deleteDocument,
  } = useProjectData();

  const selectedClient = selectedClientId ? getClientById(selectedClientId) : null;

  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTaskStatus(taskId, newStatus);
    
    if (newStatus === 'Done') {
      toast.success('Task completed!', {
        description: 'Great progress on your project.',
      });
    }
  };

  const handleAddTask = (requirementId: string, title: string, assignedTo?: string) => {
    addSubtask(requirementId, title, assignedTo);
    toast.success('Task added', {
      description: `"${title}" has been added to the backlog.`,
    });
  };

  const handleDeleteTask = (taskId: string) => {
    deleteSubtask(taskId);
    toast.success('Task deleted');
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Subtask>) => {
    updateSubtask(taskId, updates);
    toast.success('Task updated');
  };

  const handleAddRequirement = (projectId: string, title: string, description: string, isAdditionalScope: boolean) => {
    addRequirement(projectId, title, description, isAdditionalScope);
    toast.success('New scope added', {
      description: `"${title}" has been added as ${isAdditionalScope ? 'additional scope' : 'core requirement'}.`,
    });
  };

  const handleDeleteRequirement = (requirementId: string) => {
    deleteRequirement(requirementId);
    toast.success('Requirement deleted');
  };

  const handleUpdateRequirement = (requirementId: string, updates: { title: string; description: string }) => {
    updateRequirement(requirementId, updates);
    toast.success('Requirement updated');
  };

  const handleAddDocument = (clientId: string, name: string, type: Document['type'], fileUrl: string) => {
    addDocument(clientId, name, type, fileUrl);
    toast.success('Document uploaded', {
      description: type === 'agreement' ? 'Agreement status updated to Signed.' : `"${name}" has been uploaded.`,
    });
  };

  const handleDeleteDocument = (docId: string) => {
    deleteDocument(docId);
    toast.success('Document deleted');
  };

  return (
    <>
      <Toaster position="bottom-right" />
      <AnimatePresence mode="wait">
        {selectedClient ? (
          <motion.div
            key="workspace"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <ClientWorkspace
              client={selectedClient}
              onBack={() => setSelectedClientId(null)}
              onTaskStatusChange={handleTaskStatusChange}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onUpdateTask={handleUpdateTask}
              onAddRequirement={handleAddRequirement}
              onDeleteRequirement={handleDeleteRequirement}
              onUpdateRequirement={handleUpdateRequirement}
              onAddDocument={handleAddDocument}
              onDeleteDocument={handleDeleteDocument}
            />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            <Dashboard
              clients={clientsWithProjects}
              onClientClick={setSelectedClientId}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Index;