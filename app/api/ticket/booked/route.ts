import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  console.log("🎫 [BOOK_TICKET] API called");

  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { event_id, ticket_type_id } = await req.json();

    if (!event_id || !ticket_type_id ) {
      return NextResponse.json(
        { error: "event_id, ticket_type_id are required" },
        { status: 400 }
      );
    }

    // 1️⃣ Validate Event
    const event = await prisma.event.findUnique({
      where: { id: event_id },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // 2️⃣ Validate Ticket Type for event
    const ticketType = await prisma.ticketType.findUnique({
      where: { id: ticket_type_id },
    });

    if (!ticketType || ticketType.event_id !== event_id) {
      return NextResponse.json(
        { error: "Invalid ticket type for this event" },
        { status: 400 }
      );
    }

    // 3️⃣ Generate QR code
    const qrCodeString = uuidv4();

    // 4️⃣ Create Ticket
    const ticket = await prisma.ticket.create({
      data: {
        event_id,
        user_id: session.id,
        type_id: ticket_type_id,
        qr_code: qrCodeString,
        status: "VALID",
      },
    });

    // 5️⃣ Create Payment Entry
    const payment = await prisma.payment.create({
  data: {
    ticket_id: ticket.id,
    user_id: session.id,
    amount: ticketType.price,
    payment_status: "PENDING",
    payment_method: "ESEWA", // 👈 add this default  
  },
});


    return NextResponse.json({
      message: "Ticket booked successfully",
      ticket,
      payment,
    });
  } catch (error: any) {
    console.error("💥 BOOK TICKET ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
