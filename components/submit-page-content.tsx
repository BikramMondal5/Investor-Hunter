"use client"

import React, { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Upload, Brain, Shield, CheckCircle, RefreshCw } from "lucide-react"
import { AIFeedbackModal } from "@/components/ai-feedback-modal"

export function SubmitPageContent() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  // Use useState and useEffect to ensure client-side rendering
  const [isMounted, setIsMounted] = useState(false)

  // New state for AI feedback modal
  const [showAIFeedback, setShowAIFeedback] = useState(false)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null)
  const [hasReceivedFeedback, setHasReceivedFeedback] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      setVideoFile(file)

      // Create preview URL
      const url = URL.createObjectURL(file)
      setVideoPreviewUrl(url)
      
      // Simulate upload progress
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setUploadProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          
          // Removed automatic modal trigger - will only show when Analyze button is clicked
        }
      }, 200)
    }
  }

  const handleReupload = () => {
    setShowAIFeedback(false)
    setVideoFile(null)
    setVideoPreviewUrl(null)
    setHasReceivedFeedback(true)
    
    // Reset the file input by clearing the value
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!videoFile) {
      alert('Please upload a video')
      return
    }

    // Show loading state
    const submitButton = e.currentTarget.querySelector('button[type="submit"]') as HTMLButtonElement
    if (submitButton) {
      submitButton.disabled = true
      submitButton.textContent = 'Submitting...'
    }
    
    try {
      // First, upload the video
      const videoFormData = new FormData()
      videoFormData.append('video', videoFile)
      
      console.log('Uploading video...')
      const videoUploadRes = await fetch('/api/upload-video', {
        method: 'POST',
        body: videoFormData
      })
      
      if (!videoUploadRes.ok) {
        const errorData = await videoUploadRes.json()
        throw new Error(errorData.error || 'Failed to upload video')
      }
      
      const { videoUrl } = await videoUploadRes.json()
      console.log('Video uploaded:', videoUrl)
      
      // Create FormData from the form
      const form = e.target as HTMLFormElement
      const formData = new FormData(form)
      
      // Add the video URL
      formData.append('videoUrl', videoUrl)
      
      // Debug: Log all form data
      console.log('Form data being sent:')
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value)
      }
      
      console.log('Submitting pitch...')
      const response = await fetch('/api/submit-pitch', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      console.log('Response:', data)
      
      if (data.success) {
        setIsSubmitted(true)
        // Redirect after showing success message
        setTimeout(() => {
          window.location.href = "/entrepreneur-registration"
        }, 2000)
      } else {
        alert(data.error || 'Failed to submit pitch')
        // Reset button
        if (submitButton) {
          submitButton.disabled = false
          submitButton.innerHTML = 'Analyze & Submit Pitch'
        }
      }
    } catch (error: any) {
      console.error('Error submitting pitch:', error)
      alert(error.message || 'Failed to submit pitch. Please try again.')
      // Reset button
      if (submitButton) {
        submitButton.disabled = false
        submitButton.innerHTML = 'Analyze & Submit Pitch'
      }
    }
  }

  // Return null during server-side rendering
  if (!isMounted) {
    return null
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold">Pitch Submitted!</h2>
            <p className="text-muted-foreground">Your pitch is being processed. Redirecting you to document verification...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto w-full max-w-[1400px] px-3 sm:px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <div className="flex justify-center mb-2">
              <div className="bg-amber-500 text-black font-medium px-2 py-0.5 rounded-md text-sm">Step 1 of 2</div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Submit Your Startup Pitch</h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              All it takes is a 3-minute video. No pitch decks. No referrals.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" name="fullName" placeholder="John Doe" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="startupName">Startup Name</Label>
                        <Input id="startupName" name="startupName" placeholder="Your Startup" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="oneLiner">One-liner about your startup</Label>
                      <Textarea
                        id="oneLiner"
                        name="oneLiner"
                        placeholder="Describe your startup in one compelling sentence..."
                        className="min-h-[100px]"
                        required
                      />
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Pitch Video (Max 3 minutes)</Label>
                      </div>
                      
                      {videoPreviewUrl ? (
                        <div className="border rounded-lg overflow-hidden">
                          <div className="relative">
                            <video 
                              src={videoPreviewUrl} 
                              controls 
                              className="w-full h-auto max-h-[300px]"
                            />
                            <Button 
                              variant="secondary" 
                              size="sm"
                              onClick={handleReupload} 
                              className="absolute top-2 right-2 flex items-center gap-1 bg-background/80 backdrop-blur-sm"
                            >
                              <RefreshCw className="h-3 w-3" /> Re-record
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors relative">
                          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Drop your video here or click to browse</p>
                            <p className="text-xs text-muted-foreground">MP4, MOV, AVI up to 100MB</p>
                          </div>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                      )}
                      
                      {isUploading && (
                        <div className="space-y-2">
                          <Progress value={uploadProgress} />
                          <p className="text-xs text-muted-foreground text-center">Uploading... {uploadProgress}%</p>
                        </div>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Select name="industry" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fintech">Fintech</SelectItem>
                            <SelectItem value="edtech">Edtech</SelectItem>
                            <SelectItem value="healthtech">Healthtech</SelectItem>
                            <SelectItem value="saas">SaaS</SelectItem>
                            <SelectItem value="ecommerce">E-commerce</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" name="location" placeholder="City, Country" required />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Stage</Label>
                      <RadioGroup defaultValue="idea" name="stage" className="flex space-x-6">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="idea" id="idea" />
                          <Label htmlFor="idea">Idea</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mvp" id="mvp" />
                          <Label htmlFor="mvp">MVP</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="growth" id="growth" />
                          <Label htmlFor="growth">Growth</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" name="email" type="email" placeholder="john@startup.com" required />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="public" name="public" />
                      <Label htmlFor="public" className="text-sm">
                        Make my pitch public for community feedback
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" required />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the{" "}
                        <a href="#" className="text-primary hover:underline">
                          terms & privacy policy
                        </a>
                      </Label>
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full"
                      disabled={!videoFile}
                    >
                      <Brain className="mr-2 h-4 w-4" />
                      Analyze & Submit Pitch
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <span>How AI Evaluation Works</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm">Analyzes clarity & uniqueness</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm">Multilingual speech-to-text supported</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm">Feedback from early backers</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm">Get notified when investors view</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">Secure & Private</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your pitch is encrypted and only shared with verified investors who match your criteria.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* AI Feedback Modal */}
      <AIFeedbackModal 
        isOpen={showAIFeedback} 
        onClose={() => setShowAIFeedback(false)}
        videoFile={videoFile}
        onReupload={handleReupload}
      />
    </div>
  )
}