import { Priority } from '@/types/project';
import { cn } from '@/lib/utils';
import { Flag } from 'lucide-react';

interface PriorityBadgeProps {
  priority: Priority;
  showLabel?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const priorityConfig: Record<Priority, { color: string; bgColor: string; label: string }> = {
  'Urgent': { color: 'text-red-500', bgColor: 'bg-red-500/10', label: 'Urgent' },
  'High': { color: 'text-orange-500', bgColor: 'bg-orange-500/10', label: 'High' },
  'Medium': { color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', label: 'Medium' },
  'Low': { color: 'text-blue-400', bgColor: 'bg-blue-400/10', label: 'Low' },
};

export function PriorityBadge({ priority, showLabel = false, size = 'sm', className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full',
        config.bgColor,
        size === 'sm' ? 'px-1.5 py-0.5' : 'px-2 py-1',
        className
      )}
    >
      <Flag className={cn(config.color, size === 'sm' ? 'w-3 h-3' : 'w-4 h-4')} fill="currentColor" />
      {showLabel && (
        <span className={cn(config.color, size === 'sm' ? 'text-xs' : 'text-sm', 'font-medium')}>
          {config.label}
        </span>
      )}
    </div>
  );
}
