import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              Study<span className="text-primary">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/admin/login">
              <Button variant="outline" size="sm">Admin</Button>
            </Link>
            <Link to="/help">
              <Button variant="outline" size="sm" className="bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-200">Help Center</Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button variant="hero">Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors py-2">
                Features
              </a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors py-2">
                How It Works
              </a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors py-2">
                Testimonials
              </a>
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Link to="/admin/login">
                  <Button variant="outline" className="w-full">Admin Login</Button>
                </Link>
                <Link to="/help">
                  <Button variant="outline" className="w-full bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-200">Help Center</Button>
                </Link>
                <Link to="/login">
                  <Button variant="ghost" className="w-full">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="hero" className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
    
    {/* Marquee Banner */}
    <div className="mt-16 w-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 border-b border-border overflow-hidden">
      <div className="animate-marquee whitespace-nowrap py-3 px-4">
        <span className="text-sm font-medium text-muted-foreground mx-4">
          ✨ New Feature: Upload PDF URLs for notes and question papers
        </span>
        <span className="text-sm font-medium text-muted-foreground mx-4">
          🔒 Your data is secure and protected with enterprise-grade encryption
        </span>
        <span className="text-sm font-medium text-amber-600 dark:text-amber-400 mx-4 font-semibold">
          ⚠️ Important: Always verify subject details before submitting queries
        </span>
        <span className="text-sm font-medium text-blue-600 dark:text-blue-400 mx-4">
          📝 Pro Tip: Include semester and year details for faster support response
        </span>
      </div>
    </div>
    </>
  );
};

export default Navbar;
