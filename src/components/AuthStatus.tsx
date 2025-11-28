import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'

interface AuthStatusProps {
  isLoading: boolean
  user: any
  error?: string
}

export function AuthStatus({ isLoading, user, error }: AuthStatusProps) {
  if (isLoading) {
    return (
      <Alert className="m-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertTitle>Initializing...</AlertTitle>
        <AlertDescription>
          Authenticating with Telegram...
        </AlertDescription>
      </Alert>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Authentication Failed</AlertTitle>
        <AlertDescription>
          {error}
          <br />
          <span className="text-xs mt-2 block">
            Make sure you opened this app from @pricetraqor_bot in Telegram.
          </span>
        </AlertDescription>
      </Alert>
    )
  }

  if (!user) {
    return (
      <Alert className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Not Authenticated</AlertTitle>
        <AlertDescription>
          Please open this app from @pricetraqor_bot in Telegram.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="m-4 bg-green-500/10 border-green-500">
      <CheckCircle className="h-4 w-4 text-green-500" />
      <AlertTitle>Authenticated</AlertTitle>
      <AlertDescription>
        Welcome, {user.full_name || 'User'}!
      </AlertDescription>
    </Alert>
  )
}
