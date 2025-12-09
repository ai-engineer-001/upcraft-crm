import { Client, Project, Requirement, Subtask, Document } from '@/types/project';

export const mockClients: Client[] = [
  {
    id: 'client-1',
    name: 'TechCorp Industries',
    email: 'contact@techcorp.com',
    status: 'Active',
    agreement_status: 'Signed',
    agreement_url: '/agreements/techcorp.pdf',
    created_at: '2024-01-15',
  },
  {
    id: 'client-2',
    name: 'StartupXYZ',
    email: 'hello@startupxyz.io',
    status: 'Active',
    agreement_status: 'Pending',
    created_at: '2024-02-20',
  },
  {
    id: 'client-3',
    name: 'Enterprise Solutions Ltd',
    email: 'projects@enterprise.com',
    status: 'Active',
    agreement_status: 'Signed',
    agreement_url: '/agreements/enterprise.pdf',
    created_at: '2024-01-08',
  },
  {
    id: 'client-4',
    name: 'Digital Agency Co',
    email: 'team@digitalagency.com',
    status: 'Active',
    agreement_status: 'Signed',
    created_at: '2024-03-01',
  },
  {
    id: 'client-5',
    name: 'Legacy Systems Inc',
    email: 'support@legacysystems.com',
    status: 'Completed',
    agreement_status: 'Signed',
    agreement_url: '/agreements/legacy.pdf',
    created_at: '2023-06-15',
  },
  {
    id: 'client-6',
    name: 'CloudFirst Solutions',
    email: 'info@cloudfirst.io',
    status: 'Completed',
    agreement_status: 'Signed',
    agreement_url: '/agreements/cloudfirst.pdf',
    created_at: '2023-08-20',
  },
];

export const mockProjects: Project[] = [
  {
    id: 'project-1',
    client_id: 'client-1',
    name: 'E-Commerce Platform Rebuild',
    status: 'In Progress',
    priority: 'High',
    start_date: '2024-01-20',
    deadline: '2024-06-30',
    created_at: '2024-01-20',
  },
  {
    id: 'project-2',
    client_id: 'client-2',
    name: 'Mobile App MVP',
    status: 'In Progress',
    priority: 'Urgent',
    start_date: '2024-02-25',
    deadline: '2024-05-15',
    created_at: '2024-02-25',
  },
  {
    id: 'project-3',
    client_id: 'client-3',
    name: 'CRM Integration',
    status: 'Planning',
    priority: 'Medium',
    start_date: '2024-04-01',
    deadline: '2024-08-31',
    created_at: '2024-03-15',
  },
  {
    id: 'project-4',
    client_id: 'client-4',
    name: 'Website Redesign',
    status: 'In Progress',
    priority: 'Low',
    start_date: '2024-03-10',
    deadline: '2024-04-30',
    created_at: '2024-03-10',
  },
  {
    id: 'project-5',
    client_id: 'client-5',
    name: 'Database Migration',
    status: 'Completed',
    priority: 'Medium',
    start_date: '2023-06-20',
    deadline: '2023-09-30',
    created_at: '2023-06-20',
  },
  {
    id: 'project-6',
    client_id: 'client-6',
    name: 'Cloud Infrastructure Setup',
    status: 'Completed',
    priority: 'High',
    start_date: '2023-08-25',
    deadline: '2023-12-15',
    created_at: '2023-08-25',
  },
];

export const mockRequirements: Requirement[] = [
  // TechCorp - E-Commerce
  {
    id: 'req-1',
    project_id: 'project-1',
    title: 'User Authentication System',
    description: 'Complete auth flow with OAuth and 2FA support',
    is_additional_scope: false,
    priority: 'High',
    created_at: '2024-01-20',
  },
  {
    id: 'req-2',
    project_id: 'project-1',
    title: 'Product Catalog',
    description: 'Searchable product catalog with filters and categories',
    is_additional_scope: false,
    priority: 'Medium',
    created_at: '2024-01-20',
  },
  {
    id: 'req-3',
    project_id: 'project-1',
    title: 'Payment Gateway Integration',
    description: 'Stripe and PayPal integration with subscription support',
    is_additional_scope: true,
    priority: 'Urgent',
    created_at: '2024-03-05',
  },
  // StartupXYZ - Mobile App
  {
    id: 'req-4',
    project_id: 'project-2',
    title: 'Onboarding Flow',
    description: 'User onboarding with tutorial screens',
    is_additional_scope: false,
    priority: 'High',
    created_at: '2024-02-25',
  },
  {
    id: 'req-5',
    project_id: 'project-2',
    title: 'Push Notifications',
    description: 'Real-time push notification system',
    is_additional_scope: false,
    priority: 'Medium',
    created_at: '2024-02-25',
  },
  // Enterprise - CRM
  {
    id: 'req-6',
    project_id: 'project-3',
    title: 'Data Migration',
    description: 'Migrate existing customer data to new CRM',
    is_additional_scope: false,
    priority: 'High',
    created_at: '2024-03-15',
  },
  // Digital Agency - Website
  {
    id: 'req-7',
    project_id: 'project-4',
    title: 'Homepage Redesign',
    description: 'Modern homepage with animations',
    is_additional_scope: false,
    priority: 'Medium',
    created_at: '2024-03-10',
  },
  {
    id: 'req-8',
    project_id: 'project-4',
    title: 'Blog Section',
    description: 'CMS-powered blog with SEO optimization',
    is_additional_scope: true,
    priority: 'Low',
    created_at: '2024-03-25',
  },
  // Completed projects requirements
  {
    id: 'req-9',
    project_id: 'project-5',
    title: 'Data Export Module',
    description: 'Export existing data in multiple formats',
    is_additional_scope: false,
    priority: 'High',
    created_at: '2023-06-20',
  },
  {
    id: 'req-10',
    project_id: 'project-6',
    title: 'AWS Infrastructure',
    description: 'Setup cloud infrastructure on AWS',
    is_additional_scope: false,
    priority: 'High',
    created_at: '2023-08-25',
  },
];

export const mockSubtasks: Subtask[] = [
  // User Authentication subtasks
  { id: 'task-1', requirement_id: 'req-1', title: 'Design login/signup screens', status: 'Done', priority: 'High', assigned_to: 'Alex', created_at: '2024-01-21' },
  { id: 'task-2', requirement_id: 'req-1', title: 'Implement OAuth providers', status: 'Done', priority: 'High', assigned_to: 'Sarah', created_at: '2024-01-21' },
  { id: 'task-3', requirement_id: 'req-1', title: 'Build 2FA module', status: 'In Progress', priority: 'Urgent', assigned_to: 'Mike', created_at: '2024-01-22' },
  { id: 'task-4', requirement_id: 'req-1', title: 'Password recovery flow', status: 'To Do', priority: 'Medium', assigned_to: 'Alex', created_at: '2024-01-22' },
  
  // Product Catalog subtasks
  { id: 'task-5', requirement_id: 'req-2', title: 'Database schema design', status: 'Done', priority: 'High', assigned_to: 'Sarah', created_at: '2024-01-25' },
  { id: 'task-6', requirement_id: 'req-2', title: 'Build search API', status: 'Review', priority: 'Medium', assigned_to: 'Mike', created_at: '2024-01-26' },
  { id: 'task-7', requirement_id: 'req-2', title: 'Frontend filter components', status: 'In Progress', priority: 'Low', assigned_to: 'Alex', created_at: '2024-01-27' },
  
  // Payment Gateway subtasks (Scope Creep)
  { id: 'task-8', requirement_id: 'req-3', title: 'Stripe SDK integration', status: 'In Progress', priority: 'Urgent', assigned_to: 'Sarah', created_at: '2024-03-06' },
  { id: 'task-9', requirement_id: 'req-3', title: 'PayPal checkout flow', status: 'To Do', priority: 'High', assigned_to: 'Mike', created_at: '2024-03-06' },
  { id: 'task-10', requirement_id: 'req-3', title: 'Subscription management', status: 'To Do', priority: 'Medium', created_at: '2024-03-07' },
  
  // Onboarding Flow subtasks
  { id: 'task-11', requirement_id: 'req-4', title: 'Design tutorial screens', status: 'Done', priority: 'High', assigned_to: 'Alex', created_at: '2024-02-26' },
  { id: 'task-12', requirement_id: 'req-4', title: 'Implement swipe gestures', status: 'Review', priority: 'Medium', assigned_to: 'Sarah', created_at: '2024-02-27' },
  
  // Push Notifications subtasks
  { id: 'task-13', requirement_id: 'req-5', title: 'Firebase setup', status: 'In Progress', priority: 'High', assigned_to: 'Mike', created_at: '2024-03-01' },
  { id: 'task-14', requirement_id: 'req-5', title: 'Notification handlers', status: 'To Do', priority: 'Medium', assigned_to: 'Alex', created_at: '2024-03-02' },
  
  // Data Migration subtasks
  { id: 'task-15', requirement_id: 'req-6', title: 'Export scripts', status: 'To Do', priority: 'Urgent', assigned_to: 'Sarah', created_at: '2024-03-16' },
  { id: 'task-16', requirement_id: 'req-6', title: 'Data validation', status: 'To Do', priority: 'High', created_at: '2024-03-16' },
  
  // Homepage subtasks
  { id: 'task-17', requirement_id: 'req-7', title: 'Hero section design', status: 'Done', priority: 'Medium', assigned_to: 'Alex', created_at: '2024-03-11' },
  { id: 'task-18', requirement_id: 'req-7', title: 'Animations implementation', status: 'Done', priority: 'Low', assigned_to: 'Mike', created_at: '2024-03-12' },
  { id: 'task-19', requirement_id: 'req-7', title: 'Responsive testing', status: 'Review', priority: 'Medium', assigned_to: 'Sarah', created_at: '2024-03-13' },
  
  // Blog subtasks (Scope Creep)
  { id: 'task-20', requirement_id: 'req-8', title: 'CMS integration', status: 'In Progress', priority: 'Low', assigned_to: 'Mike', created_at: '2024-03-26' },
  { id: 'task-21', requirement_id: 'req-8', title: 'SEO meta tags', status: 'To Do', priority: 'Low', assigned_to: 'Alex', created_at: '2024-03-26' },

  // Completed project tasks
  { id: 'task-22', requirement_id: 'req-9', title: 'CSV export', status: 'Done', priority: 'High', assigned_to: 'Sarah', created_at: '2023-06-21' },
  { id: 'task-23', requirement_id: 'req-9', title: 'JSON export', status: 'Done', priority: 'Medium', assigned_to: 'Mike', created_at: '2023-06-22' },
  { id: 'task-24', requirement_id: 'req-10', title: 'EC2 setup', status: 'Done', priority: 'Urgent', assigned_to: 'Alex', created_at: '2023-08-26' },
  { id: 'task-25', requirement_id: 'req-10', title: 'S3 buckets', status: 'Done', priority: 'High', assigned_to: 'Sarah', created_at: '2023-08-27' },
];

export const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    client_id: 'client-1',
    name: 'Master Service Agreement',
    type: 'agreement',
    file_url: '/agreements/techcorp.pdf',
    uploaded_at: '2024-01-15',
  },
  {
    id: 'doc-2',
    client_id: 'client-1',
    name: 'Project Proposal',
    type: 'proposal',
    file_url: '/proposals/techcorp-proposal.pdf',
    uploaded_at: '2024-01-10',
  },
  {
    id: 'doc-3',
    client_id: 'client-3',
    name: 'Service Agreement',
    type: 'agreement',
    file_url: '/agreements/enterprise.pdf',
    uploaded_at: '2024-01-08',
  },
  {
    id: 'doc-4',
    client_id: 'client-5',
    name: 'Project Agreement',
    type: 'agreement',
    file_url: '/agreements/legacy.pdf',
    uploaded_at: '2023-06-15',
  },
  {
    id: 'doc-5',
    client_id: 'client-6',
    name: 'Cloud Service Agreement',
    type: 'agreement',
    file_url: '/agreements/cloudfirst.pdf',
    uploaded_at: '2023-08-20',
  },
];
