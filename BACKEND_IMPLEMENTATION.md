# Backend Implementation Guide

## Multi-User Project Management System with Low-Latency Backend

This document provides a comprehensive guide to implementing a secure, multi-user backend for the Project Management System using Supabase or a custom backend solution.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Database Schema](#database-schema)
3. [API Endpoints](#api-endpoints)
4. [Authentication & Authorization](#authentication--authorization)
5. [Real-time Subscriptions](#real-time-subscriptions)
6. [File Storage](#file-storage)
7. [Frontend Integration](#frontend-integration)
8. [Security Best Practices](#security-best-practices)
9. [Performance Optimization](#performance-optimization)

---

## 1. System Overview

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Frontend (React/Vite)                       │
├─────────────────────────────────────────────────────────────────────┤
│  Dashboard  │  Workspace  │  OutreachTracker  │  DocumentManager    │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Supabase Client   │
                    │   (API + Realtime)  │
                    └──────────┬──────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────────┐
│                        Supabase Backend                              │
├─────────────┬─────────────┬─────────────┬──────────────────────────┤
│  PostgreSQL │    Auth     │   Storage   │    Edge Functions        │
│  Database   │   (JWT)     │   (Files)   │   (Serverless)           │
└─────────────┴─────────────┴─────────────┴──────────────────────────┘
```

### Core Features

| Feature | Description | Backend Requirement |
|---------|-------------|---------------------|
| Multi-user | Multiple team members access simultaneously | Auth + RLS |
| Real-time | Instant updates across all clients | Supabase Realtime |
| File uploads | Document storage and retrieval | Storage buckets |
| Outreach tracking | CRM-like functionality | Database + API |
| Task management | Kanban boards with drag-drop | Database + Realtime |

---

## 2. Database Schema

### Entity Relationship Diagram

```
┌──────────────────┐       ┌──────────────────┐
│      users       │       │    user_roles    │
│──────────────────│       │──────────────────│
│ id (PK, UUID)    │◄──────│ user_id (FK)     │
│ email            │       │ role (enum)      │
│ created_at       │       │ id (PK)          │
└──────────────────┘       └──────────────────┘
         │
         │ 1:N
         ▼
┌──────────────────┐       ┌──────────────────┐
│     profiles     │       │   team_members   │
│──────────────────│       │──────────────────│
│ id (PK, FK)      │       │ id (PK)          │
│ full_name        │       │ user_id (FK)     │
│ avatar_url       │       │ team_id (FK)     │
│ updated_at       │       │ role             │
└──────────────────┘       └──────────────────┘
                                    │
         ┌──────────────────────────┘
         │
         ▼
┌──────────────────┐
│      teams       │
│──────────────────│
│ id (PK)          │
│ name             │
│ created_by (FK)  │
│ created_at       │
└──────────────────┘
         │
         │ 1:N
         ▼
┌──────────────────┐       ┌──────────────────┐
│     clients      │       │    documents     │
│──────────────────│       │──────────────────│
│ id (PK)          │◄──────│ client_id (FK)   │
│ team_id (FK)     │       │ id (PK)          │
│ name             │       │ name             │
│ email            │       │ type             │
│ status           │       │ file_url         │
│ agreement_status │       │ uploaded_by (FK) │
│ created_by (FK)  │       │ uploaded_at      │
│ created_at       │       └──────────────────┘
└──────────────────┘
         │
         │ 1:N
         ▼
┌──────────────────┐
│     projects     │
│──────────────────│
│ id (PK)          │
│ client_id (FK)   │
│ name             │
│ status           │
│ priority         │
│ start_date       │
│ deadline         │
│ created_at       │
└──────────────────┘
         │
         │ 1:N
         ▼
┌──────────────────┐
│   requirements   │
│──────────────────│
│ id (PK)          │
│ project_id (FK)  │
│ title            │
│ description      │
│ is_additional_   │
│   scope          │
│ priority         │
│ created_at       │
└──────────────────┘
         │
         │ 1:N
         ▼
┌──────────────────┐
│     subtasks     │
│──────────────────│
│ id (PK)          │
│ requirement_id   │
│   (FK)           │
│ title            │
│ status           │
│ priority         │
│ assigned_to (FK) │
│ created_at       │
│ updated_at       │
└──────────────────┘

┌──────────────────┐
│ outreach_records │
│──────────────────│
│ id (PK)          │
│ team_id (FK)     │
│ status           │
│ startup_name     │
│ founder          │
│ contact_link     │
│ contact_platform │
│ tech_stack       │
│ problem_type     │
│ specific_issue   │
│ audit_link       │
│ outreach_date    │
│ next_action      │
│ created_by (FK)  │
│ created_at       │
│ updated_at       │
└──────────────────┘
```

### SQL Migration Scripts

#### 1. Create Enums and Types

```sql
-- supabase/migrations/001_create_types.sql

-- User roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'member', 'viewer');

-- Client status enum
CREATE TYPE public.client_status AS ENUM ('Active', 'Completed', 'Archived');

-- Agreement status enum
CREATE TYPE public.agreement_status AS ENUM ('Pending', 'Signed');

-- Project status enum
CREATE TYPE public.project_status AS ENUM ('Planning', 'In Progress', 'Completed');

-- Task status enum
CREATE TYPE public.task_status AS ENUM ('To Do', 'In Progress', 'Review', 'Done');

-- Priority enum
CREATE TYPE public.priority AS ENUM ('Low', 'Medium', 'High', 'Urgent');

-- Document type enum
CREATE TYPE public.document_type AS ENUM ('agreement', 'contract', 'proposal', 'other');

-- Outreach status enum
CREATE TYPE public.outreach_status AS ENUM ('Identified', 'Contacted', 'Replied', 'In-Talks', 'Converted', 'Lost');

-- Contact platform enum
CREATE TYPE public.contact_platform AS ENUM ('LinkedIn', 'Twitter', 'Email', 'Other');
```

#### 2. Create User Profiles Table

```sql
-- supabase/migrations/002_create_profiles.sql

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- RLS Policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);
```

#### 3. Create User Roles Table

```sql
-- supabase/migrations/003_create_user_roles.sql

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies
CREATE POLICY "Admins can manage all roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
```

#### 4. Create Teams Table

```sql
-- supabase/migrations/004_create_teams.sql

CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (team_id, user_id)
);

-- Enable RLS
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Helper function to check team membership
CREATE OR REPLACE FUNCTION public.is_team_member(_team_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.team_members
    WHERE team_id = _team_id
      AND user_id = _user_id
  )
$$;

-- RLS Policies for teams
CREATE POLICY "Team members can view their teams"
  ON public.teams FOR SELECT
  TO authenticated
  USING (public.is_team_member(id, auth.uid()));

CREATE POLICY "Admins can create teams"
  ON public.teams FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for team_members
CREATE POLICY "Team members can view team roster"
  ON public.team_members FOR SELECT
  TO authenticated
  USING (public.is_team_member(team_id, auth.uid()));
```

#### 5. Create Clients Table

```sql
-- supabase/migrations/005_create_clients.sql

CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  status public.client_status NOT NULL DEFAULT 'Active',
  agreement_status public.agreement_status NOT NULL DEFAULT 'Pending',
  agreement_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Index for faster queries
CREATE INDEX idx_clients_team_id ON public.clients(team_id);
CREATE INDEX idx_clients_status ON public.clients(status);

-- RLS Policies
CREATE POLICY "Team members can view clients"
  ON public.clients FOR SELECT
  TO authenticated
  USING (public.is_team_member(team_id, auth.uid()));

CREATE POLICY "Team members can create clients"
  ON public.clients FOR INSERT
  TO authenticated
  WITH CHECK (public.is_team_member(team_id, auth.uid()));

CREATE POLICY "Team members can update clients"
  ON public.clients FOR UPDATE
  TO authenticated
  USING (public.is_team_member(team_id, auth.uid()));

CREATE POLICY "Admins/Managers can delete clients"
  ON public.clients FOR DELETE
  TO authenticated
  USING (
    public.is_team_member(team_id, auth.uid()) 
    AND (
      public.has_role(auth.uid(), 'admin') 
      OR public.has_role(auth.uid(), 'manager')
    )
  );
```

#### 6. Create Projects Table

```sql
-- supabase/migrations/006_create_projects.sql

CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  status public.project_status NOT NULL DEFAULT 'Planning',
  priority public.priority NOT NULL DEFAULT 'Medium',
  start_date DATE,
  deadline DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Index
CREATE INDEX idx_projects_client_id ON public.projects(client_id);

-- Helper function to get team_id from client
CREATE OR REPLACE FUNCTION public.get_client_team_id(_client_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT team_id FROM public.clients WHERE id = _client_id
$$;

-- RLS Policies
CREATE POLICY "Team members can view projects"
  ON public.projects FOR SELECT
  TO authenticated
  USING (
    public.is_team_member(public.get_client_team_id(client_id), auth.uid())
  );

CREATE POLICY "Team members can create projects"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_team_member(public.get_client_team_id(client_id), auth.uid())
  );

CREATE POLICY "Team members can update projects"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (
    public.is_team_member(public.get_client_team_id(client_id), auth.uid())
  );

CREATE POLICY "Team members can delete projects"
  ON public.projects FOR DELETE
  TO authenticated
  USING (
    public.is_team_member(public.get_client_team_id(client_id), auth.uid())
  );
```

#### 7. Create Requirements Table

```sql
-- supabase/migrations/007_create_requirements.sql

CREATE TABLE public.requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_additional_scope BOOLEAN NOT NULL DEFAULT FALSE,
  priority public.priority NOT NULL DEFAULT 'Medium',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.requirements ENABLE ROW LEVEL SECURITY;

-- Index
CREATE INDEX idx_requirements_project_id ON public.requirements(project_id);

-- Helper function to get team_id from project
CREATE OR REPLACE FUNCTION public.get_project_team_id(_project_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.team_id 
  FROM public.projects p
  JOIN public.clients c ON p.client_id = c.id
  WHERE p.id = _project_id
$$;

-- RLS Policies
CREATE POLICY "Team members can view requirements"
  ON public.requirements FOR SELECT
  TO authenticated
  USING (
    public.is_team_member(public.get_project_team_id(project_id), auth.uid())
  );

CREATE POLICY "Team members can manage requirements"
  ON public.requirements FOR ALL
  TO authenticated
  USING (
    public.is_team_member(public.get_project_team_id(project_id), auth.uid())
  );
```

#### 8. Create Subtasks Table

```sql
-- supabase/migrations/008_create_subtasks.sql

CREATE TABLE public.subtasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requirement_id UUID REFERENCES public.requirements(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  status public.task_status NOT NULL DEFAULT 'To Do',
  priority public.priority NOT NULL DEFAULT 'Medium',
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX idx_subtasks_requirement_id ON public.subtasks(requirement_id);
CREATE INDEX idx_subtasks_assigned_to ON public.subtasks(assigned_to);
CREATE INDEX idx_subtasks_status ON public.subtasks(status);

-- Helper function to get team_id from requirement
CREATE OR REPLACE FUNCTION public.get_requirement_team_id(_requirement_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.team_id 
  FROM public.requirements r
  JOIN public.projects p ON r.project_id = p.id
  JOIN public.clients c ON p.client_id = c.id
  WHERE r.id = _requirement_id
$$;

-- RLS Policies
CREATE POLICY "Team members can view subtasks"
  ON public.subtasks FOR SELECT
  TO authenticated
  USING (
    public.is_team_member(public.get_requirement_team_id(requirement_id), auth.uid())
  );

CREATE POLICY "Team members can manage subtasks"
  ON public.subtasks FOR ALL
  TO authenticated
  USING (
    public.is_team_member(public.get_requirement_team_id(requirement_id), auth.uid())
  );

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subtasks_updated_at
  BEFORE UPDATE ON public.subtasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
```

#### 9. Create Documents Table

```sql
-- supabase/migrations/009_create_documents.sql

CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type public.document_type NOT NULL DEFAULT 'other',
  file_url TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Index
CREATE INDEX idx_documents_client_id ON public.documents(client_id);

-- RLS Policies
CREATE POLICY "Team members can view documents"
  ON public.documents FOR SELECT
  TO authenticated
  USING (
    public.is_team_member(public.get_client_team_id(client_id), auth.uid())
  );

CREATE POLICY "Team members can upload documents"
  ON public.documents FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_team_member(public.get_client_team_id(client_id), auth.uid())
  );

CREATE POLICY "Team members can delete documents"
  ON public.documents FOR DELETE
  TO authenticated
  USING (
    public.is_team_member(public.get_client_team_id(client_id), auth.uid())
  );

-- Function to update client agreement status when agreement uploaded
CREATE OR REPLACE FUNCTION public.update_client_agreement_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'agreement' THEN
    UPDATE public.clients
    SET agreement_status = 'Signed', agreement_url = NEW.file_url
    WHERE id = NEW.client_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_agreement_uploaded
  AFTER INSERT ON public.documents
  FOR EACH ROW
  WHEN (NEW.type = 'agreement')
  EXECUTE FUNCTION public.update_client_agreement_status();
```

#### 10. Create Outreach Records Table

```sql
-- supabase/migrations/010_create_outreach_records.sql

CREATE TABLE public.outreach_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  status public.outreach_status NOT NULL DEFAULT 'Identified',
  startup_name TEXT NOT NULL,
  founder TEXT NOT NULL,
  contact_link TEXT,
  contact_platform public.contact_platform DEFAULT 'Other',
  tech_stack TEXT,
  problem_type TEXT,
  specific_issue TEXT,
  audit_link TEXT,
  outreach_date DATE,
  next_action TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.outreach_records ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX idx_outreach_team_id ON public.outreach_records(team_id);
CREATE INDEX idx_outreach_status ON public.outreach_records(status);

-- RLS Policies
CREATE POLICY "Team members can view outreach records"
  ON public.outreach_records FOR SELECT
  TO authenticated
  USING (public.is_team_member(team_id, auth.uid()));

CREATE POLICY "Team members can create outreach records"
  ON public.outreach_records FOR INSERT
  TO authenticated
  WITH CHECK (public.is_team_member(team_id, auth.uid()));

CREATE POLICY "Team members can update outreach records"
  ON public.outreach_records FOR UPDATE
  TO authenticated
  USING (public.is_team_member(team_id, auth.uid()));

CREATE POLICY "Team members can delete outreach records"
  ON public.outreach_records FOR DELETE
  TO authenticated
  USING (public.is_team_member(team_id, auth.uid()));
```

#### 11. Enable Realtime

```sql
-- supabase/migrations/011_enable_realtime.sql

-- Enable realtime for tables that need live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.subtasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.requirements;
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.clients;
ALTER PUBLICATION supabase_realtime ADD TABLE public.documents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.outreach_records;

-- Enable replica identity for full row data
ALTER TABLE public.subtasks REPLICA IDENTITY FULL;
ALTER TABLE public.requirements REPLICA IDENTITY FULL;
ALTER TABLE public.projects REPLICA IDENTITY FULL;
ALTER TABLE public.clients REPLICA IDENTITY FULL;
ALTER TABLE public.documents REPLICA IDENTITY FULL;
ALTER TABLE public.outreach_records REPLICA IDENTITY FULL;
```

---

## 3. API Endpoints

### Client Operations

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/clients` | List all clients for team | - |
| GET | `/clients/:id` | Get single client with projects | - |
| POST | `/clients` | Create new client | `{ name, email, team_id }` |
| PATCH | `/clients/:id` | Update client | `{ name?, email?, status? }` |
| DELETE | `/clients/:id` | Delete client | - |

### Project Operations

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/projects` | List all projects | - |
| GET | `/projects/:id` | Get project with requirements | - |
| POST | `/projects` | Create new project | `{ client_id, name, priority }` |
| PATCH | `/projects/:id` | Update project | `{ name?, status?, priority? }` |
| DELETE | `/projects/:id` | Delete project | - |

### Requirement Operations

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/requirements?project_id=` | List requirements | - |
| POST | `/requirements` | Create requirement | `{ project_id, title, description, is_additional_scope, priority }` |
| PATCH | `/requirements/:id` | Update requirement | `{ title?, description?, priority? }` |
| DELETE | `/requirements/:id` | Delete requirement | - |

### Subtask Operations

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/subtasks?requirement_id=` | List subtasks | - |
| POST | `/subtasks` | Create subtask | `{ requirement_id, title, priority, assigned_to? }` |
| PATCH | `/subtasks/:id` | Update subtask | `{ title?, status?, priority?, assigned_to? }` |
| DELETE | `/subtasks/:id` | Delete subtask | - |

### Document Operations

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/documents?client_id=` | List documents | - |
| POST | `/documents/upload` | Upload document | FormData |
| DELETE | `/documents/:id` | Delete document | - |

### Outreach Operations

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/outreach` | List all outreach records | - |
| POST | `/outreach` | Create outreach record | `{ startup_name, founder, ... }` |
| PATCH | `/outreach/:id` | Update outreach record | `{ status?, next_action?, ... }` |
| DELETE | `/outreach/:id` | Delete outreach record | - |

---

## 4. Authentication & Authorization

### Auth Flow

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
```

### Auth Context

```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

---

## 5. Real-time Subscriptions

### Real-time Hook

```typescript
// src/hooks/useRealtimeSubscription.ts
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

type TableName = 'subtasks' | 'requirements' | 'projects' | 'clients' | 'documents' | 'outreach_records';

interface UseRealtimeOptions<T> {
  table: TableName;
  filter?: { column: string; value: string };
  onInsert?: (payload: T) => void;
  onUpdate?: (payload: T) => void;
  onDelete?: (payload: { old: T }) => void;
}

export function useRealtimeSubscription<T>({
  table,
  filter,
  onInsert,
  onUpdate,
  onDelete,
}: UseRealtimeOptions<T>) {
  useEffect(() => {
    let channel: RealtimeChannel;

    const setupSubscription = () => {
      channel = supabase
        .channel(`${table}-changes`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table,
            filter: filter ? `${filter.column}=eq.${filter.value}` : undefined,
          },
          (payload) => onInsert?.(payload.new as T)
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table,
            filter: filter ? `${filter.column}=eq.${filter.value}` : undefined,
          },
          (payload) => onUpdate?.(payload.new as T)
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table,
            filter: filter ? `${filter.column}=eq.${filter.value}` : undefined,
          },
          (payload) => onDelete?.(payload as { old: T })
        )
        .subscribe();
    };

    setupSubscription();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filter?.column, filter?.value, onInsert, onUpdate, onDelete]);
}
```

### Usage Example

```typescript
// In component
useRealtimeSubscription<Subtask>({
  table: 'subtasks',
  filter: { column: 'requirement_id', value: requirementId },
  onInsert: (newTask) => {
    queryClient.invalidateQueries(['subtasks', requirementId]);
  },
  onUpdate: (updatedTask) => {
    queryClient.setQueryData(['subtasks', requirementId], (old: Subtask[]) =>
      old.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  },
  onDelete: ({ old }) => {
    queryClient.setQueryData(['subtasks', requirementId], (tasks: Subtask[]) =>
      tasks.filter((t) => t.id !== old.id)
    );
  },
});
```

---

## 6. File Storage

### Storage Bucket Setup

```sql
-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false);

-- RLS Policies for storage
CREATE POLICY "Team members can upload documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'documents' AND
    (storage.foldername(name))[1] IN (
      SELECT team_id::text FROM public.team_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Team members can view documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'documents' AND
    (storage.foldername(name))[1] IN (
      SELECT team_id::text FROM public.team_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Team members can delete documents"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'documents' AND
    (storage.foldername(name))[1] IN (
      SELECT team_id::text FROM public.team_members 
      WHERE user_id = auth.uid()
    )
  );
```

### File Upload Service

```typescript
// src/services/fileService.ts
import { supabase } from '@/lib/supabase';

export async function uploadDocument(
  teamId: string,
  clientId: string,
  file: File,
  documentType: DocumentType
): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${teamId}/${clientId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('documents')
    .getPublicUrl(fileName);

  return publicUrl;
}

export async function deleteDocument(filePath: string): Promise<void> {
  const { error } = await supabase.storage
    .from('documents')
    .remove([filePath]);

  if (error) throw error;
}

export function getDocumentUrl(filePath: string): string {
  const { data: { publicUrl } } = supabase.storage
    .from('documents')
    .getPublicUrl(filePath);

  return publicUrl;
}
```

---

## 7. Frontend Integration

### Updated useProjectData Hook

```typescript
// src/hooks/useProjectData.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useRealtimeSubscription } from './useRealtimeSubscription';

export function useProjectData() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch clients with projects
  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          projects (
            *,
            requirements (
              *,
              subtasks (*)
            )
          ),
          documents (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Create client mutation
  const createClient = useMutation({
    mutationFn: async (data: CreateClientInput) => {
      const { data: client, error } = await supabase
        .from('clients')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return client;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['clients']);
    },
  });

  // Update task status mutation with optimistic update
  const updateTaskStatus = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: TaskStatus }) => {
      const { data, error } = await supabase
        .from('subtasks')
        .update({ status })
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async ({ taskId, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['clients']);

      // Snapshot previous value
      const previousClients = queryClient.getQueryData(['clients']);

      // Optimistically update
      queryClient.setQueryData(['clients'], (old: any) =>
        updateTaskStatusOptimistically(old, taskId, status)
      );

      return { previousClients };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['clients'], context?.previousClients);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['clients']);
    },
  });

  // Real-time subscriptions
  useRealtimeSubscription({
    table: 'subtasks',
    onUpdate: () => queryClient.invalidateQueries(['clients']),
    onInsert: () => queryClient.invalidateQueries(['clients']),
    onDelete: () => queryClient.invalidateQueries(['clients']),
  });

  return {
    clients,
    clientsLoading,
    createClient,
    updateTaskStatus,
    // ... other methods
  };
}
```

### Type Definitions

```typescript
// src/types/database.ts
export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          team_id: string;
          name: string;
          email: string | null;
          status: ClientStatus;
          agreement_status: AgreementStatus;
          agreement_url: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['clients']['Insert']>;
      };
      // ... other tables
    };
    Enums: {
      client_status: 'Active' | 'Completed' | 'Archived';
      agreement_status: 'Pending' | 'Signed';
      project_status: 'Planning' | 'In Progress' | 'Completed';
      task_status: 'To Do' | 'In Progress' | 'Review' | 'Done';
      priority: 'Low' | 'Medium' | 'High' | 'Urgent';
      document_type: 'agreement' | 'contract' | 'proposal' | 'other';
      outreach_status: 'Identified' | 'Contacted' | 'Replied' | 'In-Talks' | 'Converted' | 'Lost';
      contact_platform: 'LinkedIn' | 'Twitter' | 'Email' | 'Other';
      app_role: 'admin' | 'manager' | 'member' | 'viewer';
    };
  };
};
```

---

## 8. Security Best Practices

### Input Validation

```typescript
// src/lib/validation.ts
import { z } from 'zod';

export const createClientSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().email().optional().or(z.literal('')),
  team_id: z.string().uuid(),
});

export const createSubtaskSchema = z.object({
  requirement_id: z.string().uuid(),
  title: z.string().trim().min(1).max(500),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),
  assigned_to: z.string().uuid().optional(),
});

export const updateTaskStatusSchema = z.object({
  taskId: z.string().uuid(),
  status: z.enum(['To Do', 'In Progress', 'Review', 'Done']),
});
```

### Security Checklist

- [x] **Row Level Security (RLS)** enabled on all tables
- [x] **Security definer functions** for role checks to prevent RLS recursion
- [x] **Input validation** with Zod schemas on all mutations
- [x] **File upload restrictions** with storage policies
- [x] **Team-based access control** for multi-tenancy
- [x] **Separate roles table** to prevent privilege escalation
- [x] **No sensitive data in client-side storage**
- [x] **JWT validation** on all API requests
- [x] **HTTPS only** for all communications

---

## 9. Performance Optimization

### Database Indexes

```sql
-- Performance indexes
CREATE INDEX idx_subtasks_status_priority ON public.subtasks(status, priority);
CREATE INDEX idx_clients_team_status ON public.clients(team_id, status);
CREATE INDEX idx_projects_client_priority ON public.projects(client_id, priority);
CREATE INDEX idx_outreach_team_status ON public.outreach_records(team_id, status);
```

### Query Optimization

```typescript
// Use select() to limit returned fields
const { data } = await supabase
  .from('clients')
  .select('id, name, status') // Only fetch needed fields
  .eq('team_id', teamId);

// Use single() for single record queries
const { data } = await supabase
  .from('clients')
  .select('*')
  .eq('id', clientId)
  .single();

// Use count for pagination
const { count } = await supabase
  .from('subtasks')
  .select('*', { count: 'exact', head: true })
  .eq('status', 'To Do');
```

### Caching Strategy

```typescript
// React Query caching configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

---

## Implementation Checklist

### Phase 1: Database Setup
- [ ] Create all migration files
- [ ] Run migrations in order
- [ ] Verify RLS policies
- [ ] Test role-based access

### Phase 2: Authentication
- [ ] Set up Supabase Auth
- [ ] Create AuthContext
- [ ] Implement sign in/up flows
- [ ] Add protected routes

### Phase 3: API Integration
- [ ] Replace mock data with Supabase queries
- [ ] Implement all CRUD operations
- [ ] Add optimistic updates
- [ ] Set up real-time subscriptions

### Phase 4: File Storage
- [ ] Configure storage bucket
- [ ] Implement file upload service
- [ ] Add document viewing/download
- [ ] Test storage policies

### Phase 5: Testing & Deployment
- [ ] Test all RLS policies
- [ ] Verify real-time functionality
- [ ] Load testing
- [ ] Production deployment

---

## File Structure

```
project-root/
├── supabase/
│   ├── migrations/
│   │   ├── 001_create_types.sql
│   │   ├── 002_create_profiles.sql
│   │   ├── 003_create_user_roles.sql
│   │   ├── 004_create_teams.sql
│   │   ├── 005_create_clients.sql
│   │   ├── 006_create_projects.sql
│   │   ├── 007_create_requirements.sql
│   │   ├── 008_create_subtasks.sql
│   │   ├── 009_create_documents.sql
│   │   ├── 010_create_outreach_records.sql
│   │   └── 011_enable_realtime.sql
│   └── config.toml
├── src/
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── validation.ts
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   ├── useProjectData.ts
│   │   ├── useRealtimeSubscription.ts
│   │   └── useAuth.ts
│   ├── services/
│   │   ├── clientService.ts
│   │   ├── projectService.ts
│   │   ├── taskService.ts
│   │   ├── documentService.ts
│   │   └── outreachService.ts
│   └── types/
│       ├── database.ts
│       └── project.ts
└── README.md
```

---

This documentation provides a complete blueprint for implementing a secure, scalable, multi-user backend for the Project Management System. Follow the phases in order and test thoroughly at each step.
