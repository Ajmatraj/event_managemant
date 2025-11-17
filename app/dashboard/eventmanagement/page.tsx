"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { EventForm } from "./components/EventForm"
import { EventsTable } from "./components/EventsTable"
import { EventFilters } from "./components/EventFilters"
import { ViewEventDialog, DeleteEventDialog } from "./components/EventDialogs"
import { TicketsManagement } from "./components/TicketsManagement" 
import { toast, ToastContainer } from "react-toastify"

export interface Event {
  id: string
  organizerId: string
  categoryId: string
  title: string
  description: string
  eventType: string
  location: string
  startDate: string
  endDate: string
  capacity: number
  status: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED"
  bannerImage?: string
  promoVideo?: string
  createdAt: string
}

export interface Category {
  id: string
  name: string
  description: string
}

export default function EventManagementPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null)
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null)
  const [filters, setFilters] = useState({
    status: "ALL",
    eventType: "ALL",
    searchTerm: "",
  })
  const [selectedEventForTickets, setSelectedEventForTickets] = useState<Event | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/category")
        if (response.ok) {
          const data = await response.json()
          setCategories(data.categories || [])
          console.log(" Categories fetched:", data.categories)
        }
      } catch (error) {
        console.error(" Error fetching categories:", error)
      } finally {
        setLoadingCategories(false)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchEventsData()
  }, [])

  const fetchEventsData = async () => {
    setLoadingEvents(true)
    try {
      const response = await fetch("http://localhost:3000/api/events/")
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events || [])
        console.log(" Events fetched:", data.events)
      }
    } catch (error) {
      console.error(" Error fetching events:", error)
    } finally {
      setLoadingEvents(false)
    }
  }

  const handleAddEvent = async (newEvent: Omit<Event, "id" | "createdAt">) => {
    await fetchEventsData()
    setShowForm(false)
    toast.success("Event created successfully")
  }

  const handleUpdateEvent = async (updatedEvent: Event) => {
    setLoadingEvents(true)
    try {
      const response = await fetch(`http://localhost:3000/api/events/${updatedEvent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEvent),
      })

      if (!response.ok) {
        const data = await response.text()
        console.log("failed to update event")
        return
      }

      const result = await response.json()
    toast.success("Event updated successfully!")
      await fetchEventsData()
      setEditingEvent(null)
      setShowForm(false)
    } catch (error) {
      toast.error(" Error updating event:")
    } finally {
      setLoadingEvents(false)
    }
  }

  const handleDeleteEvent = (id: string) => {
    const eventToDelete = events.find((e) => e.id === id)
    if (eventToDelete) {
      setDeletingEvent(eventToDelete)
    }
  }

  const handleConfirmDelete = async () => {
    if (deletingEvent) {
      setLoadingEvents(true)
      try {
        const response = await fetch(`http://localhost:3000/api/events/${deletingEvent.id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const data = await response.text()
          toast.error(" Failed to delete event:")
          return
        }

        toast.success("Event deleted successfully")
        setEvents(events.filter((e) => e.id !== deletingEvent.id))
        setDeletingEvent(null)
      } catch (error) {
        toast.error(" Error deleting event:")
      } finally {
        setLoadingEvents(false)
      }
    }
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setShowForm(true)
  }

  const handleViewEvent = (event: Event) => {
    setViewingEvent(event)
  }

  const filteredEvents = events.filter((event) => {
    const matchesStatus = filters.status === "ALL" || event.status === filters.status
    const matchesType = filters.eventType === "ALL" || event.eventType === filters.eventType
    const matchesSearch =
      event.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(filters.searchTerm.toLowerCase())
    return matchesStatus && matchesType && matchesSearch
  })

  if (loadingEvents || loadingCategories) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <>
    <ToastContainer />
    <main className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Event Management</h1>
            <p className="text-muted-foreground mt-1">Manage and create events for your platform</p>
          </div>
          <Button
            onClick={() => {
              setEditingEvent(null)
              setShowForm(!showForm)
            }}
            className="gap-2 bg-primary hover:bg-primary-dark"
          >
            <Plus className="w-4 h-4" />
            {showForm ? "Close" : "Add Event"}
          </Button>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
            <EventForm
              event={editingEvent}
              categories={categories}
              onSubmit={editingEvent ? handleUpdateEvent : handleAddEvent}
              onCancel={() => {
                setShowForm(false)
                setEditingEvent(null)
              }}
            />
          </div>
        )}

        {/* Filters Section */}
        <EventFilters filters={filters} onFiltersChange={setFilters} categories={categories} />

        {/* Events Table */}
        {selectedEventForTickets && (
          <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Manage Tickets</h2>
                <p className="text-muted-foreground text-sm">Event: {selectedEventForTickets.title}</p>
              </div>
              <Button variant="outline" onClick={() => setSelectedEventForTickets(null)}>
                Close
              </Button>
            </div>
            <TicketsManagement eventId={selectedEventForTickets.id} eventTitle={selectedEventForTickets.title} />
          </div>
        )}

        {!selectedEventForTickets && (
          <EventsTable
            events={filteredEvents}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
            onView={handleViewEvent}
            onManageTickets={setSelectedEventForTickets}
          />
        )}

        {/* Dialogs */}
        <ViewEventDialog open={!!viewingEvent} event={viewingEvent} onClose={() => setViewingEvent(null)} />
        <DeleteEventDialog
          open={!!deletingEvent}
          event={deletingEvent}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingEvent(null)}
        />
      </div>
    </main>
    </>
  )
}
