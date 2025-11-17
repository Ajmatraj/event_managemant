'use client'

import { useState } from 'react'
import { X, Download, Share2, Wallet, CreditCard, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function TicketDetailModal({ ticket, onClose }) {
  const [showPaymentOptions, setShowPaymentOptions] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)

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

  const handlePayment = (method) => {
    setSelectedPaymentMethod(method)
    console.log('[v0] Payment method selected:', method)
    // TODO: Integrate with payment gateway
  }

  const paymentMethods = [
    { id: 'esewa', name: 'E-Sewa', icon: '₹' },
    { id: 'khalti', name: 'Khalti', icon: '💳' },
    { id: 'card', name: 'Credit/Debit Card', icon: '🏦' },
    { id: 'fonepay', name: 'FonePay', icon: '📱' }
  ]

  const needsPayment = !ticket.payment || ticket.payment.payment_status === 'PENDING'

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-slate-800 border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
              src={ticket.event?.bannerImage?.image_url || "/placeholder.svg"}
              alt={ticket.event?.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{ticket.event?.title}</h2>
              <div className="flex flex-wrap gap-3">
                <Badge className={ticket.status === 'VALID' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                  {ticket.status}
                </Badge>
                <Badge className={ticket.payment?.payment_status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                  {ticket.payment?.payment_status || 'UNPAID'}
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400">
                  Issued on {formatDate(ticket.issue_date)}
                </Badge>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="bg-slate-700 rounded-lg p-8 flex flex-col items-center">
              <p className="text-slate-400 text-sm mb-4">Your Ticket QR Code</p>
              <div className="w-64 h-64 bg-white p-4 rounded-lg flex items-center justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${ticket.qr_code}`}
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
                  {formatDate(ticket.event?.start_date)}
                </p>
                {ticket.event?.end_date && (
                  <p className="text-slate-300 text-sm mt-1">
                    to {formatDate(ticket.event?.end_date)}
                  </p>
                )}
              </div>

              <div className="bg-slate-700 rounded-lg p-6">
                <p className="text-slate-400 text-sm mb-2">Location</p>
                <p className="text-white font-semibold text-lg">
                  {ticket.event?.location}
                </p>
              </div>

              <div className="bg-slate-700 rounded-lg p-6">
                <p className="text-slate-400 text-sm mb-2">Ticket Type</p>
                <p className="text-white font-semibold text-lg">
                  {ticket.type?.name}
                </p>
                <p className="text-slate-300 text-sm mt-1">{ticket.type?.description}</p>
              </div>

              <div className="bg-slate-700 rounded-lg p-6">
                <p className="text-slate-400 text-sm mb-2">Price</p>
                <p className="text-white font-semibold text-lg">
                  ₹{ticket.type?.price || ticket.payment?.amount || 0}
                </p>
                <p className="text-slate-300 text-sm mt-1">
                  Payment Method: {ticket.payment?.payment_method || 'N/A'}
                </p>
              </div>
            </div>

            {/* Ticket ID */}
            <div className="bg-slate-700 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-2">Ticket ID</p>
              <p className="text-white font-mono text-sm break-all">
                {ticket.id}
              </p>
            </div>

            {needsPayment && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <CreditCard size={18} />
                  Complete Payment
                </h3>
                
                {!showPaymentOptions ? (
                  <Button
                    onClick={() => setShowPaymentOptions(true)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white w-full"
                  >
                    <CreditCard size={18} className="mr-2" />
                    Pay ₹{ticket.payment?.amount || ticket.type?.price || 0} Now
                  </Button>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => handlePayment(method.id)}
                        className="p-4 bg-slate-700 hover:bg-slate-600 rounded-lg border-2 border-slate-600 hover:border-blue-500 transition-colors text-left"
                      >
                        <p className="text-white font-semibold flex items-center gap-2">
                          <span className="text-2xl">{method.icon}</span>
                          {method.name}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {ticket.payment?.payment_status === 'COMPLETED' && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                <p className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                  ✓ Payment Completed
                </p>
                <p className="text-slate-300 text-sm">
                  Payment of ₹{ticket.payment?.amount} was processed on {formatDate(ticket.payment?.payment_date)} via {ticket.payment?.payment_method}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4 pt-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
                <Download size={18} className="mr-2" />
                Download Ticket (PDF)
              </Button>
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
