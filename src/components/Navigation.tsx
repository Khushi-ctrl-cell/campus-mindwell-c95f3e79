import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart, MessageCircle, Calendar, BookOpen } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold text-foreground">
              Campus MindWell
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Button variant="ghost" size="sm">
              <MessageCircle className="h-4 w-4 mr-2" />
              AI Support
            </Button>
            <Button variant="ghost" size="sm">
              <BookOpen className="h-4 w-4 mr-2" />
              Resources
            </Button>
            <Button variant="ghost" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Book Session
            </Button>
            <Button variant="default" size="sm">
              Get Help Now
            </Button>
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
            <Button variant="ghost" className="w-full justify-start">
              <MessageCircle className="h-4 w-4 mr-2" />
              AI Support
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <BookOpen className="h-4 w-4 mr-2" />
              Resources
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Book Session
            </Button>
            <Button variant="default" className="w-full">
              Get Help Now
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;