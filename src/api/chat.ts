
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
    const generateMedicalResponse = (query: string) => {
      const lowerQuery = query.toLowerCase();
      
      if (lowerQuery.includes('fever') || lowerQuery.includes('temperature')) {
        return `SWITCH HEALTH CARE - SYMPTOM ANALYSIS: Fever

POSSIBLE CONDITIONS:
• Viral infections (influenza, common cold, COVID-19)
• Bacterial infections (strep throat, urinary tract infection)
• Inflammatory conditions or autoimmune responses
• Heat-related illness or dehydration

LIKELY UNDERLYING CAUSES:
• Body's natural immune response to infection
• Inflammatory cascade activation
• Bacterial or viral pathogen presence
• Environmental heat exposure or dehydration

EVIDENCE-BASED TREATMENT PLAN:
1. IMMEDIATE CARE MEASURES:
   - Acetaminophen: 650-1000mg every 6 hours (maximum 3000mg daily)
   - Ibuprofen: 400-600mg every 6-8 hours (take with food)
   - Increase fluid intake: 8-12 glasses of water throughout the day
   - Rest in cool, well-ventilated environment

2. SUPPORTIVE INTERVENTIONS:
   - Light, breathable clothing and bedding
   - Cool compresses applied to forehead and pulse points
   - Electrolyte replacement with clear fluids
   - Monitor temperature every 4-6 hours

3. MEDICATION GUIDELINES:
   - Alternate acetaminophen and ibuprofen if needed
   - Follow package directions strictly
   - Check for drug allergies before use
   - Avoid aspirin in children under 18

URGENT MEDICAL ATTENTION REQUIRED IF:
- Temperature exceeds 103°F (39.4°C)
- Persistent fever lasting more than 72 hours
- Difficulty breathing or chest pain
- Severe headache with neck stiffness
- Signs of dehydration (dizziness, dry mouth, decreased urination)
- Altered mental status or confusion`;
      }

      if (lowerQuery.includes('cough')) {
        return `SWITCH HEALTH CARE - SYMPTOM ANALYSIS: Cough

POSSIBLE CONDITIONS:
• Upper respiratory tract infection (viral or bacterial)
• Acute bronchitis or pneumonia
• Allergic rhinitis or environmental irritants
• Asthma exacerbation or COPD flare
• Gastroesophageal reflux disease (GERD)

LIKELY UNDERLYING CAUSES:
• Viral pathogens (rhinovirus, influenza, RSV)
• Bacterial infections (Streptococcus, Haemophilus)
• Airway inflammation and irritation
• Postnasal drip from sinus congestion
• Acid reflux causing throat irritation

EVIDENCE-BASED TREATMENT PLAN:
1. IMMEDIATE CARE MEASURES:
   - Increase fluid intake (warm liquids preferred)
   - Honey 1-2 teaspoons for throat coating (not for children under 1 year)
   - Humidifier use or steam inhalation therapy
   - Throat lozenges or warm salt water gargling

2. MEDICATION OPTIONS:
   - Dextromethorphan: 15mg every 4 hours for dry cough
   - Guaifenesin: 200-400mg every 4 hours for productive cough
   - Avoid cough suppressants if cough is productive

3. ENVIRONMENTAL MODIFICATIONS:
   - Eliminate smoking and secondhand smoke exposure
   - Use air purifiers to reduce allergens
   - Maintain adequate humidity levels (40-50%)
   - Avoid known triggers and irritants

URGENT MEDICAL ATTENTION REQUIRED IF:
- Cough persists longer than 3 weeks
- Blood in sputum or hemoptysis
- High fever with productive, colored sputum
- Severe difficulty breathing or wheezing
- Chest pain accompanying cough episodes`;
      }

      if (lowerQuery.includes('headache') || lowerQuery.includes('head pain')) {
        return `SWITCH HEALTH CARE - SYMPTOM ANALYSIS: Headache

POSSIBLE CONDITIONS:
• Tension-type headache (most common presentation)
• Migraine with or without aura
• Sinus headache from congestion or infection
• Dehydration or caffeine withdrawal headache
• Stress-induced or muscle tension headache

LIKELY UNDERLYING CAUSES:
• Muscle tension in neck, shoulders, and scalp
• Vascular changes and inflammation
• Dehydration or electrolyte imbalance
• Sleep deprivation or irregular sleep patterns
• Hormonal fluctuations or stress responses

EVIDENCE-BASED TREATMENT PLAN:
1. IMMEDIATE RELIEF MEASURES:
   - Rest in quiet, darkened environment
   - Apply cold compress to forehead or warm compress to neck
   - Gentle scalp and neck massage techniques
   - Adequate hydration (8-12 glasses water daily)

2. MEDICATION PROTOCOLS:
   - Acetaminophen: 500-1000mg every 6-8 hours
   - Ibuprofen: 200-400mg every 6-8 hours (with food)
   - Avoid medication overuse (limit to 2-3 days per week)

3. LIFESTYLE INTERVENTIONS:
   - Regular sleep schedule (7-9 hours nightly)
   - Stress management and relaxation techniques
   - Regular meals to maintain blood sugar levels
   - Limit screen time and eye strain

URGENT MEDICAL ATTENTION REQUIRED IF:
- Sudden, severe headache ("thunderclap" presentation)
- Headache with fever, stiff neck, or skin rash
- Progressive worsening over days or weeks
- Changes in vision, speech, or coordination
- Headache following head trauma or injury`;
      }

      if (lowerQuery.includes('stomach') || lowerQuery.includes('nausea') || lowerQuery.includes('vomit')) {
        return `SWITCH HEALTH CARE - SYMPTOM ANALYSIS: Gastrointestinal Symptoms

POSSIBLE CONDITIONS:
• Viral gastroenteritis (stomach flu)
• Food poisoning or foodborne illness
• Gastroesophageal reflux disease (GERD)
• Stress-induced gastritis or functional dyspepsia
• Medication-induced gastrointestinal irritation

LIKELY UNDERLYING CAUSES:
• Viral pathogens (norovirus, rotavirus)
• Bacterial contamination (Salmonella, Campylobacter)
• Toxin exposure from contaminated food sources
• Stress hormones affecting gastric function
• Medication side effects or interactions

EVIDENCE-BASED TREATMENT PLAN:
1. IMMEDIATE CARE MEASURES:
   - Clear liquid diet: water, clear broths, electrolyte solutions
   - BRAT diet progression: Bananas, Rice, Applesauce, Toast
   - Small, frequent meals rather than large portions
   - Avoid dairy, caffeine, alcohol, and fatty foods

2. HYDRATION PROTOCOL:
   - Oral rehydration solutions or electrolyte drinks
   - Small sips every 15-20 minutes initially
   - Progress to larger amounts as tolerance improves
   - Monitor for signs of dehydration

3. MEDICATION OPTIONS:
   - Ondansetron (Zofran): 4-8mg every 8 hours for nausea
   - Bismuth subsalicylate: 262mg every 30 minutes as needed
   - Avoid anti-diarrheal medications if fever present

URGENT MEDICAL ATTENTION REQUIRED IF:
- Persistent vomiting preventing fluid retention
- Signs of severe dehydration (dizziness, rapid pulse)
- Severe abdominal pain or cramping
- Blood in vomit or stool
- High fever accompanying gastrointestinal symptoms`;
      }

      return `SWITCH HEALTH CARE - GENERAL HEALTH ASSESSMENT

Based on your inquiry about "${query}":

SYSTEMATIC EVALUATION APPROACH:
• Comprehensive symptom assessment with timeline documentation
• Review of associated symptoms and potential triggers
• Consideration of recent activities, exposures, and changes
• Evaluation of current medications and medical history

GENERAL WELLNESS PROTOCOL:
1. MONITORING GUIDELINES:
   - Document symptom onset, duration, and progression
   - Rate severity on scale of 1-10 for tracking
   - Note any factors that worsen or improve symptoms
   - Track response to initial treatment measures

2. BASIC CARE RECOMMENDATIONS:
   - Adequate rest and sleep (7-9 hours nightly)
   - Proper hydration (8-12 glasses water daily)
   - Balanced nutrition with regular meal timing
   - Stress reduction and relaxation techniques

3. MEDICATION SAFETY:
   - Acetaminophen: 500-1000mg every 6-8 hours (max 3000mg daily)
   - Ibuprofen: 200-400mg every 6-8 hours with food
   - Always check for allergies and drug interactions
   - Follow package directions and contraindications

PROFESSIONAL CONSULTATION RECOMMENDED WHEN:
- Symptoms persist or worsen despite initial treatment
- New or concerning symptoms develop
- Underlying health conditions require consideration
- Medication interactions or contraindications exist`;
    };

    const medicalResponse = generateMedicalResponse(message);
    
    const disclaimer = `

⚠️ IMPORTANT MEDICAL DISCLAIMER:
This information is provided by Switch Health Care for educational purposes only and is NOT intended to replace professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider before starting any treatment or medication. If this is a medical emergency, contact emergency services (911) immediately.

MEDICATION SAFETY GUIDELINES:
- Follow all package directions and dosing instructions carefully
- Check for drug allergies and potential interactions
- Consult pharmacist or healthcare provider before combining medications
- Discontinue use if adverse reactions occur and seek medical attention`;

    return res.status(200).json({
      response: medicalResponse + disclaimer,
      source: 'Switch Health Care AI Assistant'
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Server error',
      message: 'Please try again later'
    });
  }
}
