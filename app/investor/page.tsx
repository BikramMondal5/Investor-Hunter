"use client"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import {
  Search,
  Filter,
  Play,
  Bookmark,
  MessageSquare,
  Star,
  MapPin,
  TrendingUp,
  Shield,
  CheckCircle,
  Eye,
  Heart,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"

interface StartupPitch {
  _id: string;
  personalInfo?: {
    fullName?: string;
    userId?: string;
  };
  pitchData?: {
    startupName?: string;
    oneLiner?: string;
    location?: string;
    stage?: string;
    industry?: string;
    videoUrl?: string;
  };
}

export default function InvestorPortal() {
  const [isMounted, setIsMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("discover")
  const [viewMode, setViewMode] = useState("grid")
  const [aiScoreRange, setAiScoreRange] = useState([7])
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [currentStartup, setCurrentStartup] = useState<StartupPitch | null>(null)
  const router = useRouter()
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)

const [messageModalOpen, setMessageModalOpen] = useState(false)
const [selectedStartup, setSelectedStartup] = useState<StartupPitch | null>(null)
const [messageContent, setMessageContent] = useState('')
const [isSendingMessage, setIsSendingMessage] = useState(false)


const handleMessage = (startup: StartupPitch) => {
  setSelectedStartup(startup)
  setMessageModalOpen(true)
  setMessageContent('')
}

  const [startups, setStartups] = useState<StartupPitch[]>([])
  const [isLoadingStartups, setIsLoadingStartups] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [savedPitches, setSavedPitches] = useState(new Set<string>())

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (activeTab === 'saved') {
      const fetchSavedPitches = async () => {
        try {
          const res = await fetch('/api/saved-pitches')
          if (res.ok) {
            const data = await res.json()
            const savedIds = new Set<string>(
              data.pitches.map((p: any) => {
                const pitchId = typeof p.pitchId === 'string' ? p.pitchId : p.pitchId?._id
                return pitchId || ''
              }).filter((id: string) => id)
            )
            setSavedPitches(savedIds)
          }
        } catch (error) {
          console.error('Failed to fetch saved pitches:', error)
        }
      }
      fetchSavedPitches()
    }
  }, [activeTab])

  useEffect(() => {
    const fetchApprovedPitches = async () => {
      try {
        const res = await fetch('/api/approved-pitches')
        if (res.ok) {
          const data = await res.json()
          setStartups(data.pitches || [])
        } else {
          console.error('Failed to fetch approved pitches, status:', res.status)
          const errorText = await res.text()
          console.error('Error response:', errorText)
        }
      } catch (error) {
        console.error('Failed to fetch approved pitches:', error)
      } finally {
        setIsLoadingStartups(false)
      }
    }

    fetchApprovedPitches()
  }, [])

  if (!isMounted) {
    return null
  }

  const openVideoModal = (startup: StartupPitch) => {
    setCurrentStartup(startup)
    setVideoModalOpen(true)
  }

  const toggleSave = async (startupId: string) => {
    try {
      const startup = startups.find(s => s._id === startupId)
      // Use userId if available, fallback to _id
      const entrepreneurId = startup?.personalInfo?.userId || startup?._id || startupId
      const isSaved = savedPitches.has(startupId)
      
      const res = await fetch('/api/saved-pitches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pitchId: startupId,
          entrepreneurId: entrepreneurId,
          action: isSaved ? 'unsave' : 'save'
        })
      })

      if (res.ok) {
        setSavedPitches(prev => {
          const newSet = new Set(prev)
          if (newSet.has(startupId)) {
            newSet.delete(startupId)
          } else {
            newSet.add(startupId)
          }
          return newSet
        })
      }
    } catch (error) {
      console.error('Failed to save pitch:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!selectedStartup || !messageContent.trim()) return

    setIsSendingMessage(true)
    try {
      const entrepreneurId = selectedStartup.personalInfo?.userId || selectedStartup._id
      
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: entrepreneurId,
          pitchId: selectedStartup._id,
          content: messageContent,
          senderRole: 'investor'
        })
      })

      if (res.ok) {
        setMessageModalOpen(false)
        setMessageContent('')
        alert('Message sent successfully!')
      } else {
        alert('Failed to send message')
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('Error sending message')
    } finally {
      setIsSendingMessage(false)
    }
  }

  const displayedStartups = showAll ? startups : startups.slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto w-full max-w-[1400px] px-3 sm:px-4 md:px-6 flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              InvestorHunt
            </span>
          </div>

          <div className="flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search startups, industries, or founders..." className="pl-10" />
            </div>
          </div>

          <Avatar>
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-muted/30 min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            <Button
              variant={activeTab === "discover" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("discover")}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Discover Startups
            </Button>
            <Button
              variant={activeTab === "saved" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("saved")}
            >
              <Bookmark className="mr-2 h-4 w-4" />
              My Saved Pitches
            </Button>
            <Button
              variant={activeTab === "messages" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("messages")}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Messaging
            </Button>
            <div className="pt-6 mt-4 border-t">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10"
                onClick={() => setLogoutDialogOpen(true)}
              >
                <LogOut className="mr-3 h-4 w-4" />
                Logout
              </Button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-6 border-b">
            <div className="container mx-auto w-full max-w-[1400px] px-3 sm:px-4 md:px-6">
              <div className="flex items-center space-x-2 text-sm">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="font-medium">Empowering global innovation through inclusive pitching</span>
                <Badge variant="secondary" className="ml-2">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  End-to-end encrypted
                </Badge>
              </div>
            </div>
          </div>

          <div className="container mx-auto w-full max-w-[1400px] px-3 sm:px-4 md:px-6 py-6">
            {activeTab === "discover" && (
              <div className="space-y-6">
                {/* Filters */}
                <Card>
                  <CardContent className="p-4">
                    <div className="grid md:grid-cols-5 gap-4 items-end">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Industry</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="All Industries" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Industries</SelectItem>
                            <SelectItem value="saas">SaaS</SelectItem>
                            <SelectItem value="fintech">Fintech</SelectItem>
                            <SelectItem value="healthtech">HealthTech</SelectItem>
                            <SelectItem value="climate">Climate Tech</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Location</label>
                        <Input placeholder="Any location" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Stage</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="All Stages" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Stages</SelectItem>
                            <SelectItem value="idea">Idea</SelectItem>
                            <SelectItem value="mvp">MVP</SelectItem>
                            <SelectItem value="growth">Growth</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">AI Score: {aiScoreRange[0]}+</label>
                        <Slider
                          value={aiScoreRange}
                          onValueChange={setAiScoreRange}
                          max={10}
                          min={1}
                          step={0.1}
                          className="w-full"
                        />
                      </div>

                      <Button>
                        <Filter className="mr-2 h-4 w-4" />
                        Apply Filters
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Results Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Discover Startups</h2>
                    <p className="text-muted-foreground">Found {startups.length} startups</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      Grid
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      List
                    </Button>
                  </div>
                </div>

                {/* Loading State */}
                {isLoadingStartups ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading startups...</p>
                  </div>
                ) : startups.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <p className="text-muted-foreground">No approved startups available yet.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {/* Startup Cards */}
                    <div className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                      {displayedStartups.map((startup) => {
                        const isSaved = savedPitches.has(startup._id)
                        const founderName = startup.personalInfo?.fullName || 'Anonymous'
                        const initials = startup.pitchData?.startupName
                          ?.split(' ')
                          .map((word: string) => word[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2) || 'ST'

                        return (
                          <Card key={startup._id} className="group hover:shadow-lg transition-all duration-300">
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-12 w-12">
                                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                      {initials}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="flex items-center space-x-2">
                                      <h3 className="font-semibold">{startup.pitchData?.startupName || 'Startup'}</h3>
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    </div>
                                    <p className="text-sm text-muted-foreground">by {founderName}</p>
                                  </div>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className={isSaved ? "text-red-500" : ""}
                                  onClick={() => toggleSave(startup._id)}
                                >
                                  <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                                </Button>
                              </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                              <p className="text-sm">{startup.pitchData?.oneLiner || 'No description available'}</p>

                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{startup.pitchData?.location || 'Location not specified'}</span>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {startup.pitchData?.stage || 'N/A'}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {startup.pitchData?.industry || 'N/A'}
                                </Badge>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                  <span className="font-semibold">8.7</span>
                                  <span className="text-xs text-muted-foreground">AI Score</span>
                                </div>
                                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                  <Eye className="h-3 w-3" />
                                  <span>47 views</span>
                                </div>
                              </div>

                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  className="flex-1" 
                                  onClick={() => openVideoModal(startup)}
                                >
                                  <Play className="mr-2 h-3 w-3" />
                                  Watch Pitch
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleMessage(startup)}
                                >
                                  <MessageSquare className="mr-2 h-3 w-3" />
                                  Message
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>

                    {/* Show More Button */}
                    {startups.length > 3 && (
                      <div className="flex justify-center pt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setShowAll(!showAll)}
                          className="min-w-[200px]"
                        >
                          {showAll ? 'Show Less' : `Show More (${startups.length - 3} more)`}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === "saved" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">My Saved Pitches</h2>
                  <p className="text-muted-foreground">Startups you've bookmarked for later review</p>
                </div>

                {savedPitches.size === 0 ? (
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-center py-12">
                          <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No saved pitches yet</h3>
                          <p className="text-muted-foreground mb-4">
                            Start exploring startups and save the ones that interest you
                          </p>
                          <Button onClick={() => setActiveTab("discover")}>Discover Startups</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                      {/* Map through saved pitches from state/API */}
                    </div>
                  )}
              </div>
            )}

            {activeTab === "messages" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Messages</h2>
                  <p className="text-muted-foreground">Connect with startup founders</p>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Your inbox is empty</h3>
                      <p className="text-muted-foreground mb-4">
                        Start conversations with startups you're interested in
                      </p>
                      <Button onClick={() => setActiveTab("discover")}>Discover Startups</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Video Modal */}
      <Dialog open={videoModalOpen} onOpenChange={setVideoModalOpen}>
        <DialogContent className="max-w-[85vw] md:max-w-[75vw] lg:max-w-[70vw] p-0 overflow-hidden border-2 shadow-xl">
          <DialogHeader className="p-3 pb-0">
            <DialogTitle className="text-base">
              {currentStartup?.pitchData?.startupName} - Pitch Video by {currentStartup?.personalInfo?.fullName}
            </DialogTitle>
          </DialogHeader>
          <div className="relative pb-[42.25%] mt-1">
            <video 
              src={currentStartup?.pitchData?.videoUrl} 
              className="absolute inset-0 w-full h-full object-contain bg-black"
              controls
              autoPlay
              playsInline
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="p-2 flex justify-end">
            <Button size="sm" onClick={() => setVideoModalOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">Are you sure you want to logout? Any unsaved changes will be lost.</p>
          </div>
          <div className="flex space-x-2 justify-end">
            <Button 
              variant="outline" 
              onClick={() => setLogoutDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={async () => {
                setLogoutDialogOpen(false);
                
                try {
                  await fetch('/api/logout', { 
                    method: 'POST',
                    headers: {
                      'Cache-Control': 'no-cache, no-store, must-revalidate',
                      'Pragma': 'no-cache',
                      'Expires': '0'
                    }
                  });
                  
                  if (typeof window !== 'undefined') {
                    sessionStorage.clear();
                    localStorage.clear();
                  }
                  
                  window.location.href = '/?t=' + Date.now();
                } catch (error) {
                  console.error('Logout error:', error);
                  window.location.href = '/?t=' + Date.now();
                }
              }}
            >
              Logout
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={messageModalOpen} onOpenChange={setMessageModalOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Message {selectedStartup?.pitchData?.startupName || 'Founder'}</DialogTitle>
          <DialogDescription>
            {selectedStartup?.personalInfo?.fullName || 'Founder'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">{selectedStartup?.pitchData?.startupName}</p>
            <p className="text-xs text-muted-foreground">{selectedStartup?.pitchData?.oneLiner}</p>
          </div>
          <Textarea
            placeholder="Type your message..."
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setMessageModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={isSendingMessage || !messageContent.trim()}
            >
              {isSendingMessage ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </div>
  )
}