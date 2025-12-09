import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Subtask, TaskStatus } from '@/types/project';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Subtask[];
  requirementTitle: string;
  isAdditionalScope: boolean;
  onDeleteTask?: (taskId: string) => void;
  onUpdateTask?: (taskId: string, updates: Partial<Subtask>) => void;
}

const statusConfig: Record<TaskStatus, { label: string; color: string; bgColor: string }> = {
  'To Do': { label: 'To Do', color: 'text-muted-foreground', bgColor: 'bg-muted/50' },
  'In Progress': { label: 'In Progress', color: 'text-info', bgColor: 'bg-info/10' },
  'Review': { label: 'Review', color: 'text-warning', bgColor: 'bg-warning/10' },
  'Done': { label: 'Done', color: 'text-success', bgColor: 'bg-success/10' },
};

export function KanbanColumn({ 
  status, 
  tasks, 
  requirementTitle, 
  isAdditionalScope,
  onDeleteTask,
  onUpdateTask,
}: KanbanColumnProps) {
  const config = statusConfig[status];
  const droppableId = `${requirementTitle}-${status}`;

  return (
    <div className="flex-1 min-w-[280px]">
      {/* Column Header */}
      <div className={`rounded-t-lg px-4 py-3 ${config.bgColor}`}>
        <div className="flex items-center justify-between">
          <h4 className={`font-medium ${config.color}`}>{config.label}</h4>
          <span className={`text-xs font-medium ${config.color} bg-background/50 px-2 py-0.5 rounded-full`}>
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-[200px] p-2 space-y-2 rounded-b-lg border border-t-0 border-border/50 transition-colors ${
              snapshot.isDraggingOver ? 'bg-primary/5 border-primary/30' : 'bg-card/30'
            }`}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="animate-fade-in"
                  >
                    <TaskCard
                      task={task}
                      isDragging={snapshot.isDragging}
                      isAdditionalScope={isAdditionalScope}
                      onDelete={onDeleteTask}
                      onUpdate={onUpdateTask}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}