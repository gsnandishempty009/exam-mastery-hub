import { Brain, BarChart3, Clock, Shield, BookOpen, Trophy } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Learning",
    description: "Smart algorithms adapt to your learning style and identify areas that need improvement.",
    color: "primary",
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description: "Track your progress with comprehensive reports and performance insights.",
    color: "accent",
  },
  {
    icon: Clock,
    title: "Timed Practice Tests",
    description: "Simulate real exam conditions with customizable timed assessments.",
    color: "warning",
  },
  {
    icon: Shield,
    title: "Secure Platform",
    description: "Your data and exam results are protected with enterprise-grade security.",
    color: "success",
  },
  {
    icon: BookOpen,
    title: "Vast Question Bank",
    description: "Access thousands of questions across multiple subjects and difficulty levels.",
    color: "primary",
  },
  {
    icon: Trophy,
    title: "Gamified Learning",
    description: "Earn badges, climb leaderboards, and stay motivated on your learning journey.",
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
            <span className="text-gradient">Excel</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform combines cutting-edge technology with proven learning methods to help you achieve your academic goals.
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
