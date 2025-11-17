import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  console.log("🎫 [BOOK_TICKET] API called");

  try {
    const session = await getSession();
    if (!session?.id) {
      console.log("❌ Unauthorized user");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("📥 Incoming data:", body);

    const { event_id, ticket_type_id } = body;

    if (!event_id || !ticket_type_id) {
      return NextResponse.json(
        { error: "event_id and ticket_type_id are required" },
        { status: 400 }
      );
    }

    // 👉 Check event
    const event = await prisma.event.findUnique({
      where: { id: event_id },
    });

    if (!event) {
      console.log("❌ Event not found:", event_id);
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // 👉 Check ticket type
    const ticketType = await prisma.ticketType.findUnique({
      where: { id: ticket_type_id },
    });

    if (!ticketType) {
      console.log("❌ Ticket type not found:", ticket_type_id);
      return NextResponse.json({ error: "Ticket type not found" }, { status: 404 });
    }

    // 👉 Generate QR code string
    const qrCodeString = uuidv4();
    console.log("🔐 Generated QR:", qrCodeString);

    // 👉 Create the ticket
    const ticket = await prisma.ticket.create({
      data: {
        event_id,
        user_id: session.id,
        type_id: ticket_type_id,
        qr_code: qrCodeString,
        status: "VALID",
      },
    });

    console.log("✅ Ticket booked successfully:", ticket);
    return NextResponse.json({ message: "Ticket booked", ticket });
  } catch (error: any) {
    console.error("💥 [BOOK_TICKET] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


