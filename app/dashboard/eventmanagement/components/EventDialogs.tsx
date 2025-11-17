"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ImageIcon, Video } from "lucide-react"
import type { Event } from "../page"

interface ViewEventDialogProps {
  open: boolean
  event: Event | null
  onClose: () => void
}

export function ViewEventDialog({ open, event, onClose }: ViewEventDialogProps) {
  if (!event) return null

  const bannerImageUrl = typeof event.bannerImage === "string" ? event.bannerImage : event.bannerImage?.image_url

  const promoVideoUrl = typeof event.promoVideo === "string" ? event.promoVideo : event.promoVideo?.video_url

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-full sm:w-[90vw] md:w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl text-pretty">{event.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {bannerImageUrl && (
            <div className="w-full h-auto rounded-lg overflow-hidden border border-border">
              <img
                src={bannerImageUrl || "/placeholder.svg"}
                alt={event.title}
                className="w-full h-auto object-cover max-h-64"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-xs sm:text-sm text-muted-foreground">Category</p>
              <p className="font-medium text-sm sm:text-base text-foreground">
                {event.category?.name || event.eventType}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm text-muted-foreground">Status</p>
              <p className="font-medium text-sm sm:text-base text-foreground">{event.status}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm text-muted-foreground">Location</p>
              <p className="font-medium text-sm sm:text-base text-foreground">{event.location}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm text-muted-foreground">Capacity</p>
              <p className="font-medium text-sm sm:text-base text-foreground">{event.capacity} attendees</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm text-muted-foreground">Start Date</p>
              <p className="font-medium text-sm sm:text-base text-foreground">
                {new Date(event.startDate).toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm text-muted-foreground">End Date</p>
              <p className="font-medium text-sm sm:text-base text-foreground">
                {new Date(event.endDate).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs sm:text-sm text-muted-foreground">Description</p>
              <p className="font-medium text-sm sm:text-base text-foreground whitespace-pre-wrap break-words">
                {event.description}
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground">Organizer Information</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="font-medium text-sm text-foreground">{event.organizer?.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium text-sm text-foreground break-words">{event.organizer?.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Organizer ID</p>
                  <p className="font-medium text-sm text-foreground font-mono break-words">{event.organizerId}</p>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground">Media Attachments</p>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex flex-col items-start gap-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <ImageIcon className="w-4 h-4" />
                    <span>Banner Image</span>
                  </div>
                  {bannerImageUrl ? (
                    <img
                      src={bannerImageUrl || "/placeholder.svg"}
                      alt="Banner"
                      className="rounded-md border border-border w-32 h-24 object-cover"
                    />
                  ) : (
                    <span className="text-muted-foreground text-sm">No Banner Image</span>
                  )}
                </div>

                <div className="flex flex-col items-start gap-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Video className="w-4 h-4" />
                    <span>Promo Video</span>
                  </div>
                  {promoVideoUrl ? (
                    <video src={promoVideoUrl} controls className="rounded-md border border-border w-40 h-auto" />
                  ) : (
                    <span className="text-muted-foreground text-sm">No Promo Video</span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground">Additional Information</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Event ID</p>
                  <p className="font-medium text-sm text-foreground font-mono break-words">{event.id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Created At</p>
                  <p className="font-medium text-sm text-foreground">{new Date(event.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface DeleteEventDialogProps {
  open: boolean
  event: Event | null
  isLoading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteEventDialog({ open, event, isLoading = false, onConfirm, onCancel }: DeleteEventDialogProps) {
  if (!event) return null

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Delete Event?
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-foreground">
            Are you sure you want to delete <span className="font-semibold">"{event.title}"</span>? This action cannot
            be undone.
          </p>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
