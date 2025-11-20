'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface FonePayPaymentFormProps {
  ticketData: {
    ticketId: string
    amount: number
    ticketType: string
    eventTitle: string
  }
}

export default function FonePayPaymentForm({ ticketData }: FonePayPaymentFormProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

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
          paymentMethod: 'fonepay',
          phone,
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
        {/* FonePay Information */}
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
          <p className="text-orange-300 text-sm">
            <strong>Note:</strong> An OTP will be sent to your registered FonePay phone number for verification.
          </p>
        </div>

        {/* Phone Number Field */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">FonePay Registered Phone</label>
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="98XXXXXXXX"
            pattern="^98[0-9]{8}$"
            required
            className="bg-slate-600 border-slate-500 text-white placeholder:text-slate-400"
            disabled={isProcessing}
          />
          <p className="text-slate-400 text-xs mt-1">Your FonePay registered phone number</p>
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
          disabled={isProcessing || !phone}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-6 font-semibold text-lg"
        >
          {isProcessing ? (
            <>
              <Loader2 size={20} className="mr-2 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>Pay with FonePay</>
          )}
        </Button>

        <p className="text-slate-400 text-xs text-center">
          Secured by FonePay • Your payment information is encrypted
        </p>
      </form>
    </Card>
  )
}
