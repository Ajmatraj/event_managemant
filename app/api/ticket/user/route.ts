import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("👤 User ID:", session.id);

    const tickets = await prisma.ticket.findMany({
      where: { user_id: session.id },
      orderBy: { issue_date: "desc" },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            location: true,
            start_date: true,
            end_date: true,
            bannerImage: {
              select: {
                id: true,
                image_url: true,
                image_title: true,
                image_type: true
              }
            }
          }
        },
        type: {
          select: {
            id: true,
            name: true,
            price: true,
            description: true
          }
        },
        payment: {
          select: {
            id: true,
            ticket_id: true,
            user_id: true,
            amount: true,
            payment_method: true,
            payment_status: true,
            payment_date: true
          }
        }
      }
    });

    return NextResponse.json(
      {
        message: "User tickets fetched successfully",
        tickets
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("💥 [GET_USER_TICKETS] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
