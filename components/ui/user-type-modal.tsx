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
import { Button } from "@/components/ui/button"
import { Briefcase, Lightbulb } from "lucide-react"

interface UserTypeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function UserTypeModal({ isOpen, onClose }: UserTypeModalProps) {
  const router = useRouter()
  
  const handleUserTypeSelection = (type: "entrepreneur" | "investor") => {
    if (type === "entrepreneur") {
      router.push("/submit")
    } else {
      router.push("/investor")
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl">Welcome to InvestorHunt</DialogTitle>
          <DialogDescription className="text-center pt-4 text-lg">
            Please select how you would like to use our platform
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
          <Button
            variant="outline"
            className="p-12 h-auto flex flex-col items-center hover:bg-blue-50 dark:hover:bg-blue-950 hover:border-blue-400 transition-all"
            onClick={() => handleUserTypeSelection("entrepreneur")}
          >
            <div className="mb-4">
              <Lightbulb className="h-20 w-20 text-blue-600" strokeWidth={1.5} />
            </div>
            <div className="font-medium text-2xl">Entrepreneur</div>
          </Button>
          
          <Button
            variant="outline"
            className="p-12 h-auto flex flex-col items-center hover:bg-purple-50 dark:hover:bg-purple-950 hover:border-purple-400 transition-all"
            onClick={() => handleUserTypeSelection("investor")}
          >
            <div className="mb-4">
              <Briefcase className="h-20 w-20 text-purple-600" strokeWidth={1.5} />
            </div>
            <div className="font-medium text-2xl">Investor</div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}