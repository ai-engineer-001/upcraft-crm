import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Search, Plus, Edit2, Save, X, Trash2,
  Linkedin, Twitter, Mail, Link, ExternalLink,
  TrendingUp, Users, Target, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  OutreachRecord, 
  OutreachStatus, 
  OUTREACH_STATUSES, 
  STATUS_COLORS 
} from '@/types/outreach';
import { mockOutreachData } from '@/data/outreachData';
import { ConfirmDialog } from '@/components/workspace/ConfirmDialog';

interface OutreachTrackerProps {
  onBack: () => void;
}

const PlatformIcon = ({ platform }: { platform: string }) => {
  switch (platform) {
    case 'LinkedIn':
      return <Linkedin className="w-4 h-4" />;
    case 'Twitter':
      return <Twitter className="w-4 h-4" />;
    case 'Email':
      return <Mail className="w-4 h-4" />;
    default:
      return <Link className="w-4 h-4" />;
  }
};

export function OutreachTracker({ onBack }: OutreachTrackerProps) {
  const [records, setRecords] = useState<OutreachRecord[]>(mockOutreachData);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<OutreachRecord>>({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  const [newRecord, setNewRecord] = useState<Partial<OutreachRecord>>({
    status: 'Identified',
    contactPlatform: 'LinkedIn',
  });

  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return records;
    const query = searchQuery.toLowerCase();
    return records.filter(r => 
      r.startupName.toLowerCase().includes(query) ||
      r.founder.toLowerCase().includes(query) ||
      r.techStack.toLowerCase().includes(query) ||
      r.problemType.toLowerCase().includes(query) ||
      r.status.toLowerCase().includes(query)
    );
  }, [records, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const total = records.length;
    const contacted = records.filter(r => r.status !== 'Identified').length;
    const inTalks = records.filter(r => r.status === 'In-Talks').length;
    const converted = records.filter(r => r.status === 'Converted').length;
    return { total, contacted, inTalks, converted };
  }, [records]);

  const handleEdit = (record: OutreachRecord) => {
    setEditingId(record.id);
    setEditForm(record);
  };

  const handleSaveEdit = () => {
    if (editingId && editForm) {
      setRecords(prev => 
        prev.map(r => r.id === editingId ? { ...r, ...editForm } as OutreachRecord : r)
      );
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleAddNew = () => {
    if (newRecord.startupName && newRecord.founder) {
      const record: OutreachRecord = {
        id: `outreach-${Date.now()}`,
        status: newRecord.status as OutreachStatus || 'Identified',
        startupName: newRecord.startupName || '',
        founder: newRecord.founder || '',
        contactLink: newRecord.contactLink || '',
        contactPlatform: newRecord.contactPlatform as any || 'Other',
        techStack: newRecord.techStack || '',
        problemType: newRecord.problemType || '',
        specificIssue: newRecord.specificIssue || '',
        auditLink: newRecord.auditLink || '',
        outreachDate: newRecord.outreachDate || '',
        nextAction: newRecord.nextAction || '',
      };
      setRecords(prev => [record, ...prev]);
      setNewRecord({ status: 'Identified', contactPlatform: 'LinkedIn' });
      setIsAddingNew(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setRecordToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (recordToDelete) {
      setRecords(prev => prev.filter(r => r.id !== recordToDelete));
      setRecordToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const openLink = (url: string) => {
    if (url.includes('@')) {
      window.open(`mailto:${url}`, '_blank');
    } else if (url.startsWith('http')) {
      window.open(url, '_blank');
    } else {
      window.open(`https://${url}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">OutReach Tracker</h1>
                <p className="text-sm text-muted-foreground">
                  Track and manage your outreach campaigns
                </p>
              </div>
            </div>
            <a 
              href="https://docs.google.com/spreadsheets/d/1nFrluO7U-EK2WdonlEYUB7IUi49YV5-hs52mV5VkCFo/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Open Google Sheet
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Total Leads', value: stats.total, icon: Users, color: 'text-primary' },
            { label: 'Contacted', value: stats.contacted, icon: Target, color: 'text-info' },
            { label: 'In Talks', value: stats.inTalks, icon: TrendingUp, color: 'text-warning' },
            { label: 'Converted', value: stats.converted, icon: CheckCircle2, color: 'text-success' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <stat.icon className={`w-6 h-6 ${stat.color} opacity-80`} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Add */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by startup, founder, tech stack..."
              className="pl-10 bg-muted/50"
            />
          </div>
          <Button onClick={() => setIsAddingNew(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>

        {/* Add New Form */}
        <AnimatePresence>
          {isAddingNew && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card rounded-xl p-6 mb-6 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Add New Lead</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsAddingNew(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Startup Name *"
                  value={newRecord.startupName || ''}
                  onChange={(e) => setNewRecord(p => ({ ...p, startupName: e.target.value }))}
                  className="bg-muted/50"
                />
                <Input
                  placeholder="Founder Name *"
                  value={newRecord.founder || ''}
                  onChange={(e) => setNewRecord(p => ({ ...p, founder: e.target.value }))}
                  className="bg-muted/50"
                />
                <Select 
                  value={newRecord.status} 
                  onValueChange={(v) => setNewRecord(p => ({ ...p, status: v as OutreachStatus }))}
                >
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {OUTREACH_STATUSES.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select 
                  value={newRecord.contactPlatform} 
                  onValueChange={(v) => setNewRecord(p => ({ ...p, contactPlatform: v as any }))}
                >
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="Twitter">Twitter</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Contact Link"
                  value={newRecord.contactLink || ''}
                  onChange={(e) => setNewRecord(p => ({ ...p, contactLink: e.target.value }))}
                  className="bg-muted/50"
                />
                <Input
                  placeholder="Tech Stack"
                  value={newRecord.techStack || ''}
                  onChange={(e) => setNewRecord(p => ({ ...p, techStack: e.target.value }))}
                  className="bg-muted/50"
                />
                <Input
                  placeholder="Problem Type"
                  value={newRecord.problemType || ''}
                  onChange={(e) => setNewRecord(p => ({ ...p, problemType: e.target.value }))}
                  className="bg-muted/50"
                />
                <Input
                  type="date"
                  value={newRecord.outreachDate || ''}
                  onChange={(e) => setNewRecord(p => ({ ...p, outreachDate: e.target.value }))}
                  className="bg-muted/50"
                />
                <Input
                  placeholder="Specific Issue"
                  value={newRecord.specificIssue || ''}
                  onChange={(e) => setNewRecord(p => ({ ...p, specificIssue: e.target.value }))}
                  className="col-span-2 bg-muted/50"
                />
                <Input
                  placeholder="Audit Link"
                  value={newRecord.auditLink || ''}
                  onChange={(e) => setNewRecord(p => ({ ...p, auditLink: e.target.value }))}
                  className="bg-muted/50"
                />
                <Input
                  placeholder="Next Action"
                  value={newRecord.nextAction || ''}
                  onChange={(e) => setNewRecord(p => ({ ...p, nextAction: e.target.value }))}
                  className="bg-muted/50"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="ghost" onClick={() => setIsAddingNew(false)}>Cancel</Button>
                <Button onClick={handleAddNew} disabled={!newRecord.startupName || !newRecord.founder}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Lead
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Records Table */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Startup</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Founder</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Contact</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tech Stack</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Problem</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Issue</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Audit</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Next Action</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record, idx) => (
                  <motion.tr
                    key={record.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                  >
                    {editingId === record.id ? (
                      // Edit Mode
                      <>
                        <td className="p-4">
                          <Select 
                            value={editForm.status} 
                            onValueChange={(v) => setEditForm(p => ({ ...p, status: v as OutreachStatus }))}
                          >
                            <SelectTrigger className="h-8 bg-muted/50 min-w-[110px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {OUTREACH_STATUSES.map(s => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-4">
                          <Input
                            value={editForm.startupName || ''}
                            onChange={(e) => setEditForm(p => ({ ...p, startupName: e.target.value }))}
                            className="h-8 bg-muted/50 min-w-[100px]"
                          />
                        </td>
                        <td className="p-4">
                          <Input
                            value={editForm.founder || ''}
                            onChange={(e) => setEditForm(p => ({ ...p, founder: e.target.value }))}
                            className="h-8 bg-muted/50 min-w-[100px]"
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            <Select 
                              value={editForm.contactPlatform} 
                              onValueChange={(v) => setEditForm(p => ({ ...p, contactPlatform: v as any }))}
                            >
                              <SelectTrigger className="h-8 w-24 bg-muted/50">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                                <SelectItem value="Twitter">Twitter</SelectItem>
                                <SelectItem value="Email">Email</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </td>
                        <td className="p-4">
                          <Input
                            value={editForm.techStack || ''}
                            onChange={(e) => setEditForm(p => ({ ...p, techStack: e.target.value }))}
                            className="h-8 bg-muted/50 min-w-[120px]"
                          />
                        </td>
                        <td className="p-4">
                          <Input
                            value={editForm.problemType || ''}
                            onChange={(e) => setEditForm(p => ({ ...p, problemType: e.target.value }))}
                            className="h-8 bg-muted/50 min-w-[100px]"
                          />
                        </td>
                        <td className="p-4">
                          <Input
                            value={editForm.specificIssue || ''}
                            onChange={(e) => setEditForm(p => ({ ...p, specificIssue: e.target.value }))}
                            className="h-8 bg-muted/50 min-w-[150px]"
                          />
                        </td>
                        <td className="p-4">
                          <Input
                            value={editForm.auditLink || ''}
                            onChange={(e) => setEditForm(p => ({ ...p, auditLink: e.target.value }))}
                            className="h-8 bg-muted/50 min-w-[100px]"
                          />
                        </td>
                        <td className="p-4">
                          <Input
                            type="date"
                            value={editForm.outreachDate || ''}
                            onChange={(e) => setEditForm(p => ({ ...p, outreachDate: e.target.value }))}
                            className="h-8 bg-muted/50"
                          />
                        </td>
                        <td className="p-4">
                          <Input
                            value={editForm.nextAction || ''}
                            onChange={(e) => setEditForm(p => ({ ...p, nextAction: e.target.value }))}
                            className="h-8 bg-muted/50 min-w-[100px]"
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSaveEdit}>
                              <Save className="w-4 h-4 text-success" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCancelEdit}>
                              <X className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </>
                    ) : (
                      // View Mode
                      <>
                        <td className="p-4">
                          <Badge className={`${STATUS_COLORS[record.status]} border-0`}>
                            {record.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <span className="font-medium text-foreground">{record.startupName}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-foreground">{record.founder}</span>
                        </td>
                        <td className="p-4">
                          {record.contactLink && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 gap-1"
                              onClick={() => openLink(record.contactLink)}
                            >
                              <PlatformIcon platform={record.contactPlatform} />
                              <span className="text-xs">{record.contactPlatform}</span>
                            </Button>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-muted-foreground">{record.techStack}</span>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="font-normal">
                            {record.problemType}
                          </Badge>
                        </td>
                        <td className="p-4 max-w-[200px]">
                          <span className="text-sm text-muted-foreground line-clamp-2">
                            {record.specificIssue}
                          </span>
                        </td>
                        <td className="p-4">
                          {record.auditLink && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 gap-1 text-primary"
                              onClick={() => openLink(record.auditLink)}
                            >
                              <ExternalLink className="w-3 h-3" />
                              View
                            </Button>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-muted-foreground">
                            {record.outreachDate || '-'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-medium text-foreground">
                            {record.nextAction || '-'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleEdit(record)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteClick(record.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </>
                    )}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredRecords.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              {searchQuery ? 'No leads match your search' : 'No leads yet. Add your first lead!'}
            </div>
          )}
        </div>
      </main>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Lead"
        description="Are you sure you want to delete this lead? This action cannot be undone."
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
