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

  // Handle video errors
  const handleVideoError = (e: any) => {
    console.error("Video playback error for participant:", participant.id, e);
  };

  // Set up video stream
  useEffect(() => {
    if (!videoRef.current) return;
    
    if (!participant.isVideoOff && participant.stream) {
      try {
        videoRef.current.srcObject = participant.stream;
        
        // Make sure the video starts playing
        videoRef.current.play().catch(e => {
          console.error(`Error playing video for ${participant.name}:`, e);
        });
        
        console.log(`Set camera stream for ${participant.name}`);
      } catch (err) {
        console.error(`Error setting stream for ${participant.name}:`, err);
      }
    } else if (participant.isVideoOff && videoRef.current.srcObject) {
      videoRef.current.srcObject = null;
    }
  }, [participant.isVideoOff, participant.stream, participant.name]);

  return (
    <div 
      className={cn(
        "relative rounded-xl overflow-hidden bg-[#1A1A1A] flex items-center justify-center shadow-lg",
        "h-full w-full",
        isSpeaking && !participant.isMuted ? "ring-2 ring-[#10B981]" : "",
        isPinned ? "ring-3 ring-[#9333EA]" : ""
      )}
      style={{ gridArea }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Video container */}
      <div className="absolute inset-0 flex items-center justify-center bg-[#1A1A1A]">
        <div className="w-full h-full relative" style={{ aspectRatio: '16/9' }}>
          {/* Video element - always present in DOM */}
          <video 
            ref={videoRef}
            autoPlay 
            playsInline
            muted={participant.id === 'self' || participant.isMuted}
            onError={handleVideoError}
            className={cn(
              "object-cover absolute inset-0 w-full h-full z-10 transition-opacity duration-300",
              participant.isVideoOff ? "opacity-0" : "opacity-100 animate-fade-in"
            )}
            style={{ display: participant.isVideoOff ? 'none' : 'block' }}
          />
          
          {/* Placeholder when video is off */}
          {participant.isVideoOff && (
            <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-[#1E1E1E] to-[#111111] z-20">
              <Avatar className="h-28 w-28 bg-gradient-to-br from-[#4F46E5] to-[#9333EA] text-white text-3xl shadow-lg">
                {participant.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </Avatar>
              <div className="text-[#EAEAEA] mt-4 font-medium text-lg">{participant.name}</div>
            </div>
          )}
        </div>
      </div>
      
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
