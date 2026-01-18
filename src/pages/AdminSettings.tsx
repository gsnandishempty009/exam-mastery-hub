import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Mail, User, Shield, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AdminProfileData {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  bio?: string;
  institution?: string;
  role: string;
  created_at: string;
  updated_at: string;
}

const AdminSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [adminProfile, setAdminProfile] = useState<AdminProfileData | null>(null);
  const [editData, setEditData] = useState({
    fullName: "",
    email: "",
    phone: "",
    bio: "",
    institution: "",
  });

  useEffect(() => {
    if (user) {
      fetchAdminProfile();
    }
  }, [user]);

  const fetchAdminProfile = async () => {
    setFetching(true);
    try {
      // First try to fetch from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Profile fetch error:", profileError);
      }

      if (profileData) {
        const profile = profileData as AdminProfileData;
        setAdminProfile(profile);
        setEditData({
          fullName: profile.full_name || "",
          email: profile.email || "",
          phone: profile.phone || "",
          bio: profile.bio || "",
          institution: profile.institution || "",
        });
      } else {
        // If no profile exists, create one from user data
        const newProfile = {
          user_id: user?.id,
          full_name: user?.user_metadata?.full_name || "",
          email: user?.email || "",
          phone: user?.user_metadata?.phone || "",
          bio: user?.user_metadata?.bio || "",
          institution: user?.user_metadata?.institution || "",
          role: "admin",
        };

        const { data: createdProfile, error: createError } = await supabase
          .from("profiles")
          .insert([newProfile])
          .select()
          .single();

        if (createError) {
          console.error("Create profile error:", createError);
        } else if (createdProfile) {
          const profile = createdProfile as AdminProfileData;
          setAdminProfile(profile);
          setEditData({
            fullName: profile.full_name || "",
            email: profile.email || "",
            phone: profile.phone || "",
            bio: profile.bio || "",
            institution: profile.institution || "",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching admin profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    if (!adminProfile) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: editData.fullName,
          phone: editData.phone,
          bio: editData.bio,
          institution: editData.institution,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user?.id);

      if (error) throw error;

      // Update local state
      setAdminProfile((prev) =>
        prev
          ? {
              ...prev,
              full_name: editData.fullName,
              phone: editData.phone,
              bio: editData.bio,
              institution: editData.institution,
            }
          : null
      );

      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error("Failed to update profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <AdminSidebar />
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar />

      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your admin profile and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Admin Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Admin Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl">
                    {adminProfile?.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2) || "A"}
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <User className="w-5 h-5 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground">Name</p>
                      <p className="font-semibold truncate">
                        {adminProfile?.full_name || "Not Set"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Mail className="w-5 h-5 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground">Email</p>
                      <p className="font-semibold truncate">{adminProfile?.email}</p>
                    </div>
                  </div>

                  {adminProfile?.phone && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <User className="w-5 h-5 text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground">Phone</p>
                        <p className="font-semibold truncate">{adminProfile.phone}</p>
                      </div>
                    </div>
                  )}

                  {adminProfile?.institution && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Shield className="w-5 h-5 text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground">Institution</p>
                        <p className="font-semibold truncate">{adminProfile.institution}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-xs text-muted-foreground text-center border-t pt-4">
                  <p>Role: <span className="font-semibold capitalize">{adminProfile?.role || "Administrator"}</span></p>
                  <p>Account verified ✓</p>
                  <p className="mt-2 text-[10px]">
                    Joined: {adminProfile?.created_at ? new Date(adminProfile.created_at).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Edit Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Edit Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={editData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={editData.email}
                      disabled
                      className="mt-2 bg-muted"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={editData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="institution">Institution</Label>
                    <Input
                      id="institution"
                      name="institution"
                      value={editData.institution}
                      onChange={handleInputChange}
                      placeholder="Enter your institution name"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={editData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    className="mt-2"
                    rows={4}
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    variant="hero"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button variant="outline" disabled={loading} onClick={fetchAdminProfile}>
                    Reload
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* System Settings */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Platform Version</h3>
                <p className="text-sm text-muted-foreground">v1.0.0</p>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Last Updated</h3>
                <p className="text-sm text-muted-foreground">
                  {adminProfile?.updated_at ? new Date(adminProfile.updated_at).toLocaleDateString() : new Date().toLocaleDateString()}
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Database Status</h3>
                <p className="text-sm text-green-600 font-medium">Connected</p>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Storage Status</h3>
                <p className="text-sm text-green-600 font-medium">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminSettings;

