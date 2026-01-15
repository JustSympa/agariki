'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { 
  Map, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  User,
  MapPin,
  Bell,
  HelpCircle,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { USER_TYPES } from '@/lib/db/schema'

const navigation = [
  { name: 'Map', href: '/app/map', icon: Map, current: true },
  { name: 'Chats', href: '/app/chats', icon: MessageSquare, current: false },
  { name: 'Settings', href: '/app/settings', icon: Settings, current: false },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user } = useSelector((state: RootState) => state.auth)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    localStorage.clear()
    window.location.href = '/auth/login'
  }

  const getInitials = (name: string | null | undefined) => {
    return name ? name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) : 
      ''
  }

  return (
    <div className={`flex flex-col h-screen bg-white border-r border-brand/20 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo and toggle */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-brand/20">
        {!collapsed ? (
          <Link href="/app/map" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-brand/20 rounded-lg blur-sm group-hover:blur-md transition-all duration-300" />
              <Image 
                src="/logo.svg" 
                alt="Agariki Logo" 
                width={32} 
                height={32}
                className="relative group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div>
              <span className="text-xl font-bold text-foreground bg-linear-to-r from-brand to-brand/80 bg-clip-text">
                Agariki
              </span>
              <p className="text-xs text-brand font-medium">Fungus Ecosystem</p>
            </div>
          </Link>
        ) : (
          <Link href="/app/map" className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-brand/20 rounded-lg blur-sm" />
              <Image 
                src="/logo.svg" 
                alt="Agariki Logo" 
                width={32} 
                height={32}
                className="relative"
              />
            </div>
          </Link>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-brand hover:bg-brand/10"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                ${isActive 
                  ? 'bg-linear-to-r from-brand/10 to-brand/5 text-brand border-l-4 border-brand' 
                  : 'text-gray-700 hover:bg-brand/5 hover:text-brand hover:border-l-4 hover:border-brand/50'
                }
              `}
            >
              <item.icon className={`
                ${collapsed ? 'mx-auto' : 'mr-3'}
                w-5 h-5 transition-transform duration-200 group-hover:scale-110
                ${isActive ? 'text-brand' : 'text-gray-500 group-hover:text-brand'}
              `} />
              {!collapsed && (
                <>
                  <span>{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-brand rounded-full animate-pulse" />
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User profile and actions */}
      <div className="border-t border-brand/20 p-4">
        {/* Quick stats (only when expanded) */}
        {!collapsed && (
          <div className="mb-4 p-3 bg-linear-to-r from-brand/5 to-transparent rounded-xl border border-brand/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-linear-to-br from-brand to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {getInitials(user?.fullName)}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{user?.fullName}</p>
                  <p className="text-xs text-brand">{user?.userType == USER_TYPES.PRODUCER ? "Producer" : "Consumer"}</p>
                </div>
              </div>
              <Bell className="w-4 h-4 text-brand/60" />
            </div>
          </div>
        )}

        {/* User menu button */}
        <div className="relative">
          <Button
            variant="ghost"
            className={`w-full justify-start text-gray-700 hover:text-brand hover:bg-brand/5 ${collapsed ? 'px-2' : 'px-3'}`}
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <User className={`${collapsed ? 'mx-auto' : 'mr-3'} w-5 h-5`} />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">Profile</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-90' : ''}`} />
              </>
            )}
          </Button>

          {/* User dropdown menu */}
          {userMenuOpen && !collapsed && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl border border-brand/20 shadow-lg py-2">
              <Link
                href="/app/settings"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-brand/5 hover:text-brand"
                onClick={() => setUserMenuOpen(false)}
              >
                <Settings className="w-4 h-4 mr-3" />
                Account Settings
              </Link>
              <Link
                href="/app/settings?tab=poa"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-brand/5 hover:text-brand"
                onClick={() => setUserMenuOpen(false)}
              >
                <MapPin className="w-4 h-4 mr-3" />
                My Points
              </Link>
              <div className="border-t border-brand/20 my-2" />
              <Link
                href="/help"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-brand/5 hover:text-brand"
                onClick={() => setUserMenuOpen(false)}
              >
                <HelpCircle className="w-4 h-4 mr-3" />
                Help & Support
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Sign out button (collapsed) */}
        {collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="w-full mt-2 text-red-600 hover:bg-red-50"
            title="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  )
}