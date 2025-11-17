"use client"

import type React from "react"

import { useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Loader2, Upload, User, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

interface AvatarUploadProps {
  currentAvatarUrl?: string | null
  onUploadComplete?: (url: string) => void
  className?: string
}

export function AvatarUpload({ currentAvatarUrl = null, onUploadComplete, className }: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentAvatarUrl)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset input for consecutive uploads of same file
    if (fileInputRef.current) fileInputRef.current.value = ""

    // File validations
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file only.",
        variant: "destructive",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "File size should be less than 5MB.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", {
        method: "POST", // Changed from PUT to POST to match the API route
        body: formData,
        credentials: "include",
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Upload failed")
      }

      setAvatarUrl(data.url)
      onUploadComplete?.(data.url)

      toast({
        title: "Upload Successful",
        description: "Your avatar has been uploaded.",
      })
    } catch (err) {
      console.error("Upload failed:", err)
      toast({
        title: "Upload Failed",
        description: err instanceof Error ? err.message : "An unknown error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const removeAvatar = () => {
    setAvatarUrl(null)
    onUploadComplete?.("")
    toast({
      title: "Avatar Removed",
      description: "Your profile picture has been removed.",
    })
  }

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <input ref={fileInputRef} type="file" onChange={handleFileChange} accept="image/*" className="hidden" />

      <div className="relative">
        <div
          className={cn(
            "w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center",
            isUploading && "opacity-50",
          )}
        >
          {avatarUrl ? (
            <Image
              src={avatarUrl || "/placeholder.svg"}
              alt="Avatar"
              fill
              className="object-cover"
              onError={() => setAvatarUrl(null)}
            />
          ) : (
            <User className="w-12 h-12 text-muted-foreground" />
          )}
        </div>

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {avatarUrl && !isUploading && (
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={removeAvatar}
          >
            <X className="w-3 h-3" />
            <span className="sr-only">Remove avatar</span>
          </Button>
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        aria-busy={isUploading}
        className="flex items-center gap-2"
      >
        <Upload className="w-4 h-4" />
        {avatarUrl ? "Change Avatar" : "Upload Avatar"}
      </Button>
    </div>
  )
}

