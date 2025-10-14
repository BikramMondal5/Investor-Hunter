"use client"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect, ChangeEvent, FormEvent} from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { AvatarImage } from "@/components/ui/avatar"
import {User, Settings} from "lucide-react"
import { Trash2 } from "lucide-react"
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
import { set } from "mongoose"

interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  profilePhoto?: string;
}

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
    pitchScore?: number|null;
  };
}

export default function InvestorPortal() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [savedPitchDetails, setSavedPitchDetails] = useState<StartupPitch[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedStage, setSelectedStage] = useState("all")
  const [filteredStartups, setFilteredStartups] = useState<StartupPitch[]>([])
  const [conversations, setConversations] = useState<any[]>([])
  const [isLoadingConversations, setIsLoadingConversations] = useState(false)
  const [selectedConversation, setSelectedConversation] = useState<any | null>(null)
  const [conversationMessages, setConversationMessages] = useState<any[]>([])
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [messageInput, setMessageInput] = useState('')
  const [isSendingInConversation, setIsSendingInConversation] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("discover")
  const [viewMode, setViewMode] = useState("grid")
  const [aiScoreRange, setAiScoreRange] = useState([7])
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [currentStartup, setCurrentStartup] = useState<StartupPitch | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [filtersApplied, setFiltersApplied] = useState(false)
  const [editedProfile, setEditedProfile] = useState<Profile | null>(null)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const [updateSuccessDialogOpen, setUpdateSuccessDialogOpen] = useState(false)
  const router = useRouter()
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const [meetingId, setMeetingId] = useState("")
  const [isCopied, setIsCopied] = useState(false)

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

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch('/api/messages?type=unread-count')
      if (res.ok) {
        const data = await res.json()
        setUnreadCount(data.unreadCount || 0)
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    }
  }

  useEffect(() => {
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  useEffect(() => {
    // Reset meeting ID when leaving create-meeting tab
    if (activeTab !== 'create-meeting') {
      setMeetingId('')
      setIsCopied(false)
    }
  }, [activeTab])
  
  useEffect(() => {
    if (activeTab === 'messages') {
      fetchConversations()
    }
  }, [activeTab])

  useEffect(() => {
    if (!filtersApplied) {
      setFilteredStartups(startups)
    }
  }, [startups, filtersApplied])

  useEffect(() => {
    if (!filtersApplied) {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const filtered = startups.filter(startup => 
          startup.pitchData?.startupName?.toLowerCase().includes(query) ||
          startup.pitchData?.oneLiner?.toLowerCase().includes(query) ||
          startup.pitchData?.industry?.toLowerCase().includes(query) ||
          startup.personalInfo?.fullName?.toLowerCase().includes(query)
        )
        setFilteredStartups(filtered)
      } else {
        setFilteredStartups(startups)
      }
    }
  }, [searchQuery, startups, filtersApplied])


  useEffect(() => {
    if (activeTab === 'discover') {
      const loadSavedPitches = async () => {
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
          console.error('Failed to load saved pitches:', error)
        }
      }

      loadSavedPitches()
    }
  }, [activeTab])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile')
        if (res.ok) {
          const data = await res.json()
          setProfile(data.profile)
          setEditedProfile(data.profile)
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setIsLoadingProfile(false)
      }
    }

    fetchProfile()
  }, [])

  useEffect(() => {
    const loadSavedPitches = async () => {
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
        console.error('Failed to load saved pitches:', error)
      }
    }

    loadSavedPitches()
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
            
            // Extract full pitch details for display
            const pitchDetails = data.pitches.map((p: any) => 
              typeof p.pitchId === 'object' ? p.pitchId : p
            )
            setSavedPitchDetails(pitchDetails)
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
    const isSaved = savedPitches.has(startupId)
    setSavedPitches(prev => {
      const newSet = new Set(prev)
      if (newSet.has(startupId)) {
        newSet.delete(startupId)
      } else {
        newSet.add(startupId)
      }
      return newSet
    })
    try {
      const startup = startups.find(s => s._id === startupId)
      const entrepreneurId = startup?.personalInfo?.userId || startup?._id || startupId
      
      const res = await fetch('/api/saved-pitches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pitchId: startupId,
          entrepreneurId: entrepreneurId,
          action: isSaved ? 'unsave' : 'save'
        })
      })

      if (!res.ok) {
        setSavedPitches(prev => {
          const newSet = new Set(prev)
          if (isSaved) {
            newSet.add(startupId)
          } else {
            newSet.delete(startupId)
          }
          return newSet
        })
      }
    } catch (error) {
      console.error('Failed to save pitch:', error)
      setSavedPitches(prev => {
        const newSet = new Set(prev)
        if (isSaved) {
          newSet.add(startupId)
        } else {
          newSet.delete(startupId)
        }
        return newSet
      })
    }
  }

  const handleApplyFilters = () => {
    let filtered = [...startups]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(startup => 
        startup.pitchData?.startupName?.toLowerCase().includes(query) ||
        startup.pitchData?.oneLiner?.toLowerCase().includes(query) ||
        startup.pitchData?.industry?.toLowerCase().includes(query) ||
        startup.personalInfo?.fullName?.toLowerCase().includes(query)
      )
    }

    // Apply industry filter
    if (selectedIndustry !== "all") {
      filtered = filtered.filter(startup => 
        startup.pitchData?.industry?.toLowerCase() === selectedIndustry.toLowerCase()
      )
    }

    // Apply location filter
    if (selectedLocation.trim()) {
      filtered = filtered.filter(startup => 
        startup.pitchData?.location?.toLowerCase().includes(selectedLocation.toLowerCase())
      )
    }

    // Apply stage filter
    if (selectedStage !== "all") {
      filtered = filtered.filter(startup => 
        startup.pitchData?.stage?.toLowerCase() === selectedStage.toLowerCase()
      )
    }

    // Apply pitch score filter (NEW)
    filtered = filtered.filter(startup => {
      const score = startup.pitchData?.pitchScore
      // Only show pitches that have been scored
      return score && score >= aiScoreRange[0]
    })

    setFilteredStartups(filtered)
    setFiltersApplied(true)
    console.log('Filters applied:', { selectedIndustry, selectedLocation, selectedStage, pitchScore: aiScoreRange[0] })
  }

  // ADD this new function:
  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedIndustry("all")
    setSelectedLocation("")
    setSelectedStage("all")
    setAiScoreRange([1])
    setFiltersApplied(false)
    setFilteredStartups(startups)
  }

  const handlePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingPhoto(true)
    
    try {
      const formData = new FormData()
      formData.append('photo', file)

      const res = await fetch('/api/upload-photo', {
        method: 'POST',
        body: formData
      })

      if (res.ok) {
        const data = await res.json()
        if (data.profile) {
          setProfile(prev => prev ? { ...prev, profilePhoto: data.profile.profilePhoto } : data.profile)
          setEditedProfile(prev => prev ? { ...prev, profilePhoto: data.profile.profilePhoto } : data.profile)
        }
      } else {
        console.error('Failed to upload photo:', await res.text())
        alert('Failed to upload photo')
      }
    } catch (error) {
      console.error('Failed to upload photo:', error)
      alert('Failed to upload photo')
    } finally {
      setIsUploadingPhoto(false)
      e.target.value = ''
    }
  }
  const handlePhotoRemove = async () => {
    setIsUploadingPhoto(true)
    
    try {
      const res = await fetch('/api/remove-photo', {
        method: 'POST',
      })

      if (res.ok) {
        setProfile(prev => prev ? { ...prev, profilePhoto: undefined } : null)
        setEditedProfile(prev => prev ? { ...prev, profilePhoto: undefined } : null)
      } else {
        console.error('Failed to remove photo:', await res.text())
        alert('Failed to remove photo')
      }
    } catch (error) {
      console.error('Failed to remove photo:', error)
      alert('Failed to remove photo')
    } finally {
      setIsUploadingPhoto(false)
    }
  }

  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault()
    if (!editedProfile) return
    
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: editedProfile.firstName,
          lastName: editedProfile.lastName,
          email: editedProfile.email,
          company: editedProfile.company
        })
      })

      if (res.ok) {
        const data = await res.json()
        setProfile(data.profile)
        setEditedProfile(data.profile)
        setUpdateSuccessDialogOpen(true)
      } else {
        alert('Failed to update profile')
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert('Failed to update profile')
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
        // Only refresh conversations in the background, don't wait for it
        fetchConversations()
        fetchUnreadCount()
      } else {
        console.error('Failed to send message')
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsSendingMessage(false)
    }
  }
  const fetchConversations = async () => {
    setIsLoadingConversations(true)
    try {
      const res = await fetch('/api/messages?type=list')
      if (res.ok) {
        const data = await res.json()
        setConversations(data.conversations || [])
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    } finally {
      setIsLoadingConversations(false)
    }
  }
  const fetchConversationMessages = async (conversationId: string) => {
    try {
      const res = await fetch(`/api/messages?type=detail&conversationId=${conversationId}`)
      if (res.ok) {
        const data = await res.json()
        setConversationMessages(data.messages || [])
        
        // Refresh counts in background
        setTimeout(() => {
          fetchUnreadCount()
          fetchConversations()
        }, 100)
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }
  const handleSendMessageInConversation = async () => {
    if (!messageInput.trim() || !selectedConversation) return

    setIsSendingInConversation(true)
    const tempMessage = messageInput
    
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: selectedConversation.otherUser.id,
          pitchId: selectedConversation.pitch.id,
          content: messageInput,
          senderRole: 'investor'
        })
      })

      if (res.ok) {
        const data = await res.json()
        
        // Optimistically add the message to the UI immediately
        setConversationMessages(prev => [...prev, data.message])
        setMessageInput('')
        
        // Refresh in the background without blocking UI
        setTimeout(() => {
          fetchUnreadCount()
          fetchConversations()
        }, 100)
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      // Restore the message on error
      setMessageInput(tempMessage)
    } finally {
      setIsSendingInConversation(false)
    }
  }

  const displayedStartups = showAll ? filteredStartups : filteredStartups.slice(0, 3)

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
              <Input 
                placeholder="Search startups, industries, or founders..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {profile && (
              <span className="text-sm font-medium hidden md:inline-block">
                {profile.firstName} {profile.lastName}
              </span>
            )}
            <Avatar key={profile?.profilePhoto || 'fallback-header'}>
              {profile?.profilePhoto ? (
                <AvatarImage src={profile.profilePhoto} />
              ) : (
                <AvatarFallback className="bg-muted">
                  <User className="h-5 w-5 text-muted-foreground" />
                </AvatarFallback>
              )}
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-muted/30 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
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
                className="w-full justify-start relative"
                onClick={() => setActiveTab("messages")}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Messaging
                {unreadCount > 0 && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full h-5 min-w-[20px] flex items-center justify-center px-1">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Button>
            <Button
              variant={activeTab === "create-meeting" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("create-meeting")}
            >
              <Play className="mr-2 h-4 w-4" />
              Create Meeting
            </Button>
            <Button
              variant={activeTab === "settings" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
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
                        <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Industries" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Industries</SelectItem>
                            <SelectItem value="saas">SaaS</SelectItem>
                            <SelectItem value="fintech">Fintech</SelectItem>
                            <SelectItem value="healthtech">HealthTech</SelectItem>
                            <SelectItem value="climate">Climate Tech</SelectItem>
                            <SelectItem value="edtech">EdTech</SelectItem>
                            <SelectItem value="ecommerce">E-commerce</SelectItem>
                            <SelectItem value="ai/ml">AI/ML</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Location</label>
                        <Input 
                          placeholder="Any location" 
                          value={selectedLocation}
                          onChange={(e) => setSelectedLocation(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Stage</label>
                        <Select value={selectedStage} onValueChange={setSelectedStage}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Stages" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Stages</SelectItem>
                            <SelectItem value="idea">Idea</SelectItem>
                            <SelectItem value="mvp">MVP</SelectItem>
                            <SelectItem value="growth">Growth</SelectItem>
                            <SelectItem value="early">Early Stage</SelectItem>
                            <SelectItem value="series-a">Series A</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Pitch Score: {aiScoreRange[0]}+</label>
                        <Slider
                          value={aiScoreRange}
                          onValueChange={setAiScoreRange}
                          max={10}
                          min={1}
                          step={0.1}
                          className="w-full"
                        />
                      </div>
                      <Button onClick={handleApplyFilters}>
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
                    <p className="text-muted-foreground">
                      Found {filteredStartups.length} startup{filteredStartups.length !== 1 ? 's' : ''}
                      {searchQuery && ` matching "${searchQuery}"`}
                    </p>
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
                  ) : filteredStartups.length === 0 ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <p className="text-muted-foreground">
                          {startups.length === 0 
                            ? "No approved startups available yet."
                            : "No startups match your search criteria. Try adjusting your filters."}
                        </p>
                        {startups.length > 0 && (
                          <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={handleClearFilters}
                          >
                            Clear All Filters
                          </Button>
                        )}
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
                                {startup.pitchData?.pitchScore && (
                                  <div className="flex items-center space-x-2">
                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                    <span className="font-semibold">{startup.pitchData.pitchScore}</span>
                                    <span className="text-xs text-muted-foreground">Pitch Score</span>
                                  </div>
                                )}
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
                     {filteredStartups.length > 3 && (
                      <div className="flex justify-center pt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setShowAll(!showAll)}
                          className="min-w-[200px]"
                        >
                          {showAll ? 'Show Less' : `Show More (${filteredStartups.length - 3} more)`}
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
                  {savedPitchDetails.map((startup) => {
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
                            {startup.pitchData?.pitchScore && (
                              <div className="flex items-center space-x-2">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="font-semibold">{startup.pitchData.pitchScore}</span>
                                <span className="text-xs text-muted-foreground">Pitch Score</span>
                              </div>
                            )}
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
              )}
            </div>
          )}
          {activeTab === "messages" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Messages</h2>
                <p className="text-muted-foreground">Connect with startup founders</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[650px]">
                {/* Conversations List - Left Sidebar */}
                <Card className="md:col-span-1 overflow-hidden flex flex-col">
                  <CardHeader className="pb-4 border-b">
                    <h3 className="font-semibold text-lg">Inbox</h3>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto p-0">
                    {isLoadingConversations ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
                    ) : conversations.length === 0 ? (
                      <div className="p-6 text-center space-y-3">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
                        <div>
                          <h4 className="text-sm font-semibold mb-1">No conversations yet</h4>
                          <p className="text-xs text-muted-foreground">
                            Message a startup founder to get started
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {conversations.map((conv) => (
                          <button
                            key={conv.conversationId}
                            onClick={() => {
                              setSelectedConversation(conv)
                              setConversationMessages([])
                              fetchConversationMessages(conv.conversationId)
                            }}
                            className={`w-full text-left p-4 hover:bg-muted/50 transition-colors border-l-4 ${
                              selectedConversation?.conversationId === conv.conversationId
                                ? 'border-primary bg-muted/30'
                                : 'border-transparent hover:border-muted'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="font-semibold text-sm">
                                    {conv.otherUser.name}
                                  </p>
                                  {conv.otherUser.role === 'entrepreneur' && conv.otherUser.company && (
                                    <p className="text-xs text-muted-foreground">
                                      {conv.otherUser.company}
                                    </p>
                                  )}
                                </div>
                                {conv.unreadCount > 0 && (
                                  <Badge className="h-5 px-2 text-xs">
                                    {conv.unreadCount}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground font-medium">
                                {conv.pitch.name}
                              </p>
                              <p className="text-xs text-muted-foreground truncate line-clamp-2 mt-1">
                                {conv.lastMessage}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Messages Detail Area - Right Side */}
                {selectedConversation ? (
                  <Card className="md:col-span-3 overflow-hidden flex flex-col border-l">
                    {/* Header */}
                    <CardHeader className="pb-4 border-b bg-muted/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-base">
                            {selectedConversation?.otherUser?.name || 'Loading...'}
                          </h3>
                          {selectedConversation?.otherUser?.role === 'entrepreneur' && selectedConversation?.otherUser?.company && (
                            <p className="text-xs text-muted-foreground">
                              {selectedConversation.otherUser.company}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {selectedConversation?.pitch?.name || ''}
                          </p>
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="text-xs">
                            {selectedConversation?.otherUser?.name
                              ?.split(' ')
                              .map((n: string) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </CardHeader>

                    {/* Messages Container */}
                    <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 bg-background">
                      {conversationMessages.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                          <div className="text-center">
                            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                            <p className="text-sm text-muted-foreground">
                              No messages yet. Start the conversation!
                            </p>
                          </div>
                        </div>
                      ) : (
                        conversationMessages.map((msg) => (
                          <div
                            key={msg._id}
                            className={`flex ${
                              msg.senderRole === 'investor'
                                ? 'justify-end'
                                : 'justify-start'
                            }`}
                          >
                            {msg.senderRole === 'investor' ? (
                              // Investor's message (can delete)
                              <div className="flex items-start gap-2 group">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity self-end mb-1"
                                  onClick={async () => {
                                    try {
                                      const res = await fetch(`/api/messages?messageId=${msg._id}`, {
                                        method: 'DELETE'
                                      })
                                      if (res.ok) {
                                        setConversationMessages(prev => prev.filter(m => m._id !== msg._id))
                                      }
                                    } catch (error) {
                                      console.error('Failed to delete message:', error)
                                    }
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                </Button>
                                <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-primary text-primary-foreground rounded-br-none">
                                  <p className="text-sm">{msg.content}</p>
                                  <p className="text-xs mt-1 opacity-70">
                                    {new Date(msg.createdAt).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              // Entrepreneur's message (cannot delete)
                              <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-muted rounded-bl-none">
                                <p className="text-sm">{msg.content}</p>
                                <p className="text-xs mt-1 text-muted-foreground">
                                  {new Date(msg.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </CardContent>

                    {/* Message Input */}
                    <div className="border-t p-4 bg-muted/20 space-y-2">
                      <div className="flex space-x-2">
                        <Textarea
                          placeholder="Say something..."
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault()
                              handleSendMessageInConversation()
                            }
                          }}
                          className="min-h-[44px] max-h-[120px] resize-none"
                        />
                        <Button
                          onClick={handleSendMessageInConversation}
                          disabled={isSendingInConversation || !messageInput.trim()}
                          className="self-end"
                          size="sm"
                        >
                          {isSendingInConversation ? '...' : 'Send'}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Press Shift + Enter for new line
                      </p>
                    </div>
                  </Card>
                ) : (
                  <Card className="md:col-span-3 flex items-center justify-center border-l bg-gradient-to-br from-muted/30 to-muted/10">
                    <CardContent className="text-center">
                      <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-40" />
                      <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                      <p className="text-muted-foreground mb-4 max-w-xs">
                        Choose a conversation from your inbox to start chatting
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
          </div>
          {activeTab === "settings" && (
          <div className="space-y-6 pl-4 md:pl-6">
            <div>
              <h2 className="text-2xl font-bold">Account Settings</h2>
              <p className="text-muted-foreground">Manage your account preferences</p>
            </div>

            {isLoadingProfile ? (
              <div className="text-center py-8">Loading profile...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1">
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle>Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col items-center space-y-3">
                        <Avatar className="h-20 w-20" key={profile?.profilePhoto || 'fallback-settings'}>
                          {profile?.profilePhoto ? (
                            <AvatarImage src={profile.profilePhoto} />
                          ) : (
                            <AvatarFallback className="bg-muted">
                              <User className="h-10 w-10 text-muted-foreground" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <input
                          type="file"
                          id="photoUpload"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoUpload}
                        />
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => document.getElementById('photoUpload')?.click()}
                            disabled={isUploadingPhoto}
                          >
                            {isUploadingPhoto ? 'Uploading...' : 'Change Photo'}
                          </Button>
                          {profile?.profilePhoto && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={handlePhotoRemove}
                              disabled={isUploadingPhoto}
                              className="text-red-600 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4" onSubmit={handleProfileUpdate}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="firstName">First Name</label>
                            <Input 
                              type="text" 
                              id="firstName"
                              value={editedProfile?.firstName || ''}
                              onChange={(e) => setEditedProfile(prev => prev ? ({ ...prev, firstName: e.target.value }) : null)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="lastName">Last Name</label>
                            <Input 
                              type="text" 
                              id="lastName"
                              value={editedProfile?.lastName || ''}
                              onChange={(e) => setEditedProfile(prev => prev ? ({ ...prev, lastName: e.target.value }) : null)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium" htmlFor="email">Email</label>
                          <Input 
                            type="email" 
                            id="email"
                            value={editedProfile?.email || ''}
                            onChange={(e) => setEditedProfile(prev => prev ? ({ ...prev, email: e.target.value }) : null)}
                          />
                        </div>
                        <Button type="submit" className="w-full md:w-auto">Save Changes</Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "create-meeting" && (
          <div className="space-y-6 px-4 md:px-6 py-6">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Create Meeting</h1>
              <p className="text-muted-foreground">
                Generate unique meeting IDs to host video calls with entrepreneurs
              </p>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Host New Meeting Card - Left Side */}
              <Card className="border-2 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all">
                <CardHeader className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Play className="h-5 w-5 text-blue-500" />
                    </div>
                    <CardTitle className="text-xl">Host New Meeting</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Generate a secure meeting ID that entrepreneurs can use to join your video conference.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!meetingId ? (
                    // Generate Meeting ID Button
                    <Button
                      onClick={() => {
                        const uniqueId = `meeting-${Math.random().toString(36).substring(2, 10)}-${Date.now().toString(36)}`;
                        setMeetingId(uniqueId);
                      }}
                      className="w-full h-12 text-base font-semibold relative overflow-hidden
                                 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
                                 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600
                                 shadow-lg hover:shadow-xl
                                 transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      <div className="relative z-10 flex items-center justify-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <line x1="19" x2="19" y1="8" y2="14" />
                          <line x1="22" x2="16" y1="11" y2="11" />
                        </svg>
                        <span>Generate Meeting ID</span>
                      </div>
                    </Button>
                  ) : (
                    // Show Meeting ID and Join Button
                    <div className="space-y-4">
                      {/* Meeting ID Display */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Your Meeting ID</label>
                        <div className="relative group">
                          <Input
                            type="text"
                            readOnly
                            value={meetingId}
                            className="text-center font-mono text-base font-bold pr-20 bg-white/70 dark:bg-gray-800/70 border-2 border-purple-200 dark:border-purple-800 transition-all"
                            id="meetingIdInput"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                            onClick={() => {
                              navigator.clipboard.writeText(meetingId);
                              setIsCopied(true);
                              setTimeout(() => setIsCopied(false), 2000);
                            }}
                          >
                            {isCopied ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-green-600 dark:text-green-400"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                              </svg>
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                          Share this ID with entrepreneurs to invite them
                        </p>
                      </div>

                      {/* Join Meeting Button */}
                      <Button
                        onClick={() => {
                          window.open('https://investo-streaming.vercel.app/', '_blank');
                        }}
                        className="w-full h-12 text-base font-semibold relative overflow-hidden
                                   bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
                                   hover:from-blue-600 hover:via-purple-600 hover:to-pink-600
                                   shadow-lg hover:shadow-xl
                                   transition-all duration-300 transform hover:scale-[1.02]
                                   before:absolute before:inset-0 
                                   before:bg-gradient-to-r before:from-white/0 before:via-white/20 before:to-white/0
                                   before:translate-x-[-200%] hover:before:translate-x-[200%]
                                   before:transition-transform before:duration-700"
                      >
                        <div className="relative z-10 flex items-center justify-center gap-2">
                          <Play className="h-5 w-5" />
                          <span>Join Meeting</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="group-hover:translate-x-1 transition-transform"
                          >
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                          </svg>
                        </div>
                      </Button>

                      {/* Generate New ID Button */}
                      <Button
                        variant="outline"
                        onClick={() => {
                          const uniqueId = `meeting-${Math.random().toString(36).substring(2, 10)}-${Date.now().toString(36)}`;
                          setMeetingId(uniqueId);
                        }}
                        className="w-full text-sm"
                      >
                        Generate New ID
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* How It Works Card - Right Side */}
              <Card className="border-2 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all">
                <CardHeader className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-purple-500"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <CardTitle className="text-xl">How It Works</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white text-sm font-bold">
                      1
                    </div>
                    <div className="space-y-1 flex-1">
                      <p className="font-semibold text-sm">Generate Meeting ID</p>
                      <p className="text-xs text-muted-foreground">
                        Click "Generate Meeting ID" to create a unique room
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500 text-white text-sm font-bold">
                      2
                    </div>
                    <div className="space-y-1 flex-1">
                      <p className="font-semibold text-sm">Share with Entrepreneurs</p>
                      <p className="text-xs text-muted-foreground">
                        Copy and send the Meeting ID to entrepreneurs
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500 text-white text-sm font-bold">
                      3
                    </div>
                    <div className="space-y-1 flex-1">
                      <p className="font-semibold text-sm">Start Video Meeting</p>
                      <p className="text-xs text-muted-foreground">
                        Click "Start Meeting Room" to enter the call
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex gap-2">
                    <span className="text-sm">💡</span>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold">Tip:</span> Entrepreneurs can join from their dashboard&apos;s &quot;Join Meeting&quot; feature using your Meeting ID
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* How it works - Full Width Bottom Section */}
            <Card className="border-2 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">How it works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* For Hosting Meetings */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">For Hosting Meetings:</h3>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold">
                          1
                        </div>
                        <p className="text-sm text-muted-foreground pt-1">
                          Click &quot;Generate Meeting ID&quot; to create a unique meeting room
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold">
                          2
                        </div>
                        <p className="text-sm text-muted-foreground pt-1">
                          Share the Meeting ID with entrepreneurs via email or messaging
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold">
                          3
                        </div>
                        <p className="text-sm text-muted-foreground pt-1">
                          Click &quot;Join Meeting&quot; to enter the video conference room
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Best Practices for Investors */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Best Practices:</h3>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-500 text-white text-xs font-bold">
                          💡
                        </div>
                        <p className="text-sm text-muted-foreground pt-1">
                          Send the Meeting ID to entrepreneurs at least 15 minutes before
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-500 text-white text-xs font-bold">
                          💡
                        </div>
                        <p className="text-sm text-muted-foreground pt-1">
                          Review the entrepreneur&apos;s pitch materials beforehand
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-500 text-white text-xs font-bold">
                          💡
                        </div>
                        <p className="text-sm text-muted-foreground pt-1">
                          Prepare questions and talking points for a productive meeting
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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
    <Dialog open={updateSuccessDialogOpen} onOpenChange={setUpdateSuccessDialogOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="items-center text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <DialogTitle className="text-2xl font-bold">Profile Updated!</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Your changes have been saved successfully.
          </DialogDescription>
        </DialogHeader>
        <div className="pt-4 flex justify-center">
          <Button onClick={() => setUpdateSuccessDialogOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </div>
  )
}