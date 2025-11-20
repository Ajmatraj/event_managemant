'use client'

import { useState, useEffect } from 'react'
import { Calendar, MapPin, Ticket, Eye, Download } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function TicketBookingsSection({ onSelectTicket }) {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUserTickets()
  }, [])

  const fetchUserTickets = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3000/api/ticket/user')
      const data = await response.json()
      
      if (data.tickets) {
        console.log('[v0] Tickets fetched:', data.tickets)
        setTickets(data.tickets)
      }
    } catch (err) {
      console.error('[v0] Error fetching tickets:', err)
      setError('Failed to load tickets')
    } finally {
      setLoading(false)
    }
  }

  const getPaymentStatusBadge = (paymentStatus: string) => {
    if (paymentStatus === 'COMPLETED' || paymentStatus === 'SUCCESS') {
      return {
        variant: 'bg-green-500/20 text-green-400',
        label: 'Paid'
      }
    }
    return {
      variant: 'bg-yellow-500/20 text-yellow-400',
      label: 'Pending Payment'
    }
  }

  const getStatusColor = (status) => {
    return status === 'VALID' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">Loading tickets...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">My Tickets</h2>
        <p className="text-slate-400">You have {tickets.length} booked ticket{tickets.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tickets.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700 p-8 text-center">
            <p className="text-slate-400">No tickets booked yet. Browse events to get started!</p>
          </Card>
        ) : (
          tickets.map((ticket) => {
            const paymentBadge = getPaymentStatusBadge(ticket.payment?.payment_status)
            
            return (
              <Card key={ticket.id} className="bg-slate-800 border-slate-700 overflow-hidden hover:border-blue-500 transition-colors">
                <div className="flex flex-col md:flex-row gap-4 p-6">
                  {/* Ticket Image */}
                  <div className="flex-shrink-0 w-full md:w-48">
                    <img
                      src={ticket.event?.bannerImage?.image_url || "/placeholder.svg"}
                      alt={ticket.event?.title}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>

                  {/* Ticket Details */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">{ticket.event?.title}</h3>
                        
                        <div className="space-y-2 text-slate-300 text-sm mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-blue-400" />
                            {formatDate(ticket.event?.start_date)} to {formatDate(ticket.event?.end_date)}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-blue-400" />
                            {ticket.event?.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <Ticket size={16} className="text-blue-400" />
                            {ticket.type?.name} - ₹{ticket.type?.price}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status}
                          </Badge>
                          <Badge className={paymentBadge.variant}>
                            {paymentBadge.label}
                          </Badge>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 md:w-40">
                        <Button
                          onClick={() => onSelectTicket(ticket)}
                          className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                        >
                          <Eye size={16} className="mr-2" />
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          className="bg-slate-700 hover:bg-slate-600 border-slate-600 text-white w-full"
                        >
                          <Download size={16} className="mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
