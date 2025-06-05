
import React, { useState, useEffect } from 'react';
import ChatContainer from '../components/ChatContainer';
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
    toast.success("Welcome to SwitchHealthCare! Type your health question to get started.", {
      duration: 5000,
    });
  };
  
  return (
    <>
      <ChatContainer onMenuToggle={() => {}} />
      
      {showDisclaimer && <MedicalDisclaimer onAccept={handleAcceptDisclaimer} />}
    </>
  );
};

export default Index;
