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
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    console.log(`✏️ Updating event: ${id}`);

    // ---- AUTH CHECK ----
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: { role: true },
    });

    if (!user?.role || !["ADMIN", "ORGANIZER"].includes(user.role.role_name)) {
      return NextResponse.json(
        { error: "Only ADMIN or ORGANIZER can update events" },
        { status: 403 }
      );
    }

    // ---- FORM DATA ----
    const formData = await req.formData();

    const clean = (val: any) =>
      val === "" || val === "null" || val === null ? undefined : val;

    const title = clean(formData.get("title"));
    const description = clean(formData.get("description"));
    const location = clean(formData.get("location"));
    const start_date = clean(formData.get("start_date"));
    const end_date = clean(formData.get("end_date"));
    const status = clean(formData.get("status"));

    const capacityRaw = formData.get("capacity");
    const capacity =
      capacityRaw && !isNaN(Number(capacityRaw))
        ? Number(capacityRaw)
        : undefined;

    const bannerFile = formData.get("bannerImage") as File | null;
    const promoFile = formData.get("promoVideo") as File | null;

    // ---- GET EXISTING EVENT ----
    const existingEvent = await prisma.event.findUnique({
      where: { id },
      include: {
        bannerImage: true,
        promoVideo: true,
      },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    let bannerImageId = existingEvent.banner_image_id;
    let promoVideoId = existingEvent.promo_video_id;

    // ----------------------------
    //   🖼️ BANNER IMAGE UPDATE
    // ----------------------------
    if (bannerFile) {
      if (!bannerFile.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Banner must be an image" },
          { status: 400 }
        );
      }

      console.log("📤 Uploading banner...");
      const buffer = Buffer.from(await bannerFile.arrayBuffer());
      const upload = await uploadBufferToCloudinary(
        buffer,
        bannerFile.type,
        "event_banners"
      );

      // Create new DB entry
      const newBanner = await prisma.image.create({
        data: {
          image_url: upload.url,
          image_type: "BANNER",
        },
      });

      // Delete old banner from DB
      if (existingEvent.banner_image_id) {
        await prisma.image.delete({
          where: { id: existingEvent.banner_image_id },
        });
      }

      bannerImageId = newBanner.id;
    }

    // ----------------------------
    //   🎥 PROMO VIDEO UPDATE
    // ----------------------------
    if (promoFile) {
      if (!promoFile.type.startsWith("video/")) {
        return NextResponse.json(
          { error: "Promo file must be a video" },
          { status: 400 }
        );
      }

      console.log("📤 Uploading promo video...");
      const buffer = Buffer.from(await promoFile.arrayBuffer());
      const upload = await uploadBufferToCloudinary(
        buffer,
        promoFile.type,
        "event_videos"
      );

      // Create new DB video
      const newVideo = await prisma.video.create({
        data: {
          video_url: upload.url,
          video_type: "PROMO",
        },
      });

      // Delete old promo video from DB
      if (existingEvent.promo_video_id) {
        await prisma.video.delete({
          where: { id: existingEvent.promo_video_id },
        });
      }

      promoVideoId = newVideo.id;
    }

    // ----------------------------
    //     📌 UPDATE THE EVENT
    // ----------------------------
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title: title ?? existingEvent.title,
        description: description ?? existingEvent.description,
        location: location ?? existingEvent.location,
        start_date: start_date
          ? new Date(start_date)
          : existingEvent.start_date,
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


