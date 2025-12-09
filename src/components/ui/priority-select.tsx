import { Priority } from '@/types/project';
import { Flag } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PrioritySelectProps {
  value: Priority;
  onChange: (priority: Priority) => void;
  size?: 'sm' | 'md';
}

const priorities: { value: Priority; label: string; color: string }[] = [
  { value: 'Urgent', label: 'Urgent', color: 'text-red-500' },
  { value: 'High', label: 'High', color: 'text-orange-500' },
  { value: 'Medium', label: 'Medium', color: 'text-yellow-500' },
  { value: 'Low', label: 'Low', color: 'text-blue-400' },
];

export function PrioritySelect({ value, onChange, size = 'sm' }: PrioritySelectProps) {
  const currentPriority = priorities.find(p => p.value === value);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'gap-1 h-auto py-1 px-2',
            currentPriority?.color
          )}
        >
          <Flag className={cn(size === 'sm' ? 'w-3 h-3' : 'w-4 h-4')} fill="currentColor" />
          <span className={cn(size === 'sm' ? 'text-xs' : 'text-sm')}>{currentPriority?.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[120px]">
        {priorities.map((priority) => (
          <DropdownMenuItem
            key={priority.value}
            onClick={() => onChange(priority.value)}
            className={cn('gap-2 cursor-pointer', priority.color)}
          >
            <Flag className="w-3 h-3" fill="currentColor" />
            <span>{priority.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
