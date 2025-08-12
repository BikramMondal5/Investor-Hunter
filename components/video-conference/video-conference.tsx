"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import VideoParticipant from "./video-participant";
import MeetingHeader from "./meeting-header";
import ControlToolbar from "./control-toolbar";
import ParticipantsPanel from "./participants-panel";
import ChatPanel from "./chat-panel";
import DeviceControlBar from "./device-control-bar";
import { Participant, Message } from "./types";

interface VideoConferenceProps {
  meetingTitle: string;
  meetingCode: string;
  isRecording?: boolean;
  onLeave?: () => void;
  className?: string;
}

export default function VideoConference({
  meetingTitle,
  meetingCode,
  isRecording = false,
  onLeave,
  className,
}: VideoConferenceProps) {
  // State for tracking participants
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null);
  const [pinnedParticipant, setPinnedParticipant] = useState<string | null>(null);
  
  // State for UI elements
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [virtualBackground, setVirtualBackground] = useState<'none' | 'blur' | 'background'>('none');
  
  // References
  const containerRef = useRef<HTMLDivElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Auto-hide controls after inactivity
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      timerRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
      
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  
  // Timer for elapsed meeting time
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Mock data for demonstration purposes
  // In a real implementation, this would be replaced with WebRTC connections
  useEffect(() => {
    // Simulated participants data
    const mockParticipants: Participant[] = [
      {
        id: 'self',
        name: 'You (Host)',
        role: 'Host',
        isMuted: isMuted,
        isVideoOff: isVideoOff,
        isSpeaking: false,
        isScreenSharing: isScreenSharing,
      },
      {
        id: 'participant1',
        name: 'John Doe',
        role: 'Entrepreneur',
        isMuted: false,
        isVideoOff: false,
        isSpeaking: false,
      },
      {
        id: 'participant2',
        name: 'Jane Smith',
        role: 'Investor',
        isMuted: true,
        isVideoOff: false,
        isSpeaking: false,
      },
    ];
    
    setParticipants(mockParticipants);
    
    // Simulated speaking detection
    const speakingInterval = setInterval(() => {
      const speakingParticipant = mockParticipants.find(p => p.id !== 'self' && !p.isMuted);
      if (speakingParticipant && Math.random() > 0.5) {
        setActiveSpeaker(speakingParticipant.id);
      } else {
        setActiveSpeaker(null);
      }
    }, 3000);
    
    return () => clearInterval(speakingInterval);
  }, [isMuted, isVideoOff, isScreenSharing]);
  
  // Format time for display (MM:SS)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Toggle functions for controls
  const toggleMute = () => setIsMuted(prev => !prev);
  const toggleVideo = () => setIsVideoOff(prev => !prev);
  const toggleScreenShare = () => setIsScreenSharing(prev => !prev);
  const toggleParticipantsPanel = () => {
    setShowParticipants(prev => !prev);
    if (!showParticipants) setShowChat(false);
  };
  const toggleChatPanel = () => {
    setShowChat(prev => !prev);
    if (!showChat) setShowParticipants(false);
  };
  
  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'You (Host)',
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate received message (in real app, this would be received from WebRTC or WebSockets)
    setTimeout(() => {
      const response: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'John Doe',
        content: 'Thanks for the update!',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };
  
  const handlePinParticipant = (id: string) => {
    setPinnedParticipant(pinnedParticipant === id ? null : id);
  };
  
  // Determine grid layout based on participant count and pinned state
  const getGridTemplateAreas = () => {
    const count = participants.length;
    
    if (pinnedParticipant) {
      return {
        gridTemplateAreas: '"pinned pinned" "other1 other2"',
        gridTemplateRows: '3fr 1fr',
        gridTemplateColumns: '1fr 1fr',
      };
    }
    
    if (count === 1) {
      return {
        gridTemplateAreas: '"single"',
        gridTemplateRows: '1fr',
        gridTemplateColumns: '1fr',
      };
    }
    
    if (count === 2) {
      return {
        gridTemplateAreas: '"first second"',
        gridTemplateRows: '1fr',
        gridTemplateColumns: '1fr 1fr',
      };
    }
    
    // 3 or more participants
    return {
      gridTemplateAreas: '"first second" "third fourth"',
      gridTemplateRows: '1fr 1fr',
      gridTemplateColumns: '1fr 1fr',
    };
  };
  
  return (
    <div 
      ref={containerRef}
      className={cn("flex flex-col w-full h-screen bg-[#0D0D0D] relative overflow-hidden", className)}
    >
      <MeetingHeader 
        title={meetingTitle} 
        meetingCode={meetingCode} 
        elapsedTime={formatTime(elapsedTime)} 
        isRecording={isRecording} 
      />
      
      {/* Quick access device controls - matching the red box from the screenshot */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-black bg-opacity-70 rounded-lg py-2 px-4 flex items-center gap-4">
          {/* Camera icon */}
          <button 
            className={cn(
              "w-10 h-10 flex items-center justify-center text-white", 
              isVideoOff ? "opacity-50" : "opacity-100"
            )}
            onClick={toggleVideo}
            aria-label="Toggle camera"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="6" width="16" height="12" rx="2" ry="2"></rect>
              <path d="M22 8l-4 4 4 4V8z"></path>
            </svg>
          </button>
          
          {/* Add participant icon - This would typically open an invite dialog */}
          <button 
            className="w-10 h-10 flex items-center justify-center text-white opacity-80 hover:opacity-100"
            onClick={() => {
              // Copy meeting link to clipboard
              navigator.clipboard.writeText(window.location.href);
              alert("Meeting link copied to clipboard! Share this link to invite others.");
            }}
            aria-label="Add participant"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="17" y1="11" x2="23" y2="11"></line>
            </svg>
          </button>
          
          {/* Participants icon */}
          <button 
            className="w-10 h-10 flex items-center justify-center text-white opacity-80 hover:opacity-100"
            onClick={toggleParticipantsPanel}
            aria-label="Manage participants"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="flex flex-1 relative">
        {/* Main video grid */}
        <div 
          className="flex-1 grid gap-2 p-2" 
          style={getGridTemplateAreas()}
        >
          {participants.map((participant, index) => (
            <VideoParticipant
              key={participant.id}
              participant={participant}
              isSpeaking={activeSpeaker === participant.id}
              isPinned={pinnedParticipant === participant.id}
              onPin={() => handlePinParticipant(participant.id)}
              gridArea={
                pinnedParticipant === participant.id
                  ? 'pinned'
                  : pinnedParticipant
                    ? (index === 0 ? 'other1' : 'other2')
                    : ['single', 'first', 'second', 'third', 'fourth'][Math.min(index, 4)]
              }
              virtualBackground={participant.id === 'self' ? virtualBackground : 'none'}
            />
          ))}
        </div>
        
        {/* Side panels */}
        {showParticipants && (
          <ParticipantsPanel 
            participants={participants} 
            onClose={toggleParticipantsPanel}
          />
        )}
        
        {showChat && (
          <ChatPanel 
            messages={messages}
            onSendMessage={handleSendMessage}
            onClose={toggleChatPanel}
          />
        )}
      </div>
      
      {/* Controls */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 w-full transition-opacity duration-300", 
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <ControlToolbar
          isMuted={isMuted}
          isVideoOff={isVideoOff}
          isScreenSharing={isScreenSharing}
          showParticipants={showParticipants}
          showChat={showChat}
          virtualBackground={virtualBackground}
          onMuteToggle={toggleMute}
          onVideoToggle={toggleVideo}
          onScreenShareToggle={toggleScreenShare}
          onParticipantsToggle={toggleParticipantsPanel}
          onChatToggle={toggleChatPanel}
          onLeave={onLeave}
          onVirtualBackgroundChange={setVirtualBackground}
        />
      </div>
    </div>
  );
}
