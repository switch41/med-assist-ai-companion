
import { pipeline } from '@huggingface/transformers';

class BioGPTService {
  private static instance: BioGPTService;
  private generator: any = null;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): BioGPTService {
    if (!BioGPTService.instance) {
      BioGPTService.instance = new BioGPTService();
    }
    return BioGPTService.instance;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      console.log('Initializing BioGPT model...');
      this.generator = await pipeline(
        'text-generation',
        'microsoft/BioGPT-Large',
        { 
          device: 'cpu',
          max_new_tokens: 200,
          temperature: 0.7,
          do_sample: true
        }
      );
      this.isInitialized = true;
      console.log('BioGPT model initialized successfully');
    } catch (error) {
      console.error('Failed to initialize BioGPT:', error);
      this.isInitialized = false;
    }
  }

  async generateMedicalResponse(symptoms: string): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.generator) {
      return this.getFallbackResponse(symptoms);
    }

    try {
      const prompt = `Medical Assessment: Patient presents with ${symptoms}. Provide a professional medical analysis including possible conditions, recommendations, and when to seek care.`;
      
      const result = await this.generator(prompt, {
        max_new_tokens: 150,
        temperature: 0.7,
        do_sample: true,
        pad_token_id: 50256
      });

      let response = result[0]?.generated_text || '';
      response = response.replace(prompt, '').trim();
      
      return this.formatMedicalResponse(response, symptoms);
    } catch (error) {
      console.error('BioGPT generation error:', error);
      return this.getFallbackResponse(symptoms);
    }
  }

  private formatMedicalResponse(response: string, symptoms: string): string {
    const disclaimer = "\n\nIMPORTANT MEDICAL DISCLAIMER:\nThis information is for educational purposes only and is NOT intended to replace professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider before starting any treatment or medication. If this is a medical emergency, contact emergency services immediately.";
    
    return `SWITCH HEALTH CARE - MEDICAL ASSESSMENT

SYMPTOMS ANALYZED: ${symptoms}

CLINICAL ANALYSIS:
${response}

GENERAL RECOMMENDATIONS:
• Monitor symptoms closely for any changes
• Stay hydrated and get adequate rest
• Follow any existing treatment plans
• Document symptom progression and triggers

BASIC CARE GUIDELINES:
• Pain relief: Acetaminophen (500-1000mg every 6-8 hours) or Ibuprofen (200-400mg every 6-8 hours with food)
• Always follow package directions and check for allergies
• Stop use if adverse reactions occur

WHEN TO SEEK PROFESSIONAL CARE:
• Symptoms worsen or persist beyond expected timeframe
• New or concerning symptoms develop
• You have underlying health conditions
• Emergency warning signs appear${disclaimer}`;
  }

  private getFallbackResponse(symptoms: string): string {
    const lowerSymptoms = symptoms.toLowerCase();
    
    if (lowerSymptoms.includes('fever') || lowerSymptoms.includes('temperature')) {
      return this.formatMedicalResponse(`
Based on fever symptoms, this may indicate:
• Viral infections (common cold, flu, COVID-19)
• Bacterial infections (strep throat, UTI)
• Inflammatory conditions

IMMEDIATE CARE:
- Rest and increase fluid intake
- Fever reducers: Acetaminophen or Ibuprofen as directed
- Cool compresses and light clothing
- Monitor temperature regularly

SEEK IMMEDIATE CARE IF:
- Temperature exceeds 103°F (39.4°C)
- Persistent fever over 72 hours
- Difficulty breathing or severe symptoms`, symptoms);
    }

    if (lowerSymptoms.includes('headache')) {
      return this.formatMedicalResponse(`
Headache analysis suggests possible:
• Tension headaches (most common)
• Migraine episodes
• Dehydration or stress-related headaches
• Sinus pressure or eye strain

TREATMENT APPROACH:
- Rest in quiet, dark environment
- Adequate hydration (8-10 glasses water daily)
- Cold/warm compress application
- Stress reduction techniques

MEDICATION OPTIONS:
- Acetaminophen 500-1000mg every 6-8 hours
- Ibuprofen 200-400mg every 6-8 hours with food
- Avoid overuse to prevent rebound headaches`, symptoms);
    }

    return this.formatMedicalResponse(`
General health assessment for reported symptoms indicates need for careful monitoring and basic supportive care.

RECOMMENDED APPROACH:
• Symptom documentation and tracking
• Conservative management with rest and hydration
• Over-the-counter medications as appropriate
• Professional consultation if symptoms persist

This assessment provides general guidance. Individual cases may vary significantly requiring personalized medical evaluation.`, symptoms);
  }
}

export default BioGPTService;
