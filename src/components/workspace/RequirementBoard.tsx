import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Sparkles, Plus } from 'lucide-react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { RequirementWithTasks, TaskStatus } from '@/types/project';
import { KanbanColumn } from './KanbanColumn';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface RequirementBoardProps {
  requirement: RequirementWithTasks;
  onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask: (requirementId: string, title: string) => void;
}

const statuses: TaskStatus[] = ['To Do', 'In Progress', 'Review', 'Done'];

export function RequirementBoard({ requirement, onTaskStatusChange, onAddTask }: RequirementBoardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const tasksByStatus = statuses.reduce((acc, status) => {
    acc[status] = requirement.subtasks.filter(t => t.status === status);
    return acc;
  }, {} as Record<TaskStatus, typeof requirement.subtasks>);

  const completedCount = tasksByStatus['Done'].length;
  const totalCount = requirement.subtasks.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const sourceStatus = result.source.droppableId.split('-').pop() as TaskStatus;
    const destStatus = result.destination.droppableId.split('-').pop() as TaskStatus;
    
    if (sourceStatus !== destStatus) {
      onTaskStatusChange(result.draggableId, destStatus);
    }
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(requirement.id, newTaskTitle.trim());
      setNewTaskTitle('');
      setIsAddingTask(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card rounded-xl overflow-hidden ${
        requirement.is_additional_scope ? 'scope-creep-indicator' : ''
      }`}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: isExpanded ? 0 : -90 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
          
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{requirement.title}</h3>
              {requirement.is_additional_scope && (
                <Badge variant="scope" className="gap-1">
                  <Sparkles className="w-3 h-3" />
                  New Request
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{requirement.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{progress}%</p>
            <p className="text-xs text-muted-foreground">{completedCount}/{totalCount} tasks</p>
          </div>
          <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              style={{
                background: progress === 100 
                  ? 'hsl(var(--success))' 
                  : 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))'
              }}
            />
          </div>
        </div>
      </button>

      {/* Kanban Board */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              {/* Add Task */}
              <div className="mb-4">
                {isAddingTask ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="Enter task title..."
                      className="flex-1 bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddTask();
                        if (e.key === 'Escape') setIsAddingTask(false);
                      }}
                    />
                    <Button size="sm" onClick={handleAddTask}>Add</Button>
                    <Button size="sm" variant="ghost" onClick={() => setIsAddingTask(false)}>Cancel</Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddingTask(true)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Task
                  </Button>
                )}
              </div>

              <DragDropContext onDragEnd={handleDragEnd}>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {statuses.map((status) => (
                    <KanbanColumn
                      key={status}
                      status={status}
                      tasks={tasksByStatus[status]}
                      requirementTitle={requirement.title}
                      isAdditionalScope={requirement.is_additional_scope}
                    />
                  ))}
                </div>
              </DragDropContext>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
