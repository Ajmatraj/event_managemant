import { motion } from "framer-motion";
import { Search, Calendar, MapPin, DollarSign, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Category, EventFilters } from "@/types/event";
import { Separator } from "@/components/ui/separator";

interface FilterSidebarProps {
  categories: Category[];
  filters: EventFilters;
  onFiltersChange: (filters: EventFilters) => void;
}

export const FilterSidebar = ({ categories, filters, onFiltersChange }: FilterSidebarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-6"
    >
      <Card className="p-6 shadow-medium glass-effect glass-effect-dark">
        <div className="flex items-center gap-2 mb-6">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Filters</h2>
        </div>

        <div className="space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search" className="text-sm font-semibold flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              Search Events
            </Label>
            <Input
              id="search"
              placeholder="Event name..."
              value={filters.search || ""}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="border-border/50"
            />
          </div>

          <Separator />

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Category</Label>
            <Select
              value={filters.category || "all"}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, category: value === "all" ? undefined : value })
              }
            >
              <SelectTrigger className="border-border/50">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Event Type */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-secondary" />
              Event Type
            </Label>
            <Select
              value={filters.eventType || "all"}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  eventType: value === "all" ? undefined : (value as "online" | "Physical"),
                })
              }
            >
              <SelectTrigger className="border-border/50">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="online">🌐 Online</SelectItem>
                <SelectItem value="Physical">📍 Physical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-semibold">
              Location
            </Label>
            <Input
              id="location"
              placeholder="City or venue..."
              value={filters.location || ""}
              onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
              className="border-border/50"
            />
          </div>

          <Separator />

          {/* Sort By */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Sort By</Label>
            <Select
              value={filters.sortBy || "newest"}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  sortBy: value as "newest" | "oldest" | "price" | "popular",
                })
              }
            >
              <SelectTrigger className="border-border/50">
                <SelectValue placeholder="Newest First" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="price">By Price</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Filters */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onFiltersChange({})}
          >
            Reset Filters
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
