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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, GitBranch } from "lucide-react";
import { toast } from "sonner";

interface Branch {
  id: string;
  name: string;
  code: string;
  description: string | null;
  created_at: string;
}

const AdminBranches = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [formData, setFormData] = useState({ name: "", code: "", description: "" });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    const { data, error } = await supabase.from("branches").select("*").order("name");
    if (error) {
      toast.error("Failed to fetch branches");
    } else {
      setBranches(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBranch) {
      const { error } = await supabase
        .from("branches")
        .update(formData)
        .eq("id", editingBranch.id);
      
      if (error) {
        toast.error("Failed to update branch");
      } else {
        toast.success("Branch updated successfully");
        fetchBranches();
      }
    } else {
      const { error } = await supabase.from("branches").insert([formData]);
      
      if (error) {
        toast.error("Failed to create branch");
      } else {
        toast.success("Branch created successfully");
        fetchBranches();
      }
    }
    
    setIsDialogOpen(false);
    setEditingBranch(null);
    setFormData({ name: "", code: "", description: "" });
  };

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      code: branch.code,
      description: branch.description || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this branch?")) return;
    
    const { error } = await supabase.from("branches").delete().eq("id", id);
    
    if (error) {
      toast.error("Failed to delete branch");
    } else {
      toast.success("Branch deleted successfully");
      fetchBranches();
    }
  };

  const openCreateDialog = () => {
    setEditingBranch(null);
    setFormData({ name: "", code: "", description: "" });
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar />
      
      <main className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Branches</h1>
            <p className="text-muted-foreground">Manage academic branches/programs</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add Branch
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingBranch ? "Edit Branch" : "Add New Branch"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Branch Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Master of Computer Applications"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="code">Branch Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g., MCA"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the program"
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingBranch ? "Update Branch" : "Create Branch"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="w-5 h-5" />
              All Branches ({branches.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8 text-muted-foreground">Loading...</p>
            ) : branches.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No branches found. Add your first branch.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {branches.map((branch) => (
                    <TableRow key={branch.id}>
                      <TableCell className="font-medium">{branch.name}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium">
                          {branch.code}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate">
                        {branch.description || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(branch)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(branch.id)}>
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

export default AdminBranches;
