'use client'

import { useState } from 'react'
import { User, Lock, Bell, Smartphone, LogOut, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import UserInfoSection from './components/UserInfoSection' 
import TicketBookingsSection from './components/TicketBookingsSection' 
import SecuritySettingsSection from './components/SecuritySettingsSection' 
import TicketDetailModal from './components/TicketDetailModal' 
import { Header } from '@/components/header'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [showTicketModal, setShowTicketModal] = useState(false)

  return (
    <>
    <Header />
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Account Settings</h1>
          <p className="text-slate-400">Manage your profile, tickets, and security settings</p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800 border border-slate-700">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User size={18} />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center gap-2">
              <Smartphone size={18} />
              <span className="hidden sm:inline">My Tickets</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock size={18} />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6 mt-8">
            <UserInfoSection />
          </TabsContent>

          {/* Tickets Tab */}
          <TabsContent value="tickets" className="space-y-6 mt-8">
            <TicketBookingsSection 
              onSelectTicket={(ticket) => {
                setSelectedTicket(ticket)
                setShowTicketModal(true)
              }}
            />
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6 mt-8">
            <SecuritySettingsSection />
          </TabsContent>
        </Tabs>
      </div>

      {/* Ticket Detail Modal */}
      {showTicketModal && selectedTicket && (
        <TicketDetailModal 
          ticket={selectedTicket} 
          onClose={() => setShowTicketModal(false)}
        />
      )}
    </div>
    </>

  )
}
