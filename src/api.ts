import axios from 'axios'
import { NewUser, User, Conversation, Message } from '@/lib/db/schema'

const routes = {
    users: {
        new: '/api/user/new',
        read: '/api/user/read',
        search: '/api/user/search',
        update: '/api/user/update',
    },
    chats: {
        conversations: {
            new: '/api/chat/conversation/new',
            with: '/api/chat/conversation/with',
            unreadc: '/api/chat/conversation/unreadc',
            read: '/api/chat/conversation/read',
            lastmsg: '/api/chat/conversation/lastmsg',
            msg: '/api/chat/conversation/msg',
            asread: '/api/chat/conversation/asread',
            exists: '/api/chat/conversation/exists',
        },
        messages: {
            asread: '/api/chat/message/asread',
            new: '/api/chat/message/new',

        }
    }
}

async function api_fetch(route: string, method: 'POST' | 'GET' | 'PUT', body: any = undefined) {
    const  { data: result } = await axios({
        data: body,
        method,
        params: method === 'GET' ? body : undefined,
        url: route
    })
    return result
}

export const users = {
    new: async function(user: NewUser) {
        return await api_fetch(routes.users.new, 'POST', user) as User
    },
    read: async function(id: string) {
        return await api_fetch(routes.users.read, 'GET', { id }) as User
    },
    search: async function(exclude: string, query: string) {
        return await api_fetch(routes.users.search, 'GET', { exclude, query}) as User[]
    },
    update: async function(id: string, updates: any) {
        return await api_fetch(routes.users.update, 'PUT', {id, updates}) as User
    },
}
export const conversations = {
    new: async function(id1: string, id2: string) {
        return await api_fetch(routes.chats.conversations.new, 'POST', { id1, id2 }) as Conversation
    },
    with: async function(id: string) {
        return await api_fetch(routes.chats.conversations.with, 'GET', { id }) as Conversation[]
    },
    unreadc: async function(convId: string, userId: string ) {
        return await api_fetch(routes.chats.conversations.unreadc, 'GET', { convId, userId}) as { unreadCount: number }
    },
    read: async function(id: string ) {
        return await api_fetch(routes.chats.conversations.read, 'GET', { id }) as Conversation
    },
    lastmsg: async function(convId: string) {
        return await api_fetch(routes.chats.conversations.lastmsg, 'GET', { id: convId}) as { content: string }
    },
    msg: async function(convId: string) {
        return await api_fetch(routes.chats.conversations.msg, 'GET', { id: convId }) as Message[]
    },
    asread: async function(convId: string, userId: string) {
        return await api_fetch(routes.chats.conversations.asread, 'PUT', { convId, userId }) as any
    },
    exists: async function(id1: string, id2: string) {
        return await api_fetch(routes.chats.conversations.exists, 'GET', { id1, id2 }) as Conversation | null | undefined
    },
}
export const messages = {
    asread: async function(msgId: string) {
        return await api_fetch(routes.chats.messages.asread, 'PUT', { id: msgId }) as any
    },
    new: async function(msg: any) {
        return await api_fetch(routes.chats.messages.new, 'POST', msg) as Message
    },

}
