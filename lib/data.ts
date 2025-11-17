// // This file contains shared data fetching functions for courses and videos.

// interface CourseData {
//   id: string
//   title: string
//   description: string
//   price: number
//   type: string
//   createdAt: string
//   updatedAt: string
//   imageUrl?: string
//   videoUrl?: string
//   videoPublicId?: string
//   imagePublicId?: string
//   teacherId: string
//   categoryId?: string
//   totalLessons?: number
//   enrolledStudents?: number
//   chapters?: any[]
// }

// interface CategoryData {
//   name: string
// }

// interface VideoData {
//   id: string
//   title: string
//   description?: string
//   publicId?: string
//   url?: string
//   duration?: number
//   thumbnail?: string
//   createdAt: string
//   originalSize?: string
//   compressedSize?: string
// }

// export async function getCourse(courseId: string): Promise<CourseData | null> {
//   try {
//     const response = await fetch(`http://localhost:3000/api/coursess/${courseId}`, {
//       cache: "no-store",
//     })
//     if (!response.ok) {
//       console.error(`Failed to fetch course ${courseId}: ${response.status} ${response.statusText}`)
//       return null
//     }
//     const data = await response.json()
//     return data.course
//   } catch (error) {
//     console.error("Error fetching course:", error)
//     return null
//   }
// }

// export async function getCategory(categoryId: string | undefined): Promise<CategoryData> {
//   if (!categoryId) return { name: "Uncategorized" }
//   try {
//     const response = await fetch(`http://localhost:3000/api/categories/${categoryId}`, {
//       cache: "no-store",
//     })
//     if (!response.ok) {
//       console.error(`Failed to fetch category ${categoryId}: ${response.status} ${response.statusText}`)
//       return { name: "Uncategorized" }
//     }
//     const data = await response.json()
//     return data.category
//   } catch (error) {
//     console.error("Error fetching category:", error)
//     return { name: "Uncategorized" }
//   }
// }

// export async function getCourseVideos(courseId: string): Promise<VideoData[]> {
//   try {
//     const response = await fetch(`http://localhost:3000/api/coursess/${courseId}/videos`, {
//       cache: "no-store",
//     })
//     if (!response.ok) {
//       console.error(`Failed to fetch videos for course ${courseId}: ${response.status} ${response.statusText}`)
//       return []
//     }
//     const data = await response.json()
//     return data.videos || []
//   } catch (error) {
//     console.error("Error fetching course videos:", error)
//     return []
//   }
// }
