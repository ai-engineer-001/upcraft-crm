import { useState, useCallback, useMemo } from 'react';
import { mockClients, mockProjects, mockRequirements, mockSubtasks, mockDocuments } from '@/data/mockData';
import { Client, Project, Requirement, Subtask, Document, ClientWithProject, ProjectWithProgress, RequirementWithTasks, TaskStatus, Priority, PRIORITY_ORDER } from '@/types/project';

export function useProjectData() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [requirements, setRequirements] = useState<Requirement[]>(mockRequirements);
  const [subtasks, setSubtasks] = useState<Subtask[]>(mockSubtasks);
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);

  const calculateProgress = useCallback((tasks: Subtask[]): number => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.status === 'Done').length;
    return Math.round((completed / tasks.length) * 100);
  }, []);

  const sortByPriority = useCallback(<T extends { priority: Priority }>(items: T[]): T[] => {
    return [...items].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
  }, []);

  const getRequirementWithTasks = useCallback((req: Requirement): RequirementWithTasks => {
    const reqSubtasks = subtasks
      .filter(t => t.requirement_id === req.id)
      .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
    return { ...req, subtasks: reqSubtasks };
  }, [subtasks]);

  const getProjectWithProgress = useCallback((project: Project): ProjectWithProgress => {
    const projectReqs = requirements
      .filter(r => r.project_id === project.id)
      .map(getRequirementWithTasks)
      .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
    
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
          .map(getProjectWithProgress)
          .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
        
        const clientDocs = documents.filter(d => d.client_id === client.id);
        
        return { ...client, projects: clientProjects, documents: clientDocs };
      });
  }, [clients, projects, documents, getProjectWithProgress]);

  const completedClients = useMemo((): ClientWithProject[] => {
    return clients
      .filter(c => c.status === 'Completed')
      .map(client => {
        const clientProjects = projects
          .filter(p => p.client_id === client.id)
          .map(getProjectWithProgress)
          .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
        
        const clientDocs = documents.filter(d => d.client_id === client.id);
        
        return { ...client, projects: clientProjects, documents: clientDocs };
      });
  }, [clients, projects, documents, getProjectWithProgress]);

  const getClientById = useCallback((clientId: string): ClientWithProject | undefined => {
    const allClients = [...clientsWithProjects, ...completedClients];
    return allClients.find(c => c.id === clientId);
  }, [clientsWithProjects, completedClients]);

  const updateTaskStatus = useCallback((taskId: string, newStatus: TaskStatus) => {
    setSubtasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  }, []);

  const updateTaskPriority = useCallback((taskId: string, newPriority: Priority) => {
    setSubtasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, priority: newPriority } : task
      )
    );
  }, []);

  const addSubtask = useCallback((requirementId: string, title: string, assignedTo?: string, priority: Priority = 'Medium') => {
    const newTask: Subtask = {
      id: `task-${Date.now()}`,
      requirement_id: requirementId,
      title,
      status: 'To Do',
      priority,
      assigned_to: assignedTo,
      created_at: new Date().toISOString().split('T')[0],
    };
    setSubtasks(prev => [...prev, newTask]);
    return newTask;
  }, []);

  const deleteSubtask = useCallback((taskId: string) => {
    setSubtasks(prev => prev.filter(t => t.id !== taskId));
  }, []);

  const updateSubtask = useCallback((taskId: string, updates: Partial<Subtask>) => {
    setSubtasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  }, []);

  const addRequirement = useCallback((projectId: string, title: string, description: string, isAdditionalScope: boolean, priority: Priority = 'Medium') => {
    const newReq: Requirement = {
      id: `req-${Date.now()}`,
      project_id: projectId,
      title,
      description,
      is_additional_scope: isAdditionalScope,
      priority,
      created_at: new Date().toISOString().split('T')[0],
    };
    setRequirements(prev => [...prev, newReq]);
    return newReq;
  }, []);

  const deleteRequirement = useCallback((requirementId: string) => {
    setRequirements(prev => prev.filter(r => r.id !== requirementId));
    setSubtasks(prev => prev.filter(t => t.requirement_id !== requirementId));
  }, []);

  const updateRequirement = useCallback((requirementId: string, updates: Partial<Requirement>) => {
    setRequirements(prev =>
      prev.map(req =>
        req.id === requirementId ? { ...req, ...updates } : req
      )
    );
  }, []);

  const updateProjectPriority = useCallback((projectId: string, newPriority: Priority) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === projectId ? { ...project, priority: newPriority } : project
      )
    );
  }, []);

  const updateClientStatus = useCallback((clientId: string, newStatus: Client['status']) => {
    setClients(prev => 
      prev.map(client => 
        client.id === clientId ? { ...client, status: newStatus } : client
      )
    );
  }, []);

  const addClient = useCallback((name: string, email: string, projectName: string, projectPriority: Priority) => {
    const clientId = `client-${Date.now()}`;
    const projectId = `project-${Date.now()}`;
    
    const newClient: Client = {
      id: clientId,
      name,
      email,
      status: 'Active',
      agreement_status: 'Pending',
      created_at: new Date().toISOString().split('T')[0],
    };
    
    const newProject: Project = {
      id: projectId,
      client_id: clientId,
      name: projectName,
      status: 'Planning',
      priority: projectPriority,
      start_date: new Date().toISOString().split('T')[0],
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      created_at: new Date().toISOString().split('T')[0],
    };
    
    setClients(prev => [...prev, newClient]);
    setProjects(prev => [...prev, newProject]);
    
    return { client: newClient, project: newProject };
  }, []);

  const checkAndUpdateClientStatus = useCallback((clientId: string) => {
    const clientProjects = projects.filter(p => p.client_id === clientId);
    const projectIds = clientProjects.map(p => p.id);
    const clientReqs = requirements.filter(r => projectIds.includes(r.project_id));
    const reqIds = clientReqs.map(r => r.id);
    const clientTasks = subtasks.filter(t => reqIds.includes(t.requirement_id));
    
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    
    // If no tasks, keep current status
    if (clientTasks.length === 0) return;
    
    const allTasksDone = clientTasks.every(t => t.status === 'Done');
    const hasIncompleteTasks = clientTasks.some(t => t.status !== 'Done');
    
    if (allTasksDone && client.status === 'Active') {
      // All tasks done, move to completed
      setClients(prev => 
        prev.map(c => c.id === clientId ? { ...c, status: 'Completed' } : c)
      );
    } else if (hasIncompleteTasks && client.status === 'Completed') {
      // Has incomplete tasks (new scope added), move back to active
      setClients(prev => 
        prev.map(c => c.id === clientId ? { ...c, status: 'Active' } : c)
      );
    }
  }, [clients, projects, requirements, subtasks]);

  const addDocument = useCallback((clientId: string, name: string, type: Document['type'], fileUrl: string) => {
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      client_id: clientId,
      name,
      type,
      file_url: fileUrl,
      uploaded_at: new Date().toISOString().split('T')[0],
    };
    setDocuments(prev => [...prev, newDoc]);
    
    if (type === 'agreement') {
      setClients(prev =>
        prev.map(c =>
          c.id === clientId ? { ...c, agreement_status: 'Signed', agreement_url: fileUrl } : c
        )
      );
    }
    
    return newDoc;
  }, []);

  const deleteDocument = useCallback((docId: string) => {
    const doc = documents.find(d => d.id === docId);
    setDocuments(prev => prev.filter(d => d.id !== docId));
    
    if (doc && doc.type === 'agreement') {
      const remainingAgreements = documents.filter(d => 
        d.client_id === doc.client_id && d.type === 'agreement' && d.id !== docId
      );
      if (remainingAgreements.length === 0) {
        setClients(prev =>
          prev.map(c =>
            c.id === doc.client_id ? { ...c, agreement_status: 'Pending', agreement_url: undefined } : c
          )
        );
      }
    }
  }, [documents]);

  const getClientDocuments = useCallback((clientId: string) => {
    return documents.filter(d => d.client_id === clientId);
  }, [documents]);

  const hasAgreementDocument = useCallback((clientId: string) => {
    return documents.some(d => d.client_id === clientId && d.type === 'agreement');
  }, [documents]);

  return {
    clientsWithProjects,
    completedClients,
    getClientById,
    updateTaskStatus,
    updateTaskPriority,
    addSubtask,
    deleteSubtask,
    updateSubtask,
    addRequirement,
    deleteRequirement,
    updateRequirement,
    updateProjectPriority,
    updateClientStatus,
    addClient,
    checkAndUpdateClientStatus,
    addDocument,
    deleteDocument,
    getClientDocuments,
    hasAgreementDocument,
  };
}
