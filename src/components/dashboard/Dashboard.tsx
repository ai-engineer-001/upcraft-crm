import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutGrid, Users, FolderKanban, TrendingUp, CheckCircle2, 
  ChevronDown, ChevronUp, Search, Filter, Plus, Megaphone, FileWarning 
} from 'lucide-react';
import { ClientWithProject, Priority } from '@/types/project';
import { ClientCard } from './ClientCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AddClientDialog } from './AddClientDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DashboardProps {
  clients: ClientWithProject[];
  completedClients: ClientWithProject[];
  onClientClick: (clientId: string) => void;
  onAddClient: (name: string, email: string, projectName: string, projectPriority: Priority) => void;
  onOutreachClick: () => void;
}

export function Dashboard({ clients, completedClients, onClientClick, onAddClient, onOutreachClick }: DashboardProps) {
  const [showCompleted, setShowCompleted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNoAgreement, setShowNoAgreement] = useState(false);
  const [addClientOpen, setAddClientOpen] = useState(false);

  // Filter clients based on search and filters
  const filteredClients = useMemo(() => {
    let result = clients;
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.projects.some(p => p.name.toLowerCase().includes(query))
      );
    }
    
    // No agreement filter
    if (showNoAgreement) {
      result = result.filter(c => c.agreement_status === 'Pending');
    }
    
    return result;
  }, [clients, searchQuery, showNoAgreement]);

  const filteredCompletedClients = useMemo(() => {
    let result = completedClients;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.projects.some(p => p.name.toLowerCase().includes(query))
      );
    }
    
    if (showNoAgreement) {
      result = result.filter(c => c.agreement_status === 'Pending');
    }
    
    return result;
  }, [completedClients, searchQuery, showNoAgreement]);

  const totalTasks = clients.reduce((acc, client) => {
    return acc + client.projects.reduce((pAcc, project) => {
      return pAcc + project.requirements.reduce((rAcc, req) => rAcc + req.subtasks.length, 0);
    }, 0);
  }, 0);

  const completedTasks = clients.reduce((acc, client) => {
    return acc + client.projects.reduce((pAcc, project) => {
      return pAcc + project.requirements.reduce((rAcc, req) => {
        return rAcc + req.subtasks.filter(t => t.status === 'Done').length;
      }, 0);
    }, 0);
  }, 0);

  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    { label: 'Active Clients', value: clients.length, icon: Users, color: 'text-primary' },
    { label: 'Total Projects', value: clients.reduce((acc, c) => acc + c.projects.length, 0), icon: FolderKanban, color: 'text-secondary' },
    { label: 'Tasks Completed', value: `${completedTasks}/${totalTasks}`, icon: TrendingUp, color: 'text-success' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <LayoutGrid className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Command Center</h1>
                <p className="text-sm text-muted-foreground">Project Management Dashboard</p>
              </div>
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search clients..."
                  className="pl-10 w-64 bg-muted/50"
                />
              </div>

              {/* Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className={showNoAgreement ? 'border-warning text-warning' : ''}>
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                    {showNoAgreement && <FileWarning className="w-3 h-3 ml-1" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuCheckboxItem
                    checked={showNoAgreement}
                    onCheckedChange={setShowNoAgreement}
                  >
                    <FileWarning className="w-4 h-4 mr-2 text-warning" />
                    No Agreement Uploaded
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* OutReach Tracker */}
              <Button variant="outline" size="sm" onClick={onOutreachClick}>
                <Megaphone className="w-4 h-4 mr-2" />
                OutReach Tracker
              </Button>

              {/* Add Client */}
              <Button size="sm" onClick={() => setAddClientOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Client
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="relative mt-4 md:hidden">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clients..."
              className="pl-10 bg-muted/50"
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color} opacity-80`} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Overall Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-foreground">Overall Progress</h2>
            <span className="text-2xl font-bold text-gradient">{overallProgress}%</span>
          </div>
          <div className="progress-bar h-3">
            <motion.div
              className="progress-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Active Clients Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Active Clients</h2>
          <span className="text-sm text-muted-foreground">{filteredClients.length} clients</span>
        </div>

        {/* Client Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredClients.map((client, index) => (
            <ClientCard
              key={client.id}
              client={client}
              onClick={() => onClientClick(client.id)}
              index={index}
            />
          ))}
          {filteredClients.length === 0 && (
            <div className="col-span-full glass-card rounded-xl p-8 text-center text-muted-foreground">
              {searchQuery || showNoAgreement ? 'No clients match your filters.' : 'No active clients at the moment.'}
            </div>
          )}
        </div>

        {/* Completed Clients Section */}
        {(completedClients.length > 0 || filteredCompletedClients.length > 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              variant="ghost"
              className="w-full flex items-center justify-between mb-4 py-3 hover:bg-muted/50"
              onClick={() => setShowCompleted(!showCompleted)}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <h2 className="text-lg font-semibold text-foreground">Completed Clients</h2>
                <span className="text-sm text-muted-foreground">({filteredCompletedClients.length})</span>
              </div>
              {showCompleted ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </Button>

            {showCompleted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredCompletedClients.map((client, index) => (
                  <ClientCard
                    key={client.id}
                    client={client}
                    onClick={() => onClientClick(client.id)}
                    index={index}
                    isCompleted
                  />
                ))}
              </motion.div>
            )}

            <p className="text-xs text-muted-foreground mt-4 text-center">
              Click on a completed client to view their history or add new work requests
            </p>
          </motion.div>
        )}
      </main>

      <AddClientDialog
        open={addClientOpen}
        onOpenChange={setAddClientOpen}
        onAddClient={onAddClient}
      />
    </div>
  );
}
