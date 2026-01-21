import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Facebook, Twitter, Linkedin, Instagram, Mail } from "lucide-react";

const Footer = () => {
  const navigate = useNavigate();

  const handleHelpClick = () => {
    navigate("/help");
  };

  const handleContactClick = () => {
    window.location.href = "mailto:nandishtech009@gmail.com?subject=StudyHub Support";
  };

  const handlePrivacyClick = () => {
    navigate("/privacy-policy");
  };

  const handleTermsClick = () => {
    navigate("/terms-of-service");
  };

  return (
    <footer className="bg-foreground text-background py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-6">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-base">
                Study<span className="text-primary">Hub</span>
              </span>
            </Link>
            <p className="text-background/60 text-sm mb-4">
              Your academic resource hub.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors text-sm">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors text-sm">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors text-sm">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors text-sm">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-base mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="text-background/60 hover:text-primary transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="text-background/60 hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="#testimonials" className="text-background/60 hover:text-primary transition-colors">Testimonials</a></li>
              <li><Link to="/register" className="text-background/60 hover:text-primary transition-colors">Sign Up</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-semibold text-base mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="text-background/60 hover:text-primary transition-colors">Study Notes</Link></li>
              <li><Link to="/login" className="text-background/60 hover:text-primary transition-colors">Question Papers</Link></li>
              <li><Link to="/login" className="text-background/60 hover:text-primary transition-colors">Browse Branches</Link></li>
              <li><Link to="/login" className="text-background/60 hover:text-primary transition-colors">All Subjects</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-semibold text-base mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={handleHelpClick} className="text-background/60 hover:text-primary transition-colors text-left">Help Center</button></li>
              <li><button onClick={handleContactClick} className="text-background/60 hover:text-primary transition-colors text-left">Contact Us</button></li>
              <li><button onClick={handlePrivacyClick} className="text-background/60 hover:text-primary transition-colors text-left">Privacy Policy</button></li>
              <li><button onClick={handleTermsClick} className="text-background/60 hover:text-primary transition-colors text-left">Terms of Service</button></li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-background/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-background/50 text-xs">
            <p>&copy; {new Date().getFullYear()} StudyHub. All rights reserved.</p>
            <a href="mailto:nandishtech009@gmail.com" className="flex items-center gap-2 text-background/60 hover:text-primary transition-colors">
              <Mail className="w-4 h-4" />
              nandishtech009@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
