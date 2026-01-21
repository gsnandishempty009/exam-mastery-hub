import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import StudentDashboard from "./pages/StudentDashboard";
import StudentNotes from "./pages/StudentNotes";
import StudentQuestionPapers from "./pages/StudentQuestionPapers";
import StudentSettings from "./pages/StudentSettings";
import StudentContact from "./pages/StudentContact";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBranches from "./pages/AdminBranches";
import AdminSubjects from "./pages/AdminSubjects";
import AdminModules from "./pages/AdminModules";
import AdminNotes from "./pages/AdminNotes";
import AdminQuestionPapers from "./pages/AdminQuestionPapers";
import AdminSettings from "./pages/AdminSettings";
import AdminContactReports from "./pages/AdminContactReports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/notes" element={<StudentNotes />} />
            <Route path="/student/question-papers" element={<StudentQuestionPapers />} />
            <Route path="/student/contact" element={<StudentContact />} />
            <Route path="/student/settings" element={<StudentSettings />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/branches" element={<AdminBranches />} />
            <Route path="/admin/subjects" element={<AdminSubjects />} />
            <Route path="/admin/modules" element={<AdminModules />} />
            <Route path="/admin/notes" element={<AdminNotes />} />
            <Route path="/admin/question-papers" element={<AdminQuestionPapers />} />
            <Route path="/admin/contact-reports" element={<AdminContactReports />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
