"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"

export function MainNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  const isAdmin = user?.role_id === "ADMIN"

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
      public: true,
    },
    {
      href: "/event",
      label: "Event",
      active: pathname === "/",
      public: true,
    },
    
    {
      href: "/admin",
      label: "Admin",
      active: pathname === "/admin",
      public: false,
      admin: true,
    },
  ]

  const filteredRoutes = routes.filter((route) => {
    if (!user && !route.public) return false
    if (route.admin && !isAdmin) return false
    return true
  })

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {filteredRoutes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active ? "text-black dark:text-white" : "text-muted-foreground",
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
}

