import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadBufferToCloudinary } from "@/lib/cloudinary";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const formData = await req.formData();

    const email = formData.get("email") as string | null;
    const name = formData.get("name") as string | null;
    const phone = formData.get("phone") as string | null;
    const role_id = formData.get("role_id") as string | null;

    const avatarFile = formData.get("avatar") as File | null;

    // Find existing user
    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: { avatarImage: true },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check duplicate email
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({ where: { email } });
      if (emailExists) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        );
      }
    }

    let avatarUrl_Id = existingUser.avatarUrl_Id;

    // --------------------------
    // ⭐ AVATAR IMAGE HANDLING
    // --------------------------
    if (avatarFile) {
      if (!avatarFile.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Avatar must be an image" },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await avatarFile.arrayBuffer());

      const upload = await uploadBufferToCloudinary(
        buffer,
        avatarFile.type,
        "user_avatars"
      );

      // If user already has an avatar: update it
      if (existingUser.avatarUrl_Id) {
        const updated = await prisma.image.update({
          where: { id: existingUser.avatarUrl_Id },
          data: {
            image_url: upload.url,
            image_type: "AVATAR",
          },
        });

        avatarUrl_Id = updated.id;
      } else {
        // Else: create new Image record
        const newImage = await prisma.image.create({
          data: {
            image_url: upload.url,
            image_type: "AVATAR",
          },
        });

        avatarUrl_Id = newImage.id;
      }
    }

    // --------------------------
    // ⭐ UPDATE USER DETAILS
    // --------------------------
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        email: email ?? existingUser.email,
        name: name ?? existingUser.name,
        phone: phone ?? existingUser.phone,
        role_id: role_id ?? existingUser.role_id,
        avatarUrl_Id,
      },
      include: {
        role: true,
        avatarImage: true,
      },
    });

    return NextResponse.json(
      {
        message: "User updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ UPDATE USER ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}


// ✅ GET user by ID
export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,

        // 🔥 Return only the URL of the avatar image
        avatarImage: {
          select: {
            image_url: true,
          },
        },

        role: {
          select: {
            id: true,
            role_name: true,
            description: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
