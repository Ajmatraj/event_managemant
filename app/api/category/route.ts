import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

// ✅ Get all event categories
export async function GET() {
  try {
    // // ✅ (Optional) Authentication — only allow logged-in users
    // const session = await getSession()
    // if (!session || !session.id) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    // // ✅ Fetch user and check role
    // const user = await prisma.user.findUnique({
    //   where: { id: session.id },
    //   include: { role: true },
    // })

    // if (!user || !user.role) {
    //   return NextResponse.json(
    //     { error: "User role not found" },
    //     { status: 403 }
    //   )
    // }

    // // ✅ (Optional) restrict to ADMIN or ORGANIZER
    // const allowedRoles = ["ADMIN", "ORGANIZER"]
    // if (!allowedRoles.includes(user.role.role_name)) {
    //   return NextResponse.json(
    //     { error: "Only ADMIN or ORGANIZER users can view categories" },
    //     { status: 403 }
    //   )
    // }

    // ✅ Fetch all categories
    const categories = await prisma.eventCategory.findMany({
      orderBy: { name: "asc" },
    })

    return NextResponse.json(
      {
        message: "Categories fetched successfully",
        categories,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


//add new categories
export async function POST(request: NextRequest) {
  try {
    // ✅ Get logged-in user session
    const session = await getSession()
    if (!session || !session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // ✅ Find user with their role
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: { role: true }, // Fetch related role info from RoleTable
    })

    if (!user || !user.role) {
      return NextResponse.json(
        { error: "User role not found" },
        { status: 403 }
      )
    }

    // ✅ Only ADMIN or ORGANIZER can create categories
    const allowedRoles = ["ADMIN", "ORGANIZER"]
    if (!allowedRoles.includes(user.role.role_name)) {
      return NextResponse.json(
        { error: "Only ADMIN or ORGANIZER users can create categories" },
        { status: 403 }
      )
    }

    // ✅ Parse and validate request body
    const body = await request.json()
    const { name, description } = body

    if (!name || !description) {
      return NextResponse.json(
        { error: "Missing required fields: name and description" },
        { status: 400 }
      )
    }

    // ✅ Check if category already exists
    const existingCategory = await prisma.eventCategory.findUnique({
      where: { name },
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 400 }
      )
    }

    // ✅ Create new category
    const newCategory = await prisma.eventCategory.create({
      data: {
        name,
        description,
      },
    })

    return NextResponse.json(
      {
        message: "Category created successfully",
        category: newCategory,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error creating event category:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
