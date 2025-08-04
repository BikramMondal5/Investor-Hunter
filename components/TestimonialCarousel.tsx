"use client"

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

// Testimonial data with updated country for Koushik Ghosh
const testimonials = [
  {
    name: "Bikram Mondal",
    country: "India",
    type: "Entrepreneur",
    avatar: "https://avatars.githubusercontent.com/u/170235967?v=4",
    feedback:
      "InvestorHunt helped me connect with 3 VCs in just 2 weeks. The AI feedback was incredibly valuable for refining my pitch.",
  },
  {
    name: "Koushik Ghosh",
    country: "Singapore", // Updated country
    type: "Entrepreneur",
    avatar: "Koushik-Ghosh.jpeg",
    feedback:
      "The community feedback helped me identify blind spots in my business model. Raised $500K seed round within 3 months.",
  },
  {
    name: "Arijit Sarkar",
    country: "Mexico", // Updated from Nigeria to USA as shown in the image
    type: "Entrepreneur",
    avatar: "Arijit-Sarker.jpeg",
    feedback:
      "As a non-native English speaker, the multilingual support was a game-changer. I pitched in my native language and still got funded!",
  },
  {
    name: "Debashish Sarkar",
    country: "Malaysia",
    type: "Entrepreneur",
    avatar: "Debashish-Sarkar.jpeg",
    feedback:
      "The investor matching algorithm introduced me to partners I would never have found on my own. Secured pre-seed funding within a month.",
  },
  {
    name: "Maria Lee",
    country: "Germany",
    type: "Investor",
    avatar: "Maria-Lee.jpg",
    feedback:
      "The quality of pitches on this platform is exceptional — I've discovered startups that truly stand out.",
  },
  {
    name: "John Smith",
    country: "USA",
    type: "Investor",
    avatar: "Jane-Smith.jpeg",
    feedback:
      "This platform bridges the gap between visionaries and investors perfectly — it's efficient, smart, and impactful.",
  },
]

export default function TestimonialCarousel() {
  return (
    <div className="relative overflow-hidden">
      <div className="overflow-hidden relative w-full py-4">
        <div 
          className="flex animate-marquee"
          style={{ 
            width: `${testimonials.length * 100}%`,
          }}
        >
          {/* First set of cards */}
          {testimonials.map((testimonial, index) => (
            <div 
              key={`first-${index}`} 
              className="w-full px-4 flex-shrink-0"
              style={{ 
                maxWidth: '460px', // Increased from 420px to 460px
                minWidth: '390px', // Increased from 360px to 390px
              }}
            >
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
          
          {/* Second set of cards (duplicate) for seamless loop */}
          {testimonials.map((testimonial, index) => (
            <div 
              key={`second-${index}`} 
              className="w-full px-4 flex-shrink-0"
              style={{ 
                maxWidth: '460px', // Increased from 420px to 460px
                minWidth: '390px', // Increased from 360px to 390px
              }}
            >
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Testimonial Card Component with styling matching the image
function TestimonialCard({ testimonial }) {
  return (
    <Card className="relative group transition-all duration-300 h-full bg-[#121521] border-none rounded-xl overflow-hidden" style={{
      minHeight: '290px', // Reduced from 320px to 290px
    }}>
      <CardContent className="p-7 flex flex-col h-full"> {/* Reduced padding from p-8 to p-7 */}
        <div className="flex items-center space-x-3 mb-5"> {/* Reduced margin bottom from mb-6 to mb-5 */}
          <img
            src={testimonial.avatar || "/placeholder.svg"}
            alt={testimonial.name}
            className="w-14 h-14 rounded-full border-2 border-yellow-400" // Increased avatar size from 12 to 14
          />
          <div>
            <h4 className="font-semibold text-white text-lg">
              {testimonial.name}
            </h4>
            <p className="text-sm text-gray-400">{testimonial.country}</p>
          </div>
        </div>
        <p className="text-gray-300 italic text-base flex-grow mb-5">"{testimonial.feedback}"</p> {/* Reduced margin bottom from mb-6 to mb-5 */}
        <div className="flex justify-between items-center mt-auto pt-2"> {/* Reduced padding top from pt-3 to pt-2 */}
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className={`px-3 py-1 text-xs rounded-full ${
            testimonial.type === "Investor" 
              ? "bg-blue-600/30 text-blue-400 border border-blue-500/50" 
              : "bg-purple-600/30 text-purple-400 border border-purple-500/50"
          }`}>
            {testimonial.type}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}