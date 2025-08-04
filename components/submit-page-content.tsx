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
import { Upload, Brain, Shield, CheckCircle } from "lucide-react"

export function SubmitPageContent() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  // Use useState and useEffect to ensure client-side rendering
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      // Simulate upload progress
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setUploadProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
          setIsUploading(false)
        }
      }, 200)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => {
      window.location.href = "/dashboard"
    }, 2000)
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
            <p className="text-muted-foreground">Your pitch is being analyzed. Redirecting to dashboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-3xl md:text-4xl font-bold">Submit Your Startup Pitch</h1>
            <p className="text-xl text-muted-foreground">
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
                        <Input id="fullName" placeholder="John Doe" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="startupName">Startup Name</Label>
                        <Input id="startupName" placeholder="Your Startup" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="oneLiner">One-liner about your startup</Label>
                      <Textarea
                        id="oneLiner"
                        placeholder="Describe your startup in one compelling sentence..."
                        className="min-h-[100px]"
                        required
                      />
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                      <Label>Pitch Video (Max 3 minutes)</Label>
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
                      {isUploading && (
                        <div className="space-y-2">
                          <Progress value={uploadProgress} />
                          <p className="text-xs text-muted-foreground text-center">Uploading... {uploadProgress}%</p>
                        </div>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Industry</Label>
                        <Select>
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
                        <Input id="location" placeholder="City, Country" required />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Stage</Label>
                      <RadioGroup defaultValue="idea" className="flex space-x-6">
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
                      <Input id="email" type="email" placeholder="john@startup.com" required />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="public" />
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

                    <Button type="submit" size="lg" className="w-full">
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
    </div>
  )
}