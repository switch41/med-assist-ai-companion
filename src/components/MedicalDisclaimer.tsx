
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MedicalDisclaimerProps {
  onAccept: () => void;
}

const MedicalDisclaimer: React.FC<MedicalDisclaimerProps> = ({ onAccept }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-yellow-100 rounded-full">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <h2 className="text-xl font-semibold">Medical Disclaimer</h2>
        </div>
        
        <div className="text-gray-700 space-y-3 mb-6">
          <p>
            MediAssist is designed to provide general health information and assist with basic symptom assessment, but it is not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
          <p>
            Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>
          <p className="font-medium">
            In case of emergency, please call emergency services immediately.
          </p>
        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={onAccept} 
            className="bg-medical-primary hover:bg-medical-accent text-white w-full"
          >
            I Understand
          </Button>
        </div>
        
        <div className="text-xs text-center text-gray-500 mt-4">
          By continuing to use MediAssist, you acknowledge that you have read and understood this disclaimer.
        </div>
      </div>
    </div>
  );
};

export default MedicalDisclaimer;
