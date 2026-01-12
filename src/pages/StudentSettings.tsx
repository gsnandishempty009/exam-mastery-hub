import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { User, Mail, Save, Loader2 } from "lucide-react";

interface Profile {
  full_name: string | null;
  email: string | null;
}

const StudentSettings = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile>({ full_name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load profile.",
          variant: "destructive",
        });
      } else if (data) {
        setProfile({
          full_name: data.full_name || "",
          email: data.email || user.email || "",
        });
      }
      setLoading(false);
    };

    if (user) {
      fetchProfile();
    }
  }, [user, toast]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: profile.full_name })
      .eq("user_id", user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
    }
    setSaving(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <StudentSidebar />

      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>

        <div className="max-w-2xl space-y-6">
          {/* Profile Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal details here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="fullName"
                    value={profile.full_name || ""}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    className="pl-10 h-12"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    value={profile.email || ""}
                    className="pl-10 h-12 bg-muted"
                    disabled
                    placeholder="Your email address"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>

              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full sm:w-auto"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Account Details */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="font-display">Account Details</CardTitle>
              <CardDescription>
                Your account information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 text-sm">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Account Type</span>
                  <span className="font-medium">Student</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="font-medium">
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">User ID</span>
                  <span className="font-mono text-xs">{user?.id.slice(0, 8)}...</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StudentSettings;
