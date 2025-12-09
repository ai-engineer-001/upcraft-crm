import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  onAdd: (title: string, description: string) => void;
}

export function AddScopeDialog({ open, onOpenChange, onAdd }: AddScopeDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (title.trim() && description.trim()) {
      onAdd(title.trim(), description.trim());
      setTitle('');
      setDescription('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-warning" />
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
          <p className="text-xs text-warning flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            This will be marked as additional scope (new request)
          </p>
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