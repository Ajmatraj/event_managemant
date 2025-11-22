import { TicketType } from "@/types/event";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";
import { motion } from "framer-motion";

interface TicketTypeCardProps {
  ticket: TicketType;
  onSelect?: (ticket: TicketType) => void;
}

export const TicketTypeCard = ({ ticket, onSelect }: TicketTypeCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="glass-card hover:border-primary/50 transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{ticket.name}</CardTitle>
            <Ticket className="w-5 h-5 text-primary" />
          </div>
          <CardDescription>{ticket.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-primary">NPR {ticket.price}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full btn-gradient"
            onClick={() => onSelect?.(ticket)}
          >
            Select Ticket
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
