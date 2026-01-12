import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Trophy,
  Clock,
  TrendingUp,
  ArrowRight,
  Calendar,
  CheckCircle,
  Target,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const upcomingExams = [
  { id: 1, title: "Mathematics Final", date: "Jan 15, 2026", time: "10:00 AM", duration: "2 hours" },
  { id: 2, title: "Physics Midterm", date: "Jan 18, 2026", time: "2:00 PM", duration: "1.5 hours" },
  { id: 3, title: "Chemistry Quiz", date: "Jan 20, 2026", time: "9:00 AM", duration: "45 mins" },
];

const recentResults = [
  { id: 1, title: "Biology Test", score: 92, total: 100, date: "Jan 8, 2026" },
  { id: 2, title: "English Essay", score: 88, total: 100, date: "Jan 5, 2026" },
  { id: 3, title: "History Quiz", score: 95, total: 100, date: "Jan 3, 2026" },
];

const StudentDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ full_name: string | null }>({ full_name: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        setProfile(data);
      }
      setLoading(false);
    };

    if (user) {
      fetchProfile();
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
          <h1 className="font-display text-3xl font-bold mb-2">Welcome back, {displayName}! 👋</h1>
          <p className="text-muted-foreground">Here's what's happening with your learning journey.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm text-success font-medium">+12%</span>
              </div>
              <p className="text-2xl font-bold mb-1">24</p>
              <p className="text-sm text-muted-foreground">Exams Completed</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-accent" />
                </div>
                <span className="text-sm text-success font-medium">+5%</span>
              </div>
              <p className="text-2xl font-bold mb-1">89%</p>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
              </div>
              <p className="text-2xl font-bold mb-1">48h</p>
              <p className="text-sm text-muted-foreground">Study Time</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-success" />
                </div>
                <span className="text-sm text-success font-medium">#5</span>
              </div>
              <p className="text-2xl font-bold mb-1">Top 10</p>
              <p className="text-sm text-muted-foreground">Leaderboard Rank</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Upcoming Exams */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-display">Upcoming Exams</CardTitle>
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{exam.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {exam.date} at {exam.time} • {exam.duration}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Prepare
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Results */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="font-display">Recent Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentResults.map((result) => (
                  <div key={result.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="font-medium text-sm">{result.title}</span>
                      </div>
                      <span className="font-bold text-sm">{result.score}%</span>
                    </div>
                    <Progress value={result.score} className="h-2" />
                    <p className="text-xs text-muted-foreground">{result.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Learning Progress */}
        <Card className="mt-6 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Weekly Learning Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Practice Tests</span>
                  <span className="font-semibold">8/10</span>
                </div>
                <Progress value={80} className="h-3" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Study Hours</span>
                  <span className="font-semibold">12/15 hrs</span>
                </div>
                <Progress value={80} className="h-3" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Questions Solved</span>
                  <span className="font-semibold">156/200</span>
                </div>
                <Progress value={78} className="h-3" />
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentDashboard;
