import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  Calendar, 
  BookOpen, 
  Users, 
  BarChart3, 
  Heart,
  Shield,
  Clock
} from "lucide-react";
import chatIcon from "@/assets/chat-support-icon.jpg";
import resourcesIcon from "@/assets/resources-icon.jpg";
import bookingIcon from "@/assets/booking-icon.jpg";

const FeaturesSection = () => {
  const features = [
    {
      icon: <MessageCircle className="h-8 w-8 text-primary" />,
      image: chatIcon,
      title: "AI-Guided First-Aid Support",
      description: "Interactive chat providing immediate coping strategies and professional referrals when needed.",
      features: ["24/7 Availability", "Crisis Detection", "Personalized Responses", "Professional Escalation"],
      action: "Start Chat"
    },
    {
      icon: <Calendar className="h-8 w-8 text-primary" />,
      image: bookingIcon,
      title: "Confidential Booking System",
      description: "Secure appointment scheduling with on-campus counselors and mental health helplines.",
      features: ["Anonymous Booking", "Campus Integration", "Flexible Scheduling", "Reminder System"],
      action: "Book Appointment"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      image: resourcesIcon,
      title: "Psychoeducational Hub",
      description: "Comprehensive library of videos, audio guides, and wellness resources in regional languages.",
      features: ["Video Library", "Audio Relaxation", "Regional Languages", "Self-Help Guides"],
      action: "Browse Resources"
    },
    {
      icon: <Users className="h-8 w-8 text-accent" />,
      image: null,
      title: "Peer Support Platform",
      description: "Moderated peer-to-peer support forums with trained student volunteers.",
      features: ["Moderated Discussions", "Trained Volunteers", "Anonymous Participation", "Topic-Based Groups"],
      action: "Join Community"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-accent" />,
      image: null,
      title: "Admin Dashboard",
      description: "Anonymous analytics for institutions to recognize trends and plan interventions.",
      features: ["Trend Analysis", "Anonymous Data", "Policy Planning", "Resource Allocation"],
      action: "View Analytics"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Comprehensive Mental Health Support
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our platform provides multiple pathways to mental wellness, ensuring every student can find the support they need.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 shadow-card border border-border/50 hover:shadow-glow/20 transition-all duration-300 group">
              <div className="space-y-6">
                {/* Feature Image/Icon */}
                <div className="relative">
                  {feature.image ? (
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-primary-soft/20">
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-primary-soft/20 rounded-lg flex items-center justify-center">
                      {feature.icon}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>

                {/* Feature List */}
                <div className="space-y-2">
                  {feature.features.map((item, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {feature.action}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Trust Section */}
        <div className="bg-gradient-calm rounded-2xl p-8 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-center">
              <Heart className="h-12 w-12 text-primary animate-float" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              Built for Student Privacy & Safety
            </h3>
            <p className="text-lg text-muted-foreground">
              Our platform follows strict confidentiality protocols and integrates seamlessly with your institution's existing support structure.
            </p>
            
            <div className="grid sm:grid-cols-3 gap-6 pt-6">
              <div className="flex flex-col items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <span className="font-medium">HIPAA Compliant</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Clock className="h-6 w-6 text-primary" />
                <span className="font-medium">24/7 Support</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                <span className="font-medium">Trained Professionals</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;