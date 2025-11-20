"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/auth-context"

interface ESewaPaymentFormProps {
  ticketData: {
    ticketId: string
    amount: number
    ticketType: string
    eventTitle: string
  }
}

export default function ESewaPaymentForm({ ticketData }: ESewaPaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsProcessing(true)

    if (!user) {
      setError("Please login to continue with the payment.")
      setIsProcessing(false)
      return
    }

    try {
      const res = await fetch("http://localhost:3000/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: ticketData.amount,
          email,
          ticketId: ticketData.ticketId,
          userId: user.id,
          metadata: {
            ticketType: ticketData.ticketType,
            eventTitle: ticketData.eventTitle
          }
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Unable to initiate eSewa payment")

      const { gatewayUrl, payload } = data

      // === Auto-submit form ===
      const form = document.createElement("form")
      form.method = "POST"
      form.action = gatewayUrl

      Object.entries(payload).forEach(([key, value]) => {
        const input = document.createElement("input")
        input.type = "hidden"
        input.name = key
        input.value = String(value)
        form.appendChild(input)
      })

      document.body.appendChild(form)
      form.submit()

    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment initiation failed")
      setIsProcessing(false)
    }
  }

  return (
    <Card className="bg-slate-700 border-slate-600 p-8">
      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-blue-300 text-sm">
            <strong>Note:</strong> You will be redirected to the secure eSewa payment page.
          </p>
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-2">Email Address</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="bg-slate-600 border-slate-500 text-white placeholder:text-slate-400"
            disabled={isProcessing}
          />
        </div>

        <div className="bg-slate-600 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-300">Amount</span>
            <span className="text-white font-semibold">Rs. {ticketData.amount.toFixed(2)}</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isProcessing || !email}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 font-semibold text-lg"
        >
          {isProcessing ? (
            <>
              <Loader2 size={20} className="mr-2 animate-spin" />
              Redirecting to eSewa...
            </>
          ) : (
            <>Proceed to eSewa Payment</>
          )}
        </Button>

      </form>
    </Card>
  )
}
