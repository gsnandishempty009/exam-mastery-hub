import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, FileText, Upload, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface Note {
  id: string;
  title: string;
  description: string | null;
  file_name: string;
  file_url: string;
  file_size: number | null;
  module_id: string;
}

interface Module {
  id: string;
  title: string;
  module_number: number;
  subject_id: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
}

const AdminNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    module_id: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [notesRes, modulesRes, subjectsRes] = await Promise.all([
      supabase.from("notes").select("*").order("created_at", { ascending: false }),
      supabase.from("modules").select("*").order("module_number"),
      supabase.from("subjects").select("*").order("name"),
    ]);

    if (notesRes.data) setNotes(notesRes.data);
    if (modulesRes.data) setModules(modulesRes.data);
    if (subjectsRes.data) setSubjects(subjectsRes.data);
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File): Promise<{ url: string; name: string; size: number } | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `notes/${fileName}`;

      // Try uploading to the storage bucket
      const { error: uploadError } = await supabase.storage
        .from("notes")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        toast.error("Failed to upload file: " + uploadError.message);
        return null;
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from("notes").getPublicUrl(filePath);

      return {
        url: urlData.publicUrl,
        name: file.name,
        size: file.size,
      };
    } catch (error: any) {
      console.error("Upload exception:", error);
      toast.error("Upload error: " + error.message);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.module_id) {
      toast.error("Please fill in all required fields");
      return;
    }

    setUploading(true);

    try {
      if (editingNote) {
        let updateData: any = { ...formData };

        if (selectedFile) {
          const fileData = await uploadFile(selectedFile);
          if (fileData) {
            updateData = {
              ...updateData,
              file_name: fileData.name,
              file_url: fileData.url,
              file_size: fileData.size,
            };
          }
        }

        const { error } = await supabase
          .from("notes")
          .update(updateData)
          .eq("id", editingNote.id);

        if (error) throw error;
        toast.success("Note updated successfully");
      } else {
        if (!selectedFile) {
          toast.error("Please select a file to upload");
          setUploading(false);
          return;
        }

        const fileData = await uploadFile(selectedFile);
        if (!fileData) {
          setUploading(false);
          return;
        }

        const { error } = await supabase.from("notes").insert([
          {
            ...formData,
            file_name: fileData.name,
            file_url: fileData.url,
            file_size: fileData.size,
          },
        ]);

        if (error) throw error;
        toast.success("Note created successfully");
      }

      fetchData();
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error("Error: " + (error.message || "An error occurred"));
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setEditingNote(null);
    setSelectedFile(null);
    setFormData({
      title: "",
      description: "",
      module_id: "",
    });
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      description: note.description || "",
      module_id: note.module_id,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    const { error } = await supabase.from("notes").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete note");
    } else {
      toast.success("Note deleted successfully");
      fetchData();
    }
  };

  const getModuleName = (moduleId: string) => {
    const module = modules.find((m) => m.id === moduleId);
    if (!module) return "-";
    const subject = subjects.find((s) => s.id === module.subject_id);
    return `${subject?.code || ""} - Module ${module.module_number}`;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "-";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar />

      <main className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Notes</h1>
            <p className="text-muted-foreground">Upload and manage study notes</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Upload Note
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingNote ? "Edit Note" : "Upload New Note"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Arrays Complete Guide"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="module">Module</Label>
                  <Select
                    value={formData.module_id}
                    onValueChange={(value) => setFormData({ ...formData, module_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select module" />
                    </SelectTrigger>
                    <SelectContent>
                      {modules.map((module) => {
                        const subject = subjects.find((s) => s.id === module.subject_id);
                        return (
                          <SelectItem key={module.id} value={module.id}>
                            {subject?.code} - Module {module.module_number}: {module.title}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="file">File {editingNote && "(optional - leave empty to keep current)"}</Label>
                  <div className="mt-1">
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      className="cursor-pointer"
                    />
                  </div>
                  {editingNote && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Current file: {editingNote.file_name}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the notes"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={uploading}>
                  {uploading ? (
                    <>
                      <Upload className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : editingNote ? (
                    "Update Note"
                  ) : (
                    "Upload Note"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              All Notes ({notes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8 text-muted-foreground">Loading...</p>
            ) : notes.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No notes found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>File</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notes.map((note) => (
                    <TableRow key={note.id}>
                      <TableCell className="font-medium">{note.title}</TableCell>
                      <TableCell>{getModuleName(note.module_id)}</TableCell>
                      <TableCell>
                        <a
                          href={note.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          {note.file_name}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </TableCell>
                      <TableCell>{formatFileSize(note.file_size)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(note)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(note.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminNotes;
