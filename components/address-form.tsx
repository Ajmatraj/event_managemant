// "use client"

// import type React from "react"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Loader2 } from "lucide-react"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import type { Address } from "@prisma/client"

// interface AddressFormProps {
//   address?: Address
//   isEditing?: boolean
// }

// export function AddressForm({ address, isEditing = false }: AddressFormProps) {
//   const [formData, setFormData] = useState({
//     type: address?.type || "HOME",
//     name: address?.name || "",
//     email: address?.email || "",
//     address: address?.address || "",
//     city: address?.city || "",
//     state: address?.state || "",
//     zip: address?.zip || "",
//     phone: address?.phone || "",
//   })
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const router = useRouter()

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleSelectChange = (name: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setError(null)

//     try {
//       const url = isEditing ? `/api/addresses/${address?.id}` : "/api/addresses"

//       const method = isEditing ? "PUT" : "POST"

//       const res = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       })

//       if (!res.ok) {
//         const data = await res.json()
//         throw new Error(data.error || "Failed to save address")
//       }

//       router.push("/profile/addresses")
//       router.refresh()
//     } catch (error) {
//       console.error("Save address error:", error)
//       setError(error instanceof Error ? error.message : "Failed to save address")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <Card className="max-w-2xl mx-auto">
//       <CardHeader>
//         <CardTitle>{isEditing ? "Edit Address" : "Add New Address"}</CardTitle>
//       </CardHeader>
//       <form onSubmit={handleSubmit}>
//         <CardContent className="space-y-4">
//           {error && (
//             <Alert variant="destructive">
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}

//           <div className="space-y-2">
//             <Label htmlFor="type">Address Type</Label>
//             <Select defaultValue={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select address type" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="HOME">Home</SelectItem>
//                 <SelectItem value="WORK">Work</SelectItem>
//                 <SelectItem value="OTHER">Other</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="name">Full Name</Label>
//               <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="address">Street Address</Label>
//             <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="city">City</Label>
//               <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="state">State</Label>
//               <Input id="state" name="state" value={formData.state} onChange={handleChange} required />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="zip">ZIP Code</Label>
//               <Input id="zip" name="zip" value={formData.zip} onChange={handleChange} required />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="phone">Phone Number</Label>
//             <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
//           </div>
//         </CardContent>
//         <CardFooter className="flex justify-between">
//           <Button type="button" variant="outline" onClick={() => router.back()}>
//             Cancel
//           </Button>
//           <Button type="submit" disabled={loading}>
//             {loading ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 {isEditing ? "Updating..." : "Saving..."}
//               </>
//             ) : isEditing ? (
//               "Update Address"
//             ) : (
//               "Save Address"
//             )}
//           </Button>
//         </CardFooter>
//       </form>
//     </Card>
//   )
// }

