import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  FileText,
  Download,
  ChevronRight,
  Loader2,
  FolderOpen,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Branch {
  id: string;
  name: string;
  code: string;
}

interface AcademicYear {
  id: string;
  year_number: number;
  name: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  total_modules: number;
}

interface Module {
  id: string;
  module_number: number;
  title: string;
  description: string | null;
}

interface Note {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string;
  created_at: string;
  pdf_url?: string | null;
}

const StudentNotes = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedModule, setSelectedModule] = useState<string>("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Fetch branches and academic years on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [branchesRes, yearsRes] = await Promise.all([
          supabase.from("branches").select("*").order("name"),
          supabase.from("academic_years").select("*").order("year_number"),
        ]);

        if (branchesRes.error) {
          console.error("Error fetching branches:", branchesRes.error);
        } else if (branchesRes.data) {
          console.log("Branches fetched:", branchesRes.data);
          setBranches(branchesRes.data);
        }

        if (yearsRes.error) {
          console.error("Error fetching academic years:", yearsRes.error);
        } else if (yearsRes.data) {
          console.log("Academic years fetched:", yearsRes.data);
          setAcademicYears(yearsRes.data);
        }
      } catch (err) {
        console.error("Unexpected error fetching initial data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch subjects when branch and year are selected
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!selectedBranch || !selectedYear) {
        setSubjects([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("subjects")
          .select("*")
          .eq("branch_id", selectedBranch)
          .eq("academic_year_id", selectedYear)
          .order("name");

        if (error) {
          console.error("Error fetching subjects:", error);
          setSubjects([]);
        } else {
          console.log("Subjects fetched:", data);
          setSubjects(data || []);
        }
      } catch (err) {
        console.error("Unexpected error fetching subjects:", err);
        setSubjects([]);
      }
      
      setSelectedSubject("");
      setSelectedModule("");
      setModules([]);
      setNotes([]);
    };

    fetchSubjects();
  }, [selectedBranch, selectedYear]);

  // Fetch modules when subject is selected
  useEffect(() => {
    const fetchModules = async () => {
      if (!selectedSubject) {
        setModules([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("modules")
          .select("*")
          .eq("subject_id", selectedSubject)
          .order("module_number");

        if (error) {
          console.error("Error fetching modules:", error);
          setModules([]);
        } else {
          console.log("Modules fetched:", data);
          setModules(data || []);
        }
      } catch (err) {
        console.error("Unexpected error fetching modules:", err);
        setModules([]);
      }
      
      setSelectedModule("");
      setNotes([]);
    };

    fetchModules();
  }, [selectedSubject]);

  // Fetch notes when module is selected
  useEffect(() => {
    const fetchNotes = async () => {
      if (!selectedModule) {
        setNotes([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("notes")
          .select("*")
          .eq("module_id", selectedModule)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching notes:", error);
          setNotes([]);
        } else {
          console.log("Notes fetched:", data);
          setNotes(data || []);
        }
      } catch (err) {
        console.error("Unexpected error fetching notes:", err);
        setNotes([]);
      }
    };

    fetchNotes();
  }, [selectedModule]);

  const handleDownload = (fileUrl: string, fileName: string) => {
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
  const selectedYearName = academicYears.find((y) => y.id === selectedYear)?.name;
  const selectedSubjectName = subjects.find((s) => s.id === selectedSubject)?.name;
  const selectedModuleName = modules.find((m) => m.id === selectedModule)?.title;

  return (
    <div className="min-h-screen bg-background">
      <StudentSidebar />

      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            Study Notes
          </h1>
          <p className="text-muted-foreground">
            Access module-wise notes for all subjects
          </p>
        </div>

        {/* Breadcrumb */}
        {(selectedBranch || selectedYear || selectedSubject || selectedModule) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
            <span className="text-foreground font-medium">Notes</span>
            {selectedBranchName && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground">{selectedBranchName}</span>
              </>
            )}
            {selectedYearName && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground">{selectedYearName}</span>
              </>
            )}
            {selectedSubjectName && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground">{selectedSubjectName}</span>
              </>
            )}
            {selectedModuleName && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-primary font-medium">{selectedModuleName}</span>
              </>
            )}
          </div>
        )}

        {/* Filters */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Branch</label>
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
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
                <label className="text-sm font-medium mb-2 block">Year</label>
                <Select
                  value={selectedYear}
                  onValueChange={setSelectedYear}
                  disabled={!selectedBranch}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears.map((year) => (
                      <SelectItem key={year.id} value={year.id}>
                        {year.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <Select
                  value={selectedSubject}
                  onValueChange={setSelectedSubject}
                  disabled={subjects.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Module</label>
                <Select
                  value={selectedModule}
                  onValueChange={setSelectedModule}
                  disabled={modules.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Module" />
                  </SelectTrigger>
                  <SelectContent>
                    {modules.map((module) => (
                      <SelectItem key={module.id} value={module.id}>
                        Module {module.module_number}: {module.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
        ) : selectedModule && notes.length > 0 ? (
          <div className="grid gap-4">
            {notes.map((note) => (
              <Card key={note.id} className="border-0 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{note.title}</h4>
                      {note.description && (
                        <p className="text-sm text-muted-foreground truncate">{note.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(note.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {note.pdf_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(note.pdf_url as string, "document.pdf")}
                        className="whitespace-nowrap"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(note.file_url, note.file_name)}
                      className="whitespace-nowrap"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : selectedModule ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold mb-2">No Notes Available</h3>
              <p className="text-muted-foreground">
                Notes for this module will be uploaded by the administrator.
              </p>
            </CardContent>
          </Card>
        ) : modules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <Card
                key={module.id}
                className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => setSelectedModule(module.id)}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <span className="font-bold text-primary text-lg">{module.module_number}</span>
                  </div>
                  <h3 className="font-display font-semibold mb-1">{module.title}</h3>
                  {module.description && (
                    <p className="text-sm text-muted-foreground">{module.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : subjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <Card
                key={subject.id}
                className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => setSelectedSubject(subject.id)}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                    <BookOpen className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-display font-semibold mb-1">{subject.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {subject.code} • {subject.total_modules} Modules
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : selectedBranch && selectedYear ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold mb-2">No Subjects Available</h3>
              <p className="text-muted-foreground">
                Subjects for this branch and year will be added by the administrator.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold mb-2">Select Year</h3>
              <p className="text-muted-foreground">
                Please select an academic year to view subjects.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default StudentNotes;
