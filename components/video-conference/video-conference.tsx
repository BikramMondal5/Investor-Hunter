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
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCameraAccess } from "@/hooks/use-camera-access";

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
  const { toast } = useToast();
  
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
  const [isVideoOff, setIsVideoOff] = useState(true); // Start with video off
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [virtualBackground, setVirtualBackground] = useState<'none' | 'blur' | 'background'>('none');
  
  // References
  const containerRef = useRef<HTMLDivElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Use our custom camera hook for better camera handling
  const { 
    stream: cameraStream, 
    error: cameraError, 
    isLoading: cameraLoading,
    startCamera,
    stopCamera
  } = useCameraAccess({
    onError: (error) => {
      toast({
        title: "Camera Error",
        description: error.message || "Failed to access camera",
        variant: "destructive",
      });
    },
    idealWidth: 1280,
    idealHeight: 720
  });
  
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
  
  // Enhanced visibility handling - camera hook handles cleanup
  useEffect(() => {
    // Setup listener for page visibility changes to manage camera resources
    const handleVisibilityChange = () => {
      if (document.hidden && !isVideoOff && cameraStream) {
        // When tab becomes hidden and camera is on, pause video tracks to save resources
        console.log("Page hidden, pausing camera to conserve resources");
        cameraStream.getVideoTracks().forEach((track: MediaStreamTrack) => {
          track.enabled = false;
        });
      } else if (!document.hidden && !isVideoOff && cameraStream) {
        // When tab becomes visible again and camera should be on, re-enable tracks
        console.log("Page visible, resuming camera");
        cameraStream.getVideoTracks().forEach((track: MediaStreamTrack) => {
          track.enabled = true;
        });
      }
    };
    
    // Add visibility change listener
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup function runs when component unmounts
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Camera cleanup is handled by our hook
    };
  }, [isVideoOff, cameraStream]);
  
  // Update participants data with camera stream
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
        stream: cameraStream, // Use the actual camera stream for the local participant
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
  }, [isMuted, isVideoOff, isScreenSharing, cameraStream]);
  
  // Format time for display (MM:SS)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Camera functionality is now handled by the useCameraAccess hook
  
  // Toggle functions for controls
  const toggleMute = () => setIsMuted(prev => !prev);
  
  const toggleVideo = async () => {
    // Set a loading state to prevent multiple clicks during transition
    const wasVideoOff = isVideoOff;
    
    if (wasVideoOff) {
      // First update the UI state to show we're turning the camera on
      setIsVideoOff(false);
      
      // Then attempt to start the camera using our hook
      const stream = await startCamera();
      
      // If we couldn't get a stream, revert the UI state
      if (!stream) {
        setIsVideoOff(true);
        console.log("Camera toggle failed - reverting to camera off state");
      } else {
        console.log("Camera toggled on successfully");
      }
    } else {
      // For turning camera off, stop camera first then update UI
      stopCamera();
      setIsVideoOff(true);
      console.log("Camera toggled off successfully");
    }
  };
  
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
  
  // Enhanced grid layout with fixed proportions to prevent layout shifts
  const getGridTemplateAreas = () => {
    const count = participants.length;
    
    if (pinnedParticipant) {
      return {
        gridTemplateAreas: '"pinned pinned" "other1 other2"',
        gridTemplateRows: '3fr 1fr', 
        gridTemplateColumns: '1fr 1fr',
        // Fixed aspect ratios and minimum sizes to prevent layout shifts
        aspectRatio: '16/9',
        minHeight: '400px',
      };
    }
    
    if (count === 1) {
      return {
        gridTemplateAreas: '"single"',
        gridTemplateRows: '1fr',
        gridTemplateColumns: '1fr',
        // Single video takes full space with consistent aspect ratio
        aspectRatio: '16/9',
        minHeight: '400px',
      };
    }
    
    if (count === 2) {
      return {
        gridTemplateAreas: '"first second"',
        gridTemplateRows: '1fr',
        gridTemplateColumns: '1fr 1fr',
        // Side-by-side layout with fixed proportions
        aspectRatio: '2/1',
        minHeight: '400px',
      };
    }
    
    // 3 or more participants in a 2x2 grid
    return {
      gridTemplateAreas: '"first second" "third fourth"',
      gridTemplateRows: '1fr 1fr',
      gridTemplateColumns: '1fr 1fr',
      // Square-ish layout for 4 participants
      aspectRatio: '4/3',
      minHeight: '400px',
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
      
      {cameraError && (
        <Alert variant="destructive" className="absolute top-16 right-4 w-auto z-50 bg-[#1A1A1A] border-red-500">
          <AlertDescription>{cameraError}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-1 relative overflow-hidden">
        {/* Main video grid - with fixed dimensions and aspect ratio for stability */}
        <div 
          className="flex-1 grid gap-2 p-2 max-w-[calc(100vw-2rem)] mx-auto" 
          style={{
            ...getGridTemplateAreas(),
            // These styles ensure the grid maintains consistent proportions
            // regardless of camera state changes
            height: "100%", 
            maxHeight: "calc(100vh - 150px)", // Leave space for header and controls
          }}
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
