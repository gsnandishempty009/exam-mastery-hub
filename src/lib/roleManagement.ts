import { supabase } from "@/integrations/supabase/client";

/**
 * Utility functions for managing user roles in Supabase
 */

export const roleManagement = {
  /**
   * Promote a user to admin by their user ID
   */
  async promoteToAdmin(userId: string) {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .upsert(
          { user_id: userId, role: "admin" },
          { onConflict: "user_id" }
        )
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Error promoting user to admin:", error);
      return { success: false, error };
    }
  },

  /**
   * Demote an admin user to student
   */
  async demoteToStudent(userId: string) {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .update({ role: "student" })
        .eq("user_id", userId)
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Error demoting user to student:", error);
      return { success: false, error };
    }
  },

  /**
   * Get a user's current role
   */
  async getUserRole(userId: string) {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      return { role: data?.role || "student" };
    } catch (error) {
      console.error("Error fetching user role:", error);
      return { role: "student" };
    }
  },

  /**
   * Get all users with their roles
   */
  async getAllUsersWithRoles() {
    try {
      // Direct query with RLS handling
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          profiles(id, email, full_name, created_at)
        `);

      if (error) {
        console.error("Query error:", error);
        throw error;
      }

      // Transform the data to flatten nested structure
      const transformedData = (data || [])?.map((item: any) => ({
        id: item.user_id,
        user_id: item.user_id,
        role: item.role,
        email: item.profiles?.email || "",
        full_name: item.profiles?.full_name || "User",
        created_at: item.profiles?.created_at,
      })) || [];

      return { success: true, data: transformedData };
    } catch (error) {
      console.error("Error fetching users with roles:", error);
      return { success: false, error };
    }
  },

  /**
   * Get all admin users
   */
  async getAllAdmins() {
    try {
      // Direct query for admins
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          profiles(id, email, full_name, created_at)
        `)
        .eq('role', 'admin');

      if (error) throw error;

      // Transform the data to ensure proper structure
      const transformedData = (data || [])?.map((item: any) => ({
        id: item.user_id,
        user_id: item.user_id,
        role: item.role,
        email: item.profiles?.email || "",
        full_name: item.profiles?.full_name || "User",
        created_at: item.profiles?.created_at,
      })) || [];

      return { success: true, data: transformedData };
    } catch (error) {
      console.error("Error fetching admins:", error);
      return { success: false, error };
    }
  },

  /**
   * Get all student users
   */
  async getAllStudents() {
    try {
      // Direct query for students
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          profiles(id, email, full_name, created_at)
        `)
        .eq('role', 'student');

      if (error) throw error;

      // Transform the data to ensure proper structure
      const transformedData = (data || [])?.map((item: any) => ({
        id: item.user_id,
        user_id: item.user_id,
        role: item.role,
        email: item.profiles?.email || "",
        full_name: item.profiles?.full_name || "User",
        created_at: item.profiles?.created_at,
      })) || [];

      return { success: true, data: transformedData };
    } catch (error) {
      console.error("Error fetching students:", error);
      return { success: false, error };
    }
  },

  /**
   * Check if a user is an admin
   */
  async isUserAdmin(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .single();

      if (error) return false;
      return !!data;
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  },
};

export default roleManagement;
