"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit2, Trash2, Eye } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AlertTriangle } from 'lucide-react'

export interface TicketType {
  id: string
  event_id: string
  name: string
  description: string
  price: number
  quantity?: number
  available?: number
  createdAt?: string
}

interface TicketsManagementProps {
  eventId: string
  eventTitle: string
}

export function TicketsManagement({ eventId, eventTitle }: TicketsManagementProps) {
  const [tickets, setTickets] = useState<TicketType[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTicket, setEditingTicket] = useState<TicketType | null>(null)
  const [viewingTicket, setViewingTicket] = useState<TicketType | null>(null)
  const [deletingTicket, setDeletingTicket] = useState<TicketType | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
  })

  useEffect(() => {
    fetchTickets()
  }, [eventId])

  const fetchTickets = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:3000/api/ticket-types/event/${eventId}`)
      if (response.ok) {
        const data = await response.json()
        const fetchedTickets = data.ticketTypes || data.tickets || []
        setTickets(fetchedTickets)
        console.log("[v0] Tickets fetched:", fetchedTickets)
      }
    } catch (error) {
      console.error("[v0] Error fetching tickets:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) || 0 : value,
    }))
  }

  const handleAddTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = editingTicket
        ? `http://localhost:3000/api/ticket-types/${editingTicket.id}`
        : `http://localhost:3000/api/ticket-types/`

      const method = editingTicket ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: eventId,
          name: formData.name,
          description: formData.description,
          price: formData.price,
        }),
      })

      if (!response.ok) {
        alert("Failed to save ticket type")
        return
      }

      const result = await response.json()
      console.log("[v0] Ticket saved:", result)

      await fetchTickets()
      setShowForm(false)
      setEditingTicket(null)
      setFormData({ name: "", description: "", price: 0 })
    } catch (error) {
      console.error("[v0] Error saving ticket:", error)
      alert("Error saving ticket type")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteTicket = async () => {
    if (!deletingTicket) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`http://localhost:3000/api/ticket-types/${deletingTicket.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        alert("Failed to delete ticket type")
        return
      }

      console.log("[v0] Ticket deleted successfully")
      await fetchTickets()
      setDeletingTicket(null)
    } catch (error) {
      console.error("[v0] Error deleting ticket:", error)
      alert("Error deleting ticket type")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (ticket: TicketType) => {
    setEditingTicket(ticket)
    setFormData({
      name: ticket.name,
      description: ticket.description,
      price: ticket.price,
    })
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingTicket(null)
    setFormData({ name: "", description: "", price: 0 })
  }

  if (loading) {
    return <p className="text-muted-foreground">Loading tickets...</p>
  }

  return (
    <div className="space-y-6">
      {/* Add Ticket Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-foreground">Ticket Types for {eventTitle}</h3>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          {showForm ? "Cancel" : "Add Ticket Type"}
        </Button>
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-4">
          <form onSubmit={handleAddTicket} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Ticket Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., General Admission"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Ticket description"
                rows={2}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={handleCloseForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : editingTicket ? "Update Ticket" : "Create Ticket"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Tickets Table */}
      {tickets.length === 0 ? (
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <p className="text-muted-foreground">No ticket types created yet. Add one to get started!</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Ticket Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Description</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{ticket.name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{ticket.description || "—"}</td>
                    <td className="px-6 py-4 font-medium text-foreground">${ticket.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setViewingTicket(ticket)} className="gap-1">
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(ticket)} className="gap-1">
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeletingTicket(ticket)}
                          className="gap-1"
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
      )}

      {/* View Ticket Dialog */}
      <Dialog open={!!viewingTicket} onOpenChange={() => setViewingTicket(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{viewingTicket?.name}</DialogTitle>
          </DialogHeader>
          {viewingTicket && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-foreground">{viewingTicket.description || "No description provided"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-semibold text-foreground">${viewingTicket.price.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewingTicket(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Ticket Dialog */}
      <Dialog open={!!deletingTicket} onOpenChange={() => setDeletingTicket(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Delete Ticket Type?
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-foreground">
              Are you sure you want to delete the ticket type{" "}
              <span className="font-semibold">"{deletingTicket?.name}"</span>? This action cannot be undone.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeletingTicket(null)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTicket} disabled={isSubmitting}>
              {isSubmitting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
