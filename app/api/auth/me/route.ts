import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession, sanitizeUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // ✅ Fetch the user along with their role name
    const user = await prisma.user.findUnique({
      where: { id: session.id as string },
      include: {
        role: {
          select: {
            role_name: true, // Assuming your role table has a 'role_name' field
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // ✅ Return sanitized user + role name
    return NextResponse.json(
      {
        user: {
          ...sanitizeUser(user),
          roleName: user.role?.role_name || "User", // Default if no role found
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
