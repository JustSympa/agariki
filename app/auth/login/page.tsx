'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LogIn, Loader2, Sparkles, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectedFrom = searchParams.get('redirectedFrom')
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const supabase = createClient()
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Check if user profile exists in our users table
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single()

        if (profileError && profileError.code === 'PGRST116') {
          setMessage('Please complete your profile setup')
        }
      }

      // Redirect to app or previous page
      router.push(redirectedFrom || '/app/map')
      router.refresh()
      
    } catch (error: any) {
      console.error('Login error:', error)
      setError(error.message || 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (error: any) {
      console.error('Google login error:', error)
      setError(error.message || 'Failed to sign in with Google')
      setLoading(false)
    }
  }

  return (
    <Card className="border-2 border-brand/30 shadow-2xl hover-lift">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-3xl font-bold bg-linear-to-r from-brand to-orange-600 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Sign in to access your Agariki dashboard
            </CardDescription>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-brand/20 rounded-full blur-md" />
            <Sparkles className="relative w-8 h-8 text-brand animate-pulse" />
          </div>
        </div>
        
        {error && (
          <Alert variant="destructive" className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {message && (
          <Alert className="border-brand/30 bg-brand/10">
            <AlertDescription className="text-brand font-medium">
              {message}
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                <Mail className="inline w-4 h-4 mr-2 text-brand" />
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="pl-10 border-2 focus:border-brand"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand/60" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  <Lock className="inline w-4 h-4 mr-2 text-brand" />
                  Password
                </Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-brand hover:text-brand/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="pl-10 pr-10 border-2 focus:border-brand"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand/60" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand/60 hover:text-brand"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-semibold bg-linear-to-r from-brand to-orange-600 hover:from-brand/90 hover:to-orange-600/90 shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <LogIn className="w-5 h-5 mr-2" />
            )}
            Sign In
          </Button>
        </form>
      </CardContent>

      <CardFooter className="border-t border-brand/10 pt-6">
        <div className="w-full text-center">
          <p className="text-gray-600">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/signup"
              className="font-semibold text-brand hover:text-brand/80 transition-colors hover-lift inline-flex items-center"
            >
              Sign up free
              <Sparkles className="ml-1 w-4 h-4" />
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  )
}