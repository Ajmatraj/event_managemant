'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { UsersTable } from './componets/UsersTable' 
import { UserForm } from './componets/UserForm'  
import { Plus, Search, AlertTriangle } from 'lucide-react'
import { ToastContainer, toast } from 'react-toastify'

interface Role {
  id: string
  role_name: string
  description: string
}

interface User {
  id: string
  name: string
  email: string
  phone?: string
 avatarImage?: {
    image_url: string
  }
  createdAt?: string
  role_id: string
  role?: {
    id: string
    role_name: string
    description: string
  }
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch users and roles
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch users
        const usersResponse = await fetch('http://localhost:3000/api/user')
        const usersData = await usersResponse.json()
        const userList = usersData.users || []
        setUsers(userList)
        setFilteredUsers(userList)

        // Fetch roles
        const rolesResponse = await fetch('http://localhost:3000/api/user/role/')
        const rolesData = await rolesResponse.json()
        setRoles(rolesData.roles || [])
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load users and roles')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter users based on search and status
  useEffect(() => {
    const filtered = users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesSearch
    })
    setFilteredUsers(filtered)
  }, [searchQuery, users])

  const handleAddUser = async (formData: Partial<User>) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/adduser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const newUser = await response.json()
        setUsers([...users, newUser.user])
        setIsAddDialogOpen(false)
        toast.success('User created successfully!')
      } else {
        toast.error('Failed to create user')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      toast.error('Error creating user')
    }
  }

const handleUpdateUser = async (formData: Partial<User>) => {
  if (!selectedUser) return;

  try {
    const fd = new FormData();

    if (formData.name) fd.append("name", formData.name);
    if (formData.email) fd.append("email", formData.email);
    if (formData.phone) fd.append("phone", formData.phone);
    if (formData.role_id) fd.append("role_id", formData.role_id);

    // avatar file comes as formData.avatarFile (you will set this in form)
    if ((formData as any).avatarFile) {
      fd.append("avatar", (formData as any).avatarFile);
    }

    const response = await fetch(
      `http://localhost:3000/api/user/${selectedUser.id}`,
      {
        method: "PUT",
        body: fd, // 🚀 IMPORTANT — NO HEADERS
      }
    );

    if (response.ok) {
      const updatedUser = await response.json();

      setUsers(
        users.map(u =>
          u.id === selectedUser.id ? updatedUser.user : u
        )
      );

      setIsEditDialogOpen(false);
      setSelectedUser(null);
      toast.success("User updated successfully!");
    } else {
      toast.error("Failed to update user");
    }
  } catch (error) {
    console.error("Error updating user:", error);
    toast.error("Error updating user");
  }
};


  const handleUpdateUserRole = async (userId: string, roleId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/user/role/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role_id: roleId }),
      })

      if (response.ok) {
        setUsers(
          users.map((u) =>
            u.id === userId ? { ...u, role_id: roleId } : u
          )
        )
        toast.success('User role updated successfully!')
      } else {
        toast.error('Failed to update user role')
      }
    } catch (error) {
      console.error('Error updating user role:', error)
      toast.error('Error updating user role')
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    try {
      setIsDeleting(true)
      const response = await fetch(`http://localhost:3000/api/user/${selectedUser.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to delete user')
        return
      }

      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id))
      setIsDeleteDialogOpen(false)
      setSelectedUser(null)
      toast.success('User deleted successfully!')
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setIsViewDialogOpen(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)
  }

  const handleConfirmDelete = (user: User) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setStatusFilter('')
  }

  const getRoleName = (roleId: string) => {
    return roles.find((r) => r.id === roleId)?.role_name || 'Unknown'
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">User Management</h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Create, update, and manage system users
            </p>
          </div>

          {/* Add User Button */}
          <div className="mb-6">
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6 border-border bg-card p-4 sm:p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {searchQuery && (
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="w-full sm:w-auto"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </Card>

          {/* Users Table */}
          <UsersTable
            users={filteredUsers}
            roles={roles}
            loading={loading}
            onView={handleViewUser}
            onEdit={handleEditUser}
            onDelete={handleConfirmDelete}
            onRoleChange={handleUpdateUserRole}
          />
        </div>

        {/* Add User Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account in the system
              </DialogDescription>
            </DialogHeader>
            <UserForm roles={roles} onSubmit={handleAddUser} />
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user details and role assignment
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <UserForm
                roles={roles}
                onSubmit={handleUpdateUser}
                initialData={selectedUser}
                isEditing
              />
            )}
          </DialogContent>
        </Dialog>

        {/* View User Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-lg mx-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {selectedUser?.name}
              </DialogTitle>
              <DialogDescription>
                User ID: {selectedUser?.id}
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">Email</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{selectedUser.email}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">Phone</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{selectedUser.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">Role</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{selectedUser.role?.role_name || getRoleName(selectedUser.role_id)}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">Member Since</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsViewDialogOpen(false)
                      handleEditUser(selectedUser)
                    }}
                    className="w-full sm:w-auto"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setIsViewDialogOpen(false)
                      handleConfirmDelete(selectedUser)
                    }}
                    className="w-full sm:w-auto"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-sm mx-auto">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <DialogTitle className="text-destructive">Delete User</DialogTitle>
                </div>
              </div>
              <DialogDescription className="mt-4">
                Are you sure you want to delete <span className="font-semibold text-foreground">
                  {selectedUser?.name}
                </span>? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isDeleting}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="w-full sm:w-auto"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
