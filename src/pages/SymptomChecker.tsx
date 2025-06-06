
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Send, Plus, Loader2, User, Bot } from 'lucide-react';
import { useAI } from '@/hooks/useAI';
import { useToast } from '@/hooks/use-toast';
import AddVitalsDialog from '@/components/AddVitalsDialog';
import FileUpload from '@/components/FileUpload';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SymptomChecker = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your Switch Health Care AI assistant. How are you feeling today? Please describe your symptoms or health concerns.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { generateResponse, isLoading, error } = useAI();
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await generateResponse(input.trim());
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.text,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error getting AI response:', err);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleVitalAdded = () => {
    toast({
      title: "Success",
      description: "Vital signs added successfully and will be monitored by our AI.",
    });
  };

  const handleHealthRecordUpload = () => {
    toast({
      title: "Success",
      description: "Health record uploaded and will be analyzed for better care recommendations.",
    });
  };

  return (
    <div className="flex-1 p-6 overflow-hidden">
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <Activity className="mr-2 h-6 w-6 text-medical-primary" />
            Switch Health Care AI Assistant
          </h1>
          <div className="flex gap-2">
            <AddVitalsDialog onVitalAdded={handleVitalAdded} />
            {userId && (
              <div className="hidden">
                <FileUpload 
                  type="records" 
                  userId={userId}
                  onUploadSuccess={handleHealthRecordUpload}
                />
              </div>
            )}
          </div>
        </div>

        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">Chat with AI Doctor</CardTitle>
            <p className="text-sm text-muted-foreground">
              Describe your symptoms for AI-powered health assessment
            </p>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea ref={scrollRef} className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-medical-primary flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === 'user'
                          ? 'bg-medical-primary text-white'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <span className="text-xs opacity-70 mt-2 block">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>

                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Switch Health Care thinking...</span>
                  </div>
                )}

                {error && (
                  <div className="text-destructive text-sm">
                    Error: {error}
                  </div>
                )}
              </div>
            </ScrollArea>

            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your symptoms or ask a health question..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !input.trim()}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-4 grid md:grid-cols-2 gap-4">
          {userId && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Upload Health Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload 
                  type="records" 
                  userId={userId}
                  onUploadSuccess={handleHealthRecordUpload}
                />
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Wearable Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Connect your wearable devices for continuous health monitoring
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" disabled>
                  Apple HealthKit (Coming Soon)
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled>
                  Google Fit (Coming Soon)
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled>
                  Samsung Health (Coming Soon)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <p className="text-sm text-muted-foreground mt-4 text-center">
          ⚠️ This AI assistant provides general health information only and is not a substitute for professional medical advice. 
          For emergencies, contact emergency services immediately.
        </p>
      </div>
    </div>
  );
};

export default SymptomChecker;
