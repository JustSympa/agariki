'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { createClient } from '@/lib/supabase/client'
import { setSession, fetchUserProfile, clearAuth } from '@/lib/store/slices/authSlice'
import { AppDispatch, RootState } from '@/lib/store'
import { Loader2 } from 'lucide-react'

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { loading: authLoading, user } = useSelector((state: RootState) => state.auth)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.push('/auth/login')
          return
        }

        dispatch(setSession(session))
        await dispatch(fetchUserProfile(session.user.id))
        
      } catch (error) {
        console.error('Auth check error:', error)
        dispatch(clearAuth())
        router.push('/auth/login')
      } finally {
        setInitialLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          dispatch(clearAuth())
          router.push('/auth/login')
        } else if (session) {
          dispatch(setSession(session))
          await dispatch(fetchUserProfile(session.user.id))
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [dispatch, router])

  if (initialLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-brand/20 rounded-full blur-xl" />
            <Loader2 className="relative w-12 h-12 text-brand animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Loading Agariki...</h2>
          <p className="text-gray-600 mt-2">Preparing your dashboard</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return <>{children}</>
}