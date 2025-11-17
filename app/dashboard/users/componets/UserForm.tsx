'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Role {
  id: string
  role_name: string
  description: string
}

interface User {
  id: string
  name: string
  email: string
  password?: string
  avatarUrl?: string
  createdAt?: string
  role_id: string
  role?: Role
}

interface UserFormProps {
  roles: Role[]
  onSubmit: (data: Partial<User>) => Promise<void>
  initialData?: User
  isEditing?: boolean
}

export function UserForm({
  roles,
  onSubmit,
  initialData,
  isEditing = false,
}: UserFormProps) {

  const validRoles = roles.filter(r => r.id && r.id.trim().length > 0)

  const defaultRole = initialData?.role_id || validRoles[0]?.id || ""

  const [formData, setFormData] = useState<Partial<User>>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    password: "",
    role_id: defaultRole,
  })

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSubmit(formData)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Full Name</label>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full name"
          required
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <Input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="user@example.com"
          required
        />
      </div>

      {/* Password - required only in create mode */}
      {!isEditing && (
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <Input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required={!isEditing}
          />
        </div>
      )}

      {/* Role Selection */}
      <div>
        <label className="block text-sm font-medium mb-1">Role</label>

        <Select
          value={formData.role_id}
          onValueChange={(value) =>
            setFormData(prev => ({ ...prev, role_id: value }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>

          <SelectContent>
            {validRoles.map(role => (
              <SelectItem key={role.id} value={role.id}>
                {role.role_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={loading} className="w-full">
        {loading
          ? isEditing
            ? "Updating..."
            : "Creating..."
          : isEditing
          ? "Update User"
          : "Create User"}
      </Button>
    </form>
  )
}
