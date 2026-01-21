import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook to protect admin pages from non-admin users
 * Use this in any admin-only page to ensure only admins can access it
 */
export const useAdminProtection = () => {
  const { userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // If auth is still loading, wait
    if (authLoading) {
      return;
    }

    // If user is not an admin, deny access
    if (userRole !== "admin") {
      toast({
        title: "Access Denied",
        description: "You do not have permission to access the admin dashboard.",
        variant: "destructive",
      });

      // Sign out the unauthorized user
      const signOutAndRedirect = async () => {
        await supabase.auth.signOut();
        navigate("/login");
      };
      signOutAndRedirect();
    }
  }, [userRole, authLoading, navigate, toast]);

  // Return the loading and userRole status
  return { isAdmin: userRole === "admin", authLoading, userRole };
};
