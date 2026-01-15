'use client'

import { useCallback, useState } from 'react'
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
	Filter,
    ArrowLeft
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ChatMessages() {
    const [message, setMessage] = useState('')
    const router = useRouter()
    const handleGoBack = useCallback(() => { router.back()}, [])
    return (
        <div className="bg-white h-full flex flex-col">
            {/* Chat header */}
            <div className="p-6 border-b border-brand/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ArrowLeft onClick={handleGoBack}/>
                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white font-semibold">
                            AC
                        </div>
                        <div>
                            <h3 className="font-bold text-foreground">Alice Fungus Co.</h3>
                            <div className="text-sm text-green-600 flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                                Online • Producer
                            </div>
                        </div>
                    </div>
                    <Button variant="outline" className="gap-2">
                        <Users className="w-4 h-4" />
                        View Profile
                    </Button>
                </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-6">
                    {/* Received message */}
                    <div className="flex gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full shrink-0" />
                        <div>
                            <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 max-w-lg">
                                <p>Hi! I saw your demand for fresh mushrooms. I can deliver 50kg tomorrow morning.</p>
                            </div>
                            <div className="flex items-center gap-2 mt-2 ml-2">
                                <span className="text-xs text-gray-500">10:30 AM</span>
                                <CheckCheck className="w-3 h-3 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* Sent message */}
                    <div className="flex gap-3 justify-end">
                        <div>
                            <div className="bg-linear-to-r from-brand to-orange-500 text-white rounded-2xl rounded-tr-none p-4 max-w-lg">
                                <p>That sounds perfect! What's your price per kg for fresh mushrooms?</p>
                            </div>
                            <div className="flex items-center gap-2 mt-2 mr-2 justify-end">
                                <span className="text-xs text-gray-500">10:32 AM</span>
                                <CheckCheck className="w-3 h-3 text-brand" />
                            </div>
                        </div>
                        <div className="w-8 h-8 bg-brand rounded-full shrink-0" />
                    </div>

                    {/* Received message */}
                    <div className="flex gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full shrink-0" />
                        <div>
                            <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 max-w-lg">
                                <p>I can do $8 per kg for fresh. For dried, it's $25 per kg. Delivery included within Yaoundé.</p>
                            </div>
                            <div className="flex items-center gap-2 mt-2 ml-2">
                                <span className="text-xs text-gray-500">10:33 AM</span>
                                <CheckCheck className="w-3 h-3 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* Date separator */}
                    <div className="text-center">
                        <div className="inline-block px-4 py-1 bg-brand/10 rounded-full text-sm text-brand font-medium">
                            Today
                        </div>
                    </div>
                </div>
            </div>

            {/* Message input */}
            <div className="p-6 border-t border-brand/20">
                <div className="flex gap-3">
                    <Input
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-1 border-2 focus:border-brand"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && message.trim()) {
                                // Handle send
                                setMessage('')
                            }
                        }}
                    />
                    <Button className="bg-brand hover:bg-brand/90 px-6">
                        Send
                    </Button>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center">
                    Messages are encrypted for your security
                </p>
            </div>
        </div>
    )
}