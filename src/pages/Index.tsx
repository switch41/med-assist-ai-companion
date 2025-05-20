
import React, { useState, useEffect } from 'react';
import ChatContainer from '../components/ChatContainer';
import Sidebar from '../components/Sidebar';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import { toast } from 'sonner';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
        <ChatContainer onMenuToggle={toggleSidebar} />
      </div>
      
      {showDisclaimer && <MedicalDisclaimer onAccept={handleAcceptDisclaimer} />}
    </div>
  );
};

export default Index;
