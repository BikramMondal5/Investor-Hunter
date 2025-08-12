"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Shield, Upload, Eye, RefreshCw, FileCheck, AlertCircle, Clock, CheckCircle, XCircle } from "lucide-react"
import type { ChangeEvent, DragEvent } from "react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

// Define the form schema with validation
const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  businessName: z.string().min(2, { message: "Business name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  contactNumber: z.string().min(10, { message: "Please enter a valid contact number." }),
  businessRegistrationNumber: z.string().min(5, { message: "Please enter a valid registration number." }),
  industryType: z.string({ required_error: "Please select an industry type." }),
  country: z.string({ required_error: "Please select a country." }),
})

// Define industry types for the dropdown
const industryTypes = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "E-commerce",
  "Manufacturing",
  "Retail",
  "Agriculture",
  "Energy",
  "Entertainment",
  "Food & Beverage",
  "Real Estate",
  "Transportation",
  "Other"
]

// Define countries for the dropdown
const countries = [
  "United States",
  "India",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "China",
  "Japan",
  "Singapore",
  "United Arab Emirates",
  "Brazil",
  "South Africa",
  "Nigeria",
  "Kenya",
  "Other"
]

// Define document type interfaces
interface DocumentType {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

interface UploadedFile extends File {
  preview?: string;
}

type UploadStatus = null | 'pending' | 'approved' | 'rejected';

interface DocumentUploadProps {
  document: DocumentType;
  onUpload: (files: File[]) => void;
}

// Define document types
const requiredDocuments: DocumentType[] = [
  {
    id: "business-registration",
    title: "Business Registration Certificate",
    description: "Official proof of business registration with authorities",
    icon: FileCheck,
  },
  {
    id: "tax-document",
    title: "Tax Identification Document",
    description: "Tax registration document with unique ID number",
    icon: FileCheck,
  },
  {
    id: "address-proof",
    title: "Proof of Address",
    description: "Utility bill or bank statement from the last 3 months",
    icon: FileCheck,
  },
  {
    id: "id-proof",
    title: "Founder's ID Proof",
    description: "Valid passport, driving license, or national ID card",
    icon: FileCheck,
  }
]

const optionalDocuments: DocumentType[] = [
  {
    id: "pitch-deck",
    title: "Pitch Deck",
    description: "Presentation outlining your business proposal",
    icon: FileCheck,
  },
  {
    id: "financial-statements",
    title: "Financial Statements",
    description: "Balance sheets, income statements, cash flow statements",
    icon: FileCheck,
  }
]

// Document file component
const DocumentUpload: React.FC<DocumentUploadProps> = ({ document, onUpload }) => {
  const [files, setFiles] = React.useState<File[]>([])
  const [uploading, setUploading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [uploadStatus, setUploadStatus] = React.useState<UploadStatus>(null) 
  const [isMounted, setIsMounted] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  
  // Only run on client
  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    
    const selectedFiles = Array.from(e.target.files)
    
    // Filter files by type and size
    const validFiles = selectedFiles.filter(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
      const validSize = file.size <= 10 * 1024 * 1024 // 10MB
      
      return validTypes.includes(file.type) && validSize
    })
    
    if (validFiles.length > 0) {
      simulateUpload(validFiles)
    }
  }

  const simulateUpload = (validFiles: File[]) => {
    setUploading(true)
    setProgress(0)
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          setFiles([...files, ...validFiles])
          setUploadStatus('pending')
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    const validFiles = droppedFiles.filter(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
      const validSize = file.size <= 10 * 1024 * 1024 // 10MB
      
      return validTypes.includes(file.type) && validSize
    })
    
    if (validFiles.length > 0) {
      simulateUpload(validFiles)
    }
  }

  const handleBrowse = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  // Prevent hydration errors by not rendering interactive elements during SSR
  if (!isMounted) {
    return (
      <Card className="border border-gray-800 bg-gray-950">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <document.icon className="h-5 w-5 text-amber-500" />
              <CardTitle className="text-lg">{document.title}</CardTitle>
            </div>
          </div>
          <CardDescription className="text-gray-400">{document.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-40 w-full bg-gray-900/50 rounded-lg animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-gray-800 bg-gray-950 h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <document.icon className="h-5 w-5 text-amber-500 flex-shrink-0" />
            <CardTitle className="text-lg">{document.title}</CardTitle>
            {uploadStatus && getStatusIcon()}
          </div>
        </div>
        <CardDescription className="text-gray-400 mt-2">{document.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex">
        {files.length === 0 ? (
          <div
            className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center cursor-pointer hover:border-amber-500 transition-colors flex flex-col items-center justify-center w-full"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleBrowse}
          >
            <Upload className="h-8 w-8 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-300 mb-2">Drag & drop files here</p>
            <p className="text-gray-400 text-sm">or</p>
            <Button 
              variant="secondary" 
              size="sm" 
              className="mt-3"
              onClick={(e) => {
                e.stopPropagation()
                handleBrowse()
              }}
            >
              Browse Files
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <p className="text-gray-500 text-xs mt-4">Max 10MB, PDF/JPG/PNG</p>
          </div>
        ) : (
          <div className="w-full flex flex-col h-full">
            <div className="space-y-3 w-full flex-1">
              {files.map((file, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-900 rounded-md">
                  <div className="flex items-center gap-2 text-sm overflow-hidden">
                    <FileCheck className="h-4 w-4 flex-shrink-0 text-amber-500" />
                    <span className="truncate">{file.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View file</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleBrowse}>
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Replace file</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4 w-full border-dashed"
              onClick={handleBrowse}
            >
              <Upload className="h-3 w-3 mr-2" />
              Add More Files
            </Button>
          </div>
        )}
        {uploading && (
          <div className="mt-4">
            <Progress value={progress} className="h-1" />
            <p className="text-center text-xs text-gray-500 mt-1">Uploading... {progress}%</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

type FormData = z.infer<typeof formSchema>;

export function EntrepreneurRegistrationContent() {
  // Add client-side only rendering state
  const [isMounted, setIsMounted] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [showConfirmation, setShowConfirmation] = React.useState(false)
  const [formData, setFormData] = React.useState<FormData | null>(null)
  
  // Only render on client side
  React.useEffect(() => {
    setIsMounted(true)
  }, [])
  
  // Define form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      businessName: "",
      email: "",
      contactNumber: "",
      businessRegistrationNumber: "",
      industryType: "",
      country: "",
    },
  })

  const onSubmit = (data: FormData) => {
    setFormData(data)
    setShowConfirmation(true)
  }

  const handleConfirmSubmission = () => {
    setSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false)
      setShowConfirmation(false)
      
      // Show success toast or redirect
      window.location.href = "/dashboard" // After document verification, entrepreneurs go to their dashboard
    }, 2000)
  }

  // Don't render anything during server-side rendering
  if (!isMounted) {
    return (
      <div className="container py-10 min-h-screen">
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-amber-500 text-black font-medium px-2 py-0.5 rounded-md text-sm">Step 2 of 2</div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Entrepreneur Registration & Document Verification</h1>
        <p className="text-gray-400 max-w-3xl mt-2">
          Loading registration form...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-amber-500 text-black font-medium px-2 py-0.5 rounded-md text-sm">Step 2 of 2</div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">Entrepreneur Registration & Document Verification</h1>
        <p className="text-gray-400 mt-2 mb-8">
          Now that you've submitted your pitch video, complete your registration by uploading required business documents for verification. 
          This ensures authenticity and builds investor trust.
        </p>
        
        <Alert className="mt-6 mb-8 bg-gray-900 border-gray-800 rounded-lg shadow-sm">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="text-lg">Important Information</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-2 mt-3 text-sm">
              <li>Documents are encrypted & stored securely.</li>
              <li>Verification may take up to 48 hours.</li>
              <li>All uploads must be in PDF, JPG, or PNG format.</li>
            </ul>
          </AlertDescription>
        </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold tracking-tight mb-6">1. Registration Information</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium mb-2 block">Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} className="bg-gray-950 border-gray-800 h-11" />
                    </FormControl>
                    <FormMessage className="mt-1.5" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium mb-2 block">Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Inc." {...field} className="bg-gray-950 border-gray-800 h-11" />
                    </FormControl>
                    <FormMessage className="mt-1.5" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium mb-2 block">Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} className="bg-gray-950 border-gray-800 h-11" />
                    </FormControl>
                    <FormMessage className="mt-1.5" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium mb-2 block">Contact Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} className="bg-gray-950 border-gray-800 h-11" />
                    </FormControl>
                    <FormMessage className="mt-1.5" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="businessRegistrationNumber"
                render={({ field }) => (
                  <FormItem className="lg:col-span-2">
                    <FormLabel className="text-base font-medium mb-2 block">Business Registration Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. LLC-123456" {...field} className="bg-gray-950 border-gray-800 h-11" />
                    </FormControl>
                    <FormMessage className="mt-1.5" />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 lg:col-span-2">
                <FormField
                  control={form.control}
                  name="industryType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium mb-2 block">Industry Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-950 border-gray-800 h-11">
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-950 border-gray-800">
                          {industryTypes.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="mt-1.5" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium mb-2 block">Country</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-950 border-gray-800 h-11">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-950 border-gray-800 max-h-[200px]">
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="mt-1.5" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <Separator className="bg-gray-800 my-10" />
          
          <div className="space-y-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold tracking-tight mb-2">2. Required Documents</h2>
              <p className="text-gray-400 text-sm mt-2">Please upload the following required documents for verification</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
              {requiredDocuments.map((doc) => (
                <DocumentUpload 
                  key={doc.id} 
                  document={doc} 
                  onUpload={(files) => console.log(`Uploaded ${files.length} files for ${doc.id}`)}
                />
              ))}
            </div>
          </div>
          
          <Separator className="bg-gray-800 my-10" />
          
          <div className="space-y-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold tracking-tight mb-2">3. Optional Documents</h2>
              <p className="text-gray-400 text-sm mt-2">These documents are not required but can strengthen your business profile</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
              {optionalDocuments.map((doc) => (
                <DocumentUpload 
                  key={doc.id} 
                  document={doc}
                  onUpload={(files) => console.log(`Uploaded ${files.length} files for ${doc.id}`)}
                />
              ))}
            </div>
          </div>
          
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 flex items-start gap-4 mt-10 max-w-3xl mx-auto">
            <Shield className="h-6 w-6 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-300 text-base">Your documents are encrypted during upload and storage. We comply with GDPR and other relevant data protection laws.</p>
            </div>
          </div>

          <div className="flex justify-center mt-10 pt-4">
            <Button 
              type="submit" 
              className="px-10 py-6 bg-amber-500 hover:bg-amber-600 text-black font-medium text-lg"
            >
              Submit for Verification
            </Button>
          </div>
        </form>
      </Form>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md bg-gray-950 border-gray-800">
          <DialogHeader>
            <DialogTitle>Confirm Document Submission</DialogTitle>
            <DialogDescription>
              Please review your information before final submission.
            </DialogDescription>
          </DialogHeader>
          
          {formData && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <p className="text-gray-400">Full Name:</p>
                <p>{formData.fullName}</p>
                
                <p className="text-gray-400">Business Name:</p>
                <p>{formData.businessName}</p>
                
                <p className="text-gray-400">Email:</p>
                <p>{formData.email}</p>
                
                <p className="text-gray-400">Industry:</p>
                <p>{formData.industryType}</p>
              </div>
              
              <Alert className="bg-amber-950 border-amber-800">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Once submitted, you will receive status updates via email as your documents are verified.
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          <DialogFooter className="flex space-x-2 sm:justify-center">
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Go Back & Edit
            </Button>
            <Button 
              onClick={handleConfirmSubmission}
              className="bg-amber-500 hover:bg-amber-600 text-black"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Confirm & Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  )
}
