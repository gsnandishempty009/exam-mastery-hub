import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, CheckCircle, Clock, AlertCircle, Lock } from "lucide-react";
import StudentSidebar from "@/components/dashboard/StudentSidebar";

interface ContactQuery {
  id: string;
  subject: string;
  message: string;
  subject_code?: string;
  semester?: string;
  year?: string;
  admin_response: string | null;
  status: "pending" | "in-review" | "responded" | "resolved";
  created_at: string;
  updated_at: string;
}

const StudentContact = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingQueries, setIsLoadingQueries] = useState(true);
  const [queries, setQueries] = useState<ContactQuery[]>([]);
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    subject_code: "",
    semester: "",
    year: "",
  });

  // Fetch existing queries
  useEffect(() => {
    const fetchQueries = async () => {
      if (!user) return;
      
      try {
        setIsLoadingQueries(true);
        const { data, error } = await (supabase as any)
          .from("contact_queries")
          .select("*")
          .eq("student_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching queries:", error);
          toast({
            title: "Error",
            description: "Failed to load your queries",
            variant: "destructive",
          });
          return;
        }

        setQueries(data || []);
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setIsLoadingQueries(false);
      }
    };

    fetchQueries();
  }, [user, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a query",
        variant: "destructive",
      });
      return;
    }

    if (!formData.subject.trim() || !formData.message.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in subject and message fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await ((supabase as any)
        .from("contact_queries")
        .insert([
          {
            student_id: user.id,
            subject: formData.subject,
            message: formData.message,
            subject_code: formData.subject_code || null,
            semester: formData.semester || null,
            year: formData.year || null,
            status: "pending",
          },
        ])
        .select());

      if (error) {
        console.error("Error submitting query:", error);
        toast({
          title: "Error",
          description: "Failed to submit your query. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setQueries((prev) => [data[0], ...prev]);
        setFormData({ subject: "", message: "", subject_code: "", semester: "", year: "" });
        toast({
          title: "Success",
          description: "Your query has been submitted successfully. We'll review it soon.",
        });
      }
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

  return (
    <div className="flex h-screen bg-background">
      <StudentSidebar />

      <main className="flex-1 overflow-auto ml-64">
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="w-8 h-8 text-primary" />
                <h1 className="text-4xl font-bold text-foreground">Contact Support</h1>
              </div>
              <p className="text-muted-foreground">
                Have questions or need information about a subject? Submit your query here and our support team will respond soon.
              </p>
            </div>

            {/* Contact Form */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Submit a Query</CardTitle>
                <CardDescription>
                  Please provide details about your question or request. Include subject code, semester, and year for better assistance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Security & Privacy Note */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-blue-900 mb-1">Your Data is Secure</p>
                        <p className="text-sm text-blue-800">
                          All your credentials and query details are encrypted and secure. Your information is only visible to authorized admin staff and is never shared with third parties.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="subject_code" className="text-base font-semibold mb-2 block">
                        Subject Code
                      </Label>
                      <Input
                        id="subject_code"
                        name="subject_code"
                        placeholder="e.g., CS101"
                        value={formData.subject_code}
                        onChange={handleChange}
                        className="h-12"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="semester" className="text-base font-semibold mb-2 block">
                        Semester
                      </Label>
                      <Input
                        id="semester"
                        name="semester"
                        placeholder="e.g., 5th Sem"
                        value={formData.semester}
                        onChange={handleChange}
                        className="h-12"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="year" className="text-base font-semibold mb-2 block">
                        Year
                      </Label>
                      <Input
                        id="year"
                        name="year"
                        placeholder="e.g., 2025"
                        value={formData.year}
                        onChange={handleChange}
                        className="h-12"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-base font-semibold mb-2 block">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="e.g., Question about Arrays and Data Structures"
                      value={formData.subject}
                      onChange={handleChange}
                      className="h-12"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-base font-semibold mb-2 block">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Describe your query in detail..."
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="resize-none"
                      disabled={isLoading}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? "Submitting..." : "Submit Query"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Queries List */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Your Queries</h2>
              {isLoadingQueries ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading your queries...</p>
                </div>
              ) : queries.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">No queries yet. Submit one above to get started.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {queries.map((query) => (
                    <Card key={query.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg text-foreground">{query.subject}</h3>
                            </div>
                            
                            {/* Subject Details */}
                            {(query.subject_code || query.semester || query.year) && (
                              <div className="flex flex-wrap gap-3 mb-3 text-sm">
                                {query.subject_code && (
                                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                                    Code: {query.subject_code}
                                  </span>
                                )}
                                {query.semester && (
                                  <span className="bg-accent/10 text-accent px-3 py-1 rounded-full font-medium">
                                    {query.semester}
                                  </span>
                                )}
                                {query.year && (
                                  <span className="bg-warning/10 text-warning px-3 py-1 rounded-full font-medium">
                                    Year: {query.year}
                                  </span>
                                )}
                              </div>
                            )}
                            
                            <p className="text-sm text-muted-foreground mb-3">
                              {new Date(query.created_at).toLocaleDateString()} at{" "}
                              {new Date(query.created_at).toLocaleTimeString()}
                            </p>
                            <p className="text-muted-foreground mb-3 whitespace-pre-wrap">{query.message}</p>

                            {query.admin_response && (
                              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-4">
                                <p className="text-sm font-semibold text-primary mb-2">Admin Response:</p>
                                <p className="text-sm text-foreground whitespace-pre-wrap">
                                  {query.admin_response}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            {getStatusIcon(query.status)}
                            <span className="text-sm font-medium px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
                              {getStatusLabel(query.status)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentContact;
