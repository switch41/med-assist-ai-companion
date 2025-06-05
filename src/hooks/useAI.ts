
import { useState } from 'react';

interface AIResponse {
  text: string;
  confidence: number;
  suggestions?: string[];
}

interface UseAIReturn {
  generateResponse: (prompt: string) => Promise<AIResponse>;
  isLoading: boolean;
  error: string | null;
}

export const useAI = (): UseAIReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateResponse = async (prompt: string): Promise<AIResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // Using Hugging Face Inference API for healthcare AI model
      const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer hf_demo`, // Demo token - replace with real token for production
        },
        body: JSON.stringify({
          inputs: `Healthcare Assistant: ${prompt}`,
          parameters: {
            max_length: 200,
            temperature: 0.7,
            do_sample: true,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      return {
        text: data[0]?.generated_text || 'I apologize, but I cannot provide a response at this time. Please try again.',
        confidence: 0.8,
        suggestions: [
          'Tell me about your symptoms',
          'What medications are you taking?',
          'Schedule an appointment',
        ],
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'AI service unavailable';
      setError(errorMessage);
      
      // Fallback response for demo purposes
      return {
        text: 'I understand you need healthcare assistance. As an AI assistant, I can help with general health information, but please remember that I cannot replace professional medical advice.',
        confidence: 0.6,
        suggestions: [
          'Describe your symptoms',
          'Ask about medications',
          'Request health tips',
        ],
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateResponse,
    isLoading,
    error,
  };
};
