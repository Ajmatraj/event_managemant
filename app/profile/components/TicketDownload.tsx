"use client"

import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { useState, useRef } from "react"
import { Download, Loader2, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface TicketDownloadProps {
  ticket: {
    id: string
    event?: {
      title: string
      bannerImage?: {
        image_url: string
      }
      start_date: string
      end_date: string
      location: string
    }
    type?: {
      name: string
      price: number
      description: string
    }
    qr_code: string
    payment?: {
      amount: number
    }
  }
}

/**
 * NOTE: fallbackBanner is a local path to the uploaded image in your environment.
 * Developer provided image path: /mnt/data/74faa141-fca1-49f8-b117-1f1654db5c3e.png
 */
const fallbackBanner = "/mnt/data/74faa141-fca1-49f8-b117-1f1654db5c3e.png"

export default function TicketDownload({ ticket }: TicketDownloadProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const ticketRef = useRef<HTMLDivElement | null>(null)

  const formatDate = (dateString?: string) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
      : "TBA"

  const formatTime = (dateString?: string) =>
    dateString ? new Date(dateString).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }) : ""

  const loadImage = (src: string) =>
    new Promise<void>((resolve) => {
      if (!src) return resolve()
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        console.log("[v0] Image loaded successfully:", src)
        resolve()
      }
      img.onerror = () => {
        console.log("[v0] Image failed to load:", src)
        resolve()
      }
      img.src = src
    })

  const handleDownload = async () => {
    if (!ticketRef.current) return

    try {
      setIsDownloading(true)
      setError(null)

      const bannerUrl = ticket.event?.bannerImage?.image_url || fallbackBanner
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=800x800&data=${encodeURIComponent(
        ticket.qr_code || ticket.id
      )}`

      await Promise.all([loadImage(bannerUrl), loadImage(qrUrl)])
      await new Promise((r) => setTimeout(r, 300))

      const canvas = await html2canvas(ticketRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        logging: false,
        imageTimeout: 20000,
        windowWidth: 2400,
        windowHeight: 1000,
      })

      const imgData = canvas.toDataURL("image/jpeg", 0.95)

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "in",
        format: [10, 4],
      })

      pdf.addImage(imgData, "JPEG", 0, 0, 10, 4)
      pdf.save(`${(ticket.event?.title || "ticket").replace(/\s+/g, "_")}-${ticket.id}.pdf`)
    } catch (err) {
      console.error("Ticket download error:", err)
      setError("Failed to generate ticket PDF. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div
        ref={ticketRef}
        style={{
          position: "fixed",
          left: -99999,
          top: -99999,
          width: 2400,
          height: 1000,
          overflow: "hidden",
          backgroundColor: "#ffffff",
        }}
        aria-hidden
      >
        <TicketTemplate ticket={ticket} formatDate={formatDate} formatTime={formatTime} fullSize />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
          <AlertCircle size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-slate-100 rounded-lg overflow-hidden border-2 border-dashed border-slate-300">
        <div style={{ paddingBottom: "40%", position: "relative", background: "#ffffff" }}>
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            <TicketTemplate ticket={ticket} formatDate={formatDate} formatTime={formatTime} preview />
          </div>
        </div>
      </div>

      <Button onClick={handleDownload} disabled={isDownloading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
        {isDownloading ? (
          <>
            <Loader2 size={18} className="mr-2 animate-spin" />
            Generating PDF...
          </>
        ) : (
          <>
            <Download size={18} className="mr-2" />
            Download Ticket (PDF)
          </>
        )}
      </Button>
    </div>
  )
}


/* ----------------------------------------------------------
   TicketTemplate: Band-style horizontal ticket
   - fullSize: render at fixed canvas size (2400x1000)
   - preview: render responsive with proper aspect ratio
   ---------------------------------------------------------- */
function TicketTemplate({ ticket, formatDate, formatTime, preview = false, fullSize = false }: any) {
  const bannerUrl = ticket.event?.bannerImage?.image_url || fallbackBanner
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${preview ? "300x300" : "700x700"}&data=${encodeURIComponent(
    ticket.qr_code || ticket.id
  )}`

  const eventDate = formatDate(ticket.event?.start_date)
  const eventTime = formatTime(ticket.event?.start_date)
  const amount = ticket.payment?.amount ?? ticket.type?.price ?? 0

  const containerStyle: React.CSSProperties = fullSize
    ? { width: 2400, height: 1000, fontFamily: "Inter, Arial, sans-serif" }
    : { width: "100%", aspectRatio: "2.4 / 1", fontFamily: "Inter, Arial, sans-serif" }

  return (
    <div
      className="relative overflow-hidden"
      style={{
        ...containerStyle,
        display: "flex",
        boxSizing: "border-box",
        background: "#ffffff",
        borderRadius: preview ? 8 : 0,
      }}
    >
      {/* Banner background covering entire left section */}
      <div
        style={{
          width: fullSize ? 1600 : "66.67%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Banner image as background */}
        <img
          src={bannerUrl || "/placeholder.svg"}
          alt="Event banner"
          crossOrigin="anonymous"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        />

        {/* Purple gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background: "linear-gradient(135deg, rgba(217, 70, 239, 0.85) 0%, rgba(168, 85, 247, 0.75) 50%, rgba(124, 58, 237, 0.85) 100%)",
          }}
        />

        {/* Decorative orange blob */}
        <div
          style={{
            position: "absolute",
            bottom: fullSize ? -100 : "-5%",
            left: fullSize ? -100 : "-5%",
            width: fullSize ? 400 : "20%",
            height: fullSize ? 400 : "20%",
            background: "#fb923c",
            borderRadius: "50%",
            opacity: 0.5,
            filter: "blur(40px)",
            zIndex: 2,
          }}
        />

        {/* Dashed circle decoration */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: fullSize ? 200 : "8%",
            transform: "translateY(-50%)",
            width: fullSize ? 300 : "15%",
            height: fullSize ? 300 : "15%",
            border: `${fullSize ? 8 : 2}px dashed rgba(255,255,255,0.3)`,
            borderRadius: "50%",
            zIndex: 2,
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 3,
            padding: fullSize ? 60 : "2.5%",
            display: "flex",
            alignItems: "center",
            height: "100%",
            gap: fullSize ? 40 : "2%",
          }}
        >
          {/* Text content */}
          <div style={{ flex: 1 }}>
            <h1
              style={{
                margin: 0,
                color: "#ffffff",
                fontSize: fullSize ? 110 : "clamp(24px, 5vw, 110px)",
                lineHeight: 0.9,
                fontWeight: 900,
                textTransform: "lowercase",
                fontStyle: "italic",
                letterSpacing: -2,
                textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                marginBottom: fullSize ? 20 : "1.5%",
              }}
            >
              {(ticket.event?.title || "event").toLowerCase().split(" ")[0]}
            </h1>

            <div
              style={{
                fontSize: fullSize ? 48 : "clamp(14px, 2.5vw, 48px)",
                fontWeight: 800,
                color: "#ffffff",
                textTransform: "uppercase",
                letterSpacing: 2,
                lineHeight: 1.2,
                marginBottom: fullSize ? 20 : "1.5%",
              }}
            >
              {ticket.event?.title || "EVENT NAME"}
            </div>

            <div
              style={{
                fontSize: fullSize ? 38 : "clamp(12px, 2vw, 38px)",
                fontWeight: 700,
                color: "#ffffff",
                textDecoration: "underline",
                opacity: 0.95,
              }}
            >
              {eventDate}
            </div>

            {/* Decorative dots */}
            <div
              style={{
                display: "flex",
                gap: fullSize ? 12 : "0.5%",
                marginTop: fullSize ? 24 : "2%",
              }}
            >
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: fullSize ? 16 : "1.5%",
                    height: fullSize ? 16 : "1.5%",
                    borderRadius: "50%",
                    background: i === 3 ? "#fb923c" : "rgba(255,255,255,0.5)",
                    minWidth: fullSize ? 16 : 6,
                    minHeight: fullSize ? 16 : 6,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Event photo */}
          <div
            style={{
              width: fullSize ? 400 : "16%",
              height: fullSize ? 480 : "75%",
              borderRadius: 12,
              overflow: "hidden",
              border: `${fullSize ? 8 : 2}px solid #ffffff`,
              boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
              flexShrink: 0,
              minWidth: fullSize ? 400 : "10%",
            }}
          >
            <img
              src={bannerUrl || "/placeholder.svg"}
              alt="Event"
              crossOrigin="anonymous"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      </div>

      {/* RIGHT: White section with QR and details */}
      <div
        style={{
          flex: 1,
          background: "#f5f5f5",
          padding: fullSize ? 60 : "2.5%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        {/* Yellow accent corner */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: fullSize ? 300 : "25%",
            height: fullSize ? 250 : "30%",
            background: "#fbbf24",
            clipPath: "polygon(100% 0, 100% 100%, 0 0)",
            zIndex: 1,
          }}
        />

        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
          {/* QR Code */}
          <div
            style={{
              width: fullSize ? 280 : "22%",
              height: fullSize ? 280 : "60%",
              background: "#ffffff",
              padding: fullSize ? 20 : "1.5%",
              borderRadius: 8,
              border: `${fullSize ? 6 : 2}px solid #000000`,
              alignSelf: "flex-start",
              aspectRatio: "1",
              minWidth: fullSize ? 280 : 60,
            }}
          >
            <img
              src={qrUrl || "/placeholder.svg"}
              alt="QR Code"
              crossOrigin="anonymous"
              style={{
                width: "100%",
                height: "100%",
                display: "block",
              }}
            />
          </div>

          {/* Event details */}
          <div>
            <div
              style={{
                fontSize: fullSize ? 36 : "clamp(11px, 1.5vw, 36px)",
                fontWeight: 800,
                color: "#000000",
                textTransform: "uppercase",
                lineHeight: 1.2,
                marginBottom: fullSize ? 16 : "1%",
              }}
            >
              {ticket.event?.title || "EVENT NAME"}
            </div>

            <div
              style={{
                fontSize: fullSize ? 32 : "clamp(10px, 1.3vw, 32px)",
                fontWeight: 700,
                color: "#000000",
                marginBottom: fullSize ? 12 : "0.8%",
              }}
            >
              {eventDate}
            </div>

            <div
              style={{
                fontSize: fullSize ? 24 : "clamp(8px, 1vw, 24px)",
                fontWeight: 600,
                color: "#666666",
                marginBottom: fullSize ? 20 : "1.2%",
              }}
            >
              {(ticket.id || "0000000000").slice(0, 10)}
            </div>

            <div
              style={{
                fontSize: fullSize ? 22 : "clamp(7px, 0.9vw, 22px)",
                color: "#666666",
                marginBottom: fullSize ? 8 : "0.5%",
                textTransform: "uppercase",
              }}
            >
              {ticket.type?.name || "REGULAR"}
            </div>
            <div
              style={{
                fontSize: fullSize ? 44 : "clamp(14px, 1.8vw, 44px)",
                fontWeight: 800,
                color: "#d946ef",
              }}
            >
              ₹{amount}
            </div>
            <div
              style={{
                marginTop: fullSize ? 8 : "0.5%",
                fontSize: fullSize ? 20 : "clamp(7px, 0.9vw, 20px)",
                color: "#999999",
              }}
            >
              {eventTime || "03:57 PM"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
