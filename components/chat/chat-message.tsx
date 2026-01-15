'use client'

import { format } from 'date-fns'
import { Check, CheckCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { USER_TYPES } from '@/lib/db/schema'

interface ChatMessageProps {
  message: {
    id: string
    content: string
    sender_id: string
    created_at: string
    read: boolean
    sender?: {
      id: string
      full_name: string
      user_type: number
    }
  }
  isOwn: boolean
}

export function ChatMessage({ message, isOwn }: ChatMessageProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getUserTypeColor = (userType: number) => {
    return userType === USER_TYPES.PRODUCER ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
  }

  return (
    <div className={cn(
      'flex gap-3 mb-4',
      isOwn && 'flex-row-reverse'
    )}>
      {/* Avatar */}
      {!isOwn && message.sender && (
        <div className="shrink-0">
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold',
            getUserTypeColor(message.sender.user_type)
          )}>
            {getInitials(message.sender.full_name)}
          </div>
        </div>
      )}

      {/* Message content */}
      <div className={cn(
        'max-w-[70%]',
        isOwn && 'text-right'
      )}>
        <div className={cn(
          'rounded-2xl px-4 py-3',
          isOwn
            ? 'bg-linear-to-r from-brand to-orange-500 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-900 rounded-bl-none'
        )}>
          <p className="wrap-break-word">{message.content}</p>
        </div>

        {/* Message info */}
        <div className={cn(
          'flex items-center gap-2 mt-1 text-xs',
          isOwn ? 'justify-end' : 'justify-start'
        )}>
          <span className="text-gray-500">
            {format(new Date(message.created_at), 'HH:mm')}
          </span>
          {isOwn && (
            message.read ? (
              <CheckCheck className="w-3 h-3 text-brand" />
            ) : (
              <Check className="w-3 h-3 text-gray-400" />
            )
          )}
        </div>
      </div>
    </div>
  )
}