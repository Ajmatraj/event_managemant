"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminHeader from "./comonents/AdminHeader"
import AdminSidebar from "./comonents/AdminSidebar"
import { useAuth } from "@/context/auth-context"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const { user, loading } = useAuth()

  const handleMenuToggle = (isOpen: boolean) => setSidebarOpen(isOpen)
  const handleSidebarClose = () => setSidebarOpen(false)

  useEffect(() => {
    if (!loading) {
      const role = user?.roleName
      // ✅ Redirect non-admins or unauthenticated users
      if (!user || role !== "ADMIN") {
        router.replace("/")
      }
    }
  }, [user, loading, router])

  if (loading) return <div className="p-6 text-lg">Loading...</div>
  if (!user) return <div className="p-6 text-lg">Redirecting...</div>

  return (
    <div className="flex h-screen flex-col md:flex-row bg-background">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader onMenuToggle={handleMenuToggle} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 bg-muted/30 dark:bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  )
}
