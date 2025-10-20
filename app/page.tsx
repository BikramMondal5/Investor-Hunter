import { Suspense } from 'react'
import { LandingPageContent } from "@/components/landing-page-content"

export default function LandingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <LandingPageContent />
    </Suspense>
  )
}