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
├── index.html                    # Entry HTML (will be replaced by Next.js layout)
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
│   │   │   ├── ClientCard.tsx       # Displays client info with progress
│   │   │   └── Dashboard.tsx        # Main dashboard grid view
│   │   │
│   │   └── workspace/          # Workspace components (client)
│   │       ├── AddScopeDialog.tsx    # Dialog to add new scope/requirement
│   │       ├── ClientWorkspace.tsx   # Main client workspace view
│   │       ├── ConfirmDialog.tsx     # Reusable confirmation dialog
│   │       ├── DocumentManager.tsx   # Document upload and management
│   │       ├── KanbanColumn.tsx      # Kanban column for drag-drop
│   │       ├── RequirementBoard.tsx  # Requirement with tasks board
│   │       └── TaskCard.tsx          # Individual task card
│   │
│   ├── data/
│   │   └── mockData.ts         # Mock data for development
│   │
│   ├── hooks/
│   │   ├── use-mobile.tsx      # Mobile detection hook
│   │   ├── use-toast.ts        # Toast notification hook
│   │   └── useProjectData.ts   # Main data management hook
│   │
│   ├── lib/
│   │   └── utils.ts            # Utility functions (cn, etc.)
│   │
│   ├── pages/
│   │   ├── Index.tsx           # Main page → app/page.tsx
│   │   └── NotFound.tsx        # 404 page → app/not-found.tsx
│   │
│   └── types/
│       └── project.ts          # TypeScript type definitions
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
│   │   ├── ui/                 # Shadcn components (unchanged)
│   │   │   └── ... (all ui components)
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

### Core Components

#### 1. `src/pages/Index.tsx` → `src/app/page.tsx`
**Purpose**: Main application page with state management
**Dependencies**: 
- `useProjectData` hook for data operations
- `Dashboard` and `ClientWorkspace` components
- `framer-motion` for animations
- `sonner` for toast notifications
**Client Component**: Yes (`"use client"` required)
**Key State**:
- `selectedClientId`: Currently selected client
**Key Functions**:
- `handleTaskStatusChange(taskId, newStatus)`
- `handleAddTask(requirementId, title, assignedTo?)`
- `handleDeleteTask(taskId)`
- `handleUpdateTask(taskId, updates)`
- `handleAddRequirement(projectId, title, description, isAdditionalScope)`
- `handleDeleteRequirement(requirementId)`
- `handleUpdateRequirement(requirementId, updates)`
- `handleAddDocument(clientId, name, type, fileUrl)`
- `handleDeleteDocument(docId)`

#### 2. `src/components/dashboard/Dashboard.tsx`
**Purpose**: Main dashboard showing all clients in a grid
**Props**:
- `clients: ClientWithProject[]`
- `onClientSelect: (clientId: string) => void`
**Features**:
- Stats overview (total clients, projects, completion rate)
- Client cards grid with progress indicators
**Animations**: Framer Motion fade-in for cards

#### 3. `src/components/dashboard/ClientCard.tsx`
**Purpose**: Individual client card displaying summary info
**Props**:
- `client: ClientWithProject`
- `onClick: () => void`
**Features**:
- Agreement status indicator (Pending/Signed)
- Project progress bar
- Task count summary
**Animations**: Scale on hover

#### 4. `src/components/workspace/ClientWorkspace.tsx`
**Purpose**: Full workspace view for a selected client
**Props**:
- `client: ClientWithProject`
- `onBack: () => void`
- `onTaskStatusChange`, `onAddTask`, `onDeleteTask`, `onUpdateTask`
- `onAddRequirement`, `onDeleteRequirement`, `onUpdateRequirement`
- `onAddDocument`, `onDeleteDocument`
**Features**:
- Agreement pending warning banner
- Project progress overview
- All requirements displayed together (no separation)
- Document manager dialog
- Add scope dialog

#### 5. `src/components/workspace/RequirementBoard.tsx`
**Purpose**: Kanban board for a single requirement with tasks
**Props**:
- `requirement: RequirementWithTasks`
- Task handlers (status change, add, delete, update)
- Requirement handlers (delete, update)
**Features**:
- Collapsible requirement header with progress
- Add task with title and assignee fields
- Drag-and-drop between status columns
- Edit/delete requirement with confirmation
**State**:
- `isExpanded`, `isAddingTask`, `newTaskTitle`, `newTaskAssignee`
- `isEditing`, `editTitle`, `editDescription`
- Dialog states for confirmations

#### 6. `src/components/workspace/KanbanColumn.tsx`
**Purpose**: Single Kanban column with droppable area
**Props**:
- `status: TaskStatus`
- `tasks: Subtask[]`
- `requirementTitle: string`
- `isAdditionalScope: boolean`
- `onDeleteTask`, `onUpdateTask`
**Features**:
- Droppable zone for drag-and-drop
- Task count indicator
- Status-based coloring

#### 7. `src/components/workspace/TaskCard.tsx`
**Purpose**: Draggable task card with edit capabilities
**Props**:
- `task: Subtask`
- `isDragging: boolean`
- `isAdditionalScope: boolean`
- `onDelete`, `onUpdate`
**Features**:
- Inline editing for title AND assignee
- Drag handle visibility on hover
- Additional scope visual indicator
- Delete/edit action buttons

#### 8. `src/components/workspace/AddScopeDialog.tsx`
**Purpose**: Dialog to add new scope/requirement
**Props**:
- `open`, `onOpenChange`, `onAdd(title, description, isAdditionalScope)`
**Features**:
- Title and description inputs
- Toggle for additional scope (scope creep tracking)

#### 9. `src/components/workspace/DocumentManager.tsx`
**Purpose**: Modal for managing client documents
**Props**:
- `open`, `onOpenChange`, `clientId`, `clientName`
- `documents: Document[]`
- `onAddDocument`, `onDeleteDocument`
**Features**:
- Separate sections for agreements vs other documents
- Upload simulation (file input)
- Document type selection
- Delete confirmation

#### 10. `src/components/workspace/ConfirmDialog.tsx`
**Purpose**: Reusable confirmation dialog
**Props**:
- `open`, `onOpenChange`, `title`, `description`, `onConfirm`
**Features**: Standard alert dialog pattern

---

## Hooks

### `src/hooks/useProjectData.ts`
**Purpose**: Central data management for all entities
**Returns**:
```typescript
{
  clientsWithProjects: ClientWithProject[],
  getClientById: (id: string) => ClientWithProject | undefined,
  updateTaskStatus: (taskId: string, status: TaskStatus) => void,
  addSubtask: (reqId: string, title: string, assignedTo?: string) => Subtask,
  deleteSubtask: (taskId: string) => void,
  updateSubtask: (taskId: string, updates: Partial<Subtask>) => void,
  addRequirement: (projectId: string, title: string, desc: string, isAdditional: boolean) => Requirement,
  deleteRequirement: (reqId: string) => void,
  updateRequirement: (reqId: string, updates: { title: string; description: string }) => void,
  addDocument: (clientId: string, name: string, type: Document['type'], fileUrl: string) => Document,
  deleteDocument: (docId: string) => void,
  getClientDocuments: (clientId: string) => Document[],
  hasAgreementDocument: (clientId: string) => boolean,
}
```

---

## Type Definitions

### `src/types/project.ts`
```typescript
export type TaskStatus = 'To Do' | 'In Progress' | 'Review' | 'Done';

export interface Client {
  id: string;
  name: string;
  email: string;
  status: 'Active' | 'Archived';
  agreement_status: 'Pending' | 'Signed';
  agreement_url?: string;
}

export interface Project {
  id: string;
  client_id: string;
  name: string;
  status: 'Planning' | 'In Progress' | 'Completed';
  start_date: string;
  deadline: string;
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

export interface Document {
  id: string;
  client_id: string;
  name: string;
  type: 'agreement' | 'proposal' | 'invoice' | 'other';
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
  documents?: Document[];
}
```

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

Copy your `tailwind.config.ts` with these adjustments:

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
  // ... rest of your config
} satisfies Config;

export default config;
```

---

## Step 4: Migrate Design System

Copy `src/index.css` content to `src/app/globals.css`.

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

Copy directories:
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

// Copy content from src/pages/Index.tsx
// The component remains the same, just add "use client" at top
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
    toast.success('Scope added');
  };

  const handleDeleteRequirement = (requirementId: string) => {
    deleteRequirement(requirementId);
    toast.success('Scope deleted');
  };

  const handleUpdateRequirement = (requirementId: string, updates: { title: string; description: string }) => {
    updateRequirement(requirementId, updates);
    toast.success('Scope updated');
  };

  const handleAddDocument = (clientId: string, name: string, type: Document['type'], fileUrl: string) => {
    addDocument(clientId, name, type, fileUrl);
    toast.success('Document added');
  };

  const handleDeleteDocument = (docId: string) => {
    deleteDocument(docId);
    toast.success('Document deleted');
  };

  return (
    <AnimatePresence mode="wait">
      {selectedClient ? (
        <motion.div
          key={selectedClient.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.2 }}
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Dashboard
            clients={clientsWithProjects}
            onClientSelect={(clientId) => setSelectedClientId(clientId)}
          />
          <Toaster />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Index;
```

### Create 404 Page

**`src/app/not-found.tsx`:**
```tsx
// Copy content from src/pages/NotFound.tsx
// Add "use client" if it uses hooks or interactivity
"use client";

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <h2 className="text-3xl font-semibold text-foreground mb-4">404 - Page Not Found</h2>
      <p className="text-muted-foreground mb-8">Could not find requested resource</p>
      <Link href="/" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/80 transition-colors">
        Return Home
      </Link>
    </div>
  );
}
```

---

## Step 8: Handle Client Components

Components that need `"use client"`:
- All components using `useState`, `useEffect`, `useRef`
- All components using event handlers (`onClick`, etc.)
- All components using browser APIs
- All Framer Motion components
- All drag-and-drop components
- All form components

**Add to top of each file:**
```tsx
"use client";
```

### Components Requiring "use client":
- `src/components/dashboard/Dashboard.tsx`
- `src/components/dashboard/ClientCard.tsx`
- `src/components/workspace/ClientWorkspace.tsx`
- `src/components/workspace/RequirementBoard.tsx`
- `src/components/workspace/KanbanColumn.tsx`
- `src/components/workspace/TaskCard.tsx`
- `src/components/workspace/AddScopeDialog.tsx`
- `src/components/workspace/DocumentManager.tsx`
- `src/components/workspace/ConfirmDialog.tsx`
- All `src/components/ui/*` components

---

## Step 9: Migrate Hooks and State

Hooks work the same in Next.js client components:
- `useProjectData.ts` - No changes needed
- `use-mobile.tsx` - No changes needed
- `use-toast.ts` - No changes needed

---

## Step 10: Final Testing

1. Run development server: `npm run dev`
2. Test all routes
3. Verify drag-and-drop functionality
4. Test all CRUD operations
5. Check responsive design
6. Verify animations work
7. Test document upload flow
8. Check toast notifications

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
**Solution**: @hello-pangea/dnd works with SSR. Add to layout:
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
- File-based routing
- Built-in optimization
- Server components (where applicable)
- Improved SEO capabilities

The core business logic in hooks and components remains unchanged. Only the entry points and routing structure need modification.
