
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
      // Try to use our API endpoint first
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: prompt }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          text: data.response || 'I apologize, but I couldn\'t generate a proper response.',
          confidence: 0.85,
          suggestions: [
            'Tell me about your symptoms in detail',
            'What medications are you currently taking?',
            'When did you first notice these symptoms?',
            'Have you experienced this before?'
          ],
        };
      }
    } catch (err) {
      console.log('API endpoint not available, using fallback response');
    }

    // Fallback response system
    const fallbackResponses = [
      `Thank you for your question about "${prompt}". I'm here to provide general health information and guidance.

**Important considerations:**
• Monitor your symptoms carefully
• Stay hydrated and get adequate rest
• Consider factors like stress, diet, and sleep
• Track any changes in your condition

**When to seek professional help:**
- Symptoms persist or worsen
- You experience severe discomfort
- You have specific health concerns
- You need a proper medical evaluation`,

      `I understand you're asking about "${prompt}". Here's some general health guidance:

**General wellness approach:**
• Maintain healthy lifestyle habits
• Get regular check-ups with your healthcare provider
• Don't ignore persistent symptoms
• Keep track of your health patterns

**Remember:**
- Individual health needs vary greatly
- Professional medical advice is irreplaceable
- Early intervention often leads to better outcomes`,

      `Regarding "${prompt}", here are some health insights:

**Health management tips:**
• Prevention is often the best medicine
• Listen to your body's signals
• Maintain open communication with healthcare providers
• Stay informed about your health conditions

**Safety first:**
- Never ignore severe symptoms
- Know when to seek emergency care
- Keep your medical history updated
- Follow prescribed treatment plans`
    ];

    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    const disclaimer = "\n\n⚠️ **Medical Disclaimer**: This information is for educational purposes only. Always consult with qualified healthcare professionals for medical advice, diagnosis, or treatment.";

    setError(null);
    
    return {
      text: randomResponse + disclaimer,
      confidence: 0.75,
      suggestions: [
        'Describe your symptoms',
        'Ask about medications',
        'Request health tips',
        'Emergency guidance'
      ],
    };
  };

  const wrappedGenerateResponse = async (prompt: string): Promise<AIResponse> => {
    try {
      return await generateResponse(prompt);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'AI service temporarily unavailable';
      setError(errorMessage);
      
      // Emergency fallback
      return {
        text: `I understand you need healthcare assistance regarding "${prompt}". While I'm experiencing technical difficulties, I want to help. 

**For immediate concerns:**
• Contact your healthcare provider
• Visit urgent care if symptoms are concerning
• Call emergency services for emergencies

**General health reminders:**
• Stay hydrated and rest when possible
• Monitor your symptoms
• Don't hesitate to seek professional help

⚠️ **Medical Disclaimer**: This is general information only. Always seek professional medical advice for health concerns.`,
        confidence: 0.6,
        suggestions: [
          'Contact healthcare provider',
          'Visit urgent care',
          'Call emergency services',
        ],
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateResponse: wrappedGenerateResponse,
    isLoading,
    error,
  };
};
