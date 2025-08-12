"use client";

import { useState, useRef, useEffect } from "react";
import { Participant, VirtualBackgroundType } from "./types";
import { cn } from "@/lib/utils";
import { MicOff, Video, VideoOff, Pin, PinOff } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

interface VideoParticipantProps {
  participant: Participant;
  isSpeaking: boolean;
  isPinned: boolean;
  onPin: () => void;
  gridArea: string;
  virtualBackground: VirtualBackgroundType;
}

export default function VideoParticipant({
  participant,
  isSpeaking,
  isPinned,
  onPin,
  gridArea,
  virtualBackground = 'none',
}: VideoParticipantProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  
  // In a real implementation, this is where you'd connect to WebRTC streams
  useEffect(() => {
    if (videoRef.current && !participant.isVideoOff) {
      // Mock video stream with a color gradient
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Create a gradient for the mock video
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        
        // Use colors based on role
        if (participant.role === 'Entrepreneur') {
          gradient.addColorStop(0, '#4F46E5');
          gradient.addColorStop(1, '#9333EA');
        } else if (participant.role === 'Investor') {
          gradient.addColorStop(0, '#3B82F6');
          gradient.addColorStop(1, '#6366F1');
        } else {
          gradient.addColorStop(0, '#8B5CF6');
          gradient.addColorStop(1, '#EC4899');
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add user initials
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '120px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const initials = participant.name
          .split(' ')
          .map(name => name.charAt(0))
          .join('')
          .toUpperCase();
        ctx.fillText(initials, canvas.width / 2, canvas.height / 2);
        
        // Mock stream
        const mockStream = canvas.captureStream(30); // 30 fps
        videoRef.current.srcObject = mockStream;
      }
    }
  }, [participant.isVideoOff, participant.name, participant.role]);
  
  return (
    <div 
      className={cn(
        "relative rounded-lg overflow-hidden bg-[#1A1A1A] flex items-center justify-center",
        isSpeaking && !participant.isMuted ? "ring-2 ring-[#10B981]" : "",
        isPinned ? "ring-2 ring-[#9333EA]" : "",
      )}
      style={{ gridArea }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {participant.isVideoOff ? (
        <div className="flex flex-col items-center justify-center h-full w-full">
          <Avatar className="h-24 w-24 bg-gradient-to-br from-[#4F46E5] to-[#9333EA] text-white text-2xl">
            {participant.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </Avatar>
          <div className="text-[#EAEAEA] mt-3 font-medium">{participant.name}</div>
        </div>
      ) : (
        <>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline
            muted={participant.isMuted} 
            className={cn(
              "object-cover w-full h-full",
              virtualBackground === 'blur' && "backdrop-blur-sm",
            )}
          />
          {virtualBackground === 'background' && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A]/50 to-[#0D0D0D]/50 pointer-events-none" />
          )}
        </>
      )}
      
      {/* Participant info overlay */}
      <div className="absolute bottom-0 left-0 p-3 text-[#EAEAEA] flex items-center gap-1 text-sm">
        <span className="font-medium">{participant.name}</span>
        <span className="text-xs bg-[#1A1A1A]/70 px-2 py-0.5 rounded-full text-[#A1A1A1]">
          {participant.role}
        </span>
      </div>
      
      {/* Status icons */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        {participant.isMuted && (
          <div className="bg-[#1A1A1A]/80 p-1.5 rounded-full">
            <MicOff size={16} className="text-[#EF4444]" />
          </div>
        )}
        {participant.isVideoOff && (
          <div className="bg-[#1A1A1A]/80 p-1.5 rounded-full">
            <VideoOff size={16} className="text-[#F59E0B]" />
          </div>
        )}
        {participant.isScreenSharing && (
          <div className="bg-[#1A1A1A]/80 p-1.5 rounded-full">
            <Video size={16} className="text-[#10B981]" />
          </div>
        )}
      </div>
      
      {/* Pin button */}
      {isHovering && (
        <button
          onClick={onPin}
          className="absolute top-3 left-3 bg-[#1A1A1A]/80 p-2 rounded-full hover:bg-[#1A1A1A] transition-colors"
          aria-label={isPinned ? "Unpin participant" : "Pin participant"}
        >
          {isPinned ? (
            <PinOff size={16} className="text-[#EAEAEA]" />
          ) : (
            <Pin size={16} className="text-[#EAEAEA]" />
          )}
        </button>
      )}
    </div>
  );
}
