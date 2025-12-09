import { motion } from 'framer-motion';
import { Building2, Mail, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import { ClientWithProject } from '@/types/project';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ClientCardProps {
  client: ClientWithProject;
  onClick: () => void;
  index: number;
}

export function ClientCard({ client, onClick, index }: ClientCardProps) {
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
      className="glass-card rounded-xl p-6 cursor-pointer group relative overflow-hidden"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {client.name}
              </h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Mail className="w-3 h-3" />
                {client.email}
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>

        {/* Agreement Status */}
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
                  // TODO: Send reminder
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

        {/* Active Project */}
        {activeProject && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{activeProject.name}</span>
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
      {isComplete && (
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
