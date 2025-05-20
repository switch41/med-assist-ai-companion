import { useState, useCallback } from 'react';
import axios from 'axios';

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

interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Add user message immediately
      const userMessage: Message = {
        role: 'user',
        content,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);

      let response;
      if (!chatId) {
        // Create new chat
        response = await axios.post('/api/chat', {
          initialMessage: content,
        });
        setChatId(response.data.data._id);
      } else {
        // Add message to existing chat
        response = await axios.post(`/api/chat/${chatId}`, {
          content,
        });
      }

      // Add AI response
      const aiMessage: Message = {
        role: 'assistant',
        content: response.data.data.messages[response.data.data.messages.length - 1].content,
        timestamp: new Date(),
        metadata: response.data.data.messages[response.data.data.messages.length - 1].metadata,
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  }, [chatId]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
  };
} 