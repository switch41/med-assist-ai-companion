import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    symptoms?: string[];
    severity?: number;
    triageLevel?: 'emergency' | 'urgent' | 'routine';
    suggestedActions?: string[];
  };
}

export function ChatInterface() {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, error, sendMessage } = useChat();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    await sendMessage(input);
    setInput('');
  };

  const getTriageBadge = (level?: string) => {
    if (!level) return null;

    const variants = {
      emergency: 'destructive',
      urgent: 'warning',
      routine: 'default',
    } as const;

    return (
      <Badge variant={variants[level as keyof typeof variants]}>
        {level.toUpperCase()}
      </Badge>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[80vh] flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">MediAssist Chat</h2>
        <p className="text-sm text-muted-foreground">
          Your AI healthcare assistant
        </p>
      </div>

      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message: Message, index: number) => (
            <div
              key={index}
              className={cn(
                'flex gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8">
                  <div className="bg-primary text-primary-foreground flex h-full w-full items-center justify-center">
                    MA
                  </div>
                </Avatar>
              )}

              <div
                className={cn(
                  'rounded-lg p-4 max-w-[80%]',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">
                    {message.role === 'user' ? 'You' : 'MediAssist'}
                  </span>
                  {message.metadata?.triageLevel &&
                    getTriageBadge(message.metadata.triageLevel)}
                </div>

                <p className="whitespace-pre-wrap">{message.content}</p>

                {message.metadata?.suggestedActions && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Recommended Actions:</p>
                    <ul className="list-disc list-inside text-sm">
                      {message.metadata.suggestedActions.map((action, i) => (
                        <li key={i}>{action}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <span className="text-xs opacity-70 mt-2 block">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>

              {message.role === 'user' && (
                <Avatar className="h-8 w-8">
                  <div className="bg-secondary text-secondary-foreground flex h-full w-full items-center justify-center">
                    U
                  </div>
                </Avatar>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>MediAssist is thinking...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your symptoms or ask a question..."
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
    </Card>
  );
}
