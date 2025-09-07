import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Shield, Clock } from "lucide-react";
import DOMPurify from "dompurify";

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "Hi! I'm Campus MindWell, your mental health friend. 🤗 Let's do a quick check-in - on a scale of 1-10, how's your mood today? I'm here for everything from casual chats to serious support. मैं आपका साथी हूं। आप कैसा महसूस कर रहे हैं?",
      timestamp: new Date()
    }
  ]);

  const detectLanguage = (text: string): string => {
    const spanishKeywords = ['hola', 'como', 'estoy', 'siento', 'ayuda', 'gracias'];
    const frenchKeywords = ['bonjour', 'comment', 'je suis', 'aide', 'merci'];
    const germanKeywords = ['hallo', 'wie', 'ich bin', 'hilfe', 'danke'];
    
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
      'exam', 'study', 'pressure', 'feeling', 'emotion', 'cope', 'help'
    ];
    
    return mentalHealthKeywords.some(keyword => lowerMessage.includes(keyword)) 
      ? 'mental-health' 
      : 'general';
  };

  const getAIResponse = (userMessage: string): string => {
    const language = detectLanguage(userMessage);
    const topic = detectTopic(userMessage);
    const lowerMessage = userMessage.toLowerCase();
    
    // Crisis detection for Indian context
    const crisisKeywords = [
      'kill myself', 'suicide', 'end it all', 'want to die', 'hurt myself', 'self harm',
      'आत्महत्या', 'मरना चाहता', 'मरना चाहती', 'खुद को मारना', 'जीना नहीं चाहता'
    ];
    
    if (crisisKeywords.some(keyword => lowerMessage.includes(keyword) || userMessage.includes(keyword))) {
      return "🚨 **IMMEDIATE SUPPORT NEEDED** - I'm very concerned about you. Please reach out right now:\n\n📞 **iCall**: 9152987821 (24/7)\n📞 **AASRA**: 91-9820466726 (24/7)\n📞 **Vandrevala Foundation**: 9999 666 555\n📞 **Emergency**: 112\n\n🏥 Your college counselor is available too. Your life matters deeply. You're not alone.";
    }
    
    if (topic === 'mental-health') {
      const responses = {
        en: "I hear you, and I'm glad you're reaching out. College mental health is so important. Here's some quick support:\n\n1. Your feelings are completely valid\n2. Remember: You're more than your grades or performance\n3. Your college counselor is there for you (usually free!)\n4. **Crisis support**: 1800-599-0019 available 24/7\n\n**Disclaimer**: I provide support, not medical advice. For professional help, please contact your college counselor.\n\nWant to tell me more about what's going on?",
        hi: "मैं आपकी बात सुन रहा हूं, और खुशी है कि आप मदद मांग रहे हैं। कॉलेज में मानसिक स्वास्थ्य बहुत महत्वपूर्ण है:\n\n1. आपकी भावनाएं बिल्कुल सही हैं\n2. याद रखें: आप अपने नंबरों से कहीं ज्यादा हैं\n3. आपका कॉलेज काउंसलर आपके लिए है (आमतौर पर मुफ़्त!)\n4. **क्राइसिस सपोर्ट**: 1800-599-0019 (24/7)\n\n**अस्वीकरण**: मैं सहायता प्रदान करता हूं, चिकित्सा सलाह नहीं।\n\nक्या आप और बताना चाहेंगे कि क्या हो रहा है?"
      };
      
      return responses[language as keyof typeof responses] || responses.en;
    } else {
      const responses = {
        en: [
          "That's cool to chat about! As Campus MindWell, I'm here for both everyday conversations and mental health check-ins. How are you feeling overall today?",
          "Thanks for sharing! I love connecting with students. College life has its ups and downs - how are you handling everything lately?",
          "Nice topic! I'm here for whatever you need - light conversation or deeper support. Anything weighing on your mind today?"
        ],
        hi: [
          "इस बारे में बात करना अच्छा है! Campus MindWell के रूप में, मैं रोज़ाना की बातचीत और मानसिक स्वास्थ्य दोनों के लिए यहां हूं। आज आप कैसा महसूस कर रहे हैं?",
          "साझा करने के लिए धन्यवाद! मुझे छात्रों से जुड़ना अच्छा लगता है। कॉलेज जीवन में उतार-चढ़ाव होते हैं - आप सब कुछ कैसे संभाल रहे हैं?"
        ]
      };
      
      const langResponses = responses[language as keyof typeof responses] || responses.en;
      return langResponses[Math.floor(Math.random() * langResponses.length)];
    }
  };
  const [inputValue, setInputValue] = useState("");

  const quickActions = [
    "Mood check: I'm feeling 3/10 today",
    "Exam stress is overwhelming",
    "Family pressure about grades",
    "Can't sleep - racing thoughts",
    "Feeling isolated from classmates",
    "Need coping strategies for anxiety",
    "नमस्ते! मुझे चिंता हो रही है",
    "मैं पढ़ाई का तनाव महसूस कर रहा हूं"
  ];

  const handleSendMessage = () => {
    const raw = inputValue;
    const sanitized = DOMPurify.sanitize(raw, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim();
    if (!sanitized) return;

    const newMessage = {
      id: messages.length + 1,
      type: "user",
      content: sanitized,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // Simulate bot response with enhanced AI
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: "bot",
        content: getAIResponse(sanitized),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleQuickAction = (action: string) => {
    setInputValue(action);
  };

  return (
    <section className="py-20 bg-gradient-soft">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Multilingual AI Mental Health Support
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get immediate, confidential support through our AI-powered chat system designed for both mental health support and general conversation in multiple languages.
            </p>
          
          {/* Privacy Indicators */}
          <div className="flex justify-center gap-6 pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-primary" />
              <span>End-to-end encrypted</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" />
              <span>Available 24/7</span>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <Card className="shadow-card border border-border/50 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-hero text-primary-foreground p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Campus MindWell</h3>
                <p className="text-xs opacity-90">Your Mental Health Friend • Private & Safe</p>
              </div>
              <Badge variant="secondary" className="ml-auto bg-white/20 text-primary-foreground border-white/30">
                Online
              </Badge>
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.type === "bot" && (
                  <div className="w-8 h-8 bg-primary-soft rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-sm p-3 rounded-lg ${
                    message.type === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                {message.type === "user" && (
                  <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-accent" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t border-border">
            <div className="mb-3">
              <p className="text-sm text-muted-foreground mb-2">Quick responses:</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action)}
                    className="text-xs"
                  >
                    {action}
                  </Button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Type your message here..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} className="px-4">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Enhanced Disclaimer */}
        <div className="text-center text-xs text-muted-foreground mt-6 max-w-3xl mx-auto space-y-2">
          <p className="font-medium">🛡️ Your Privacy: All chats are confidential and never shared</p>
          <p>⚕️ **Medical Disclaimer**: Campus MindWell provides supportive guidance, not medical advice. For professional help, contact your college counselor.</p>
          <p>🚨 **Crisis Support**: If you're in immediate danger, call 112 or contact: iCall (9152987821), AASRA (91-9820466726)</p>
        </div>
      </div>
    </section>
  );
};

export default ChatInterface;