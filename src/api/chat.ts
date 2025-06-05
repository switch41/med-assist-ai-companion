
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
    // Mock healthcare response for demo
    const mockResponses = [
      `Thank you for your medical question about "${message}". Based on your inquiry, here are some general health considerations:

• If you're experiencing symptoms, it's important to monitor them carefully
• Stay hydrated and get adequate rest
• Consider your recent activities, diet, and stress levels
• Track any changes or patterns in your symptoms

**When to seek medical attention:**
- Symptoms worsen or persist beyond a few days
- You experience severe pain or discomfort
- You have concerns about your condition

**Emergency warning signs:**
- Difficulty breathing
- Chest pain
- Severe allergic reactions
- Loss of consciousness`,

      `I understand you're asking about "${message}". Here's some general health guidance:

**General wellness tips:**
• Maintain a balanced diet with plenty of fruits and vegetables
• Get regular exercise appropriate for your fitness level
• Ensure adequate sleep (7-9 hours for adults)
• Practice stress management techniques
• Stay up to date with preventive care

**Remember:**
- Every person's health situation is unique
- Symptoms can have various causes
- Professional medical evaluation is often necessary for proper diagnosis`,

      `Regarding your question about "${message}", here are some health insights:

**Preventive measures:**
• Regular health check-ups can help detect issues early
• Maintain good hygiene practices
• Listen to your body and don't ignore persistent symptoms
• Keep a health journal to track patterns

**Lifestyle factors:**
- Diet and nutrition play a crucial role in health
- Physical activity supports overall well-being
- Mental health is equally important as physical health
- Social connections contribute to better health outcomes`
    ];

    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    
    const disclaimer = "\n\n⚠️ **Medical Disclaimer**: This information is for educational purposes only and is not intended to replace professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for medical concerns. If this is a medical emergency, contact emergency services immediately.";

    return res.status(200).json({
      response: randomResponse + disclaimer,
      source: 'AI Healthcare Assistant'
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Server error',
      message: 'Please try again later'
    });
  }
}
