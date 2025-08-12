"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import VideoConference from "@/components/video-conference/video-conference";

export default function MeetingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [meetingCode, setMeetingCode] = useState<string | null>(null);

  // Get meeting code from URL parameters or generate a new one
  useEffect(() => {
    const codeFromParams = searchParams.get('code');
    if (codeFromParams) {
      setMeetingCode(codeFromParams);
    } else {
      // Generate meeting code if not provided
      const newCode = "IH-" + Math.random().toString(36).substring(2, 8).toUpperCase();
      setMeetingCode(newCode);
    }
  }, [searchParams]);

  const endMeeting = () => {
    // Navigate back to the internal interview page
    router.push("/internal-interview");
  };

  // Don't render until we have a meeting code
  if (!meetingCode) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center">
        <div className="w-24 h-24 border-4 border-t-[#4F46E5] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <p className="text-[#EAEAEA] mt-4">Preparing your meeting...</p>
      </div>
    );
  }

  return (
    <VideoConference
      meetingTitle="InvestorHunt Internal Interview"
      meetingCode={meetingCode}
      isRecording={true}
      onLeave={endMeeting}
    />
  );
}
