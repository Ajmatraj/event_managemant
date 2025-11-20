'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Wallet, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface TicketPaymentSectionProps {
  ticket: {
    id: string
    event?: {
      title: string
      bannerImage?: {
        image_url: string
      }
    }
    type?: {
      price: number
      name: string
    }
    payment?: {
      id: string
      amount: number
      payment_method: string
      payment_status: string
      payment_date: string
    }
  }
  onPaymentComplete: () => void
}

type PaymentStep = 'selection' | 'method' | 'processing' | 'success'

export default function TicketPaymentSection({ ticket, onPaymentComplete }: TicketPaymentSectionProps) {
  const router = useRouter()
  const [step, setStep] = useState<PaymentStep>('selection')
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const paymentStatus = ticket.payment?.payment_status?.toUpperCase()
  const isPaid = paymentStatus === 'SUCCESS' || paymentStatus === 'COMPLETED'
  const amountDue = ticket.payment?.amount || ticket.type?.price || 0

  const paymentMethods = [
    { id: 'esewa', name: 'E-Sewa', icon: '💳', description: 'Pay with E-Sewa wallet' },
    { id: 'khalti', name: 'Khalti', icon: '📱', description: 'Pay with Khalti app' },
    { id: 'card', name: 'Card', icon: '💰', description: 'Credit/Debit card payment' },
    { id: 'fonepay', name: 'FonePay', icon: '📞', description: 'Pay via FonePay' }
  ]

  const handleSelectPaymentMethod = (methodId: string) => {
    const ticketData = encodeURIComponent(JSON.stringify({
      ticketId: ticket.id,
      eventTitle: ticket.event?.title,
      bannerImage: ticket.event?.bannerImage?.image_url,
      ticketType: ticket.type?.name,
      amount: amountDue,
    }))
    
    router.push(`/payment?method=${methodId}&ticket=${ticketData}`)
  }

  const handleBackToMethod = () => {
    setSelectedMethod(null)
    setStep('method')
    setIsProcessing(false)
  }

  const handleStartOver = () => {
    setSelectedMethod(null)
    setStep('selection')
    setIsProcessing(false)
  }

  // Step 1: Ticket selection with Pay Now button
  if (step === 'selection') {
    if (isPaid) {
      return (
        <div className="bg-slate-700 rounded-lg p-6 border border-green-500/30">
          <div className="flex items-start gap-4">
            <CheckCircle size={24} className="text-green-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">Payment Completed</h3>
              <p className="text-slate-300 mb-2">
                Your ticket payment has been successfully processed on{' '}
                <span className="font-semibold">
                  {new Date(ticket.payment?.payment_date || '').toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </p>
              <div className="flex gap-2 flex-wrap">
                <Badge className="bg-green-500/20 text-green-400">Amount: ₹{amountDue}</Badge>
                <Badge className="bg-slate-600 text-slate-200">
                  Method: {ticket.payment?.payment_method || 'N/A'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {/* Payment Status Alert */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-300 font-semibold">Payment Required</p>
            <p className="text-yellow-200/80 text-sm mt-1">
              Complete payment to access your ticket. Amount Due: <span className="font-bold">₹{amountDue}</span>
            </p>
          </div>
        </div>

        <Button 
          onClick={() => setStep('method')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold"
        >
          <Wallet size={20} className="mr-2" />
          Pay Now ₹{amountDue}
        </Button>
      </div>
    )
  }

  // Step 2: Payment method selection
  if (step === 'method') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Select Payment Method</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleStartOver}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => handleSelectPaymentMethod(method.id)}
              disabled={isProcessing}
              className="p-4 rounded-lg border-2 border-slate-600 bg-slate-700 hover:border-blue-400 transition-all text-left group"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl group-hover:scale-110 transition-transform">{method.icon}</span>
                <div>
                  <p className="text-white font-semibold text-base">{method.name}</p>
                  <p className="text-slate-400 text-xs">{method.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <p className="text-slate-400 text-xs text-center">
          Click on your preferred payment method to proceed
        </p>
      </div>
    )
  }

  // Step 3: Payment processing with loading spinner and redirect message
  if (step === 'processing') {
    return (
      <div className="space-y-6">
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <ArrowLeft size={24} className="text-blue-400 animate-spin" />
            <div>
              <p className="text-blue-300 font-semibold text-lg">Redirecting to Payment…</p>
              <p className="text-blue-200/80 text-sm mt-1">
                Connecting to {selectedMethod?.toUpperCase()} gateway
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-700 rounded-lg p-6">
          <p className="text-slate-400 text-sm mb-4 text-center">Your Ticket QR Code</p>
          <div className="w-40 h-40 bg-white p-3 rounded-lg flex items-center justify-center mx-auto">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.id}`}
              alt="Ticket QR Code"
              className="w-full h-full"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-700 border-slate-600 p-4">
              <p className="text-slate-400 text-xs mb-1">Event</p>
              <p className="text-white font-semibold">{ticket.event?.title}</p>
            </div>
            <div className="bg-slate-700 border-slate-600 p-4">
              <p className="text-slate-400 text-xs mb-1">Ticket Type</p>
              <p className="text-white font-semibold text-sm">{ticket.type?.name}</p>
            </div>
          </div>

          <div className="bg-slate-700 border-slate-600 p-4">
            <p className="text-slate-400 text-xs mb-1">Amount to Pay</p>
            <p className="text-white font-semibold text-sm">₹{amountDue}</p>
          </div>

          <div className="bg-slate-700 border-slate-600 p-4">
            <p className="text-slate-400 text-xs mb-1">Payment Method</p>
            <p className="text-white font-semibold">
              {paymentMethods.find(m => m.id === selectedMethod)?.name}
            </p>
          </div>
        </div>

        <p className="text-slate-400 text-xs text-center">
          Please do not close this window. You will be redirected to the payment gateway.
        </p>
      </div>
    )
  }

  // Step 4: Payment success page
  if (step === 'success') {
    return (
      <div className="space-y-6">
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-8 flex flex-col items-center gap-4">
          <div className="bg-green-500/20 p-4 rounded-full">
            <CheckCircle size={40} className="text-green-400" />
          </div>
          <div className="text-center">
            <p className="text-green-300 font-semibold text-xl">Payment Successful!</p>
            <p className="text-green-200/80 text-sm mt-1">
              Your ticket payment has been confirmed
            </p>
          </div>
        </div>

        <div className="bg-slate-700 rounded-lg p-6">
          <p className="text-slate-400 text-sm mb-4 text-center">Your Ticket QR Code</p>
          <div className="w-40 h-40 bg-white p-3 rounded-lg flex items-center justify-center mx-auto">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.id}`}
              alt="Ticket QR Code"
              className="w-full h-full"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-700 border-slate-600 p-4">
              <p className="text-slate-400 text-xs mb-1">Event</p>
              <p className="text-white font-semibold">{ticket.event?.title}</p>
            </div>
            <div className="bg-slate-700 border-slate-600 p-4">
              <p className="text-slate-400 text-xs mb-1">Ticket Type</p>
              <p className="text-white font-semibold text-sm">{ticket.type?.name}</p>
            </div>
          </div>

          <div className="bg-slate-700 border-slate-600 p-4">
            <p className="text-slate-400 text-xs mb-1">Amount Paid</p>
            <p className="text-white font-semibold text-sm">₹{amountDue}</p>
          </div>

          <div className="bg-slate-700 border-slate-600 p-4">
            <p className="text-slate-400 text-xs mb-1">Payment Method</p>
            <p className="text-white font-semibold">
              {paymentMethods.find(m => m.id === selectedMethod)?.name}
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={handleStartOver}
            className="flex-1 bg-slate-700 hover:bg-slate-600 border-slate-600 text-white"
          >
            Back to Tickets
          </Button>
          <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold">
            Download Ticket
          </Button>
        </div>

        <p className="text-slate-400 text-xs text-center">
          Redirecting to your tickets in a moment...
        </p>
      </div>
    )
  }
}
