
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendHorizontal, Mic, ImagePlus } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isProcessing }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isProcessing) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
      <Button 
        type="button" 
        size="icon" 
        variant="ghost" 
        className="text-gray-500 hover:text-medical-primary hover:bg-medical-light"
      >
        <ImagePlus className="h-5 w-5" />
        <span className="sr-only">Attach image</span>
      </Button>
      
      <Input
        type="text"
        placeholder="Type your symptoms or questions..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        disabled={isProcessing}
      />
      
      <Button 
        type="button" 
        size="icon" 
        variant="ghost" 
        className="text-gray-500 hover:text-medical-primary hover:bg-medical-light"
      >
        <Mic className="h-5 w-5" />
        <span className="sr-only">Voice input</span>
      </Button>
      
      <Button 
        type="submit" 
        size="icon" 
        className="bg-medical-primary hover:bg-medical-accent text-white"
        disabled={!inputValue.trim() || isProcessing}
      >
        <SendHorizontal className="h-5 w-5" />
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  );
};

export default ChatInput;
