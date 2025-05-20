
import React from 'react';
import { Activity, Info, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  onMenuToggle: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onMenuToggle }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onMenuToggle} className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="bg-medical-primary rounded-full p-1.5">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">MediAssist</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-xs text-gray-500">Online</span>
            </div>
          </div>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="rounded-full">
        <Info className="h-5 w-5 text-gray-500" />
      </Button>
    </div>
  );
};

export default ChatHeader;
