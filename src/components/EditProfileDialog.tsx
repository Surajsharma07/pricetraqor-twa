import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { User } from '@/lib/types'
import { authService } from '@/services/auth'
import { PencilSimple } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface EditProfileDialogProps {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
  onProfileUpdated: (user: User) => void
}

export function EditProfileDialog({ open, onOpenChange, user, onProfileUpdated }: EditProfileDialogProps) {
  const [fullName, setFullName] = useState(user.full_name || '')
  const [email, setEmail] = useState(user.email || '')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const updates: { full_name?: string; email?: string } = {}
      
      if (fullName !== user.full_name) {
        updates.full_name = fullName
      }
      
      if (email !== user.email) {
        updates.email = email
      }
      
      if (Object.keys(updates).length > 0) {
        const updatedUser = await authService.updateProfile(updates)
        onProfileUpdated(updatedUser)
      }
      
      onOpenChange(false)
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Failed to save profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background/95 backdrop-blur-xl border border-border/60 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PencilSimple className="w-5 h-5" weight="bold" />
            Edit Profile
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5 pt-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-semibold">
              Full Name
            </Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="neumorphic-inset"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="neumorphic-inset"
            />
            <p className="text-xs text-muted-foreground">
              Used for price drop notifications
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-muted-foreground">
              Telegram Username
            </Label>
            <Input
              value={user.telegram_username ? `@${user.telegram_username}` : 'Not set'}
              disabled
              className="neumorphic-inset cursor-not-allowed opacity-70"
            />
            <p className="text-xs text-muted-foreground">
              Your Telegram username cannot be changed
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 neumorphic-button hover:glow-primary"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
