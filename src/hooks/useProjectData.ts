import { useState, useCallback, useMemo } from 'react';
import { mockClients, mockProjects, mockRequirements, mockSubtasks, mockDocuments } from '@/data/mockData';
import { Client, Project, Requirement, Subtask, Document, ClientWithProject, ProjectWithProgress, RequirementWithTasks, TaskStatus } from '@/types/project';

export function useProjectData() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [projects] = useState<Project[]>(mockProjects);
  const [requirements, setRequirements] = useState<Requirement[]>(mockRequirements);
  const [subtasks, setSubtasks] = useState<Subtask[]>(mockSubtasks);
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);

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
        
        const clientDocs = documents.filter(d => d.client_id === client.id);
        
        return { ...client, projects: clientProjects, documents: clientDocs };
      });
  }, [clients, projects, documents, getProjectWithProgress]);

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

  const addRequirement = useCallback((projectId: string, title: string, description: string, isAdditionalScope: boolean) => {
    const newReq: Requirement = {
      id: `req-${Date.now()}`,
      project_id: projectId,
      title,
      description,
      is_additional_scope: isAdditionalScope,
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
    
    // If it's an agreement, update client agreement status
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
    
    // Check if there are any remaining agreements for this client
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
    getClientDocuments,
    hasAgreementDocument,
  };
}