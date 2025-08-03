"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
          {activeTab === "pitch" && (
            <div className="space-y-4 max-w-5xl mx-auto">
              <div className="mb-3 mt-0">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Your Submitted Pitch</h1>
                <p className="text-muted-foreground">Track your pitch performance and investor interest</p>
              </div>

              {/* Pitch Overview Card */}
              <Card className="shadow-sm">
                <CardHeader className="pb-1 pt-3 px-4">
                  <CardTitle>TechFlow - AI-Powered Workflow Automation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-1 px-4 pb-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="aspect-[16/8] bg-muted rounded-lg flex items-center justify-center relative group cursor-pointer">
                        <Play className="h-10 w-10 text-primary group-hover:scale-110 transition-transform" />
                        <img
                          src="/placeholder.svg?height=150&width=360&text=Video+Thumbnail"
                          alt="Pitch video thumbnail"
                          className="absolute inset-0 w-full h-full object-cover rounded-lg opacity-50"
                        />
                      </div>
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
        </main>
      </div>
    </div>
  )
}
