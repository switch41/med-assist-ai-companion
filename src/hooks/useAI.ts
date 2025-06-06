
import { useState } from 'react';
import BioGPTService from '@/services/bioGPTService';

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
      // Try to use our API endpoint with BioGPT first
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
          confidence: 0.95,
          suggestions: [
            'Describe specific symptoms in detail',
            'Ask about medication interactions',
            'Emergency warning signs',
            'When to see a healthcare provider'
          ],
        };
      }
    } catch (err) {
      console.log('API endpoint not available, using BioGPT locally');
    }

    // Fallback to local BioGPT processing
    try {
      const bioGPT = BioGPTService.getInstance();
      const medicalResponse = await bioGPT.generateMedicalResponse(prompt);
      
      return {
        text: medicalResponse,
        confidence: 0.9,
        suggestions: [
          'Ask about specific symptoms',
          'Medication safety questions',
          'Treatment timeline questions',
          'Follow-up care guidance'
        ],
      };
    } catch (bioGPTError) {
      console.error('BioGPT processing failed:', bioGPTError);
      
      // Professional fallback response
      const fallbackResponse = `SWITCH HEALTH CARE - MEDICAL CONSULTATION

Thank you for your health inquiry regarding: "${prompt}"

ASSESSMENT APPROACH:
Due to technical limitations, I recommend:

IMMEDIATE STEPS:
• Document your symptoms with timing and severity
• Monitor for any changes or worsening
• Consider basic supportive care (rest, hydration)
• Review any current medications for interactions

PROFESSIONAL CONSULTATION:
For proper medical evaluation and personalized treatment recommendations, please:
• Contact your primary care physician
• Visit urgent care for non-emergency concerns
• Call emergency services for severe symptoms

GENERAL WELLNESS:
• Maintain adequate hydration (8-10 glasses daily)
• Ensure sufficient rest (7-9 hours sleep)
• Follow existing treatment plans
• Practice stress management techniques

⚠️ IMPORTANT MEDICAL DISCLAIMER:
This information is for educational purposes only and is NOT intended to replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical advice. For medical emergencies, contact emergency services immediately.`;

      return {
        text: fallbackResponse,
        confidence: 0.7,
        suggestions: [
          'Contact healthcare provider',
          'Visit urgent care facility',
          'Call emergency services if severe',
        ],
      };
    } finally {
      setIsLoading(false);
    }
  };

  const wrappedGenerateResponse = async (prompt: string): Promise<AIResponse> => {
    try {
      return await generateResponse(prompt);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'AI service temporarily unavailable';
      setError(errorMessage);
      
      return {
        text: `SWITCH HEALTH CARE - SYSTEM NOTICE

I understand you need healthcare assistance regarding "${prompt}". While experiencing technical difficulties, here's essential guidance:

IMMEDIATE ACTIONS:
• For urgent concerns: Contact your healthcare provider immediately
• For emergencies: Call emergency services (911)
• For routine questions: Schedule appointment with your doctor

HEALTH SAFETY REMINDERS:
• Document all symptoms with timing and severity
• Stay hydrated and maintain adequate rest
• Follow any existing medical treatment plans
• Don't hesitate to seek professional help when needed

⚠️ Important: This is general information only. Always seek professional medical advice for health concerns.`,
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
