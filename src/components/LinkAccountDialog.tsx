import { useState } from 'react'
import { User } from '@/lib/types'
import { authService } from '@/services/auth'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { WarningCircle, CheckCircle } from '@phosphor-icons/react'

interface LinkAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAccountLinked: (user: User) => void
}

export function LinkAccountDialog({ open, onOpenChange, onAccountLinked }: LinkAccountDialogProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      toast.error('Email is required')
      return
    }
    
    if (!password) {
      toast.error('Password is required')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await authService.linkTelegramAccount(email.trim(), password)
      toast.success(
        <div className="flex items-start gap-2">
          <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" weight="fill" />
          <div>
            <div className="font-semibold">Account Linked Successfully!</div>
            <div className="text-xs text-muted-foreground mt-1">
              Your Telegram account is now linked to your Pricetracker account.
            </div>
          </div>
        </div>
      )
      onAccountLinked(result.user)
      onOpenChange(false)
      setEmail('')
      setPassword('')
    } catch (error: any) {
      toast.error(
        <div className="flex items-start gap-2">
          <WarningCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" weight="fill" />
          <div>
            <div className="font-semibold">Failed to Link Account</div>
            <div className="text-xs text-muted-foreground mt-1">
              {error.message || 'Please check your credentials and try again.'}
            </div>
          </div>
        </div>
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Link Existing Account</DialogTitle>
          <DialogDescription>
            Connect your Telegram account with an existing Pricetracker account. Enter your Pricetracker credentials below.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="link-email">Pricetracker Email *</Label>
              <Input
                id="link-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                autoComplete="email"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="link-password">Pricetracker Password *</Label>
              <div className="relative">
                <Input
                  id="link-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
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
            
            <div className="rounded-lg bg-muted/50 p-3 border border-border/50">
              <div className="flex items-start gap-2">
                <WarningCircle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium mb-1">Important:</p>
                  <p>
                    By linking your accounts, your Telegram profile will be merged with your existing Pricetracker account. 
                    All tracked products will be preserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false)
                setEmail('')
                setPassword('')
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Linking...' : 'Link Account'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
