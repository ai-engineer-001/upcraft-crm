import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Priority } from '@/types/project';
import { PrioritySelect } from '@/components/ui/priority-select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface AddScopeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (title: string, description: string, isAdditionalScope: boolean, priority: Priority) => void;
}

export function AddScopeDialog({ open, onOpenChange, onAdd }: AddScopeDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAdditionalScope, setIsAdditionalScope] = useState(false);
  const [priority, setPriority] = useState<Priority>('Medium');

  const handleSubmit = () => {
    if (title.trim() && description.trim()) {
      onAdd(title.trim(), description.trim(), isAdditionalScope, priority);
      setTitle('');
      setDescription('');
      setIsAdditionalScope(false);
      setPriority('Medium');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Add New Scope
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Payment Gateway Integration"
              className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              autoFocus
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the scope requirements..."
              rows={3}
              className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-foreground">Priority</Label>
            <PrioritySelect value={priority} onChange={setPriority} size="md" />
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="space-y-1">
              <Label htmlFor="additional-scope" className="text-sm font-medium text-foreground">
                Additional Scope (New Request)
              </Label>
              <p className="text-xs text-muted-foreground">
                Mark as scope creep for billing tracking
              </p>
            </div>
            <Switch
              id="additional-scope"
              checked={isAdditionalScope}
              onCheckedChange={setIsAdditionalScope}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!title.trim() || !description.trim()}>
            Add Scope
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
