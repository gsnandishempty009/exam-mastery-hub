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
import { Plus, Pencil, Trash2, Layers } from "lucide-react";
import { toast } from "sonner";

interface Module {
  id: string;
  title: string;
  description: string | null;
  module_number: number;
  subject_id: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
}

const AdminModules = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    module_number: 1,
    subject_id: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [modulesRes, subjectsRes] = await Promise.all([
      supabase.from("modules").select("*").order("module_number"),
      supabase.from("subjects").select("*").order("name"),
    ]);

    if (modulesRes.data) setModules(modulesRes.data);
    if (subjectsRes.data) setSubjects(subjectsRes.data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.subject_id) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingModule) {
      const { error } = await supabase
        .from("modules")
        .update(formData)
        .eq("id", editingModule.id);

      if (error) {
        toast.error("Failed to update module: " + error.message);
      } else {
        toast.success("Module updated successfully");
        fetchData();
        setIsDialogOpen(false);
        resetForm();
      }
    } else {
      const { error } = await supabase.from("modules").insert([formData]);

      if (error) {
        toast.error("Failed to create module: " + error.message);
      } else {
        toast.success("Module created successfully");
        fetchData();
        setIsDialogOpen(false);
        resetForm();
      }
    }
  };

  const resetForm = () => {
    setEditingModule(null);
    setFormData({
      title: "",
      description: "",
      module_number: 1,
      subject_id: "",
    });
  };

  const handleEdit = (module: Module) => {
    setEditingModule(module);
    setFormData({
      title: module.title,
      description: module.description || "",
      module_number: module.module_number,
      subject_id: module.subject_id,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this module?")) return;

    const { error } = await supabase.from("modules").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete module");
    } else {
      toast.success("Module deleted successfully");
      fetchData();
    }
  };

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find((s) => s.id === subjectId);
    return subject ? `${subject.name} (${subject.code})` : "-";
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar />

      <main className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Modules</h1>
            <p className="text-muted-foreground">Manage modules within subjects</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Module
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingModule ? "Edit Module" : "Add New Module"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Select
                    value={formData.subject_id}
                    onValueChange={(value) => setFormData({ ...formData, subject_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name} ({subject.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="module_number">Module Number</Label>
                  <Input
                    id="module_number"
                    type="number"
                    min={1}
                    value={formData.module_number}
                    onChange={(e) => setFormData({ ...formData, module_number: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="title">Module Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Introduction to Data Structures"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the module"
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingModule ? "Update Module" : "Create Module"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              All Modules ({modules.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8 text-muted-foreground">Loading...</p>
            ) : modules.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No modules found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module #</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modules.map((module) => (
                    <TableRow key={module.id}>
                      <TableCell>
                        <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                          {module.module_number}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{module.title}</TableCell>
                      <TableCell>{getSubjectName(module.subject_id)}</TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate">
                        {module.description || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(module)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(module.id)}>
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

export default AdminModules;
