"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import VideoConference from "@/components/video-conference/video-conference";
import { Button } from "@/components/ui/button";
import { Camera, UserPlus, Users, DollarSign } from "lucide-react";

export default function InvestorMeetingPage() {
  const router = useRouter();
  const [isInMeeting, setIsInMeeting] = useState(false);
  const [meetingCode, setMeetingCode] = useState("IH-MEETING");
  
  // Generate meeting code on client-side only to prevent hydration mismatch
  useEffect(() => {
    setMeetingCode("IH-" + Math.random().toString(36).substring(2, 8).toUpperCase());
  }, []);

  const startMeeting = () => {
    setIsInMeeting(true);
  };

  const endMeeting = () => {
    // In a real app, you would clean up WebRTC connections here
    router.push("/dashboard");
  };

  if (isInMeeting) {
    return (
      <VideoConference
        meetingTitle="InvestorHunt Investor Meeting"
        meetingCode={meetingCode}
        isRecording={true}
        onLeave={endMeeting}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-xl bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-[#EAEAEA] mb-6 text-center">Investor Meeting</h1>
          
          <div className="space-y-6">
            <div className="flex gap-4 items-center p-4 border border-[#2A2A2A] rounded-lg bg-[#0D0D0D]">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#9333EA] flex items-center justify-center text-white">
                <Camera size={24} />
              </div>
              <div>
                <h3 className="text-[#EAEAEA] font-medium">Investor Meeting</h3>
                <p className="text-[#A1A1A1] text-sm">Connect entrepreneurs with potential investors for funding discussions</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-center p-4 border border-[#2A2A2A] rounded-lg bg-[#0D0D0D]">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#9333EA] flex items-center justify-center text-white">
                <UserPlus size={24} />
              </div>
              <div>
                <h3 className="text-[#EAEAEA] font-medium">Meeting Code</h3>
                <p className="text-[#A1A1A1] text-sm">Share this code with participants: <span className="font-medium text-[#EAEAEA]">{meetingCode}</span></p>
              </div>
            </div>
            
            <div className="flex gap-4 items-center p-4 border border-[#2A2A2A] rounded-lg bg-[#0D0D0D]">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#9333EA] flex items-center justify-center text-white">
                <Users size={24} />
              </div>
              <div>
                <h3 className="text-[#EAEAEA] font-medium">Attendees</h3>
                <p className="text-[#A1A1A1] text-sm">You (Host), Investor(s), Entrepreneur, Optional: Legal Advisors</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-center p-4 border border-[#2A2A2A] rounded-lg bg-[#0D0D0D]">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#9333EA] flex items-center justify-center text-white">
                <DollarSign size={24} />
              </div>
              <div>
                <h3 className="text-[#EAEAEA] font-medium">Meeting Features</h3>
                <p className="text-[#A1A1A1] text-sm">Screen sharing for pitch decks, secure document sharing, AI assistant</p>
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                onClick={startMeeting} 
                className="w-full py-6 text-lg font-medium bg-gradient-to-r from-[#4F46E5] to-[#9333EA] hover:from-[#4338CA] hover:to-[#7E22CE] text-white"
              >
                Start Investor Meeting
              </Button>
              
              <p className="text-center text-[#A1A1A1] text-sm mt-4">
                All meetings are end-to-end encrypted and secure
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
