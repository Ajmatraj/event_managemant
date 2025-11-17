// "use server"

// import prisma from "@/lib/prisma"
// import { getSession } from "@/lib/auth"
// import { redirect } from "next/navigation"
// import { Role } from "@prisma/client"

// // Course actions
// export async function getCourses() {
//   const session = await getSession()

//   if (!session) {
//     redirect("/login")
//   }

//   return prisma.course.findMany({
//     include: {
//       category: {
//         select: {
//           name: true,
//         },
//       },
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//   })
// }

// export async function addCourse(data: {
//   title: string
//   description: string
//   categoryId: string
//   price: number
// }) {
//   const session = await getSession()

//   if (!session) {
//     redirect("/login")
//   }

//   const user = await prisma.user.findUnique({
//     where: { id: session.id as string },
//     select: { role: true },
//   })

//   if (!user || user.role !== ("TEACHER" as Role)) {
//     throw new Error("Unauthorized")
//   }

//   return prisma.course.create({
//     data: {
//       title: data.title,
//       description: data.description,
//       categoryId: data.categoryId,
//       price: data.price,
//       teacherId: session.id as string,
//     },
//   })
// }

// export async function deleteCourse(id: string) {
//   const session = await getSession()

//   if (!session) {
//     redirect("/login")
//   }

//   const user = await prisma.user.findUnique({
//     where: { id: session.id as string },
//     select: { role: true },
//   })

//   if (user?.role !== ("TEACHER" as Role)) {
//     throw new Error("Unauthorized")
//   }

//   return prisma.course.delete({
//     where: { id },
//   })
// }

// // Category actions
// export async function getCategories() {
//   const session = await getSession()

//   if (!session) {
//     redirect("/login")
//   }

//   return prisma.category.findMany({
//     include: {
//       _count: {
//         select: {
//           courses: true,
//         },
//       },
//     },
//     orderBy: {
//       name: "asc",
//     },
//   })
// }

// export async function addCategory(data: { name: string }) {
//   const session = await getSession()

//   if (!session) {
//     redirect("/login")
//   }

//   const user = await prisma.user.findUnique({
//     where: { id: session.id as string },
//     select: { role: true },
//   })

//   if (user?.role !== ("TEACHER" as Role)) {
//     throw new Error("Unauthorized")
//   }

//   return prisma.category.create({
//     data: {
//       name: data.name,
//       slug: data.name.toLowerCase().replace(/\s+/g, "-"), // Generate slug from name
//     },
//   })
// }

// export async function deleteCategory(id: string) {
//   const session = await getSession()

//   if (!session) {
//     redirect("/login")
//   }

//   const user = await prisma.user.findUnique({
//     where: { id: session.id as string },
//     select: { role: true },
//   })

//   if (user?.role !== ("TEACHER" as Role)) {
//     throw new Error("Unauthorized")
//   }

//   return prisma.category.delete({
//     where: { id },
//   })
// }

