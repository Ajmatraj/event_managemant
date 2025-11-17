import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // 🔹 Validate logged-in user
    const session = await getSession();

    if (!session?.id) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // 🔹 Fetch user with role
    const currentUser = await prisma.user.findUnique({
      where: { id: session.id },
      include: { role: true },
    });

    if (!currentUser || currentUser.role?.role_name !== "ADMIN") {
      return NextResponse.json(
        { error: "Access denied. Only Admin can view all roles." },
        { status: 403 }
      );
    }

    // 🔹 Fetch all roles
    const roles = await prisma.roleTable.findMany({
      select: {
        id: true,
        role_name: true,
        description: true,
      },
    });

    return NextResponse.json(
      { message: "Roles fetched successfully", roles },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching roles:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
