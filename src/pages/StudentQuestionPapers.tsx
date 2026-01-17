import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileQuestion,
  Download,
  ChevronRight,
  Loader2,
  FolderOpen,
  GraduationCap,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Branch {
  id: string;
  name: string;
  code: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
}

interface QuestionPaper {
  id: string;
  title: string;
  exam_year: number;
  exam_type: string;
  file_url: string;
  file_name: string;
  created_at: string;
  subjects?: Subject | null;
}

const StudentQuestionPapers = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>([]);

  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedExamYear, setSelectedExamYear] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Fetch branches on mount
  useEffect(() => {
    const fetchBranches = async () => {
      const { data } = await supabase
        .from("branches")
        .select("*")
        .order("name");

      if (data) setBranches(data);
      setLoading(false);
    };

    fetchBranches();
  }, []);

  // Fetch available years when branch is selected
  useEffect(() => {
    const fetchAvailableYears = async () => {
      if (!selectedBranch) {
        setAvailableYears([]);
        return;
      }

      const { data } = await supabase
        .from("question_papers")
        .select("exam_year")
        .eq("branch_id", selectedBranch);

      if (data) {
        const years = [...new Set(data.map((d) => d.exam_year))].sort((a, b) => b - a);
        setAvailableYears(years);
      }
    };

    fetchAvailableYears();
  }, [selectedBranch]);

  // Fetch question papers when branch and year are selected
  useEffect(() => {
    const fetchQuestionPapers = async () => {
      if (!selectedBranch) {
        setQuestionPapers([]);
        return;
      }

      let query = supabase
        .from("question_papers")
        .select("*, subjects(id, name, code)")
        .eq("branch_id", selectedBranch)
        .order("exam_year", { ascending: false });

      if (selectedExamYear) {
        query = query.eq("exam_year", parseInt(selectedExamYear));
      }

      const { data } = await query;
      setQuestionPapers(data || []);
    };

    fetchQuestionPapers();
  }, [selectedBranch, selectedExamYear]);

  const handleDownload = (fileUrl: string) => {
    window.open(fileUrl, "_blank");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const selectedBranchName = branches.find((b) => b.id === selectedBranch)?.name;

  // Group papers by year
  const papersByYear = questionPapers.reduce((acc, paper) => {
    const year = paper.exam_year;
    if (!acc[year]) acc[year] = [];
    acc[year].push(paper);
    return acc;
  }, {} as Record<number, QuestionPaper[]>);

  return (
    <div className="min-h-screen bg-background">
      <StudentSidebar />

      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2 flex items-center gap-3">
            <FileQuestion className="w-8 h-8 text-primary" />
            Previous Question Papers
          </h1>
          <p className="text-muted-foreground">
            Access year-wise previous exam question papers
          </p>
        </div>

        {/* Breadcrumb */}
        {selectedBranch && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <span className="text-foreground font-medium">Question Papers</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-primary font-medium">{selectedBranchName}</span>
            {selectedExamYear && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground">{selectedExamYear}</span>
              </>
            )}
          </div>
        )}

        {/* Filters */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Branch</label>
                <Select value={selectedBranch} onValueChange={(val) => {
                  setSelectedBranch(val);
                  setSelectedExamYear("");
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name} ({branch.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Exam Year</label>
                <Select
                  value={selectedExamYear}
                  onValueChange={setSelectedExamYear}
                  disabled={!selectedBranch || availableYears.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Years</SelectItem>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedBranch && (
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedBranch("");
                      setSelectedExamYear("");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {!selectedBranch ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.length === 0 ? (
              <Card className="col-span-full border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display text-xl font-semibold mb-2">No Branches Available</h3>
                  <p className="text-muted-foreground">
                    Branches will be added by the administrator.
                  </p>
                </CardContent>
              </Card>
            ) : (
              branches.map((branch) => (
                <Card
                  key={branch.id}
                  className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
                  onClick={() => setSelectedBranch(branch.id)}
                >
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <GraduationCap className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-1">{branch.name}</h3>
                    <p className="text-sm text-muted-foreground">{branch.code}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        ) : questionPapers.length > 0 ? (
          <div className="space-y-8">
            {Object.entries(papersByYear)
              .sort(([a], [b]) => parseInt(b) - parseInt(a))
              .map(([year, papers]) => (
                <div key={year}>
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h2 className="font-display text-xl font-semibold">{year}</h2>
                    <span className="text-sm text-muted-foreground">
                      ({papers.length} paper{papers.length !== 1 ? "s" : ""})
                    </span>
                  </div>
                  <div className="grid gap-4">
                    {papers.map((paper) => (
                      <Card key={paper.id} className="border-0 shadow-lg hover:shadow-xl transition-all">
                        <CardContent className="p-6 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                            <FileQuestion className="w-6 h-6 text-accent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold truncate">{paper.title}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              {paper.subjects && (
                                <span>{paper.subjects.name}</span>
                              )}
                              <span>•</span>
                              <span>{paper.exam_type}</span>
                              <span>•</span>
                              <span>{paper.exam_year}</span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(paper.file_url)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <FileQuestion className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold mb-2">No Question Papers Available</h3>
              <p className="text-muted-foreground">
                Question papers for this branch will be uploaded by the administrator.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default StudentQuestionPapers;
