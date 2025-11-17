import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const addresses = await prisma.address.findMany({
      where: { userId: session.id as string },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ addresses }, { status: 200 })
  } catch (error) {
    console.error("Get addresses error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { type, name, email, address, city, state, zip, phone } = body

    const newAddress = await prisma.address.create({
      data: {
        type,
        name,
        email,
        address,
        city,
        state,
        zip,
        phone,
        userId: session.id as string,
      },
    })

    return NextResponse.json({ address: newAddress }, { status: 201 })
  } catch (error) {
    console.error("Create address error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

