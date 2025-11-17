"use client"
import Link from "next/link"
import { BarChart3, Users, Settings, LogOut, HomeIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function AdminSidebar({ isOpen = true, onClose }: AdminSidebarProps) {
  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: BarChart3 },
    { href: "/dashboard/users", label: "Users", icon: Users },
    { href: "/dashboard/categories", label: "Categories", icon: Users },
    { href: "/dashboard/eventmanagement", label: "Event", icon: HomeIcon },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ]

  

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onClose} aria-hidden="true" />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed bg-white left-0 top-0 z-50 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 md:static md:z-auto md:translate-x-0 flex flex-col shadow-lg",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Sidebar Header */}
        <div className="border-b bg-white border-sidebar-border p-6">
          <h2 className="text-lg font-bold text-sidebar-foreground">PicknDrop</h2>
          <p className="text-xs text-sidebar-foreground/60">Admin Panel</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 bg-white p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onClose?.()}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t bg-white border-sidebar-border p-4">
          <button className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
