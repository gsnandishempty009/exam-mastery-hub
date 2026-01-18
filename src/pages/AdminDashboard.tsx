import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GitBranch,
  BookOpen,
  Layers,
  FileText,
  FileQuestion,
  ArrowRight,
  Plus,
} from "lucide-react";

interface Stats {
  branches: number;
  subjects: number;
  modules: number;
  notes: number;
  questionPapers: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    branches: 0,
    subjects: 0,
    modules: 0,
    notes: 0,
    questionPapers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const [branchesRes, subjectsRes, modulesRes, notesRes, papersRes] = await Promise.all([
      supabase.from("branches").select("id", { count: "exact", head: true }),
      supabase.from("subjects").select("id", { count: "exact", head: true }),
      supabase.from("modules").select("id", { count: "exact", head: true }),
      supabase.from("notes").select("id", { count: "exact", head: true }),
      supabase.from("question_papers").select("id", { count: "exact", head: true }),
    ]);

    setStats({
      branches: branchesRes.count || 0,
      subjects: subjectsRes.count || 0,
      modules: modulesRes.count || 0,
      notes: notesRes.count || 0,
      questionPapers: papersRes.count || 0,
    });
    setLoading(false);
  };

  const statCards = [
    { label: "Branches", value: stats.branches, icon: GitBranch, color: "primary", path: "/admin/branches" },
    { label: "Subjects", value: stats.subjects, icon: BookOpen, color: "accent", path: "/admin/subjects" },
    { label: "Modules", value: stats.modules, icon: Layers, color: "warning", path: "/admin/modules" },
    { label: "Notes", value: stats.notes, icon: FileText, color: "success", path: "/admin/notes" },
    { label: "Question Papers", value: stats.questionPapers, icon: FileQuestion, color: "primary", path: "/admin/question-papers" },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your learning content platform.</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Link key={index} to={stat.path}>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        stat.color === "primary"
                          ? "bg-primary/10"
                          : stat.color === "accent"
                          ? "bg-accent/10"
                          : stat.color === "warning"
                          ? "bg-warning/10"
                          : "bg-success/10"
                      }`}
                    >
                      <stat.icon
                        className={`w-6 h-6 ${
                          stat.color === "primary"
                            ? "text-primary"
                            : stat.color === "accent"
                            ? "text-accent"
                            : stat.color === "warning"
                            ? "text-warning"
                            : "text-success"
                        }`}
                      />
                    </div>
                  </div>
                  <p className="text-2xl font-bold mb-1">{loading ? "..." : stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="font-display">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Link to="/admin/branches">
                <Button variant="outline" className="w-full h-24 flex-col gap-2">
                  <GitBranch className="w-6 h-6" />
                  <span>Add Branch</span>
                </Button>
              </Link>
              <Link to="/admin/subjects">
                <Button variant="outline" className="w-full h-24 flex-col gap-2">
                  <BookOpen className="w-6 h-6" />
                  <span>Add Subject</span>
                </Button>
              </Link>
              <Link to="/admin/modules">
                <Button variant="outline" className="w-full h-24 flex-col gap-2">
                  <Layers className="w-6 h-6" />
                  <span>Add Module</span>
                </Button>
              </Link>
              <Link to="/admin/notes">
                <Button variant="outline" className="w-full h-24 flex-col gap-2">
                  <FileText className="w-6 h-6" />
                  <span>Upload Notes</span>
                </Button>
              </Link>
              <Link to="/admin/question-papers">
                <Button variant="outline" className="w-full h-24 flex-col gap-2">
                  <FileQuestion className="w-6 h-6" />
                  <span>Upload Papers</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Content Overview */}
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-display flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Notes Management
              </CardTitle>
              <Link to="/admin/notes">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-4xl font-bold text-primary">{loading ? "..." : stats.notes}</p>
                <p className="text-muted-foreground mt-2">Study notes uploaded</p>
                <Link to="/admin/notes">
                  <Button variant="hero" className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Upload New Note
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-display flex items-center gap-2">
                <FileQuestion className="w-5 h-5" />
                Question Papers
              </CardTitle>
              <Link to="/admin/question-papers">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-4xl font-bold text-primary">{loading ? "..." : stats.questionPapers}</p>
                <p className="text-muted-foreground mt-2">Previous year papers</p>
                <Link to="/admin/question-papers">
                  <Button variant="hero" className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Upload New Paper
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
