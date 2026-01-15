import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '@/src/api'
import { User } from '@/lib/db/schema'

export interface Conversation {
  id: string
  participant1Id: string
  participant2Id: string
  lastMessageAt: string | Date
  createdAt: string | Date
  participant1?: User | null
  participant2?: User | null
  unread_count?: number
  last_message?: string
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  read: boolean
  createdAt: string | Date
  sender?: User
}

interface ChatState {
  conversations: Conversation[]
  currentConversation: Conversation | null
  messages: Message[]
  loading: boolean
  loadingMessages: boolean
  error: string | null
  participants: Record<string, User>
}

const initialState: ChatState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  loading: false,
  loadingMessages: false,
  error: null,
  participants: {},
}

// Fetch user's conversations
export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (userId: string) => {
    
    // Get conversations where user is participant
    const convs = await api.conversations.with(userId)


    // Get participant details and unread counts
    const enrichedConversations = await Promise.all(
      convs.map(async (conv) => {
        const otherUserId = conv.participant1Id === userId ? conv.participant2Id : conv.participant1Id
        
        // Get other participant details
        const participant = await api.users.read(otherUserId)

        // Get unread message count
        const { unreadCount } = await api.conversations.unreadc(conv.id, userId)

        // Get last message
        const lastMessage  = await api.conversations.lastmsg(conv.id)

        return {
          ...conv,
          participant1: conv.participant1Id === userId ? null : participant,
          participant2: conv.participant2Id === userId ? null : participant,
          unread_count: unreadCount || 0,
          last_message: lastMessage?.content || '',
        }
      })
    )

    return enrichedConversations
  }
)

// Fetch conversation messages
export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async ({ conversationId, userId }: { conversationId: string; userId: string }) => {
    
    // Get messages
    const msgs = await api.conversations.msg(conversationId)

    // Get sender details for each message
    const enrichedMessages = await Promise.all(
      msgs.map(async (msg) => {
        const sender = await api.users.read(msg.senderId)

        // Mark message as read if not sender
        if (msg.senderId !== userId && !msg.read) {
          await api.messages.asread(msg.id)
        }

        return {
          ...msg,
          sender,
        }
      })
    )

    return enrichedMessages
  }
)

// Send a message
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ 
    conversationId, 
    senderId, 
    content 
  }: { 
    conversationId: string; 
    senderId: string; 
    content: string 
  }) => {
    
    // Create message
    const message = await api.messages.new({
        conversationId: conversationId,
        senderId: senderId,
        content,
        read: false,
      })


    // Update conversation's last_message_at
    // await db
    //   .update(conversations)
    //   .set({ lastMessageAt: new Date()})
    //   .where(eq(conversations.id, conversationId))

    // Get sender details
    const sender = await api.users.read(senderId)

    return {
      ...message,
      sender,
    }
  }
)

// Start a new conversation
export const startConversation = createAsyncThunk(
  'chat/startConversation',
  async ({ 
    participant1Id, 
    participant2Id 
  }: { 
    participant1Id: string; 
    participant2Id: string 
  }) => {
    
    // Check if conversation already exists
    const existingConv  = await api.conversations.exists(participant1Id, participant2Id)

    if (existingConv) {
      return existingConv
    }

    // Create new conversation
    const conversation = await api.conversations.new(participant1Id, participant2Id)

    return conversation
  }
)

// Search for users to chat with
export const searchUsers = createAsyncThunk(
  'chat/searchUsers',
  async ({ query, excludeUserId }: { query: string; excludeUserId: string }) => {
    
    const result = await api.users.search(excludeUserId, query)

    return result
  }
)

// Mark messages as read
export const markMessagesAsRead = createAsyncThunk(
  'chat/markMessagesAsRead',
  async ({ conversationId, userId }: { conversationId: string; userId: string }) => {
    
    await api.conversations.asread(conversationId, userId)

    return conversationId
  }
)

// Real-time subscription for new messages
// export const subscribeToMessages = createAsyncThunk(
//   'chat/subscribeToMessages',
//   async ({ conversationId, dispatch }: { conversationId: string; dispatch: any }) => {
    
//     return supabase
//       .channel(`messages:${conversationId}`)
//       .on(
//         'postgres_changes',
//         {
//           event: 'INSERT',
//           schema: 'public',
//           table:(messages,
//           filter: `conversationId=eq.${conversationId}`,
//         },
//         (payload) => {
//           // Dispatch action to add new message
//           dispatch(addNewMessage(payload.new as Message))
//         }
//       )
//       .subscribe()
//   }
// )

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload
    },
    clearCurrentConversation: (state) => {
      state.currentConversation = null
      state.messages = []
    },
    addNewMessage: (state, action) => {
      if (state.currentConversation?.id === action.payload.conversationId) {
        state.messages.push(action.payload)
        // Update conversation's last message
        if (state.currentConversation) {
          state.currentConversation.lastMessageAt = new Date().toISOString()
          state.currentConversation.last_message = action.payload.content
        }
      }
      // Also update in conversations list
      const convIndex = state.conversations.findIndex(
        conv => conv.id === action.payload.conversationId
      )
      if (convIndex !== -1) {
        state.conversations[convIndex].lastMessageAt = new Date().toISOString()
        state.conversations[convIndex].last_message = action.payload.content
        state.conversations[convIndex].unread_count = 
          (state.conversations[convIndex].unread_count || 0) + 1
      }
    },
    clearChat: (state) => {
      state.conversations = []
      state.currentConversation = null
      state.messages = []
      state.participants = {}
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch conversations
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversations = action.payload
        state.loading = false
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch conversations'
        state.loading = false
      })
      
      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.loadingMessages = true
        state.error = null
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload
        state.loadingMessages = false
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch messages'
        state.loadingMessages = false
      })
      
      // Send message
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload)
        // Update conversation's last message
        if (state.currentConversation) {
          state.currentConversation.lastMessageAt = new Date().toISOString()
          state.currentConversation.last_message = action.payload.content
        }
        // Update in conversations list
        const convIndex = state.conversations.findIndex(
          conv => conv.id === action.payload.conversationId
        )
        if (convIndex !== -1) {
          state.conversations[convIndex].lastMessageAt = new Date().toISOString()
          state.conversations[convIndex].last_message = action.payload.content
        }
      })
      
      // Start conversation
      .addCase(startConversation.fulfilled, (state, action) => {
        // Add to conversations list if not already there
        const exists = state.conversations.some(conv => conv.id === action.payload.id)
        if (!exists) {
          state.conversations.unshift(action.payload)
        }
      })
      
      // Mark messages as read
      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        // Update messages in current conversation
        state.messages = state.messages.map(msg => 
          msg.conversationId === action.payload && !msg.read
            ? { ...msg, read: true }
            : msg
        )
        // Update unread count in conversations list
        const convIndex = state.conversations.findIndex(
          conv => conv.id === action.payload
        )
        if (convIndex !== -1) {
          state.conversations[convIndex].unread_count = 0
        }
      })
  },
})

export const { 
  setCurrentConversation, 
  clearCurrentConversation, 
  addNewMessage, 
  clearChat 
} = chatSlice.actions

export default chatSlice.reducer