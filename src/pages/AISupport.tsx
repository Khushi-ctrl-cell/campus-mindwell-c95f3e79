import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { MessageCircle, Send, Bot, Shield, Clock, Heart } from "lucide-react";

const AISupport = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm MindWell AI. I'm here to provide you with safe, private mental health support. How are you feeling today?" }
  ]);

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, { role: "user", content: message }]);
      setMessage("");
      
      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: "Thank you for sharing with me. I'm here to listen and support you. Can you tell me more about what's on your mind?" 
        }]);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="py-12 bg-gradient-calm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-6">
              <div className="flex justify-center mb-6">
                <Bot className="h-16 w-16 text-primary animate-float" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
                Talk to MindWell AI
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Get instant, private, and safe mental health support powered by AI. 
                Available 24/7 to listen, understand, and guide you.
              </p>
            </div>
          </div>
        </section>

        {/* Chat Interface */}
        <section className="py-8 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Safety Disclaimer */}
            <Card className="p-4 mb-6 border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-800 dark:text-amber-200">
                  <p className="font-medium mb-1">Important Safety Notice</p>
                  <p>This AI provides supportive conversation but is not a substitute for professional mental health care. If you're experiencing a crisis, please contact emergency services or your local crisis hotline immediately.</p>
                </div>
              </div>
            </Card>

            {/* Chat Messages */}
            <Card className="p-6 mb-6 h-96 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.role === "user" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Input Area */}
            <div className="flex gap-2">
              <Input
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
              />
              <Button onClick={handleSend}>
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-3">Quick topics to get started:</p>
              <div className="flex flex-wrap gap-2">
                {["I'm feeling anxious", "I'm stressed about exams", "I need someone to talk to", "I'm having trouble sleeping"].map((topic) => (
                  <Button
                    key={topic}
                    variant="outline"
                    size="sm"
                    onClick={() => setMessage(topic)}
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-calm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                AI Support Features
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 text-center">
                <Clock className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">24/7 Availability</h3>
                <p className="text-muted-foreground">Always here when you need support, day or night.</p>
              </Card>

              <Card className="p-6 text-center">
                <Shield className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Complete Privacy</h3>
                <p className="text-muted-foreground">Your conversations are private and confidential.</p>
              </Card>

              <Card className="p-6 text-center">
                <Heart className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Empathetic Responses</h3>
                <p className="text-muted-foreground">Trained to understand and respond with care.</p>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AISupport;