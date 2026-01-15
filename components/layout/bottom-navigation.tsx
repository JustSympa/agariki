'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Map, MessageSquare, Settings, Bell, User } from 'lucide-react'

const navigation = [
  { name: 'Map', href: '/app/map', icon: Map },
  { name: 'Chats', href: '/app/chats', icon: MessageSquare },
  // { name: 'Notifications', href: '/app/notifications', icon: Bell },
  { name: 'Profile', href: '/app/settings', icon: User },
]

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <div className="bg-white/95 backdrop-blur-lg border-t border-brand/20 shadow-lg">
      <div className="flex justify-around items-center h-16">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex flex-col items-center justify-center w-full h-full transition-all duration-200
                ${isActive ? 'text-brand' : 'text-gray-500'}
              `}
            >
              <div className={`
                relative p-2 rounded-xl transition-all duration-200
                ${isActive ? 'bg-brand/10' : 'hover:bg-brand/5'}
              `}>
                <item.icon className="w-5 h-5" />
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-brand rounded-full animate-pulse" />
                )}
              </div>
              <span className={`
                text-xs mt-1 transition-all duration-200
                ${isActive ? 'font-semibold scale-105' : 'font-medium'}
              `}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}