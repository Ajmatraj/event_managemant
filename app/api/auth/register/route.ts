import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { hashPassword } from "@/lib/utils"
import { sanitizeUser, signJwtToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    let { email, password, name, role } = body

    // ✅ Default role if none provided
    if (!role) {
      role = "USER"
    }

    console.log("📩 Received body:", { email, password, name, role })

    // ✅ Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // ✅ Validate role value
    const validRoles = ["ADMIN", "ORGANIZER", "USER"]
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // ✅ Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // ✅ Get role ID from roleTable
    const roleRecord = await prisma.roleTable.findUnique({
      where: { role_name: role },
    })

    if (!roleRecord) {
      return NextResponse.json({ error: `Role "${role}" not found` }, { status: 404 })
    }

    // ✅ Hash password
    const hashedPassword = await hashPassword(password)

    // ✅ Create new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: {
          connect: { id: roleRecord.id },
        },
      },
      include: {
        role: true,
      },
    })

    // ✅ Generate JWT token
    const token = await signJwtToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role_id,
    })

    // ✅ Return response with JWT cookie
    const response = NextResponse.json({ user: sanitizeUser(user) }, { status: 201 })

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
    })

    return response
  } catch (error) {
    console.error("❌ Registration error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
