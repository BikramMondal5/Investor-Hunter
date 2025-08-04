"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Play, Upload, Brain, MessageSquare, Star, ArrowRight, Globe, Zap, Shield, 
  Film, BarChart3, ClipboardCheck, UserCheck, CheckSquare, Users, Video 
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState, useCallback, useRef } from "react"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import TestimonialCarousel from "@/components/TestimonialCarousel"

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
      <section className="bg-black text-white py-16 pt-12">
        <div className="container mx-auto w-full max-w-[1400px] px-3 sm:px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-6 xl:gap-16 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold leading-tight">
                  Reimagining Startup{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Funding
                  </span>{" "}
                  for Everyone
                </h1>
                <p className="text-xl text-gray-300 max-w-lg">
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
                <Link href="/investor" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent border-white/20 text-white hover:bg-white/10">
                    <Play className="mr-2 h-4 w-4" />
                    Explore Funded Ideas
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0">
              <div className="aspect-video rounded-xl shadow-lg overflow-hidden">
                <img
                  src="/video-pitch-image.png"
                  alt="Entrepreneur recording a pitch video"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Investors Section */}
      <section className="py-12 md:py-16 bg-black">
        <div className="overflow-hidden">
          <div className="text-center mb-8 md:mb-10 animate-fade-in">
            <p className="text-sm md:text-base font-medium text-gray-300/80 uppercase tracking-widest">
              Trusted by Investors Worldwide
            </p>
          </div>
          
          <div className="relative w-full overflow-hidden">
            {/* Logo wrapper */}
            <div className="animate-scroll flex w-fit">
              {/* First set of logos */}
              <div className="flex items-center gap-16 md:gap-24">
                <div className="h-16 flex-shrink-0 flex items-center justify-center">
                  <img src="/LetsVenture.png" alt="LetsVenture Logo" className="h-10 object-contain" />
                </div>
                <div className="h-16 flex-shrink-0 flex items-center justify-center">
                  <img src="/MicroVentures.png" alt="MicroVentures Logo" className="h-10 object-contain" />
                </div>
                <div className="h-16 flex-shrink-0 flex items-center justify-center">
                  <img src="/IAN.png" alt="IAN Logo" className="h-10 object-contain" />
                </div>
                <div className="h-16 flex-shrink-0 flex items-center justify-center">
                  <img src="/Seedrs.png" alt="Seedrs Logo" className="h-10 object-contain" />
                </div>
                <div className="h-16 flex-shrink-0 flex items-center justify-center">
                  <img src="/Axilor-Ventures.png" alt="Axilor Ventures Logo" className="h-10 object-contain" />
                </div>
                <div className="h-16 flex-shrink-0 flex items-center justify-center">
                  <img src="/SIDBI.png" alt="SIDBI Logo" className="h-10 object-contain" />
                </div>
                <div className="h-16 flex-shrink-0 flex items-center justify-center">
                  <img src="/unitus ventures.png" alt="Unitus Ventures Logo" className="h-10 object-contain" />
                </div>
                <div className="h-16 flex-shrink-0 flex items-center justify-center">
                  <img src="/saif-partners.png" alt="SAIF Partners Logo" className="h-10 object-contain" />
                </div>
                <div className="h-16 flex-shrink-0 flex items-center justify-center">
                  <img src="/Next47.png" alt="Next47 Logo" className="h-10 object-contain" />
                </div>
                <div className="h-16 flex-shrink-0 flex items-center justify-center">
                  <img src="/kalaari-capital.png" alt="Kalaari Capital Logo" className="h-10 object-contain" />
                </div>
                <div className="h-16 flex-shrink-0 flex items-center justify-center">
                  <img src="/Blume-ventures.png" alt="Blume Ventures Logo" className="h-10 object-contain" />
                </div>
                <div className="h-16 flex-shrink-0 flex items-center justify-center">
                  <img src="/ankur-capital.png" alt="Ankur Capital Logo" className="h-10 object-contain" />
                </div>
                <div className="h-16 flex-shrink-0 flex items-center justify-center">
                  <img src="/Accel.png" alt="Accel Partners Logo" className="h-10 object-contain" />
                </div>
              </div>
              
              {/* Exact duplicate set for seamless loop */}
              <div className="flex items-center gap-16 md:gap-24">
                <div className="h-16 flex-shrink-0 flex items-center justify-center">
                  <img src="/LetsVenture.png" alt="LetsVenture Logo" className="h-10 object-contain" />
                </div>
                <div className="h-16 flex-shrink-0 flex items-center justify-center">
                  <img src="/MicroVentures.png" alt="MicroVentures Logo" className="h-10 object-contain" />
                </div>
                <div className="h-16 flex-shrink-0 flex items-center justify-center">
                  <img src="/IAN.png" alt="IAN Logo" className="h-10 object-contain" />
                </div>
                <div className="h-16 flex-shrink-0 flex items-center justify-center">
                  <img src="/Seedrs.png" alt="Seedrs Logo" className="h-10 object-contain" />
                </div>
                <div className="h-16 flex-shrink-0 flex items-center justify-center">
                  <img src="/Axilor-Ventures.png" alt="Axilor Ventures Logo" className="h-10 object-contain" />
                </div>
                <div className="h-16 flex-shrink-0 flex items-center justify-center">
                  <img src="/SIDBI.png" alt="SIDBI Logo" className="h-10 object-contain" />
                </div>
                <div className="h-16 flex-shrink-0 flex items-center justify-center">
                  <img src="/unitus ventures.png" alt="Unitus Ventures Logo" className="h-10 object-contain" />
                </div>
                <div className="h-16 flex-shrink-0 flex items-center justify-center">
                  <img src="/saif-partners.png" alt="SAIF Partners Logo" className="h-10 object-contain" />
                </div>
                <div className="h-16 flex-shrink-0 flex items-center justify-center">
                  <img src="/Next47.png" alt="Next47 Logo" className="h-10 object-contain" />
                </div>
                <div className="h-16 flex-shrink-0 flex items-center justify-center">
                  <img src="/kalaari-capital.png" alt="Kalaari Capital Logo" className="h-10 object-contain" />
                </div>
                <div className="h-16 flex-shrink-0 flex items-center justify-center">
                  <img src="/Blume-ventures.png" alt="Blume Ventures Logo" className="h-10 object-contain" />
                </div>
                <div className="h-16 flex-shrink-0 flex items-center justify-center">
                  <img src="/ankur-capital.png" alt="Ankur Capital Logo" className="h-10 object-contain" />
                </div>
                <div className="h-16 flex-shrink-0 flex items-center justify-center">
                  <img src="/Accel.png" alt="Accel Partners Logo" className="h-10 object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-16 md:py-20">
        <div className="container mx-auto w-full max-w-[1400px] px-3 sm:px-4 md:px-6">
          <div className="text-center space-y-4 mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">How it Works</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              The comprehensive journey from pitch to investor meeting
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                icon: Film,
                title: "Upload & Analyze Pitch",
                description: "Upload a 3–4 minute video pitch, then run AI analysis before final submission.",
              },
              {
                step: "02",
                icon: BarChart3,
                title: "AI Scoring & Feedback",
                description: "Receive objective feedback and parameter scores (confidence, creativity, clarity) from the AI.",
              },
              {
                step: "03",
                icon: ClipboardCheck,
                title: "Submission & Final Scorecard",
                description: "Submit your refined pitch for a final AI-generated scorecard and ranking.",
              },
              {
                step: "04",
                icon: UserCheck,
                title: "Entrepreneur Registration & Document Verification",
                description: "Register and upload business documents, which the InvestorHunt team verifies for authenticity.",
              },
              {
                step: "05",
                icon: Users,
                title: "Internal Interview Screening",
                description: "Our panel meets top-scoring founders online to assess their business clarity, team strength, and coachability.",
              },
              {
                step: "06",
                icon: CheckSquare,
                title: "Finalist Selection for Live Investor Meetings",
                description: "Founders who pass the internal screening qualify for live pitch sessions with real investors.",
              },
              {
                step: "07",
                icon: Video,
                title: "Live Investor Pitch & Follow-up",
                description: "Pitch directly to verified investors in a live meeting, with post-meeting follow-up options for further interest.",
              },
            ].map((item, index) => (
              <Card 
                key={index} 
                className="relative group hover:shadow-lg transition-all duration-300 cursor-default hover:bg-background/80 border border-transparent dark:border-purple-900/20"
                style={{
                  boxShadow: '0 0 0 1px rgba(139,92,246,0.05)',
                }}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="text-3xl font-bold text-muted-foreground/30 mb-2">{item.step}</div>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 transition-transform duration-300 group-hover:scale-105">
                    <item.icon className="h-8 w-8 text-primary transition-all duration-300" />
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
                <div className="absolute inset-0 pointer-events-none border border-purple-500/40 dark:border-purple-400/30 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                <div className="absolute inset-0 pointer-events-none rounded-xl transition-all duration-300 group-hover:shadow-[0_8px_35px_-2px_rgba(139,92,246,0.6),0_0_15px_rgba(139,92,246,0.3)_inset] dark:group-hover:shadow-[0_10px_40px_-2px_rgba(139,92,246,0.7),0_0_20px_rgba(139,92,246,0.35)_inset]"></div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/submit">
              <Button size="lg">
                Start Your Journey
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto w-full max-w-[1400px] px-3 sm:px-4 md:px-6">
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
              <Card key={index} className="relative group hover:shadow-lg transition-all duration-300 border border-transparent dark:border-purple-900/20" style={{
                boxShadow: '0 0 0 1px rgba(139,92,246,0.05)',
              }}>
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
                <div className="absolute inset-0 pointer-events-none border border-purple-500/40 dark:border-purple-400/30 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                <div className="absolute inset-0 pointer-events-none rounded-xl transition-all duration-300 group-hover:shadow-[0_8px_35px_-2px_rgba(139,92,246,0.6),0_0_15px_rgba(139,92,246,0.3)_inset] dark:group-hover:shadow-[0_10px_40px_-2px_rgba(139,92,246,0.7),0_0_20px_rgba(139,92,246,0.35)_inset]"></div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-blue-600/10 to-purple-600/10">
        <div className="container mx-auto w-full max-w-[1400px] px-3 sm:px-4 md:px-6">
          <div className="text-center space-y-4 mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">What Our Clients Say</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Success stories from entrepreneurs who found their investors
            </p>
          </div>

          <div className="relative">
            <TestimonialCarousel />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto w-full max-w-[1400px] px-3 sm:px-4 md:px-6 py-12 md:py-16">
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