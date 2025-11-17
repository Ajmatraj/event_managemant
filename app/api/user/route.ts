import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// ✅ Get all users (Only ADMIN or ORGANIZER)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // ✅ Fetch user with their role
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: { role: true },
    });

    if (!user || !user.role) {
      return NextResponse.json(
        { error: "User or role not found" },
        { status: 403 }
      );
    }

    // ✅ Check role permission
    const allowedRoles = ["ADMIN", "ORGANIZER"];
    if (!allowedRoles.includes(user.role.role_name)) {
      return NextResponse.json(
        { error: "Only ADMIN or ORGANIZER can view users" },
        { status: 403 }
      );
    }

    // ✅ Fetch all users
    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
      include: { role: true },
    });

    return NextResponse.json(
      {
        message: "Users fetched successfully",
        users,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Error fetching user data" },
      { status: 500 }
    );
  }
}
