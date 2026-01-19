import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl gradient-primary p-12 md:p-16">
          {/* Background Decorations */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-primary-foreground text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Start Your Learning Journey
            </div>

            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
              Ready to Access Quality Study Materials?
            </h2>

            <p className="text-lg text-primary-foreground/80 mb-8">
              Join students who are already using our platform to access notes, question papers, and study guides. Sign up for free today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="secondary" size="xl" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/admin/login">
                <Button variant="outline-light" size="xl" className="w-full sm:w-auto">
                  Admin Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
