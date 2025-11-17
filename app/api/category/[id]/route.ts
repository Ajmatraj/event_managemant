import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { tree } from "next/dist/build/templates/app-page";
import { error } from "console";


//get categories by id
export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ FIXED

    const category = await prisma.eventCategory.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ category }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching category:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


// ✅ DELETE category by ID (only ADMIN or ORGANIZER allowed)
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: { role: true },
    })

    if (!user?.role) {
      return NextResponse.json({ error: "User role not found" }, { status: 403 })
    }

    const allowedRoles = ["ADMIN", "ORGANIZER"]
    if (!allowedRoles.includes(user.role.role_name)) {
      return NextResponse.json(
        { error: "Only ADMIN or ORGANIZER users can delete categories" },
        { status: 403 }
      )
    }

    // ✅ FIX: Await params properly
    const { id } = await context.params

    const category = await prisma.eventCategory.findUnique({ where: { id } })
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // ✅ Prevent foreign key violation
    const relatedEvents = await prisma.event.findMany({
      where: { category_id: id },
    })

    if (relatedEvents.length > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete category because there are events linked to it. Delete or reassign those events first.",
        },
        { status: 400 }
      )
    }

    await prisma.eventCategory.delete({ where: { id } })

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


// ✅ UPDATE category by ID
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: { role: true },
    })

    if (!user?.role) {
      return NextResponse.json({ error: "User role not found" }, { status: 403 })
    }

    const allowedRoles = ["ADMIN", "ORGANIZER"]
    if (!allowedRoles.includes(user.role.role_name)) {
      return NextResponse.json(
        { error: "Only ADMIN or ORGANIZER users can update categories" },
        { status: 403 }
      )
    }

    // ✅ Await params properly
    const { id } = await context.params

    // ✅ Parse request body
    const body = await req.json()
    const { name, description } = body

    if (!name && !description) {
      return NextResponse.json(
        { error: "Please provide at least one field to update" },
        { status: 400 }
      )
    }

    const category = await prisma.eventCategory.findUnique({ where: { id } })
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // ✅ Update the category
    const updatedCategory = await prisma.eventCategory.update({
      where: { id },
      data: {
        name: name || category.name,
        description: description || category.description,
      },
    })

    return NextResponse.json(
      {
        message: "Category updated successfully",
        category: updatedCategory,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}