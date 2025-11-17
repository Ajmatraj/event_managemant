// "use client"

// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import type { Address } from "@prisma/client"
// import { Plus, Edit, Trash } from "lucide-react"

// interface AddressListProps {
//   addresses: Address[]
// }

// export function AddressList({ addresses }: AddressListProps) {
//   const handleDelete = async (id: string) => {
//     if (confirm("Are you sure you want to delete this address?")) {
//       try {
//         const res = await fetch(`/api/addresses/${id}`, {
//           method: "DELETE",
//         })

//         if (res.ok) {
//           window.location.reload()
//         }
//       } catch (error) {
//         console.error("Delete address error:", error)
//       }
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-xl font-semibold">Your Addresses</h2>
//         <Button asChild>
//           <Link href="/profile/addresses/new">
//             <Plus className="mr-2 h-4 w-4" />
//             Add New Address
//           </Link>
//         </Button>
//       </div>

//       {addresses.length === 0 ? (
//         <Card>
//           <CardContent className="py-6">
//             <p className="text-center text-muted-foreground">
//               You don't have any addresses yet. Add your first address to get started.
//             </p>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="grid gap-4 md:grid-cols-2">
//           {addresses.map((address) => (
//             <Card key={address.id}>
//               <CardHeader className="pb-2">
//                 <div className="flex justify-between items-start">
//                   <CardTitle className="text-lg">{address.name}</CardTitle>
//                   <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{address.type}</span>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-1 text-sm">
//                   <p>{address.address}</p>
//                   <p>
//                     {address.city}, {address.state} {address.zip}
//                   </p>
//                   <p>Phone: {address.phone}</p>
//                   <p>Email: {address.email}</p>
//                 </div>
//                 <div className="flex gap-2 mt-4">
//                   <Button variant="outline" size="sm" asChild>
//                     <Link href={`/profile/addresses/${address.id}`}>
//                       <Edit className="mr-2 h-4 w-4" />
//                       Edit
//                     </Link>
//                   </Button>
//                   <Button variant="outline" size="sm" onClick={() => handleDelete(address.id)}>
//                     <Trash className="mr-2 h-4 w-4" />
//                     Delete
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

