import { motion } from "framer-motion";
import { Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onReset: () => void;
}

export const EmptyState = ({ onReset }: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="col-span-full flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="relative mb-6">
        <div className="h-24 w-24 rounded-full gradient-primary opacity-20 blur-2xl absolute inset-0" />
        <div className="relative h-24 w-24 rounded-full bg-muted flex items-center justify-center">
          <Search className="h-12 w-12 text-muted-foreground" />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold mb-2">No events found</h3>
      <p className="text-muted-foreground text-center mb-6 max-w-md">
        We couldn't find any events matching your criteria. Try adjusting your filters or search terms.
      </p>
      
      <Button onClick={onReset} className="gradient-primary text-white border-0 shadow-medium">
        <Calendar className="mr-2 h-4 w-4" />
        Reset Filters
      </Button>
    </motion.div>
  );
};
