export type ClientStatus = 'Active' | 'Archived';
export type AgreementStatus = 'Pending' | 'Signed';
export type ProjectStatus = 'Planning' | 'In Progress' | 'Completed';
export type TaskStatus = 'To Do' | 'In Progress' | 'Review' | 'Done';

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
  created_at: string;
}

export interface Subtask {
  id: string;
  requirement_id: string;
  title: string;
  status: TaskStatus;
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