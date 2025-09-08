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
      content: "Hello! I'm Campus MindWell, your friendly AI companion. 🤗 I'm here to chat about anything - from daily stress to mental health support, study tips, or just casual conversation. How are you feeling today? मैं आपका मित्र हूं, आप कैसा महसूस कर रहे हैं?",
      timestamp: new Date()
    }
  ]);

  const detectLanguage = (text: string): string => {
    const hindiKeywords = ['नमस्ते', 'मैं', 'हूं', 'हूँ', 'कैसे', 'क्या', 'आप', 'मुझे', 'चिंता', 'तनाव', 'परेशान', 'दुखी', 'खुश', 'ठीक', 'अच्छा'];
    const bengaliKeywords = ['আমি', 'কেমন', 'আছি', 'ভালো', 'খারাপ', 'চিন্তা', 'সমস্যা'];
    const teluguKeywords = ['నాకు', 'ఎలా', 'ఉన్నాను', 'బాగా', 'చెడ్డ', 'సమస్య'];
    const tamilKeywords = ['எனக்கு', 'எப்படி', 'இருக்கிறேன்', 'நல்ல', 'கெட்ட', 'பிரச்சனை'];
    const gujaratiKeywords = ['મને', 'કેવી', 'છું', 'સારું', 'ખરાબ', 'સમસ્યા'];
    const marathiKeywords = ['मला', 'कसे', 'आहे', 'चांगले', 'वाईट', 'समस्या'];
    const kannadaKeywords = ['ನನಗೆ', 'ಹೇಗೆ', 'ಇದ್ದೇನೆ', 'ಒಳ್ಳೆಯದು', 'ಕೆಟ್ಟದು'];
    const malayalamKeywords = ['എനിക്ക്', 'എങ്ങനെ', 'ഉണ്ട്', 'നല്ലത്', 'മോശം'];
    const punjabiKeywords = ['ਮੈਨੂੰ', 'ਕਿਵੇਂ', 'ਹਾਂ', 'ਚੰਗਾ', 'ਮਾੜਾ'];
    const urduKeywords = ['میں', 'کیسے', 'ہوں', 'اچھا', 'برا', 'پریشان'];
    
    const lowerText = text.toLowerCase();
    
    if (hindiKeywords.some(keyword => text.includes(keyword) || lowerText.includes(keyword))) return 'hi';
    if (bengaliKeywords.some(keyword => text.includes(keyword))) return 'bn';
    if (teluguKeywords.some(keyword => text.includes(keyword))) return 'te';
    if (tamilKeywords.some(keyword => text.includes(keyword))) return 'ta';
    if (gujaratiKeywords.some(keyword => text.includes(keyword))) return 'gu';
    if (marathiKeywords.some(keyword => text.includes(keyword))) return 'mr';
    if (kannadaKeywords.some(keyword => text.includes(keyword))) return 'kn';
    if (malayalamKeywords.some(keyword => text.includes(keyword))) return 'ml';
    if (punjabiKeywords.some(keyword => text.includes(keyword))) return 'pa';
    if (urduKeywords.some(keyword => text.includes(keyword))) return 'ur';
    
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
      'आत्महत्या', 'मरना चाहता', 'मरना चाहती', 'खुद को मारना', 'जीना नहीं चाहता',
      'মরতে চাই', 'আত্মহত্যা', 'చావాలని', 'ആത്മഹത്യ', 'ಸಾಯಬೇಕು', 'મરવું', 'मरायचे'
    ];
    
    if (crisisKeywords.some(keyword => lowerMessage.includes(keyword) || userMessage.includes(keyword))) {
      return "🚨 **IMMEDIATE SUPPORT NEEDED** - I'm very concerned about you. Please reach out right now:\n\n📞 **iCall**: 9152987821 (24/7)\n📞 **AASRA**: 91-9820466726 (24/7)\n📞 **Vandrevala Foundation**: 9999 666 555\n📞 **Emergency**: 112\n\n🏥 Your college counselor is available too. **Reminder: I'm not a doctor. For emergencies, please reach a professional or helpline.** Your life matters deeply.";
    }
    
    if (topic === 'mental-health') {
      const responses = {
        en: "I'm here to listen and support you. Here are some gentle steps that might help:\n\n**Quick Support:**\n1. Take 3 deep breaths right now\n2. Your feelings are completely valid\n3. You're stronger than you think\n4. Consider talking to your college counselor (usually free!)\n\n**Remember:** I'm not a doctor. For serious concerns, please reach a professional or helpline (iCall: 9152987821).\n\nWant to share more about how you're feeling?",
        hi: "मैं आपकी बात सुनने और आपका साथ देने के लिए यहां हूं। यहां कुछ सरल कदम हैं जो मदद कर सकते हैं:\n\n**तुरंत सहायता:**\n1. अभी 3 गहरी सांसें लें\n2. आपकी भावनाएं बिल्कुल सही हैं\n3. आप अपने से कहीं ज्यादा मजबूत हैं\n4. अपने कॉलेज काउंसलर से बात करने पर विचार करें\n\n**याद रखें:** मैं डॉक्टर नहीं हूं। गंभीर चिंताओं के लिए, कृपया किसी पेशेवर या हेल्पलाइन से संपर्क करें।\n\nआप कैसा महसूस कर रहे हैं, और बताना चाहेंगे?",
        bn: "আমি আপনার কথা শুনতে এবং সাহায্য করতে এখানে আছি। এখানে কিছু সহজ পদক্ষেপ যা সাহায্য করতে পারে:\n\n**দ্রুত সহায়তা:**\n1. এখনই ৩টি গভীর শ্বাস নিন\n2. আপনার অনুভূতি সম্পূর্ণ বৈধ\n3. আপনি নিজের চেয়ে অনেক শক্তিশালী\n\n**মনে রাখবেন:** আমি ডাক্তার নই। গুরুতর সমস্যার জন্য পেশাদার সাহায্য নিন।",
        te: "నేను మీ మాట వినడానికి మరియు మీకు సహాయం చేయడానికి ఇక్కడ ఉన్నాను:\n\n**త్వరిత సహాయం:**\n1. ఇప్పుడే 3 లోతైన శ్వాసలు తీసుకోండి\n2. మీ భావనలు పూర్తిగా సరైనవి\n3. మీరు అనుకున్నదానికంటే బలంగా ఉన్నారు\n\n**గుర్తుంచుకోండి:** నేను వైద్యుడిని కాదు। తీవ్రమైన సమస్యలకు వైద్య సహాయం తీసుకోండి।",
        ta: "நான் உங்கள் பேச்சைக் கேட்க இங்கே இருக்கிறேன்:\n\n**உடனடி உதவி:**\n1. இப்போதே 3 ஆழமான மூச்சுகள் எடுங்கள்\n2. உங்கள் உணர்வுகள் முற்றிலும் சரியானவை\n3. நீங்கள் நினைப்பதை விட வலிமையானவர்\n\n**நினைவில் கொள்ளுங்கள்:** நான் டாக்டர் அல்ல। தீவிர கவலைகளுக்கு தொழில்முறை உதவி பெறுங்கள்।"
      };
      
      return responses[language as keyof typeof responses] || responses.en;
    } else {
      const responses = {
        en: [
          "That's interesting! I'm Campus MindWell, and I love chatting about anything. How's college treating you lately?",
          "Thanks for sharing! I'm here for both casual conversations and support when needed. What's on your mind today?",
          "Cool topic! I enjoy connecting with students about all sorts of things. How are you feeling overall?",
          "Nice! As your AI companion, I'm curious about your thoughts. Anything exciting or challenging happening in your life?"
        ],
        hi: [
          "यह दिलचस्प है! मैं Campus MindWell हूं, और मुझे किसी भी बारे में बात करना अच्छा लगता है। कॉलेज कैसा चल रहा है?",
          "साझा करने के लिए धन्यवाद! मैं आकस्मिक बातचीत और जरूरत पड़ने पर सहायता दोनों के लिए यहां हूं। आज आपके मन में क्या है?",
          "बढ़िया विषय! मुझे छात्रों से हर तरह की बातों के बारे में बात करना अच्छा लगता है। आप कैसा महसूस कर रहे हैं?"
        ]
      };
      
      const langResponses = responses[language as keyof typeof responses] || responses.en;
      return langResponses[Math.floor(Math.random() * langResponses.length)] + "\n\n**Reminder:** I'm not a doctor. For medical concerns, please consult a professional.";
    }
  };
  const [inputValue, setInputValue] = useState("");

  const quickActions = [
    "How can I manage exam stress?",
    "I'm feeling anxious about my future",
    "Need tips for better sleep",
    "Feeling lonely in college",
    "How to deal with family expectations?",
    "Quick breathing exercise please",
    "नमस्ते! मुझे चिंता हो रही है",
    "পরীক্ষার চাপ সামলাতে পারছি না",
    "तनाव कम कैसे करें?",
    "కాలేజ్ లో ఒంటరిగా అనిపిస్తుంది"
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
              Campus MindWell - Your AI Mental Health Companion
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A friendly AI chat buddy for college students providing mental health support, emotional care, and simple guidance in your preferred language.
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