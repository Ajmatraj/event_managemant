'use client'

import { useState } from 'react'
import { Lock, Smartphone, Eye, EyeOff, Bell, Trash2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export default function SecuritySettingsSection() {
  const [showPassword, setShowPassword] = useState(false)
  const [twoFAEnabled, setTwoFAEnabled] = useState(false)
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  const devices = [
    { id: 1, name: 'Chrome - Windows', lastActive: '2 minutes ago', current: true },
    { id: 2, name: 'Safari - iPhone', lastActive: '5 hours ago', current: false },
    { id: 3, name: 'Firefox - macOS', lastActive: '2 days ago', current: false }
  ]

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card className="bg-slate-800 border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="text-blue-400" size={24} />
          <h3 className="text-xl font-bold text-white">Change Password</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Current Password</label>
            <Input
              type="password"
              placeholder="Enter your current password"
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                className="bg-slate-700 border-slate-600 text-white pr-10"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
            <Input
              type="password"
              placeholder="Confirm new password"
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto">
            Update Password
          </Button>
        </div>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="bg-slate-800 border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Smartphone className="text-blue-400" size={24} />
            <div>
              <h3 className="text-xl font-bold text-white">Two-Factor Authentication</h3>
              <p className="text-slate-400 text-sm">Add an extra layer of security</p>
            </div>
          </div>
          <Badge className={twoFAEnabled ? 'bg-green-500/20 text-green-400' : 'bg-slate-600/20 text-slate-400'}>
            {twoFAEnabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </div>

        <p className="text-slate-400 text-sm mb-4">
          Two-factor authentication adds an extra security layer to your account by requiring a code from your phone when you sign in.
        </p>

        <Button
          onClick={() => setTwoFAEnabled(!twoFAEnabled)}
          className={twoFAEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}>
          {twoFAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
        </Button>
      </Card>

      {/* Manage Devices */}
      <Card className="bg-slate-800 border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Smartphone className="text-blue-400" size={24} />
          <h3 className="text-xl font-bold text-white">Active Devices</h3>
        </div>

        <div className="space-y-4">
          {devices.map((device) => (
            <div key={device.id} className="bg-slate-700 rounded-lg p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <p className="font-semibold text-white">{device.name}</p>
                  {device.current && (
                    <Badge className="bg-blue-500/20 text-blue-400">Current</Badge>
                  )}
                </div>
                <p className="text-slate-400 text-sm">Last active: {device.lastActive}</p>
              </div>
              {!device.current && (
                <Button
                  variant="outline"
                  className="bg-red-600/10 hover:bg-red-600/20 border-red-600/50 text-red-400"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card className="bg-slate-800 border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="text-blue-400" size={24} />
          <h3 className="text-xl font-bold text-white">Notification Preferences</h3>
        </div>

        <div className="space-y-4">
          {[
            { label: 'Event Reminders', description: 'Get reminded about upcoming events' },
            { label: 'Email Notifications', description: 'Receive updates via email' },
            { label: 'Marketing Emails', description: 'Receive promotional offers and news' }
          ].map((pref) => (
            <div key={pref.label} className="flex items-center justify-between py-3 border-b border-slate-600 last:border-0">
              <div>
                <p className="font-medium text-white">{pref.label}</p>
                <p className="text-slate-400 text-sm">{pref.description}</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 cursor-pointer" />
            </div>
          ))}
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-red-950/20 border-red-900/30 p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="text-red-400" size={24} />
          <h3 className="text-xl font-bold text-red-400">Danger Zone</h3>
        </div>

        <p className="text-slate-400 text-sm mb-6">
          Once you delete your account, there is no going back. Please be certain.
        </p>

        <Button className="bg-red-600 hover:bg-red-700 text-white">
          <Trash2 size={16} className="mr-2" />
          Delete Account
        </Button>
      </Card>
    </div>
  )
}
