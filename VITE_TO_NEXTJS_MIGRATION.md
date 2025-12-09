# Vite to Next.js Migration Guide

This document provides a comprehensive step-by-step guide for migrating this Vite + React project to Next.js App Router, ensuring proper component handling and routing with no errors.

## Table of Contents
1. [Project Analysis](#project-analysis)
2. [Complete File Structure](#complete-file-structure)
3. [Prerequisites](#prerequisites)
4. [Step 1: Create New Next.js Project](#step-1-create-new-nextjs-project)
5. [Step 2: Migrate Dependencies](#step-2-migrate-dependencies)
6. [Step 3: Configure Tailwind CSS](#step-3-configure-tailwind-css)
7. [Step 4: Migrate Design System](#step-4-migrate-design-system)
8. [Step 5: Set Up Path Aliases](#step-5-set-up-path-aliases)
9. [Step 6: Migrate Components](#step-6-migrate-components)
10. [Step 7: Convert Routes](#step-7-convert-routes)
11. [Step 8: Handle Client Components](#step-8-handle-client-components)
12. [Step 9: Migrate Hooks and State](#step-9-migrate-hooks-and-state)
13. [Step 10: Final Testing](#step-10-final-testing)

---

## Project Analysis

### Current Vite Project Structure

```
project-root/
├── index.html                    # Entry HTML (replaced by Next.js layout)
├── vite.config.ts               # Vite config (not needed in Next.js)
├── tailwind.config.ts           # Keep and adapt
├── eslint.config.js             # Keep
├── public/
│   ├── robots.txt               # Move to public/
│   └── favicon.ico              # Move to public/ or app/
├── src/
│   ├── main.tsx                 # Entry point (replaced by Next.js)
│   ├── App.tsx                  # Root component (replaced by layout.tsx)
│   ├── index.css                # Global styles → app/globals.css
│   ├── vite-env.d.ts           # Remove (Vite specific)
│   │
│   ├── components/
│   │   ├── NavLink.tsx         # Client component
│   │   │
│   │   ├── ui/                 # Shadcn UI components (all client)
│   │   │   ├── accordion.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── aspect-ratio.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   ├── button.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── card.tsx
│   │   │   ├── carousel.tsx
│   │   │   ├── chart.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── collapsible.tsx
│   │   │   ├── command.tsx
│   │   │   ├── context-menu.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── drawer.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── hover-card.tsx
│   │   │   ├── input-otp.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── menubar.tsx
│   │   │   ├── navigation-menu.tsx
│   │   │   ├── pagination.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── priority-badge.tsx    # NEW: Priority indicator badge
│   │   │   ├── priority-select.tsx   # NEW: Priority dropdown selector
│   │   │   ├── progress.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── resizable.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   ├── toggle-group.tsx
│   │   │   ├── toggle.tsx
│   │   │   ├── tooltip.tsx
│   │   │   └── use-toast.ts
│   │   │
│   │   ├── dashboard/          # Dashboard components (client)
│   │   │   ├── ClientCard.tsx       # Client info with progress & priority
│   │   │   └── Dashboard.tsx        # Main dashboard with active/completed sections
│   │   │
│   │   └── workspace/          # Workspace components (client)
│   │       ├── AddScopeDialog.tsx    # Dialog to add scope with priority
│   │       ├── ClientWorkspace.tsx   # Main client workspace view
│   │       ├── ConfirmDialog.tsx     # Reusable confirmation dialog
│   │       ├── DocumentManager.tsx   # Document upload and management
│   │       ├── KanbanColumn.tsx      # Kanban column for drag-drop
│   │       ├── RequirementBoard.tsx  # Requirement with tasks & priority
│   │       └── TaskCard.tsx          # Task card with priority support
│   │
│   ├── data/
│   │   └── mockData.ts         # Mock data with priority fields
│   │
│   ├── hooks/
│   │   ├── use-mobile.tsx      # Mobile detection hook
│   │   ├── use-toast.ts        # Toast notification hook
│   │   └── useProjectData.ts   # Main data management with priority sorting
│   │
│   ├── lib/
│   │   └── utils.ts            # Utility functions (cn, etc.)
│   │
│   ├── pages/
│   │   ├── Index.tsx           # Main page → app/page.tsx
│   │   └── NotFound.tsx        # 404 page → app/not-found.tsx
│   │
│   └── types/
│       └── project.ts          # TypeScript types with Priority
```

---

## Complete File Structure (Next.js Target)

```
nextjs-project/
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind config (adapted)
├── tsconfig.json               # TypeScript config
├── eslint.config.js            # ESLint config
├── package.json
├── public/
│   ├── robots.txt
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (providers, theme)
│   │   ├── page.tsx            # Home page (Index content)
│   │   ├── not-found.tsx       # 404 page
│   │   ├── globals.css         # Global styles
│   │   └── loading.tsx         # Optional loading state
│   │
│   ├── components/
│   │   ├── providers/          # NEW: Provider components
│   │   │   ├── theme-provider.tsx
│   │   │   └── query-provider.tsx
│   │   │
│   │   ├── ui/                 # Shadcn + custom components
│   │   │   ├── priority-badge.tsx   # Priority indicator
│   │   │   ├── priority-select.tsx  # Priority dropdown
│   │   │   └── ... (all other ui components)
│   │   │
│   │   ├── dashboard/          # Dashboard components
│   │   │   ├── ClientCard.tsx
│   │   │   └── Dashboard.tsx
│   │   │
│   │   └── workspace/          # Workspace components
│   │       ├── AddScopeDialog.tsx
│   │       ├── ClientWorkspace.tsx
│   │       ├── ConfirmDialog.tsx
│   │       ├── DocumentManager.tsx
│   │       ├── KanbanColumn.tsx
│   │       ├── RequirementBoard.tsx
│   │       └── TaskCard.tsx
│   │
│   ├── data/
│   │   └── mockData.ts
│   │
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   │   └── useProjectData.ts
│   │
│   ├── lib/
│   │   └── utils.ts
│   │
│   └── types/
│       └── project.ts
```

---

## Component Details for AI Migration

### Type Definitions (`src/types/project.ts`)

```typescript
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

export interface Document {
  id: string;
  client_id: string;
  name: string;
  type: 'agreement' | 'contract' | 'proposal' | 'other';
  file_url: string;
  uploaded_at: string;
}

// Composite types
export interface RequirementWithTasks extends Requirement {
  subtasks: Subtask[];
}

export interface ProjectWithProgress extends Project {
  requirements: RequirementWithTasks[];
  progress: number;
}

export interface ClientWithProject extends Client {
  projects: ProjectWithProgress[];
  documents: Document[];
}
```

---

### Core Components

#### 1. `src/pages/Index.tsx` → `src/app/page.tsx`
**Purpose**: Main application page with state management
**Client Component**: Yes (`"use client"` required)
**Dependencies**: 
- `useProjectData` hook for data operations
- `Dashboard` and `ClientWorkspace` components
- `framer-motion` for animations
- `sonner` for toast notifications

**Key State**:
- `selectedClientId`: Currently selected client

**Key Handlers**:
```typescript
handleTaskStatusChange(taskId: string, newStatus: TaskStatus)
handleAddTask(requirementId: string, title: string, assignedTo?: string, priority?: Priority)
handleDeleteTask(taskId: string)
handleUpdateTask(taskId: string, updates: Partial<Subtask>)
handleAddRequirement(projectId: string, title: string, description: string, isAdditionalScope: boolean, priority?: Priority)
handleDeleteRequirement(requirementId: string)
handleUpdateRequirement(requirementId: string, updates: Partial<Requirement>)
handleAddDocument(clientId: string, name: string, type: Document['type'], fileUrl: string)
handleDeleteDocument(docId: string)
```

---

#### 2. `src/components/dashboard/Dashboard.tsx`
**Purpose**: Main dashboard showing active and completed clients
**Props**:
```typescript
interface DashboardProps {
  clients: ClientWithProject[];
  completedClients: ClientWithProject[];
  onClientClick: (clientId: string) => void;
}
```
**Features**:
- Stats overview (total clients, projects, completion rate)
- Active clients grid with priority indicators
- Collapsible completed clients section for future work
- Client cards sorted by project priority

---

#### 3. `src/components/dashboard/ClientCard.tsx`
**Purpose**: Individual client card displaying summary info
**Props**:
```typescript
interface ClientCardProps {
  client: ClientWithProject;
  onClick: () => void;
  index: number;
  isCompleted?: boolean;
}
```
**Features**:
- Agreement status indicator (Pending/Signed)
- Project progress bar with priority badge
- Task count summary
- Visual distinction for completed clients

---

#### 4. `src/components/workspace/ClientWorkspace.tsx`
**Purpose**: Full workspace view for a selected client
**Props**:
```typescript
interface ClientWorkspaceProps {
  client: ClientWithProject;
  onBack: () => void;
  onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask: (requirementId: string, title: string, assignedTo?: string, priority?: Priority) => void;
  onDeleteTask?: (taskId: string) => void;
  onUpdateTask?: (taskId: string, updates: Partial<Subtask>) => void;
  onAddRequirement?: (projectId: string, title: string, description: string, isAdditionalScope: boolean, priority?: Priority) => void;
  onDeleteRequirement?: (requirementId: string) => void;
  onUpdateRequirement?: (requirementId: string, updates: Partial<Requirement>) => void;
  onAddDocument?: (clientId: string, name: string, type: Document['type'], fileUrl: string) => void;
  onDeleteDocument?: (docId: string) => void;
}
```
**Features**:
- Agreement pending warning banner
- Project progress overview
- All requirements displayed together (unified view)
- Document manager dialog
- Add scope dialog with priority selection

---

#### 5. `src/components/workspace/RequirementBoard.tsx`
**Purpose**: Kanban board for a single requirement with tasks
**Props**:
```typescript
interface RequirementBoardProps {
  requirement: RequirementWithTasks;
  onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask: (requirementId: string, title: string, assignedTo?: string, priority?: Priority) => void;
  onDeleteTask?: (taskId: string) => void;
  onUpdateTask?: (taskId: string, updates: Partial<Subtask>) => void;
  onDeleteRequirement?: (requirementId: string) => void;
  onUpdateRequirement?: (requirementId: string, updates: Partial<Requirement>) => void;
}
```
**Features**:
- Collapsible requirement header with priority badge
- Inline priority selector for requirement
- Add task form with title, assignee, and priority fields
- Drag-and-drop between status columns
- Edit/delete requirement with confirmation
- Tasks sorted by priority within each column

---

#### 6. `src/components/workspace/TaskCard.tsx`
**Purpose**: Draggable task card with edit capabilities
**Props**:
```typescript
interface TaskCardProps {
  task: Subtask;
  isDragging: boolean;
  isAdditionalScope: boolean;
  onDelete?: (taskId: string) => void;
  onUpdate?: (taskId: string, updates: Partial<Subtask>) => void;
}
```
**Features**:
- Priority badge display
- Inline editing for title, assignee, AND priority
- Quick priority change via dropdown
- Drag handle visibility on hover
- Delete/edit action buttons

---

#### 7. `src/components/workspace/AddScopeDialog.tsx`
**Purpose**: Dialog to add new scope/requirement
**Props**:
```typescript
interface AddScopeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (title: string, description: string, isAdditionalScope: boolean, priority: Priority) => void;
}
```
**Features**:
- Title and description inputs
- Priority selector (Urgent/High/Medium/Low)
- Toggle for additional scope (scope creep tracking)

---

#### 8. `src/components/ui/priority-badge.tsx`
**Purpose**: Visual priority indicator badge
**Props**:
```typescript
interface PriorityBadgeProps {
  priority: Priority;
  showLabel?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}
```
**Color Scheme**:
- Urgent: Red
- High: Orange
- Medium: Yellow
- Low: Blue

---

#### 9. `src/components/ui/priority-select.tsx`
**Purpose**: Dropdown for selecting priority
**Props**:
```typescript
interface PrioritySelectProps {
  value: Priority;
  onChange: (priority: Priority) => void;
  size?: 'sm' | 'md';
}
```

---

### Hooks

#### `src/hooks/useProjectData.ts`
**Purpose**: Central data management for all entities with priority sorting
**Returns**:
```typescript
{
  clientsWithProjects: ClientWithProject[];      // Active clients
  completedClients: ClientWithProject[];         // Completed clients
  getClientById: (id: string) => ClientWithProject | undefined;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  updateTaskPriority: (taskId: string, priority: Priority) => void;
  addSubtask: (reqId: string, title: string, assignedTo?: string, priority?: Priority) => Subtask;
  deleteSubtask: (taskId: string) => void;
  updateSubtask: (taskId: string, updates: Partial<Subtask>) => void;
  addRequirement: (projectId: string, title: string, desc: string, isAdditional: boolean, priority?: Priority) => Requirement;
  deleteRequirement: (reqId: string) => void;
  updateRequirement: (reqId: string, updates: Partial<Requirement>) => void;
  updateProjectPriority: (projectId: string, priority: Priority) => void;
  updateClientStatus: (clientId: string, status: ClientStatus) => void;
  addDocument: (clientId: string, name: string, type: Document['type'], fileUrl: string) => Document;
  deleteDocument: (docId: string) => void;
  getClientDocuments: (clientId: string) => Document[];
  hasAgreementDocument: (clientId: string) => boolean;
}
```

**Sorting Logic**:
- All items automatically sorted by `PRIORITY_ORDER` (Urgent first, Low last)
- Sorting applied to: projects, requirements, and subtasks

---

## Prerequisites

Before starting the migration:
1. Ensure Node.js 18.17+ is installed
2. Back up your current project
3. Commit all changes to version control

---

## Step 1: Create New Next.js Project

```bash
npx create-next-app@latest project-management-nextjs --typescript --tailwind --eslint --app --src-dir

cd project-management-nextjs
```

Select:
- ✅ TypeScript: Yes
- ✅ ESLint: Yes
- ✅ Tailwind CSS: Yes
- ✅ `src/` directory: Yes
- ✅ App Router: Yes
- ❌ Turbopack: No
- ✅ Custom import alias: Yes (@/*)

---

## Step 2: Migrate Dependencies

```bash
# Core UI dependencies
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip

# Animation and DnD
npm install framer-motion @hello-pangea/dnd

# State management
npm install @tanstack/react-query

# Utilities
npm install class-variance-authority clsx tailwind-merge tailwindcss-animate

# Date handling
npm install date-fns react-day-picker

# Form handling
npm install react-hook-form @hookform/resolvers zod

# Other UI
npm install cmdk sonner vaul input-otp embla-carousel-react react-resizable-panels recharts lucide-react

# Fonts
npm install @fontsource/manrope

# Theme
npm install next-themes
```

---

## Step 3: Configure Tailwind CSS

Copy your `tailwind.config.ts` with these adjustments for content paths:

```typescript
import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  // ... rest of your existing config
} satisfies Config;

export default config;
```

---

## Step 4: Migrate Design System

Copy `src/index.css` content to `src/app/globals.css`. Key custom classes:
- `.glass-card` - Glassmorphism card style
- `.progress-bar` / `.progress-bar-fill` - Progress bar styling
- `.text-gradient` - Gradient text effect

---

## Step 5: Set Up Path Aliases

`tsconfig.json` should have:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## Step 6: Migrate Components

Copy directories maintaining structure:
```bash
cp -r vite-project/src/components/* nextjs-project/src/components/
cp -r vite-project/src/hooks/* nextjs-project/src/hooks/
cp -r vite-project/src/data/* nextjs-project/src/data/
cp -r vite-project/src/types/* nextjs-project/src/types/
cp -r vite-project/src/lib/* nextjs-project/src/lib/
```

---

## Step 7: Convert Routes

### Create Provider Components

**`src/components/providers/theme-provider.tsx`:**
```tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

**`src/components/providers/query-provider.tsx`:**
```tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### Create Layout

**`src/app/layout.tsx`:**
```tsx
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/providers/query-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project Management System",
  description: "Real-time Project Management for Software Agencies",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster position="bottom-right" />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Create Main Page

**`src/app/page.tsx`:**
```tsx
"use client";

// Copy entire content from src/pages/Index.tsx
// Add "use client" at top
```

---

## Step 8: Handle Client Components

**All components requiring `"use client"`:**
- All components using `useState`, `useEffect`, `useRef`
- All components using event handlers
- All Framer Motion components
- All drag-and-drop components
- All form components

**Components List:**
- `src/components/dashboard/Dashboard.tsx`
- `src/components/dashboard/ClientCard.tsx`
- `src/components/workspace/ClientWorkspace.tsx`
- `src/components/workspace/RequirementBoard.tsx`
- `src/components/workspace/KanbanColumn.tsx`
- `src/components/workspace/TaskCard.tsx`
- `src/components/workspace/AddScopeDialog.tsx`
- `src/components/workspace/DocumentManager.tsx`
- `src/components/workspace/ConfirmDialog.tsx`
- `src/components/ui/priority-badge.tsx`
- `src/components/ui/priority-select.tsx`
- All `src/components/ui/*` Shadcn components

---

## Step 9: Migrate Hooks and State

Hooks work identically in Next.js client components:
- `useProjectData.ts` - No changes needed
- `use-mobile.tsx` - No changes needed
- `use-toast.ts` - No changes needed

---

## Step 10: Final Testing

1. Run development server: `npm run dev`
2. Test all routes and navigation
3. Verify drag-and-drop functionality
4. Test all CRUD operations (add/edit/delete)
5. Test priority selection and sorting
6. Check responsive design on multiple viewports
7. Verify animations work correctly
8. Test document upload flow
9. Check toast notifications
10. Test completed clients section expand/collapse

---

## Common Migration Issues

### 1. Hydration Errors
**Solution**: Ensure client components have `"use client"` directive

### 2. Window/Document Not Defined
**Solution**: Use dynamic imports or useEffect for browser APIs:
```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return null;
```

### 3. DnD Library Issues
**Solution**: @hello-pangea/dnd works with SSR. Add to body:
```tsx
<body suppressHydrationWarning>
```

### 4. Image Optimization
Replace `<img>` with Next.js `<Image>`:
```tsx
import Image from 'next/image';
<Image src="/path" alt="desc" width={100} height={100} />
```

### 5. Environment Variables
Rename `.env` variables:
- Client-side: `NEXT_PUBLIC_*`
- Server-side: No prefix needed

---

## Removed Files (Not Needed in Next.js)
- `vite.config.ts`
- `src/main.tsx`
- `src/App.tsx`
- `src/vite-env.d.ts`
- `index.html`

---

## Summary

This migration maintains all existing functionality while leveraging Next.js features:
- File-based routing with App Router
- Built-in optimization for images and fonts
- Server components capability (where applicable)
- Improved SEO with metadata API
- Priority-based sorting throughout the app
- Active and completed client management

The core business logic in hooks and components remains unchanged. Only entry points and routing structure need modification.

**Key Features Preserved:**
- Full CRUD for clients, projects, requirements, and tasks
- Priority system (Urgent/High/Medium/Low) with auto-sorting
- Drag-and-drop task management
- Document management with agreement tracking
- Completed clients section for future work
- Real-time toast notifications
- Responsive design with dark theme
