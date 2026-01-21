import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminProtection } from "@/hooks/useAdminProtection";
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
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react";
import { toast } from "sonner";

interface Subject {
  id: string;
  name: string;
  code: string;
  description: string | null;
  branch_id: string;
  academic_year_id: string;
  total_modules: number;
}

interface Branch {
  id: string;
  name: string;
  code: string;
}

interface AcademicYear {
  id: string;
  name: string;
  year_number: number;
}

const AdminSubjects = () => {
  const { isAdmin, authLoading } = useAdminProtection();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    branch_id: "",
    academic_year_id: "",
    total_modules: 5,
  });

  useEffect(() => {
    if (!authLoading && isAdmin) {
      fetchData();
    }
  }, [authLoading, isAdmin]);

  const fetchData = async () => {
    const [subjectsRes, branchesRes, yearsRes] = await Promise.all([
      supabase.from("subjects").select("*").order("name"),
      supabase.from("branches").select("*").order("name"),
      supabase.from("academic_years").select("*").order("year_number"),
    ]);

    if (subjectsRes.data) setSubjects(subjectsRes.data);
    if (branchesRes.data) setBranches(branchesRes.data);
    if (yearsRes.data) setAcademicYears(yearsRes.data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.code || !formData.branch_id) {
      toast.error("Please fill in all required fields");
      return;
    }

    const submitData = {
      name: formData.name,
      code: formData.code,
      description: formData.description,
      branch_id: formData.branch_id,
      ...(formData.academic_year_id && { academic_year_id: formData.academic_year_id }),
    };

    if (editingSubject) {
      const { error } = await supabase
        .from("subjects")
        .update(submitData)
        .eq("id", editingSubject.id);

      if (error) {
        toast.error("Failed to update subject: " + error.message);
      } else {
        toast.success("Subject updated successfully");
        fetchData();
        setIsDialogOpen(false);
        resetForm();
      }
    } else {
      const { error } = await supabase.from("subjects").insert([submitData]);

      if (error) {
        toast.error("Failed to create subject: " + error.message);
      } else {
        toast.success("Subject created successfully");
        fetchData();
        setIsDialogOpen(false);
        resetForm();
      }
    }
  };

  const resetForm = () => {
    setEditingSubject(null);
    setFormData({
      name: "",
      code: "",
      description: "",
      branch_id: "",
      academic_year_id: "",
      total_modules: 5,
    });
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code,
      description: subject.description || "",
      branch_id: subject.branch_id,
      academic_year_id: subject.academic_year_id,
      total_modules: subject.total_modules,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subject?")) return;

    const { error } = await supabase.from("subjects").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete subject");
    } else {
      toast.success("Subject deleted successfully");
      fetchData();
    }
  };

  const getBranchName = (branchId: string) => {
    return branches.find((b) => b.id === branchId)?.code || "-";
  };

  const getYearName = (yearId: string) => {
    return academicYears.find((y) => y.id === yearId)?.name || "-";
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar />

      <main className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Subjects</h1>
            <p className="text-muted-foreground">Manage subjects across branches and years</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingSubject ? "Edit Subject" : "Add New Subject"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Subject Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Data Structures"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="code">Subject Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g., MCA101"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="branch">Branch</Label>
                  <Select
                    value={formData.branch_id}
                    onValueChange={(value) => setFormData({ ...formData, branch_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name} ({branch.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="year">Academic Year</Label>
                  <Select
                    value={formData.academic_year_id}
                    onValueChange={(value) => setFormData({ ...formData, academic_year_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {academicYears.map((year) => (
                        <SelectItem key={year.id} value={year.id}>
                          {year.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="modules">Total Modules</Label>
                  <Input
                    id="modules"
                    type="number"
                    min={1}
                    max={10}
                    value={formData.total_modules}
                    onChange={(e) => setFormData({ ...formData, total_modules: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description"
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingSubject ? "Update Subject" : "Create Subject"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              All Subjects ({subjects.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8 text-muted-foreground">Loading...</p>
            ) : subjects.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No subjects found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Modules</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjects.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell className="font-medium">{subject.name}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium">
                          {subject.code}
                        </span>
                      </TableCell>
                      <TableCell>{getBranchName(subject.branch_id)}</TableCell>
                      <TableCell>{getYearName(subject.academic_year_id)}</TableCell>
                      <TableCell>{subject.total_modules}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(subject)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(subject.id)}>
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

export default AdminSubjects;
