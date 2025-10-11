"use client"
import React from "react";
import { useState, ChangeEvent, FormEvent, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"
import { useAppSession } from "@/hooks/use-app-session"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription, // Import DialogDescription
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Bell,
  BarChart3,
  MessageSquare,
  Settings,
  LogOut,
  Play,
  Eye,
  ThumbsUp,
  MessageCircle,
  TrendingUp,
  Users,
  User,
  CheckCircle, // Import CheckCircle
} from "lucide-react"

interface Profile {
  firstName: string;
  lastName: string;
  email: string;

  profilePhoto?: string;
  notifications: {
    investorInterest: boolean;
    messages: boolean;
    communityFeedback: boolean;
  };
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  link?: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    pitchesSubmitted: 0,
    pitchesApproved: 0,
    unreadMessages: 0
  })
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [conversations, setConversations] = useState<any[]>([])
  const [isLoadingConversations, setIsLoadingConversations] = useState(false)
  const [selectedConversation, setSelectedConversation] = useState<any | null>(null)
  const [conversationMessages, setConversationMessages] = useState<any[]>([])
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [messageInput, setMessageInput] = useState('')
  const [isSendingInConversation, setIsSendingInConversation] = useState(false)
  const [approvedPitches, setApprovedPitches] = useState<any[]>([])
  const [isLoadingPitches, setIsLoadingPitches] = useState(true)
  const [hasPitches, setHasPitches] = useState(false)
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [feedbackLikes, setFeedbackLikes] = useState<{ [key: number]: number }>({})
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState("")
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const [updateSuccessDialogOpen, setUpdateSuccessDialogOpen] = useState(false) // State for success dialog
  const [communityFeedback, setCommunityFeedback] = useState([
    {
      id: 1,
      user: "Sarah M.",
      avatar: "SM",
      comment: "Great idea! The market timing seems perfect for this solution.",
      type: "positive",
      likes: 12,
      replies: [],
    },
    {
      id: 2,
      user: "Alex K.",
      avatar: "AK",
      comment: "Consider expanding on your go-to-market strategy in future pitches.",
      type: "suggestion",
      likes: 8,
      replies: [],
    },
    {
      id: 3,
      user: "Maria L.",
      avatar: "ML",
      comment: "The demo was very compelling. Would love to see more technical details.",
      type: "positive",
      likes: 15,
      replies: [],
    },
  ])
  const { session, isLoading: isSessionLoading } = useAppSession()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const sidebarItems: SidebarItem[] = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "pitch", label: "My Pitch", icon: Play },
    { id: "analytics", label: "Feedback & Analytics", icon: TrendingUp },
    { id: "messages", label: "Investor Messages", icon: MessageSquare },
    { id: "interview", label: "Internal Interview", icon: MessageCircle, link: "/internal-interview" },
    { id: "investor-meeting", label: "Investor Meeting", icon: Users, link: "/investor-meeting" },
    { id: "settings", label: "Settings", icon: Settings },
  ]
  const [editedProfile, setEditedProfile] = useState<Profile | null>(null)

  useEffect(() => {
    if (activeTab === 'messages') {
      fetchConversations()
    }
  }, [activeTab])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/dashboard-stats')
        if (res.ok) {
          const data = await res.json()
          setStats({
            pitchesSubmitted: data.pitchesSubmitted || 0,
            pitchesApproved: data.pitchesApproved || 0,
            unreadMessages: data.unreadMessages || 0
          })
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setIsLoadingStats(false)
      }
    }

    if (session?.user) {
      fetchStats()
    }
  }, [session])

  useEffect(() => {
    if (session?.user) {
      fetchUnreadCount()
      // Poll every 30 seconds for new messages
      const interval = setInterval(fetchUnreadCount, 30000)
      return () => clearInterval(interval)
    }
  }, [session])

  useEffect(() => {
    const fetchApprovedPitches = async () => {
      try {
        const res = await fetch('/api/my-pitches')
        if (res.ok) {
          const data = await res.json()
          setApprovedPitches(data.pitches || [])
          setHasPitches(data.pitches && data.pitches.length > 0)
        }
      } catch (error) {
        console.error('Failed to fetch pitches:', error)
      } finally {
        setIsLoadingPitches(false)
      }
    }

    if (session?.user) {
      fetchApprovedPitches()
    }
  }, [session])

  // Update the useEffect where you fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile')
        if (res.ok) {
          const data = await res.json()
          setProfile(data.profile)
          setEditedProfile(data.profile) // Initialize edited profile
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setIsLoadingProfile(false)
      }
    }

    if (session?.user) {
      fetchProfile()
    } else if (!isSessionLoading) {
      router.push('/');
    }
  }, [session, isSessionLoading, router])

  // Add function to handle photo upload
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
        const data = await res.json()
        // Set profilePhoto to null/undefined instead of keeping the old value
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
  // Add this helper function:
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
          senderRole: 'entrepreneur'
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

  // Add function to handle profile updates
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
        })
      })

      if (res.ok) {
        const data = await res.json()
        setProfile(data.profile) // Update the actual profile only on save
        setEditedProfile(data.profile)
        setUpdateSuccessDialogOpen(true) // Open the success dialog
      } else {
        // You might want to handle errors with a toast or another dialog
        alert('Failed to update profile')
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert('Failed to update profile')
    }
  }
  // Add function to handle notification settings
  const handleNotificationChange = async (key: keyof Profile['notifications'], value: boolean) => {
    if (!profile) return
    try {
      const updatedNotifications = {
        ...profile.notifications,
        [key]: value
      }

      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,
          notifications: updatedNotifications
        })
      })

      if (res.ok) {
        setProfile(prev => ({
          ...prev,
          notifications: updatedNotifications
        }))
      }
    } catch (error) {
      console.error('Failed to update notifications:', error)
    }
  }

  if (isSessionLoading || isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              InvestorHunt
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {profile && (
              <span className="text-sm font-medium hidden md:inline-block">
                {profile.firstName} {profile.lastName}
              </span>
            )}
            <Avatar key={profile?.profilePhoto || 'fallback-header'}>
              {profile?.profilePhoto ? (
                <AvatarImage 
                  src={profile.profilePhoto} 
                />
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
        <aside className="w-64 border-r bg-muted/30 min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
              {sidebarItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className="w-full justify-start relative"
                  onClick={() => {
                    if (item.link) {
                      router.push(item.link);
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                  {item.id === "messages" && unreadCount > 0 && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full h-5 min-w-[20px] flex items-center justify-center px-1">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Button>
              ))}
            
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
        <main className="flex-1 p-2 md:p-4 lg:p-6 overflow-y-auto pt-0 md:pt-1">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-4 max-w-5xl mx-auto">
              <div className="mb-3 mt-0">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Founder Dashboard</h1>
                <p className="text-muted-foreground">Your startup journey at a glance</p>
              </div>

              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Pitches Submitted</p>
                        <h3 className="text-2xl font-bold mt-1">{stats.pitchesSubmitted}</h3>
                      </div>
                      <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Play className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center text-xs text-green-600">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        <span>Total submissions</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Pitches Approved</p>
                        <h3 className="text-2xl font-bold mt-1">{stats.pitchesApproved}</h3>
                      </div>
                      <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center text-xs text-green-600">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        <span>Approved by platform</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Unread Messages</p>
                        <h3 className="text-2xl font-bold mt-1">{stats.unreadMessages}</h3>
                      </div>
                      <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                        <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center text-xs text-amber-600">
                        <span>From investors</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Button onClick={() => setActiveTab("pitch")} className="flex flex-col h-24 items-center justify-center space-y-2">
                  <Play className="h-5 w-5" />
                  <span>View Pitch</span>
                </Button>
                <Button onClick={() => setActiveTab("analytics")} variant="outline" className="flex flex-col h-24 items-center justify-center space-y-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>View Analytics</span>
                </Button>
                <Button onClick={() => setActiveTab("messages")} variant="outline" className="flex flex-col h-24 items-center justify-center space-y-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Messages</span>
                </Button>
                <Button 
                  onClick={() => router.push('/submit')} 
                  variant="outline" 
                  className="flex flex-col h-24 items-center justify-center space-y-2 bg-green-50 hover:bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:text-green-500 dark:border-green-900/30"
                >
                  <Users className="h-5 w-5" />
                  <span>Submit New Idea</span>
                </Button>
              </div>
            </div>
          )}

          {/* Pitch Tab */}
          {activeTab === "pitch" && (
            <div className="space-y-4 max-w-5xl mx-auto">
              <div className="mb-3 mt-0">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Your Submitted Pitch
                </h1>
                <p className="text-muted-foreground">
                  Track your pitch performance and investor interest
                </p>
              </div>

              {isLoadingPitches ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading your pitches...</p>
                </div>
              ) : !hasPitches ? (
                <Card>
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="text-muted-foreground">
                      <p className="text-lg font-medium mb-2">No Approved Pitches Yet</p>
                      <p className="text-sm">
                        Your pitch is either pending approval or you haven't submitted one yet.
                      </p>
                    </div>
                    <Button onClick={() => router.push("/submit")} size="lg">
                      <Users className="mr-2 h-4 w-4" />
                      Submit Your Pitch
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                approvedPitches.map((pitch) => (
                  <React.Fragment key={pitch._id}>
                    {/* Pitch Overview Card */}
                    <Card className="shadow-sm">
                      <CardHeader className="pb-1 pt-3 px-4">
                        <CardTitle>
                          {pitch.pitchData?.startupName || "Your Startup"} -{" "}
                          {pitch.pitchData?.oneLiner || ""}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="space-y-3 pt-1 px-4 pb-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <div
                              className="aspect-[16/9] bg-muted rounded-lg flex items-center justify-center relative group cursor-pointer overflow-hidden"
                              onClick={() => setVideoModalOpen(true)}
                            >
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                                <div className="h-16 w-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <Play className="h-8 w-8 text-white ml-1" />
                                </div>
                              </div>

                              {pitch.pitchData?.videoUrl ? (
                                <video
                                  src={pitch.pitchData.videoUrl}
                                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                  <Play className="h-16 w-16 text-white opacity-50" />
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-center mt-1 text-muted-foreground">
                              Click to watch your pitch video
                            </p>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <h3 className="font-semibold">AI Evaluation Summary</h3>
                              <div className="space-y-2 mt-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Clarity</span>
                                  <div className="flex items-center space-x-2">
                                    <Progress value={89} className="w-20" />
                                    <span className="text-sm font-medium">8.9/10</span>
                                  </div>
                                </div>

                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Uniqueness</span>
                                  <div className="flex items-center space-x-2">
                                    <Progress value={91} className="w-20" />
                                    <span className="text-sm font-medium">9.1/10</span>
                                  </div>
                                </div>

                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Market Fit</span>
                                  <div className="flex items-center space-x-2">
                                    <Progress value={85} className="w-20" />
                                    <span className="text-sm font-medium">8.5/10</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <Button className="w-full">View Full Report</Button>
                          </div>
                        </div>

                        {/* Pitch Details */}
                        <div className="border-t pt-3 mt-3 grid md:grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-muted-foreground">Industry</p>
                            <p className="text-sm font-medium">
                              {pitch.pitchData?.industry || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Stage</p>
                            <p className="text-sm font-medium capitalize">
                              {pitch.pitchData?.stage || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Location</p>
                            <p className="text-sm font-medium">
                              {pitch.pitchData?.location || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Status</p>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              Approved
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </React.Fragment>
                ))
              )}

              {/* Call to Action */}
              <div className="flex space-x-4">
                <Button variant="outline" className="flex-1 bg-transparent">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Improve Pitch
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => router.push('/submit')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Submit New Idea
                </Button>
              </div>
            </div>
          )}
          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="space-y-4 max-w-5xl mx-auto">
              <div className="mb-3 mt-0">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Feedback & Analytics</h1>
                <p className="text-muted-foreground">Detailed insights on your pitch performance</p>
              </div>

              {/* Analytics Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Pitch Views Over Time</CardTitle>
                  </CardHeader>
                  <CardContent className="h-64 relative">
                    <img 
                      src="/pitch_views_over_time.png" 
                      alt="Line graph showing pitch views over time increasing from 120 to over 550 views" 
                      className="w-full h-full object-contain"
                    />
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Investor Demographics</CardTitle>
                  </CardHeader>
                  <CardContent className="h-64 relative">
                    <img 
                      src="/investor_demographics.png" 
                      alt="Bar chart showing investor demographics: VC Firms 35%, Angel Investors 25%, Corporate Investors 20%, Accelerators 10%, Crowdfunders 10%" 
                      className="w-full h-full object-contain"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Feedback Analysis */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>AI-Generated Feedback Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/30">
                    <h4 className="font-semibold mb-2">Key Strengths</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li className="text-sm">Clear value proposition for target market</li>
                      <li className="text-sm">Strong technical demonstration with practical use cases</li>
                      <li className="text-sm">Well-articulated competitive advantage</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/30">
                    <h4 className="font-semibold mb-2">Areas for Improvement</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li className="text-sm">Consider elaborating more on go-to-market strategy</li>
                      <li className="text-sm">Add more specific details about revenue projections</li>
                      <li className="text-sm">Provide clearer explanation of technical scalability</li>
                    </ul>
                  </div>

                  <Button className="w-full md:w-auto">
                    Generate Detailed Report
                  </Button>
                </CardContent>
              </Card>

              {/* Sentiment Analysis */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Community Feedback Sentiment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">Positive Sentiment</span>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-500">76%</Badge>
                        </div>
                        <Progress value={76} className="h-2 bg-muted [&>div]:bg-green-600" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">Neutral Sentiment</span>
                          <Badge variant="outline">18%</Badge>
                        </div>
                        <Progress value={18} className="h-2 bg-muted [&>div]:bg-gray-400" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">Areas for Improvement</span>
                          <Badge variant="destructive">6%</Badge>
                        </div>
                        <Progress value={6} className="h-2 bg-muted [&>div]:bg-red-500" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === "messages" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Messages</h2>
                <p className="text-muted-foreground">Connect with interested investors</p>
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
                            Wait for investors to reach out
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
                                  <div className="flex items-center gap-2">
                                    <p className="font-semibold text-sm">
                                      {conv.otherUser.name}
                                    </p>
                                    {conv.unreadCount > 0 && (
                                      <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                                    )}
                                  </div>
                                  {/* Don't show company for investors - they are individuals */}
                                  {conv.otherUser.role === 'investor' && (
                                    <p className="text-xs text-muted-foreground">
                                      Investor
                                    </p>
                                  )}
                                </div>
                                {conv.unreadCount > 0 && (
                                  <Badge className="h-5 px-2 text-xs">
                                    {conv.unreadCount}
                                  </Badge>
                                )}
                              </div>
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
                            {selectedConversation.otherUser.name}
                          </h3>
                          {/* Show "Investor" label instead of company */}
                          {selectedConversation.otherUser.role === 'investor' && (
                            <p className="text-xs text-muted-foreground">
                              Investor
                            </p>
                          )}
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="text-xs">
                            {selectedConversation.otherUser.name
                              ?.split(' ')
                              .map((n: string) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </CardHeader>

                    {/* Messages Container */}
                    <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 bg-background">
                      {isLoadingMessages ? (
                        <div className="text-center text-sm text-muted-foreground">
                          Loading messages...
                        </div>
                      ) : conversationMessages.length === 0 ? (
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
                              msg.senderRole === 'entrepreneur'
                                ? 'justify-end'
                                : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                                msg.senderRole === 'entrepreneur'
                                  ? 'bg-primary text-primary-foreground rounded-br-none'
                                  : 'bg-muted rounded-bl-none'
                              }`}
                            >
                              <p className="text-sm">{msg.content}</p>
                              <p className={`text-xs mt-1 ${
                                msg.senderRole === 'entrepreneur'
                                  ? 'opacity-70'
                                  : 'text-muted-foreground'
                              }`}>
                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </CardContent>

                    {/* Message Input */}
                    <div className="border-t p-4 bg-muted/20 space-y-2">
                      <div className="flex space-x-2">
                        <Textarea
                          placeholder="Type your reply..."
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

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-4 max-w-5xl mx-auto">
              <div className="mb-3 mt-0">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Account Settings</h1>
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
                                <AvatarImage 
                                  src={profile.profilePhoto}
                                />
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
                              <input 
                                type="text" 
                                id="firstName" 
                                className="w-full p-2 rounded-md border" 
                                value={editedProfile?.firstName || ''}
                                onChange={(e) => setEditedProfile(prev => prev ? ({ ...prev, firstName: e.target.value }) : null)}
                              />

                              <input 
                                type="text" 
                                id="lastName" 
                                className="w-full p-2 rounded-md border" 
                                value={editedProfile?.lastName || ''}
                                onChange={(e) => setEditedProfile(prev => prev ? ({ ...prev, lastName: e.target.value }) : null)}
                              />

                              <input 
                                type="email" 
                                id="email" 
                                className="w-full p-2 rounded-md border" 
                                value={editedProfile?.email || ''}
                                onChange={(e) => setEditedProfile(prev => prev ? ({ ...prev, email: e.target.value }) : null)}
                              />
                            </div>
                          </div>
                          <Button type="submit" className="w-full md:w-auto">Save Changes</Button>
                        </form>
                      </CardContent>
                    </Card>
                    
                    <Card className="shadow-sm mt-4">
                      <CardHeader>
                        <CardTitle>Notification Settings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Investor Interest Alerts</p>
                              <p className="text-sm text-muted-foreground">Get notified when investors view your pitch</p>
                            </div>
                            <div>
                              <Switch 
                                checked={profile?.notifications?.investorInterest ?? false}
                                onCheckedChange={(checked) => handleNotificationChange('investorInterest', checked)}
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Message Notifications</p>
                              <p className="text-sm text-muted-foreground">Get notified when you receive a message</p>
                            </div>
                            <div>
                              <Switch 
                                checked={profile?.notifications?.messages ?? false}
                                onCheckedChange={(checked) => handleNotificationChange('messages', checked)}
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Community Feedback Alerts</p>
                              <p className="text-sm text-muted-foreground">Get notified when someone leaves feedback</p>
                            </div>
                            <div>
                              <Switch 
                                checked={profile?.notifications?.communityFeedback ?? false}
                                onCheckedChange={(checked) => handleNotificationChange('communityFeedback', checked)}
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          )}
           
        </main>
      </div>

      {/* Video Modal */}
      <Dialog open={videoModalOpen} onOpenChange={setVideoModalOpen}>
        <DialogContent className="max-w-[85vw] md:max-w-[75vw] lg:max-w-[70vw] p-0 overflow-hidden border-2 shadow-xl">
          <DialogHeader className="p-3 pb-0">
            <DialogTitle className="text-base">
              {approvedPitches[0]?.pitchData?.startupName || "Pitch Video"} - by {profile?.firstName} {profile?.lastName}
            </DialogTitle>
          </DialogHeader>
          <div className="relative pb-[42.25%] mt-1">
            <video 
              src={approvedPitches[0]?.pitchData?.videoUrl || "/articuno.mp4"} 
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
                  // Call logout API with cache control
                  await fetch('/api/logout', { 
                    method: 'POST',
                    headers: {
                      'Cache-Control': 'no-cache, no-store, must-revalidate',
                      'Pragma': 'no-cache',
                      'Expires': '0'
                    }
                  });
                  
                  // Clear any client-side storage
                  if (typeof window !== 'undefined') {
                    sessionStorage.clear();
                    localStorage.clear();
                  }
                  
                  // Force a hard redirect with cache busting
                  window.location.href = '/?t=' + Date.now();
                } catch (error) {
                  console.error('Logout error:', error);
                  // Force redirect anyway with cache busting
                  window.location.href = '/?t=' + Date.now();
                }
              }}
            >
              Logout
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Profile Update Success Dialog */}
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