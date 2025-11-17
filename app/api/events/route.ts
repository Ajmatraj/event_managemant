import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadBufferToCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {

  try {
    const formData = await req.formData();
    console.log("📦 Parsed form data successfully.");

    // ✅ Log all keys for debugging
    const keys = Array.from(formData.keys());
    console.log("🧩 Received FormData keys:", keys);

    // Extract fields safely
    const organizer_id = formData.get("organizer_id") as string | null;
    const category_id = formData.get("category_id") as string | null;
    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const event_type = formData.get("event_type") as string | null;
    const location = formData.get("location") as string | null;
    const start_date = formData.get("start_date") as string | null;
    const end_date = formData.get("end_date") as string | null;
    const capacityRaw = formData.get("capacity");
    const capacity = capacityRaw ? Number(capacityRaw) : 0;
    const status = (formData.get("status") as string) || "UPCOMING";

    // Basic validation
    if (!organizer_id || !category_id || !title || !start_date || !end_date) {
      console.error("❌ Missing required fields:", {
        organizer_id,
        category_id,
        title,
        start_date,
        end_date,
      });
      return NextResponse.json(
        { error: "Missing required event details." },
        { status: 400 }
      );
    }

    console.log("🧾 Event Details:", {
      organizer_id,
      category_id,
      title,
      description,
      event_type,
      location,
      start_date,
      end_date,
      capacity,
      status,
    });

    // ✅ Get Files
    const bannerFile = formData.get("bannerImage") as File | null;
    const promoFile = formData.get("promoVideo") as File | null;

    console.log("📁 File Info:", {
      bannerFile: bannerFile
        ? { name: bannerFile.name, type: bannerFile.type, size: bannerFile.size }
        : "No banner file received",
      promoFile: promoFile
        ? { name: promoFile.name, type: promoFile.type, size: promoFile.size }
        : "No promo file received",
    });

    let bannerImageId: string | undefined;
    let promoVideoId: string | undefined;

    // ✅ Upload banner image if provided
    if (bannerFile) {
      console.log("📤 Uploading banner image...");
      try {
        const buffer = Buffer.from(await bannerFile.arrayBuffer());
        const uploadRes = await uploadBufferToCloudinary(
          buffer,
          bannerFile.type,
          "event_banners"
        );
        console.log("🖼️ Cloudinary banner upload result:", uploadRes);

        if (!uploadRes?.url) throw new Error("No URL returned from Cloudinary");

        const banner = await prisma.image.create({
          data: {
            image_url: uploadRes.url,
            image_type: "BANNER",
          },
        });
        console.log("✅ Banner image record created:", banner);
        bannerImageId = banner.id;
      } catch (err) {
        console.error("❌ Banner upload or DB insert failed:", err);
      }
    } else {
      console.warn("⚠️ No banner image provided in request.");
    }

    // ✅ Upload promo video if provided
    if (promoFile) {
      console.log("📤 Uploading promo video...");
      try {
        const buffer = Buffer.from(await promoFile.arrayBuffer());
        const uploadRes = await uploadBufferToCloudinary(
          buffer,
          promoFile.type,
          "event_videos"
        );
        console.log("🎬 Cloudinary promo upload result:", uploadRes);

        if (!uploadRes?.url) throw new Error("No URL returned from Cloudinary");

        const video = await prisma.video.create({
          data: {
            video_url: uploadRes.url,
            video_type: "PROMO",
          },
        });
        console.log("✅ Promo video record created:", video);
        promoVideoId = video.id;
      } catch (err) {
        console.error("❌ Promo upload or DB insert failed:", err);
      }
    } else {
      console.warn("⚠️ No promo video provided in request.");
    }

    // ✅ Create Event in DB
    console.log("🧱 Creating event in Prisma...");
    const event = await prisma.event.create({
      data: {
        organizer_id,
        category_id,
        title,
        description: description || "",
        event_type: event_type || "General",
        location: location || "Unknown",
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        capacity,
        status,
        banner_image_id: bannerImageId,
        promo_video_id: promoVideoId,
      },
      include: {
        bannerImage: true,
        promoVideo: true,
      },
    });

    console.log("✅ Event created successfully with ID:", event.id);
    return NextResponse.json(
      { message: "✅ Event created successfully", event },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("💥 [EVENT_API] Fatal error creating event:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error.message || "Unknown error",
        stack: error.stack || "No stack trace available",
      },
      { status: 500 }
    );
  }
}



// ✅ Get all events with related data (category, organizer, banner, video)
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { created_at: "desc" },
      include: {
        category: {
          select: { id: true, name: true, description: true },
        },
        organizer: {
          select: { id: true, name: true, email: true },
        },
        bannerImage: {
          select: {
            id: true,
            image_title: true,
            image_url: true,
          },
        },
        promoVideo: {
          select: {
            id: true,
            video_title: true,
            video_url: true,
          },
        },
      },
    })

    if (!events || events.length === 0) {
      return NextResponse.json(
        { message: "No events found", events: [] },
        { status: 200 }
      )
    }

    // ✅ Transform to frontend-friendly format
    const formattedEvents = events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      eventType: event.event_type,
      location: event.location,
      startDate: event.start_date,
      endDate: event.end_date,
      capacity: event.capacity,
      status: event.status,
      createdAt: event.created_at,
      category: event.category,
      organizer: event.organizer,
      bannerImage: event.bannerImage?.image_url || null,
      bannerImageId: event.bannerImage?.id || null,
      promoVideo: event.promoVideo?.video_url || null,
      promoVideoId: event.promoVideo?.id || null,
    }))

    return NextResponse.json(
      {
        message: "✅ Events fetched successfully",
        count: formattedEvents.length,
        events: formattedEvents,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("❌ Error fetching events:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
