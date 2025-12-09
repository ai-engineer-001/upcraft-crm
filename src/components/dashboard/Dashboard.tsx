import { motion } from 'framer-motion';
import { LayoutGrid, Users, FolderKanban, TrendingUp } from 'lucide-react';
import { ClientWithProject } from '@/types/project';
import { ClientCard } from './ClientCard';

interface DashboardProps {
  clients: ClientWithProject[];
  onClientClick: (clientId: string) => void;
}

export function Dashboard({ clients, onClientClick }: DashboardProps) {
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <LayoutGrid className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Command Center</h1>
              <p className="text-sm text-muted-foreground">Project Management Dashboard</p>
            </div>
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

        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Active Clients</h2>
          <span className="text-sm text-muted-foreground">{clients.length} clients</span>
        </div>

        {/* Client Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client, index) => (
            <ClientCard
              key={client.id}
              client={client}
              onClick={() => onClientClick(client.id)}
              index={index}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
