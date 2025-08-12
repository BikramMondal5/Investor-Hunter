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
    console.log("Camera stream changed:", cameraStream?.id);
    
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
        name: 'Arijit Sarkar',
        role: 'Entrepreneur',
        isMuted: false,
        isVideoOff: true,
        isSpeaking: true,
      },
      {
        id: 'participant2',
        name: 'Debashish Sarkar',
        role: 'Investor',
        isMuted: true,
        isVideoOff: true,
        isSpeaking: false,
      },
      {
        id: 'participant3',
        name: 'Bikram',
        role: 'Designer',
        isMuted: false,
        isVideoOff: true,
        isSpeaking: false,
      },
      {
        id: 'participant4',
        name: 'Koushik',
        role: 'Developer',
        isMuted: false,
        isVideoOff: true,
        isSpeaking: false,
      },
    ];
    
    // Debug log for the local participant to confirm stream is attached
    if (cameraStream) {
      const videoTracks = cameraStream.getVideoTracks();
      console.log("Setting participant with video tracks:", videoTracks.length, 
        videoTracks.map(t => `${t.label} (${t.readyState})`).join(", "));
    }
    
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
      try {
        // First attempt to start the camera using our hook
        const stream = await startCamera();
        
        // If we couldn't get a stream, don't update the UI state
        if (!stream) {
          console.log("Camera toggle failed - camera remains off");
          return;
        }
        
        // Update the UI state after we successfully got the stream
        setIsVideoOff(false);
        console.log("Camera toggled on successfully", stream.id);
        
        // Debug: Log video tracks to verify they exist
        const videoTracks = stream.getVideoTracks();
        console.log("Video tracks:", videoTracks.length, videoTracks[0]?.label);
      } catch (error) {
        console.error("Error toggling camera:", error);
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
  
  // Enhanced grid layout with larger containers for better visibility
  const getGridTemplateAreas = () => {
    const count = participants.length;
    
    if (pinnedParticipant) {
      return {
        gridTemplateAreas: '"pinned pinned" "other1 other2"',
        gridTemplateRows: '3.5fr 1fr', // Increased ratio for pinned view
        gridTemplateColumns: '1fr 1fr',
        // Fixed aspect ratios and increased sizes for better visibility
        aspectRatio: '16/9',
        minHeight: '500px', // Increased from 400px
      };
    }
    
    if (count === 1) {
      return {
        gridTemplateAreas: '"single"',
        gridTemplateRows: '1fr',
        gridTemplateColumns: '1fr',
        // Single video takes full space with enhanced size
        aspectRatio: '16/9',
        minHeight: '500px', // Increased from 400px
        maxWidth: '80%', // Ensure it doesn't get too wide on large screens
        margin: '0 auto', // Center it
      };
    }
    
    if (count === 2) {
      return {
        gridTemplateAreas: '"first second"',
        gridTemplateRows: '1fr',
        gridTemplateColumns: '1fr 1fr',
        // Side-by-side layout with improved proportions
        aspectRatio: '16/9', // Changed from 2/1 for better video display
        minHeight: '500px', // Increased from 400px
        gap: '16px', // Increased gap between videos
      };
    }
    
    // 3 or more participants in a 2x2 grid
    return {
      gridTemplateAreas: '"first second" "third fourth"',
      gridTemplateRows: '1fr 1fr',
      gridTemplateColumns: '1fr 1fr',
      // Improved layout for 4 participants
      aspectRatio: '16/9', // Changed from 4/3 for better widescreen video display
      minHeight: '500px', // Increased from 400px
      gap: '12px', // Increased gap between videos
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
        {/* Main video grid - with increased dimensions for better visibility */}
        <div 
          className="flex-1 grid gap-3 p-3 max-w-[calc(100vw-1.5rem)] mx-auto" 
          style={{
            ...getGridTemplateAreas(),
            // These styles ensure the grid maintains consistent proportions
            // with increased size for better visibility
            height: "100%", 
            maxHeight: "calc(100vh - 130px)", // Increased height by reducing space for header/controls
            minHeight: "500px", // Increased minimum height (was 400px)
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
