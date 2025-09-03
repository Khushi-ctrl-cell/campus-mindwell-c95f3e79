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
    "I need coping strategies"
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

  const getContextualResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety')) {
      return "I understand you're feeling anxious. Here are some grounding techniques that can help:\n\n• Try the 5-4-3-2-1 technique: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste\n• Practice deep breathing: Inhale for 4, hold for 4, exhale for 6\n• Remember that anxiety is temporary and manageable\n\nWould you like to talk more about what's causing your anxiety?";
    }
    
    if (lowerMessage.includes('stress') || lowerMessage.includes('exam')) {
      return "Academic stress is very common and you're not alone in feeling this way. Here are some strategies:\n\n• Break large tasks into smaller, manageable chunks\n• Use the Pomodoro technique (25 min study, 5 min break)\n• Prioritize self-care and adequate sleep\n• Consider talking to your academic advisor\n\nWhat specific aspects of your studies are causing the most stress?";
    }
    
    if (lowerMessage.includes('sleep') || lowerMessage.includes('tired')) {
      return "Sleep difficulties can significantly impact mental health. Here are some sleep hygiene tips:\n\n• Maintain a consistent sleep schedule\n• Limit screen time 1 hour before bed\n• Create a calming bedtime routine\n• Keep your bedroom cool and dark\n• Avoid caffeine late in the day\n\nHave you noticed any patterns in what might be disrupting your sleep?";
    }
    
    if (lowerMessage.includes('talk') || lowerMessage.includes('lonely')) {
      return "I'm here to listen and support you. Sometimes just talking through our feelings can be incredibly helpful. Your campus likely has:\n\n• Counseling services (usually free for students)\n• Peer support groups\n• Crisis hotlines available 24/7\n• Online support communities\n\nWhat's been on your mind lately that you'd like to share?";
    }

    return "Thank you for sharing that with me. Your feelings are valid and it's important that you're reaching out for support. Would you like to explore some coping strategies, or would you prefer to talk more about what's been going on? I'm here to help in whatever way feels most useful to you.";
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