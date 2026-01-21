import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useAdminProtection } from "@/hooks/useAdminProtection";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, CheckCircle, Clock, AlertCircle, ChevronDown } from "lucide-react";
import AdminSidebar from "@/components/dashboard/AdminSidebar";

interface ContactQuery {
  id: string;
  student_id: string;
  subject: string;
  message: string;
  admin_response: string | null;
  status: "pending" | "in-review" | "responded" | "resolved";
  created_at: string;
  updated_at: string;
}

interface StudentProfile {
  full_name: string | null;
  email: string | null;
}

const AdminContactReports = () => {
  useAdminProtection();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [queries, setQueries] = useState<ContactQuery[]>([]);
  const [studentProfiles, setStudentProfiles] = useState<Record<string, StudentProfile>>({});
  const [selectedQuery, setSelectedQuery] = useState<ContactQuery | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedQueryId, setExpandedQueryId] = useState<string | null>(null);

  // Fetch queries and student details
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch all contact queries
        const { data: queriesData, error: queriesError } = await ((supabase as any)
          .from("contact_queries")
          .select("*")
          .order("created_at", { ascending: false }));

        if (queriesError) {
          console.error("Error fetching queries:", queriesError);
          toast({
            title: "Error",
            description: "Failed to load queries",
            variant: "destructive",
          });
          return;
        }

        setQueries(queriesData || []);

        // Fetch student profiles for each unique student_id
        const studentIds = [...new Set((queriesData || []).map((q: any) => q.student_id))] as string[];
        const profiles: Record<string, StudentProfile> = {};

        for (const studentId of studentIds) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("full_name, email")
            .eq("user_id", studentId)
            .maybeSingle();

          if (profileData) {
            profiles[studentId] = profileData;
          } else {
            // Fallback to get email from auth users
            const { data: authData } = await supabase.auth.admin.getUserById(studentId);
            profiles[studentId] = {
              full_name: null,
              email: authData?.user?.email || "Unknown",
            };
          }
        }

        setStudentProfiles(profiles);
      } catch (err) {
        console.error("Unexpected error:", err);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleOpenDialog = (query: ContactQuery) => {
    setSelectedQuery(query);
    setResponseText(query.admin_response || "");
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedQuery(null);
    setResponseText("");
  };

  const handleSaveResponse = async () => {
    if (!selectedQuery) return;

    if (!responseText.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a response",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      const { error } = await ((supabase as any)
        .from("contact_queries")
        .update({
          admin_response: responseText,
          status: "responded",
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedQuery.id));

      if (error) {
        console.error("Error updating query:", error);
        toast({
          title: "Error",
          description: "Failed to save response",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setQueries((prev) =>
        prev.map((q) =>
          q.id === selectedQuery.id
            ? {
                ...q,
                admin_response: responseText,
                status: "responded",
              }
            : q
        )
      );

      toast({
        title: "Success",
        description: "Response saved successfully",
      });

      handleCloseDialog();
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (queryId: string, newStatus: string) => {
    try {
      const { error } = await ((supabase as any)
        .from("contact_queries")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", queryId));

      if (error) {
        console.error("Error updating status:", error);
        toast({
          title: "Error",
          description: "Failed to update status",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setQueries((prev) =>
        prev.map((q) =>
          q.id === queryId ? { ...q, status: newStatus as any } : q
        )
      );

      toast({
        title: "Success",
        description: "Status updated successfully",
      });
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "in-review":
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case "responded":
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ");
  };

  const filteredQueries =
    statusFilter === "all"
      ? queries
      : queries.filter((q) => q.status === statusFilter);

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 overflow-auto ml-64">
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="w-8 h-8 text-primary" />
                <h1 className="text-4xl font-bold text-foreground">Contact Reports</h1>
              </div>
              <p className="text-muted-foreground">
                View and manage student contact queries
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-foreground">{queries.length}</p>
                    <p className="text-sm text-muted-foreground">Total Queries</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-yellow-500">
                      {queries.filter((q) => q.status === "pending").length}
                    </p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-500">
                      {queries.filter((q) => q.status === "in-review").length}
                    </p>
                    <p className="text-sm text-muted-foreground">In Review</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-500">
                      {queries.filter(
                        (q) => q.status === "responded" || q.status === "resolved"
                      ).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Responded</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filter */}
            <div className="mb-6">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Queries</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-review">In Review</SelectItem>
                  <SelectItem value="responded">Responded</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Queries List */}
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading queries...</p>
              </div>
            ) : filteredQueries.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No queries found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredQueries.map((query) => {
                  const studentProfile = studentProfiles[query.student_id];
                  const isExpanded = expandedQueryId === query.id;

                  return (
                    <Card
                      key={query.id}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() =>
                        setExpandedQueryId(isExpanded ? null : query.id)
                      }
                    >
                      <CardContent className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg text-foreground">
                                {query.subject}
                              </h3>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              From:{" "}
                              <span className="font-semibold">
                                {studentProfile?.full_name || "Unknown Student"}
                              </span>
                              {" "}({studentProfile?.email})
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Submitted: {new Date(query.created_at).toLocaleDateString()} at{" "}
                              {new Date(query.created_at).toLocaleTimeString()}
                            </p>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              {getStatusIcon(query.status)}
                              <Select
                                value={query.status}
                                onValueChange={(newStatus) => {
                                  handleStatusChange(query.id, newStatus);
                                }}
                              >
                                <SelectTrigger className="w-40">
                                  <SelectValue placeholder="Change status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="in-review">In Review</SelectItem>
                                  <SelectItem value="responded">Responded</SelectItem>
                                  <SelectItem value="resolved">Resolved</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <ChevronDown
                              className={`w-5 h-5 text-muted-foreground transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </div>

                        {/* Expanded Content */}
                        {isExpanded && (
                          <div className="pt-4 border-t border-border space-y-4">
                            <div>
                              <p className="text-sm font-semibold text-foreground mb-2">
                                Student Message:
                              </p>
                              <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted p-4 rounded">
                                {query.message}
                              </p>
                            </div>

                            {query.admin_response && (
                              <div>
                                <p className="text-sm font-semibold text-foreground mb-2">
                                  Admin Response:
                                </p>
                                <p className="text-sm text-foreground whitespace-pre-wrap bg-primary/10 border border-primary/20 p-4 rounded">
                                  {query.admin_response}
                                </p>
                              </div>
                            )}

                            <div className="flex gap-2">
                              <Button
                                variant="default"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenDialog(query);
                                }}
                              >
                                {query.admin_response ? "Edit Response" : "Add Response"}
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Response Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add/Edit Response</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Query Subject:</p>
              <p className="text-sm text-muted-foreground">{selectedQuery?.subject}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Student Message:</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted p-3 rounded">
                {selectedQuery?.message}
              </p>
            </div>

            <div>
              <Label htmlFor="response" className="text-base font-semibold mb-2 block">
                Your Response
              </Label>
              <Textarea
                id="response"
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Type your response here..."
                rows={6}
                className="resize-none"
                disabled={isSaving}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveResponse}
              disabled={isSaving}
              variant="default"
            >
              {isSaving ? "Saving..." : "Save Response"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminContactReports;
