import * as api from '@/src/api'
import { User as ChatUser } from '@/lib/db/schema'

// export interface ChatUser {
//   id: string
//   full_name: string
//   email: string
//   user_type: number
//   avatar_url?: string
//   phone?: string
// }

export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  content: string
  read: boolean
  createdAt: string | Date
  sender?: ChatUser
}

export interface ChatConversation {
  id: string
  participant1Id: string
  participant2Id: string
  lastMessageAt: string | Date
  createdAt: string | Date
  other_user?: ChatUser
  unread_count?: number
  last_message?: string
}

class ChatService {

  // Get all conversations for a user
  async getConversations(userId: string): Promise<ChatConversation[]> {
    const convs = await api.conversations.with(userId)

    const enrichedConversations = await Promise.all(
      convs.map(async (conv) => {
        const otherUserId = conv.participant1Id === userId ? conv.participant2Id : conv.participant1Id
        
        // Get other user details
        const otherUser = await api.users.read(otherUserId)

        // Get unread message count
        const { unreadCount } = await api.conversations.unreadc(conv.id, userId)          

        // Get last message preview
        const lastMessage = await api.conversations.lastmsg(conv.id)

        return {
          ...conv,
          other_user: otherUser,
          unread_count: unreadCount || 0,
          last_message: lastMessage?.content || '',
        }
      })
    )

    return enrichedConversations
  }

  // Get messages for a conversation
  async getMessages(conversationId: string, userId: string): Promise<ChatMessage[]> {
    const messages = await api.conversations.msg(conversationId)


    // Get sender details for each message
    const enrichedMessages = await Promise.all(
      messages.map(async (msg) => {
        const sender = await api.users.read(msg.senderId)

        // Mark as read if not sender
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

  // Send a message
  async sendMessage(
    conversationId: string, 
    senderId: string, 
    content: string
  ): Promise<ChatMessage> {
    // Create message
    const message = await api.messages.new({
        conversationId: conversationId,
        senderId: senderId,
        content,
        read: false,
      })


    // Update conversation's last message timestamp
    // await db
    //   .update(conversations)
    //   .set({ lastMessageAt: new Date() })
    //   .where(eq(conversations.id, conversationId))

    // Get sender details
    const sender = await api.users.read(senderId)

    return {
      ...message,
      sender,
    }
  }

  // Start a new conversation
  async startConversation(
    participant1Id: string, 
    participant2Id: string
  ): Promise<ChatConversation> {
    // Check if conversation already exists
    const existingConv = await api.conversations.exists(participant1Id, participant2Id)

    if (existingConv) {
      return existingConv
    }

    // Create new conversation
    const conversation = await api.conversations.new(participant1Id, participant2Id)

    return conversation
  }

  // Search for users to chat with
  async searchUsers(query: string, excludeUserId: string): Promise<ChatUser[]> {
    const  users = await api.users.search(excludeUserId, query)

    return users
  }

  // Get user by ID
  async getUserById(userId: string): Promise<ChatUser | null> {
    return await api.users.read(userId)
  }

  // Mark all messages in conversation as read
  async markConversationAsRead(conversationId: string, userId: string): Promise<void> {
    await api.conversations.asread(conversationId, userId)
  }

  // Get conversation by ID
  async getConversationById(conversationId: string, userId: string): Promise<ChatConversation | null> {
    const conversation = await api.conversations.read(conversationId)

    const otherUserId = conversation.participant1Id === userId 
      ? conversation.participant2Id 
      : conversation.participant1Id

    const otherUser = await api.users.read(otherUserId)

    const {  unreadCount } = await api.conversations.unreadc(conversationId, userId)

    return {
      ...conversation,
      other_user: otherUser,
      unread_count: unreadCount || 0,
    }
  }

  // Set up real-time subscription for new messages
  // subscribeToMessages(
  //   conversationId: string, 
  //   callback: (message: ChatMessage) => void
  // ) {
  //   return db
  //     .channel(`messages:${conversationId}`)
  //     .on(
  //       'postgres_changes',
  //       {
  //         event: 'INSERT',
  //         schema: 'public',
  //         table: 'messages',
  //         filter: `conversation_id=eq.${conversationId}`,
  //       },
  //       async (payload) => {
  //         const message = payload.new as ChatMessage
  //         // Get sender details
  //         const sender = await this.getUserById(message.sender_id)
  //         callback({
  //           ...message,
  //           sender: sender || undefined,
  //         })
  //       }
  //     )
  //     .subscribe()
  // }

  // Set up real-time subscription for conversation updates
//   subscribeToConversations(
//     userId: string,
//     callback: (conversation: ChatConversation) => void
//   ) {
//     return db
//       .channel(`conversations:${userId}`)
//       .on(
//         'postgres_changes',
//         {
//           event: '*',
//           schema: 'public',
//           table: 'conversations',
//           filter: `or(participant1_id.eq.${userId},participant2_id.eq.${userId})`,
//         },
//         async (payload) => {
//           const conversation = payload.new as ChatConversation
//           const otherUserId = conversation.participant1_id === userId 
//             ? conversation.participant2_id 
//             : conversation.participant1_id

//           const otherUser = await this.getUserById(otherUserId)
//           callback({
//             ...conversation,
//             other_user: otherUser || undefined,
//           })
//         }
//       )
//       .subscribe()
//   }

//   Cleanup subscriptions
//   unsubscribe(channel: any) {
//     db.removeChannel(channel)
//   }

}

export const chatService = new ChatService()