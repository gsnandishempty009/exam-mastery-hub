import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, FileText, GraduationCap, FolderOpen, Library } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Your Academic Resource Hub
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Access Study Notes &{" "}
              <span className="text-gradient">Question Papers</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Your one-stop destination for organized study materials. Browse notes by branch, subject, and module. Download previous year question papers for effective exam preparation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/register">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  Start Learning
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  <BookOpen className="w-5 h-5" />
                  Student Login
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-display font-bold text-2xl">3+</p>
                  <p className="text-sm text-muted-foreground">Branches</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-display font-bold text-2xl">100+</p>
                  <p className="text-sm text-muted-foreground">Study Notes</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="font-display font-bold text-2xl">50+</p>
                  <p className="text-sm text-muted-foreground">Question Papers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Illustration */}
          <div className="relative animate-fade-in hidden lg:block">
            <div className="relative">
              {/* Main Card */}
              <div className="bg-card rounded-3xl shadow-xl p-6 border border-border">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">MCA - 1st Year</p>
                    <p className="text-sm text-muted-foreground">Data Structures</p>
                  </div>
                  <div className="ml-auto px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium">
                    5 Modules
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-muted rounded-xl p-4">
                    <p className="text-sm font-medium mb-2">Module 1: Introduction</p>
                    <p className="text-muted-foreground text-sm">
                      Arrays, Linked Lists, Stacks and Queues fundamentals
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {["Notes PDF", "Question Papers", "Previous Year", "Study Guide"].map((item, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg border text-sm transition-all flex items-center gap-2 ${
                          i === 0
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {i === 0 || i === 3 ? <BookOpen className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Library className="w-4 h-4" />
                    12 Resources Available
                  </div>
                  <Button size="sm" variant="hero">Download</Button>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-card rounded-2xl shadow-lg p-4 border border-border animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Papers</p>
                    <p className="font-bold text-success">2024</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-card rounded-2xl shadow-lg p-4 border border-border animate-float" style={{ animationDelay: "1s" }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Subjects</p>
                    <p className="font-bold">15+ Available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
