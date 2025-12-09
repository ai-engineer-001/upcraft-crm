export type ClientStatus = 'Active' | 'Completed' | 'Archived';
export type AgreementStatus = 'Pending' | 'Signed';
export type ProjectStatus = 'Planning' | 'In Progress' | 'Completed';
export type TaskStatus = 'To Do' | 'In Progress' | 'Review' | 'Done';
export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';

export const PRIORITY_ORDER: Record<Priority, number> = {
  'Urgent': 0,
  'High': 1,
  'Medium': 2,
  'Low': 3,
};

export interface Document {
  id: string;
  client_id: string;
  name: string;
  type: 'agreement' | 'contract' | 'proposal' | 'other';
  file_url: string;
  uploaded_at: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  status: ClientStatus;
  agreement_status: AgreementStatus;
  agreement_url?: string;
  created_at: string;
}

export interface Project {
  id: string;
  client_id: string;
  name: string;
  status: ProjectStatus;
  priority: Priority;
  start_date: string;
  deadline: string;
  created_at: string;
}

export interface Requirement {
  id: string;
  project_id: string;
  title: string;
  description: string;
  is_additional_scope: boolean;
  priority: Priority;
  created_at: string;
}

export interface Subtask {
  id: string;
  requirement_id: string;
  title: string;
  status: TaskStatus;
  priority: Priority;
  assigned_to?: string;
  created_at: string;
}

export interface ClientWithProject extends Client {
  projects: ProjectWithProgress[];
  documents: Document[];
}

export interface ProjectWithProgress extends Project {
  requirements: RequirementWithTasks[];
  progress: number;
}

export interface RequirementWithTasks extends Requirement {
  subtasks: Subtask[];
}