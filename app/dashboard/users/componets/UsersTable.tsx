'use client'

import { Button } from '@/components/ui/button'
import { Eye, Edit2, Trash2 } from 'lucide-react'
import React from 'react'

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
  avatarUrl?: string
  createdAt?: string
  role_id: string
  role?: {
    id: string
    role_name: string
    description: string
  }
}

interface UsersTableProps {
  users: User[]
  roles: Role[]
  loading: boolean
  onView: (user: User) => void
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  onRoleChange?: (userId: string, roleId: string) => void
}

export function UsersTable({
  users,
  roles,
  loading,
  onView,
  onEdit,
  onDelete,
  onRoleChange,
}: UsersTableProps) {
  const getRoleName = (roleId: string) => {
    return roles.find((r) => r.id === roleId)?.role_name || 'Unknown'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading users...</p>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-12">
        <p className="text-muted-foreground">No users found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto border border-border rounded-lg bg-card">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
              Name
            </th>
            <th className="hidden sm:table-cell px-4 py-3 text-left text-sm font-semibold text-foreground">
              Email
            </th>
            <th className="hidden md:table-cell px-4 py-3 text-left text-sm font-semibold text-foreground">
              Role
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-border hover:bg-muted/30 transition-colors"
            >
              <td className="px-4 py-3 text-sm text-foreground">
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground sm:hidden">{user.email}</div>
              </td>
              <td className="hidden sm:table-cell px-4 py-3 text-sm text-muted-foreground">
                {user.email}
              </td>
              <td className="hidden md:table-cell px-4 py-3 text-sm text-muted-foreground">
                {user.role?.role_name || getRoleName(user.role_id)}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(user)}
                    title="View"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(user)}
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(user)}
                    title="Delete"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
