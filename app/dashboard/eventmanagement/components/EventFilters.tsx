"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Search, Filter, X } from "lucide-react"
import type { Category } from "../page"

interface EventFiltersProps {
  filters: {
    status: string
    eventType: string
    searchTerm: string
  }
  categories: Category[]
  onFiltersChange: (filters: {
    status: string
    eventType: string
    searchTerm: string
  }) => void
}

export function EventFilters({ filters, onFiltersChange, categories }: EventFiltersProps) {
  const uniqueEventTypes = [...new Set(categories.map((cat) => cat.name))]

  const handleClearFilters = () => {
    onFiltersChange({
      status: "ALL",
      eventType: "ALL",
      searchTerm: "",
    })
  }

  const hasActiveFilters = filters.status !== "ALL" || filters.eventType !== "ALL" || filters.searchTerm !== ""

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Filter className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Filters</h2>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className="flex items-center gap-2 font-medium text-foreground">
            <Search className="w-4 h-4 text-primary" />
            Search Events
          </Label>
          <Input
            id="search"
            type="text"
            placeholder="Search by title or location..."
            value={filters.searchTerm}
            onChange={(e) => onFiltersChange({ ...filters, searchTerm: e.target.value })}
            className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
          />
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <Label htmlFor="status-filter" className="font-medium text-foreground">
            Status
          </Label>
          <select
            id="status-filter"
            value={filters.status}
            onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          >
            <option value="ALL">All Statuses</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Event Type Filter */}
        <div className="space-y-2">
          <Label htmlFor="type-filter" className="font-medium text-foreground">
            Event Type
          </Label>
          <select
            id="type-filter"
            value={filters.eventType}
            onChange={(e) => onFiltersChange({ ...filters, eventType: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          >
            <option value="ALL">All Types</option>
            {uniqueEventTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
