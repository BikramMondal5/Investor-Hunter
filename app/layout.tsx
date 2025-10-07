import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ClaraAssistant } from "@/components/clara-assistant"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "InvestorHunt - Reimagining Startup Funding",
  description:
    "Break the barriers of pitch decks, costly VC intros, and language limitations. Submit your idea with a simple video.",
    generator: 'v0.dev'
}

import { AppSessionProvider } from "@/hooks/use-app-session";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AppSessionProvider>
            {children}
            <Toaster />
            <ClaraAssistant />
          </AppSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
