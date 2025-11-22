export interface Event {
  id: string;
  title: string;
  description: string;
  eventType: "online" | "Physical";
  location: string;
  startDate: string;
  endDate: string;
  capacity: number;
  status: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  category: {
    id: string;
    name: string;
    description: string;
  };
  organizer: {
    id: string;
    name: string;
    email: string;
  };
  bannerImage: string | null;
  bannerImageId: string | null;
  promoVideo: string | null;
  promoVideoId: string | null;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface EventFilters {
  category?: string;
  search?: string;
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  location?: string;
  eventType?: "online" | "Physical" | "all";
  priceType?: "free" | "paid" | "all";
  sortBy?: "newest" | "oldest" | "price" | "popular";
}



export interface TicketType {
  id: string;
  event_id: string;
  name: string;
  description: string;
  price: number;
}