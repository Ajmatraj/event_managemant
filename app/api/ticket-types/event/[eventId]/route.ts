import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await context.params;

    console.log("🎫 Fetching Ticket Types for Event:", eventId);

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      console.log("❌ Event not found:", eventId);
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Fetch ticket types
    const ticketTypes = await prisma.ticketType.findMany({
      where: { event_id: eventId },
      orderBy: { name: "asc" }, // optional sorting
    });

    console.log(`✅ Found ${ticketTypes.length} ticket types`);

    return NextResponse.json(
      { ticketTypes },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("💥 GET Ticket Types Error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
