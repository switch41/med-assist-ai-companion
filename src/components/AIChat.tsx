import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, Bot, User, Sparkles, AlertTriangle, Heart } from 'lucide-react';
import { useAI } from '@/hooks/useAI';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  confidence?: number;
  suggestions?: string[];
  isError?: boolean;
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! I\'m your Switch Health Care AI assistant powered by Microsoft BioGPT. I can provide professional medical analysis, symptom assessment, and healthcare guidance. How can I help you today?',
      sender: 'ai',
      timestamp: new Date(),
      confidence: 1.0,
      suggestions: [
        'Describe your symptoms in detail',
        'Ask about medication interactions',
        'General health and wellness questions',
        'Emergency guidance and when to seek care'
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const { generateResponse, isLoading, error } = useAI();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');

    try {
      const aiResponse = await generateResponse(currentInput);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.text,
        sender: 'ai',
        timestamp: new Date(),
        confidence: aiResponse.confidence,
        suggestions: aiResponse.suggestions,
      };

      setMessages(prev => [...prev, aiMessage]);
      
      if (aiResponse.confidence && aiResponse.confidence < 0.7) {
        toast.warning("Response confidence is low. Please consult a healthcare professional for important medical decisions.");
      }
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        text: `❌ Switch Health Care AI is experiencing technical difficulties. Please try again or contact a healthcare professional if you have urgent medical concerns.\n\n⚠️ For medical emergencies, contact emergency services immediately.`,
        sender: 'ai',
        timestamp: new Date(),
        isError: true,
      };
      
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to get AI response. Please try again.');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="h-[600px] flex flex-col shadow-lg">
        <CardHeader className="bg-gradient-to-r from-medical-primary to-blue-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Switch Health Care - AI Assistant (BioGPT)
            <Badge variant="secondary" className="ml-auto bg-white/20 text-white">
              Active
            </Badge>
          </CardTitle>
          <p className="text-blue-100 text-sm">Professional medical analysis powered by Microsoft BioGPT</p>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col gap-4 p-4">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                <p className="text-sm text-red-700">
                  <strong>Connection Issue:</strong> {error}
                </p>
              </div>
            </div>
          )}

          <ScrollArea ref={scrollRef} className="flex-1 h-96">
            <div className="space-y-4 pr-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'ai' && (
                    <div className="flex-shrink-0 bg-medical-primary/10 rounded-full p-2">
                      <Bot className="h-4 w-4 text-medical-primary" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-medical-primary text-white'
                        : message.isError
                        ? 'bg-red-50 text-red-800 border border-red-200'
                        : 'bg-gray-50 border'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">{message.text}</div>
                    
                    {message.confidence && message.sender === 'ai' && !message.isError && (
                      <div className="mt-2 flex items-center gap-2">
                        <Badge 
                          variant={message.confidence > 0.8 ? "default" : "secondary"} 
                          className="text-xs"
                        >
                          BioGPT Confidence: {Math.round(message.confidence * 100)}%
                        </Badge>
                      </div>
                    )}
                    
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 space-y-1">
                        <p className="text-xs font-medium opacity-70">Try asking:</p>
                        <div className="flex flex-wrap gap-1">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs h-6 px-2"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <span className="text-xs opacity-50 mt-2 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  {message.sender === 'user' && (
                    <div className="flex-shrink-0 bg-medical-primary/10 rounded-full p-2">
                      <User className="h-4 w-4 text-medical-primary" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 bg-medical-primary/10 rounded-full p-2">
                    <Bot className="h-4 w-4 text-medical-primary" />
                  </div>
                  <div className="bg-gray-50 border rounded-lg p-3 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-medical-primary" />
                    <span className="text-sm">BioGPT is analyzing your symptoms...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your symptoms, ask about medications, or request health guidance..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="bg-medical-primary hover:bg-medical-accent"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-xs text-yellow-800">
                <strong>Important:</strong> This AI assistant provides medical analysis using Microsoft BioGPT but is not a substitute for professional medical care. For medical emergencies, contact emergency services immediately.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIChat;
