"use client";

import { X, Mic, MicOff, Video, VideoOff, Crown, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Participant } from "./types";
import { cn } from "@/lib/utils";

interface ParticipantsPanelProps {
  participants: Participant[];
  onClose: () => void;
}

export default function ParticipantsPanel({ participants, onClose }: ParticipantsPanelProps) {
  return (
    <div className="w-[300px] bg-[#1A1A1A] border-l border-[#2A2A2A] flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-[#2A2A2A]">
        <h3 className="text-[#EAEAEA] font-medium">Participants ({participants.length})</h3>
        <Button size="icon" variant="ghost" onClick={onClose} className="text-[#A1A1A1] hover:text-[#EAEAEA]">
          <X size={18} />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {participants.map((participant) => (
          <div 
            key={participant.id} 
            className={cn(
              "flex items-center justify-between p-3 rounded-md mb-1",
              participant.isSpeaking ? "bg-[#2A2A2A]" : "hover:bg-[#2A2A2A]/50"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#9333EA] flex items-center justify-center text-white font-medium">
                  {participant.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                {participant.isSpeaking && (
                  <div className="absolute -right-1 -bottom-1 p-1 bg-[#1A1A1A] rounded-full">
                    <Volume2 size={10} className="text-[#10B981]" />
                  </div>
                )}
              </div>
              
              <div>
                <div className="text-[#EAEAEA] text-sm font-medium flex items-center">
                  {participant.name}
                  {participant.role === 'Host' && (
                    <Crown size={12} className="ml-1 text-[#F59E0B]" />
                  )}
                </div>
                <div className="text-[#A1A1A1] text-xs">{participant.role}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {participant.isMuted ? (
                <MicOff size={14} className="text-[#EF4444]" />
              ) : (
                <Mic size={14} className="text-[#10B981]" />
              )}
              
              {participant.isVideoOff ? (
                <VideoOff size={14} className="text-[#EF4444]" />
              ) : (
                <Video size={14} className="text-[#10B981]" />
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-[#2A2A2A]">
        <Button 
          size="sm"
          variant="outline"
          className="w-full border-[#2A2A2A] bg-[#0D0D0D] hover:bg-[#2A2A2A] hover:text-[#EAEAEA] text-[#A1A1A1]"
        >
          Add Participants
        </Button>
      </div>
    </div>
  );
}
