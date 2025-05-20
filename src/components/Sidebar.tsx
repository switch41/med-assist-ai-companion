
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  MessageSquare, 
  Pill, 
  Calendar, 
  FileText, 
  HeartPulse, 
  Settings, 
  HelpCircle, 
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const menuItems = [
    { icon: <MessageSquare className="h-5 w-5" />, label: 'Chat' },
    { icon: <Activity className="h-5 w-5" />, label: 'Symptom Checker' },
    { icon: <Pill className="h-5 w-5" />, label: 'Medications' },
    { icon: <Calendar className="h-5 w-5" />, label: 'Appointments' },
    { icon: <FileText className="h-5 w-5" />, label: 'Health Records' },
    { icon: <HeartPulse className="h-5 w-5" />, label: 'Vitals' },
  ];

  const bottomMenuItems = [
    { icon: <Settings className="h-5 w-5" />, label: 'Settings' },
    { icon: <HelpCircle className="h-5 w-5" />, label: 'Help & Support' },
  ];

  return (
    <div 
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-medical-primary" />
            <h1 className="font-bold text-xl text-medical-primary">MediAssist</h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto py-4">
          <nav className="space-y-1 px-3">
            {menuItems.map((item, index) => (
              <Button
                key={index}
                variant={index === 0 ? "default" : "ghost"}
                className={`w-full justify-start text-left mb-1 ${
                  index === 0 ? 'bg-medical-primary hover:bg-medical-accent' : ''
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Button>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-100">
          <nav className="space-y-1">
            {bottomMenuItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-left mb-1"
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
