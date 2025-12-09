# Vite to Next.js Migration Guide

This document provides a step-by-step guide for migrating this Vite + React project to Next.js App Router, ensuring proper component handling and routing with no errors.

## Table of Contents
1. [Project Analysis](#project-analysis)
2. [Prerequisites](#prerequisites)
3. [Step 1: Create New Next.js Project](#step-1-create-new-nextjs-project)
4. [Step 2: Migrate Dependencies](#step-2-migrate-dependencies)
5. [Step 3: Configure Tailwind CSS](#step-3-configure-tailwind-css)
6. [Step 4: Migrate Design System](#step-4-migrate-design-system)
7. [Step 5: Set Up Path Aliases](#step-5-set-up-path-aliases)
8. [Step 6: Migrate Components](#step-6-migrate-components)
9. [Step 7: Convert Routes](#step-7-convert-routes)
10. [Step 8: Handle Client Components](#step-8-handle-client-components)
11. [Step 9: Migrate Hooks and State](#step-9-migrate-hooks-and-state)
12. [Step 10: Final Testing](#step-10-final-testing)

---

## Project Analysis

### Current Vite Project Structure
```
src/
├── App.tsx                 # Root component with routing
├── main.tsx               # Entry point
├── index.css              # Global styles & design system
├── components/
│   ├── ui/                # Shadcn UI components
│   ├── dashboard/         # Dashboard components
│   └── workspace/         # Workspace components
├── hooks/
│   └── useProjectData.ts  # Data management hook
├── data/
│   └── mockData.ts        # Mock data
├── types/
│   └── project.ts         # TypeScript types
├── pages/
│   ├── Index.tsx          # Main page
│   └── NotFound.tsx       # 404 page
└── lib/
    └── utils.ts           # Utility functions
```

### Current Routing (React Router v6)
- `/` → Index page (Dashboard/ClientWorkspace)
- `*` → NotFound page

### Key Dependencies
- React 18
- React Router DOM v6
- TanStack Query
- Framer Motion
- @hello-pangea/dnd (drag and drop)
- Shadcn UI components
- Tailwind CSS

---

## Prerequisites

Before starting the migration:
1. Ensure Node.js 18.17+ is installed
2. Back up your current project
3. Commit all changes to version control

---

## Step 1: Create New Next.js Project

```bash
# Create a new Next.js project with App Router
npx create-next-app@latest project-management-nextjs --typescript --tailwind --eslint --app --src-dir

# Navigate to the project
cd project-management-nextjs
```

When prompted, select:
- ✅ TypeScript: Yes
- ✅ ESLint: Yes
- ✅ Tailwind CSS: Yes
- ✅ `src/` directory: Yes
- ✅ App Router: Yes
- ❌ Turbopack: No (optional)
- ✅ Custom import alias: Yes (@/*)

---

## Step 2: Migrate Dependencies

Install the same dependencies used in the Vite project:

```bash
# Core UI dependencies
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-avatar @radix-ui/react-badge @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip

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

# Other UI components
npm install cmdk sonner vaul input-otp embla-carousel-react react-resizable-panels recharts lucide-react

# Fonts
npm install @fontsource/manrope

# Theme support
npm install next-themes
```

---

## Step 3: Configure Tailwind CSS

Replace `tailwind.config.ts` with your Vite project's configuration:

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // Copy your entire theme configuration from the Vite project's tailwind.config.ts
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
```

---

## Step 4: Migrate Design System

Copy `src/index.css` from the Vite project to `src/app/globals.css`:

```css
/* src/app/globals.css */
@import '@fontsource/manrope/400.css';
@import '@fontsource/manrope/500.css';
@import '@fontsource/manrope/600.css';
@import '@fontsource/manrope/700.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Copy all your CSS custom properties and utility classes */
@layer base {
  :root {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 210 4% 15.7%;
    --secondary-foreground: 0 0% 98%;
    --muted: 210 4% 15.7%;
    --muted-foreground: 215.4 16.3% 56.9%;
    --accent: 210 4% 15.7%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 210 4% 15.7%;
    --input: 210 4% 15.7%;
    --ring: 224.3 76.3% 48%;
    --radius: 0.5rem;
    --success: 142.1 76.2% 33.3%;
    --success-foreground: 0 0% 100%;
    --warning: 47.1 92.5% 50%;
    --warning-foreground: 0 0% 0%;
    --info: 185.7 74.3% 38.8%;
    --info-foreground: 0 0% 100%;
  }

  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 210 4% 15.7%;
    --secondary-foreground: 0 0% 98%;
    --muted: 210 4% 15.7%;
    --muted-foreground: 215.4 16.3% 56.9%;
    --accent: 210 4% 15.7%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 210 4% 15.7%;
    --input: 210 4% 15.7%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings:
      "rlig" 1,
      "calt" 1;
  }
}

.text-gradient {
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-image: linear-gradient(to right, hsl(var(--primary)), hsl(var(--secondary)));
}

.glass-card {
  background: hsla(0, 0%, 100%, 0.05);
  box-shadow: 0 8px 32px 0 hsla(0, 0%, 0%, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.progress-bar {
  @apply h-3 rounded-full bg-muted overflow-hidden;
}

.progress-bar-fill {
  @apply h-full rounded-full bg-gradient-to-r from-primary to-secondary;
}

.scope-creep-indicator {
  @apply border-l-2 border-l-warning;
}
```

---

## Step 5: Set Up Path Aliases

Update `tsconfig.json`:

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

### Directory Structure Mapping

```
Vite Project               →    Next.js Project
─────────────────────────────────────────────────
src/components/ui/         →    src/components/ui/
src/components/dashboard/  →    src/components/dashboard/
src/components/workspace/  →    src/components/workspace/
src/hooks/                →    src/hooks/
src/data/                 →    src/data/
src/types/                →    src/types/
src/lib/                  →    src/lib/
```

### Copy Components

```bash
# Copy all component directories
cp -r vite-project/src/components/* nextjs-project/src/components/
cp -r vite-project/src/hooks/* nextjs-project/src/hooks/
cp -r vite-project/src/data/* nextjs-project/src/data/
cp -r vite-project/src/types/* nextjs-project/src/types/
cp -r vite-project/src/lib/* nextjs-project/src/lib/
```

---

## Step 7: Convert Routes

### Vite React Router → Next.js App Router

**Before (Vite - src/App.tsx):**
```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);
```

**After (Next.js - File-based routing):**

Create the following file structure:

```
src/app/
├── layout.tsx          # Root layout (replaces App.tsx providers)
├── page.tsx            # Home page (replaces pages/Index.tsx)
├── not-found.tsx       # 404 page (replaces pages/NotFound.tsx)
└── globals.css         # Global styles
```

**src/app/layout.tsx:**
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

**src/app/page.tsx:**
```tsx
"use client";

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

  const handleAddTask = (requirementId: string, title: string) => {
    addSubtask(requirementId, title);
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
    toast.success('New scope added', {
      description: `"${title}" has been added as ${isAdditionalScope ? 'additional scope' : 'core requirement'}.`,
    });
  };

  const handleDeleteRequirement = (requirementId: string) => {
    deleteRequirement(requirementId);
    toast.success('Requirement deleted');
  };

  const handleUpdateRequirement = (requirementId: string, updates: { title: string; description: string }) => {
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
              onClientClick={setSelectedClientId}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Index;
```

**src/app/not-found.tsx:**
```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-muted-foreground">Page not found</p>
        <Link href="/" className="text-primary hover:underline">
          Go back home
        </Link>
      </div>
    </div>
  );
}
```

---

## Step 8: Handle Client Components

Next.js App Router uses Server Components by default. Components using:
- `useState`, `useEffect`, `useContext`
- Browser APIs
- Event handlers
- Framer Motion animations
- Drag and drop

Must be marked as Client Components with `"use client"` directive.

### Components Requiring "use client"

Add `"use client"` at the top of these files:

```tsx
// src/components/workspace/ClientWorkspace.tsx
"use client";
// ... existing code

// src/components/workspace/RequirementBoard.tsx
"use client";
// ... existing code

// src/components/workspace/TaskCard.tsx
"use client";
// ... existing code

// src/components/workspace/KanbanColumn.tsx
"use client";
// ... existing code

// src/components/dashboard/Dashboard.tsx
"use client";
// ... existing code

// src/components/dashboard/ClientCard.tsx
"use client";
// ... existing code

// All Shadcn UI components that use hooks
// src/components/ui/dialog.tsx
"use client";
// ... etc.
```

---

## Step 9: Migrate Hooks and State

### Create Query Provider

**src/components/providers/query-provider.tsx:**
```tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### Update useProjectData Hook

The hook can remain largely the same but ensure it's only used in Client Components:

```tsx
// src/hooks/useProjectData.ts
// No changes needed - just ensure it's imported in "use client" components
```

---

## Step 10: Final Testing

### Build and Run

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

### Checklist

- [ ] All pages load without errors
- [ ] Navigation works correctly
- [ ] Animations work (Framer Motion)
- [ ] Drag and drop works (@hello-pangea/dnd)
- [ ] Theme switching works
- [ ] All modals/dialogs open properly
- [ ] Toast notifications appear
- [ ] Forms submit correctly
- [ ] TypeScript has no errors
- [ ] No hydration mismatches

### Common Issues and Solutions

**1. Hydration Mismatch**
```tsx
// Add suppressHydrationWarning to html tag
<html lang="en" suppressHydrationWarning>
```

**2. "use client" Missing Error**
```
Error: useState can only be used in a Client Component
```
Solution: Add `"use client"` directive at the top of the file.

**3. Import Path Errors**
Solution: Ensure `tsconfig.json` has correct path aliases.

**4. CSS Not Loading**
Solution: Verify `globals.css` is imported in `layout.tsx`.

**5. Framer Motion SSR Issues**
```tsx
// Use dynamic import with ssr: false if needed
import dynamic from 'next/dynamic';
const MotionDiv = dynamic(
  () => import('framer-motion').then(mod => mod.motion.div),
  { ssr: false }
);
```

---

## Summary

The migration from Vite to Next.js involves:

1. **Project Setup**: Create new Next.js project with App Router
2. **Dependencies**: Install same packages
3. **Styling**: Migrate Tailwind config and CSS
4. **Components**: Copy and add "use client" where needed
5. **Routing**: Convert from React Router to file-based routing
6. **State**: Wrap providers in layout.tsx
7. **Testing**: Verify all functionality works

### Key Differences

| Vite + React Router | Next.js App Router |
|--------------------|--------------------|
| `BrowserRouter` | File-based routing |
| `routes.tsx` | `app/` directory structure |
| All components are client | Server Components by default |
| `main.tsx` entry | `layout.tsx` root |
| `index.css` | `app/globals.css` |

### Benefits After Migration

- Server-side rendering (SSR)
- Static site generation (SSG)
- API routes in the same project
- Better SEO out of the box
- Automatic code splitting
- Built-in image optimization
- Edge runtime support
