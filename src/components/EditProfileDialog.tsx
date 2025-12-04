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

interface EditProfileDialogProps {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
  onProfileUpdated: (user: User) => void
}

export function EditProfileDialog({ user, open, onOpenChange, onProfileUpdated }: EditProfileDialogProps) {
  const [fullName, setFullName] = useState(user.full_name || '')
  const [email, setEmail] = useState(user.email || '')
  const [telegramUsername, setTelegramUsername] = useState(user.telegram_username || '')
  const [mobileNumber, setMobileNumber] = useState(user.mobile_number || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!fullName.trim()) {
      toast.error('Name is required')
      return
    }

    setIsSubmitting(true)
    try {
      const updates: any = {
        full_name: fullName.trim(),
      }
      
      if (email.trim()) {
        updates.email = email.trim()
      }
      
      if (telegramUsername.trim()) {
        updates.telegram_username = telegramUsername.trim()
      }
      
      if (mobileNumber.trim()) {
        updates.mobile_number = mobileNumber.trim()
      }
      
      const updatedUser = await authService.updateProfile(updates)
      onProfileUpdated(updatedUser)
      toast.success('Profile updated successfully')
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your personal information. Changes will be saved to your account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="telegramUsername">Telegram Username</Label>
              <Input
                id="telegramUsername"
                value={telegramUsername}
                onChange={(e) => setTelegramUsername(e.target.value)}
                placeholder="@username"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="mobileNumber">Mobile Number</Label>
              <Input
                id="mobileNumber"
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="+1234567890"
              />
              <p className="text-xs text-muted-foreground">
                For future SMS alerts (optional)
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
