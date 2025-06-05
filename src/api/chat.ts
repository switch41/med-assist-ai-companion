
export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // Enhanced medical response system
    const generateMedicalResponse = (query: string) => {
      const lowerQuery = query.toLowerCase();
      
      // Symptom-based responses
      if (lowerQuery.includes('fever') || lowerQuery.includes('temperature')) {
        return `SYMPTOM ANALYSIS: Fever

POSSIBLE CONDITIONS:
• Viral infections (common cold, flu)
• Bacterial infections (strep throat, UTI)
• COVID-19 or other respiratory illnesses
• Inflammatory conditions

LIKELY CAUSES:
• Body's immune response to infection
• Dehydration or heat exhaustion
• Medication side effects
• Autoimmune disorders

BASIC CARE GUIDELINES:
• Rest and adequate sleep (8+ hours)
• Increase fluid intake (water, clear broths)
• Use fever reducers: Acetaminophen (500-1000mg every 6-8 hours) or Ibuprofen (200-400mg every 6-8 hours)
• Cool compresses on forehead
• Light, breathable clothing

SEEK MEDICAL ATTENTION IF:
- Fever above 103°F (39.4°C)
- Persistent fever for more than 3 days
- Difficulty breathing or chest pain
- Severe headache or neck stiffness
- Signs of dehydration`;
      }

      if (lowerQuery.includes('cough')) {
        return `SYMPTOM ANALYSIS: Cough

POSSIBLE CONDITIONS:
• Upper respiratory tract infection
• Bronchitis or pneumonia
• Allergic reactions
• Asthma exacerbation
• GERD (acid reflux)

LIKELY CAUSES:
• Viral or bacterial infection
• Environmental irritants (smoke, dust)
• Postnasal drip
• Chronic conditions (asthma, COPD)

BASIC CARE GUIDELINES:
• Stay hydrated (warm liquids preferred)
• Honey (1-2 teaspoons) for throat soothing
• Humidifier or steam inhalation
• Throat lozenges or salt water gargle
• Avoid smoking and irritants
• Over-the-counter: Dextromethorphan (15mg every 4 hours) for dry cough

SEEK MEDICAL ATTENTION IF:
- Cough persists longer than 3 weeks
- Blood in sputum
- High fever with productive cough
- Difficulty breathing or wheezing
- Chest pain with coughing`;
      }

      if (lowerQuery.includes('headache') || lowerQuery.includes('head pain')) {
        return `SYMPTOM ANALYSIS: Headache

POSSIBLE CONDITIONS:
• Tension headache (most common)
• Migraine headache
• Sinus infection
• Dehydration headache
• Stress-related headache

LIKELY CAUSES:
• Stress and muscle tension
• Dehydration or lack of sleep
• Eye strain from screens
• Hormonal changes
• Certain foods or caffeine withdrawal

BASIC CARE GUIDELINES:
• Rest in a quiet, dark room
• Apply cold or warm compress to head/neck
• Stay hydrated (8-10 glasses of water daily)
• Gentle neck and shoulder massage
• Pain relievers: Acetaminophen (500-1000mg) or Ibuprofen (200-400mg)
• Regular sleep schedule (7-9 hours)

SEEK MEDICAL ATTENTION IF:
- Sudden, severe headache ("worst headache of life")
- Headache with fever, stiff neck, or rash
- Changes in vision or speech
- Headache after head injury
- Progressively worsening headaches`;
      }

      if (lowerQuery.includes('stomach') || lowerQuery.includes('nausea') || lowerQuery.includes('vomit')) {
        return `SYMPTOM ANALYSIS: Stomach Issues/Nausea

POSSIBLE CONDITIONS:
• Gastroenteritis (stomach flu)
• Food poisoning
• Acid reflux or GERD
• Stress-related gastritis
• Medication side effects

LIKELY CAUSES:
• Viral or bacterial infection
• Contaminated food or water
• Stress and anxiety
• Certain medications
• Overeating or spicy foods

BASIC CARE GUIDELINES:
• Clear liquids (water, clear broths, electrolyte solutions)
• BRAT diet: Bananas, Rice, Applesauce, Toast
• Small, frequent meals
• Avoid dairy, caffeine, and fatty foods
• Ginger tea or ginger supplements
• Anti-nausea: Dramamine (25-50mg every 4-6 hours)

SEEK MEDICAL ATTENTION IF:
- Persistent vomiting for more than 24 hours
- Signs of dehydration (dizziness, dry mouth)
- Severe abdominal pain
- Blood in vomit or stool
- High fever with stomach symptoms`;
      }

      // General health inquiry response
      return `HEALTH ASSESSMENT: General Inquiry

Based on your question about "${query}":

RECOMMENDED APPROACH:
• Monitor symptoms carefully for 24-48 hours
• Keep a symptom diary (timing, severity, triggers)
• Maintain good hydration and rest
• Consider lifestyle factors (stress, diet, sleep)

GENERAL WELLNESS GUIDELINES:
• Adequate sleep (7-9 hours nightly)
• Balanced nutrition with fruits and vegetables
• Regular physical activity (30 minutes daily)
• Stress management techniques
• Avoid smoking and limit alcohol

BASIC MEDICATIONS (if appropriate):
• Pain relief: Acetaminophen or Ibuprofen (follow package directions)
• Hydration: Electrolyte solutions
• Vitamins: Multivitamin if dietary intake is poor

WHEN TO SEEK PROFESSIONAL CARE:
- Symptoms worsen or persist beyond normal timeframe
- New or concerning symptoms develop
- You have underlying health conditions
- Medication interactions are a concern`;
    };

    const medicalResponse = generateMedicalResponse(message);
    
    const disclaimer = `

⚠️ IMPORTANT MEDICAL DISCLAIMER:
This information is for educational purposes only and is NOT intended to replace professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider before starting any treatment or medication. If this is a medical emergency, contact emergency services (911) immediately.

MEDICATION GUIDELINES:
- Follow all package directions and dosing instructions
- Check for drug allergies and interactions
- Consult pharmacist or doctor before combining medications
- Stop use if adverse reactions occur`;

    return res.status(200).json({
      response: medicalResponse + disclaimer,
      source: 'AI Medical Assistant'
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Server error',
      message: 'Please try again later'
    });
  }
}
