"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("signin")
  const [isLoading, setIsLoading] = useState(false)
  
  // Form state for sign in
  const [signInEmail, setSignInEmail] = useState("")
  const [signInPassword, setSignInPassword] = useState("")
  
  // Form state for sign up
  const [signUpName, setSignUpName] = useState("")
  const [signUpEmail, setSignUpEmail] = useState("")
  const [signUpPassword, setSignUpPassword] = useState("")
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: signInEmail,
          password: signInPassword
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Sign in failed")
      }
      
      toast({
        title: "Sign In Successful",
        description: "Welcome back!",
        variant: "default",
      })
      
      // Reset form and redirect
      setSignInEmail("")
      setSignInPassword("")
      router.push("/dashboard")
      onClose()
      
    } catch (error) {
      console.error("Sign in error:", error)
      const errorMessage = error instanceof Error ? error.message : "Sign in failed"
      setError(errorMessage)
      toast({
        title: "Sign In Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google"
  }
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    // Enhanced validation
    if (!signUpName.trim()) {
      setError("Please enter your full name")
      return
    }
    
    if (!signUpEmail.trim() || !signUpEmail.includes('@') || !signUpEmail.includes('.')) {
      setError("Please enter a valid email address")
      return
    }
    
    if (signUpPassword !== signUpConfirmPassword) {
      setError("Passwords do not match")
      return
    }
    
    if (signUpPassword.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }
    
    if (signUpName.trim().split(" ").length < 2) {
      setError("Please provide your first and last name")
      return
    }
    
    setIsLoading(true)
    
    try {
      const nameParts = signUpName.trim().split(" ")
      const firstName = nameParts[0]
      const lastName = nameParts.slice(1).join(" ")
      
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email: signUpEmail,
          password: signUpPassword
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Registration failed")
      }
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully. You can now sign in.",
        variant: "default",
        className: "bg-green-800 border-green-700 text-white",
      })
      
      // Reset form
      setSignUpName("")
      setSignUpEmail("")
      setSignUpPassword("")
      setSignUpConfirmPassword("")
      
      // Switch to sign in tab and pre-fill email
      setActiveTab("signin")
      setSignInEmail(signUpEmail)
      
    } catch (error) {
      console.error("Registration error:", error)
      const errorMessage = error instanceof Error ? error.message : "Registration failed"
      setError(errorMessage)
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold tracking-tight">
            Welcome to InvestorHunt
          </DialogTitle>
          <DialogDescription className="text-center pt-2 text-gray-400">
            Join our community of entrepreneurs and investors
          </DialogDescription>
        </DialogHeader>
        
        <Tabs 
          defaultValue="signin" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="mt-4"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form onSubmit={handleSignIn}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="name@example.com" 
                      className="pl-10 bg-gray-950 border-gray-800" 
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button 
                      variant="link" 
                      className="px-0 font-normal text-xs text-blue-500"
                      type="button"
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      className="pl-10 bg-gray-950 border-gray-800"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full bg-gray-800" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-background px-2 text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 place-items-center mt-6">
                <Button onClick={handleGoogleLogin}
                  variant="outline" 
                  className="border-gray-700 w-64 justify-center"
                >
                  <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                  </svg>
                  Google
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignUp}>
              <div className="space-y-4">
                {error && (
                  <div className="bg-red-900/30 border border-red-800 text-red-400 p-3 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                    <Input 
                      id="name" 
                      placeholder="John Doe" 
                      className="pl-10 bg-gray-950 border-gray-800" 
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Enter your first and last name</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder="name@example.com" 
                      className="pl-10 bg-gray-950 border-gray-800" 
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                    <Input 
                      id="signup-password" 
                      type={showPassword ? "text" : "password"} 
                      className={`pl-10 bg-gray-950 ${signUpPassword && signUpPassword.length < 6 ? "border-red-700" : "border-gray-800"}`}
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      required
                      minLength={6}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                  <p className={`text-xs ${signUpPassword && signUpPassword.length < 6 ? "text-red-400" : "text-gray-500"}`}>
                    Password must be at least 6 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                    <Input 
                      id="confirm-password" 
                      type={showPassword ? "text" : "password"} 
                      className="pl-10 bg-gray-950 border-gray-800"
                      value={signUpConfirmPassword}
                      onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registering...
                    </>
                  ) : (
                    <>
                      Create Account <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-400 text-center mt-4">
                  By signing up, you agree to our <a href="#" className="text-blue-500 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>
                </p>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
