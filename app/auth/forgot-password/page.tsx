'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, ArrowLeft, KeyRound, Sparkles } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error

      setSuccess(true)
      
    } catch (error: any) {
      console.error('Password reset error:', error)
      setError(error.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="border-2 border-brand/30 shadow-2xl max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="relative mx-auto mb-4">
            <div className="absolute inset-0 bg-brand/20 rounded-full blur-xl" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-brand to-orange-500 rounded-full flex items-center justify-center">
              <Mail className="w-10 h-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-brand to-orange-600 bg-clip-text text-transparent">
            Check Your Email
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            We&apos;ve sent a password reset link to{' '}
            <span className="font-semibold text-brand">{email}</span>.
            Please check your inbox and follow the instructions.
          </p>
          
          <div className="p-4 bg-brand/5 rounded-xl border border-brand/20">
            <p className="text-sm text-gray-600">
              <Sparkles className="inline w-4 h-4 mr-1 text-brand" />
              The link will expire in 1 hour for security
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex-col space-y-3">
          <Button 
            onClick={() => setSuccess(false)}
            variant="outline"
            className="w-full border-2 border-brand text-brand hover:bg-brand/5"
          >
            <Mail className="w-4 h-4 mr-2" />
            Send Another Email
          </Button>
          <Link href="/auth/login" className="w-full">
            <Button className="w-full bg-gradient-to-r from-brand to-orange-600 hover:from-brand/90 hover:to-orange-600/90">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-brand/30 shadow-2xl hover-lift">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-brand to-orange-600 bg-clip-text text-transparent">
              Reset Password
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Enter your email to receive a reset link
            </CardDescription>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-brand/20 rounded-full blur-md" />
            <KeyRound className="relative w-8 h-8 text-brand animate-pulse" />
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
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-brand to-orange-600 hover:from-brand/90 hover:to-orange-600/90 shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <KeyRound className="w-5 h-5 mr-2" />
            )}
            Send Reset Link
          </Button>
        </form>
      </CardContent>

      <CardFooter className="border-t border-brand/10 pt-6">
        <div className="w-full text-center">
          <Link
            href="/auth/login"
            className="font-semibold text-brand hover:text-brand/80 transition-colors hover-lift inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}