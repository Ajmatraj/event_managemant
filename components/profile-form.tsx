"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Upload, AlertCircle, CheckCircle2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string
  email: string
  avatar?: string | null
  role?: string
}

interface ProfileFormProps {
  user: User
  onSuccess?: (updatedUser: User) => void
}

export function ProfileForm({ user, onSuccess }: ProfileFormProps) {
  const [name, setName] = useState(user.name)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar || null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Reset form when user changes
  useEffect(() => {
    setName(user.name)
    setAvatarPreview(user.avatar || null)
    setAvatarFile(null)
    setError(null)
    setSuccess(false)
  }, [user])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB")
      return
    }

    // Create a preview URL for the selected image
    const previewUrl = URL.createObjectURL(file)
    setAvatarPreview(previewUrl)
    setAvatarFile(file)
    setError(null)
  }

  const handleRemoveAvatar = () => {
    setAvatarPreview(null)
    setAvatarFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!name.trim()) {
      setError("Name is required")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const formData = new FormData()
      formData.append("name", name.trim())

      // Handle avatar changes
      if (avatarFile) {
        formData.append("avatar", avatarFile)
      } else if (avatarPreview === null && user.avatar) {
        // User removed their avatar
        formData.append("removeAvatar", "true")
      }

      const res = await fetch("/api/user/update", {
        method: "PUT",
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to update profile")
      }

      const updatedUser = await res.json()

      setSuccess(true)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
        // variant: "success",
      })

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(updatedUser)
      }

      router.refresh()
    } catch (error) {
      console.error("Update profile error:", error)
      setError(error instanceof Error ? error.message : "Failed to update profile")
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const hasChanges = name !== user.name || avatarFile !== null || (avatarPreview === null && user.avatar !== null)

  return (
    <Card className="max-w-md w-full">
      <CardHeader>
        <CardTitle>Update Profile</CardTitle>
        <CardDescription>Change your profile information and avatar</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} aria-label="Profile update form">
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Profile updated successfully!</AlertDescription>
            </Alert>
          )}

          {/* Avatar upload section */}
          <div className="flex flex-col items-center space-y-4">
            <div
              className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100"
              aria-label="Profile avatar"
            >
              {avatarPreview ? (
                <Image
                  src={avatarPreview || "/placeholder.svg"}
                  alt="Profile avatar"
                  fill
                  className="object-cover"
                  sizes="96px"
                  priority
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No Image</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Upload avatar"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Avatar
              </Button>
              {avatarPreview && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveAvatar}
                  aria-label="Remove avatar"
                >
                  Remove
                </Button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                aria-label="Avatar file upload"
              />
            </div>
            <p className="text-xs text-muted-foreground">Supported formats: JPEG, PNG, GIF, WebP. Max size: 5MB</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={50}
              aria-describedby="name-description"
            />
            <p id="name-description" className="text-xs text-muted-foreground">
              Your display name (maximum 50 characters)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user.email} disabled aria-describedby="email-description" />
            <p id="email-description" className="text-xs text-muted-foreground">
              Email cannot be changed
            </p>
          </div>

          {user.role && (
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" value={user.role} disabled />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setName(user.name)
              setAvatarPreview(user.avatar || null)
              setAvatarFile(null)
              setError(null)
              setSuccess(false)
            }}
            disabled={loading || !hasChanges}
          >
            Reset
          </Button>
          <Button type="submit" disabled={loading || !hasChanges} aria-busy={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Profile"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

