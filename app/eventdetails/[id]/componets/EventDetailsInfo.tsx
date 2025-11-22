import { Calendar, MapPin, Users, Video, Clock } from "lucide-react";
import { Event } from "@/types/event";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, isValid } from "date-fns";

interface EventDetailsInfoProps {
  event: Event;
}

export const EventDetailsInfo = ({ event }: EventDetailsInfoProps) => {
  const fmt = (dateStr: string | undefined | null, pattern = "PPP") => {
    if (!dateStr) return "-"
    const d = typeof dateStr === "string" && dateStr.includes("T") ? parseISO(dateStr) : new Date(dateStr)
    return isValid(d) ? format(d, pattern) : "-"
  }
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Banner Image */}
      <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
        <img
          src={
            typeof event.bannerImage === "object" && event.bannerImage
              ? (event.bannerImage as any).image_url || "/placeholder.svg"
              : typeof event.bannerImage === "string"
              ? event.bannerImage
              : "/placeholder.svg"
          }
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
        <Badge className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm">
          {event.category.name}
        </Badge>
      </div>

      {/* Event Title & Basic Info */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-foreground">{event.title}</h1>
        
        <div className="flex flex-wrap gap-4 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <span>{fmt(event.startDate, "PPP")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span>{fmt(event.startDate, "p")}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span>{event.capacity} capacity</span>
          </div>
          {event.eventType === "online" && (
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              <span>Online Event</span>
            </div>
          )}
        </div>
      </div>

      {/* Description Card */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
          <p className="text-muted-foreground leading-relaxed">{event.description}</p>
        </CardContent>
      </Card>

      {/* Organizer Card */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-semibold mb-4">Organized By</h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xl font-bold text-primary">
                {event.organizer.name.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-semibold text-foreground">{event.organizer.name}</p>
              <p className="text-sm text-muted-foreground">{event.organizer.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Details Card */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-semibold mb-4">Event Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p className="font-semibold">{fmt(event.startDate, "PPP p")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">End Date</p>
              <p className="font-semibold">{fmt(event.endDate, "PPP p")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Event Type</p>
              <p className="font-semibold capitalize">{event.eventType}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={event.status === "UPCOMING" ? "default" : "secondary"}>
                {event.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
