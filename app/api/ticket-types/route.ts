import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  console.log("📌 [CREATE_TICKET_TYPE] API called");

  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: { role: true },
    });

    if (!user || !user.role) {
      return NextResponse.json({ error: "User role not found" }, { status: 403 });
    }

    const allowedRoles = ["ADMIN", "ORGANIZER"];
    if (!allowedRoles.includes(user.role.role_name)) {
      return NextResponse.json(
        { error: "Only ADMIN or ORGANIZER can create ticket types" },
        { status: 403 }
      );
    }

    // Read body
    const { event_id, name, description, price } = await req.json();

    if (!event_id || !name || !price) {
      return NextResponse.json(
        { error: "event_id, name, and price are required" },
        { status: 400 }
      );
    }

    // Check event exists
    const event = await prisma.event.findUnique({
      where: { id: event_id },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Create Ticket Type
    const ticketType = await prisma.ticketType.create({
      data: {
        event_id,
        name,
        description,
        price,
      },
    });

    return NextResponse.json(
      { message: "Ticket type created successfully", ticketType },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("💥 [CREATE_TICKET_TYPE] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const ticketTypes = await prisma.ticketType.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(
      {
        message: "Ticket types fetched successfully",
        ticketTypes,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching ticket types:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


