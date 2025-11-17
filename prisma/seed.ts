import { PrismaClient, PaymentStatus, EventStatus, PaymentMethod } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seeding...")

  const hashPassword = async (password: string) => await hash(password, 10)

  // 🧩 Roles
  const roles = await Promise.all([
    prisma.roleTable.upsert({
      where: { role_name: "ADMIN" },
      update: {},
      create: { role_name: "ADMIN", description: "System administrator with full privileges" },
    }),
    prisma.roleTable.upsert({
      where: { role_name: "ORGANIZER" },
      update: {},
      create: { role_name: "ORGANIZER", description: "Event organizer who manages events" },
    }),
    prisma.roleTable.upsert({
      where: { role_name: "USER" },
      update: {},
      create: { role_name: "USER", description: "Registered attendee or customer" },
    }),
  ])

  console.log("✅ Roles created:", roles.map((r) => r.role_name))

  // 🔐 Users
  const adminPassword = await hashPassword("admin123")
  const organizerPassword = await hashPassword("organizer123")
  const userPassword = await hashPassword("user123")

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      role: { connect: { id: roles.find((r) => r.role_name === "ADMIN")!.id } },
    },
  })

  const organizer = await prisma.user.upsert({
    where: { email: "organizer@example.com" },
    update: {},
    create: {
      name: "Organizer User",
      email: "organizer@example.com",
      password: organizerPassword,
      role: { connect: { id: roles.find((r) => r.role_name === "ORGANIZER")!.id } },
    },
  })

  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      name: "Normal User",
      email: "user@example.com",
      password: userPassword,
      role: { connect: { id: roles.find((r) => r.role_name === "USER")!.id } },
    },
  })

  console.log("✅ Users created:", [admin.email, organizer.email, user.email])

  // 🏷️ Event Categories
  await prisma.eventCategory.createMany({
    data: [
      { name: "Concerts", description: "Live music and entertainment events" },
      { name: "Tech Conferences", description: "Technology and innovation summits" },
      { name: "Workshops", description: "Hands-on learning sessions" },
    ],
    skipDuplicates: true,
  })

  const concertCategory = await prisma.eventCategory.findFirst({
    where: { name: "Concerts" },
  })

  // 🖼️ Media for Event
  const bannerImage = await prisma.image.create({
    data: {
      image_url: "https://example.com/banner.jpg",
      image_title: "Event Banner",
      image_type: "BANNER",
    },
  })

  const promoVideo = await prisma.video.create({
    data: {
      video_url: "https://example.com/promo.mp4",
      video_title: "Promotional Video",
      video_type: "PROMO",
      duration: "2m30s",
    },
  })

  // 🎪 Event
  const event = await prisma.event.create({
    data: {
      title: "Nepal Music Fest 2025",
      description: "A grand concert celebrating Nepali artists",
      event_type: "Physical",
      location: "Kathmandu Durbar Square",
      start_date: new Date("2025-12-10T18:00:00Z"),
      end_date: new Date("2025-12-10T23:00:00Z"),
      status: EventStatus.UPCOMING,
      capacity: 5000,
      organizer_id: organizer.id,
      category_id: concertCategory!.id,
      banner_image_id: bannerImage.id,
      promo_video_id: promoVideo.id,
    },
  })

  console.log(`🎤 Event created: ${event.title}`)

  // 🎫 Ticket Types (UPDATED WITH event_id)
  const [vip, regular] = await Promise.all([
    prisma.ticketType.create({
      data: {
        name: "VIP",
        description: "Front row seating with backstage access",
        price: 150.0,
        event_id: event.id,
      },
    }),
    prisma.ticketType.create({
      data: {
        name: "Regular",
        description: "General admission",
        price: 50.0,
        event_id: event.id,
      },
    }),
  ])

  // 🎟️ Ticket for User
  const ticket = await prisma.ticket.create({
    data: {
      event_id: event.id,
      user_id: user.id,
      type_id: regular.id,
      qr_code: "QR123USER",
      status: "BOOKED",
    },
  })

  // 💳 Payment
  await prisma.payment.create({
    data: {
      ticket_id: ticket.id,
      user_id: user.id,
      amount: 50.0,
      payment_method: PaymentMethod.CASH,
      payment_status: PaymentStatus.SUCCESS,
    },
  })

  console.log("💳 Ticket and Payment created for user.")
  console.log("✅ Seeding completed successfully!")
}

// Run seeding
main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e)
    await prisma.$disconnect()
    process.exit(1)
  })
