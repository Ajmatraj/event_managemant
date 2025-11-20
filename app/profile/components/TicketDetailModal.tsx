'use client'

import { useState } from 'react'
import { X, Share2, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import TicketDownload from './TicketDownload' 
import TicketPaymentSection from './TicketPaymentSection' 

export default function TicketDetailModal({ ticket, onClose }) {
  const [ticketData, setTicketData] = useState(ticket)

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handlePaymentComplete = () => {
    setTicketData({
      ...ticketData,
      payment: {
        ...ticketData.payment,
        payment_status: 'COMPLETED'
      }
    })
  }

  const ticketStatus = ticketData.status === 'VALID' 
    ? { color: 'bg-green-500/20 text-green-400', label: 'VALID' }
    : { color: 'bg-red-500/20 text-red-400', label: 'INVALID' }

  const paymentStatus = ticketData.payment?.payment_status === 'COMPLETED' || ticketData.payment?.payment_status === 'SUCCESS'
    ? { color: 'bg-green-500/20 text-green-400', label: 'PAID' }
    : { color: 'bg-yellow-500/20 text-yellow-400', label: 'PENDING' }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-slate-800 border-slate-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-full z-10"
          >
            <X size={20} />
          </button>

          {/* Banner Image */}
          <div className="w-full h-64 bg-gradient-to-br from-blue-600 to-blue-800 overflow-hidden">
            <img
              src={ticketData.event?.bannerImage?.image_url || "/placeholder.svg"}
              alt={ticketData.event?.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-3">{ticketData.event?.title}</h2>
              <div className="flex flex-wrap gap-3">
                <Badge className={ticketStatus.color}>
                  {ticketStatus.label}
                </Badge>
                <Badge className={paymentStatus.color}>
                  {paymentStatus.label}
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400">
                  Issued on {formatDate(ticketData.issue_date)}
                </Badge>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="bg-slate-700 rounded-lg p-8 flex flex-col items-center">
              <p className="text-slate-400 text-sm mb-4">Your Ticket QR Code</p>
              <div className="w-64 h-64 bg-white p-4 rounded-lg flex items-center justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${ticketData.qr_code}`}
                  alt="QR Code"
                  className="w-full h-full"
                />
              </div>
              <p className="text-slate-400 text-xs mt-4 text-center">Show this QR code at the event entrance</p>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-700 rounded-lg p-6">
                <p className="text-slate-400 text-sm mb-2">Event Date & Time</p>
                <p className="text-white font-semibold text-lg">
                  {formatDate(ticketData.event?.start_date)}
                </p>
                {ticketData.event?.end_date && (
                  <p className="text-slate-300 text-sm mt-1">
                    to {formatDate(ticketData.event?.end_date)}
                  </p>
                )}
              </div>

              <div className="bg-slate-700 rounded-lg p-6">
                <p className="text-slate-400 text-sm mb-2">Location</p>
                <p className="text-white font-semibold text-lg">
                  {ticketData.event?.location}
                </p>
              </div>

              <div className="bg-slate-700 rounded-lg p-6">
                <p className="text-slate-400 text-sm mb-2">Ticket Type</p>
                <p className="text-white font-semibold text-lg">
                  {ticketData.type?.name}
                </p>
                <p className="text-slate-300 text-sm mt-1">{ticketData.type?.description}</p>
              </div>

              <div className="bg-slate-700 rounded-lg p-6">
                <p className="text-slate-400 text-sm mb-2">Price</p>
                <p className="text-white font-semibold text-lg">
                  ₹{ticketData.type?.price || ticketData.payment?.amount || 0}
                </p>
                <p className="text-slate-300 text-sm mt-1">
                  Payment Method: {ticketData.payment?.payment_method || 'N/A'}
                </p>
              </div>
            </div>

            {/* Ticket ID */}
            <div className="bg-slate-700 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-2">Ticket ID</p>
              <p className="text-white font-mono text-sm break-all">
                {ticketData.id}
              </p>
            </div>

            {/* Payment Section */}
            <TicketPaymentSection 
              ticket={ticketData} 
              onPaymentComplete={handlePaymentComplete}
            />

            {/* Download Section */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Download Ticket</h3>
              <TicketDownload ticket={ticketData} />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4 pt-4">
              <Button variant="outline" className="bg-slate-700 hover:bg-slate-600 border-slate-600 text-white flex-1">
                <Share2 size={18} className="mr-2" />
                Share Ticket
              </Button>
              <Button variant="outline" className="bg-slate-700 hover:bg-slate-600 border-slate-600 text-white flex-1">
                <Wallet size={18} className="mr-2" />
                Add to Wallet
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
