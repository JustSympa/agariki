'use client'

import { useCallback } from 'react'
import { format } from 'date-fns'
import { CheckCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { USER_TYPES } from '@/lib/db/schema'

interface ChatListItemProps {
  conversation: {
    id: string
    last_message_at: string
    last_message?: string
    unread_count?: number
    other_user?: {
      full_name: string
      user_type: number
    }
  }
  isActive: boolean
  onClick: (conversationId: string) => void
}

export function ChatListItem({ conversation, isActive, onClick }: ChatListItemProps) {
  const handleClick = useCallback(() => {
    onClick(conversation.id)
  }, [conversation.id, onClick])

  const getInitials = (name: string | null | undefined) => {
    return name ? name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) :
      ''
  }

  const getUserTypeColor = (userType: number) => {
    return userType === USER_TYPES.PRODUCER ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
  }

  const getUserTypeBadge = (userType: number) => {
    return userType === USER_TYPES.PRODUCER ? 'Producer' : 'Consumer'
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'w-full p-4 text-left transition-all duration-200 hover:bg-brand/5',
        isActive && 'bg-linear-to-r from-brand/10 to-transparent border-l-4 border-brand'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center font-semibold',
            getUserTypeColor(conversation.other_user?.user_type || 0)
          )}>
            {getInitials(conversation.other_user?.full_name || '??')}
          </div>
          {conversation.unread_count ? (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
              {conversation.unread_count}
            </div>
          ) : null}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-foreground truncate">
              {conversation.other_user?.full_name || 'Unknown User'}
            </h3>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">
                {format(new Date(conversation.last_message_at), 'HH:mm')}
              </span>
              {!conversation.unread_count && (
                <CheckCheck className="w-3 h-3 text-brand" />
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-1">
            <span className={cn(
              'px-2 py-0.5 rounded-full text-xs font-medium',
              conversation.other_user?.user_type === USER_TYPES.PRODUCER
                ? 'bg-green-100 text-green-700'
                : 'bg-blue-100 text-blue-700'
            )}>
              {getUserTypeBadge(conversation.other_user?.user_type || 0)}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 truncate">
            {conversation.last_message || 'No messages yet'}
          </p>
        </div>
      </div>
    </button>
  )
}