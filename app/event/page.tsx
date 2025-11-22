"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroCarousel } from "./components/HeroCarousel";
import { FilterSidebar } from "./components/FilterSidebar";
import { FilterDrawerMobile } from "./components/FilterDrawerMobile";
import { EventCard } from "./components/EventCard";
import {
  LoadingSkeletonCard,
  LoadingCarouselSkeleton,
} from "./components/LoadingSkeletonCard";
import { EmptyState } from "./components/EmptyState";
import { Event, Category, EventFilters } from "@/types/event";

const Index = () => {
  const [filters, setFilters] = useState<EventFilters>({});
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [eventsData, setEventsData] = useState<Event[]>([]);
  const [categoriesData, setCategoriesData] = useState<Category[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/events/");
        const data = await res.json();
        setEventsData(data.events || []);
      } catch (err) {
        console.error("Failed to load events:", err);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/category");
        const data = await res.json();
        setCategoriesData(data.categories || []);
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Filtered events logic
  const filteredEvents = useMemo(() => {
    if (!eventsData) return [];

    let filtered = [...eventsData];

    if (filters.search) {
      const s = filters.search.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(s) ||
          e.description.toLowerCase().includes(s)
      );
    }

    if (filters.category) {
      filtered = filtered.filter(
        (e) => e.category.id === filters.category
      );
    }

    if (filters.eventType) {
      filtered = filtered.filter(
        (e) => e.eventType === filters.eventType
      );
    }

    if (filters.location) {
      const loc = filters.location.toLowerCase();
      filtered = filtered.filter((e) =>
        e.location.toLowerCase().includes(loc)
      );
    }

    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case "newest":
            return (
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
            );
          case "oldest":
            return (
              new Date(a.createdAt).getTime() -
              new Date(b.createdAt).getTime()
            );
          case "popular":
            return b.capacity - a.capacity;
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [eventsData, filters]);

  const isLoading = loadingEvents || loadingCategories;

  // scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-medium">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">EventHub</h1>
                <p className="text-xs text-muted-foreground">
                  Discover Amazing Events
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="mb-12">
          {isLoading ? (
            <LoadingCarouselSkeleton />
          ) : (
            <HeroCarousel events={eventsData} />
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            {!loadingCategories && (
              <FilterSidebar
                categories={categoriesData}
                filters={filters}
                onFiltersChange={setFilters}
              />
            )}
          </aside>

          {/* Events */}
          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">
                {filters.search ||
                filters.category ||
                filters.location
                  ? "Search Results"
                  : "All Events"}
              </h2>
              <p className="text-muted-foreground">
                {isLoading
                  ? "Loading events..."
                  : `${filteredEvents.length} event${
                      filteredEvents.length !== 1 ? "s" : ""
                    } found`}
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <LoadingSkeletonCard key={i} />
                ))}
              </div>
            ) : filteredEvents.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {filteredEvents.map((event, index) => (
                  <EventCard key={event.id} event={event} index={index} />
                ))}
              </motion.div>
            ) : (
              <EmptyState onReset={() => setFilters({})} />
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filter Drawer */}
      <FilterDrawerMobile
        categories={categoriesData}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Scroll top btn */}
      {showScrollTop && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-6 left-6 z-50 hidden lg:block"
        >
          <Button
            onClick={scrollToTop}
            size="icon"
            className="h-12 w-12 rounded-full shadow-strong gradient-secondary text-white border-0"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default Index;
