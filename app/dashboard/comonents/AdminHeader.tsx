"use client"

import { useCallback, useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

interface AdminHeaderProps {
  onMenuToggle?: (isOpen: boolean) => void
}

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const { user, loading } = useAuth()

  // ✅ useCallback ensures stability
  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen((prev) => {
      const newState = !prev
      // ✅ Prevent React warning: trigger parent update after render cycle
      queueMicrotask(() => onMenuToggle?.(newState))
      return newState
    })
  }, [onMenuToggle])

  useEffect(() => {
    if (!loading) {
      const role = user?.roleName
      if (!user || role !== "ADMIN") {
        router.replace("/")
      }
    }
  }, [user, loading, router])

  if (loading) return <div className="p-6 text-lg">Loading...</div>
  if (!user) return <div className="p-6 text-lg">Redirecting...</div>

  return (
    <header className="border-b border-border bg-card shadow-sm">
      <div className="flex items-center justify-between px-4 py-4 md:px-6">
        {/* Mobile menu toggle */}
        <button
          onClick={handleMenuToggle}
          className="md:hidden p-2 hover:bg-muted rounded-md transition-colors"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Dashboard title */}
        <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>

        {/* Header actions */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-sm text-muted-foreground">
            Welcome back!
          </span>
          <Button variant="outline" size="sm">
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
