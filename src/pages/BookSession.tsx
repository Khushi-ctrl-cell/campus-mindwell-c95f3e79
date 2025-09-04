import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Calendar, Clock, User, Shield, Heart, CheckCircle } from "lucide-react";

const BookSession = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
    preferredTime: "",
    additionalNotes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Booking session:", formData);
  };

  const topics = [
    "General Mental Health Support",
    "Anxiety Management",
    "Stress and Academic Pressure",
    "Depression Support",
    "Relationship Issues",
    "Sleep Difficulties",
    "Crisis Support",
    "Other"
  ];

  const timeSlots = [
    "Morning (9:00 AM - 12:00 PM)",
    "Afternoon (12:00 PM - 5:00 PM)",
    "Evening (5:00 PM - 8:00 PM)",
    "Late Evening (8:00 PM - 10:00 PM)"
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
                <Calendar className="h-16 w-16 text-primary animate-float" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
                Book a Session with a Volunteer
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Schedule a confidential chat with a trained student volunteer. 
                Our peer supporters are here to listen and provide guidance in a safe, supportive environment.
              </p>
            </div>
          </div>
        </section>

        {/* Booking Form */}
        <section className="py-12 bg-background">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="p-8 shadow-card border border-border/50">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">Schedule Your Session</h2>
                  <p className="text-muted-foreground">Fill out the form below to book your confidential session</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Name (Optional)</Label>
                    <Input
                      id="name"
                      placeholder="You can use a preferred name or leave blank"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground">
                      Your privacy is important to us. You can use any name you're comfortable with.
                    </p>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email or Student ID</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@university.edu or student ID"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      We'll use this to send you session details and reminders.
                    </p>
                  </div>

                  {/* Topic Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="topic">What would you like to talk about?</Label>
                    <Select onValueChange={(value) => setFormData({...formData, topic: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a topic..." />
                      </SelectTrigger>
                      <SelectContent>
                        {topics.map((topic) => (
                          <SelectItem key={topic} value={topic}>
                            {topic}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Preferred Time */}
                  <div className="space-y-2">
                    <Label htmlFor="time">Preferred Time</Label>
                    <Select onValueChange={(value) => setFormData({...formData, preferredTime: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your preferred time..." />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Anything else you'd like us to know about your session preferences..."
                      value={formData.additionalNotes}
                      onChange={(e) => setFormData({...formData, additionalNotes: e.target.value})}
                      rows={3}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" className="w-full" size="lg">
                    <Calendar className="h-5 w-5 mr-2" />
                    Book My Session
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </section>

        {/* What to Expect */}
        <section className="py-20 bg-gradient-calm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                What to Expect
              </h2>
              <p className="text-lg text-muted-foreground">
                Here's what happens after you book your session
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 text-center">
                <CheckCircle className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Confirmation</h3>
                <p className="text-muted-foreground">
                  You'll receive a confirmation email within 24 hours with your session details and volunteer information.
                </p>
              </Card>

              <Card className="p-6 text-center">
                <User className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Meet Your Volunteer</h3>
                <p className="text-muted-foreground">
                  Connect with a trained peer supporter who understands student challenges and is here to listen.
                </p>
              </Card>

              <Card className="p-6 text-center">
                <Heart className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Safe Space</h3>
                <p className="text-muted-foreground">
                  Enjoy a confidential, judgment-free conversation focused on your well-being and support needs.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Privacy Assurance */}
        <section className="py-12 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="p-6 border-2 border-primary/20 bg-primary-soft/10">
              <div className="flex items-center gap-4">
                <Shield className="h-8 w-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Your Privacy is Protected</h3>
                  <p className="text-muted-foreground">
                    All sessions are completely confidential. Our volunteers are trained in privacy protocols, 
                    and your information is never shared without your explicit consent. Sessions are conducted 
                    in secure, private environments.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BookSession;