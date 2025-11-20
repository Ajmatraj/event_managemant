'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import PaymentConfirmation from './components/PaymentConfirmation'
import ESewaPaymentForm from './components/ESewaPaymentForm'
import KhaltiPaymentForm from './components/KhaltiPaymentForm'
import CardPaymentForm from './components/CardPaymentForm'
import FonePayPaymentForm from './components/FonePayPaymentForm'

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [ticketData, setTicketData] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  useEffect(() => {
    const method = searchParams.get('method')
    const ticketParam = searchParams.get('ticket')
    
    console.log("[v0] Payment page - method:", method)
    console.log("[v0] Payment page - ticket param received:", !!ticketParam)

    if (method) {
      setSelectedMethod(method)
    }

    if (ticketParam) {
      try {
        const decodedTicket = JSON.parse(decodeURIComponent(ticketParam))
        console.log("[v0] Payment page - decoded ticket:", decodedTicket)
        setTicketData(decodedTicket)
      } catch (error) {
        console.error("[v0] Error parsing ticket data:", error)
      }
    }
  }, [searchParams])

  if (!ticketData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="bg-slate-800 border-slate-700 p-8">
          <p className="text-slate-400">Loading payment details...</p>
        </Card>
      </div>
    )
  }

  const paymentMethods = [
    { id: 'esewa', name: 'E-Sewa', icon: '💳', description: 'Pay with E-Sewa wallet' },
    { id: 'khalti', name: 'Khalti', icon: '📱', description: 'Pay with Khalti app' },
    { id: 'card', name: 'Card', icon: '💰', description: 'Credit/Debit card payment' },
    { id: 'fonepay', name: 'FonePay', icon: '📞', description: 'Pay via FonePay' }
  ]

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case 'esewa':
        return <ESewaPaymentForm ticketData={ticketData} />
      case 'khalti':
        return <KhaltiPaymentForm ticketData={ticketData} />
      case 'card':
        return <CardPaymentForm ticketData={ticketData} />
      case 'fonepay':
        return <FonePayPaymentForm ticketData={ticketData} />
      default:
        return null
    }
  }

  if (selectedMethod && !showConfirmation) {
    return (
      <PaymentConfirmation
        ticketData={ticketData}
        selectedMethod={selectedMethod}
        onConfirm={() => setShowConfirmation(true)}
        onBack={() => setSelectedMethod(null)}
      />
    )
  }

  if (!selectedMethod) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              onClick={() => router.back()}
              variant="ghost"
              className="text-slate-400 hover:text-white mb-6"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back
            </Button>
            <h1 className="text-4xl font-bold text-white mb-2">Complete Payment</h1>
            <p className="text-slate-400">Select your preferred payment method</p>
          </div>

          {/* Order Summary */}
          <Card className="bg-slate-700 border-slate-600 p-6 mb-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Event</span>
                <span className="text-white font-semibold">{ticketData.eventTitle}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Ticket Type</span>
                <span className="text-white font-semibold">{ticketData.ticketType}</span>
              </div>
              <div className="border-t border-slate-600 pt-4 flex justify-between items-center">
                <span className="text-slate-300 font-semibold">Total Amount</span>
                <span className="text-2xl font-bold text-blue-400">₹{ticketData.amount.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* Payment Methods Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className="p-6 rounded-lg border-2 border-slate-600 bg-slate-700 hover:border-blue-400 hover:bg-slate-700/80 transition-all text-left group"
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl group-hover:scale-110 transition-transform">{method.icon}</span>
                  <div>
                    <p className="text-white font-semibold text-lg">{method.name}</p>
                    <p className="text-slate-400 text-sm">{method.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <p className="text-slate-400 text-center text-sm">
            Your payment information is secure and encrypted
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => {
              setShowConfirmation(false)
              setSelectedMethod(null)
            }}
            variant="ghost"
            className="text-slate-400 hover:text-white mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Payment Methods
          </Button>
          <h1 className="text-4xl font-bold text-white mb-2">
            {paymentMethods.find(m => m.id === selectedMethod)?.name} Payment
          </h1>
          <p className="text-slate-400">Amount: ₹{ticketData.amount.toFixed(2)}</p>
        </div>

        {/* Payment Form */}
        {renderPaymentForm()}
      </div>
    </div>
  )
}
