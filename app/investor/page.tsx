"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
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
} from "@/components/ui/dialog"

export default function InvestorPortal() {
  const [isMounted, setIsMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("discover")
  const [viewMode, setViewMode] = useState("grid")
  const [aiScoreRange, setAiScoreRange] = useState([7])
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [currentStartup, setCurrentStartup] = useState<any>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const startups = [
    {
      id: 1,
      name: "Articuno.AI",
      logo: "Ar",
      tagline: "AI-powered workflow automation for small businesses",
      location: "San Francisco, CA",
      stage: "MVP",
      industry: "SaaS",
      aiScore: 8.8,
      founder: "Bikram Mondal",
      isVerified: true,
      views: 47,
      saved: false,
      videoUrl: "/articuno.mp4"
    },
    {
      id: 2,
      name: "EcoTrack",
      logo: "ET",
      tagline: "Carbon footprint tracking for sustainable living",
      location: "Berlin, Germany",
      stage: "Growth",
      industry: "Climate Tech",
      aiScore: 9.2,
      founder: "Maria Schmidt",
      isVerified: true,
      views: 89,
      saved: true,
      videoUrl: "/articuno.mp4" // Using same video for demo
    },
    {
      id: 3,
      name: "HealthAI",
      logo: "HA",
      tagline: "AI-driven personalized health recommendations",
      location: "Toronto, Canada",
      stage: "Idea",
      industry: "HealthTech",
      aiScore: 7.9,
      founder: "Dr. Sarah Chen",
      isVerified: true,
      views: 23,
      saved: false,
      videoUrl: "/articuno.mp4" // Using same video for demo
    },
  ]

  const openVideoModal = (startup) => {
    setCurrentStartup(startup)
    setVideoModalOpen(true)
  }

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
                    <p className="text-muted-foreground">Found {startups.length} startups matching your criteria</p>
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

                {/* Startup Cards */}
                <div className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                  {startups.map((startup) => (
                    <Card key={startup.id} className="group hover:shadow-lg transition-all duration-300">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {startup.logo}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold">{startup.name}</h3>
                                {startup.isVerified && <CheckCircle className="h-4 w-4 text-green-500" />}
                              </div>
                              <p className="text-sm text-muted-foreground">by {startup.founder}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className={startup.saved ? "text-red-500" : ""}>
                            <Heart className={`h-4 w-4 ${startup.saved ? "fill-current" : ""}`} />
                          </Button>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <p className="text-sm">{startup.tagline}</p>

                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{startup.location}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {startup.stage}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {startup.industry}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-semibold">{startup.aiScore}</span>
                            <span className="text-xs text-muted-foreground">AI Score</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Eye className="h-3 w-3" />
                            <span>{startup.views} views</span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button size="sm" className="flex-1" onClick={() => openVideoModal(startup)}>
                            <Play className="mr-2 h-3 w-3" />
                            Watch Pitch
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="mr-2 h-3 w-3" />
                            Contact
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "saved" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">My Saved Pitches</h2>
                  <p className="text-muted-foreground">Startups you've bookmarked for later review</p>
                </div>

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
              {currentStartup?.name} - Pitch Video by {currentStartup?.founder}
            </DialogTitle>
          </DialogHeader>
          <div className="relative pb-[42.25%] mt-1">
            <video 
              src={currentStartup?.videoUrl} 
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
    </div>
  )
}
