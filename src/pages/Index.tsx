
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatContainer from '../components/ChatContainer';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

const Index = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if the disclaimer has been accepted before
    const hasAcceptedDisclaimer = localStorage.getItem('disclaimerAccepted');
    if (hasAcceptedDisclaimer === 'true') {
      setShowDisclaimer(false);
    }
    
    // Check authentication status
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    checkAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const handleAcceptDisclaimer = () => {
    localStorage.setItem('disclaimerAccepted', 'true');
    setShowDisclaimer(false);
    toast.success("Welcome to MediAssist! Type your health question to get started.", {
      duration: 5000,
    });
  };

  const handleLoginClick = () => {
    navigate('/auth');
  };
  
  return (
    <>
      {!isAuthenticated && (
        <div className="absolute top-4 right-4 z-50">
          <Button 
            onClick={handleLoginClick}
            className="bg-medical-primary hover:bg-medical-primary/90 flex items-center gap-2"
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </Button>
        </div>
      )}
      <ChatContainer onMenuToggle={() => {}} />
      
      {showDisclaimer && <MedicalDisclaimer onAccept={handleAcceptDisclaimer} />}
    </>
  );
};

export default Index;
