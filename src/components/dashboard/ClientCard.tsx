import { motion } from 'framer-motion';
import { Building2, Mail, AlertTriangle, CheckCircle2, ChevronRight, History } from 'lucide-react';
import { ClientWithProject } from '@/types/project';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PriorityBadge } from '@/components/ui/priority-badge';

interface ClientCardProps {
  client: ClientWithProject;
  onClick: () => void;
  index: number;
  isCompleted?: boolean;
}

export function ClientCard({ client, onClick, index, isCompleted = false }: ClientCardProps) {
  const activeProject = client.projects[0];
  const isPending = client.agreement_status === 'Pending';
  const progress = activeProject?.progress ?? 0;
  const isComplete = progress === 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      onClick={onClick}
      className={`glass-card rounded-xl p-6 cursor-pointer group relative overflow-hidden ${
        isCompleted ? 'opacity-80 hover:opacity-100' : ''
      }`}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className={`absolute inset-0 bg-gradient-to-br ${
          isCompleted ? 'from-success/10' : 'from-primary/10'
        } via-transparent to-transparent`} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              isCompleted 
                ? 'bg-gradient-to-br from-success/20 to-success/5' 
                : 'bg-gradient-to-br from-primary/20 to-primary/5'
            }`}>
              {isCompleted ? (
                <History className="w-6 h-6 text-success" />
              ) : (
                <Building2 className="w-6 h-6 text-primary" />
              )}
            </div>
            <div>
              <h3 className={`font-semibold transition-colors ${
                isCompleted 
                  ? 'text-foreground group-hover:text-success' 
                  : 'text-foreground group-hover:text-primary'
              }`}>
                {client.name}
              </h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Mail className="w-3 h-3" />
                {client.email}
              </div>
            </div>
          </div>
          <ChevronRight className={`w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-all ${
            isCompleted ? 'group-hover:text-success' : 'group-hover:text-primary'
          }`} />
        </div>

        {/* Completed Badge */}
        {isCompleted && (
          <Badge variant="success" className="gap-1 mb-4">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </Badge>
        )}

        {/* Agreement Status */}
        {!isCompleted && (
          <div className="flex items-center gap-2 mb-4">
            {isPending ? (
              <>
                <Badge variant="destructive" className="gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Agreement Pending
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-xs text-warning hover:text-warning"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  Remind
                </Button>
              </>
            ) : (
              <Badge variant="success" className="gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Agreement Signed
              </Badge>
            )}
          </div>
        )}

        {/* Active Project */}
        {activeProject && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <PriorityBadge priority={activeProject.priority} />
                <span className="text-muted-foreground">{activeProject.name}</span>
              </div>
              <span className={`font-medium ${isComplete ? 'text-success' : 'text-foreground'}`}>
                {progress}%
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="progress-bar">
              <motion.div
                className={`progress-bar-fill ${isComplete ? 'bg-success' : ''}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.1 + 0.3 }}
                style={isComplete ? { background: 'hsl(var(--success))' } : undefined}
              />
            </div>

            {/* Scope Creep Indicator */}
            {activeProject.requirements.some(r => r.is_additional_scope) && (
              <Badge variant="scope" className="text-xs mt-2">
                + New Scope Items
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Completion celebration effect */}
      {isComplete && !isCompleted && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3"
        >
          <div className="w-3 h-3 rounded-full bg-success animate-pulse-glow" />
        </motion.div>
      )}
    </motion.div>
  );
}
