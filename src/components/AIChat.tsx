
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, Bot, User, Sparkles } from 'lucide-react';
import { useAI } from '@/hooks/useAI';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  confidence?: number;
  suggestions?: string[];
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI healthcare assistant. How can I help you today? I can provide general health information, help assess symptoms, or answer medication questions.',
      sender: 'ai',
      timestamp: new Date(),
      confidence: 1.0,
      suggestions: [
        'Tell me about your symptoms',
        'Medication information',
        'General health questions',
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
    } catch (err) {
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
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-medical-primary" />
          AI Healthcare Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4">
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
                      : 'bg-gray-100'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  
                  {message.confidence && message.sender === 'ai' && (
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Confidence: {Math.round(message.confidence * 100)}%
                      </Badge>
                    </div>
                  )}
                  
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 space-y-1">
                      <p className="text-xs font-medium opacity-70">Try asking:</p>
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="mr-2 mb-1 text-xs h-7"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
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
                <div className="bg-gray-100 rounded-lg p-3 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">AI is thinking...</span>
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
            placeholder="Ask about symptoms, medications, or health concerns..."
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
        
        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </p>
        )}
        
        <p className="text-xs text-gray-500 text-center">
          This AI assistant provides general information only. Always consult healthcare professionals for medical advice.
        </p>
      </CardContent>
    </Card>
  );
};

export default AIChat;
