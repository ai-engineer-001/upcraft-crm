import { motion } from 'framer-motion';
import { GripVertical, User, Sparkles } from 'lucide-react';
import { Subtask } from '@/types/project';

interface TaskCardProps {
  task: Subtask;
  isDragging: boolean;
  isAdditionalScope: boolean;
}

export function TaskCard({ task, isDragging, isAdditionalScope }: TaskCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`group glass-card rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all duration-200 ${
        isDragging ? 'shadow-lg ring-2 ring-primary/50' : ''
      } ${isAdditionalScope ? 'border-l-2 border-l-warning' : ''}`}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="w-4 h-4 text-muted-foreground/50 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-foreground leading-tight">
              {task.title}
            </p>
            {isAdditionalScope && (
              <Sparkles className="w-3.5 h-3.5 text-warning flex-shrink-0" />
            )}
          </div>
          
          {task.assigned_to && (
            <div className="flex items-center gap-1 mt-2">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                <User className="w-3 h-3 text-muted-foreground" />
              </div>
              <span className="text-xs text-muted-foreground">{task.assigned_to}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
