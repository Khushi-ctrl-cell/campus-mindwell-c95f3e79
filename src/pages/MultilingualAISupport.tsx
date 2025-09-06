import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Bot, Send, Globe, AlertTriangle, Phone, Heart, MessageCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  language: string;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const INDIAN_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' }
];

const CRISIS_HELPLINES = {
  en: {
    title: "🚨 EMERGENCY HELPLINES - Please reach out for immediate help:",
    lines: [
      "iCall (24/7): 9152987821",
      "AASRA (24/7): 91-9820466726", 
      "Vandrevala Foundation (24/7): 9999 666 555",
      "Sneha (Chennai): 044-24640050",
      "Sumaitri (Delhi): 011-23389090",
      "National Emergency: 112"
    ]
  },
  hi: {
    title: "🚨 आपातकालीन हेल्पलाइन - तुरंत सहायता के लिए संपर्क करें:",
    lines: [
      "iCall (24/7): 9152987821",
      "AASRA (24/7): 91-9820466726",
      "Vandrevala Foundation (24/7): 9999 666 555", 
      "स्नेहा (चेन्नई): 044-24640050",
      "सुमैत्री (दिल्ली): 011-23389090",
      "राष्ट्रीय आपातकाल: 112"
    ]
  }
  // Add more languages as needed
};

const CULTURAL_RESPONSES = {
  en: {
    greeting: "Namaste! I'm here to support you with mental health guidance tailored for Indian culture and context. How can I help you today?",
    disclaimer: "⚠️ Disclaimer: This is AI-generated guidance and not a substitute for professional medical advice. Please consult a certified mental health professional or doctor for proper treatment.",
    family_stress: "I understand family expectations and relationships can be challenging in Indian society. Remember, your mental health matters too.",
    work_pressure: "Work-life balance is important. Many Indians face career pressure - you're not alone in this struggle."
  },
  hi: {
    greeting: "नमस्ते! मैं भारतीय संस्कृति और संदर्भ के अनुकूल मानसिक स्वास्थ्य मार्गदर्शन के साथ आपका समर्थन करने के लिए यहाँ हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?",
    disclaimer: "⚠️ अस्वीकरण: यह AI-जनित मार्गदर्शन है और पेशेवर चिकित्सा सलाह का विकल्प नहीं है। उचित उपचार के लिए कृपया किसी प्रमाणित मानसिक स्वास्थ्य पेशेवर या डॉक्टर से सलाह लें।",
    family_stress: "मैं समझता हूँ कि भारतीय समाज में पारिवारिक अपेक्षाएं और रिश्ते चुनौतीपूर्ण हो सकते हैं। याद रखें, आपका मानसिक स्वास्थ्य भी महत्वपूर्ण है।",
    work_pressure: "कार्य-जीवन संतुलन महत्वपूर्ण है। कई भारतीय करियर के दबाव का सामना करते हैं - आप इस संघर्ष में अकेले नहीं हैं।"
  }
};

const MultilingualAISupport: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [isLoading, setIsLoading] = useState(false);
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Add welcome message when component mounts
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: CULTURAL_RESPONSES[selectedLanguage as keyof typeof CULTURAL_RESPONSES]?.greeting || CULTURAL_RESPONSES.en.greeting,
      sender: 'bot',
      timestamp: new Date(),
      language: selectedLanguage
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const detectLanguage = (text: string): string => {
    const hindiPattern = /[\u0900-\u097F]/;
    const bengaliPattern = /[\u0980-\u09FF]/;
    const teluguPattern = /[\u0C00-\u0C7F]/;
    const tamilPattern = /[\u0B80-\u0BFF]/;
    const gujaratiPattern = /[\u0A80-\u0AFF]/;
    const kannadaPattern = /[\u0C80-\u0CFF]/;
    const malayalamPattern = /[\u0D00-\u0D7F]/;
    const urduPattern = /[\u0600-\u06FF]/;

    if (hindiPattern.test(text)) return 'hi';
    if (bengaliPattern.test(text)) return 'bn';
    if (teluguPattern.test(text)) return 'te';
    if (tamilPattern.test(text)) return 'ta';
    if (gujaratiPattern.test(text)) return 'gu';
    if (kannadaPattern.test(text)) return 'kn';
    if (malayalamPattern.test(text)) return 'ml';
    if (urduPattern.test(text)) return 'ur';
    
    return 'en';
  };

  const detectCrisisKeywords = (text: string): boolean => {
    const crisisKeywords = [
      // English
      'suicide', 'kill myself', 'end my life', 'want to die', 'self harm', 'hurt myself', 'no point living',
      // Hindi
      'आत्महत्या', 'खुद को मारना', 'जीवन समाप्त', 'मरना चाहता', 'खुद को नुकसान',
      // Add more crisis keywords for other languages
    ];

    return crisisKeywords.some(keyword => text.toLowerCase().includes(keyword.toLowerCase()));
  };

  const generateMentalHealthResponse = (userMessage: string, detectedLang: string): string => {
    const isCrisis = detectCrisisKeywords(userMessage);
    
    if (isCrisis) {
      setShowCrisisAlert(true);
      const helplines = CRISIS_HELPLINES[detectedLang as keyof typeof CRISIS_HELPLINES] || CRISIS_HELPLINES.en;
      return `${helplines.title}\n\n${helplines.lines.join('\n')}\n\nYou are not alone. Please reach out to these professionals who can provide immediate help. Your life has value and meaning.`;
    }

    // Mental health topics with Indian context
    const responses = {
      en: {
        anxiety: "Anxiety is common, especially with societal pressures in India. Try these steps:\n1. Practice deep breathing (Pranayama)\n2. Talk to trusted family members or friends\n3. Consider meditation or yoga\n4. Maintain regular sleep schedule\n5. Limit social media if it increases comparison pressure\n\n" + CULTURAL_RESPONSES.en.disclaimer,
        depression: "Depression affects many Indians but is often misunderstood. Key points:\n1. It's a medical condition, not a personal weakness\n2. Seek support from mental health professionals\n3. Maintain social connections despite cultural stigma\n4. Practice gratitude (कृतज्ञता)\n5. Regular exercise and sunlight exposure\n\n" + CULTURAL_RESPONSES.en.disclaimer,
        family: "Family dynamics in India can be complex. Remember:\n1. Set healthy boundaries while respecting relationships\n2. Communicate your feelings clearly but respectfully\n3. Seek family counseling if needed\n4. Your mental health is important too\n5. Consider talking to elders or relatives you trust\n\n" + CULTURAL_RESPONSES.en.disclaimer,
        work: "Work stress is common in competitive Indian job market:\n1. Set realistic goals and expectations\n2. Take regular breaks during work\n3. Discuss workload with supervisors when possible\n4. Practice work-life separation\n5. Consider career counseling if feeling overwhelmed\n\n" + CULTURAL_RESPONSES.en.disclaimer,
        general: "I understand you're going through a difficult time. Here's some general guidance:\n1. Acknowledge your feelings - they are valid\n2. Reach out to trusted friends or family\n3. Consider professional counseling\n4. Practice self-care activities you enjoy\n5. Remember that seeking help shows strength, not weakness\n\n" + CULTURAL_RESPONSES.en.disclaimer
      },
      hi: {
        anxiety: "चिंता आम है, विशेषकर भारत में सामाजिक दबाव के साथ। ये कदम आज़माएं:\n1. गहरी सांस लेने का अभ्यास करें (प्राणायाम)\n2. विश्वसनीय परिवार या दोस्तों से बात करें\n3. ध्यान या योग पर विचार करें\n4. नियमित नींद का समय बनाए रखें\n5. सामाजिक मीडिया सीमित करें यदि यह तुलना का दबाव बढ़ाता है\n\n" + CULTURAL_RESPONSES.hi.disclaimer,
        depression: "अवसाद कई भारतीयों को प्रभावित करता है लेकिन अक्सर गलत समझा जाता है। मुख्य बिंदु:\n1. यह एक चिकित्सा स्थिति है, व्यक्तिगत कमज़ोरी नहीं\n2. मानसिक स्वास्थ्य पेशेवरों से सहायता लें\n3. सांस्कृतिक कलंक के बावजूद सामाजिक संपर्क बनाए रखें\n4. कृतज्ञता का अभ्यास करें\n5. नियमित व्यायाम और धूप में रहें\n\n" + CULTURAL_RESPONSES.hi.disclaimer,
        family: "भारत में पारिवारिक गतिशीलता जटिल हो सकती है। याद रखें:\n1. रिश्तों का सम्मान करते हुए स्वस्थ सीमाएं निर्धारित करें\n2. अपनी भावनाओं को स्पष्ट लेकिन सम्मानजनक तरीके से संप्रेषित करें\n3. आवश्यक होने पर पारिवारिक परामर्श लें\n4. आपका मानसिक स्वास्थ्य भी महत्वपूर्ण है\n5. विश्वसनीय बुजुर्गों या रिश्तेदारों से बात करने पर विचार करें\n\n" + CULTURAL_RESPONSES.hi.disclaimer,
        work: "प्रतिस्पर्धी भारतीय नौकरी बाजार में कार्य तनाव आम है:\n1. यथार्थवादी लक्ष्य और अपेक्षाएं निर्धारित करें\n2. काम के दौरान नियमित ब्रेक लें\n3. संभव होने पर पर्यवेक्षकों के साथ कार्यभार पर चर्चा करें\n4. कार्य-जीवन अलगाव का अभ्यास करें\n5. अभिभूत महसूस करने पर करियर परामर्श पर विचार करें\n\n" + CULTURAL_RESPONSES.hi.disclaimer,
        general: "मैं समझता हूं कि आप कठिन समय से गुजर रहे हैं। यहां कुछ सामान्य मार्गदर्शन है:\n1. अपनी भावनाओं को स्वीकार करें - वे वैध हैं\n2. विश्वसनीय दोस्तों या परिवार से संपर्क करें\n3. पेशेवर परामर्श पर विचार करें\n4. आपको पसंद आने वाली स्व-देखभाल गतिविधियों का अभ्यास करें\n5. याद रखें कि सहायता मांगना शक्ति दिखाता है, कमज़ोरी नहीं\n\n" + CULTURAL_RESPONSES.hi.disclaimer
      }
    };

    const langResponses = responses[detectedLang as keyof typeof responses] || responses.en;
    
    // Detect topic and respond accordingly
    if (userMessage.toLowerCase().includes('anxiety') || userMessage.includes('चिंता') || userMessage.includes('घबराहट')) {
      return langResponses.anxiety;
    } else if (userMessage.toLowerCase().includes('depression') || userMessage.includes('अवसाद') || userMessage.includes('उदासी')) {
      return langResponses.depression;
    } else if (userMessage.toLowerCase().includes('family') || userMessage.includes('परिवार') || userMessage.includes('माता-पिता')) {
      return langResponses.family;
    } else if (userMessage.toLowerCase().includes('work') || userMessage.includes('काम') || userMessage.includes('नौकरी')) {
      return langResponses.work;
    } else {
      return langResponses.general;
    }
  };

  const generateGeneralResponse = (userMessage: string, detectedLang: string): string => {
    const responses = {
      en: [
        "That's interesting! I'm here to chat about anything, including mental health support. How are you feeling today?",
        "I appreciate you sharing that with me. Is there anything specific you'd like to talk about or any support you need?",
        "Thank you for that. I'm designed to provide mental health support with understanding of Indian culture. What's on your mind?",
        "I understand. Feel free to share anything that's bothering you or just chat casually. I'm here to help!"
      ],
      hi: [
        "यह दिलचस्प है! मैं किसी भी चीज़ के बारे में बात करने के लिए यहाँ हूँ, मानसिक स्वास्थ्य सहायता सहित। आज आप कैसा महसूस कर रहे हैं?",
        "मैं आपके साथ यह साझा करने की सराहना करता हूँ। क्या कोई खास बात है जिसके बारे में आप बात करना चाहते हैं या कोई सहायता चाहिए?",
        "धन्यवाद। मैं भारतीय संस्कृति की समझ के साथ मानसिक स्वास्थ्य सहायता प्रदान करने के लिए डिज़ाइन किया गया हूँ। आपके मन में क्या है?",
        "मैं समझता हूँ। बेझिझक कुछ भी साझा करें जो आपको परेशान कर रहा है या बस आकस्मिक बातचीत करें। मैं मदद के लिए यहाँ हूँ!"
      ]
    };

    const langResponses = responses[detectedLang as keyof typeof responses] || responses.en;
    return langResponses[Math.floor(Math.random() * langResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
      language: selectedLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInputValue('');

    // Simulate API delay
    setTimeout(() => {
      const detectedLang = detectLanguage(inputValue) || selectedLanguage;
      
      // Determine if message is mental health related
      const mentalHealthKeywords = [
        'stress', 'anxiety', 'depression', 'sad', 'worried', 'scared', 'angry', 'frustrated', 'family', 'work', 'relationship',
        'तनाव', 'चिंता', 'अवसाद', 'उदास', 'चिंतित', 'डरा', 'गुस्सा', 'परेशान', 'परिवार', 'काम', 'रिश्ता'
      ];
      
      const isMentalHealth = mentalHealthKeywords.some(keyword => 
        inputValue.toLowerCase().includes(keyword.toLowerCase())
      );

      let botResponse: string;
      if (isMentalHealth || detectCrisisKeywords(inputValue)) {
        botResponse = generateMentalHealthResponse(inputValue, detectedLang);
      } else {
        botResponse = generateGeneralResponse(inputValue, detectedLang);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        language: detectedLang
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode);
    const selectedLang = INDIAN_LANGUAGES.find(lang => lang.code === langCode);
    toast({
      title: "Language Changed",
      description: `Switched to ${selectedLang?.nativeName} (${selectedLang?.name})`,
    });
  };

  const quickActions = {
    en: [
      "I'm feeling anxious",
      "Family stress",
      "Work pressure",
      "Feeling sad",
      "Need someone to talk"
    ],
    hi: [
      "मैं चिंतित महसूस कर रहा हूं",
      "पारिवारिक तनाव", 
      "काम का दबाव",
      "उदास महसूस कर रहा हूं",
      "किसी से बात करने की जरूरत"
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-20 pb-8">
        {/* Crisis Alert */}
        {showCrisisAlert && (
          <Alert className="mb-6 border-destructive bg-destructive/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="font-medium">
              Crisis support activated. Please contact emergency helplines immediately if you're in immediate danger.
            </AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Multilingual Mental Health AI
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Culturally sensitive mental health support in your preferred Indian language
          </p>
        </div>

        {/* Language Selector */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <Globe className="h-5 w-5 text-primary" />
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {INDIAN_LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <div className="flex items-center gap-2">
                    <span>{lang.nativeName}</span>
                    <span className="text-muted-foreground">({lang.name})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Chat Interface */}
        <Card className="max-w-4xl mx-auto shadow-lg border-border/50">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Mental Health Support Chat
              <Badge variant="secondary" className="ml-auto">
                {INDIAN_LANGUAGES.find(l => l.code === selectedLanguage)?.nativeName}
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0">
            {/* Messages Area */}
            <ScrollArea ref={scrollAreaRef} className="h-96 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg whitespace-pre-wrap ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-muted-foreground p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 animate-pulse" />
                        <span>Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <Separator />

            {/* Quick Actions */}
            <div className="p-4 border-b border-border/50">
              <p className="text-sm text-muted-foreground mb-2">Quick Actions:</p>
              <div className="flex flex-wrap gap-2">
                {(quickActions[selectedLanguage as keyof typeof quickActions] || quickActions.en).map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputValue(action)}
                    className="h-8 text-xs"
                  >
                    {action}
                  </Button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={selectedLanguage === 'hi' ? "अपना संदेश यहाँ लिखें..." : "Type your message here..."}
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact Cards */}
        <div className="max-w-4xl mx-auto mt-8 grid md:grid-cols-2 gap-6">
          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Phone className="h-5 w-5" />
                Emergency Helplines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <strong>iCall (24/7):</strong> 9152987821
              </div>
              <div className="text-sm">
                <strong>AASRA (24/7):</strong> 91-9820466726
              </div>
              <div className="text-sm">
                <strong>Vandrevala Foundation:</strong> 9999 666 555
              </div>
              <div className="text-sm">
                <strong>National Emergency:</strong> 112
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Heart className="h-5 w-5" />
                Remember
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                You are not alone. Mental health is as important as physical health. 
                Seeking help shows courage, not weakness. This AI provides guidance but 
                cannot replace professional medical care.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MultilingualAISupport;