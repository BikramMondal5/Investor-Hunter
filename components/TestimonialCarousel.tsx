"use client"

import React, { useRef, useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import useEmblaCarousel from "embla-carousel-react"
import AutoPlay from "embla-carousel-autoplay"

const testimonials = [
  {
    name: "Bikram Mondal",
    country: "Singapore",
    avatar: "/placeholder.svg?h=64&w=64&text=BM",
    feedback:
      "InvestorHunt helped me connect with 3 VCs in just 2 weeks. The AI feedback was incredibly valuable for refining my pitch.",
  },
  {
    name: "Koushik Ghosh",
    country: "Nigeria",
    avatar: "/placeholder.svg?h=64&w=64&text=KG",
    feedback:
      "As a non-native English speaker, the multilingual support was a game-changer. I pitched in my native language and still got funded!",
  },
  {
    name: "Arijit Sarkar",
    country: "Mexico",
    avatar: "/placeholder.svg?h=64&w=64&text=AS",
    feedback:
      "The community feedback helped me identify blind spots in my business model. Raised $500K seed round within 3 months.",
  },
  // Add duplicate testimonials to create a seamless loop effect
  {
    name: "Prateek Singh",
    country: "India",
    avatar: "/placeholder.svg?h=64&w=64&text=PS",
    feedback:
      "The investor matching algorithm introduced me to partners I would never have found on my own. Secured pre-seed funding within a month.",
  },
  {
    name: "Michelle Wong",
    country: "Malaysia",
    avatar: "/placeholder.svg?h=64&w=64&text=MW",
    feedback:
      "InvestorHunt's platform made fundraising accessible even from a remote location. The global reach is truly impressive.",
  },
]

export default function TestimonialCarousel() {
  const [viewportRef, setViewportRef] = useState<HTMLElement | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  
  // Create auto play plugin with customized options
  const autoPlayPlugin = useRef(
    AutoPlay({
      delay: 3000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      playOnInit: true,
    })
  )

  // Initialize Embla Carousel with loop and auto play
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: "start",
      dragFree: true,
      skipSnaps: true,
      slidesToScroll: 1
    },
    [autoPlayPlugin.current]
  )
  
  // Handle mouse events for pausing
  const handleMouseEnter = () => {
    autoPlayPlugin.current.stop()
    setIsPaused(true)
  }
  
  const handleMouseLeave = () => {
    autoPlayPlugin.current.play()
    setIsPaused(false)
  }

  // Set the viewport reference
  useEffect(() => {
    if (emblaRef) {
      setViewportRef(emblaRef)
    }
  }, [emblaRef])

  return (
    <div className="relative overflow-hidden" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Carousel 
        opts={{ 
          align: "start",
          loop: true,
          dragFree: true,
          skipSnaps: true,
        }}
        plugins={[autoPlayPlugin.current]}
        className="w-full"
        ref={emblaRef}
      >
        <CarouselContent className="py-4">
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4 sm:pl-8 transition-transform duration-500">
              <Card className="relative group hover:shadow-lg transition-all duration-300 h-full border border-transparent dark:border-purple-900/20" style={{
                boxShadow: '0 0 0 1px rgba(139,92,246,0.05)',
              }}>
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
                <div className="absolute inset-0 pointer-events-none border border-purple-600/30 dark:border-purple-500/20 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                <div className="absolute inset-0 pointer-events-none rounded-xl transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.25)] dark:group-hover:shadow-[0_0_30px_rgba(139,92,246,0.35)]"></div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      {/* Subtle indicator that carousel is paused when hovering */}
      <div className={`absolute bottom-2 right-2 transition-opacity duration-300 ${isPaused ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-background/80 text-xs px-2 py-1 rounded-full text-muted-foreground">
          Paused
        </div>
      </div>
    </div>
  )
}