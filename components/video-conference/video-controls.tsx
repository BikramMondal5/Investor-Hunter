"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Mic, 
  MicOff, 
  Camera, 
  Share2, 
  Users, 
  MessageSquare, 
  Link, 
  Settings 
} from "lucide-react";

interface VideoControlsProps {
  className?: string;
}

export default function VideoControls({ className }: VideoControlsProps) {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Function to toggle microphone
  const toggleMicrophone = async () => {
    try {
      if (!streamRef.current) {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = audioStream;
      }
      
      const audioTracks = streamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        const enabled = !isMicOn;
        audioTracks[0].enabled = enabled;
        setIsMicOn(enabled);
      }
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };
  
  // Function to toggle camera
  const toggleCamera = async () => {
    try {
      if (isCameraOn) {
        // Turn off camera by disabling tracks
        if (streamRef.current) {
          const videoTracks = streamRef.current.getVideoTracks();
          videoTracks.forEach(track => {
            track.enabled = false;
          });
        }
        setIsCameraOn(false);
      } else {
        if (streamRef.current) {
          // If we already have video tracks, just enable them
          const videoTracks = streamRef.current.getVideoTracks();
          if (videoTracks.length > 0) {
            videoTracks.forEach(track => {
              track.enabled = true;
            });
            setIsCameraOn(true);
            return;
          }
        }
        
        // No existing video tracks, get new camera stream
        const videoStream = await navigator.mediaDevices.getUserMedia({ 
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        
        if (streamRef.current) {
          // If we have an existing stream, add video tracks to it
          const existingAudioTracks = streamRef.current.getAudioTracks();
          const combinedStream = new MediaStream([
            ...existingAudioTracks,
            ...videoStream.getVideoTracks()
          ]);
          streamRef.current = combinedStream;
        } else {
          streamRef.current = videoStream;
        }
        
        if (videoRef.current) {
          videoRef.current.srcObject = streamRef.current;
        }
        
        setIsCameraOn(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };
  
  // Function to toggle screen sharing
  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        // Stop screen sharing
        if (streamRef.current) {
          const screenTracks = streamRef.current.getVideoTracks();
          screenTracks.forEach(track => {
            if (track.label.includes('screen')) {
              track.stop();
            }
          });
          
          // Restore camera if it was on before
          if (isCameraOn) {
            const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
              videoRef.current.srcObject = videoStream;
            }
          } else if (videoRef.current) {
            videoRef.current.srcObject = null;
          }
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
      
      setIsScreenSharing(!isScreenSharing);
    } catch (error) {
      console.error("Error with screen sharing:", error);
    }
  };
  
  // Function to toggle participants panel
  const toggleParticipants = () => {
    setShowParticipants(!showParticipants);
    // Close chat if participants is opened
    if (!showParticipants) {
      setShowChat(false);
    }
  };
  
  // Function to toggle chat panel
  const toggleChat = () => {
    setShowChat(!showChat);
    // Close participants if chat is opened
    if (!showChat) {
      setShowParticipants(false);
    }
  };
  
  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, []);
  
  return (
    <div className={cn("flex items-center justify-center gap-2 p-2 bg-[#1A1A1A] rounded-lg", className)}>
      {/* Hidden video element to show camera feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="hidden"
      />
      
      {/* Microphone button */}
      <Button
        size="icon"
        variant="ghost"
        className={cn(
          "rounded-full hover:bg-[#2A2A2A]",
          !isMicOn && "bg-red-500/20 text-red-500"
        )}
        onClick={toggleMicrophone}
        aria-label={isMicOn ? "Mute microphone" : "Unmute microphone"}
      >
        {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
      </Button>
      
      {/* Camera button */}
      <Button
        size="icon"
        variant="ghost"
        className={cn(
          "rounded-full hover:bg-[#2A2A2A]",
          isCameraOn && "bg-blue-500/20 text-blue-500"
        )}
        onClick={toggleCamera}
        aria-label={isCameraOn ? "Turn off camera" : "Turn on camera"}
      >
        <Camera size={20} />
      </Button>
      
      {/* Screen share button */}
      <Button
        size="icon"
        variant="ghost"
        className={cn(
          "rounded-full hover:bg-[#2A2A2A]",
          isScreenSharing && "bg-purple-500/20 text-purple-500"
        )}
        onClick={toggleScreenShare}
        aria-label={isScreenSharing ? "Stop sharing screen" : "Share screen"}
      >
        <Share2 size={20} />
      </Button>
      
      {/* Participants button */}
      <Button
        size="icon"
        variant="ghost"
        className={cn(
          "rounded-full hover:bg-[#2A2A2A]",
          showParticipants && "bg-green-500/20 text-green-500"
        )}
        onClick={toggleParticipants}
        aria-label={showParticipants ? "Hide participants" : "Show participants"}
      >
        <Users size={20} />
      </Button>
      
      {/* Chat button */}
      <Button
        size="icon"
        variant="ghost"
        className={cn(
          "rounded-full hover:bg-[#2A2A2A]",
          showChat && "bg-yellow-500/20 text-yellow-500"
        )}
        onClick={toggleChat}
        aria-label={showChat ? "Hide chat" : "Show chat"}
      >
        <MessageSquare size={20} />
      </Button>
      
      {/* Link button */}
      <Button
        size="icon"
        variant="ghost"
        className="rounded-full hover:bg-[#2A2A2A]"
        onClick={() => navigator.clipboard.writeText(window.location.href)}
        aria-label="Copy meeting link"
      >
        <Link size={20} />
      </Button>
      
      {/* Settings button */}
      <Button
        size="icon"
        variant="ghost"
        className="rounded-full hover:bg-[#2A2A2A]"
        aria-label="Settings"
      >
        <Settings size={20} />
      </Button>
    </div>
  );
}
