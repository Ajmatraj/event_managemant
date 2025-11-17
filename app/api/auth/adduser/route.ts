import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { hashPassword } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      phone,
      avatarUrl,
      role_id,
      password
    } = body

    // Validate required fields
    if (!name || !email || !role_id) {
      return NextResponse.json(
        { error: "Name, email and role_id are required." },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      )
    }

    // Check role exists
    const role = await prisma.roleTable.findUnique({
      where: { id: role_id },
    })

    if (!role) {
      return NextResponse.json(
        { error: "Invalid role_id — role not found" },
        { status: 404 }
      )
    }

    // Generate password if not provided
    const finalPassword = password || "Temp@1234"
    const hashed = await hashPassword(finalPassword)

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        avatarUrl,
        role: { connect: { id: role_id } },
        password: hashed,
      },
      include: {
        role: true,
      },
    })

    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 201 }
    )
  } catch (error) {
    console.error("❌ Add User Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
