'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Key, ShieldCheck, Sparkles, Lock, Eye, EyeOff } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [validHash, setValidHash] = useState(false)

  useEffect(() => {
    const hash = window.location.hash
    if (hash.includes('type=recovery')) {
      setValidHash(true)
    } else {
      setError('Invalid or expired reset link. Please request a new password reset.')
    }
  }, [])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) throw error

      setSuccess(true)
      
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)
      
    } catch (error: any) {
      console.error('Password update error:', error)
      setError(error.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!validHash) {
    return (
      <Card className="border-2 border-red-200 shadow-2xl max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="relative mx-auto mb-4">
            <div className="absolute inset-0 bg-red-100 rounded-full blur-xl" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
              <Key className="w-10 h-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Invalid Link
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center">
          <p className="text-gray-600 mb-6">
            {error || 'This password reset link is invalid or has expired.'}
          </p>
          
          <Button 
            onClick={() => router.push('/auth/forgot-password')}
            className="w-full bg-gradient-to-r from-brand to-orange-600 hover:from-brand/90 hover:to-orange-600/90"
          >
            Request New Reset Link
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (success) {
    return (
      <Card className="border-2 border-brand/30 shadow-2xl max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="relative mx-auto mb-4">
            <div className="absolute inset-0 bg-green-100 rounded-full blur-xl" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Password Updated
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          <p className="text-gray-600">
            Your password has been successfully updated. Redirecting to login...
          </p>
          
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
            <div className="p-4 bg-brand/5 rounded-xl border border-brand/20">
              <p className="text-sm text-brand font-medium">
                <Sparkles className="inline w-4 h-4 mr-1" />
                You can now log in with your new password
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-brand/30 shadow-2xl hover-lift">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-brand to-orange-600 bg-clip-text text-transparent">
              Set New Password
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Create a strong new password for your account
            </CardDescription>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-brand/20 rounded-full blur-md" />
            <ShieldCheck className="relative w-8 h-8 text-brand animate-pulse" />
          </div>
        </div>
        
        {error && (
          <Alert variant="destructive" className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}
      </CardHeader>

      <CardContent>
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                <Lock className="inline w-4 h-4 mr-2 text-brand" />
                New Password
              </Label>
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
              <p className="text-xs text-gray-500">Minimum 6 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                <Lock className="inline w-4 h-4 mr-2 text-brand" />
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="pl-10 pr-10 border-2 focus:border-brand"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand/60" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand/60 hover:text-brand"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-brand to-orange-600 hover:from-brand/90 hover:to-orange-600/90 shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <ShieldCheck className="w-5 h-5 mr-2" />
            )}
            Update Password
          </Button>
        </form>
      </CardContent>

      <CardFooter className="border-t border-brand/10 pt-6">
        <div className="w-full text-center">
          <p className="text-gray-600">
            Remember your password?{' '}
            <button
              onClick={() => router.push('/auth/login')}
              className="font-semibold text-brand hover:text-brand/80 transition-colors hover-lift inline-flex items-center"
            >
              Back to login
              <Sparkles className="ml-1 w-4 h-4" />
            </button>
          </p>
        </div>
      </CardFooter>
    </Card>
  )
}