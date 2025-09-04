import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { BookOpen, Heart, Brain, GraduationCap, Users, Phone, ArrowRight } from "lucide-react";

const Resources = () => {
  const resourceCategories = [
    {
      icon: <Brain className="h-8 w-8 text-primary" />,
      title: "Mental Health Basics",
      description: "Understanding anxiety, depression, stress, and other common mental health topics.",
      resources: [
        "What is Mental Health?",
        "Understanding Anxiety Disorders",
        "Depression: Signs and Support",
        "Building Emotional Resilience"
      ]
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Coping with Stress",
      description: "Practical techniques and strategies for managing daily stress and pressure.",
      resources: [
        "Deep Breathing Techniques",
        "Mindfulness for Students",
        "Time Management Strategies",
        "Healthy Stress Relief Methods"
      ]
    },
    {
      icon: <GraduationCap className="h-8 w-8 text-primary" />,
      title: "Academic Pressure",
      description: "Managing academic stress, study anxiety, and performance pressure.",
      resources: [
        "Overcoming Test Anxiety",
        "Effective Study Habits",
        "Dealing with Academic Burnout",
        "Setting Realistic Goals"
      ]
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Relationships",
      description: "Navigating friendships, family relationships, and romantic connections.",
      resources: [
        "Healthy Communication Skills",
        "Setting Boundaries",
        "Dealing with Conflict",
        "Building Support Networks"
      ]
    },
    {
      icon: <Phone className="h-8 w-8 text-primary" />,
      title: "Crisis Contacts",
      description: "Important emergency contacts and crisis support resources.",
      resources: [
        "National Suicide Prevention Lifeline",
        "Campus Crisis Hotline",
        "Emergency Mental Health Services",
        "24/7 Support Chat Lines"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-calm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-6">
              <div className="flex justify-center mb-6">
                <BookOpen className="h-16 w-16 text-primary animate-float" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
                Guides & Resources
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Comprehensive mental health resources, guides, and tools to support your well-being journey. 
                Find evidence-based information and practical strategies.
              </p>
            </div>
          </div>
        </section>

        {/* Resource Categories */}
        <section className="py-20 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {resourceCategories.map((category, index) => (
                <Card key={index} className="p-8 shadow-card border border-border/50 hover:shadow-glow/20 transition-all duration-300 group">
                  <div className="space-y-6">
                    {/* Category Header */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary-soft/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        {category.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                          {category.title}
                        </h3>
                        <p className="text-muted-foreground mt-2">
                          {category.description}
                        </p>
                      </div>
                    </div>

                    {/* Resource List */}
                    <div className="space-y-3">
                      {category.resources.map((resource, resourceIndex) => (
                        <div key={resourceIndex} className="flex items-center justify-between group/item">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <span className="text-muted-foreground group-hover/item:text-foreground transition-colors">
                              {resource}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover/item:opacity-100 transition-opacity"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Category Action */}
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Explore {category.title}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Emergency Resources */}
        <section className="py-20 bg-gradient-calm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="p-8 border-2 border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <Phone className="h-12 w-12 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  Need Immediate Help?
                </h3>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  If you're experiencing a mental health crisis or having thoughts of self-harm, 
                  please reach out for immediate support. You're not alone.
                </p>
                
                <div className="grid sm:grid-cols-2 gap-4 pt-6">
                  <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300">
                    Crisis Hotline: 988
                  </Button>
                  <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300">
                    Campus Emergency: 911
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Additional Support */}
        <section className="py-20 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Want More Personalized Support?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                These resources are just the beginning. Connect with our AI support, 
                join peer groups, or book a session for more personalized help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button size="lg">
                  <Heart className="h-5 w-5 mr-2" />
                  Talk to AI Support
                </Button>
                <Button variant="outline" size="lg">
                  <Users className="h-5 w-5 mr-2" />
                  Join Peer Groups
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Resources;