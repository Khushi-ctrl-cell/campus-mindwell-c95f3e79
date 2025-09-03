import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, Shield, Clock, Users } from "lucide-react";
import heroImage from "@/assets/hero-mental-health.jpg";
import MentalHealthSupportChat from "./MentalHealthSupportChat";
import ResourceHub from "./ResourceHub";

const HeroSection = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

  return (
    <section className="relative bg-gradient-soft min-h-[80vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-20">
        <img
          src={heroImage}
          alt="Peaceful campus environment"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Your Mental Health
                <span className="text-primary block">Matters</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Access confidential, 24/7 mental health support designed specifically for college students. Get help when you need it, how you need it.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-hero border-0 shadow-glow hover:shadow-glow/80"
                onClick={() => setIsChatOpen(true)}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Start Chat Support
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setIsResourcesOpen(true)}
              >
                Browse Resources
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>100% Confidential</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>24/7 Available</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>Peer Support</span>
              </div>
            </div>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="space-y-6 animate-slide-up">
            <Card className="p-6 shadow-card bg-card/50 backdrop-blur-sm border border-border/50">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-soft rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">AI-Powered Support</h3>
                </div>
                <p className="text-muted-foreground">
                  Get immediate coping strategies and guided support available 24/7.
                </p>
              </div>
            </Card>

            <Card className="p-6 shadow-card bg-card/50 backdrop-blur-sm border border-border/50">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold">Complete Privacy</h3>
                </div>
                <p className="text-muted-foreground">
                  Your conversations and data are fully encrypted and confidential.
                </p>
              </div>
            </Card>

            <Card className="p-6 shadow-card bg-card/50 backdrop-blur-sm border border-border/50">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-soft rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Campus Integration</h3>
                </div>
                <p className="text-muted-foreground">
                  Connect with campus counselors and peer support networks.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal Components */}
      <MentalHealthSupportChat 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
      <ResourceHub 
        isOpen={isResourcesOpen} 
        onClose={() => setIsResourcesOpen(false)} 
      />
    </section>
  );
};

export default HeroSection;