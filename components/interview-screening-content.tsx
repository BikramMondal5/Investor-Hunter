"use client"

import React, { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Calendar, CheckCircle, Video, Clock, Users, AlertCircle, MessageCircle, Mail, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function InterviewScreeningContent() {
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [showRescheduleForm, setShowRescheduleForm] = useState(false)

  // Mock interview data
  const interviewData = {
    date: "August 24, 2025",
    time: "10:30 AM",
    timezone: "IST (UTC+5:30)",
    duration: "20-30 minutes",
    platform: "Secure Video Platform",
    panelSize: "3 members"
  }

  // Process step data for the status tracker
  const processSteps = [
    { id: "upload", label: "Upload Pitch", complete: true, current: false },
    { id: "ai-scoring", label: "AI Scoring", complete: true, current: false },
    { id: "submission", label: "Submission & Scorecard", complete: true, current: false },
    { id: "verification", label: "Document Verification", complete: true, current: false },
    { id: "interview", label: "Internal Interview Screening", complete: false, current: true },
    { id: "investor-pitch", label: "Live Investor Pitch", complete: false, current: false },
  ]

  // Calculate progress percentage based on completed steps
  const completedSteps = processSteps.filter(step => step.complete).length
  const totalSteps = processSteps.length
  const progressPercentage = (completedSteps / totalSteps) * 100

  const handleConfirm = () => {
    setIsConfirmed(true)
    // In a real app, this would send confirmation to the backend
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="container mx-auto max-w-[1200px] px-6 pt-8 pb-16">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Internal Interview Screening
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Our panel evaluates your pitch skills, clarity, and readiness before you meet real investors.
          </p>
        </div>

        {isConfirmed && (
          <Card className="mb-8 border border-green-500/30 bg-green-500/5">
            <CardContent className="pt-6 pb-4 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <p className="text-green-500 font-medium">
                You've confirmed your attendance. We look forward to meeting you!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Interview Details Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Interview Details</CardTitle>
            <CardDescription>
              Please confirm your attendance for the scheduled interview
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Date & Time</p>
                  <p className="text-muted-foreground">
                    {interviewData.date} at {interviewData.time}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {interviewData.timezone}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Duration</p>
                  <p className="text-muted-foreground">
                    {interviewData.duration}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Video className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Platform</p>
                  <p className="text-muted-foreground">
                    {interviewData.platform}
                  </p>
                  <p className="text-sm text-amber-500 hover:underline cursor-pointer">
                    View connection details
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Panel</p>
                  <p className="text-muted-foreground">
                    {interviewData.panelSize}
                  </p>
                  <div className="flex -space-x-2 mt-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="size-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border border-background"
                      >
                        P{i}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {!isConfirmed ? (
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                  onClick={handleConfirm}
                >
                  Confirm Attendance
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowRescheduleForm(true)}
                >
                  Request Reschedule
                </Button>
              </div>
            ) : (
              <div className="pt-2">
                <Button 
                  variant="outline"
                  className="text-primary"
                >
                  Add to Calendar
                </Button>
              </div>
            )}

            {showRescheduleForm && (
              <div className="border border-amber-500/30 bg-amber-500/5 p-4 rounded-lg">
                <p className="text-sm mb-3">
                  <AlertCircle className="h-4 w-4 inline-block mr-2 text-amber-500" />
                  Reschedule requests must be made at least 48 hours before the scheduled time.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    variant="outline" 
                    className="border-amber-500/50 text-amber-500"
                    onClick={() => {
                      // In a real app, this would open a form or modal to select new dates
                      alert("This would open a calendar to choose new dates in a real application")
                    }}
                  >
                    View Available Slots
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={() => setShowRescheduleForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preparation Guidelines */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Preparation Guidelines</h2>
          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Join at least 5 minutes early</p>
                    <p className="text-sm text-muted-foreground">
                      This gives you time to test your audio/video and settle in before the interview begins.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Video className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Ensure stable internet and working mic/camera</p>
                    <p className="text-sm text-muted-foreground">
                      Test your equipment beforehand. Use a quiet space with good lighting.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Be ready to answer business, market, and revenue model questions</p>
                    <p className="text-sm text-muted-foreground">
                      The panel will focus on understanding your business model, target market, and financial projections.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Keep your pitch concise (max 5 minutes)</p>
                    <p className="text-sm text-muted-foreground">
                      Practice delivering your core message efficiently, followed by a Q&A session.
                    </p>
                  </div>
                </li>
              </ul>

              <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-purple-500/20">
                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Image 
                      src="/Clara.png" 
                      width={24} 
                      height={24} 
                      alt="Clara AI Assistant" 
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                      Pro Tip from Clara
                    </p>
                    <p className="text-muted-foreground">
                      Speak with confidence, but keep it authentic. Be honest about challenges and show how you plan to overcome them.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Your Pitch Summary */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Pitch Summary</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative aspect-video w-full md:w-1/3 rounded-lg overflow-hidden bg-muted">
                  <Image 
                    src="/video-pitch-image.png" 
                    fill
                    alt="Your pitch video thumbnail" 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Button variant="outline" className="bg-black/50 text-white border-white/30">
                      Rewatch <Video className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
                <div className="md:w-2/3 space-y-4">
                  <div>
                    <h3 className="font-medium">Eco-friendly Packaging Solution</h3>
                    <p className="text-sm text-muted-foreground">
                      Uploaded on August 5, 2025 • 3:42 minutes
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <p>AI Score</p>
                      <p className="font-medium">87/100</p>
                    </div>
                    <Progress value={87} className="h-1.5" />
                  </div>

                  <div className="pt-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      The panel will have reviewed your pitch video before the interview.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // In a real app, this would allow uploading a revised pitch
                        alert("This would open a file upload dialog in a real application")
                      }}
                    >
                      Upload Revised Pitch
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Tracker */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Application Status</h2>
          <div className="space-y-5">
            <Progress value={progressPercentage} className="h-2" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {processSteps.map((step) => (
                <div 
                  key={step.id} 
                  className={`text-center p-2 pt-6 relative ${
                    step.current 
                      ? "text-primary" 
                      : step.complete 
                      ? "text-muted-foreground" 
                      : "text-muted-foreground/50"
                  }`}
                >
                  {step.complete && (
                    <CheckCircle className="h-4 w-4 absolute top-1 left-1/2 -translate-x-1/2 text-green-500" />
                  )}
                  {step.current && (
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 size-2 rounded-full bg-primary animate-pulse" />
                  )}
                  <p className="text-xs sm:text-sm font-medium">
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Support & Contact */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Support & Contact</h2>
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">
                Need help before your interview? Our team is ready to assist you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Chat with Clara
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Support
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-sm text-muted-foreground">
            <p>
              After your internal interview, you'll receive feedback within 3-5 business days. If successful, 
              you'll move on to the final stage — meeting with real investors!
            </p>
            <div className="flex items-center gap-1 text-primary mt-2 cursor-pointer">
              <span>Learn more about the investor matching process</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
