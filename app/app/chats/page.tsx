'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
	Search, 
	MessageSquare, 
	Users, 
	Clock,
	Check,
	CheckCheck,
	Plus,
	Filter
} from 'lucide-react'
import Link from 'next/link'
import { useChat } from '@/lib/hooks/useChat'

const conversations = [
	{
		id: 1,
		name: 'Alice Fungus Co.',
		lastMessage: 'I can deliver 50kg fresh tomorrow',
		time: '10:30 AM',
		unread: 2,
		avatarColor: 'bg-green-500',
		online: true
	},
	{
		id: 2,
		name: 'Market Restaurant',
		lastMessage: 'Do you have dried mushrooms available?',
		time: 'Yesterday',
		unread: 0,
		avatarColor: 'bg-blue-500',
		online: false
	},
	{
		id: 3,
		name: 'John Mushroom Farm',
		lastMessage: 'Thanks for the order!',
		time: '2 days ago',
		unread: 0,
		avatarColor: 'bg-orange-500',
		online: true
	},
	{
		id: 4,
		name: 'Hotel Deluxe',
		lastMessage: 'Can we schedule delivery for Friday?',
		time: '3 days ago',
		unread: 1,
		avatarColor: 'bg-purple-500',
		online: false
	}
]

export default function ChatsPage() {
	const chat = useChat()
	

	return (
		<div>
			<div className="bg-white ">
				{/* Header */}
				<div className="p-6 border-b border-brand/20">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-2xl font-bold text-foreground">Messages</h2>
						<Button size="sm" className="gap-2 bg-brand hover:bg-brand/90">
							<Plus className="w-4 h-4" />
							New Chat
						</Button>
					</div>
					
					{/* Search */}
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
						<Input
							placeholder="Search conversations..."
							className="pl-10 border-2 focus:border-brand"
						/>
					</div>
					
					{/* Filter buttons */}
					<div className="flex gap-2 mt-4">
						<Button variant="outline" size="sm" className="gap-2">
							<Users className="w-4 h-4" />
							All
						</Button>
						<Button variant="outline" size="sm" className="gap-2">
							<Filter className="w-4 h-4" />
							Unread
						</Button>
						<Button variant="outline" size="sm" className="gap-2">
							<MessageSquare className="w-4 h-4" />
							Recent
						</Button>
					</div>
				</div>

				{/* Conversation list */}
				<div className="divide-y divide-brand/10">
					{conversations.map((chat) => (
						<Link
							key={chat.id}
							href={'/app/chats/'+ chat.id}
						>
							<div className="w-full p-4 text-left transition-all duration-200 hover:bg-brand/5 flex items-start gap-3">
								<div className="relative">
									<div className={`w-12 h-12 ${chat.avatarColor} rounded-xl flex items-center justify-center text-white font-semibold`}>
										{chat.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
									</div>
									{chat.online && (
										<div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
									)}
								</div>
								
								<div className="flex-1 min-w-0">
									<div className="flex items-center justify-between mb-1">
										<h3 className="font-semibold text-foreground truncate">{chat.name}</h3>
										<div className="flex items-center gap-1">
											<Clock className="w-3 h-3 text-gray-400" />
											<span className="text-xs text-gray-500">{chat.time}</span>
										</div>
									</div>
									
									<p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
									
									<div className="flex items-center justify-between mt-2">
										<div className="flex items-center gap-1">
											{chat.unread > 0 ? (
												<>
													<div className="w-2 h-2 bg-brand rounded-full animate-pulse" />
													<span className="text-xs font-semibold text-brand">{chat.unread} new</span>
												</>
											) : (
												<CheckCheck className="w-4 h-4 text-gray-400" />
											)}
										</div>
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>

			{/* Quick stats */}
			{/* <div className="mt-6 p-6 bg-linear-to-r from-brand/10 to-transparent rounded-2xl border border-brand/20">
				<h3 className="font-semibold text-foreground mb-3">Chat Stats</h3>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<p className="text-sm text-gray-600">Active Chats</p>
						<p className="text-2xl font-bold text-brand">4</p>
					</div>
					<div>
						<p className="text-sm text-gray-600">Unread</p>
						<p className="text-2xl font-bold text-foreground">3</p>
					</div>
				</div>
			</div> */}
		</div>
	)
}