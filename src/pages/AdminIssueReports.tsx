import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminProtection } from "@/hooks/useAdminProtection";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

interface IssueReport {
  id: string;
  student_id: string;
  name: string;
  email: string;
  issue_title: string;
  category: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const AdminIssueReports = () => {
  const { isAdmin, authLoading } = useAdminProtection();
  const [issues, setIssues] = useState<IssueReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<IssueReport | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && isAdmin) {
      fetchIssues();
    }
  }, [authLoading, isAdmin]);

  const fetchIssues = async () => {
    const { data, error } = await supabase
      .from("issue_reports" as any)
      .select("*")
      .order("created_at", { ascending: false })
      .returns<IssueReport[]>();

    if (error) {
      toast.error("Failed to fetch issue reports");
      console.error(error);
    } else {
      setIssues(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this issue report?")) return;

    const { error } = await supabase.from("issue_reports" as any).delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete issue report");
    } else {
      toast.success("Issue report deleted");
      fetchIssues();
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    const { error } = await supabase
      .from("issue_reports" as any)
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success("Status updated successfully");
      fetchIssues();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar />

      <main className="ml-64 p-8">
        <div className="mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Issue Reports</h1>
            <p className="text-muted-foreground">
              View and manage student-reported issues and technical problems
            </p>
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              All Issue Reports ({issues.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8 text-muted-foreground">Loading...</p>
            ) : issues.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                No issue reports found.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Issue Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {issues.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell className="font-medium">{issue.name}</TableCell>
                      <TableCell>{issue.category}</TableCell>
                      <TableCell>
                        <div className="flex gap-2 items-center">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(issue.status)}`}>
                            {issue.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(issue.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedIssue(issue);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(issue.id)}
                        >
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Issue Details</DialogTitle>
          </DialogHeader>
          {selectedIssue && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Name</label>
                  <p className="text-lg">{selectedIssue.name}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Email</label>
                  <p className="text-lg">{selectedIssue.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Issue Title</label>
                  <p className="text-lg">{selectedIssue.issue_title}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Category</label>
                  <p className="text-lg">{selectedIssue.category}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Status</label>
                  <div className="flex gap-2 mt-1">
                    <select
                      value={selectedIssue.status}
                      onChange={(e) => handleStatusUpdate(selectedIssue.id, e.target.value)}
                      className="px-2 py-1 border rounded text-sm"
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Description</label>
                <p className="mt-2 p-3 bg-gray-50 rounded text-sm">{selectedIssue.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Reported</label>
                  <p className="text-sm">{formatDate(selectedIssue.created_at)}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Last Updated</label>
                  <p className="text-sm">{formatDate(selectedIssue.updated_at)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminIssueReports;
