import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  const { ticketId } = params;

  try {
    if (!ticketId) {
      return NextResponse.json(
        { error: "Ticket ID is required" },
        { status: 400 }
      );
    }

    // 👉 Fetch Ticket with relations
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        type: true, // Ticket Type (name, price)
        event: true, // Event info
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        payment: true, // If payment exists
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json({ ticket });
  } catch (error: any) {
    console.error("💥 [GET_TICKET] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
