import { Heart, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-foreground">
                Campus MindWell
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Supporting student mental health across higher education institutions in J&K and beyond.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Access</h3>
            <div className="space-y-2 text-sm">
              <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-primary">
                AI Support Chat
              </Button>
              <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-primary">
                Book Counselor
              </Button>
              <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-primary">
                Resource Library
              </Button>
              <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-primary">
                Peer Support
              </Button>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Resources</h3>
            <div className="space-y-2 text-sm">
              <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-primary">
                Mental Health Guide
              </Button>
              <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-primary">
                Crisis Resources
              </Button>
              <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-primary">
                Campus Contacts
              </Button>
              <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-primary">
                Privacy Policy
              </Button>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Emergency Support</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Crisis Helpline: 1800-XXX-XXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">support@campusmindwell.in</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-muted-foreground">
                  Dept. of Higher Education<br />
                  Government of J&K
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Campus MindWell. Developed for student mental health support.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-primary">
              Privacy
            </Button>
            <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-primary">
              Terms
            </Button>
            <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-primary">
              Accessibility
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;