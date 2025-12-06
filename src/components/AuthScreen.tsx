import { useState, useEffect, useRef } from 'react'
import { AlertCircle, Mail, Lock, Smartphone } from 'lucide-react'
import { toast } from 'sonner'
import WebApp from "@twa-dev/sdk"
import { User } from '@/lib/types'
import { authService } from '@/services/auth'
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { ArrowLeft, TelegramLogo } from '@phosphor-icons/react'

interface AuthScreenProps {
  onSignupSuccess: () => void
  onLoginSuccess: () => void
}

type AuthMode = 'initial' | 'telegram-signup' | 'email-login' | 'email-signup' | 'link-existing'

export function AuthScreen({ onSignupSuccess, onLoginSuccess }: AuthScreenProps) {
  const twa = useTelegramWebApp()
  const [authMode, setAuthMode] = useState<AuthMode>('initial')
  const autoAuthAttemptedRef = useRef(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [existingEmail, setExistingEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Auto-attempt Telegram authentication on mount
  useEffect(() => {
    if (autoAuthAttemptedRef.current) {
      return
    }
    autoAuthAttemptedRef.current = true

    // Longer delay for mobile - ensure Telegram WebApp SDK is fully initialized
    const timer = setTimeout(() => {
      // Check if auto-auth is disabled (e.g., after logout)
      const autoAuthDisabled = sessionStorage.getItem('autoAuthDisabled')
      if (autoAuthDisabled) {
        console.log('Auto-auth is disabled after logout')
        sessionStorage.removeItem('autoAuthDisabled')
        return
      }
      
      // Log WebApp state for debugging
      console.log('Telegram WebApp state:', {
        initData: !!WebApp.initData,
        initDataUnsafe: !!WebApp.initDataUnsafe,
        platform: WebApp.platform,
        isExpanded: WebApp.isExpanded,
      })
      
      // Only auto-auth if we have Telegram initData
      if (WebApp.initData) {
        console.log('Auto-attempting Telegram authentication on mount...')
        // Trigger auto-authentication
        attemptTelegramSignin()
      } else {
        console.warn('No Telegram initData available - user may not be in Telegram mini app')
      }
    }, 500) // Increased delay to 500ms for mobile compatibility

    return () => clearTimeout(timer)
  }, [])

  const attemptTelegramSignin = async () => {
    setIsLoading(true)
    setError('')
    try {
      twa.haptic.impact('light')
      const initData = WebApp.initData
      
      if (!initData) {
        throw new Error('Telegram initialization failed')
      }

      const response = await authService.authenticateWithTelegram(initData)
      
      // Check if this is an existing user with email
      if (response.user.email) {
        // User already has email linked - full login
        twa.haptic.notification('success')
        toast.success(`Welcome back ${response.user.full_name}!`)
        onLoginSuccess()
        return
      }
      
      // New user or user without email - show email prompt
      setExistingEmail('')
      setEmail('')
      setPassword('')
      setAuthMode('telegram-signup')
      toast.success('Telegram authenticated! Now please add your email.')
    } catch (error: any) {
      console.error('Telegram auto-signin error:', error)
      let errorMsg = error.message || 'Telegram signin failed'
      
      // Provide better error messages based on the specific error
      if (errorMsg.includes('expired') || errorMsg.includes('INVALID_TELEGRAM_INIT_DATA')) {
        errorMsg = 'Session expired. Please close and reopen the app from Telegram.'
      } else if (errorMsg.includes('no Telegram initData') || errorMsg.includes('not running in Telegram')) {
        errorMsg = 'Please open this app from within Telegram'
        // Don't show error toast for this - just silently fail
        setError('')
      } else if (errorMsg.includes('Invalid init data signature')) {
        errorMsg = 'Telegram authentication failed. Please close and reopen the app.'
      } else if (errorMsg.includes('user ID not found')) {
        errorMsg = 'Telegram user information incomplete. Please try again.'
      }
      
      setError(errorMsg)
      if (errorMsg) {
        twa.haptic.notification('error')
        toast.error(errorMsg)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleTelegramSignin = async () => {
    // When user clicks the button, use the same logic
    await attemptTelegramSignin()
  }

  const handleTelegramSignupAddEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Email is required')
      return
    }

    if (!password) {
      setError('Password is required')
      return
    }

    setIsLoading(true)
    try {
      twa.haptic.impact('light')
      
      // First check if email already exists
      const emailExists = await authService.checkEmailExists(email.trim())
      
      if (emailExists) {
        // Email already exists - show linking prompt
        setExistingEmail(email.trim())
        setAuthMode('link-existing')
        toast.info('This email already exists. Please link it or use another email.')
        setIsLoading(false)
        return
      }

      // Email doesn't exist, add it to Telegram account
      const response = await authService.addEmail(email.trim(), password)
      
      twa.haptic.notification('success')
      toast.success('Account created successfully!')
      onSignupSuccess()
    } catch (err: any) {
      console.error('Add email error:', err)
      const errorMsg = err.message || 'Failed to add email'
      setError(errorMsg)
      twa.haptic.notification('error')
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!fullName.trim()) {
      setError('Full name is required')
      return
    }

    if (!email.trim()) {
      setError('Email is required')
      return
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)
    try {
      twa.haptic.impact('light')
      
      const authData = await authService.signup(email.trim(), password, fullName.trim())
      localStorage.setItem('jwt_token', authData.access_token)
      localStorage.setItem('user', JSON.stringify(authData.user))
      
      twa.haptic.notification('success')
      toast.success(`Welcome ${authData.user.full_name}!`)
      onSignupSuccess()
    } catch (err: any) {
      console.error('Signup error:', err)
      const errorMsg = err.message || 'Signup failed. Please try again.'
      setError(errorMsg)
      twa.haptic.notification('error')
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Email is required')
      return
    }

    if (!password) {
      setError('Password is required')
      return
    }

    setIsLoading(true)
    try {
      twa.haptic.impact('light')

      const authData = await authService.login(email.trim(), password)
      localStorage.setItem('jwt_token', authData.access_token)
      localStorage.setItem('user', JSON.stringify(authData.user))
      
      twa.haptic.notification('success')
      toast.success(`Welcome back ${authData.user.full_name}!`)
      onLoginSuccess()
    } catch (err: any) {
      console.error('Login error:', err)
      const errorMsg = err.message || 'Login failed. Please try again.'
      setError(errorMsg)
      twa.haptic.notification('error')
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const renderInitialScreen = () => (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-foreground">Welcome to Pricetracker</h1>
        <p className="text-muted-foreground">Get started by signing up or logging in</p>
      </div>

      <div className="space-y-3">
        <Button
          onClick={handleTelegramSignin}
          disabled={isLoading}
          size="lg"
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <Smartphone className="w-4 h-4 mr-2" />
          Sign In with Telegram
        </Button>

        <Button
          onClick={() => {
            setAuthMode('email-login')
            setEmail('')
            setPassword('')
            setError('')
          }}
          variant="outline"
          size="lg"
          className="w-full"
          disabled={isLoading}
        >
          <Mail className="w-4 h-4 mr-2" />
          Sign In with Email
        </Button>

        <Button
          onClick={() => {
            setAuthMode('email-signup')
            setEmail('')
            setPassword('')
            setFullName('')
            setConfirmPassword('')
            setError('')
          }}
          variant="outline"
          size="lg"
          className="w-full"
          disabled={isLoading}
        >
          <Lock className="w-4 h-4 mr-2" />
          Create Account
        </Button>
      </div>
    </div>
  )

  const renderTelegramSignupScreen = () => (
    <div className="w-full max-w-sm space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setAuthMode('initial')}
          disabled={isLoading}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Complete Your Profile</h1>
          <p className="text-sm text-muted-foreground">Add an email to your Telegram account</p>
        </div>
      </div>

      <Card className="p-6 bg-blue-500/5 border-blue-500/20">
        <p className="text-sm text-foreground/80">
          You've successfully signed up with Telegram! Now add an email address to complete your account setup.
        </p>
      </Card>

      <form onSubmit={handleTelegramSignupAddEmail} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
            disabled={isLoading}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 border border-destructive/20 flex gap-2">
            <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Adding Email...' : 'Add Email & Complete Signup'}
        </Button>
      </form>
    </div>
  )

  const renderEmailSignupScreen = () => (
    <div className="w-full max-w-sm space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setAuthMode('initial')}
          disabled={isLoading}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
          <p className="text-sm text-muted-foreground">Sign up with email and password</p>
        </div>
      </div>

      <form onSubmit={handleEmailSignup} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            required
            disabled={isLoading}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
            disabled={isLoading}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </Button>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 border border-destructive/20 flex gap-2">
            <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
    </div>
  )

  const renderLinkExistingScreen = () => (
    <div className="w-full max-w-sm space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setAuthMode('telegram-signup')
            setEmail('')
            setPassword('')
            setError('')
            setExistingEmail('')
          }}
          disabled={isLoading}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Email Already Exists</h1>
          <p className="text-sm text-muted-foreground">This email is already in use</p>
        </div>
      </div>

      <Card className="p-4 bg-amber-500/5 border-amber-500/20">
        <p className="text-sm text-foreground/80">
          The email <span className="font-semibold">{existingEmail}</span> is already associated with another account. You can link your Telegram account to this email using your password, or try a different email address.
        </p>
      </Card>

      <form
        onSubmit={async (e) => {
          e.preventDefault()
          setIsLoading(true)
          setError('')
          try {
            const authData = await authService.linkTelegramAccount(existingEmail, password)
            localStorage.setItem('jwt_token', authData.access_token)
            localStorage.setItem('user', JSON.stringify(authData.user))

            twa.haptic.notification('success')
            toast.success('Account linked successfully!')
            onLoginSuccess()
          } catch (err: any) {
            console.error('Link error:', err)
            const errorMsg = err.message || 'Failed to link account. Please check your password.'
            setError(errorMsg)
            twa.haptic.notification('error')
            toast.error(errorMsg)
          } finally {
            setIsLoading(false)
          }
        }}
        className="space-y-4"
      >
        <div className="grid gap-2">
          <Label htmlFor="linkPassword">Password</Label>
          <div className="relative">
            <Input
              id="linkPassword"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 border border-destructive/20 flex gap-2">
            <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Linking Account...' : 'Link with Password'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-muted" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or</span>
        </div>
      </div>

      <Button
        onClick={() => {
          setAuthMode('telegram-signup')
          setEmail('')
          setPassword('')
          setError('')
          setExistingEmail('')
        }}
        variant="outline"
        className="w-full"
        disabled={isLoading}
      >
        Use Different Email
      </Button>
    </div>
  )

  const renderEmailLoginScreen = () => (
    <div className="w-full max-w-sm space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setAuthMode('initial')}
          disabled={isLoading}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sign In</h1>
          <p className="text-sm text-muted-foreground">Welcome back</p>
        </div>
      </div>

      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
            disabled={isLoading}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 border border-destructive/20 flex gap-2">
            <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Button
            variant="link"
            className="p-0 h-auto"
            onClick={() => {
              setAuthMode('email-signup')
              setEmail('')
              setPassword('')
              setFullName('')
              setConfirmPassword('')
              setError('')
            }}
          >
            Sign up here
          </Button>
        </p>
      </div>
    </div>
  )

  return (
    <div className="min-h-twa-viewport bg-gradient-to-br from-background via-background to-accent/5 flex flex-col items-center justify-center px-4 py-8">
      {authMode === 'initial' && renderInitialScreen()}
      {authMode === 'telegram-signup' && renderTelegramSignupScreen()}
      {authMode === 'email-signup' && renderEmailSignupScreen()}
      {authMode === 'email-login' && renderEmailLoginScreen()}
      {authMode === 'link-existing' && renderLinkExistingScreen()}
    </div>
  )
}
