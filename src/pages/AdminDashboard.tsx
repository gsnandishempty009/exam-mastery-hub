import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  BookOpen,
  FileText,
  TrendingUp,
  ArrowRight,
  Plus,
  Download,
  UserPlus,
} from "lucide-react";

const stats = [
  { label: "Total Students", value: "2,547", change: "+12%", icon: Users, color: "primary" },
  { label: "Active Exams", value: "34", change: "+5", icon: BookOpen, color: "accent" },
  { label: "Questions Bank", value: "4,892", change: "+128", icon: FileText, color: "warning" },
  { label: "Avg. Pass Rate", value: "78%", change: "+3%", icon: TrendingUp, color: "success" },
];

const recentStudents = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", enrolled: "Jan 10, 2026", status: "Active" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", enrolled: "Jan 9, 2026", status: "Active" },
  { id: 3, name: "Carol Williams", email: "carol@example.com", enrolled: "Jan 8, 2026", status: "Pending" },
  { id: 4, name: "David Brown", email: "david@example.com", enrolled: "Jan 7, 2026", status: "Active" },
  { id: 5, name: "Eve Davis", email: "eve@example.com", enrolled: "Jan 6, 2026", status: "Active" },
];

const recentExams = [
  { id: 1, title: "Mathematics Final", participants: 245, avgScore: 82, status: "Completed" },
  { id: 2, title: "Physics Midterm", participants: 189, avgScore: 75, status: "Active" },
  { id: 3, title: "Chemistry Quiz", participants: 312, avgScore: 88, status: "Scheduled" },
];

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your exam platform efficiently.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="hero">
              <Plus className="w-4 h-4 mr-2" />
              Create Exam
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg">
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
                  <span className="text-sm text-success font-medium">{stat.change}</span>
                </div>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Students */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-display">Recent Students</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <UserPlus className="w-4 h-4 mr-1" />
                  Add Student
                </Button>
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Enrolled</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentStudents.map((student) => (
                      <tr key={student.id} className="border-b border-border/50 hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                              {student.name.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <span className="font-medium">{student.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{student.email}</td>
                        <td className="py-3 px-4 text-muted-foreground">{student.enrolled}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              student.status === "Active"
                                ? "bg-success/10 text-success"
                                : "bg-warning/10 text-warning"
                            }`}
                          >
                            {student.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Recent Exams */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="font-display">Recent Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{exam.title}</h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          exam.status === "Completed"
                            ? "bg-success/10 text-success"
                            : exam.status === "Active"
                            ? "bg-primary/10 text-primary"
                            : "bg-warning/10 text-warning"
                        }`}
                      >
                        {exam.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{exam.participants} participants</span>
                      <span>Avg: {exam.avgScore}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="font-display">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-24 flex-col gap-2">
                <Plus className="w-6 h-6" />
                <span>Create Exam</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2">
                <FileText className="w-6 h-6" />
                <span>Add Questions</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2">
                <Users className="w-6 h-6" />
                <span>Manage Students</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2">
                <Download className="w-6 h-6" />
                <span>Export Data</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
