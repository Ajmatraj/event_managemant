import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { uploadBufferToCloudinary } from "@/lib/cloudinary";

// ✅ GET EVENT BY ID
export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    console.log(`🔍 Fetching event with ID: ${id}`);

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true } },
        organizer: { select: { id: true, name: true, email: true } },
        bannerImage: { select: { id: true, image_url: true } },
        promoVideo: { select: { id: true, video_url: true } },
      },
    });

    if (!event) {
      console.warn(`⚠️ No event found with ID: ${id}`);
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    console.log(`✅ Event found:`, event.title);
    return NextResponse.json({ event }, { status: 200 });
  } catch (error: any) {
    console.error("💥 [GET_EVENT] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// ✅ UPDATE EVENT BY ID (Supports updating banner/video)
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    console.log(`✏️ Attempting to update event with ID: ${id}`);

    const session = await getSession();
    if (!session?.id) {
      console.warn("🚫 Unauthorized access attempt.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: { role: true },
    });

    if (!user?.role || !["ADMIN", "ORGANIZER"].includes(user.role.role_name)) {
      console.warn(`🚫 Access denied for user ${session.id}`);
      return NextResponse.json(
        { error: "Only ADMIN or ORGANIZER can update events" },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    console.log("📦 Parsed form data for update.");

    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const location = formData.get("location") as string | null;
    const start_date = formData.get("start_date") as string | null;
    const end_date = formData.get("end_date") as string | null;
    const capacityRaw = formData.get("capacity");
    const status = formData.get("status") as string | null;

    const capacity = capacityRaw ? Number(capacityRaw) : undefined;

    const bannerFile = formData.get("bannerImage") as File | null;
    const promoFile = formData.get("promoVideo") as File | null;

    const existingEvent = await prisma.event.findUnique({ where: { id } });
    if (!existingEvent) {
      console.warn(`⚠️ Event not found for update: ${id}`);
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    let bannerImageId = existingEvent.banner_image_id;
    let promoVideoId = existingEvent.promo_video_id;

    // 🖼️ Upload new banner if provided
    if (bannerFile) {
      console.log("📤 Uploading new banner image...");
      const buffer = Buffer.from(await bannerFile.arrayBuffer());
      const uploadRes = await uploadBufferToCloudinary(buffer, bannerFile.type, "event_banners");
      console.log("✅ Banner upload successful:", uploadRes.url);

      const newBanner = await prisma.image.create({
        data: { image_url: uploadRes.url, image_type: "BANNER" },
      });
      bannerImageId = newBanner.id;
    }

    // 🎥 Upload new promo video if provided
    if (promoFile) {
      console.log("📤 Uploading new promo video...");
      const buffer = Buffer.from(await promoFile.arrayBuffer());
      const uploadRes = await uploadBufferToCloudinary(buffer, promoFile.type, "event_videos");
      console.log("✅ Promo upload successful:", uploadRes.url);

      const newVideo = await prisma.video.create({
        data: { video_url: uploadRes.url, video_type: "PROMO" },
      });
      promoVideoId = newVideo.id;
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title: title ?? existingEvent.title,
        description: description ?? existingEvent.description,
        location: location ?? existingEvent.location,
        start_date: start_date ? new Date(start_date) : existingEvent.start_date,
        end_date: end_date ? new Date(end_date) : existingEvent.end_date,
        capacity: capacity ?? existingEvent.capacity,
        status: status ?? existingEvent.status,
        banner_image_id: bannerImageId,
        promo_video_id: promoVideoId,
      },
      include: {
        bannerImage: true,
        promoVideo: true,
      },
    });

    console.log(`✅ Event ${id} updated successfully.`);
    return NextResponse.json(
      { message: "Event updated successfully", event: updatedEvent },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("💥 [UPDATE_EVENT] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// ✅ DELETE EVENT BY ID
export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    console.log(`🗑️ Deleting event with ID: ${id}`);

    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: { role: true },
    });

    if (!user?.role || !["ADMIN", "ORGANIZER"].includes(user.role.role_name)) {
      return NextResponse.json({ error: "Only ADMIN or ORGANIZER can delete events" }, { status: 403 });
    }

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        tickets: {
          include: { payment: true },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // 1️⃣ Delete payments first
    await prisma.payment.deleteMany({
      where: {
        ticket: {
          event_id: id,
        },
      },
    });

    // 2️⃣ Delete tickets linked to this event
    await prisma.ticket.deleteMany({
      where: { event_id: id },
    });

    // 3️⃣ Delete feedback, surveys, sponsorships, etc., if they exist
    await prisma.feedback.deleteMany({ where: { event_id: id } });
    await prisma.survey.deleteMany({ where: { event_id: id } });
    await prisma.notification.deleteMany({ where: { event_id: id } });
    await prisma.sponsorship.deleteMany({ where: { event_id: id } });
    await prisma.advertisement.deleteMany({ where: { event_id: id } });

    // 4️⃣ Finally delete the event
    await prisma.event.delete({ where: { id } });

    console.log(`✅ Event deleted successfully: ${id}`);
    return NextResponse.json({ message: "Event deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("💥 [DELETE_EVENT] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}


