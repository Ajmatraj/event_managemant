import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/event";
import { format } from "date-fns";

interface HeroCarouselProps {
  events: Event[];
}

export const HeroCarousel = ({ events }: HeroCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const featuredEvents = events.slice(0, 5);

  useEffect(() => {
    if (featuredEvents.length === 0) return;
    
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % featuredEvents.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [featuredEvents.length]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + featuredEvents.length) % featuredEvents.length);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % featuredEvents.length);
  };

  if (featuredEvents.length === 0) return null;

  const currentEvent = featuredEvents[currentIndex];

  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-2xl">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${currentEvent.bannerImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200"})`,
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 gradient-hero" />

          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="max-w-2xl text-white"
              >
                <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md rounded-full mb-4">
                  <span className="text-sm font-semibold">Featured Event</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                  {currentEvent.title}
                </h1>
                
                <p className="text-lg md:text-xl mb-6 text-white/90 line-clamp-2">
                  {currentEvent.description}
                </p>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {format(new Date(currentEvent.startDate), "MMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-medium">{currentEvent.location}</span>
                  </div>
                </div>

                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">
                  View Details
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevious}
          className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNext}
          className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {featuredEvents.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? "w-8 bg-white"
                : "w-2 bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
