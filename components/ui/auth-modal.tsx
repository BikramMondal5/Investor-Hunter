"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialError?: string | null
}

export function AuthModal({ isOpen, onClose, initialError }: AuthModalProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("signin")
  const [isLoading, setIsLoading] = useState(false)
  const [showAdminPrompt, setShowAdminPrompt] = useState(false)
  const [adminPasskey, setAdminPasskey] = useState("")
  const [adminLoading, setAdminLoading] = useState(false)

  // Form state for sign in
  const [signInEmail, setSignInEmail] = useState("")
  const [signInPassword, setSignInPassword] = useState("")
  // ⭐ NEW: Separate error state for Sign In
  const [signInError, setSignInError] = useState<string | null>(null)

  // Form state for sign up
  const [signUpRole, setSignUpRole] = useState<"entrepreneur" | "investor">("entrepreneur")
  const [signUpName, setSignUpName] = useState("")
  const [signUpEmail, setSignUpEmail] = useState("")
  const [signUpPassword, setSignUpPassword] = useState("")
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("")
  // ⭐ NEW: Separate error state for Sign Up
  const [signUpError, setSignUpError] = useState<string | null>(null)
  useEffect(() => {
    // Handle initial error from props - keep user on signin tab
    if (initialError === 'user_not_found') {
      setSignInError("user_not_found"); // Set a special flag
    } else if (initialError === 'oauth_failed') {
      setSignInError("Unable to sign in with Google. Please try again.");
    }
  }, [initialError]);

  const handleGoogleSignUp = () => {
    window.location.href = `/api/auth/google?role=${signUpRole}`;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignInError(null)
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
        className: "bg-green-800 border-green-700 text-white",
      })
      
      // Reset form
      setSignInEmail("")
      setSignInPassword("")
      
      // Close modal first
      onClose()
      
      // Use window.location.href for hard redirect like Google sign-in
      setTimeout(() => {
        const redirectPath = data.user.role === "investor" ? "/investor" : "/dashboard"
        window.location.href = redirectPath
      }, 100)

    } catch (error) {
      console.error("Sign in error:", error)
      const errorMessage = error instanceof Error ? error.message : "Sign in failed"
      setSignInError(errorMessage)
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
    // Clear any existing sign-in errors before redirecting
    setSignInError(null)
    window.location.href = "/api/auth/google"
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignUpError(null)

    // Enhanced validation
    if (!signUpName.trim()) {
      setSignUpError("Please enter your full name")
      return
    }

    if (!signUpEmail.trim() || !signUpEmail.includes('@') || !signUpEmail.includes('.')) {
      setSignUpError("Please enter a valid email address")
      return
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setSignUpError("Passwords do not match")
      return
    }

    if (signUpPassword.length < 6) {
      setSignUpError("Password must be at least 6 characters long")
      return
    }

    if (signUpName.trim().split(" ").length < 2) {
      setSignUpError("Please provide your first and last name")
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
          password: signUpPassword,
          role: signUpRole  // ⭐ This sends the role (entrepreneur or investor)
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Registration failed")
      }

      // Show success toast
      toast({
        title: "Registration Successful",
        description: "Welcome! Your account has been created.",
        variant: "default",
        className: "bg-green-800 border-green-700 text-white",
      })

      // Reset form
      setSignUpName("")
      setSignUpEmail("")
      setSignUpPassword("")
      setSignUpConfirmPassword("")

      // Close modal first
      onClose()

      // ⭐ FIX: Redirect based on actual role from response
      setTimeout(() => {
        const redirectPath = data.user.role === "investor" ? "/investor" : "/dashboard"
        window.location.href = redirectPath
      }, 100)

    } catch (error) {
      console.error("Registration error:", error)
      const errorMessage = error instanceof Error ? error.message : "Registration failed"
      setSignUpError(errorMessage)
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  const handleAdminAccess = async () => {
    if (!adminPasskey.trim()) {
      toast({
        title: "Error",
        description: "Please enter the admin passkey",
        variant: "destructive",
      })
      return
    }

    setAdminLoading(true)

    try {
      const res = await fetch('/api/auth/admin-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey: adminPasskey })
      })

      const data = await res.json()

      if (res.ok && data.success) {
        toast({
          title: "Admin Access Granted",
          description: "Redirecting to admin panel...",
          variant: "default",
          className: "bg-green-800 border-green-700 text-white",
        })
        
        setAdminPasskey("")
        setShowAdminPrompt(false)
        onClose()
        
        setTimeout(() => {
          router.push('/admin/verification-requests')
          router.refresh()
        }, 500)
      } else {
        // Show the specific error message from the API
        toast({
          title: "Access Denied !",
          description: data.message || "Invalid admin passkey",
          variant: "destructive",
          className: "bg-red-800 border-red-600 text-white"
        })
        // Clear the passkey field on error
        setAdminPasskey("")
      }
    } catch (error) {
      console.error('Admin access error:', error)
      toast({
        title: "Error",
        description: "Failed to verify admin access. Please try again.",
        variant: "destructive",
      })
    } finally {
      setAdminLoading(false)
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background border-gray-800 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold tracking-tight">
            Welcome to InvestorHunt
          </DialogTitle>
          <DialogDescription className="text-center pt-2 text-gray-400">
            Join our community of entrepreneurs and investors
          </DialogDescription>
        </DialogHeader>
        {/* Show error message separately above tabs */}
        {signInError === "user_not_found" && (
          <div className="bg-red-900/30 border border-red-800 text-red-400 p-4 rounded-md text-sm space-y-3 mt-4">
            <p className="font-medium">No account exists with this Google account.</p>
            <p className="text-red-300/90">Please sign up first to continue.</p>
            <Button
              type="button"
              onClick={() => {
                setActiveTab("signup");
                setSignInError(null);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
              size="sm"
            >
              OK
            </Button>
          </div>
        )}

        {signInError && signInError !== "user_not_found" && (
          <div className="bg-red-900/30 border border-red-800 text-red-400 p-3 rounded-md text-sm mt-4">
            {signInError}
          </div>
        )}

        <Tabs
          defaultValue="signin"
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);
            // Clear errors when switching tabs
            setSignInError(null);
            setSignUpError(null);
          }}
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
                {/* ⭐ NEW: Conditionally render the sign-up error */}
                {signUpError && (
                  <div className="bg-red-900/30 border border-red-800 text-red-400 p-3 rounded-md text-sm">
                    {signUpError}
                  </div>
                )}
                <div className="space-y-3">
                  <Label>I am a</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSignUpRole("entrepreneur")}
                      disabled={isLoading}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        signUpRole === "entrepreneur"
                          ? "border-blue-600 bg-blue-600/10"
                          : "border-gray-800 hover:border-gray-700"
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">🚀</div>
                        <div className="font-semibold">Entrepreneur</div>
                        <div className="text-xs text-gray-400 mt-1">Seeking investment</div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignUpRole("investor")}
                      disabled={isLoading}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        signUpRole === "investor"
                          ? "border-blue-600 bg-blue-600/10"
                          : "border-gray-800 hover:border-gray-700"
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">💼</div>
                        <div className="font-semibold">Investor</div>
                        <div className="text-xs text-gray-400 mt-1">Looking to invest</div>
                      </div>
                    </button>
                  </div>
                </div>
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
                    <Button 
                      onClick={handleGoogleSignUp}
                      type="button"
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

                <p className="text-xs text-gray-400 text-center mt-4">
                  By signing up, you agree to our <a href="#" className="text-blue-500 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>
                </p>
              </div>
            </form>
          </TabsContent>
        </Tabs>
        <div className="mt-6 pt-6 border-t border-gray-800">
        {!showAdminPrompt ? (
          <button
            type="button"
            onClick={() => setShowAdminPrompt(true)}
            className="w-full text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            Are you an admin?
          </button>
        ) : (
          <div className="space-y-3">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-300 mb-3">Admin Access</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-passkey" className="text-xs text-gray-400">
                Enter Admin Passkey
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="admin-passkey"
                  type="password"
                  placeholder="Enter passkey"
                  className="pl-10 bg-gray-950 border-gray-800 text-sm"
                  value={adminPasskey}
                  onChange={(e) => setAdminPasskey(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAdminAccess()
                    }
                  }}
                  disabled={adminLoading}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => {
                  setShowAdminPrompt(false)
                  setAdminPasskey("")
                }}
                disabled={adminLoading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs"
                onClick={handleAdminAccess}
                disabled={adminLoading || !adminPasskey.trim()}
              >
                {adminLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  "Access Admin"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
      </DialogContent>
    </Dialog>
  )
}