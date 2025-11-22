import { Card } from "@/components/ui/card";

export const LoadingSkeletonCard = () => {
  return (
    <Card className="overflow-hidden">
      {/* Image skeleton */}
      <div className="h-48 bg-gradient-to-r from-muted via-muted-foreground/10 to-muted animate-shimmer bg-[length:200%_100%]" />
      
      {/* Content skeleton */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <div className="h-6 bg-gradient-to-r from-muted via-muted-foreground/10 to-muted animate-shimmer bg-[length:200%_100%] rounded w-3/4" />
        
        {/* Organizer */}
        <div className="h-4 bg-gradient-to-r from-muted via-muted-foreground/10 to-muted animate-shimmer bg-[length:200%_100%] rounded w-1/2" />
        
        {/* Date & Location */}
        <div className="space-y-2">
          <div className="h-4 bg-gradient-to-r from-muted via-muted-foreground/10 to-muted animate-shimmer bg-[length:200%_100%] rounded w-2/3" />
          <div className="h-4 bg-gradient-to-r from-muted via-muted-foreground/10 to-muted animate-shimmer bg-[length:200%_100%] rounded w-2/3" />
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-3">
          <div className="h-6 bg-gradient-to-r from-muted via-muted-foreground/10 to-muted animate-shimmer bg-[length:200%_100%] rounded w-20" />
          <div className="h-8 bg-gradient-to-r from-muted via-muted-foreground/10 to-muted animate-shimmer bg-[length:200%_100%] rounded w-24" />
        </div>
      </div>
    </Card>
  );
};

export const LoadingCarouselSkeleton = () => {
  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-2xl bg-gradient-to-r from-muted via-muted-foreground/10 to-muted animate-shimmer bg-[length:200%_100%]">
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <div className="h-8 bg-white/20 rounded-full w-32" />
            <div className="h-16 bg-white/20 rounded w-3/4" />
            <div className="h-6 bg-white/20 rounded w-full" />
            <div className="h-6 bg-white/20 rounded w-2/3" />
            <div className="flex gap-4">
              <div className="h-10 bg-white/20 rounded-full w-32" />
              <div className="h-10 bg-white/20 rounded-full w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
