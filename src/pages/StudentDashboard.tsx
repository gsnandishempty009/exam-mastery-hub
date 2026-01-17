import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  FileQuestion,
  GraduationCap,
  ArrowRight,
  Loader2,
  FolderOpen,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Branch {
  id: string;
  name: string;
  code: string;
  description: string | null;
}

interface Stats {
  totalBranches: number;
  totalSubjects: number;
  totalNotes: number;
  totalQuestionPapers: number;
}

const StudentDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ full_name: string | null }>({ full_name: null });
  const [branches, setBranches] = useState<Branch[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalBranches: 0,
    totalSubjects: 0,
    totalNotes: 0,
    totalQuestionPapers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const [profileRes, branchesRes, subjectsRes, notesRes, papersRes] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("user_id", user.id).maybeSingle(),
        supabase.from("branches").select("*").order("name"),
        supabase.from("subjects").select("id", { count: "exact" }),
        supabase.from("notes").select("id", { count: "exact" }),
        supabase.from("question_papers").select("id", { count: "exact" }),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (branchesRes.data) setBranches(branchesRes.data);

      setStats({
        totalBranches: branchesRes.data?.length || 0,
        totalSubjects: subjectsRes.count || 0,
        totalNotes: notesRes.count || 0,
        totalQuestionPapers: papersRes.count || 0,
      });

      setLoading(false);
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const displayName = profile.full_name || user?.email?.split("@")[0] || "Student";

  return (
    <div className="min-h-screen bg-background">
      <StudentSidebar />

      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Welcome, {displayName}! 👋</h1>
          <p className="text-muted-foreground">
            Access study materials, notes, and previous question papers
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold mb-1">{stats.totalBranches}</p>
              <p className="text-sm text-muted-foreground">Branches</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-accent" />
                </div>
              </div>
              <p className="text-2xl font-bold mb-1">{stats.totalSubjects}</p>
              <p className="text-sm text-muted-foreground">Subjects</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-success" />
                </div>
              </div>
              <p className="text-2xl font-bold mb-1">{stats.totalNotes}</p>
              <p className="text-sm text-muted-foreground">Study Notes</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <FileQuestion className="w-6 h-6 text-warning" />
                </div>
              </div>
              <p className="text-2xl font-bold mb-1">{stats.totalQuestionPapers}</p>
              <p className="text-sm text-muted-foreground">Question Papers</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-display flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Study Notes
              </CardTitle>
              <Link to="/student/notes">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Access module-wise notes organized by branch, year, and subject.
              </p>
              <Link to="/student/notes">
                <Button variant="hero" className="w-full">
                  Browse Notes
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-display flex items-center gap-2">
                <FileQuestion className="w-5 h-5 text-primary" />
                Question Papers
              </CardTitle>
              <Link to="/student/question-papers">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Download previous year question papers organized by branch and year.
              </p>
              <Link to="/student/question-papers">
                <Button variant="outline" className="w-full">
                  Browse Papers
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Available Branches */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              Available Branches
            </CardTitle>
          </CardHeader>
          <CardContent>
            {branches.length === 0 ? (
              <div className="text-center py-8">
                <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  No branches available yet. Content will be added by the administrator.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {branches.map((branch) => (
                  <div
                    key={branch.id}
                    className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{branch.name}</h4>
                        <p className="text-sm text-muted-foreground">{branch.code}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentDashboard;
