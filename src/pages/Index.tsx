
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatContainer from '../components/ChatContainer';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, User } from 'lucide-react';

const Index = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
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
      setUser(data.session?.user || null);
      setIsLoading(false);
    };
    
    checkAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      setUser(session?.user || null);
      
      if (event === 'SIGNED_IN') {
        toast.success("Welcome to MediAssist!");
      } else if (event === 'SIGNED_OUT') {
        toast.success("Signed out successfully");
      }
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

  const handleLogoutClick = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error: any) {
      toast.error("Error signing out");
    }
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.first_name) {
      return `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`.trim();
    }
    return user?.email || 'User';
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
              <User className="h-4 w-4 text-medical-primary" />
              <span className="text-sm font-medium text-gray-700">
                {getUserDisplayName()}
              </span>
            </div>
            <Button 
              onClick={handleLogoutClick}
              variant="outline"
              size="sm"
              className="bg-white/90 backdrop-blur-sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        ) : (
          <Button 
            onClick={handleLoginClick}
            className="bg-medical-primary hover:bg-medical-primary/90 flex items-center gap-2"
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </Button>
        )}
      </div>
      
      <ChatContainer onMenuToggle={() => {}} />
      
      {showDisclaimer && <MedicalDisclaimer onAccept={handleAcceptDisclaimer} />}
    </>
  );
};

export default Index;
