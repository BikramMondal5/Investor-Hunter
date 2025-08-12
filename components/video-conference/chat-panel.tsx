"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Paperclip, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Message } from "./types";
import { format } from "date-fns";

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  onClose: () => void;
}

export default function ChatPanel({ messages, onSendMessage, onClose }: ChatPanelProps) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  };
  
  return (
    <div className="w-[300px] bg-[#1A1A1A] border-l border-[#2A2A2A] flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-[#2A2A2A]">
        <h3 className="text-[#EAEAEA] font-medium">Chat</h3>
        <Button size="icon" variant="ghost" onClick={onClose} className="text-[#A1A1A1] hover:text-[#EAEAEA]">
          <X size={18} />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-[#2A2A2A] h-12 w-12 rounded-full flex items-center justify-center mb-4">
              <ChevronDown size={24} className="text-[#A1A1A1]" />
            </div>
            <p className="text-[#A1A1A1] text-sm">No messages yet</p>
            <p className="text-[#A1A1A1] text-xs mt-2">Messages sent here are visible to everyone in the meeting</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[#EAEAEA] text-sm font-medium">{message.sender}</span>
                <span className="text-[#A1A1A1] text-xs">
                  {format(message.timestamp, "h:mm a")}
                </span>
              </div>
              
              <div className="text-[#EAEAEA] bg-[#2A2A2A] p-3 rounded-lg text-sm break-words">
                {message.content}
                
                {/* Render attachment if exists */}
                {message.attachmentUrl && (
                  <div className="mt-2 p-2 bg-[#0D0D0D] rounded border border-[#2A2A2A] text-xs flex items-center">
                    <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                      {message.attachmentType === 'image' ? 'Image attachment' : 
                       message.attachmentType === 'pdf' ? 'PDF Document' : 'Document'}
                    </div>
                    <Button size="sm" variant="ghost" className="text-[#4F46E5] text-xs">View</Button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t border-[#2A2A2A]">
        <div className="relative">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="pr-20 bg-[#0D0D0D] border-[#2A2A2A] text-[#EAEAEA] placeholder:text-[#A1A1A1]"
          />
          <div className="absolute right-0 top-0 h-full flex items-center gap-1 mr-2">
            <Button 
              type="button" 
              size="icon" 
              variant="ghost" 
              className="h-7 w-7 text-[#A1A1A1]"
              aria-label="Attach file"
            >
              <Paperclip size={16} />
            </Button>
            <Button 
              type="submit" 
              size="icon" 
              disabled={!newMessage.trim()}
              className="h-7 w-7 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#9333EA] text-white"
              aria-label="Send message"
            >
              <Send size={14} />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
