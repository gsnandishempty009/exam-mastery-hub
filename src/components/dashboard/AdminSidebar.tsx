import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  GraduationCap,
  LayoutDashboard,
  GitBranch,
  BookOpen,
  Layers,
  FileText,
  FileQuestion,
  Settings,
  LogOut,
  Shield,
  Mail,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: GitBranch, label: "Branches", path: "/admin/branches" },
  { icon: BookOpen, label: "Subjects", path: "/admin/subjects" },
  { icon: Layers, label: "Modules", path: "/admin/modules" },
  { icon: FileText, label: "Notes", path: "/admin/notes" },
  { icon: FileQuestion, label: "Question Papers", path: "/admin/question-papers" },
  { icon: Mail, label: "Contact Reports", path: "/admin/contact-reports" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  // Get user initials
  const userEmail = user?.email || "admin@studyhub.com";
  const userName = user?.user_metadata?.full_name || userEmail.split("@")[0];
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-foreground text-background flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-background/10">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl">
            Study<span className="text-primary">Hub</span>
          </span>
        </Link>
        <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/20 text-primary text-xs font-medium">
          <Shield className="w-3 h-3" />
          Admin Panel
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-background/70 hover:bg-background/10 hover:text-background"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Admin Profile */}
      <div className="p-4 border-t border-background/10">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-background/5 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{userName}</p>
            <p className="text-xs text-background/50 truncate">{userEmail}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-background/70 hover:bg-destructive/20 hover:text-destructive transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
