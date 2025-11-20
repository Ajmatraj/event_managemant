'use client'

import { useState, useRef } from 'react'
import { Camera, Mail, Phone, Edit2, Save, X, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { toast } from 'react-toastify'

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string | null
  createdAt?: string
  avatarImage?: {
    image_url: string
  }
  role?: {
    id: string
    role_name: string
    description: string
  }
}

interface UserInfoSectionProps {
  user: UserProfile
  onUserUpdate: (updatedUser: UserProfile) => void
}

export default function UserInfoSection({ user, onUserUpdate }: UserInfoSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [editData, setEditData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    avatarFile: null as File | null
  })

  const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Unknown'

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        toast.error('File must be an image')
        return
      }
      setEditData({ ...editData, avatarFile: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    if (!editData.name.trim() || !editData.email.trim()) {
      toast.error('Name and email are required')
      return
    }

    try {
      setIsSaving(true)
      const formData = new FormData()
      formData.append('name', editData.name)
      formData.append('email', editData.email)
      formData.append('phone', editData.phone || '')
      
      if (editData.avatarFile) {
        formData.append('avatar', editData.avatarFile)
      }

      const response = await fetch(`http://localhost:3000/api/user/${user.id}`, {
        method: 'PUT',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const data = await response.json()
      onUserUpdate(data.user)
      setIsEditing(false)
      setAvatarPreview(null)
      setEditData({ ...editData, avatarFile: null })
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      avatarFile: null
    })
    setAvatarPreview(null)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <Card className="bg-gradient-to-r from-slate-800 to-slate-700 border-slate-700 p-8">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
          {/* Avatar Section */}
          <div className="relative">
            <Avatar className="w-32 h-32 border-4 border-blue-500 shadow-lg">
              <AvatarImage 
                src={avatarPreview || user.avatarImage?.image_url || "/placeholder.svg"} 
                alt={user.name} 
              />
              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            {isEditing && (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
              >
                <Camera size={16} />
              </button>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-3xl font-bold text-white mb-2 break-words">{user.name}</h2>
            <div className="flex flex-wrap gap-4 text-sm text-slate-300">
              <div className="flex items-center gap-2 break-all">
                <Mail size={16} className="text-blue-400 flex-shrink-0" />
                <span className="break-all">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-blue-400 flex-shrink-0" />
                  {user.phone}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 mt-3">
              <p className="text-slate-400 text-sm">Member since {joinDate}</p>
              {user.role && (
                <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full w-fit">
                  {user.role.role_name}
                </span>
              )}
            </div>
          </div>

          {/* Edit Button */}
          {!isEditing && (
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
            >
              <Edit2 size={16} className="mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </Card>

      {/* Edit Form */}
      {isEditing && (
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-xl font-bold text-white mb-6">Edit Profile Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Profile Picture</label>
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20 border-2 border-blue-500">
                  <AvatarImage 
                    src={avatarPreview || user.avatarImage?.image_url || "/placeholder.svg"} 
                    alt="Avatar preview" 
                  />
                  <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={isSaving}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 hover:bg-blue-700 text-white mb-2"
                    disabled={isSaving}
                  >
                    <Upload size={16} className="mr-2" />
                    Choose Image
                  </Button>
                  <p className="text-xs text-slate-400">Max 5MB, JPG/PNG/GIF</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <Input
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
                disabled={isSaving}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <Input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  disabled={isSaving}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                <Input
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  disabled={isSaving}
                />
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <Button 
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSaving}
              >
                <Save size={16} className="mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button 
                onClick={handleCancel}
                variant="outline"
                className="bg-slate-700 hover:bg-slate-600 border-slate-600 text-white"
                disabled={isSaving}
              >
                <X size={16} className="mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800 border-slate-700 p-4">
          <p className="text-slate-400 text-sm">Account Status</p>
          <p className="text-2xl font-bold text-green-400 mt-2">Active</p>
        </Card>
        <Card className="bg-slate-800 border-slate-700 p-4">
          <p className="text-slate-400 text-sm">Member Since</p>
          <p className="text-lg font-bold text-white mt-2">{joinDate}</p>
        </Card>
        <Card className="bg-slate-800 border-slate-700 p-4">
          <p className="text-slate-400 text-sm">Role</p>
          <p className="text-lg font-bold text-blue-400 mt-2">{user.role?.role_name || 'USER'}</p>
        </Card>
      </div>
    </div>
  )
}
