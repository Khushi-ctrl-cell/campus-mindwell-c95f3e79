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
    { role: "assistant", content: "Hello! I'm MindWell AI, your multilingual mental health and conversational support assistant. I'm here to provide safe, private support for mental health topics and also engage in general conversations. How are you feeling today? / ¡Hola! Soy MindWell AI. ¿Cómo te sientes hoy? / Bonjour! Comment vous sentez-vous aujourd'hui? / Hallo! Wie fühlen Sie sich heute? / नमस्ते! मैं MindWell AI हूं। आज आप कैसा महसूस कर रहे हैं?" }
  ]);

  // Enhanced AI response system with multi-language and topic detection
  const detectLanguage = (text: string): string => {
    const spanishKeywords = ['hola', 'como', 'estoy', 'siento', 'ayuda', 'gracias', 'por favor'];
    const frenchKeywords = ['bonjour', 'comment', 'je suis', 'aide', 'merci', 's\'il vous plaît'];
    const germanKeywords = ['hallo', 'wie', 'ich bin', 'hilfe', 'danke', 'bitte'];
    const hindiKeywords = ['नमस्ते', 'कैसे', 'मैं', 'हूं', 'हूँ', 'हैं', 'हो', 'मदद', 'धन्यवाद', 'कृपया', 'मुझे', 'आप'];
    
    const lowerText = text.toLowerCase();
    
    // Check for Hindi (using Devanagari script detection)
    if (hindiKeywords.some(keyword => text.includes(keyword)) || /[\u0900-\u097F]/.test(text)) return 'hi';
    if (spanishKeywords.some(keyword => lowerText.includes(keyword))) return 'es';
    if (frenchKeywords.some(keyword => lowerText.includes(keyword))) return 'fr';
    if (germanKeywords.some(keyword => lowerText.includes(keyword))) return 'de';
    
    return 'en';
  };

  const detectTopic = (message: string): 'mental-health' | 'medical' | 'general' => {
    const lowerMessage = message.toLowerCase();
    const mentalHealthKeywords = [
      'anxious', 'anxiety', 'stress', 'depressed', 'sad', 'worried', 'panic',
      'overwhelmed', 'tired', 'sleep', 'insomnia', 'lonely', 'isolated',
      'exam', 'study', 'pressure', 'feeling', 'emotion', 'cope', 'help',
      'support', 'therapy', 'counseling', 'mental health',
      // Hindi mental health keywords
      'चिंता', 'तनाव', 'उदास', 'परेशान', 'घबराहट', 'अकेला', 'नींद', 'दुखी', 'डर', 'मानसिक स्वास्थ्य'
    ];
    
    const medicalKeywords = [
      'doctor', 'medicine', 'treatment', 'symptoms', 'pain', 'headache', 'fever',
      'illness', 'disease', 'medication', 'hospital', 'health', 'medical',
      // Hindi medical keywords  
      'डॉक्टर', 'दवा', 'इलाज', 'लक्षण', 'दर्द', 'सिरदर्द', 'बुखार', 'बीमारी', 'स्वास्थ्य', 'अस्पताल', 'चिकित्सा'
    ];
    
    if (mentalHealthKeywords.some(keyword => lowerMessage.includes(keyword) || message.includes(keyword))) return 'mental-health';
    if (medicalKeywords.some(keyword => lowerMessage.includes(keyword) || message.includes(keyword))) return 'medical';
    return 'general';
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
      'mich umbringen', 'selbstmord', 'sterben will', 'mir schaden',
      // Hindi crisis keywords
      'आत्महत्या', 'मरना चाहता', 'खुद को मारना', 'जीना नहीं', 'खुद को नुकसान', 'मरने का मन'
    ];
    
    if (crisisKeywords.some(keyword => lowerMessage.includes(keyword) || userMessage.includes(keyword))) {
      const crisisResponses = {
        en: "I'm very concerned about what you've shared. Please reach out for immediate help:\n\n🚨 Emergency: Call 911\n📞 Crisis Text Line: Text HOME to 741741\n☎️ National Suicide Prevention Lifeline: 988\n\nYour life has value and there are people who want to help.",
        es: "Estoy muy preocupado/a por lo que has compartido. Por favor busca ayuda inmediata:\n\n🚨 Emergencia: Llama al 911\n📞 Línea de Crisis: Envía HOLA al 741741\n☎️ Línea Nacional de Prevención del Suicidio: 988\n\nTu vida tiene valor.",
        fr: "Je suis très préoccupé par ce que vous avez partagé. Veuillez chercher de l'aide immédiate:\n\n🚨 Urgence: Appelez le 911\n📞 Ligne de crise: Envoyez ACCUEIL au 741741\n\nVotre vie a de la valeur.",
        de: "Ich bin sehr besorgt über das, was Sie geteilt haben. Bitte suchen Sie sofort Hilfe:\n\n🚨 Notfall: Rufen Sie 911 an\n📞 Krisenlinie: Senden Sie HEIMAT an 741741\n\nIhr Leben hat Wert.",
        hi: "आपने जो साझा किया है उससे मैं बहुत चिंतित हूं। कृपया तुरंत मदद लें:\n\n🚨 आपातकाल: 911 कॉल करें\n📞 क्राइसिस हेल्पलाइन: 1075\n☎️ मानसिक स्वास्थ्य हेल्पलाइन: +91-9152987821\n\nआपकी जिंदगी महत्वपूर्ण है और लोग आपकी मदद करना चाहते हैं।"
      };
      
      return crisisResponses[language as keyof typeof crisisResponses] || crisisResponses.en;
    }

    if (topic === 'mental-health') {
      if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || userMessage.includes('चिंता') || userMessage.includes('घबराहट')) {
        const responses = {
          en: "I understand you're feeling anxious. Try the 5-4-3-2-1 grounding technique: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. Deep breathing also helps. What's causing your anxiety?",
          es: "Entiendo que te sientes ansioso/a. Prueba la técnica 5-4-3-2-1: Nombra 5 cosas que ves, 4 que puedes tocar, 3 que escuchas, 2 que hueles, 1 que saboreas. ¿Qué está causando tu ansiedad?",
          fr: "Je comprends que vous vous sentez anxieux. Essayez la technique 5-4-3-2-1: Nommez 5 choses que vous voyez, 4 que vous touchez, 3 que vous entendez, 2 que vous sentez, 1 que vous goûtez.",
          de: "Ich verstehe, dass Sie sich ängstlich fühlen. Versuchen Sie die 5-4-3-2-1-Technik: Nennen Sie 5 Dinge, die Sie sehen, 4, die Sie berühren können, 3, die Sie hören, 2, die Sie riechen, 1, das Sie schmecken.",
          hi: "मैं समझ सकता हूं कि आप चिंतित महसूस कर रहे हैं। 5-4-3-2-1 ग्राउंडिंग तकनीक आज़माएं: 5 चीजों के नाम बताएं जो आप देख सकते हैं, 4 जिन्हें छू सकते हैं, 3 जो सुन सकते हैं, 2 जिन्हें सूंघ सकते हैं, 1 जिसका स्वाद ले सकते हैं। गहरी सांस लेना भी मदद करता है। आपकी चिंता का कारण क्या है?"
        };
        
        return responses[language as keyof typeof responses] || responses.en;
      }
      
      const mentalHealthResponses = {
        en: "Thank you for sharing with me. Your feelings are valid and it's important you're reaching out. I'm here to listen and support you. Would you like to explore some coping strategies?",
        es: "Gracias por compartir conmigo. Tus sentimientos son válidos y es importante que busques apoyo. Estoy aquí para escucharte. ¿Te gustaría explorar algunas estrategias de afrontamiento?",
        fr: "Merci de partager avec moi. Vos sentiments sont valides et il est important que vous cherchiez du soutien. Je suis là pour vous écouter.",
        de: "Danke, dass Sie das mit mir geteilt haben. Ihre Gefühle sind berechtigt und es ist wichtig, dass Sie Unterstützung suchen. Ich bin hier, um zuzuhören.",
        hi: "मेरे साथ साझा करने के लिए धन्यवाद। आपकी भावनाएं सही हैं और यह महत्वपूर्ण है कि आप मदद मांग रहे हैं। मैं यहां सुनने और आपका साथ देने के लिए हूं। क्या आप कुछ मुकाबला करने की रणनीतियों पर चर्चा करना चाहेंगे?"
      };
      
      return mentalHealthResponses[language as keyof typeof mentalHealthResponses] || mentalHealthResponses.en;
    } else if (topic === 'medical') {
      const medicalResponses = {
        en: "I understand you have health-related concerns. While I can provide general wellness information and emotional support, I strongly recommend consulting with a qualified healthcare professional for medical advice. Your health is important. Is there anything specific you'd like to discuss about how you're feeling?",
        es: "Entiendo que tienes preocupaciones relacionadas con la salud. Aunque puedo proporcionar información general de bienestar y apoyo emocional, recomiendo encarecidamente consultar con un profesional de la salud calificado para obtener consejos médicos. Tu salud es importante. ¿Hay algo específico que te gustaría discutir sobre cómo te sientes?",
        fr: "Je comprends que vous avez des préoccupations liées à la santé. Bien que je puisse fournir des informations générales sur le bien-être et un soutien émotionnel, je recommande fortement de consulter un professionnel de la santé qualifié pour des conseils médicaux. Votre santé est importante.",
        de: "Ich verstehe, dass Sie gesundheitsbezogene Bedenken haben. Obwohl ich allgemeine Wellness-Informationen und emotionale Unterstützung bieten kann, empfehle ich dringend, einen qualifizierten Gesundheitsexperten für medizinische Beratung zu konsultieren. Ihre Gesundheit ist wichtig.",
        hi: "मैं समझता हूं कि आपको स्वास्थ्य संबंधी चिंताएं हैं। जबकि मैं सामान्य कल्याण जानकारी और भावनात्मक सहायता प्रदान कर सकता हूं, मैं दृढ़ता से सुझाता हूं कि चिकित्सा सलाह के लिए किसी योग्य स्वास्थ्य पेशेवर से सलाह लें। आपका स्वास्थ्य महत्वपूर्ण है। क्या आप अपनी भावनाओं के बारे में कुछ खास चर्चा करना चाहेंगे?"
      };
      
      return medicalResponses[language as keyof typeof medicalResponses] || medicalResponses.en;
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
        ],
        hi: [
          "यह दिलचस्प है! मैं मानसिक स्वास्थ्य सहायता और सामान्य बातचीत दोनों के लिए यहां हूं। आज आप कैसा महसूस कर रहे हैं?",
          "साझा करने के लिए धन्यवाद! जबकि मैं मानसिक स्वास्थ्य सहायता के लिए डिज़ाइन किया गया हूं, मुझे विभिन्न विषयों पर चर्चा करना अच्छा लगता है। क्या आपके मन में कोई बात है?"
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
              {["I'm feeling anxious", "I'm stressed about exams", "I need someone to talk to", "I'm having trouble sleeping", "¡Hola! ¿Cómo estás?", "Bonjour, comment ça va?", "मुझे चिंता हो रही है", "डॉक्टर से मिलना है", "नमस्ते! आप कैसे हैं?"].map((topic) => (
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