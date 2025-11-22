import type React from "react"
import { AuthProvider } from "@/context/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Header } from '@/components/header'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "JWT Authentication System",
  description: "A secure JWT-based authentication system with Next.js and shadcn/ui",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <Header/>
            {children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



