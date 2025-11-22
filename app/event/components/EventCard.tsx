import { motion } from "framer-motion";
import { Calendar, MapPin, User, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/event";
import { format } from "date-fns";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface EventCardProps {
  event: Event;
  index: number;
}

export const EventCard = ({ event, index }: EventCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const route = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
    >
      <Card className="group overflow-hidden hover-lift cursor-pointer border-border/50">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={event.bannerImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600"}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <Badge className="gradient-primary text-white border-0 shadow-medium">
              {event.category.name}
            </Badge>
          </div>

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 hover:bg-white transition-colors"
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </Button>

          {/* Event Type Badge */}
          <div className="absolute bottom-3 right-3">
            <Badge
              variant="secondary"
              className="bg-white/90 text-foreground border-0 shadow-soft"
            >
              {event.eventType === "online" ? "🌐 Online" : "📍 Physical"}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          {/* Title */}
          <h3 className="text-lg font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>

          {/* Organizer */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{event.organizer.name}</span>
          </div>

          {/* Date & Location */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{format(new Date(event.startDate), "MMM dd, yyyy • h:mm a")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-secondary" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {event.status}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {event.capacity} spots
              </span>
            </div>
            <Button
            onClick={()=>{route.push(`eventdetails/${event.id}`)}}
            size="sm" className="gradient-primary text-white border-0 shadow-soft hover:shadow-medium">
              Book Now
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
