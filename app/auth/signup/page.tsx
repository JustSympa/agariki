'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, UserPlus, Sparkles, User, Mail, Lock, Eye, EyeOff, BadgeCheck, Store, ShoppingCart } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: '0',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleUserTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, userType: value }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            user_type: parseInt(formData.userType),
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) throw authError

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              user_type: parseInt(formData.userType),
              full_name: formData.fullName,
              email: formData.email,
            },
          ])

        if (profileError) {
          console.error('Profile creation error:', profileError)
        }

        setSuccess(true)
        
        if (!authData.session) {
          setError(null)
          return
        }

        router.push('/app/map')
        router.refresh()
      }
      
    } catch (error: any) {
      console.error('Signup error:', error)
      
      if (error.message.includes('already registered')) {
        setError('An account with this email already exists. Please log in instead.')
      } else if (error.message.includes('invalid email')) {
        setError('Please enter a valid email address.')
      } else {
        setError(error.message || 'An error occurred during signup')
      }
    } finally {
      setLoading(false)
    }
  }

  if (success && !formData.email.includes('@example.com')) {
    return (
      <Card className="border-2 border-brand/30 shadow-2xl max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="relative mx-auto mb-4">
            <div className="absolute inset-0 bg-brand/20 rounded-full blur-xl" />
            <div className="relative w-20 h-20 bg-linear-to-br from-brand to-orange-500 rounded-full flex items-center justify-center">
              <BadgeCheck className="w-10 h-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-linear-to-r from-brand to-orange-600 bg-clip-text text-transparent">
            Check Your Email
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            We&apos;ve sent a confirmation link to{' '}
            <span className="font-semibold text-brand">{formData.email}</span>. 
            Please click the link to verify your email address.
          </p>
          
          <div className="p-4 bg-brand/5 rounded-xl border border-brand/20">
            <p className="text-sm text-gray-600">
              <Sparkles className="inline w-4 h-4 mr-1 text-brand" />
              Complete your profile after verification to get full access
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex-col space-y-3">
          <Button 
            onClick={() => router.push('/auth/login')}
            className="w-full bg-linear-to-r from-brand to-orange-600 hover:from-brand/90 hover:to-orange-600/90"
          >
            Return to Login
          </Button>
          <p className="text-sm text-gray-500">
            Didn&apos;t receive the email?{' '}
            <button
              onClick={() => setSuccess(false)}
              className="text-brand font-semibold hover:text-brand/80"
            >
              Try again
            </button>
          </p>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-brand/30 shadow-2xl hover-lift">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-3xl font-bold bg-linear-to-r from-brand to-orange-600 bg-clip-text text-transparent">
              Join Agariki
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Connect with Cameroon&apos;s fungus ecosystem
            </CardDescription>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-brand/20 rounded-full blur-md" />
            <UserPlus className="relative w-8 h-8 text-brand animate-pulse" />
          </div>
        </div>
        
        {error && (
          <Alert variant="destructive" className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                <User className="inline w-4 h-4 mr-2 text-brand" />
                Full Name
              </Label>
              <div className="relative">
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Mushroom Farm"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="pl-10 border-2 focus:border-brand"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand/60" />
              </div>
            </div>

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
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="pl-10 border-2 focus:border-brand"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand/60" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="userType" className="text-sm font-medium text-gray-700">
                I am a
              </Label>
              <Select value={formData.userType} onValueChange={handleUserTypeChange} disabled={loading}>
                <SelectTrigger className="border-2 focus:border-brand">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="border-2 border-brand/20">
                  <SelectItem value="0" className="flex items-center">
                    Producer (Sell fungus)
                  </SelectItem>
                  <SelectItem value="1" className="flex items-center">
                    Consumer (Buy fungus)
                  </SelectItem>
                </SelectContent>
              </Select>
              <div className="p-3 bg-brand/5 rounded-lg border border-brand/10">
                <p className="text-sm text-brand font-medium">
                  {formData.userType === '0' 
                    ? '🎯 You will see demand heatmaps and add Points of Presence (PoP)'
                    : '🎯 You will find nearby producers and add Points of Delivery (PoD)'
                  }
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  <Lock className="inline w-4 h-4 mr-2 text-brand" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
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
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
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
          </div>

          <div className="p-4 bg-brand/5 rounded-xl border border-brand/20">
            <p className="text-sm text-gray-600">
              <Sparkles className="inline w-4 h-4 mr-1 text-brand" />
              By signing up, you agree to our{' '}
              <Link href="/terms" className="text-brand font-semibold hover:text-brand/80">
                Terms
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-brand font-semibold hover:text-brand/80">
                Privacy Policy
              </Link>
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-semibold bg-linear-to-r from-brand to-orange-600 hover:from-brand/90 hover:to-orange-600/90 shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <UserPlus className="w-5 h-5 mr-2" />
            )}
            Create Free Account
          </Button>
        </form>
      </CardContent>

      <CardFooter className="border-t border-brand/10 pt-6">
        <div className="w-full text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="font-semibold text-brand hover:text-brand/80 transition-colors hover-lift inline-flex items-center"
            >
              Sign in instead
              <Sparkles className="ml-1 w-4 h-4" />
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  )
}