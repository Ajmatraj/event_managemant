import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// --------------------------
// DELETE TICKET TYPE
// --------------------------
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const typeId = params.id;
    console.log("🗑️ Delete Ticket Type ID:", typeId);

    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: { role: true },
    });

    if (!user?.role || !["ADMIN", "ORGANIZER"].includes(user.role.role_name)) {
      return NextResponse.json(
        { error: "Only ADMIN or ORGANIZER can delete ticket types" },
        { status: 403 }
      );
    }

    // Check existence
    const ticketType = await prisma.ticketType.findUnique({
      where: { id: typeId },
      include: { tickets: true },
    });

    if (!ticketType) {
      return NextResponse.json({ error: "Ticket type not found" }, { status: 404 });
    }

    // Prevent delete if tickets exist
    if (ticketType.tickets.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete ticket type. Tickets already issued." },
        { status: 400 }
      );
    }

    await prisma.ticketType.delete({ where: { id: typeId } });

    return NextResponse.json(
      { message: "Ticket type deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("💥 DELETE ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --------------------------
// UPDATE TICKET TYPE
// --------------------------
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const typeId = params.id;
    console.log("✏️ Update Ticket Type ID:", typeId);

    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: { role: true },
    });

    if (!user?.role || !["ADMIN", "ORGANIZER"].includes(user.role.role_name)) {
      return NextResponse.json(
        { error: "Only ADMIN or ORGANIZER can update ticket types" },
        { status: 403 }
      );
    }

    const { name, description, price } = await req.json();

    if (!name && !description && !price) {
      return NextResponse.json(
        { error: "At least one field is required to update" },
        { status: 400 }
      );
    }

    const existing = await prisma.ticketType.findUnique({
      where: { id: typeId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Ticket type not found" }, { status: 404 });
    }

    const updated = await prisma.ticketType.update({
      where: { id: typeId },
      data: {
        name: name ?? existing.name,
        description: description ?? existing.description,
        price: price ?? existing.price,
      },
    });

    return NextResponse.json(
      { message: "Ticket type updated successfully", ticketType: updated },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("💥 UPDATE ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}





export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const eventId = params.eventId;

    console.log("🎫 Fetching Ticket Types for Event:", eventId);

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    // Check event exists
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
      orderBy: { created_at: "desc" },
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
