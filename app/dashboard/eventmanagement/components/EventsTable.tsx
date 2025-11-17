"use client"

import type { Event } from "../page"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, Calendar, MapPin, Eye, ImageIcon, Video, Ticket } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface EventsTableProps {
  events: Event[]
  onEdit: (event: Event) => void
  onDelete: (id: string) => void
  onView: (event: Event) => void
  onManageTickets: (event: Event) => void
}

const statusColors: Record<string, string> = {
  UPCOMING: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  ONGOING: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  COMPLETED: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}

export function EventsTable({ events, onEdit, onDelete, onView, onManageTickets }: EventsTableProps) {
  if (events.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center shadow-lg">
        <p className="text-muted-foreground text-lg">No events found. Create your first event to get started!</p>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Image</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Event Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Description</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Location</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date Range</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Capacity</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Media</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Tickets</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                    {event.bannerImage ? (
                      <img
                        src={event.bannerImage || "/placeholder.svg"}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">{event.title}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-muted-foreground max-w-xs line-clamp-2">{event.description}</div>
                </td>
                <td className="px-6 py-4 text-sm text-foreground">{event.eventType}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <div>{formatDate(event.startDate)}</div>
                      <div className="text-xs text-muted-foreground">{formatDate(event.endDate)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-foreground">{event.capacity}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[event.status] || "bg-gray-100 text-gray-800"}`}
                  >
                    {event.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {event.bannerImage && (
                      <div className="flex items-center gap-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                        <ImageIcon className="w-3 h-3" />
                        Image
                      </div>
                    )}
                    {event.promoVideo && (
                      <div className="flex items-center gap-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                        <Video className="w-3 h-3" />
                        Video
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onManageTickets(event)}
                    className="gap-1"
                    title="Manage ticket types"
                  >
                    <Ticket className="w-4 h-4" />
                    Tickets
                  </Button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onView(event)}
                      className="gap-1"
                      title="View event details"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(event)}
                      className="gap-1"
                      title="Edit event"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(event.id)}
                      className="gap-1"
                      title="Delete event"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
