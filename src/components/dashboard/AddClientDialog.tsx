import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PrioritySelect } from '@/components/ui/priority-select';
import { Priority } from '@/types/project';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddClient: (
    clientName: string,
    clientEmail: string,
    projectName: string,
    projectPriority: Priority
  ) => void;
}

export function AddClientDialog({
  open,
  onOpenChange,
  onAddClient,
}: AddClientDialogProps) {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectPriority, setProjectPriority] = useState<Priority>('Medium');

  const handleSubmit = () => {
    if (clientName.trim() && clientEmail.trim() && projectName.trim()) {
      onAddClient(clientName.trim(), clientEmail.trim(), projectName.trim(), projectPriority);
      resetForm();
      onOpenChange(false);
    }
  };

  const resetForm = () => {
    setClientName('');
    setClientEmail('');
    setProjectName('');
    setProjectPriority('Medium');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Add New Client & Project
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 py-4"
        >
          {/* Client Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Client Details
            </h4>
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Enter client name"
                className="bg-muted/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Client Email</Label>
              <Input
                id="clientEmail"
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="client@example.com"
                className="bg-muted/50"
              />
            </div>
          </div>

          {/* Project Details */}
          <div className="space-y-3 pt-2 border-t border-border">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2 pt-2">
              <Briefcase className="w-4 h-4" />
              Initial Project
            </h4>
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
                className="bg-muted/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Project Priority</Label>
              <PrioritySelect
                value={projectPriority}
                onChange={setProjectPriority}
              />
            </div>
          </div>
        </motion.div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!clientName.trim() || !clientEmail.trim() || !projectName.trim()}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Create Client
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
