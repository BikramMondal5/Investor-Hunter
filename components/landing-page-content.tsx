"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Play, Upload, Brain, MessageSquare, Star, ArrowRight, Globe, Zap, Shield } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export function LandingPageContent() {
  // Use useState and useEffect to ensure client-side rendering
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null // Return null on server-side rendering
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 md:pb-16">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          <div className="space-y-5 pl-2">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Reimagining Startup{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Funding
                </span>{" "}
                for Everyone
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Break the barriers of pitch decks, costly VC intros, and language limitations. Submit your idea with a
                simple video.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/submit" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">
                  Submit Your Pitch
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                <Play className="mr-2 h-4 w-4" />
                Explore Funded Ideas
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[16/9] bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl flex items-center justify-center shadow-lg">
              <img
                src="/placeholder.svg?h=380&w=690&text=Video"
                alt="Video player mockup"
                className="rounded-lg shadow-lg w-full max-h-[400px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Investors Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 border-t">
        <div className="text-center space-y-6 md:space-y-8">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Trusted by Investors Worldwide
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center opacity-60">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-12 bg-muted rounded flex items-center justify-center">
                <img
                  src={`/placeholder.svg?h=48&w=120&text=VC${i}`}
                  alt={`VC Logo ${i}`}
                  className="h-8 opacity-70"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="text-center space-y-4 mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">How it Works</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to get your startup in front of investors
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              icon: Upload,
              title: "Upload a short video pitch",
              description: "Record a 2-minute video explaining your startup idea. No pitch deck required.",
            },
            {
              step: "02",
              icon: Brain,
              title: "AI analyzes your idea, community gives feedback",
              description: "Our AI evaluates your pitch while the community provides valuable insights.",
            },
            {
              step: "03",
              icon: MessageSquare,
              title: "Investors reach out if they're interested",
              description: "Connect directly with investors who are genuinely interested in your startup.",
            },
          ].map((item, index) => (
            <Card 
              key={index} 
              className="relative group hover:shadow-lg transition-all duration-300 cursor-pointer hover:bg-background/80 border border-transparent dark:border-purple-900/20"
              tabIndex={0}
              onClick={(e) => {
                // Toggle active state on the card
                const target = e.currentTarget;
                const isActive = target.getAttribute('data-active') === 'true';
                
                // Remove active state from all cards
                document.querySelectorAll('[data-active="true"]').forEach(card => {
                  if (card !== target) card.setAttribute('data-active', 'false');
                });
                
                // Toggle this card
                target.setAttribute('data-active', !isActive ? 'true' : 'false');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.currentTarget.click();
                }
              }}
              style={{
                boxShadow: '0 0 0 1px rgba(139,92,246,0.05)',
              }}
            >
              <CardContent className="p-8 text-center space-y-4">
                <div className="text-4xl font-bold text-muted-foreground/30 mb-4">{item.step}</div>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-105 group-data-[active=true]:scale-110 group-data-[active=true]:bg-primary/20">
                  <item.icon className="h-8 w-8 text-primary transition-all duration-300" />
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
              <div className="absolute inset-0 pointer-events-none border border-purple-600/30 dark:border-purple-500/20 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
              <div className="absolute inset-0 pointer-events-none rounded-xl transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.25)] dark:group-hover:shadow-[0_0_30px_rgba(139,92,246,0.35)] group-data-[active=true]:shadow-[0_0_30px_5px_rgba(139,92,246,0.4)] dark:group-data-[active=true]:shadow-[0_0_40px_5px_rgba(139,92,246,0.5)]"></div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">Key Features</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to connect with the right investors
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI Pitch Analyzer",
                description: "Advanced AI evaluates your pitch for clarity, uniqueness, and market fit.",
              },
              {
                icon: Globe,
                title: "Inclusive Global Access",
                description: "Connect with investors worldwide, breaking geographical barriers.",
              },
              {
                icon: Zap,
                title: "Multilingual Support",
                description: "Submit pitches in your native language with AI-powered translation.",
              },
              {
                icon: MessageSquare,
                title: "Real-Time Community Feedback",
                description: "Get instant feedback from fellow entrepreneurs and early backers.",
              },
              {
                icon: Shield,
                title: "Transparent Evaluation",
                description: "Clear scoring system helps you understand how investors see your idea.",
              },
              {
                icon: Star,
                title: "Investor Chat + Follow-up Scheduling",
                description: "Direct messaging and meeting scheduling with interested investors.",
              },
            ].map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-blue-600/10 to-purple-600/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">What Founders Say</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Success stories from entrepreneurs who found their investors
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                country: "Singapore",
                avatar: "/placeholder.svg?h=64&w=64&text=SC",
                feedback:
                  "InvestorHunt helped me connect with 3 VCs in just 2 weeks. The AI feedback was incredibly valuable for refining my pitch.",
              },
              {
                name: "Marcus Johnson",
                country: "Nigeria",
                avatar: "/placeholder.svg?h=64&w=64&text=MJ",
                feedback:
                  "As a non-native English speaker, the multilingual support was a game-changer. I pitched in my native language and still got funded!",
              },
              {
                name: "Elena Rodriguez",
                country: "Mexico",
                avatar: "/placeholder.svg?h=64&w=64&text=ER",
                feedback:
                  "The community feedback helped me identify blind spots in my business model. Raised $500K seed round within 3 months.",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.country}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.feedback}"</p>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">InvestorHunt</h3>
              <p className="text-sm text-muted-foreground">Reimagining startup funding for everyone, everywhere.</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Quick Links</h4>
              <div className="space-y-3 text-sm">
                <Link href="#" className="block text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">
                  How it Works
                </Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">
                  Success Stories
                </Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">
                  Help Center
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Legal</h4>
              <div className="space-y-3 text-sm">
                <Link href="#" className="block text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">
                  Cookie Policy
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Newsletter</h4>
              <p className="text-sm text-muted-foreground">Get the latest updates and funding opportunities.</p>
              <div className="flex space-x-2">
                <Input placeholder="Enter your email" className="flex-1" />
                <Button>Subscribe</Button>
              </div>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 InvestorHunt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}