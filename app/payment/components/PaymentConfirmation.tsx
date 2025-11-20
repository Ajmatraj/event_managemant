'use client'

import { ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PaymentConfirmationProps {
  ticketData: {
    ticketId: string
    eventTitle: string
    ticketType: string
    amount: number
    bannerImage?: string
  }
  selectedMethod: string
  onConfirm: () => void
  onBack: () => void
}

export default function PaymentConfirmation({
  ticketData,
  selectedMethod,
  onConfirm,
  onBack
}: PaymentConfirmationProps) {
  const paymentMethods: Record<string, { name: string; icon: string; description: string }> = {
    esewa: { name: 'E-Sewa', icon: '💳', description: 'E-Sewa Wallet Payment' },
    khalti: { name: 'Khalti', icon: '📱', description: 'Khalti Mobile Wallet' },
    card: { name: 'Card', icon: '💰', description: 'Credit/Debit Card' },
    fonepay: { name: 'FonePay', icon: '📞', description: 'FonePay Payment' }
  }

  const method = paymentMethods[selectedMethod]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-slate-400 hover:text-white mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Payment Methods
          </Button>
          <h1 className="text-4xl font-bold text-white mb-2">Review & Confirm</h1>
          <p className="text-slate-400">Please verify your payment details before proceeding</p>
        </div>

        {/* Ticket Details Card */}
        <Card className="bg-slate-700 border-slate-600 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle size={20} className="text-blue-400" />
            Ticket Details
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-600">
              <span className="text-slate-300">Ticket ID</span>
              <span className="text-white font-mono text-sm">{ticketData.ticketId}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-600">
              <span className="text-slate-300">Event</span>
              <span className="text-white font-semibold">{ticketData.eventTitle}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-600">
              <span className="text-slate-300">Ticket Type</span>
              <span className="text-white font-semibold">{ticketData.ticketType}</span>
            </div>
            <div className="flex justify-between items-center pt-3">
              <span className="text-slate-300 font-semibold">Amount Due</span>
              <span className="text-3xl font-bold text-blue-400">₹{ticketData.amount.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        {/* Payment Method Card */}
        <Card className="bg-slate-700 border-slate-600 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle size={20} className="text-blue-400" />
            Payment Method
          </h2>
          <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-600">
            <span className="text-4xl">{method.icon}</span>
            <div className="flex-1">
              <p className="text-white font-semibold text-lg">{method.name}</p>
              <p className="text-slate-400 text-sm">{method.description}</p>
            </div>
            <Badge className="bg-blue-500/20 text-blue-300">Selected</Badge>
          </div>
        </Card>

        {/* Confirmation Message */}
        <Card className="bg-blue-500/10 border border-blue-500/30 p-6 mb-6">
          <p className="text-blue-300 text-sm">
            By clicking the button below, you authorize payment of <span className="font-bold">₹{ticketData.amount.toFixed(2)}</span> through <span className="font-bold">{method.name}</span>. You will be securely redirected to the payment gateway.
          </p>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1 bg-slate-700 hover:bg-slate-600 border-slate-600 text-white"
          >
            Change Method
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg py-6"
          >
            Process Payment
          </Button>
        </div>

        <p className="text-slate-400 text-xs text-center mt-6">
          Your payment information is secure and encrypted with SSL
        </p>
      </div>
    </div>
  )
}
