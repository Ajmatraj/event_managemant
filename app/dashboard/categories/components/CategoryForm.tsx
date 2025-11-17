'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Textarea,
} from '@/components/ui/textarea'

interface CategoryFormProps {
  onSubmit: (data: { name: string; description: string }) => void
  initialData?: { name: string; description: string }
  isEditing?: boolean
}

export function CategoryForm({
  onSubmit,
  initialData,
  isEditing = false,
}: CategoryFormProps) {
  const [formData, setFormData] = useState(
    initialData || {
      name: '',
      description: '',
    }
  )
  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
      if (!isEditing) {
        setFormData({ name: '', description: '' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-foreground">
          Category Name
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Music Concert"
          required
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="description" className="text-foreground">
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the category..."
          required
          rows={4}
          className="mt-2"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading} className="flex-1 bg-primary hover:bg-primary/90">
          {loading ? 'Saving...' : isEditing ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  )
}
