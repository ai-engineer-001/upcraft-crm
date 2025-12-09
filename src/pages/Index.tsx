import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { ClientWorkspace } from '@/components/workspace/ClientWorkspace';
import { useProjectData } from '@/hooks/useProjectData';
import { TaskStatus } from '@/types/project';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

const Index = () => {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const { clientsWithProjects, getClientById, updateTaskStatus, addSubtask } = useProjectData();

  const selectedClient = selectedClientId ? getClientById(selectedClientId) : null;

  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTaskStatus(taskId, newStatus);
    
    if (newStatus === 'Done') {
      toast.success('Task completed!', {
        description: 'Great progress on your project.',
      });
    }
  };

  const handleAddTask = (requirementId: string, title: string) => {
    addSubtask(requirementId, title);
    toast.success('Task added', {
      description: `"${title}" has been added to the backlog.`,
    });
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
