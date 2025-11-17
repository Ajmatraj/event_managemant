"use client"

import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Home, LogOut, User } from "lucide-react"
import Link from "next/link"

interface DashboardContentProps {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

export function DashboardContent({ user }: DashboardContentProps) {
  const { logout } = useAuth()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant="outline" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user.name}!</CardTitle>
          <CardDescription>You are logged in as {user.role.toLowerCase()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">Profile Information</span>
            </div>
            <div className="rounded-lg border p-4">
              <dl className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <dt className="font-medium text-muted-foreground">Name</dt>
                  <dd className="col-span-2">{user.name}</dd>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <dt className="font-medium text-muted-foreground">Email</dt>
                  <dd className="col-span-2">{user.email}</dd>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <dt className="font-medium text-muted-foreground">Role</dt>
                  <dd className="col-span-2 capitalize">{user.role.toLowerCase()}</dd>
                </div>
              </dl>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-row space-x-2 items-center justify-center">
            <Link href="/profile">
              <Button variant="outline">
               <Edit className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </Link>
            <Link href="/profile/addresses">
              <Button variant="outline">
               <Home className="mr-2 h-4 w-4" /> Manage Addresses
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

