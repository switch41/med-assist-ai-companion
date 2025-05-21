
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatContainer from '../components/ChatContainer';
import Sidebar from '../components/Sidebar';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  const handleLoginClick = () => {
    navigate('/auth');
  };
  
  return (
    <div className="relative h-screen flex overflow-hidden bg-medical-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Overlay to close sidebar on mobile */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
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
        <ChatContainer onMenuToggle={toggleSidebar} />
      </div>
      
      {showDisclaimer && <MedicalDisclaimer onAccept={handleAcceptDisclaimer} />}
    </div>
  );
};

export default Index;
