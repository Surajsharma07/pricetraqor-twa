import { useState } from 'react'
import { User } from '@/lib/types'
import { authService } from '@/services/auth'
import { isAccountFullySynced, getLinkingRequirement } from '@/lib/accountHelpers'
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
import { WarningCircle, CheckCircle, TelegramLogo } from '@phosphor-icons/react'

interface LinkAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAccountLinked: (user: User) => void
  currentUser?: User | null
}

type LinkingMode = 'email' | 'telegram' | 'none'

export function LinkAccountDialog({ open, onOpenChange, onAccountLinked, currentUser }: LinkAccountDialogProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // Determine what type of linking is needed
  const linkingMode: LinkingMode = 
    isAccountFullySynced(currentUser) ? 'none' 
    : getLinkingRequirement(currentUser) === 'email' ? 'email' 
    : 'telegram'

  // If account is fully synced, don't show the dialog
  if (isAccountFullySynced(currentUser)) {
    return null
  }

  const handleLinkEmailPassword = async (e: React.FormEvent) => {
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
              Your accounts are now linked and synchronized.
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

  const handleClose = () => {
    onOpenChange(false)
    setEmail('')
    setPassword('')
  }

  // Email linking mode - user logged in with Telegram, needs to link email
  if (linkingMode === 'email') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Link Email Account</DialogTitle>
            <DialogDescription>
              Your Telegram account is not linked to an email yet. Link your existing Pricetracker email account or create a new one.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleLinkEmailPassword}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="link-email">Email Address *</Label>
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
                <Label htmlFor="link-password">Password *</Label>
                <div className="relative">
                  <Input
                    id="link-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
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
              
              <div className="rounded-lg bg-blue-500/10 p-3 border border-blue-500/30">
                <div className="flex items-start gap-2">
                  <WarningCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-500/90">
                    <p className="font-medium mb-1">Linking will:</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      <li>Merge your Telegram and email accounts</li>
                      <li>Preserve all tracked products</li>
                      <li>Enable login via both methods</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Linking...' : 'Link Email'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  // Telegram linking mode - user logged in with email, would link Telegram
  // This would typically be handled via Telegram button in profile, not this dialog
  if (linkingMode === 'telegram') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Link Telegram Account</DialogTitle>
            <DialogDescription>
              Your email account is not linked to Telegram yet. Link your Telegram account for easier access.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="rounded-lg bg-blue-500/10 p-4 border border-blue-500/30 space-y-3">
              <div className="flex items-start gap-3">
                <TelegramLogo className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" weight="fill" />
                <div className="text-sm">
                  <p className="font-semibold text-foreground mb-1">Link Your Telegram Account</p>
                  <p className="text-xs text-muted-foreground">
                    Linking Telegram will allow you to access Pricetracker directly from your Telegram bot and receive notifications on Telegram.
                  </p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleClose}
              className="w-full"
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // No linking needed - fully synced
  return null
}

