import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Send, 
  MessageCircle, 
  Heart, 
  Shield, 
  Star,
  X,
  Bot,
  User
} from "lucide-react";
import DOMPurify from "dompurify";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const MentalHealthSupportChat = ({ isOpen, onClose }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Campus MindWell, your mental health friend. I'm here to check in and support you. On a scale of 1-10, how's your mood today? I'm here to listen and help with whatever you're going through. 🤗",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const quickActions = [
    "Mood check: I'm feeling low (1-3)",
    "Exam stress is overwhelming me",
    "Need help with anxiety",
    "Can't sleep, racing thoughts",
    "Family pressure about grades",
    "Feeling isolated from classmates",
    "नमस्ते! मुझे चिंता हो रही है",
    "मैं पढ़ाई को लेकर तनाव में हूं"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !sessionId) {
      startNewSession();
    }
  }, [isOpen]);

  const startNewSession = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert([
          {
            user_id: (await supabase.auth.getUser()).data.user?.id,
            message_count: 0
          }
        ])
        .select()
        .single();

      if (error) throw error;
      setSessionId(data.id);
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const endSession = async (userRating?: number) => {
    if (!sessionId) return;

    try {
      await supabase
        .from('chat_sessions')
        .update({
          session_end: new Date().toISOString(),
          message_count: messages.length,
          satisfaction_rating: userRating || rating
        })
        .eq('id', sessionId);
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const sanitizedMessage = DOMPurify.sanitize(message.trim());
    const userMessage: Message = {
      id: Date.now().toString(),
      text: sanitizedMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response with mental health focused responses
    setTimeout(() => {
      const responses = getContextualResponse(sanitizedMessage);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responses,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };

  // Enhanced AI response system with multi-language and topic detection
  const detectLanguage = (text: string): string => {
    // Basic language detection - in production, use a proper language detection library
    const spanishKeywords = ['hola', 'como', 'estoy', 'siento', 'ayuda', 'gracias', 'por favor'];
    const frenchKeywords = ['bonjour', 'comment', 'je suis', 'aide', 'merci', 's\'il vous plaît'];
    const germanKeywords = ['hallo', 'wie', 'ich bin', 'hilfe', 'danke', 'bitte'];
    
    const lowerText = text.toLowerCase();
    
    if (spanishKeywords.some(keyword => lowerText.includes(keyword))) return 'es';
    if (frenchKeywords.some(keyword => lowerText.includes(keyword))) return 'fr';
    if (germanKeywords.some(keyword => lowerText.includes(keyword))) return 'de';
    
    return 'en'; // Default to English
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

  const getMentalHealthResponse = (userMessage: string, language: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    const responses = {
      en: {
        anxiety: "I hear you're feeling anxious - that's really tough, especially during college. Let's work through this together:\n\n1. Try the 5-4-3-2-1 grounding: 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste\n2. Box breathing: 4 counts in, 4 hold, 4 out, 4 hold\n3. Remember: Your college counselor is there for you (usually free!)\n\n**Disclaimer**: This is supportive guidance, not medical advice. If anxiety persists, please see a mental health professional.\n\nWhat's triggering your anxiety most - academics, social, or something else?",
        stress: "College stress is so real - you're definitely not alone. Here's what helps many students:\n\n1. Break big tasks into small wins\n2. Study in 25-min focused blocks with 5-min breaks  \n3. Talk to your academic advisor about workload\n4. Remember: Grades don't define your worth\n5. Your college counseling center can help with stress management\n\n**Important**: If stress feels unmanageable, please reach out to your college counselor or call 1800-599-0019.\n\nIs this about specific subjects or more general college pressure?",
        sleep: "Sleep issues during college are super common. Let's get you some rest:\n\n1. Same bedtime/wake time daily (even weekends!)\n2. No screens 1 hour before bed\n3. Try meditation apps or calming music\n4. Keep room cool and dark\n5. Avoid caffeine after 2 PM\n\n**Disclaimer**: Persistent sleep issues may need medical attention from your campus health center.\n\nAre racing thoughts keeping you up, or is it more about your sleep environment?",
        family: "Family pressure about grades/career can feel overwhelming. You're not alone in this:\n\n1. Set small, realistic goals you can share with family\n2. Communicate your efforts, not just results\n3. Remember: You're more than your academic performance\n4. Your college counselor can help navigate family expectations\n5. Consider family counseling if possible\n\n**Support available**: Campus counseling can help with family stress too.\n\nWould you like tips on talking to family about pressure?",
        lonely: "Feeling isolated at college is really hard. You're brave for reaching out:\n\n1. Join one club/society that interests you\n2. Study groups are great for both academics and friends\n3. Your college likely has peer support groups\n4. Campus counseling offers group sessions too\n5. Remember: Quality connections > quantity\n\n**Resources**: Your campus counseling center and student activities office can help you connect.\n\nWhat's making you feel most isolated - academics, social, or being away from home?",
        default: "Thanks for trusting me with this. Your feelings matter and seeking help shows strength.\n\n**Important disclaimer**: I provide support and guidance, but I'm not a replacement for professional help. If you need immediate assistance, please contact:\n• Your college counselor\n• Crisis helpline: 1800-599-0019\n• Emergency: 112\n\nWould you like coping strategies, or do you want to talk more about what's going on?"
      },
        hi: {
        anxiety: "मैं समझ सकता हूं कि आप चिंतित महसूस कर रहे हैं। आइए एक साथ इससे निपटें:\n\n1. 5-4-3-2-1 तकनीक: 5 चीजें जो आप देखते हैं, 4 जिन्हें छूते हैं, 3 जो सुनते हैं, 2 जिन्हें सूंघते हैं, 1 जिसका स्वाद लेते हैं\n2. गहरी सांस: 4 गिनती में सांस लें, 4 रोकें, 4 में छोड़ें\n3. याद रखें: आपका कॉलेज काउंसलर आपके लिए है (आमतौर पर मुफ़्त!)\n\n**अस्वीकरण**: यह सहायक मार्गदर्शन है, चिकित्सा सलाह नहीं। यदि चिंता बनी रहे तो कृपया मानसिक स्वास्थ्य पेशेवर से मिलें।\n\nआपकी चिंता का मुख्य कारण क्या है - पढ़ाई, सामाजिक, या कुछ और?",
        stress: "कॉलेज का तनाव बहुत आम है - आप अकेले नहीं हैं। यह छात्रों की मदद करता है:\n\n1. बड़े कामों को छोटे हिस्सों में बांटें\n2. 25 मिनट पढ़ें, 5 मिनट ब्रेक लें\n3. अपने एकेडमिक एडवाइजर से बात करें\n4. याद रखें: नंबर आपकी पहचान नहीं बनाते\n5. आपका कॉलेज काउंसलिंग सेंटर तनाव प्रबंधन में मदद कर सकता है\n\n**महत्वपूर्ण**: यदि तनाव असहनीय लगे तो कॉलेज काउंसलर से मिलें या 1800-599-0019 पर कॉल करें।\n\nक्या यह खास विषयों के बारे में है या सामान्य कॉलेज का दबाव?",
        sleep: "कॉलेज में नींद की समस्या बहुत आम है। आइए आपको आराम दिलाते हैं:\n\n1. रोज़ाना एक ही समय पर सोना और उठना\n2. सोने से 1 घंटे पहले फोन/लैपटॉप बंद करें\n3. मेडिटेशन ऐप या शांत संगीत सुनें\n4. कमरा ठंडा और अंधेरा रखें\n5. दोपहर 2 बजे के बाद कैफीन न लें\n\n**अस्वीकरण**: लगातार नींद की समस्या के लिए कैंपस हेल्थ सेंटर से चिकित्सा सहायता की आवश्यकता हो सकती है।\n\nक्या तेज़ विचार आपको जगाए रख रहे हैं, या यह नींद के माहौल के बारे में है?",
        family: "ग्रेड/करियर के लिए पारिवारिक दबाव भारी लग सकता है। इसमें आप अकेले नहीं हैं:\n\n1. छोटे, यथार्थवादी लक्ष्य सेट करें जो आप परिवार के साथ साझा कर सकें\n2. सिर्फ परिणाम नहीं, बल्कि अपनी कोशिशों के बारे में बताएं\n3. याद रखें: आप अपने शैक्षणिक प्रदर्शन से कहीं ज्यादा हैं\n4. आपका कॉलेज काउंसलर पारिवारिक अपेक्षाओं को संभालने में मदद कर सकता है\n\n**सहायता उपलब्ध**: कैंपस काउंसलिंग पारिवारिक तनाव में भी मदद कर सकती है।\n\nक्या आप परिवार से दबाव के बारे में बात करने के तरीकों के बारे में जानना चाहेंगे?",
        lonely: "कॉलेज में अकेलापन महसूस करना वाकई मुश्किल है। मदद मांगना आपकी बहादुरी दिखाता है:\n\n1. एक क्लब/सोसाइटी जॉइन करें जिसमें आपकी दिलचस्पी हो\n2. स्टडी ग्रुप्स पढ़ाई और दोस्ती दोनों के लिए बेहतरीन हैं\n3. आपके कॉलेज में शायद पीयर सपोर्ट ग्रुप्स हैं\n4. कैंपस काउंसलिंग भी ग्रुप सेशन्स ऑफर करती है\n5. याद रखें: गुणवत्तापूर्ण संबंध > संख्या\n\n**संसाधन**: आपका कैंपस काउंसलिंग सेंटर और स्टूडेंट एक्टिविटीज़ ऑफिस आपको कनेक्ट करने में मदद कर सकते हैं।\n\nक्या आपको सबसे ज्यादा अकेलापन महसूस कराता है - पढ़ाई, सामाजिक, या घर से दूर होना?",
        default: "मुझ पर भरोसा करने के लिए धन्यवाद। आपकी भावनाएं मायने रखती हैं और मदद मांगना ताकत दिखाता है।\n\n**महत्वपूर्ण अस्वीकरण**: मैं सहायता और मार्गदर्शन प्रदान करता हूं, लेकिन मैं पेशेवर मदद का विकल्प नहीं हूं। यदि आपको तत्काल सहायता चाहिए, तो कृपया संपर्क करें:\n• आपका कॉलेज काउंसलर\n• क्राइसिस हेल्पलाइन: 1800-599-0019\n• आपातकाल: 112\n\nक्या आप मुकाबला करने की रणनीतियां चाहते हैं, या आप और बात करना चाहते हैं कि क्या हो रहा है?"
      },
      fr: {
        anxiety: "Je comprends que vous vous sentez anxieux/anxieuse. Voici quelques techniques d'ancrage qui peuvent aider:\n\n• Essayez la technique 5-4-3-2-1: Nommez 5 choses que vous voyez, 4 que vous pouvez toucher, 3 que vous entendez, 2 que vous sentez, 1 que vous goûtez\n• Pratiquez la respiration profonde: Inspirez pendant 4, retenez pendant 4, expirez pendant 6\n• Rappelez-vous que l'anxiété est temporaire et gérable\n\nAimeriez-vous parler davantage de ce qui cause votre anxiété?",
        stress: "Le stress académique est très courant et vous n'êtes pas seul(e) dans ce ressenti. Voici quelques stratégies:\n\n• Divisez les grandes tâches en petites parties gérables\n• Utilisez la technique Pomodoro (25 min d'étude, 5 min de pause)\n• Priorisez les soins personnels et un sommeil adéquat\n• Considérez parler à votre conseiller académique\n\nQuels aspects spécifiques de vos études causent le plus de stress?",
        sleep: "Les difficultés de sommeil peuvent considérablement affecter la santé mentale. Voici quelques conseils d'hygiène du sommeil:\n\n• Maintenez un horaire de sommeil cohérent\n• Limitez le temps d'écran 1 heure avant le coucher\n• Créez une routine relaxante avant le coucher\n• Gardez votre chambre fraîche et sombre\n• Évitez la caféine tard dans la journée\n\nAvez-vous remarqué des tendances dans ce qui pourrait perturber votre sommeil?",
        family: "La pression familiale concernant les études peut être accablante. Vous n'êtes pas seul(e):\n\n• Fixez-vous des objectifs petits et réalistes à partager avec votre famille\n• Communiquez vos efforts, pas seulement les résultats\n• Rappelez-vous: vous êtes plus que vos performances académiques\n• Votre conseiller de campus peut aider avec les attentes familiales\n\nSouhaitez-vous des conseils pour parler à votre famille de cette pression?",
        lonely: "Je suis là pour vous écouter et vous soutenir. Parfois, simplement parler de nos sentiments peut être incroyablement utile. Votre campus a probablement:\n\n• Services de conseil (généralement gratuits pour les étudiants)\n• Groupes de soutien par les pairs\n• Lignes de crise disponibles 24/7\n• Communautés de soutien en ligne\n\nQu'est-ce qui vous préoccupe récemment et que vous aimeriez partager?",
        default: "Merci de partager cela avec moi. Vos sentiments sont valides et il est important que vous cherchiez du soutien. Aimeriez-vous explorer quelques stratégies d'adaptation, ou préféreriez-vous parler davantage de ce qui se passe? Je suis là pour vous aider de la manière qui vous sera la plus utile."
      },
      de: {
        anxiety: "Ich verstehe, dass Sie sich ängstlich fühlen. Hier sind einige Erdungstechniken, die helfen können:\n\n• Versuchen Sie die 5-4-3-2-1-Technik: Nennen Sie 5 Dinge, die Sie sehen, 4, die Sie berühren können, 3, die Sie hören, 2, die Sie riechen, 1, das Sie schmecken\n• Üben Sie tiefes Atmen: 4 einatmen, 4 halten, 6 ausatmen\n• Denken Sie daran, dass Angst vorübergehend und bewältigbar ist\n\nMöchten Sie mehr darüber sprechen, was Ihre Angst verursacht?",
        stress: "Akademischer Stress ist sehr häufig und Sie sind nicht allein mit diesem Gefühl. Hier sind einige Strategien:\n\n• Teilen Sie große Aufgaben in kleinere, bewältigbare Teile\n• Verwenden Sie die Pomodoro-Technik (25 min lernen, 5 min Pause)\n• Priorisieren Sie Selbstfürsorge und ausreichend Schlaf\n• Erwägen Sie, mit Ihrem Studienberater zu sprechen\n\nWelche spezifischen Aspekte Ihres Studiums verursachen den meisten Stress?",
        sleep: "Schlafstörungen können die geistige Gesundheit erheblich beeinträchtigen. Hier sind einige Schlafhygiene-Tipps:\n\n• Halten Sie einen konstanten Schlafplan ein\n• Begrenzen Sie die Bildschirmzeit 1 Stunde vor dem Schlafengehen\n• Schaffen Sie eine beruhigende Routine vor dem Schlafengehen\n• Halten Sie Ihr Schlafzimmer kühl und dunkel\n• Vermeiden Sie Koffein spät am Tag\n\nHaben Sie Muster bemerkt, was Ihren Schlaf stören könnte?",
        family: "Familiärer Druck bezüglich Noten kann überwältigend sein. Sie sind nicht allein:\n\n• Setzen Sie kleine, realistische Ziele, die Sie mit der Familie teilen können\n• Kommunizieren Sie Ihre Anstrengungen, nicht nur Ergebnisse\n• Denken Sie daran: Sie sind mehr als Ihre akademische Leistung\n• Ihr Campus-Berater kann bei familiären Erwartungen helfen\n\nMöchten Sie Tipps, wie Sie mit der Familie über Druck sprechen können?",
        lonely: "Ich bin hier, um Ihnen zuzuhören und Sie zu unterstützen. Manchmal kann es unglaublich hilfreich sein, einfach über unsere Gefühle zu sprechen. Ihr Campus hat wahrscheinlich:\n\n• Beratungsdienste (normalerweise kostenlos für Studenten)\n• Peer-Support-Gruppen\n• Krisenhotlines verfügbar 24/7\n• Online-Support-Gemeinschaften\n\nWas beschäftigt Sie in letzter Zeit, das Sie gerne teilen möchten?",
        default: "Danke, dass Sie das mit mir geteilt haben. Ihre Gefühle sind berechtigt und es ist wichtig, dass Sie Unterstützung suchen. Möchten Sie einige Bewältigungsstrategien erkunden, oder würden Sie lieber mehr darüber sprechen, was vor sich geht? Ich bin hier, um zu helfen, wie es für Sie am nützlichsten ist."
      }
    };

    const langResponses = responses[language as keyof typeof responses] || responses.en;
    
    // Enhanced keyword detection for Indian college context
    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || 
        userMessage.includes('चिंता') || userMessage.includes('घबराहट')) {
      return langResponses.anxiety || langResponses.default;
    }
    
    if (lowerMessage.includes('stress') || lowerMessage.includes('exam') || lowerMessage.includes('grade') ||
        userMessage.includes('तनाव') || userMessage.includes('पढ़ाई') || userMessage.includes('परीक्षा')) {
      return langResponses.stress || langResponses.default;
    }
    
    if (lowerMessage.includes('sleep') || lowerMessage.includes('tired') || lowerMessage.includes('insomnia') ||
        userMessage.includes('नींद') || userMessage.includes('सो नहीं')) {
      return langResponses.sleep || langResponses.default;
    }
    
    if (lowerMessage.includes('family') || lowerMessage.includes('parent') || lowerMessage.includes('pressure') ||
        userMessage.includes('परिवार') || userMessage.includes('मां-बाप') || userMessage.includes('दबाव')) {
      return langResponses.family || langResponses.default;
    }
    
    if (lowerMessage.includes('talk') || lowerMessage.includes('lonely') || lowerMessage.includes('isolated') ||
        userMessage.includes('अकेला') || userMessage.includes('अकेली') || userMessage.includes('दोस्त नहीं')) {
      return langResponses.lonely || langResponses.default;
    }

    return langResponses.default;
  };

  const getGeneralResponse = (userMessage: string, language: string): string => {
    const responses = {
      en: [
        "That's cool to talk about! I'm Campus MindWell, here for both everyday chats and mental health check-ins. How's your overall mood today on a scale of 1-10?",
        "Thanks for sharing! I love chatting with students. College life can be a mix of everything - exciting, stressful, fun, overwhelming. How are you handling things lately?",
        "Nice topic! As your campus mental health friend, I'm here for both casual conversations and deeper support. Is there anything weighing on your mind today?",
        "I'm enjoying our chat! Social connection is so important for student wellbeing. How are you feeling about college life in general right now?",
        "Great to hear from you! I'm here for whatever you need - whether it's light conversation or if you want to talk through any college challenges. What's been on your mind?"
      ],
      es: [
        "¡Qué interesante! Me encanta charlar sobre eso. Como tu compañero de apoyo en salud mental, estoy aquí tanto para conversaciones serias como para temas cotidianos. ¿Cómo te sientes hoy?",
        "Gracias por compartir eso conmigo. ¡Disfruto nuestras conversaciones! ¿Hay algo en tu mente de lo que te gustaría hablar, o solo buscas una charla amigable?",
        "Aprecio que te pongas en contacto. Aunque estoy diseñado principalmente para apoyo en salud mental, también estoy aquí para conversación general. ¿Qué sería más útil para ti ahora?"
      ],
      fr: [
        "C'est intéressant! Je serais ravi de discuter de cela. En tant que votre compagnon de soutien en santé mentale, je suis là pour les conversations sérieuses et les sujets quotidiens. Comment vous sentez-vous aujourd'hui?",
        "Merci de partager cela avec moi. J'apprécie nos conversations! Y a-t-il quelque chose qui vous préoccupe et dont vous aimeriez parler, ou cherchez-vous simplement une conversation amicale?"
      ],
      de: [
        "Das ist interessant! Ich würde gerne darüber sprechen. Als Ihr Begleiter für psychische Gesundheit bin ich sowohl für ernste Gespräche als auch für alltägliche Themen da. Wie fühlen Sie sich heute?",
        "Danke, dass Sie das mit mir geteilt haben. Ich schätze unsere Gespräche! Gibt es etwas, was Sie beschäftigt und worüber Sie sprechen möchten, oder suchen Sie einfach nach einem freundlichen Gespräch?"
      ]
    };

    const langResponses = responses[language as keyof typeof responses] || responses.en;
    return langResponses[Math.floor(Math.random() * langResponses.length)];
  };

  const getContextualResponse = (userMessage: string): string => {
    const language = detectLanguage(userMessage);
    const topic = detectTopic(userMessage);
    
    // Enhanced crisis detection with Indian context
    const crisisKeywords = [
      // English
      'kill myself', 'suicide', 'end it all', 'want to die', 'hurt myself', 'self harm', 'no point living',
      // Hindi crisis keywords
      'आत्महत्या', 'मरना चाहता', 'मरना चाहती', 'खुद को मारना', 'जीना नहीं चाहता', 'जीने का मन नहीं',
      'मरने का मन', 'जिंदगी से परेशान', 'खुद को नुकसान', 'कोई फायदा नहीं जीने का'
    ];
    
    const lowerMessage = userMessage.toLowerCase();
    if (crisisKeywords.some(keyword => lowerMessage.includes(keyword) || userMessage.includes(keyword))) {
      const crisisResponses = {
        en: "🚨 **IMMEDIATE SUPPORT NEEDED** - I'm very concerned about you. Please reach out right now:\n\n📞 **iCall**: 9152987821 (24/7 counseling)\n📞 **AASRA**: 91-9820466726 (24/7 suicide prevention)\n📞 **Vandrevala Foundation**: 9999 666 555 (24/7 crisis support)\n📞 **National Helpline**: 1800-599-0019\n📞 **Emergency**: 112\n\n🏥 **Your college counselor is available too** - please contact them immediately.\n\nYour life matters deeply. You're not alone in this.",
        hi: "🚨 **तत्काल सहायता की जरूरत** - मैं आपके लिए बहुत चिंतित हूं। कृपया अभी संपर्क करें:\n\n📞 **iCall**: 9152987821 (24/7 काउंसलिंग)\n📞 **AASRA**: 91-9820466726 (24/7 आत्महत्या रोकथाम)\n📞 **वंद्रेवाला फाउंडेशन**: 9999 666 555 (24/7 क्राइसिस सपोर्ट)\n📞 **राष्ट्रीय हेल्पलाइन**: 1800-599-0019\n📞 **आपातकाल**: 112\n\n🏥 **आपका कॉलेज काउंसलर भी उपलब्ध है** - कृपया तुरंत उनसे संपर्क करें।\n\nआपकी जिंदगी बहुत कीमती है। आप इसमें अकेले नहीं हैं।"
      };
      
      return crisisResponses[language as keyof typeof crisisResponses] || crisisResponses.en;
    }

    if (topic === 'mental-health') {
      return getMentalHealthResponse(userMessage, language);
    } else {
      return getGeneralResponse(userMessage, language);
    }
  };

  const handleQuickAction = (action: string) => {
    handleSendMessage(action);
  };

  const handleRating = async (newRating: number) => {
    setRating(newRating);
    await endSession(newRating);
    toast({
      title: "Thank you for your feedback!",
      description: "Your rating helps us improve our support services.",
    });
  };

  const handleClose = async () => {
    await endSession();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl h-[80vh] flex flex-col shadow-glow">
        {/* Header */}
        <div className="p-6 border-b border-border/50 bg-gradient-calm rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-soft rounded-full flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Campus MindWell AI</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  <span>Confidential & Secure</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-accent/20 text-accent'
                }`}>
                  {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={`rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <p className="whitespace-pre-line">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted text-muted-foreground rounded-lg p-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.1s]"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-3 border-t border-border/50">
          <div className="flex flex-wrap gap-2 mb-3">
            {quickActions.map((action, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => handleQuickAction(action)}
              >
                {action}
              </Badge>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-6 border-t border-border/50">
          <div className="flex gap-2">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 min-h-[60px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }
              }}
            />
            <Button 
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isLoading}
              className="self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
            <span>Rate this session:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 cursor-pointer transition-colors ${
                  rating && star <= rating ? 'text-yellow-500 fill-current' : 'hover:text-yellow-500'
                }`}
                onClick={() => handleRating(star)}
              />
            ))}
          </div>

          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <Heart className="h-3 w-3" />
            This AI provides support but isn't a replacement for professional mental health care.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default MentalHealthSupportChat;