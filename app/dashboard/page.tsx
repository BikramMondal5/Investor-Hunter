"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
} from "lucide-react"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [videoModalOpen, setVideoModalOpen] = useState(false)

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "pitch", label: "My Pitch", icon: Play },
    { id: "analytics", label: "Feedback & Analytics", icon: TrendingUp },
    { id: "messages", label: "Investor Messages", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ]

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
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src="https://entrepreneurstoday.in/wp-content/uploads/2021/10/entrepreneurship-what-is-the-modern-definition-of-entrepreneur-min.jpeg" />
              <AvatarFallback>JD</AvatarFallback>
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
                className="w-full justify-start"
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
            <div className="pt-6 mt-4 border-t">
              <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10">
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
                        <p className="text-sm text-muted-foreground">Pitch Views</p>
                        <h3 className="text-2xl font-bold mt-1">47</h3>
                      </div>
                      <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Eye className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center text-xs text-green-600">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        <span>+12% from last week</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Investor Interest</p>
                        <h3 className="text-2xl font-bold mt-1">8</h3>
                      </div>
                      <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-green-600 dark:text-green-500" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center text-xs text-green-600">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        <span>+3 this week</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Messages</p>
                        <h3 className="text-2xl font-bold mt-1">5</h3>
                      </div>
                      <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                        <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center text-xs text-amber-600">
                        <span>2 unread messages</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Pitch Score Card */}
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle>Pitch Performance Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Overall Score</span>
                        <span className="text-sm font-medium">8.7/10</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Clarity</span>
                          <span className="text-sm font-medium">8.9/10</span>
                        </div>
                        <Progress value={89} className="h-1.5" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Uniqueness</span>
                          <span className="text-sm font-medium">9.1/10</span>
                        </div>
                        <Progress value={91} className="h-1.5" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Market Fit</span>
                          <span className="text-sm font-medium">8.5/10</span>
                        </div>
                        <Progress value={85} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Activity */}
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        type: "view",
                        entity: "Sequoia Capital",
                        time: "2 hours ago",
                        message: "viewed your pitch",
                        icon: Eye,
                      },
                      {
                        type: "message",
                        entity: "Accel Partners",
                        time: "5 hours ago",
                        message: "sent you a message",
                        icon: MessageCircle,
                      },
                      {
                        type: "feedback",
                        entity: "Community Member",
                        time: "1 day ago",
                        message: "left feedback on your pitch",
                        icon: ThumbsUp,
                      },
                      {
                        type: "view",
                        entity: "Andreessen Horowitz",
                        time: "2 days ago",
                        message: "viewed your pitch",
                        icon: Eye,
                      },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 py-2">
                        <div className={`mt-0.5 rounded-full p-1.5 ${
                          activity.type === "view" ? "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-500" :
                          activity.type === "message" ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-500" :
                          "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-500"
                        }`}>
                          <activity.icon className="h-4 w-4" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {activity.entity} {activity.message}
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

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
                <Button variant="outline" className="flex flex-col h-24 items-center justify-center space-y-2 bg-green-50 hover:bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:text-green-500 dark:border-green-900/30">
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
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Your Submitted Pitch</h1>
                <p className="text-muted-foreground">Track your pitch performance and investor interest</p>
              </div>

              {/* Pitch Overview Card */}
              <Card className="shadow-sm">
                <CardHeader className="pb-1 pt-3 px-4">
                  <CardTitle>Articuno.AI - Your personalized Weather Intelligence</CardTitle>
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
                        <img
                          src="/video-pitch-image.png"
                          alt="Pitch video thumbnail"
                          className="absolute inset-0 w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <p className="text-xs text-center mt-1 text-muted-foreground">Click to watch your pitch video</p>
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
                </CardContent>
              </Card>

              {/* Community Feedback */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5" />
                    <span>Community Feedback</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      user: "Sarah M.",
                      avatar: "SM",
                      comment: "Great idea! The market timing seems perfect for this solution.",
                      type: "positive",
                      likes: 12,
                    },
                    {
                      user: "Alex K.",
                      avatar: "AK",
                      comment: "Consider expanding on your go-to-market strategy in future pitches.",
                      type: "suggestion",
                      likes: 8,
                    },
                    {
                      user: "Maria L.",
                      avatar: "ML",
                      comment: "The demo was very compelling. Would love to see more technical details.",
                      type: "positive",
                      likes: 15,
                    },
                  ].map((feedback, index) => (
                    <div key={index} className="flex space-x-3 p-4 rounded-lg bg-muted/30">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{feedback.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{feedback.user}</span>
                          <Badge variant={feedback.type === "positive" ? "default" : "secondary"} className="text-xs">
                            {feedback.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{feedback.comment}</p>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" className="h-6 px-2">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            {feedback.likes}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Investor Views */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="h-5 w-5" />
                    <span>Investor Interest</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="text-center p-6 bg-muted/30 rounded-lg">
                      <div className="text-3xl font-bold text-primary">47</div>
                      <p className="text-sm text-muted-foreground">Total Views</p>
                    </div>
                    <div className="text-center p-6 bg-muted/30 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">8</div>
                      <p className="text-sm text-muted-foreground">Interested Investors</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <h4 className="font-semibold">Recent Investor Activity</h4>
                    {[
                      { name: "Sequoia Capital", interest: "High", status: "Pending" },
                      { name: "Andreessen Horowitz", interest: "Moderate", status: "Viewed" },
                      { name: "Accel Partners", interest: "High", status: "Message Sent" },
                    ].map((investor, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{investor.name}</p>
                          <p className="text-sm text-muted-foreground">Interest: {investor.interest}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={investor.status === "Message Sent" ? "default" : "secondary"}>
                            {investor.status}
                          </Badge>
                          {investor.status === "Message Sent" && <Button size="sm">Reply</Button>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Call to Action */}
              <div className="flex space-x-4">
                <Button variant="outline" className="flex-1 bg-transparent">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Improve Pitch
                </Button>
                <Button className="flex-1">
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
            <div className="space-y-4 max-w-5xl mx-auto">
              <div className="mb-3 mt-0">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Investor Messages</h1>
                <p className="text-muted-foreground">Communicate with interested investors</p>
              </div>

              {/* Messages List */}
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle>Inbox (5)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      {
                        investor: "Sequoia Capital",
                        avatar: "SC",
                        message: "We'd like to schedule a call to discuss your pitch in more detail.",
                        time: "2 hours ago",
                        unread: true,
                      },
                      {
                        investor: "Accel Partners",
                        avatar: "AP",
                        message: "Your AI-powered solution seems interesting. Can you share more information about your tech stack?",
                        time: "5 hours ago",
                        unread: true,
                      },
                      {
                        investor: "Andreessen Horowitz",
                        avatar: "AH",
                        message: "We're interested in learning more about your customer acquisition strategy and current traction.",
                        time: "Yesterday",
                        unread: false,
                      },
                      {
                        investor: "Y Combinator",
                        avatar: "YC",
                        message: "Thanks for your detailed response. Let's set up a meeting next week.",
                        time: "2 days ago",
                        unread: false,
                      },
                      {
                        investor: "Kleiner Perkins",
                        avatar: "KP",
                        message: "Your approach to solving this problem is unique. We'd like to discuss potential market sizes.",
                        time: "3 days ago",
                        unread: false,
                      },
                    ].map((message, index) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-lg flex items-start space-x-3 cursor-pointer transition-colors ${
                          message.unread 
                            ? "bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20" 
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <Avatar className="h-10 w-10 mt-0.5">
                          <AvatarFallback className="text-xs">{message.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-medium text-sm ${message.unread ? "text-blue-700 dark:text-blue-400" : ""}`}>
                              {message.investor}
                              {message.unread && <span className="ml-2 h-2 w-2 bg-blue-600 rounded-full inline-block"></span>}
                            </h4>
                            <span className="text-xs text-muted-foreground">{message.time}</span>
                          </div>
                          <p className={`text-sm mt-1 ${message.unread ? "font-medium" : "text-muted-foreground"}`}>
                            {message.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-4 max-w-5xl mx-auto">
              <div className="mb-3 mt-0">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Account Settings</h1>
                <p className="text-muted-foreground">Manage your account preferences</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1">
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle>Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col items-center space-y-3">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src="https://avatars.githubusercontent.com/u/170235967?v=4" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm">Change Photo</Button>
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
                      <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="firstName">First Name</label>
                            <input 
                              type="text" 
                              id="firstName" 
                              className="w-full p-2 rounded-md border" 
                              defaultValue="Bikram"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="lastName">Last Name</label>
                            <input 
                              type="text" 
                              id="lastName" 
                              className="w-full p-2 rounded-md border" 
                              defaultValue="Mondal"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium" htmlFor="email">Email</label>
                          <input 
                            type="email" 
                            id="email" 
                            className="w-full p-2 rounded-md border" 
                            defaultValue="codesnippets45@gmail.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium" htmlFor="company">Company</label>
                          <input 
                            type="text" 
                            id="company" 
                            className="w-full p-2 rounded-md border" 
                            defaultValue="Articuno.AI."
                          />
                        </div>
                        <Button className="w-full md:w-auto">Save Changes</Button>
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
                            <Switch defaultChecked />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Message Notifications</p>
                            <p className="text-sm text-muted-foreground">Get notified when you receive a message</p>
                          </div>
                          <div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Community Feedback Alerts</p>
                            <p className="text-sm text-muted-foreground">Get notified when someone leaves feedback</p>
                          </div>
                          <div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Video Modal */}
      <Dialog open={videoModalOpen} onOpenChange={setVideoModalOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="text-xl">Articuno.AI - Pitch Video</DialogTitle>
          </DialogHeader>
          <div className="relative pb-[56.25%] mt-2">
            <video 
              src="/articuno.mp4" 
              className="absolute inset-0 w-full h-full object-cover"
              controls
              autoPlay
              playsInline
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="p-4 flex justify-end">
            <Button onClick={() => setVideoModalOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
