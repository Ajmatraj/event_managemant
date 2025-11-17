'use client'

import { useState } from 'react'
import { Camera, Mail, Phone, MapPin, Edit2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

export default function UserInfoSection() {
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'Kathmandu, Nepal',
    joinDate: 'January 2024'
  })

  const [editData, setEditData] = useState(userData)

  const handleEdit = () => {
    setIsEditing(true)
    setEditData(userData)
  }

  const handleSave = () => {
    setUserData(editData)
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
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt={userData.name} />
              <AvatarFallback>{userData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors">
              <Camera size={18} />
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-2">{userData.name}</h2>
            <div className="flex flex-wrap gap-4 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-blue-400" />
                {userData.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-blue-400" />
                {userData.phone}
              </div>
            </div>
            <p className="text-slate-400 mt-3 text-sm">Member since {userData.joinDate}</p>
          </div>

          {/* Edit Button */}
          <Button 
            onClick={handleEdit}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Edit2 size={16} className="mr-2" />
            Edit Profile
          </Button>
        </div>
      </Card>

      {/* Edit Form */}
      {isEditing && (
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-xl font-bold text-white mb-6">Edit Profile Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <Input
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
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
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                <Input
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
              <Input
                value={editData.location}
                onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="flex gap-4 pt-4">
              <Button 
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
              <Button 
                onClick={() => setIsEditing(false)}
                variant="outline"
                className="bg-slate-700 hover:bg-slate-600 border-slate-600 text-white"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800 border-slate-700 p-4">
          <p className="text-slate-400 text-sm">Events Attended</p>
          <p className="text-3xl font-bold text-white mt-2">12</p>
        </Card>
        <Card className="bg-slate-800 border-slate-700 p-4">
          <p className="text-slate-400 text-sm">Total Spent</p>
          <p className="text-3xl font-bold text-white mt-2">₹45,000</p>
        </Card>
        <Card className="bg-slate-800 border-slate-700 p-4">
          <p className="text-slate-400 text-sm">Member Points</p>
          <p className="text-3xl font-bold text-white mt-2">8,500</p>
        </Card>
      </div>
    </div>
  )
}
