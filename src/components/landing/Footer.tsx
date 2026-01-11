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
                Exam<span className="text-primary">Master</span>
              </span>
            </Link>
            <p className="text-background/70 mb-6">
              Empowering students worldwide to achieve their academic goals through smart, adaptive learning.
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

          {/* Support */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Community</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Licenses</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-background/10 text-center text-background/50">
          <p>&copy; {new Date().getFullYear()} ExamMaster. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
