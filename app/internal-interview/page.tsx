"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import VideoConference from "@/components/video-conference/video-conference";
import { Button } from "@/components/ui/button";
import { Camera, UserPlus, Users } from "lucide-react";

export default function InterviewScreeningPage() {
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
        meetingTitle="InvestorHunt Internal Interview"
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
          <h1 className="text-2xl font-bold text-[#EAEAEA] mb-6 text-center">Internal Interview Session</h1>
          
          <div className="space-y-6">
            <div className="flex gap-4 items-center p-4 border border-[#2A2A2A] rounded-lg bg-[#0D0D0D]">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#9333EA] flex items-center justify-center text-white">
                <Camera size={24} />
              </div>
              <div>
                <h3 className="text-[#EAEAEA] font-medium">Video Interview</h3>
                <p className="text-[#A1A1A1] text-sm">Meet with entrepreneurs to assess their pitch and business model</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-center p-4 border border-[#2A2A2A] rounded-lg bg-[#0D0D0D]">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#9333EA] flex items-center justify-center text-white">
                <UserPlus size={24} />
              </div>
              <div>
                <h3 className="text-[#EAEAEA] font-medium">Meeting Code</h3>
                <p className="text-[#A1A1A1] text-sm">Share this code with the entrepreneur: <span className="font-medium text-[#EAEAEA]">{meetingCode}</span></p>
              </div>
            </div>
            
            <div className="flex gap-4 items-center p-4 border border-[#2A2A2A] rounded-lg bg-[#0D0D0D]">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#9333EA] flex items-center justify-center text-white">
                <Users size={24} />
              </div>
              <div>
                <h3 className="text-[#EAEAEA] font-medium">Attendees</h3>
                <p className="text-[#A1A1A1] text-sm">You (Host), Entrepreneur, Optional: InvestorHunt Team Member</p>
              </div>
            </div>
            
            <div className="p-5 border border-[#2A2A2A] rounded-lg bg-[#0D0D0D]">
              <h3 className="text-[#EAEAEA] font-medium mb-3">Interview Guidelines</h3>
              <ul className="space-y-3 text-[#A1A1A1] text-sm">
                <li className="flex items-start">
                  <span className="inline-block h-5 w-5 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#9333EA] mr-2 flex-shrink-0 mt-0.5"></span>
                  <span><strong className="text-[#EAEAEA]">Know Your Numbers</strong> – Be crystal clear on your financials, market size, revenue model, and funding needs.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block h-5 w-5 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#9333EA] mr-2 flex-shrink-0 mt-0.5"></span>
                  <span><strong className="text-[#EAEAEA]">Understand the Investor</strong> – Research their past investments, preferred industries, and deal sizes to tailor your conversation.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block h-5 w-5 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#9333EA] mr-2 flex-shrink-0 mt-0.5"></span>
                  <span><strong className="text-[#EAEAEA]">Prepare for Tough Questions</strong> – Anticipate challenges about competition, scalability, and potential risks.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block h-5 w-5 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#9333EA] mr-2 flex-shrink-0 mt-0.5"></span>
                  <span><strong className="text-[#EAEAEA]">Be Polite & Respectful</strong> – Maintain professionalism, listen actively, and value their time and feedback.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block h-5 w-5 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#9333EA] mr-2 flex-shrink-0 mt-0.5"></span>
                  <span><strong className="text-[#EAEAEA]">Show Confidence & Authenticity</strong> – Communicate with passion and honesty—investors invest in people as much as ideas.</span>
                </li>
              </ul>
            </div>
            
            <div className="pt-4">
              <Button 
                onClick={startMeeting} 
                className="w-full py-6 text-lg font-medium bg-gradient-to-r from-[#4F46E5] to-[#9333EA] hover:from-[#4338CA] hover:to-[#7E22CE] text-white"
              >
                Start Interview Session
              </Button>
              
              <p className="text-center text-[#A1A1A1] text-sm mt-4">
                By starting the interview, you agree to our <a href="#" className="text-[#4F46E5] hover:underline">Terms of Service</a> and <a href="#" className="text-[#4F46E5] hover:underline">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
