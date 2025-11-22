import { TicketType } from "@/types/event";
import { TicketTypeCard } from "./TicketTypeCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface TicketTypesListProps {
  tickets: TicketType[];
  isLoading?: boolean;
}

export const TicketTypesList = ({ tickets, isLoading }: TicketTypesListProps) => {
  const handleTicketSelect = (ticket: TicketType) => {
    toast.success(`${ticket.name} ticket selected!`, {
      description: `Price: NPR ${ticket.price}`,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card className="glass-card">
          <CardHeader>
            <Skeleton className="h-7 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in-up sticky top-6">
      <Card className="glass-card border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">Available Tickets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {tickets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No tickets available for this event</p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <TicketTypeCard
                key={ticket.id}
                ticket={ticket}
                onSelect={handleTicketSelect}
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
