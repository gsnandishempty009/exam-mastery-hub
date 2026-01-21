import { Link } from "react-router-dom";
import { GraduationCap, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl">
                Study<span className="text-primary">Hub</span>
              </span>
            </Link>
            <p className="text-background/70 mb-6">
              Your one-stop destination for organized study notes and previous year question papers.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="text-background/70 hover:text-primary transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="text-background/70 hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="#testimonials" className="text-background/70 hover:text-primary transition-colors">Testimonials</a></li>
              <li><Link to="/register" className="text-background/70 hover:text-primary transition-colors">Sign Up</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><Link to="/login" className="text-background/70 hover:text-primary transition-colors">Study Notes</Link></li>
              <li><Link to="/login" className="text-background/70 hover:text-primary transition-colors">Question Papers</Link></li>
              <li><Link to="/login" className="text-background/70 hover:text-primary transition-colors">Browse Branches</Link></li>
              <li><Link to="/login" className="text-background/70 hover:text-primary transition-colors">All Subjects</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-background/10 text-center text-background/50">
          <p>&copy; {new Date().getFullYear()} StudyHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
