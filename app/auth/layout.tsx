import Link from 'next/link'
import Image from 'next/image'
import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="grid lg:grid-cols-2 min-h-screen bg-linear-to-br from-brand/5 via-white to-brand/5">
      <div className='hidden lg:flex flex-col items-center justify-center my-6 ml-6 brand-bg text-white relative overflow-hidden'>
        {/* Header */}
        <header className="backdrop-blur-sm self-start">
              <Link href="/" className="flex items-center space-x-3">
                  <Image 
                    src="/logo.svg" 
                    alt="Agariki Logo" 
                    width={40} 
                    height={40}
                    className="relative hover:scale-110 transition-transform duration-300"
                  />
                  <span className="text-2xl font-bold text-foreground bg-linear-to-r from-brand to-brand/80 bg-clip-text">
                    Agariki
                  </span>
              </Link>
        </header>
        <img className='flex-1' src="/signup-illustration.svg" alt="Signup" />
        {/* Footer */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/20">
            <div className="w-2 h-2 bg-brand rounded-full animate-pulse" />
            <p className="text-sm text-brand font-medium">
              Academic Project • Wide Area Networks
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Centralized information platform for Cameroon&apos;s fungus sector
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center p-8">
        <Link href="/" className="flex lg:hidden items-center space-x-3 my-4">
            <Image 
              src="/logo.svg" 
              alt="Agariki Logo" 
              width={40} 
              height={40}
              className="relative hover:scale-110 transition-transform duration-300"
            />
            <span className="text-2xl font-bold text-foreground bg-linear-to-r from-brand to-brand/80 bg-clip-text">
              Agariki
            </span>
        </Link>
        <div className='w-full'>
          {children}
        </div>
      </div>
    </main>
  )
}