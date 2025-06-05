
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  
  const menuItems = [
    { icon: <MessageSquare className="h-5 w-5" />, label: 'Chat', path: '/' },
    { icon: <Activity className="h-5 w-5" />, label: 'Symptom Checker', path: '/symptom-checker' },
    { icon: <Pill className="h-5 w-5" />, label: 'Medications', path: '/medications' },
    { icon: <Calendar className="h-5 w-5" />, label: 'Appointments', path: '/appointments' },
    { icon: <FileText className="h-5 w-5" />, label: 'Health Records', path: '/health-records' },
    { icon: <HeartPulse className="h-5 w-5" />, label: 'Vitals', path: '/vitals' },
  ];

  const bottomMenuItems = [
    { icon: <Settings className="h-5 w-5" />, label: 'Settings', path: '/settings' },
    { icon: <HelpCircle className="h-5 w-5" />, label: 'Help & Support', path: '/help' },
  ];

  const isActivePath = (path: string) => {
    // For home path, only match exactly
    if (path === '/') {
      return location.pathname === path;
    }
    // For other paths, check if current path starts with the item path
    return location.pathname.startsWith(path);
  };

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
            <h1 className="font-bold text-xl text-medical-primary">SwitchHealthCare</h1>
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
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant={isActivePath(item.path) ? "default" : "ghost"}
                className={`w-full justify-start text-left mb-1 ${
                  isActivePath(item.path) ? 'bg-medical-primary hover:bg-medical-accent' : ''
                }`}
                asChild
                onClick={onClose}
              >
                <Link to={item.path}>
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              </Button>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-100">
          <nav className="space-y-1">
            {bottomMenuItems.map((item) => (
              <Button
                key={item.path}
                variant={isActivePath(item.path) ? "default" : "ghost"}
                className={`w-full justify-start text-left mb-1 ${
                  isActivePath(item.path) ? 'bg-medical-primary hover:bg-medical-accent' : ''
                }`}
                asChild
                onClick={onClose}
              >
                <Link to={item.path}>
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
