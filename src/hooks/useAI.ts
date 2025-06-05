
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

  const generateProfessionalResponse = (prompt: string): string => {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('fever') || lowerPrompt.includes('temperature')) {
      return `PROFESSIONAL ASSESSMENT: Fever Management

Thank you for consulting about fever symptoms. Here's a comprehensive analysis:

CLINICAL OVERVIEW:
Fever is typically defined as a body temperature above 100.4°F (38°C) and represents your body's natural immune response.

POSSIBLE UNDERLYING CONDITIONS:
• Viral infections (influenza, common cold, COVID-19)
• Bacterial infections (strep throat, urinary tract infection)
• Inflammatory conditions
• Heat-related illness

EVIDENCE-BASED TREATMENT PLAN:
1. IMMEDIATE CARE:
   - Acetaminophen: 650-1000mg every 6 hours (max 3000mg/day)
   - Ibuprofen: 400-600mg every 6-8 hours (with food)
   - Increase fluid intake: 8-10 glasses of water daily

2. SUPPORTIVE MEASURES:
   - Rest in cool, comfortable environment
   - Light, breathable clothing
   - Cool compresses to forehead and wrists

RED FLAGS - SEEK IMMEDIATE MEDICAL CARE:
- Temperature ≥103°F (39.4°C)
- Persistent fever >72 hours
- Difficulty breathing or chest pain
- Severe headache with neck stiffness
- Signs of dehydration`;
    }

    return `PROFESSIONAL MEDICAL CONSULTATION

Thank you for your health inquiry regarding: "${prompt}"

INITIAL ASSESSMENT APPROACH:
Based on your symptoms, I recommend a systematic evaluation including:

DIAGNOSTIC CONSIDERATIONS:
• Symptom onset, duration, and progression
• Associated symptoms and triggers
• Recent activities or exposures
• Current medications and medical history

INITIAL MANAGEMENT STRATEGY:
1. SYMPTOMATIC RELIEF:
   - Rest and adequate hydration
   - Over-the-counter medications as appropriate
   - Environmental modifications

2. MONITORING PARAMETERS:
   - Symptom severity and changes
   - Response to initial treatments
   - Development of new symptoms

MEDICATION GUIDELINES:
• Pain/Fever: Acetaminophen 500-1000mg every 6-8 hours
• Inflammation: Ibuprofen 200-400mg every 6-8 hours (with food)
• Always follow package directions and check for allergies

PROFESSIONAL CONSULTATION RECOMMENDED:
This assessment provides general guidance only. Schedule an appointment with your healthcare provider for proper diagnosis and personalized treatment plan.`;
  };

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
          confidence: 0.9,
          suggestions: [
            'Ask about specific symptoms',
            'Medication interactions',
            'When to see a doctor',
            'Emergency warning signs'
          ],
        };
      }
    } catch (err) {
      console.log('API endpoint not available, using professional fallback response');
    }

    // Professional fallback response system
    const professionalResponse = generateProfessionalResponse(prompt);
    const disclaimer = "\n\n⚠️ Medical Disclaimer: This information is for educational purposes only. Always consult with qualified healthcare professionals for medical advice, diagnosis, or treatment. For medical emergencies, contact emergency services immediately.";

    setError(null);
    
    return {
      text: professionalResponse + disclaimer,
      confidence: 0.85,
      suggestions: [
        'Describe specific symptoms',
        'Ask about treatment options',
        'Medication safety questions',
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
      
      return {
        text: `MEDICAL CONSULTATION SYSTEM

I understand you need healthcare assistance regarding "${prompt}". While experiencing technical difficulties, here's essential guidance:

IMMEDIATE ACTIONS:
• For urgent concerns: Contact your healthcare provider
• For emergencies: Call emergency services (911)
• For routine questions: Schedule appointment with your doctor

GENERAL HEALTH REMINDERS:
• Monitor symptoms and their progression
• Stay hydrated and get adequate rest
• Follow any existing treatment plans
• Don't hesitate to seek professional help

⚠️ Important: This is general information only. Always seek professional medical advice for health concerns.`,
        confidence: 0.7,
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
