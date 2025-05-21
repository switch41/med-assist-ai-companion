
import React, { useState, useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessage, { Message } from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ChatContainerProps {
  onMenuToggle: () => void;
}

// Enhanced symptom assessment responses with more medical context
const symptomResponses: Record<string, string[]> = {
  headache: [
    "I'm sorry to hear you're experiencing a headache. Could you tell me more about the pain? Is it sharp, dull, throbbing, or something else?",
    "How long have you been experiencing this headache?",
    "On a scale of 1-10, how would you rate the pain?",
    "Based on your description, this could be a tension headache. Are you experiencing any stress or have you been looking at screens for long periods today?",
    "I recommend taking a break from screens, staying hydrated, and if appropriate, taking an over-the-counter pain reliever like acetaminophen or ibuprofen. If your headache persists for more than 24 hours or worsens significantly, please consult a healthcare provider."
  ],
  fever: [
    "I understand you're experiencing a fever. What's your current temperature reading?",
    "Are you experiencing any other symptoms alongside the fever, such as cough, sore throat, or body aches?",
    "How long have you had this fever?",
    "Based on your temperature and symptoms, this could be a viral infection. It's important to rest and stay hydrated.",
    "I recommend drinking plenty of fluids, getting rest, and taking acetaminophen to help reduce the fever. If your temperature exceeds 103°F (39.4°C) or lasts more than three days, please seek medical attention immediately."
  ],
  cough: [
    "I'm sorry to hear about your cough. Is it a dry cough or are you coughing up phlegm?",
    "How long have you been coughing?",
    "Are you experiencing any other symptoms like fever, shortness of breath, or chest pain?",
    "Based on your description, this sounds like it could be a viral upper respiratory infection or common cold.",
    "I recommend staying well-hydrated, using honey (if over 1 year old) for cough relief, and getting plenty of rest. If you develop difficulty breathing, persistent high fever, or the cough lasts more than 2 weeks, please consult a healthcare provider."
  ],
  chest: [
    "I notice you mentioned chest symptoms. Are you experiencing chest pain, pressure, tightness, or discomfort?",
    "When did these symptoms start and are they constant or do they come and go?",
    "Are you experiencing any shortness of breath, sweating, nausea, or pain radiating to your arm, neck, or jaw?",
    "Chest symptoms can sometimes indicate serious conditions requiring immediate medical attention.",
    "Based on your description, I strongly recommend seeking immediate medical attention. Chest pain or discomfort could be a sign of a serious cardiovascular issue and should be evaluated by a healthcare professional right away."
  ],
  anxiety: [
    "I understand you're experiencing anxiety. Can you tell me more about what you're feeling?",
    "How long have you been experiencing these symptoms?",
    "Are there any specific triggers you've noticed that worsen your anxiety?",
    "Anxiety is a common condition that can manifest with both physical and psychological symptoms.",
    "I recommend practicing deep breathing exercises, mindfulness meditation, and considering speaking with a mental health professional. Regular exercise and good sleep hygiene can also help manage anxiety symptoms."
  ]
};

// Default welcome messages
const welcomeMessages: Message[] = [
  {
    id: '1',
    content: "Hello! I'm MediAssist, your healthcare assistant. How can I help you today?",
    sender: 'bot',
    timestamp: new Date()
  },
  {
    id: '2',
    content: "I can help with symptom assessment, medication reminders, or general health questions. Please note that I'm not a replacement for professional medical care.",
    sender: 'bot',
    timestamp: new Date()
  }
];

const ChatContainer: React.FC<ChatContainerProps> = ({ onMenuToggle }) => {
  const [messages, setMessages] = useState<Message[]>(welcomeMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setUserId(data.session.user.id);
        loadChatHistory(data.session.user.id);
      }
    };
    
    checkAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        loadChatHistory(session.user.id);
      } else {
        setUserId(null);
        setMessages(welcomeMessages);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Load chat history from database
  const loadChatHistory = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: true });
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const formattedMessages: Message[] = data.map(msg => ({
          id: msg.id,
          content: msg.message,
          sender: msg.sender as 'user' | 'bot',
          timestamp: new Date(msg.timestamp)
        }));
        
        setMessages([...welcomeMessages, ...formattedMessages]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      toast.error('Failed to load chat history');
    }
  };
  
  // Save message to database
  const saveMessage = async (message: Message) => {
    if (!userId) return;
    
    try {
      await supabase.from('chat_history').insert({
        user_id: userId,
        message: message.content,
        sender: message.sender,
        timestamp: message.timestamp.toISOString()
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };
  
  // Function to handle new user messages
  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Save user message to database if logged in
    if (userId) {
      saveMessage(newMessage);
    }
    
    processUserMessage(content);
  };
  
  // Function to process user message and generate bot response
  const processUserMessage = (content: string) => {
    setIsTyping(true);
    
    // Simple keyword matching for demo purposes
    const lowerContent = content.toLowerCase();
    let responseSequence: string[] = [];
    
    if (lowerContent.includes('headache')) {
      responseSequence = symptomResponses.headache;
    } else if (lowerContent.includes('fever')) {
      responseSequence = symptomResponses.fever;
    } else if (lowerContent.includes('cough')) {
      responseSequence = symptomResponses.cough;
    } else if (lowerContent.includes('chest') || lowerContent.includes('heart')) {
      responseSequence = symptomResponses.chest;
      // Demonstrate emergency response for chest pain
      toast.error("Chest pain can be serious. If severe, please call emergency services immediately.", {
        duration: 10000,
      });
    } else if (lowerContent.includes('anxiety') || lowerContent.includes('stress') || lowerContent.includes('worry')) {
      responseSequence = symptomResponses.anxiety;
    } else if (lowerContent.includes('emergency') || lowerContent.includes('urgent')) {
      // Demonstrate emergency response
      toast.error("If this is a medical emergency, please call emergency services immediately (911 in the US).", {
        duration: 10000,
      });
      responseSequence = ["This sounds like it might require urgent medical attention. Please contact emergency services or go to your nearest emergency room if you're experiencing a serious medical issue."];
    } else {
      // Generic response for unrecognized queries
      responseSequence = ["I understand you're asking about something health-related. Could you provide more specific details about your symptoms or concerns?"];
    }
    
    // Send the first response after a short delay
    setTimeout(() => {
      addBotMessage(responseSequence[0]);
      setIsTyping(false);
      
      // For demo purposes: if there are follow-up responses, send them sequentially
      if (responseSequence.length > 1) {
        let responseIndex = 1;
        
        const interval = setInterval(() => {
          if (responseIndex < responseSequence.length) {
            setIsTyping(true);
            
            setTimeout(() => {
              addBotMessage(responseSequence[responseIndex]);
              setIsTyping(false);
              responseIndex++;
            }, 1500);
          } else {
            clearInterval(interval);
          }
        }, 3000);
      }
    }, 1500);
  };
  
  // Function to add a bot message
  const addBotMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'bot',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Save bot message to database if logged in
    if (userId) {
      saveMessage(newMessage);
    }
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <ChatHeader onMenuToggle={onMenuToggle} />
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isTyping && (
            <div className="ml-2 mb-4">
              <TypingIndicator />
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSendMessage={handleSendMessage} isProcessing={isTyping} />
          <div className="text-xs text-center text-gray-500 mt-2">
            MediAssist is for informational purposes only. Always consult a healthcare professional for medical advice.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
