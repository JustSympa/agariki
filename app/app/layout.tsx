import { ReactNode } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { BottomNavigation } from '@/components/layout/bottom-navigation'
import { AuthProvider } from '@/components/providers/auth-provider'
import { ReduxProvider } from '@/components/providers/redux-provider'

export default function AppLayout({ children }: { children: ReactNode }) {
	return (
		<ReduxProvider>
			<AuthProvider>
				<div className="min-h-screen bg-background">
					{/* Sidebar for desktop */}
					<div className="hidden lg:block fixed inset-y-0 left-0 z-50">
						<Sidebar />
					</div>

					{/* Main content area */}
					<main className="h-full lg:pl-64">
						{children}
					</main>

					{/* Bottom navigation for mobile */}
					<div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
						<BottomNavigation />
					</div>

					{/* Add padding for bottom navigation on mobile */}
					<div className="pb-20 lg:pb-0" />
				</div>
			</AuthProvider>
		</ReduxProvider>
	)
}