import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, CheckCircle2, Clock, AlertOctagon } from "lucide-react";

interface IssueReport {
  id: string;
  name: string;
  issue_title: string;
  category: string;
  status: string;
  created_at: string;
}

const IssueShowcase = () => {
  const [issues, setIssues] = useState<IssueReport[]>([]);
  const [stats, setStats] = useState({ open: 0, inProgress: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const { data, error } = await supabase
        .from("issue_reports" as any)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6)
        .returns<IssueReport[]>();

      if (error) {
        console.error("Error fetching issues:", error);
        setLoading(false);
        return;
      }

      const issues = (data || []) as IssueReport[];
      setIssues(issues);

      // Calculate stats
      const openCount = issues.filter((i) => i.status === "open").length || 0;
      const inProgressCount =
        issues.filter((i) => i.status === "in-progress").length || 0;
      const resolvedCount =
        issues.filter((i) => i.status === "resolved").length || 0;

      setStats({
        open: openCount,
        inProgress: inProgressCount,
        resolved: resolvedCount,
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "open":
        return <AlertOctagon className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "open":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return null; // Don't show section while loading
  }

  if (!issues || issues.length === 0) {
    return null; // Don't show section if no issues
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <AlertCircle className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
              Community Support
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Issue Tracking & Resolution
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We actively monitor and resolve student-reported issues. See what
            our community is working on and how we're improving StudyHub.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-red-600">{stats.open}</p>
              </div>
              <AlertOctagon className="w-12 h-12 text-red-100" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.inProgress}
                </p>
              </div>
              <Clock className="w-12 h-12 text-yellow-100" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.resolved}
                </p>
              </div>
              <CheckCircle2 className="w-12 h-12 text-green-100" />
            </div>
          </div>
        </div>

        {/* Recent Issues */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Issues
            </h3>
          </div>

          <div className="divide-y divide-gray-200">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(issue.status)}
                      <h4 className="font-semibold text-gray-900">
                        {issue.issue_title}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {issue.issue_title} ({issue.category})
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusBg(
                          issue.status
                        )}`}
                      >
                        {issue.status === "in-progress"
                          ? "In Progress"
                          : issue.status.charAt(0).toUpperCase() +
                            issue.status.slice(1)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {issue.name || "Anonymous"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(issue.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={() => {
                window.location.href = "/help";
              }}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Report an Issue →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IssueShowcase;
