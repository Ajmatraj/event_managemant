'use client'

import React, { useEffect, useState } from "react"
import axios from "axios"
import { Event, TicketType } from "@/types/event"
import { EventDetailsInfo } from "./componets/EventDetailsInfo"
import { TicketTypesList } from "./componets/TicketTypesList"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useParams, useRouter } from "next/navigation"

const EventDetails = () => {
  const { id } = useParams()
  const route = useRouter()

  const [event, setEvent] = useState<Event | null>(null)
  const [tickets, setTickets] = useState<TicketType[]>([])
  const [loadingEvent, setLoadingEvent] = useState(true)
  const [loadingTickets, setLoadingTickets] = useState(true)

  useEffect(() => {
    if (!id) return

    const getEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/events/${id}`)
        console.log("Fetched Event:", res.data)
        // Normalize API response (snake_case) to frontend Event (camelCase)
        const raw = res.data.event || res.data
        const normalizeEvent = (e: any) => ({
          ...e,
          id: e.id,
          title: e.title,
          description: e.description,
          eventType: e.event_type || e.eventType,
          location: e.location,
          startDate: e.start_date || e.startDate,
          endDate: e.end_date || e.endDate,
          capacity: e.capacity,
          status: e.status,
          createdAt: e.created_at || e.createdAt,
          category: e.category,
          organizer: e.organizer,
          bannerImage: e.bannerImage || e.banner_image || null,
          bannerImageId: e.banner_image_id || e.bannerImageId || null,
          promoVideo: e.promoVideo || e.promo_video || null,
          promoVideoId: e.promo_video_id || e.promoVideoId || null,
        })

        setEvent(raw ? normalizeEvent(raw) : null)
      } catch (error) {
        console.error("Error fetching event:", error)
        setEvent(null)
      } finally {
        setLoadingEvent(false)
      }
    }

    const getTickets = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/ticket-types/event/${id}`)
        console.log("Fetched Tickets:", res.data)
        setTickets(res.data.ticketTypes || res.data || [])
      } catch (error) {
        console.error("Error fetching tickets:", error)
        setTickets([])
      } finally {
        setLoadingTickets(false)
      }
    }

    getEvent()
    getTickets()
  }, [id])

  // ----------------------
  // Loading State
  // ----------------------
  if (loadingEvent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-[400px] w-full rounded-xl" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
            <div>
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ----------------------
  // Not Found Handling
  // ----------------------
  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event not found</h1>
          <Button onClick={() => route.push("/event")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events
          </Button>
        </div>
      </div>
    )
  }

  // ----------------------
  // Page Content
  // ----------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">

        <Button
          variant="ghost"
          onClick={() => route.push("/event")}
          className="mb-6 hover:bg-primary/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <EventDetailsInfo event={event} />
          </div>

          <div>
            <TicketTypesList tickets={tickets} isLoading={loadingTickets} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetails
