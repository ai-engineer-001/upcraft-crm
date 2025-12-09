import { useState, useCallback, useMemo } from 'react';
import { mockClients, mockProjects, mockRequirements, mockSubtasks } from '@/data/mockData';
import { Client, Project, Requirement, Subtask, ClientWithProject, ProjectWithProgress, RequirementWithTasks, TaskStatus } from '@/types/project';

export function useProjectData() {
  const [clients] = useState<Client[]>(mockClients);
  const [projects] = useState<Project[]>(mockProjects);
  const [requirements] = useState<Requirement[]>(mockRequirements);
  const [subtasks, setSubtasks] = useState<Subtask[]>(mockSubtasks);

  const calculateProgress = useCallback((tasks: Subtask[]): number => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.status === 'Done').length;
    return Math.round((completed / tasks.length) * 100);
  }, []);

  const getRequirementWithTasks = useCallback((req: Requirement): RequirementWithTasks => {
    const reqSubtasks = subtasks.filter(t => t.requirement_id === req.id);
    return { ...req, subtasks: reqSubtasks };
  }, [subtasks]);

  const getProjectWithProgress = useCallback((project: Project): ProjectWithProgress => {
    const projectReqs = requirements
      .filter(r => r.project_id === project.id)
      .map(getRequirementWithTasks);
    
    const allTasks = projectReqs.flatMap(r => r.subtasks);
    const progress = calculateProgress(allTasks);
    
    return { ...project, requirements: projectReqs, progress };
  }, [requirements, getRequirementWithTasks, calculateProgress]);

  const clientsWithProjects = useMemo((): ClientWithProject[] => {
    return clients
      .filter(c => c.status === 'Active')
      .map(client => {
        const clientProjects = projects
          .filter(p => p.client_id === client.id)
          .map(getProjectWithProgress);
        
        return { ...client, projects: clientProjects };
      });
  }, [clients, projects, getProjectWithProgress]);

  const getClientById = useCallback((clientId: string): ClientWithProject | undefined => {
    return clientsWithProjects.find(c => c.id === clientId);
  }, [clientsWithProjects]);

  const updateTaskStatus = useCallback((taskId: string, newStatus: TaskStatus) => {
    setSubtasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  }, []);

  const addSubtask = useCallback((requirementId: string, title: string, assignedTo?: string) => {
    const newTask: Subtask = {
      id: `task-${Date.now()}`,
      requirement_id: requirementId,
      title,
      status: 'To Do',
      assigned_to: assignedTo,
      created_at: new Date().toISOString().split('T')[0],
    };
    setSubtasks(prev => [...prev, newTask]);
    return newTask;
  }, []);

  return {
    clientsWithProjects,
    getClientById,
    updateTaskStatus,
    addSubtask,
  };
}
