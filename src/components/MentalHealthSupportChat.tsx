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
      text: "Hello! I'm here to provide mental health support and guidance. How are you feeling today?",
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
    "I'm feeling anxious",
    "I'm stressed about exams", 
    "I need someone to talk to",
    "I'm having trouble sleeping",
    "I feel overwhelmed",
    "I need coping strategies",
    "¡Hola! ¿Cómo estás?",
    "Bonjour, comment allez-vous?"
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
        anxiety: "I understand you're feeling anxious. Here are some grounding techniques that can help:\n\n• Try the 5-4-3-2-1 technique: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste\n• Practice deep breathing: Inhale for 4, hold for 4, exhale for 6\n• Remember that anxiety is temporary and manageable\n\nWould you like to talk more about what's causing your anxiety?",
        stress: "Academic stress is very common and you're not alone in feeling this way. Here are some strategies:\n\n• Break large tasks into smaller, manageable chunks\n• Use the Pomodoro technique (25 min study, 5 min break)\n• Prioritize self-care and adequate sleep\n• Consider talking to your academic advisor\n\nWhat specific aspects of your studies are causing the most stress?",
        sleep: "Sleep difficulties can significantly impact mental health. Here are some sleep hygiene tips:\n\n• Maintain a consistent sleep schedule\n• Limit screen time 1 hour before bed\n• Create a calming bedtime routine\n• Keep your bedroom cool and dark\n• Avoid caffeine late in the day\n\nHave you noticed any patterns in what might be disrupting your sleep?",
        lonely: "I'm here to listen and support you. Sometimes just talking through our feelings can be incredibly helpful. Your campus likely has:\n\n• Counseling services (usually free for students)\n• Peer support groups\n• Crisis hotlines available 24/7\n• Online support communities\n\nWhat's been on your mind lately that you'd like to share?",
        default: "Thank you for sharing that with me. Your feelings are valid and it's important that you're reaching out for support. Would you like to explore some coping strategies, or would you prefer to talk more about what's been going on? I'm here to help in whatever way feels most useful to you."
      },
      es: {
        anxiety: "Entiendo que te sientes ansioso/a. Aquí tienes algunas técnicas de relajación que pueden ayudar:\n\n• Prueba la técnica 5-4-3-2-1: Nombra 5 cosas que ves, 4 que puedes tocar, 3 que escuchas, 2 que hueles, 1 que saboreas\n• Practica la respiración profunda: Inhala por 4, mantén por 4, exhala por 6\n• Recuerda que la ansiedad es temporal y manejable\n\n¿Te gustaría hablar más sobre lo que está causando tu ansiedad?",
        stress: "El estrés académico es muy común y no estás solo/a en sentirte así. Aquí tienes algunas estrategias:\n\n• Divide las tareas grandes en partes más pequeñas y manejables\n• Usa la técnica Pomodoro (25 min de estudio, 5 min de descanso)\n• Prioriza el autocuidado y dormir lo suficiente\n• Considera hablar con tu consejero académico\n\n¿Qué aspectos específicos de tus estudios te causan más estrés?",
        sleep: "Las dificultades para dormir pueden impactar significativamente la salud mental. Aquí tienes algunos consejos de higiene del sueño:\n\n• Mantén un horario de sueño consistente\n• Limita el tiempo de pantalla 1 hora antes de dormir\n• Crea una rutina relajante antes de dormir\n• Mantén tu habitación fresca y oscura\n• Evita la cafeína tarde en el día\n\n¿Has notado algún patrón en lo que podría estar interrumpiendo tu sueño?",
        lonely: "Estoy aquí para escucharte y apoyarte. A veces, simplemente hablar sobre nuestros sentimientos puede ser increíblemente útil. Tu campus probablemente tiene:\n\n• Servicios de consejería (generalmente gratuitos para estudiantes)\n• Grupos de apoyo entre pares\n• Líneas de crisis disponibles 24/7\n• Comunidades de apoyo en línea\n\n¿Qué ha estado en tu mente últimamente que te gustaría compartir?",
        default: "Gracias por compartir eso conmigo. Tus sentimientos son válidos y es importante que estés buscando apoyo. ¿Te gustaría explorar algunas estrategias de afrontamiento, o preferirías hablar más sobre lo que ha estado pasando? Estoy aquí para ayudar de la manera que te sea más útil."
      },
      fr: {
        anxiety: "Je comprends que vous vous sentez anxieux/anxieuse. Voici quelques techniques d'ancrage qui peuvent aider:\n\n• Essayez la technique 5-4-3-2-1: Nommez 5 choses que vous voyez, 4 que vous pouvez toucher, 3 que vous entendez, 2 que vous sentez, 1 que vous goûtez\n• Pratiquez la respiration profonde: Inspirez pendant 4, retenez pendant 4, expirez pendant 6\n• Rappelez-vous que l'anxiété est temporaire et gérable\n\nAimeriez-vous parler davantage de ce qui cause votre anxiété?",
        stress: "Le stress académique est très courant et vous n'êtes pas seul(e) dans ce ressenti. Voici quelques stratégies:\n\n• Divisez les grandes tâches en petites parties gérables\n• Utilisez la technique Pomodoro (25 min d'étude, 5 min de pause)\n• Priorisez les soins personnels et un sommeil adéquat\n• Considérez parler à votre conseiller académique\n\nQuels aspects spécifiques de vos études causent le plus de stress?",
        sleep: "Les difficultés de sommeil peuvent considérablement affecter la santé mentale. Voici quelques conseils d'hygiène du sommeil:\n\n• Maintenez un horaire de sommeil cohérent\n• Limitez le temps d'écran 1 heure avant le coucher\n• Créez une routine relaxante avant le coucher\n• Gardez votre chambre fraîche et sombre\n• Évitez la caféine tard dans la journée\n\nAvez-vous remarqué des tendances dans ce qui pourrait perturber votre sommeil?",
        lonely: "Je suis là pour vous écouter et vous soutenir. Parfois, simplement parler de nos sentiments peut être incroyablement utile. Votre campus a probablement:\n\n• Services de conseil (généralement gratuits pour les étudiants)\n• Groupes de soutien par les pairs\n• Lignes de crise disponibles 24/7\n• Communautés de soutien en ligne\n\nQu'est-ce qui vous préoccupe récemment et que vous aimeriez partager?",
        default: "Merci de partager cela avec moi. Vos sentiments sont valides et il est important que vous cherchiez du soutien. Aimeriez-vous explorer quelques stratégies d'adaptation, ou préféreriez-vous parler davantage de ce qui se passe? Je suis là pour vous aider de la manière qui vous sera la plus utile."
      },
      de: {
        anxiety: "Ich verstehe, dass Sie sich ängstlich fühlen. Hier sind einige Erdungstechniken, die helfen können:\n\n• Versuchen Sie die 5-4-3-2-1-Technik: Nennen Sie 5 Dinge, die Sie sehen, 4, die Sie berühren können, 3, die Sie hören, 2, die Sie riechen, 1, das Sie schmecken\n• Üben Sie tiefes Atmen: 4 einatmen, 4 halten, 6 ausatmen\n• Denken Sie daran, dass Angst vorübergehend und bewältigbar ist\n\nMöchten Sie mehr darüber sprechen, was Ihre Angst verursacht?",
        stress: "Akademischer Stress ist sehr häufig und Sie sind nicht allein mit diesem Gefühl. Hier sind einige Strategien:\n\n• Teilen Sie große Aufgaben in kleinere, bewältigbare Teile\n• Verwenden Sie die Pomodoro-Technik (25 min lernen, 5 min Pause)\n• Priorisieren Sie Selbstfürsorge und ausreichend Schlaf\n• Erwägen Sie, mit Ihrem Studienberater zu sprechen\n\nWelche spezifischen Aspekte Ihres Studiums verursachen den meisten Stress?",
        sleep: "Schlafstörungen können die geistige Gesundheit erheblich beeinträchtigen. Hier sind einige Schlafhygiene-Tipps:\n\n• Halten Sie einen konstanten Schlafplan ein\n• Begrenzen Sie die Bildschirmzeit 1 Stunde vor dem Schlafengehen\n• Schaffen Sie eine beruhigende Routine vor dem Schlafengehen\n• Halten Sie Ihr Schlafzimmer kühl und dunkel\n• Vermeiden Sie Koffein spät am Tag\n\nHaben Sie Muster bemerkt, was Ihren Schlaf stören könnte?",
        lonely: "Ich bin hier, um Ihnen zuzuhören und Sie zu unterstützen. Manchmal kann es unglaublich hilfreich sein, einfach über unsere Gefühle zu sprechen. Ihr Campus hat wahrscheinlich:\n\n• Beratungsdienste (normalerweise kostenlos für Studenten)\n• Peer-Support-Gruppen\n• Krisenhotlines verfügbar 24/7\n• Online-Support-Gemeinschaften\n\nWas beschäftigt Sie in letzter Zeit, das Sie gerne teilen möchten?",
        default: "Danke, dass Sie das mit mir geteilt haben. Ihre Gefühle sind berechtigt und es ist wichtig, dass Sie Unterstützung suchen. Möchten Sie einige Bewältigungsstrategien erkunden, oder würden Sie lieber mehr darüber sprechen, was vor sich geht? Ich bin hier, um zu helfen, wie es für Sie am nützlichsten ist."
      }
    };

    const langResponses = responses[language as keyof typeof responses] || responses.en;
    
    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || 
        lowerMessage.includes('ansioso') || lowerMessage.includes('ansiedad') ||
        lowerMessage.includes('anxieux') || lowerMessage.includes('anxiété') ||
        lowerMessage.includes('ängstlich') || lowerMessage.includes('angst')) {
      return langResponses.anxiety || langResponses.default;
    }
    
    if (lowerMessage.includes('stress') || lowerMessage.includes('exam') ||
        lowerMessage.includes('estrés') || lowerMessage.includes('examen') ||
        lowerMessage.includes('stress') || lowerMessage.includes('examen') ||
        lowerMessage.includes('stress') || lowerMessage.includes('prüfung')) {
      return langResponses.stress || langResponses.default;
    }
    
    if (lowerMessage.includes('sleep') || lowerMessage.includes('tired') ||
        lowerMessage.includes('sueño') || lowerMessage.includes('cansado') ||
        lowerMessage.includes('sommeil') || lowerMessage.includes('fatigué') ||
        lowerMessage.includes('schlaf') || lowerMessage.includes('müde')) {
      return langResponses.sleep || langResponses.default;
    }
    
    if (lowerMessage.includes('talk') || lowerMessage.includes('lonely') ||
        lowerMessage.includes('hablar') || lowerMessage.includes('solo') ||
        lowerMessage.includes('parler') || lowerMessage.includes('seul') ||
        lowerMessage.includes('sprechen') || lowerMessage.includes('einsam')) {
      return langResponses.lonely || langResponses.default;
    }

    return langResponses.default;
  };

  const getGeneralResponse = (userMessage: string, language: string): string => {
    const responses = {
      en: [
        "That's interesting! I'd be happy to chat about that. As your mental health support companion, I'm here for both serious conversations and everyday topics. How are you feeling today?",
        "Thanks for sharing that with me. I enjoy our conversations! Is there anything on your mind that you'd like to talk through, or are you just looking for some friendly chat?",
        "I appreciate you reaching out. While I'm designed primarily for mental health support, I'm also here for general conversation. What would be most helpful for you right now?",
        "That's a great topic! I'm here to support you in whatever way you need - whether that's discussing everyday things or working through any challenges you might be facing.",
        "I'm glad you're engaging in conversation. Social connection is important for mental wellness. Is there anything specific you'd like to explore or discuss today?"
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
    
    // Check for crisis keywords in multiple languages
    const crisisKeywords = [
      // English
      'kill myself', 'suicide', 'end it all', 'want to die', 'hurt myself', 'self harm',
      // Spanish
      'matarme', 'suicidio', 'quiero morir', 'hacerme daño',
      // French
      'me tuer', 'suicide', 'veux mourir', 'me faire du mal',
      // German
      'mich umbringen', 'selbstmord', 'sterben will', 'mir schaden'
    ];
    
    const lowerMessage = userMessage.toLowerCase();
    if (crisisKeywords.some(keyword => lowerMessage.includes(keyword))) {
      const crisisResponses = {
        en: "I'm very concerned about what you've shared. Please reach out for immediate help:\n\n🚨 Emergency: Call 911 or go to your nearest emergency room\n📞 Crisis Text Line: Text HOME to 741741\n☎️ National Suicide Prevention Lifeline: 988\n\nYour life has value and there are people who want to help. Please don't face this alone.",
        es: "Estoy muy preocupado/a por lo que has compartido. Por favor busca ayuda inmediata:\n\n🚨 Emergencia: Llama al 911 o ve a la sala de emergencias más cercana\n📞 Línea de Crisis: Envía HOLA al 741741\n☎️ Línea Nacional de Prevención del Suicidio: 988\n\nTu vida tiene valor y hay personas que quieren ayudar. Por favor no enfrentes esto solo/a.",
        fr: "Je suis très préoccupé par ce que vous avez partagé. Veuillez chercher de l'aide immédiate:\n\n🚨 Urgence: Appelez le 911 ou rendez-vous aux urgences les plus proches\n📞 Ligne de crise: Envoyez ACCUEIL au 741741\n\nVotre vie a de la valeur et il y a des gens qui veulent vous aider. S'il vous plaît, ne faites pas face à cela seul.",
        de: "Ich bin sehr besorgt über das, was Sie geteilt haben. Bitte suchen Sie sofort Hilfe:\n\n🚨 Notfall: Rufen Sie 911 an oder gehen Sie zur nächsten Notaufnahme\n📞 Krisenlinie: Senden Sie HEIMAT an 741741\n\nIhr Leben hat Wert und es gibt Menschen, die helfen wollen. Bitte stehen Sie dem nicht allein gegenüber."
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