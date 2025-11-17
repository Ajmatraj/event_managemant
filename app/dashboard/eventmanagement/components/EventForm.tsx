"use client"

import { useState, useEffect, type FormEvent, type ChangeEvent } from "react"
import type { Event, Category } from "../page"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/context/auth-context"

interface EventFormProps {
  event?: Event | null
  categories: Category[]
  onCancel: () => void
}

export function EventForm({ event, categories, onCancel }: EventFormProps) {
  const { user } = useAuth()
  const userId = user?.id

  const [formData, setFormData] = useState({
    organizerId: userId,
    categoryId: "",
    title: "",
    description: "",
    eventType: "",
    location: "",
    startDate: "",
    endDate: "",
    capacity: 0,
    status: "UPCOMING",
  })

  const [bannerImage, setBannerImage] = useState<File | null>(null)
  const [promoVideo, setPromoVideo] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ✅ If editing existing event, pre-fill form
  useEffect(() => {
    if (event) {
      setFormData({
        organizerId: event.organizerId,
        categoryId: event.categoryId,
        title: event.title,
        description: event.description,
        eventType: event.eventType,
        location: event.location,
        startDate: event.startDate,
        endDate: event.endDate,
        capacity: event.capacity,
        status: event.status,
      })
      if (event.bannerImage) setBannerPreview(event.bannerImage)
      if (event.promoVideo) setVideoPreview(event.promoVideo)
    }
  }, [event])

  // ✅ Automatically set organizer ID from logged-in user
  useEffect(() => {
    if (user?.id && !event) {
      setFormData((prev) => ({ ...prev, organizerId: user.id }))
    }
  }, [user?.id, event])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target
    if (files && files[0]) {
      const file = files[0]
      if (name === "bannerImage") {
        setBannerImage(file)
        setBannerPreview(URL.createObjectURL(file))
        console.log("📸 Selected banner image:", file.name)
      } else if (name === "promoVideo") {
        setPromoVideo(file)
        setVideoPreview(URL.createObjectURL(file))
        console.log("🎥 Selected promo video:", file.name)
      }
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("🟡 Submitting event form...")
    setIsSubmitting(true)

    try {
      const data = new FormData()

      // ✅ Match backend naming (snake_case)
      data.append("organizer_id", formData.organizerId || "")
      data.append("category_id", formData.categoryId || "")
      data.append("title", formData.title)
      data.append("description", formData.description)
      data.append("event_type", formData.eventType)
      data.append("location", formData.location)
      data.append("start_date", formData.startDate)
      data.append("end_date", formData.endDate)
      data.append("capacity", formData.capacity.toString())
      data.append("status", formData.status)

      if (bannerImage) data.append("bannerImage", bannerImage)
      if (promoVideo) data.append("promoVideo", promoVideo)

      console.log("✅ Final FormData before submission:", Object.fromEntries(data.entries()))

      const method = event ? "PUT" : "POST"
      const url = event ? `http://localhost:3000/api/events/${event.id}` : "http://localhost:3000/api/events"

      const response = await fetch(url, {
        method,
        body: data,
      })

      if (!response.ok) {
        const errText = await response.text()
        console.error("❌ Failed to submit event:", errText)
        alert(`Error submitting event: ${errText}`)
        return
      }

      const result = await response.json()
      console.log("✅ Event submitted successfully:", result)
      alert(event ? "🎉 Event updated successfully!" : "🎉 Event created successfully!")

      // Reset form
      setBannerImage(null)
      setPromoVideo(null)
      setBannerPreview(null)
      setVideoPreview(null)
      setFormData({
        organizerId: userId,
        categoryId: "",
        title: "",
        description: "",
        eventType: "",
        location: "",
        startDate: "",
        endDate: "",
        capacity: 0,
        status: "UPCOMING",
      })

      onCancel()
    } catch (error) {
      console.error("🔥 Error submitting form:", error)
      alert("Something went wrong while submitting the event.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Event Title *</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter event title"
            required
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="categoryId">Category *</Label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Event Type */}
        <div className="space-y-2">
          <Label htmlFor="eventType">Event Type *</Label>
          <Input
            id="eventType"
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            placeholder="e.g., Concert, Conference"
            required
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter event location"
            required
          />
        </div>

        {/* Dates */}
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            name="startDate"
            type="datetime-local"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date *</Label>
          <Input
            id="endDate"
            name="endDate"
            type="datetime-local"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>

        {/* Capacity */}
        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity *</Label>
          <Input
            id="capacity"
            name="capacity"
            type="number"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="Enter event capacity"
            required
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
          >
            <option value="UPCOMING">Upcoming</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Organizer ID */}
        <div className="space-y-2">
          <Label htmlFor="organizerId">Organizer ID</Label>
          <Input
            id="organizerId"
            name="organizerId"
            value={formData.organizerId}
            disabled
            className="bg-muted text-muted-foreground cursor-not-allowed"
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter event description"
          rows={4}
          required
        />
      </div>

      {/* Banner Image Upload */}
      <div className="space-y-2">
        <Label htmlFor="bannerImage">Banner Image *</Label>
        <Input id="bannerImage" name="bannerImage" type="file" accept="image/*" onChange={handleFileChange} />
        {bannerPreview && (
          <img
            src={bannerPreview || "/placeholder.svg"}
            alt="Banner Preview"
            className="mt-2 w-full max-w-sm rounded-lg shadow-md"
          />
        )}
      </div>

      {/* Promo Video Upload */}
      <div className="space-y-2">
        <Label htmlFor="promoVideo">Promo Video</Label>
        <Input id="promoVideo" name="promoVideo" type="file" accept="video/*" onChange={handleFileChange} />
        {videoPreview && <video src={videoPreview} controls className="mt-2 w-full max-w-sm rounded-lg shadow-md" />}
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : event ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </form>
  )
}
