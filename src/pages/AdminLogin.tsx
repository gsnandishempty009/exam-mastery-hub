import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Mail, Lock, ArrowRight, Eye, EyeOff, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn } = useAuth();
  const [loginAttempted, setLoginAttempted] = useState(false);

  // Check admin status after login
  useEffect(() => {
    if (loginAttempted) {
      checkAdminStatus();
    }
  }, [loginAttempted]);

  const checkAdminStatus = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "Unable to verify user. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        setLoginAttempted(false);
        return;
      }

      // Log the user ID for debugging
      console.log("Current user ID:", user.id);
      console.log("Current user email:", user.email);

      // Fetch user role directly from database
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      console.log("Role data:", roleData);
      console.log("Role error:", roleError);

      if (roleError || !roleData) {
        toast({
          title: "Error",
          description: `Unable to verify admin status. Please ensure your user ID (${user.id}) is in the user_roles table.`,
          variant: "destructive",
        });
        await supabase.auth.signOut();
        setIsLoading(false);
        setLoginAttempted(false);
        return;
      }

      if (roleData.role === "admin") {
        toast({
          title: "Welcome, Admin!",
          description: "You have successfully logged in.",
        });
        setLoginAttempted(false);
        navigate("/admin/dashboard");
      } else {
        toast({
          title: "Access Denied",
          description: "Only admins can access the admin dashboard. You have been logged out.",
          variant: "destructive",
        });
        await supabase.auth.signOut();
        setEmail("");
        setPassword("");
        setIsLoading(false);
        setLoginAttempted(false);
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      await supabase.auth.signOut();
      setIsLoading(false);
      setLoginAttempted(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Sign in the user
    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Trigger admin status check
    setLoginAttempted(true);
  };

  return (
    <div className="min-h-screen bg-foreground flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-3xl p-8 shadow-2xl border border-border">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-primary-foreground" />
              </div>
            </Link>
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Shield className="w-4 h-4" />
              Admin Portal
            </div>

            <h1 className="font-display text-2xl font-bold mb-2">Admin Login</h1>
            <p className="text-muted-foreground text-sm">
              Access the administration dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email">Admin Email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@studyhub.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Authenticating..." : "Access Dashboard"}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              ← Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
