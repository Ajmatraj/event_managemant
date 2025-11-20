'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface CardPaymentFormProps {
  ticketData: {
    ticketId: string
    amount: number
    ticketType: string
    eventTitle: string
  }
}

export default function CardPaymentForm({ ticketData }: CardPaymentFormProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsProcessing(true)

    try {
      const response = await fetch('/api/payment/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: ticketData.ticketId,
          amount: ticketData.amount,
          paymentMethod: 'card',
          cardDetails: {
            cardNumber: formData.cardNumber.slice(-4),
            cardName: formData.cardName
          },
          metadata: {
            ticketType: ticketData.ticketType,
            eventTitle: ticketData.eventTitle
          }
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Payment processing failed')
      }

      router.push(`/dashboard/payment/success?ticketId=${ticketData.ticketId}&transactionId=${data.transactionId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsProcessing(false)
    }
  }

  return (
    <Card className="bg-slate-700 border-slate-600 p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card Information */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-green-300 text-sm">
            <strong>Secure Payment:</strong> Your card details are encrypted and secure.
          </p>
        </div>

        {/* Card Number */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">Card Number</label>
          <Input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            placeholder="1234 5678 9012 3456"
            maxLength="19"
            required
            className="bg-slate-600 border-slate-500 text-white placeholder:text-slate-400"
            disabled={isProcessing}
          />
        </div>

        {/* Cardholder Name */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">Cardholder Name</label>
          <Input
            type="text"
            name="cardName"
            value={formData.cardName}
            onChange={handleChange}
            placeholder="John Doe"
            required
            className="bg-slate-600 border-slate-500 text-white placeholder:text-slate-400"
            disabled={isProcessing}
          />
        </div>

        {/* Expiry and CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">Expiry Date</label>
            <Input
              type="text"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              placeholder="MM/YY"
              maxLength="5"
              required
              className="bg-slate-600 border-slate-500 text-white placeholder:text-slate-400"
              disabled={isProcessing}
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">CVV</label>
            <Input
              type="text"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              placeholder="123"
              maxLength="4"
              required
              className="bg-slate-600 border-slate-500 text-white placeholder:text-slate-400"
              disabled={isProcessing}
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-slate-600 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-300">Amount</span>
            <span className="text-white font-semibold">₹{ticketData.amount.toFixed(2)}</span>
          </div>
          <div className="border-t border-slate-500 pt-2 flex justify-between">
            <span className="text-slate-300 font-medium">Total</span>
            <span className="text-white font-bold">₹{ticketData.amount.toFixed(2)}</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isProcessing || !formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-6 font-semibold text-lg"
        >
          {isProcessing ? (
            <>
              <Loader2 size={20} className="mr-2 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>Pay ₹{ticketData.amount.toFixed(2)}</>
          )}
        </Button>

        <p className="text-slate-400 text-xs text-center">
          Secured by SSL • PCI DSS Compliant • Your payment information is encrypted
        </p>
      </form>
    </Card>
  )
}
