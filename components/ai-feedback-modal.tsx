// filepath: d:\Programming\Heritage\Investor-Hunter\components\ai-feedback-modal.tsx
"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Brain, Send, Video, Award, RefreshCw } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface AIFeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  videoFile: File | null
  onReupload: () => void
}

export function AIFeedbackModal({ isOpen, onClose, videoFile, onReupload }: AIFeedbackModalProps) {
  const [activeTab, setActiveTab] = useState("summary")
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi there! I've analyzed your pitch video. What specific aspect would you like feedback on?" }
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [score, setScore] = useState(8) // Changed from 78 to 8 (out of 10)

  // Mock suggestions that would come from an actual AI model
  const [suggestions, setSuggestions] = useState({
    clarity: [
      "Your problem statement could be clearer - consider starting with a specific pain point",
      "The solution explanation feels rushed; spend 10-15 more seconds on how your technology works"
    ],
    presentation: [
      "Your eye contact is good, but try to reduce looking down at notes",
      "Consider adjusting your lighting - there's a shadow on the right side of your face"
    ],
    structure: [
      "Missing clear ask - specify investment amount and how it will be used",
      "No mention of your business model or revenue streams",
      "Team section is strong but could be more concise"
    ],
    technical: [
      "Video resolution is good, but audio has some background noise",
      "Video length (3:22) slightly exceeds the recommended 3-minute guideline"
    ]
  })

  // Simulate AI analysis loading
  React.useEffect(() => {
    if (isOpen && loading) {
      setTimeout(() => {
        setLoading(false)
      }, 3000)
    }
  }, [isOpen, loading])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    // Add user message
    const newMessages = [
      ...messages,
      { role: "user", content: inputMessage }
    ]
    setMessages(newMessages)
    setInputMessage("")

    // Simulate AI response
    setTimeout(() => {
      let response = ""
      const lowerCaseInput = inputMessage.toLowerCase()

      if (lowerCaseInput.includes("missing")) {
        response = "Based on your pitch, you're missing a clear 'ask' (how much funding you need) and details about your business model. I'd recommend adding these elements for a more complete pitch."
      } else if (lowerCaseInput.includes("confident")) {
        response = "To sound more confident, try to eliminate filler words like 'um' and 'like' which appeared 12 times in your pitch. Also, speak about 10-15% slower to give your points more weight."
      } else if (lowerCaseInput.includes("problem")) {
        response = "Your problem statement was presented at 0:42 but wasn't clearly connected to your solution. Try using a specific example or statistic to make the problem more tangible before introducing your product."
      } else {
        response = "I analyzed your pitch and noticed you did well articulating your team's qualifications, but could improve the clarity of your value proposition. Would you like specific tips on how to refine that section?"
      }

      setMessages([...newMessages, { role: "assistant", content: response }])
    }, 1000)
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col overflow-hidden" style={{ minHeight: "600px" }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Pitch Analysis
            {!loading && <Badge variant="outline">{score}/10</Badge>}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <Brain className="h-12 w-12 text-primary animate-pulse" />
            <p className="text-sm text-muted-foreground">Analyzing your pitch video...</p>
            <Progress value={65} className="w-[250px]" />
          </div>
        ) : (
          <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden h-[500px]">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="ask-ai">Ask AI</TabsTrigger>
              <TabsTrigger value="preview">Video Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="flex-1 overflow-y-auto p-1">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-500" />
                    <h3 className="font-semibold">Pitch Score: {score}/10</h3>
                  </div>
                  <Button variant="outline" size="sm" onClick={onReupload}>
                    <RefreshCw className="h-4 w-4 mr-1" /> Re-record
                  </Button>
                </div>
                
                <Accordion type="multiple" defaultValue={["clarity", "presentation", "structure"]}>
                  <AccordionItem value="clarity">
                    <AccordionTrigger>
                      <span className="flex items-center gap-2">
                        <Badge variant={suggestions.clarity.length > 1 ? "destructive" : "outline"}>
                          {suggestions.clarity.length}
                        </Badge>
                        Content Clarity
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2">
                        {suggestions.clarity.map((item, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <div className="rounded-full bg-red-100 dark:bg-red-900 p-1 mt-0.5">
                              <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                            </div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="presentation">
                    <AccordionTrigger>
                      <span className="flex items-center gap-2">
                        <Badge variant={suggestions.presentation.length > 1 ? "destructive" : "outline"}>
                          {suggestions.presentation.length}
                        </Badge>
                        Presentation Style
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2">
                        {suggestions.presentation.map((item, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-1 mt-0.5">
                              <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            </div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="structure">
                    <AccordionTrigger>
                      <span className="flex items-center gap-2">
                        <Badge variant={suggestions.structure.length > 2 ? "destructive" : "outline"}>
                          {suggestions.structure.length}
                        </Badge>
                        Structure & Content
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2">
                        {suggestions.structure.map((item, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <div className="rounded-full bg-red-100 dark:bg-red-900 p-1 mt-0.5">
                              <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                            </div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="technical">
                    <AccordionTrigger>
                      <span className="flex items-center gap-2">
                        <Badge variant="outline">{suggestions.technical.length}</Badge>
                        Technical Quality
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2">
                        {suggestions.technical.map((item, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-1 mt-0.5">
                              <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                            </div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>
            
            <TabsContent value="ask-ai" className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-1">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div 
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`flex items-start gap-3 max-w-[80%] ${
                          message.role === 'user' 
                            ? 'flex-row-reverse' 
                            : ''
                        }`}
                      >
                        <Avatar className={`h-8 w-8 ${message.role === 'assistant' ? 'bg-primary/10' : 'bg-muted'}`}>
                          <AvatarFallback>
                            {message.role === 'assistant' ? (
                              <Brain className="h-4 w-4 text-primary" />
                            ) : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <Card className={`${
                          message.role === 'assistant' 
                            ? 'border-primary/20 bg-primary/5' 
                            : ''
                        }`}>
                          <CardContent className="p-3">
                            <p className="text-sm">{message.content}</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <form onSubmit={handleSendMessage} className="flex gap-2 pt-4 border-t">
                <Input 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about your pitch..."
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="preview" className="flex-1 overflow-hidden flex items-center justify-center">
              {videoFile ? (
                <video
                  src={URL.createObjectURL(videoFile)}
                  controls
                  className="max-h-[400px] max-w-full"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <Video className="h-12 w-12 mb-2" />
                  <p>Video preview unavailable</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}