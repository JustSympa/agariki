import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/lib/store'
import { 
  fetchConversations, 
  fetchMessages, 
  sendMessage, 
  startConversation,
  markMessagesAsRead,
//   subscribeToMessages,
  clearCurrentConversation,
  setCurrentConversation,
} from '@/lib/store/slices/chatSlice'
import { User as ChatUser } from '@/lib/db/schema'
import { chatService } from '@/lib/services/chatService'

export const useChat = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { 
    conversations, 
    currentConversation, 
    messages, 
    loading, 
    loadingMessages,
    error 
  } = useSelector((state: RootState) => state.chat)

//   const [subscription, setSubscription] = useState<any>(null)
  const [searchResults, setSearchResults] = useState<ChatUser[]>([])
  const [searching, setSearching] = useState(false)

  // Load conversations on mount
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchConversations(user.id))
    }
  }, [dispatch, user?.id])

  // Cleanup subscription on unmount
//   useEffect(() => {
//     return () => {
//       if (subscription) {
//         chatService.unsubscribe(subscription)
//       }
//     }
//   }, [subscription])

  // Load conversation messages
  const loadConversation = useCallback(async (conversationId: string) => {
    if (!user?.id) return

    // Clear current conversation first
    dispatch(clearCurrentConversation())

    // Load messages
    await dispatch(fetchMessages({ conversationId, userId: user.id }))

    // Get conversation details
    const conversation = conversations.find(c => c.id === conversationId)
    if (conversation) {
      dispatch(setCurrentConversation(conversation))
    }

    // Mark messages as read
    await dispatch(markMessagesAsRead({ conversationId, userId: user.id }))

    // Set up real-time subscription
    // if (subscription) {
    //   chatService.unsubscribe(subscription)
    // }

    // const newSubscription = chatService.subscribeToMessages(
    //   conversationId,
    //   (message) => {
    //     // Handle new message
    //     console.log('New message received:', message)
    //     // You can dispatch an action here if needed
    //   }
    // )

    // setSubscription(newSubscription)
  }, [dispatch, user?.id, conversations, /*subscription*/])

  // Send a message
  const sendMessageHandler = useCallback(async (content: string) => {
    if (!currentConversation?.id || !user?.id) {
      throw new Error('No active conversation or user')
    }

    if (!content.trim()) {
      throw new Error('Message cannot be empty')
    }

    return await dispatch(sendMessage({
      conversationId: currentConversation.id,
      senderId: user.id,
      content: content.trim(),
    })).unwrap()
  }, [dispatch, currentConversation?.id, user?.id])

  // Start a new conversation
  const startNewConversation = useCallback(async (otherUserId: string) => {
    if (!user?.id) {
      throw new Error('User not logged in')
    }

    const conversation = await dispatch(startConversation({
      participant1Id: user.id,
      participant2Id: otherUserId,
    })).unwrap()

    // Load the new conversation
    await loadConversation(conversation.id)

    return conversation
  }, [dispatch, user?.id, loadConversation])

  // Search for users
  const searchUsers = useCallback(async (query: string) => {
    if (!user?.id) return

    setSearching(true)
    try {
      const results = await chatService.searchUsers(query, user.id)
      setSearchResults(results)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }, [user?.id])

  // Get other user in conversation
  const getOtherUser = useCallback(() => {
    if (!currentConversation || !user?.id) return null
    
    if (currentConversation.participant1Id === user.id) {
      return currentConversation.participant2
    } else {
      return currentConversation.participant1
    }
  }, [currentConversation, user?.id])

  // Get conversation by user ID
  const getConversationWithUser = useCallback((otherUserId: string) => {
    return conversations.find(conv => 
      (conv.participant1Id === user?.id && conv.participant2Id === otherUserId) ||
      (conv.participant2Id === user?.id && conv.participant1Id === otherUserId)
    )
  }, [conversations, user?.id])

  return {
    // State
    conversations,
    currentConversation,
    messages,
    loading,
    loadingMessages,
    error,
    searchResults,
    searching,
    
    // Actions
    loadConversation,
    sendMessage: sendMessageHandler,
    startNewConversation,
    searchUsers,
    getOtherUser,
    getConversationWithUser,
    clearSearchResults: () => setSearchResults([]),
    
    // Helper functions
    getUnreadCount: () => conversations.reduce((sum, conv) => sum + (conv.unread_count || 0), 0),
    formatMessageTime: (timestamp: string) => {
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now.getTime() - date.getTime()
      const diffMinutes = Math.floor(diff / 60000)
      const diffHours = Math.floor(diff / 3600000)
      const diffDays = Math.floor(diff / 86400000)

      if (diffMinutes < 1) return 'Just now'
      if (diffMinutes < 60) return `${diffMinutes}m ago`
      if (diffHours < 24) return `${diffHours}h ago`
      if (diffDays < 7) return `${diffDays}d ago`
      return date.toLocaleDateString()
    },
  }
}