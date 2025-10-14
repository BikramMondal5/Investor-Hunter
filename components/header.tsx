"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, X } from "lucide-react"
import { useTheme } from "next-themes"
import { AuthModal } from "@/components/ui/auth-modal"
import { usePathname } from "next/navigation"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  const handleGetStartedClick = () => {
    setIsAuthModalOpen(true)
    if (isMenuOpen) {
      setIsMenuOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto w-full max-w-[1400px] px-3 sm:px-4 md:px-6 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            InvestorHunt
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            href="/" 
            className={`text-sm font-medium transition-colors hover:bg-gradient-to-r hover:from-purple-600 hover:to-purple-600 hover:bg-clip-text hover:text-transparent ${
              pathname === "/" 
                ? "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" 
                : ""
            }`}
          >
            Home
          </Link>
          <Link 
            href={pathname === "/" ? "#how-it-works" : "/#how-it-works"} 
            className="text-sm font-medium transition-colors hover:bg-gradient-to-r hover:from-purple-600 hover:to-purple-600 hover:bg-clip-text hover:text-transparent"
          >
            How it Works
          </Link>
          <Link 
            href={pathname === "/" ? "#features" : "/#features"} 
            className="text-sm font-medium transition-colors hover:bg-gradient-to-r hover:from-purple-600 hover:to-purple-600 hover:bg-clip-text hover:text-transparent"
          >
            Features
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hidden md:inline-flex"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Button className="hidden md:inline-flex" onClick={handleGetStartedClick}>
            Get Started
          </Button>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container mx-auto w-full max-w-[1400px] px-3 sm:px-4 md:px-6 py-4 space-y-4">
            <Link 
              href="/" 
              className={`block text-sm font-medium transition-colors hover:bg-gradient-to-r hover:from-purple-600 hover:to-purple-600 hover:bg-clip-text hover:text-transparent ${
                pathname === "/" 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" 
                  : ""
              }`}
            >
              Home
            </Link>
            <Link 
              href={pathname === "/" ? "#how-it-works" : "/#how-it-works"} 
              className="block text-sm font-medium transition-colors hover:bg-gradient-to-r hover:from-purple-600 hover:to-purple-600 hover:bg-clip-text hover:text-transparent"
            >
              How it Works
            </Link>
            <Link 
              href={pathname === "/" ? "#features" : "/#features"} 
              className="block text-sm font-medium transition-colors hover:bg-gradient-to-r hover:from-purple-600 hover:to-purple-600 hover:bg-clip-text hover:text-transparent"
            >
              Features
            </Link>

            <Button className="w-full mt-2" onClick={handleGetStartedClick}>
              Get Started
            </Button>
          </nav>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  )
}
