
import React, { useState, useEffect } from 'react';
import AIChat from '../components/AIChat';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import { toast } from 'sonner';

const Index = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  
  useEffect(() => {
    // Check if the disclaimer has been accepted before
    const hasAcceptedDisclaimer = localStorage.getItem('disclaimerAccepted');
    if (hasAcceptedDisclaimer === 'true') {
      setShowDisclaimer(false);
    }
  }, []);
  
  const handleAcceptDisclaimer = () => {
    localStorage.setItem('disclaimerAccepted', 'true');
    setShowDisclaimer(false);
    toast.success("Welcome to SwitchHealthCare! Ask your AI assistant any health questions.", {
      duration: 5000,
    });
  };
  
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-medical-primary">
          AI Healthcare Assistant
        </h1>
        <p className="text-gray-600 mb-6">
          Get instant AI-powered healthcare guidance, symptom assessment, and health information.
        </p>
        
        <AIChat />
      </div>
      
      {showDisclaimer && <MedicalDisclaimer onAccept={handleAcceptDisclaimer} />}
    </div>
  );
};

export default Index;
