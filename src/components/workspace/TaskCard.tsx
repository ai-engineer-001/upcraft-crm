import { useState } from 'react';
import { motion } from 'framer-motion';
import { GripVertical, User, Sparkles, Trash2, Edit2, Check, X } from 'lucide-react';
import { Subtask, Priority } from '@/types/project';
import { Button } from '@/components/ui/button';
import { PriorityBadge } from '@/components/ui/priority-badge';
import { PrioritySelect } from '@/components/ui/priority-select';

interface TaskCardProps {
  task: Subtask;
  isDragging: boolean;
  isAdditionalScope: boolean;
  onDelete?: (taskId: string) => void;
  onUpdate?: (taskId: string, updates: Partial<Subtask>) => void;
}

export function TaskCard({ task, isDragging, isAdditionalScope, onDelete, onUpdate }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editAssignee, setEditAssignee] = useState(task.assigned_to || '');
  const [editPriority, setEditPriority] = useState<Priority>(task.priority);
  const [showActions, setShowActions] = useState(false);

  const handleSaveEdit = () => {
    if (editTitle.trim() && onUpdate) {
      onUpdate(task.id, { 
        title: editTitle.trim(),
        assigned_to: editAssignee.trim() || undefined,
        priority: editPriority
      });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditAssignee(task.assigned_to || '');
    setEditPriority(task.priority);
    setIsEditing(false);
  };

  const handlePriorityChange = (newPriority: Priority) => {
    if (onUpdate) {
      onUpdate(task.id, { priority: newPriority });
    }
  };

  if (isEditing) {
    return (
      <div className="glass-card rounded-lg p-3 space-y-2">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="Task title"
          className="w-full bg-muted/50 border border-border rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSaveEdit();
            if (e.key === 'Escape') handleCancelEdit();
          }}
        />
        <input
          type="text"
          value={editAssignee}
          onChange={(e) => setEditAssignee(e.target.value)}
          placeholder="Assignee (optional)"
          className="w-full bg-muted/50 border border-border rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <div className="flex items-center justify-between">
          <PrioritySelect value={editPriority} onChange={setEditPriority} />
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={handleCancelEdit}>
              <X className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-success" onClick={handleSaveEdit}>
              <Check className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`group glass-card rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all duration-200 ${
        isDragging ? 'shadow-lg ring-2 ring-primary/50' : ''
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="w-4 h-4 text-muted-foreground/50 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <PriorityBadge priority={task.priority} />
              <p className="text-sm font-medium text-foreground leading-tight">
                {task.title}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {showActions && (onDelete || onUpdate) && (
                <>
                  {onUpdate && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditing(true);
                      }}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-5 w-5 p-0 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(task.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </>
              )}
              {isAdditionalScope && (
                <Sparkles className="w-3.5 h-3.5 text-warning flex-shrink-0" />
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            {task.assigned_to && (
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                  <User className="w-3 h-3 text-muted-foreground" />
                </div>
                <span className="text-xs text-muted-foreground">{task.assigned_to}</span>
              </div>
            )}
            {onUpdate && showActions && (
              <PrioritySelect value={task.priority} onChange={handlePriorityChange} size="sm" />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
