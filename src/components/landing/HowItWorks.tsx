import { UserPlus, FolderOpen, BookOpen, Download } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Account",
    description: "Sign up with your email to access all study materials. It's free and takes seconds.",
  },
  {
    icon: FolderOpen,
    step: "02",
    title: "Select Your Branch",
    description: "Choose your academic branch like MCA, BCA, or BTech to see relevant subjects.",
  },
  {
    icon: BookOpen,
    step: "03",
    title: "Browse Materials",
    description: "Navigate through subjects and modules to find notes and question papers you need.",
  },
  {
    icon: Download,
    step: "04",
    title: "Download & Study",
    description: "Download study materials in PDF format and prepare for your exams effectively.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes with our simple four-step process to access all study materials.
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center group">
                {/* Step Number */}
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto shadow-lg group-hover:shadow-glow transition-all duration-300 group-hover:scale-110">
                    <step.icon className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm font-bold flex items-center justify-center">
                    {step.step}
                  </span>
                </div>

                <h3 className="font-display font-semibold text-xl mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
