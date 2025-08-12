"use client";

import { useState } from "react";
import { Clock, Lock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MeetingHeaderProps {
  title: string;
  meetingCode: string;
  elapsedTime: string;
  isRecording?: boolean;
}

export default function MeetingHeader({
  title,
  meetingCode,
  elapsedTime,
  isRecording = false,
}: MeetingHeaderProps) {
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);
  
  const copyMeetingCode = () => {
    navigator.clipboard.writeText(meetingCode);
    setShowCopiedTooltip(true);
    setTimeout(() => setShowCopiedTooltip(false), 2000);
  };
  
  return (
    <header className="bg-[#1A1A1A] border-b border-[#2A2A2A] px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-[#EAEAEA] font-semibold text-lg">{title}</h1>
        {isRecording && (
          <div className="ml-4 flex items-center gap-1 bg-[#0D0D0D] px-2 py-0.5 rounded-full">
            <span className="h-2 w-2 rounded-full bg-[#EF4444] animate-pulse"></span>
            <span className="text-[#EF4444] text-xs font-medium">REC</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 text-[#A1A1A1] text-sm">
          <Clock size={16} />
          <span>{elapsedTime}</span>
        </div>
        
        <TooltipProvider>
          <Tooltip open={showCopiedTooltip}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-[#2A2A2A] bg-[#0D0D0D] hover:bg-[#2A2A2A] hover:text-[#EAEAEA] text-[#A1A1A1] text-xs"
                onClick={copyMeetingCode}
              >
                <span className="mr-1">Code:</span> {meetingCode}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Copied to clipboard!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="flex items-center text-[#10B981] text-sm">
          <Lock size={16} className="mr-1" />
          <span>Secure</span>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" className="text-[#A1A1A1] hover:text-[#EAEAEA]">
                <Info size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>End-to-end encrypted connection</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
}
