"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { UserWithoutPassword } from "@/lib/auth"

interface AuthContextType {
  user: (UserWithoutPassword & { roleName?: string }) | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<(UserWithoutPassword & { roleName?: string }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // 🔹 Load logged-in user once on app mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch("/api/auth/me")
        if (!res.ok) throw new Error("Failed to fetch user")

        const data = await res.json()
        console.log(data)
        let currentUser = data.user

        // 🔹 Normalize role name (handles nested or missing values)
        const roleName =
          currentUser?.roleName ||
          currentUser?.role?.role_name ||
          currentUser?.role ||
          "USER"

        setUser({ ...currentUser, roleName })
      } catch (error) {
        console.error("Failed to fetch user:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [])

  // 🔹 Login
  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Login failed")

      // Normalize role name
      const roleName =
        data.user?.roleName ||
        data.user?.role?.role_name ||
        data.user?.role ||
        "USER"

      setUser({ ...data.user, roleName })
      router.push("/")
    } catch (error) {
      console.error("Login error:", error)
      setError(error instanceof Error ? error.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Register
  const register = async (name: string, email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Registration failed")

      const userRes = await fetch("/api/auth/me")
      if (userRes.ok) {
        const userData = await userRes.json()
        const roleName =
          userData.user?.roleName ||
          userData.user?.role?.role_name ||
          userData.user?.role ||
          "USER"

        setUser({ ...userData.user, roleName })
      }

      router.push("/")
    } catch (error) {
      console.error("Registration error:", error)
      setError(error instanceof Error ? error.message : "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Logout
  const logout = async () => {
    setLoading(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      setError(null)
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
      setError("Logout failed, please try again")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
