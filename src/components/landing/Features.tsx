import { FolderTree, BookOpen, FileText, Download, Search, Lock, Shield, Eye } from "lucide-react";

const features = [
  {
    icon: FolderTree,
    title: "Organized by Branch",
    description: "Study materials organized by academic branches like MCA, BCA, BTech for easy navigation.",
    color: "primary",
  },
  {
    icon: BookOpen,
    title: "Comprehensive Notes",
    description: "Access detailed study notes for every module in each subject, curated by experts.",
    color: "accent",
  },
  {
    icon: FileText,
    title: "Previous Year Papers",
    description: "Download question papers from previous years to prepare effectively for exams.",
    color: "warning",
  },
  {
    icon: Search,
    title: "Easy to Navigate",
    description: "Find what you need quickly with our intuitive branch, year, subject, and module filters.",
    color: "success",
  },
  {
    icon: Download,
    title: "Instant Downloads",
    description: "Download notes and question papers instantly in PDF format for offline study.",
    color: "primary",
  },
  {
    icon: Lock,
    title: "Secure Access",
    description: "Your data is protected with secure authentication and role-based access control.",
    color: "accent",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="text-gradient">Succeed</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform provides all the study resources you need, organized systematically by branch, year, subject, and module.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${
                  feature.color === "primary"
                    ? "bg-primary/10"
                    : feature.color === "accent"
                    ? "bg-accent/10"
                    : feature.color === "warning"
                    ? "bg-warning/10"
                    : "bg-success/10"
                }`}
              >
                <feature.icon
                  className={`w-7 h-7 ${
                    feature.color === "primary"
                      ? "text-primary"
                      : feature.color === "accent"
                      ? "text-accent"
                      : feature.color === "warning"
                      ? "text-warning"
                      : "text-success"
                  }`}
                />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
