"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Mic, 
  MicOff,
  Video, 
  VideoOff,
  Share2, 
  Users, 
  MessageSquare, 
  Link,
  Settings 
} from "lucide-react";

interface DeviceControlBarProps {
  className?: string;
  onEnd?: () => void;
}

export default function DeviceControlBar({ className, onEnd }: DeviceControlBarProps) {
  const [micActive, setMicActive] = useState(true);
  const [videoActive, setVideoActive] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Initialize camera and microphone
  useEffect(() => {
    const setupMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true,
          audio: true
        });
        
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing media devices:", error);
        setVideoActive(false);
        setMicActive(false);
      }
    };
    
    setupMedia();
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  const toggleMic = () => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = !micActive;
        setMicActive(!micActive);
      }
    }
  };
  
  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTracks = streamRef.current.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks[0].enabled = !videoActive;
        setVideoActive(!videoActive);
      }
    }
  };
  
  const toggleScreenShare = async () => {
    try {
      if (screenSharing) {
        // Stop screen sharing and restore camera
        if (streamRef.current) {
          const screenTracks = streamRef.current.getVideoTracks();
          screenTracks.forEach(track => {
            if (track.label.includes('screen')) {
              track.stop();
            }
          });
          
          // Restore camera if it was on before
          const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = videoStream;
          }
          streamRef.current = videoStream;
          setVideoActive(true);
        }
      } else {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = screenStream;
        }
        
        // Update stream reference
        streamRef.current = screenStream;
      }
      
      setScreenSharing(!screenSharing);
    } catch (error) {
      console.error("Error with screen sharing:", error);
    }
  };
  
  const toggleParticipants = () => {
    setShowParticipants(!showParticipants);
    if (!showParticipants) setShowChat(false);
  };
  
  const toggleChat = () => {
    setShowChat(!showChat);
    if (!showChat) setShowParticipants(false);
  };
  
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };
  
  return (
    <div className={cn(
      "flex items-center justify-center py-3 px-4 bg-black bg-opacity-70 rounded-full gap-4",
      className
    )}>
      {/* Hidden video element to display the stream */}
      <video ref={videoRef} autoPlay playsInline muted className="hidden" />
      
      {/* Microphone button */}
      <Button
        size="icon"
        variant="ghost"
        className={cn(
          "rounded-full hover:bg-white/10 text-white",
          !micActive && "bg-red-500 text-white hover:bg-red-600"
        )}
        onClick={toggleMic}
        aria-label="Toggle microphone"
      >
        {micActive ? <Mic size={20} /> : <MicOff size={20} />}
      </Button>
      
      {/* Camera button */}
      <Button
        size="icon"
        variant="ghost"
        className={cn(
          "rounded-full hover:bg-white/10 text-white",
          !videoActive && "bg-blue-500 text-white hover:bg-blue-600"
        )}
        onClick={toggleVideo}
        aria-label="Toggle camera"
      >
        {videoActive ? <Video size={20} /> : <VideoOff size={20} />}
      </Button>
      
      {/* Screen share button */}
      <Button
        size="icon"
        variant="ghost"
        className={cn(
          "rounded-full hover:bg-white/10 text-white",
          screenSharing && "bg-green-500 text-white hover:bg-green-600"
        )}
        onClick={toggleScreenShare}
        aria-label="Share screen"
      >
        <Share2 size={20} />
      </Button>
      
      {/* Participants button */}
      <Button
        size="icon"
        variant="ghost"
        className={cn(
          "rounded-full hover:bg-white/10 text-white",
          showParticipants && "bg-purple-500 text-white hover:bg-purple-600"
        )}
        onClick={toggleParticipants}
        aria-label="Show participants"
      >
        <Users size={20} />
      </Button>
      
      {/* Chat button */}
      <Button
        size="icon"
        variant="ghost"
        className={cn(
          "rounded-full hover:bg-white/10 text-white",
          showChat && "bg-yellow-500 text-white hover:bg-yellow-600"
        )}
        onClick={toggleChat}
        aria-label="Open chat"
      >
        <MessageSquare size={20} />
      </Button>
      
      {/* Link/Invite button */}
      <Button
        size="icon"
        variant="ghost"
        className="rounded-full hover:bg-white/10 text-white"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          alert("Meeting link copied to clipboard!");
        }}
        aria-label="Copy meeting link"
      >
        <Link size={20} />
      </Button>
      
      {/* Settings button */}
      <Button
        size="icon"
        variant="ghost"
        className={cn(
          "rounded-full hover:bg-white/10 text-white",
          showSettings && "bg-gray-500 text-white hover:bg-gray-600"
        )}
        onClick={toggleSettings}
        aria-label="Open settings"
      >
        <Settings size={20} />
      </Button>
      
      {/* End button - matches the red circle with x icon in screenshot */}
      <Button
        size="icon"
        variant="ghost"
        className="rounded-full bg-red-500 text-white hover:bg-red-600"
        onClick={onEnd}
        aria-label="End call"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </Button>
    </div>
  );
}
