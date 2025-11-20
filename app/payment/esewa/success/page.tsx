"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const ticketId = searchParams.get("ticketId");

  const [loading, setLoading] = useState(true);
  const [ticketDetails, setTicketDetails] = useState<any>(null);

  useEffect(() => {
    if (!ticketId) return;

    async function fetchTicket() {
      try {
        const ticketRes = await fetch(`/api/ticket/${ticketId}`);
        const ticketData = await ticketRes.json();

        setTicketDetails(ticketData.ticket);
        setLoading(false);
      } catch (err) {
        console.error("ERROR:", err);
        setLoading(false);
      }
    }

    fetchTicket();
  }, [ticketId]);

  if (loading) return <div className="text-white p-10">Loading ticket...</div>;

  if (!ticketDetails) {
    return (
      <div className="text-red-400 text-center p-10">
        Ticket Not Found or Payment Invalid
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-500/20 p-4 rounded-full">
              <CheckCircle size={64} className="text-green-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Payment Successful!
          </h1>
          <p className="text-slate-400">Your ticket has been confirmed</p>
        </div>

        {/* Payment Info */}
        <Card className="bg-slate-700 border-slate-600 p-8 mb-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Detail label="Ticket ID" value={ticketId} />
              <Detail label="Event" value={ticketDetails.event?.title} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Detail label="Ticket Type" value={ticketDetails.type?.name || "N/A"} />
              <Detail label="Email" value={ticketDetails.user?.email || "N/A"} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Detail label="Paid Amount" value={`Rs. ${ticketDetails.amount}`} />
            </div>

            <div className="border-t border-slate-600 pt-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <p className="text-green-400 font-semibold">Payment Confirmed</p>
              </div>
            </div>
          </div>
        </Card>

        {/* QR */}
        <Card className="bg-slate-700 border-slate-600 p-8 mb-8 text-center">
          <p className="text-slate-400 text-sm mb-4">Your Ticket QR Code</p>
          <div className="w-64 h-64 bg-white p-4 rounded-lg mx-auto flex items-center justify-center">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${ticketId}`}
              alt="Ticket QR Code"
              className="w-full h-full"
            />
          </div>
        </Card>

        <Button
          onClick={() => router.push("/profile")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 font-semibold text-lg"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Profile
        </Button>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-slate-400 text-sm mb-1">{label}</p>
      <p className="text-white font-mono text-lg break-all">{value}</p>
    </div>
  );
}
