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
    { role: "assistant", content: "Hello! I'm MindWell AI, your multilingual mental health and conversational support assistant. I'm here to provide safe, private support for mental health topics and also engage in general conversations. How are you feeling today? / ¡Hola! Soy MindWell AI. ¿Cómo te sientes hoy? / Bonjour! Comment vous sentez-vous aujourd'hui? / Hallo! Wie fühlen Sie sich heute?" }
  ]);

  // Enhanced AI response system with multi-language and topic detection
  const detectLanguage = (text: string): string => {
    const spanishKeywords = ['hola', 'como', 'estoy', 'siento', 'ayuda', 'gracias', 'por favor'];
    const frenchKeywords = ['bonjour', 'comment', 'je suis', 'aide', 'merci', 's\'il vous plaît'];
    const germanKeywords = ['hallo', 'wie', 'ich bin', 'hilfe', 'danke', 'bitte'];
    
    const lowerText = text.toLowerCase();
    
    if (spanishKeywords.some(keyword => lowerText.includes(keyword))) return 'es';
    if (frenchKeywords.some(keyword => lowerText.includes(keyword))) return 'fr';
    if (germanKeywords.some(keyword => lowerText.includes(keyword))) return 'de';
    
    return 'en';
  };

  const detectTopic = (message: string): 'mental-health' | 'general' => {
    const lowerMessage = message.toLowerCase();
    const mentalHealthKeywords = [
      'anxious', 'anxiety', 'stress', 'depressed', 'sad', 'worried', 'panic',
      'overwhelmed', 'tired', 'sleep', 'insomnia', 'lonely', 'isolated',
      'exam', 'study', 'pressure', 'feeling', 'emotion', 'cope', 'help',
      'support', 'therapy', 'counseling', 'mental health'
    ];
    
    return mentalHealthKeywords.some(keyword => lowerMessage.includes(keyword)) 
      ? 'mental-health' 
      : 'general';
  };

  const getAIResponse = (userMessage: string): string => {
    const language = detectLanguage(userMessage);
    const topic = detectTopic(userMessage);
    const lowerMessage = userMessage.toLowerCase();
    
    // Crisis detection
    const crisisKeywords = [
      'kill myself', 'suicide', 'end it all', 'want to die', 'hurt myself', 'self harm',
      'matarme', 'suicidio', 'quiero morir', 'hacerme daño',
      'me tuer', 'suicide', 'veux mourir', 'me faire du mal',
      'mich umbringen', 'selbstmord', 'sterben will', 'mir schaden'
    ];
    
    if (crisisKeywords.some(keyword => lowerMessage.includes(keyword))) {
      const crisisResponses = {
        en: "I'm very concerned about what you've shared. Please reach out for immediate help:\n\n🚨 Emergency: Call 911\n📞 Crisis Text Line: Text HOME to 741741\n☎️ National Suicide Prevention Lifeline: 988\n\nYour life has value and there are people who want to help.",
        es: "Estoy muy preocupado/a por lo que has compartido. Por favor busca ayuda inmediata:\n\n🚨 Emergencia: Llama al 911\n📞 Línea de Crisis: Envía HOLA al 741741\n☎️ Línea Nacional de Prevención del Suicidio: 988\n\nTu vida tiene valor.",
        fr: "Je suis très préoccupé par ce que vous avez partagé. Veuillez chercher de l'aide immédiate:\n\n🚨 Urgence: Appelez le 911\n📞 Ligne de crise: Envoyez ACCUEIL au 741741\n\nVotre vie a de la valeur.",
        de: "Ich bin sehr besorgt über das, was Sie geteilt haben. Bitte suchen Sie sofort Hilfe:\n\n🚨 Notfall: Rufen Sie 911 an\n📞 Krisenlinie: Senden Sie HEIMAT an 741741\n\nIhr Leben hat Wert."
      };
      
      return crisisResponses[language as keyof typeof crisisResponses] || crisisResponses.en;
    }

    if (topic === 'mental-health') {
      if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety')) {
        const responses = {
          en: "I understand you're feeling anxious. Try the 5-4-3-2-1 grounding technique: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. Deep breathing also helps. What's causing your anxiety?",
          es: "Entiendo que te sientes ansioso/a. Prueba la técnica 5-4-3-2-1: Nombra 5 cosas que ves, 4 que puedes tocar, 3 que escuchas, 2 que hueles, 1 que saboreas. ¿Qué está causando tu ansiedad?",
          fr: "Je comprends que vous vous sentez anxieux. Essayez la technique 5-4-3-2-1: Nommez 5 choses que vous voyez, 4 que vous touchez, 3 que vous entendez, 2 que vous sentez, 1 que vous goûtez.",
          de: "Ich verstehe, dass Sie sich ängstlich fühlen. Versuchen Sie die 5-4-3-2-1-Technik: Nennen Sie 5 Dinge, die Sie sehen, 4, die Sie berühren können, 3, die Sie hören, 2, die Sie riechen, 1, das Sie schmecken."
        };
        
        return responses[language as keyof typeof responses] || responses.en;
      }
      
      const mentalHealthResponses = {
        en: "Thank you for sharing with me. Your feelings are valid and it's important you're reaching out. I'm here to listen and support you. Would you like to explore some coping strategies?",
        es: "Gracias por compartir conmigo. Tus sentimientos son válidos y es importante que busques apoyo. Estoy aquí para escucharte. ¿Te gustaría explorar algunas estrategias de afrontamiento?",
        fr: "Merci de partager avec moi. Vos sentiments sont valides et il est important que vous cherchiez du soutien. Je suis là pour vous écouter.",
        de: "Danke, dass Sie das mit mir geteilt haben. Ihre Gefühle sind berechtigt und es ist wichtig, dass Sie Unterstützung suchen. Ich bin hier, um zuzuhören."
      };
      
      return mentalHealthResponses[language as keyof typeof mentalHealthResponses] || mentalHealthResponses.en;
    } else {
      const generalResponses = {
        en: [
          "That's interesting! I'm here for both mental health support and general conversation. How are you feeling today?",
          "Thanks for sharing! While I'm designed for mental health support, I enjoy chatting about various topics. Is there anything on your mind?",
          "I appreciate our conversation! I'm here to support you whether you need emotional guidance or just want to chat."
        ],
        es: [
          "¡Qué interesante! Estoy aquí tanto para apoyo en salud mental como para conversación general. ¿Cómo te sientes hoy?",
          "¡Gracias por compartir! Aunque estoy diseñado para apoyo en salud mental, disfruto charlando sobre varios temas. ¿Hay algo en tu mente?"
        ],
        fr: [
          "C'est intéressant! Je suis là pour le soutien en santé mentale et la conversation générale. Comment vous sentez-vous aujourd'hui?",
          "Merci de partager! Bien que je sois conçu pour le soutien en santé mentale, j'aime discuter de divers sujets."
        ],
        de: [
          "Das ist interessant! Ich bin sowohl für psychische Gesundheit als auch für allgemeine Gespräche da. Wie fühlen Sie sich heute?",
          "Danke fürs Teilen! Obwohl ich für psychische Gesundheit entwickelt wurde, spreche ich gerne über verschiedene Themen."
        ]
      };
      
      const langResponses = generalResponses[language as keyof typeof generalResponses] || generalResponses.en;
      return langResponses[Math.floor(Math.random() * langResponses.length)];
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, { role: "user", content: message }]);
      const userMessage = message;
      setMessage("");
      
      // Generate contextual AI response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: getAIResponse(userMessage)
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
                Available 24/7 to listen, understand, and guide you. Now supporting multiple languages for better accessibility.
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
              {["I'm feeling anxious", "I'm stressed about exams", "I need someone to talk to", "I'm having trouble sleeping", "¡Hola! ¿Cómo estás?", "Bonjour, comment ça va?"].map((topic) => (
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