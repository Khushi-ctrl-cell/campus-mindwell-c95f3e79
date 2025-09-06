import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart, MessageCircle, Calendar, BookOpen, LogIn } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold text-foreground">
              Campus MindWell
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/ai-support">
              <Button variant="ghost" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                AI Support
              </Button>
            </Link>
            <Link to="/resources">
              <Button variant="ghost" size="sm">
                <BookOpen className="h-4 w-4 mr-2" />
                Resources
              </Button>
            </Link>
            <Link to="/book-session">
              <Button variant="ghost" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Book Session
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="default" size="sm">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2 animate-fade-in">
            <Link to="/ai-support" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <MessageCircle className="h-4 w-4 mr-2" />
                AI Support
              </Button>
            </Link>
            <Link to="/resources" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Resources
              </Button>
            </Link>
            <Link to="/book-session" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Book Session
              </Button>
            </Link>
            <Link to="/auth" onClick={() => setIsOpen(false)}>
              <Button variant="default" className="w-full justify-start">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;