// "use client"

// import { useState, useEffect } from "react"
// import { getCategories } from "@/lib/actions"

// interface Category {
//   id: string
//   name: string
// }

// export function useCategories() {
//   const [categories, setCategories] = useState<Category[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<Error | null>(null)

//   useEffect(() => {
//     async function fetchCategories() {
//       try {
//         const data = await getCategories()
//         setCategories(data)
//       } catch (err) {
//         setError(err instanceof Error ? err : new Error("Failed to fetch categories"))
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchCategories()
//   }, [])

//   return { categories, isLoading, error }
// }

