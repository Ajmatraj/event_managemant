import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Category, EventFilters } from "@/types/event";
import { FilterSidebar } from "./FilterSidebar";

interface FilterDrawerMobileProps {
  categories: Category[];
  filters: EventFilters;
  onFiltersChange: (filters: EventFilters) => void;
}

export const FilterDrawerMobile = ({
  categories,
  filters,
  onFiltersChange,
}: FilterDrawerMobileProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-strong gradient-primary text-white border-0 z-50 lg:hidden"
          size="icon"
        >
          <SlidersHorizontal className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
            Filters
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <FilterSidebar
            categories={categories}
            filters={filters}
            onFiltersChange={onFiltersChange}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
