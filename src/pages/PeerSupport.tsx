import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Users, MessageCircle, Shield, Heart, CheckCircle, UserCheck, Clock, Lock } from "lucide-react";

const PeerSupport = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-calm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-6">
              <div className="flex justify-center mb-6">
                <Users className="h-16 w-16 text-primary animate-float" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
                Safe, Supportive Peer Connections
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Connect anonymously with peers and trained volunteers in moderated groups. 
                Share experiences, find support, and help others in a safe, confidential environment.
              </p>
              <Button size="lg" className="mt-8">
                <Heart className="h-5 w-5 mr-2" />
                Join Now
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Why Choose Our Peer Support Platform?
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Our platform connects students in meaningful ways while prioritizing safety, privacy, and genuine support.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 shadow-card border border-border/50 hover:shadow-glow/20 transition-all duration-300">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-primary-soft/20 rounded-lg flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Moderated Discussions</h3>
                  <p className="text-muted-foreground">
                    Trained student volunteers monitor all conversations to ensure a safe, respectful environment 
                    where everyone feels heard and supported.
                  </p>
                </div>
              </Card>

              <Card className="p-8 shadow-card border border-border/50 hover:shadow-glow/20 transition-all duration-300">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-primary-soft/20 rounded-lg flex items-center justify-center">
                    <UserCheck className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Trained Volunteers</h3>
                  <p className="text-muted-foreground">
                    Our peer supporters are specially trained in empathetic listening, crisis recognition, 
                    and connecting students with appropriate resources.
                  </p>
                </div>
              </Card>

              <Card className="p-8 shadow-card border border-border/50 hover:shadow-glow/20 transition-all duration-300">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-primary-soft/20 rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Anonymous Participation</h3>
                  <p className="text-muted-foreground">
                    Share your experiences and challenges without revealing your identity. 
                    Complete privacy protection lets you be authentic and vulnerable safely.
                  </p>
                </div>
              </Card>

              <Card className="p-8 shadow-card border border-border/50 hover:shadow-glow/20 transition-all duration-300">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-primary-soft/20 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Topic-Based Groups</h3>
                  <p className="text-muted-foreground">
                    Choose from specialized support groups focusing on stress management, academic pressure, 
                    relationships, mental health awareness, and more.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gradient-calm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-lg text-muted-foreground">
                Getting started is simple and completely confidential
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary-soft rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground">Sign Up</h3>
                <p className="text-muted-foreground">
                  Create an anonymous account - no personal details required. 
                  Just choose a username and you're ready to go.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary-soft rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground">Choose Groups</h3>
                <p className="text-muted-foreground">
                  Browse and join topic-based support groups that match your interests 
                  and current challenges.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary-soft rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground">Start Supporting</h3>
                <p className="text-muted-foreground">
                  Share your experiences, offer support to others, and receive 
                  encouragement from your peer community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Safety Section */}
        <section className="py-20 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="p-8 border-2 border-primary/20 bg-primary-soft/10">
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <Lock className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  Your Safety & Privacy Are Our Priority
                </h3>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  We maintain strict confidentiality protocols, active moderation by trained volunteers, 
                  and clear community standards to ensure every interaction is safe, supportive, and respectful. 
                  Your privacy is protected through anonymous participation and secure, encrypted communications.
                </p>
                
                <div className="grid sm:grid-cols-3 gap-6 pt-6">
                  <div className="flex flex-col items-center gap-2">
                    <Shield className="h-6 w-6 text-primary" />
                    <span className="font-medium">End-to-End Encrypted</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Clock className="h-6 w-6 text-primary" />
                    <span className="font-medium">24/7 Moderation</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-primary" />
                    <span className="font-medium">Community Guidelines</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-calm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Ready to Connect?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of students who have found support, understanding, and genuine connections 
                through our peer support community.
              </p>
              <Button size="lg" className="mt-8">
                <Users className="h-5 w-5 mr-2" />
                Join Now
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PeerSupport;