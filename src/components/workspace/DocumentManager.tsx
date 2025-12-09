import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, Trash2, Eye, X, Plus, FolderOpen, File } from 'lucide-react';
import { Document } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from './ConfirmDialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DocumentManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  clientName: string;
  documents: Document[];
  onAddDocument: (clientId: string, name: string, type: Document['type'], fileUrl: string) => void;
  onDeleteDocument: (docId: string) => void;
}

const documentTypeLabels: Record<Document['type'], string> = {
  agreement: 'Agreement',
  contract: 'Contract',
  proposal: 'Proposal',
  other: 'Other',
};

const documentTypeColors: Record<Document['type'], string> = {
  agreement: 'success',
  contract: 'info',
  proposal: 'warning',
  other: 'muted',
};

export function DocumentManager({
  open,
  onOpenChange,
  clientId,
  clientName,
  documents,
  onAddDocument,
  onDeleteDocument,
}: DocumentManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<Document['type']>('agreement');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!docName) {
        setDocName(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleUpload = () => {
    if (selectedFile && docName) {
      // In a real app, you'd upload the file to storage and get a URL
      const mockUrl = `/uploads/${selectedFile.name}`;
      onAddDocument(clientId, docName, docType, mockUrl);
      resetForm();
    }
  };

  const resetForm = () => {
    setIsUploading(false);
    setDocName('');
    setDocType('agreement');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteClick = (docId: string) => {
    setDocToDelete(docId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (docToDelete) {
      onDeleteDocument(docToDelete);
      setDocToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const agreements = documents.filter(d => d.type === 'agreement');
  const otherDocs = documents.filter(d => d.type !== 'agreement');

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-primary" />
              Documents - {clientName}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Agreement Documents Section */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-success" />
                  Agreement Documents
                </h3>
                {agreements.length === 0 && (
                  <Badge variant="destructive">No Agreement</Badge>
                )}
              </div>
              
              {agreements.length === 0 ? (
                <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 text-center">
                  <p className="text-warning text-sm mb-2">No agreement document uploaded</p>
                  <p className="text-muted-foreground text-xs">Upload an agreement to mark this client as "Signed"</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {agreements.map(doc => (
                    <DocumentRow 
                      key={doc.id} 
                      doc={doc} 
                      onDelete={() => handleDeleteClick(doc.id)} 
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Other Documents Section */}
            <section>
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                <File className="w-4 h-4 text-muted-foreground" />
                Other Documents
              </h3>
              
              {otherDocs.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">No other documents</p>
              ) : (
                <div className="space-y-2">
                  {otherDocs.map(doc => (
                    <DocumentRow 
                      key={doc.id} 
                      doc={doc} 
                      onDelete={() => handleDeleteClick(doc.id)} 
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Upload Section */}
            <section className="border-t border-border pt-4">
              <AnimatePresence mode="wait">
                {isUploading ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">Upload New Document</h4>
                      <Button variant="ghost" size="icon" onClick={resetForm}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      {selectedFile ? (
                        <div className="flex items-center justify-center gap-2">
                          <FileText className="w-5 h-5 text-primary" />
                          <span className="text-foreground">{selectedFile.name}</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground text-sm">Click to select a file</p>
                          <p className="text-muted-foreground text-xs">PDF, DOC, DOCX, TXT</p>
                        </>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Document Name</label>
                        <input
                          type="text"
                          value={docName}
                          onChange={(e) => setDocName(e.target.value)}
                          placeholder="Enter document name"
                          className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Document Type</label>
                        <Select value={docType} onValueChange={(v) => setDocType(v as Document['type'])}>
                          <SelectTrigger className="bg-muted/50 border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="agreement">Agreement</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="proposal">Proposal</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" onClick={resetForm}>Cancel</Button>
                      <Button onClick={handleUpload} disabled={!selectedFile || !docName}>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Document
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Button 
                      onClick={() => setIsUploading(true)} 
                      className="w-full"
                      variant="outline"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Document
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Document"
        description="Are you sure you want to delete this document? This action cannot be undone."
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

function DocumentRow({ doc, onDelete }: { doc: Document; onDelete: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between bg-muted/30 rounded-lg px-4 py-3"
    >
      <div className="flex items-center gap-3">
        <FileText className="w-4 h-4 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium text-foreground">{doc.name}</p>
          <p className="text-xs text-muted-foreground">Uploaded: {doc.uploaded_at}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={documentTypeColors[doc.type] as any}>
          {documentTypeLabels[doc.type]}
        </Badge>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Eye className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
