import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { ClientWorkspace } from '@/components/workspace/ClientWorkspace';
import { OutreachTracker } from '@/pages/OutreachTracker';
import { useProjectData } from '@/hooks/useProjectData';
import { TaskStatus, Subtask, Document, Priority, Requirement } from '@/types/project';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

type View = 'dashboard' | 'workspace' | 'outreach';

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  
  const { 
    clientsWithProjects,
    completedClients,
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
    addClient,
    checkAndUpdateClientStatus,
  } = useProjectData();

  const selectedClient = selectedClientId ? getClientById(selectedClientId) : null;

  // Check client status whenever tasks change
  useEffect(() => {
    if (selectedClientId) {
      checkAndUpdateClientStatus(selectedClientId);
    }
  }, [selectedClientId, checkAndUpdateClientStatus, clientsWithProjects, completedClients]);

  const handleClientClick = (clientId: string) => {
    setSelectedClientId(clientId);
    setCurrentView('workspace');
  };

  const handleBackToDashboard = () => {
    setSelectedClientId(null);
    setCurrentView('dashboard');
  };

  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTaskStatus(taskId, newStatus);
    
    if (newStatus === 'Done') {
      toast.success('Task completed!', {
        description: 'Great progress on your project.',
      });
    }
    
    // Check if all tasks are completed
    if (selectedClientId) {
      setTimeout(() => checkAndUpdateClientStatus(selectedClientId), 100);
    }
  };

  const handleAddTask = (requirementId: string, title: string, assignedTo?: string, priority?: Priority) => {
    addSubtask(requirementId, title, assignedTo, priority);
    toast.success('Task added', {
      description: `"${title}" has been added to the backlog.`,
    });
  };

  const handleDeleteTask = (taskId: string) => {
    deleteSubtask(taskId);
    toast.success('Task deleted');
    
    if (selectedClientId) {
      setTimeout(() => checkAndUpdateClientStatus(selectedClientId), 100);
    }
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Subtask>) => {
    updateSubtask(taskId, updates);
    toast.success('Task updated');
  };

  const handleAddRequirement = (projectId: string, title: string, description: string, isAdditionalScope: boolean, priority?: Priority) => {
    addRequirement(projectId, title, description, isAdditionalScope, priority);
    toast.success('New scope added', {
      description: `"${title}" has been added as ${isAdditionalScope ? 'additional scope' : 'core requirement'}.`,
    });
    
    // If adding scope to completed client, it will be moved to active
    if (selectedClientId) {
      setTimeout(() => checkAndUpdateClientStatus(selectedClientId), 100);
    }
  };

  const handleDeleteRequirement = (requirementId: string) => {
    deleteRequirement(requirementId);
    toast.success('Requirement deleted');
    
    if (selectedClientId) {
      setTimeout(() => checkAndUpdateClientStatus(selectedClientId), 100);
    }
  };

  const handleUpdateRequirement = (requirementId: string, updates: Partial<Requirement>) => {
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

  const handleAddClient = (name: string, email: string, projectName: string, projectPriority: Priority) => {
    addClient(name, email, projectName, projectPriority);
    toast.success('Client created!', {
      description: `${name} with project "${projectName}" has been added.`,
    });
  };

  return (
    <>
      <Toaster position="bottom-right" />
      <AnimatePresence mode="wait">
        {currentView === 'outreach' ? (
          <motion.div
            key="outreach"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <OutreachTracker onBack={handleBackToDashboard} />
          </motion.div>
        ) : selectedClient && currentView === 'workspace' ? (
          <motion.div
            key="workspace"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <ClientWorkspace
              client={selectedClient}
              onBack={handleBackToDashboard}
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
              completedClients={completedClients}
              onClientClick={handleClientClick}
              onAddClient={handleAddClient}
              onOutreachClick={() => setCurrentView('outreach')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Index;
