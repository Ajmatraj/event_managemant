import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'

interface CategoryFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onClearFilters: () => void
}

export function CategoryFilters({
  searchQuery,
  onSearchChange,
  onClearFilters,
}: CategoryFiltersProps) {
  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      {searchQuery && (
        <Button variant="outline" size="icon" onClick={onClearFilters}>
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
