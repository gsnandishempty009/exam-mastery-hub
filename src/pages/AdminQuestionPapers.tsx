import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Pencil, Trash2, FileQuestion, Upload, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface QuestionPaper {
  id: string;
  title: string;
  exam_year: number;
  exam_type: string;
  file_name: string;
  file_url: string;
  file_size: number | null;
  branch_id: string;
  subject_id: string | null;
}

interface Branch {
  id: string;
  name: string;
  code: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  branch_id: string;
}

const AdminQuestionPapers = () => {
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPaper, setEditingPaper] = useState<QuestionPaper | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    exam_year: new Date().getFullYear(),
    exam_type: "Regular",
    branch_id: "",
    subject_id: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.branch_id) {
      setFilteredSubjects(subjects.filter((s) => s.branch_id === formData.branch_id));
    } else {
      setFilteredSubjects([]);
    }
  }, [formData.branch_id, subjects]);

  const fetchData = async () => {
    const [papersRes, branchesRes, subjectsRes] = await Promise.all([
      supabase.from("question_papers").select("*").order("exam_year", { ascending: false }),
      supabase.from("branches").select("*").order("name"),
      supabase.from("subjects").select("*").order("name"),
    ]);

    if (papersRes.data) setPapers(papersRes.data);
    if (branchesRes.data) setBranches(branchesRes.data);
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
      const filePath = `papers/${fileName}`;

      // Try uploading to the storage bucket
      const { error: uploadError } = await supabase.storage
        .from("question-papers")
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
      const { data: urlData } = supabase.storage.from("question-papers").getPublicUrl(filePath);

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
    
    if (!formData.title || !formData.branch_id) {
      toast.error("Please fill in all required fields");
      return;
    }

    setUploading(true);

    try {
      if (editingPaper) {
        let updateData: any = { ...formData, subject_id: formData.subject_id || null };

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
          .from("question_papers")
          .update(updateData)
          .eq("id", editingPaper.id);

        if (error) throw error;
        toast.success("Question paper updated successfully");
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

        const { error } = await supabase.from("question_papers").insert([
          {
            ...formData,
            subject_id: formData.subject_id || null,
            file_name: fileData.name,
            file_url: fileData.url,
            file_size: fileData.size,
          },
        ]);

        if (error) throw error;
        toast.success("Question paper uploaded successfully");
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
    setEditingPaper(null);
    setSelectedFile(null);
    setFormData({
      title: "",
      exam_year: new Date().getFullYear(),
      exam_type: "Regular",
      branch_id: "",
      subject_id: "",
    });
  };

  const handleEdit = (paper: QuestionPaper) => {
    setEditingPaper(paper);
    setFormData({
      title: paper.title,
      exam_year: paper.exam_year,
      exam_type: paper.exam_type,
      branch_id: paper.branch_id,
      subject_id: paper.subject_id || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question paper?")) return;

    const { error } = await supabase.from("question_papers").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete question paper");
    } else {
      toast.success("Question paper deleted successfully");
      fetchData();
    }
  };

  const getBranchCode = (branchId: string) => {
    return branches.find((b) => b.id === branchId)?.code || "-";
  };

  const getSubjectCode = (subjectId: string | null) => {
    if (!subjectId) return "-";
    return subjects.find((s) => s.id === subjectId)?.code || "-";
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
            <h1 className="font-display text-3xl font-bold mb-2">Question Papers</h1>
            <p className="text-muted-foreground">Upload and manage previous year question papers</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Upload Paper
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingPaper ? "Edit Question Paper" : "Upload Question Paper"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Data Structures Mid-Sem 2024"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="exam_year">Exam Year</Label>
                    <Input
                      id="exam_year"
                      type="number"
                      min={2000}
                      max={2100}
                      value={formData.exam_year}
                      onChange={(e) => setFormData({ ...formData, exam_year: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="exam_type">Exam Type</Label>
                    <Select
                      value={formData.exam_type}
                      onValueChange={(value) => setFormData({ ...formData, exam_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Regular">Regular</SelectItem>
                        <SelectItem value="Mid-Semester">Mid-Semester</SelectItem>
                        <SelectItem value="End-Semester">End-Semester</SelectItem>
                        <SelectItem value="Supplementary">Supplementary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="branch">Branch</Label>
                  <Select
                    value={formData.branch_id}
                    onValueChange={(value) => setFormData({ ...formData, branch_id: value, subject_id: "" })}
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
                  <Label htmlFor="subject">Subject (Optional)</Label>
                  <Select
                    value={formData.subject_id}
                    onValueChange={(value) => setFormData({ ...formData, subject_id: value })}
                    disabled={!formData.branch_id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredSubjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name} ({subject.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="file">File {editingPaper && "(optional)"}</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf"
                    className="cursor-pointer"
                  />
                  {editingPaper && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Current: {editingPaper.file_name}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={uploading}>
                  {uploading ? (
                    <>
                      <Upload className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : editingPaper ? (
                    "Update Paper"
                  ) : (
                    "Upload Paper"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileQuestion className="w-5 h-5" />
              All Question Papers ({papers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8 text-muted-foreground">Loading...</p>
            ) : papers.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No question papers found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>File</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {papers.map((paper) => (
                    <TableRow key={paper.id}>
                      <TableCell className="font-medium">{paper.title}</TableCell>
                      <TableCell>{paper.exam_year}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-accent/10 text-accent-foreground rounded-md text-sm">
                          {paper.exam_type}
                        </span>
                      </TableCell>
                      <TableCell>{getBranchCode(paper.branch_id)}</TableCell>
                      <TableCell>{getSubjectCode(paper.subject_id)}</TableCell>
                      <TableCell>
                        <a
                          href={paper.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          View
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(paper)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(paper.id)}>
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

export default AdminQuestionPapers;
