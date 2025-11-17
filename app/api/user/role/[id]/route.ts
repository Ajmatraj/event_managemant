import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth"; // your session helper

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { role_id } = body;

    // 🔹 Get logged-in user's session
    const session = await getSession();

    if (!session || !session.id) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // 🔹 Fetch logged-in user and their role
    const currentUser = await prisma.user.findUnique({
      where: { id: session.id },
      include: { role: true },
    });

    if (!currentUser || currentUser.role?.role_name !== "ADMIN") {
      return NextResponse.json(
        { error: "Access denied. Only Admin can change roles." },
        { status: 403 }
      );
    }

    // 🔹 Validate target user
    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 🔹 Validate new role
    const newRole = await prisma.roleTable.findUnique({
      where: { id: role_id },
    });
    if (!newRole) {
      return NextResponse.json({ error: "Invalid role_id" }, { status: 400 });
    }

    // 🔹 Update only the role
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role_id },
      select: {
        id: true,
        name: true,
        email: true,
        role: { select: { id: true, role_name: true, description: true } },
      },
    });

    return NextResponse.json(
      {
        message: `User role updated successfully to ${newRole.role_name}`,
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating user role:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
