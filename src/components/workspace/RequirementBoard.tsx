import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { RequirementWithTasks, TaskStatus, Subtask, Priority, Requirement } from '@/types/project';
import { KanbanColumn } from './KanbanColumn';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from './ConfirmDialog';
import { PriorityBadge } from '@/components/ui/priority-badge';
import { PrioritySelect } from '@/components/ui/priority-select';

interface RequirementBoardProps {
  requirement: RequirementWithTasks;
  onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask: (requirementId: string, title: string, assignedTo?: string, priority?: Priority) => void;
  onDeleteTask?: (taskId: string) => void;
  onUpdateTask?: (taskId: string, updates: Partial<Subtask>) => void;
  onDeleteRequirement?: (requirementId: string) => void;
  onUpdateRequirement?: (requirementId: string, updates: Partial<Requirement>) => void;
}

const statuses: TaskStatus[] = ['To Do', 'In Progress', 'Review', 'Done'];

export function RequirementBoard({ 
  requirement, 
  onTaskStatusChange, 
  onAddTask,
  onDeleteTask,
  onUpdateTask,
  onDeleteRequirement,
  onUpdateRequirement,
}: RequirementBoardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('Medium');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(requirement.title);
  const [editDescription, setEditDescription] = useState(requirement.description);
  const [deleteReqDialogOpen, setDeleteReqDialogOpen] = useState(false);
  const [deleteTaskDialogOpen, setDeleteTaskDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

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
      onAddTask(requirement.id, newTaskTitle.trim(), newTaskAssignee.trim() || undefined, newTaskPriority);
      setNewTaskTitle('');
      setNewTaskAssignee('');
      setNewTaskPriority('Medium');
      setIsAddingTask(false);
    }
  };

  const handlePriorityChange = (newPriority: Priority) => {
    if (onUpdateRequirement) {
      onUpdateRequirement(requirement.id, { priority: newPriority });
    }
  };

  const handleSaveEdit = () => {
    if (editTitle.trim() && editDescription.trim() && onUpdateRequirement) {
      onUpdateRequirement(requirement.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
      });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(requirement.title);
    setEditDescription(requirement.description);
    setIsEditing(false);
  };

  const handleDeleteTaskClick = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteTaskDialogOpen(true);
  };

  const handleConfirmDeleteTask = () => {
    if (taskToDelete && onDeleteTask) {
      onDeleteTask(taskToDelete);
      setTaskToDelete(null);
    }
    setDeleteTaskDialogOpen(false);
  };

  const handleConfirmDeleteRequirement = () => {
    if (onDeleteRequirement) {
      onDeleteRequirement(requirement.id);
    }
    setDeleteReqDialogOpen(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`glass-card rounded-xl overflow-hidden ${
          requirement.is_additional_scope ? 'scope-creep-indicator' : ''
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-3 flex-1"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 0 : -90 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </motion.div>
            
            {isEditing ? (
              <div className="flex-1 text-left" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-muted/50 border border-border rounded px-2 py-1 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 mb-1"
                  autoFocus
                />
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-muted/50 border border-border rounded px-2 py-1 text-xs text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            ) : (
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={requirement.priority} />
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
            )}
          </button>

          <div className="flex items-center gap-4">
            {isEditing ? (
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                  <X className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-success" onClick={handleSaveEdit}>
                  <Check className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <PrioritySelect value={requirement.priority} onChange={handlePriorityChange} />
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
                {(onUpdateRequirement || onDeleteRequirement) && (
                  <div className="flex gap-1">
                    {onUpdateRequirement && (
                      <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    )}
                    {onDeleteRequirement && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-destructive"
                        onClick={() => setDeleteReqDialogOpen(true)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

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
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          placeholder="Task title..."
                          className="flex-1 bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newTaskTitle.trim()) handleAddTask();
                            if (e.key === 'Escape') {
                              setIsAddingTask(false);
                              setNewTaskTitle('');
                              setNewTaskAssignee('');
                              setNewTaskPriority('Medium');
                            }
                          }}
                        />
                        <input
                          type="text"
                          value={newTaskAssignee}
                          onChange={(e) => setNewTaskAssignee(e.target.value)}
                          placeholder="Assignee"
                          className="w-32 bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <PrioritySelect value={newTaskPriority} onChange={setNewTaskPriority} />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleAddTask} disabled={!newTaskTitle.trim()}>Add Task</Button>
                        <Button size="sm" variant="ghost" onClick={() => {
                          setIsAddingTask(false);
                          setNewTaskTitle('');
                          setNewTaskAssignee('');
                          setNewTaskPriority('Medium');
                        }}>Cancel</Button>
                      </div>
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
                        onDeleteTask={onDeleteTask ? handleDeleteTaskClick : undefined}
                        onUpdateTask={onUpdateTask}
                      />
                    ))}
                  </div>
                </DragDropContext>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <ConfirmDialog
        open={deleteReqDialogOpen}
        onOpenChange={setDeleteReqDialogOpen}
        title="Delete Requirement"
        description={`Are you sure you want to delete "${requirement.title}"? This will also delete all ${totalCount} tasks within it. This action cannot be undone.`}
        onConfirm={handleConfirmDeleteRequirement}
      />

      <ConfirmDialog
        open={deleteTaskDialogOpen}
        onOpenChange={setDeleteTaskDialogOpen}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleConfirmDeleteTask}
      />
    </>
  );
}