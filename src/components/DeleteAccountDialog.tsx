import { useState } from 'react'
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
import { Warning, Trash, CheckCircle, WarningCircle } from '@phosphor-icons/react'

interface DeleteAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteAccountDialog({ open, onOpenChange }: DeleteAccountDialogProps) {
  const [confirmText, setConfirmText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (confirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm account deletion')
      return
    }

    setIsSubmitting(true)
    try {
      await authService.deleteAccount()
      toast.success(
        <div className="flex items-start gap-2">
          <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" weight="fill" />
          <div>
            <div className="font-semibold">Account Deleted</div>
            <div className="text-xs text-muted-foreground mt-1">
              Your account has been permanently deleted. Redirecting to login...
            </div>
          </div>
        </div>
      )
      // Redirect to login after a short delay
      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
    } catch (error: any) {
      toast.error(
        <div className="flex items-start gap-2">
          <WarningCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" weight="fill" />
          <div>
            <div className="font-semibold">Failed to Delete Account</div>
            <div className="text-xs text-muted-foreground mt-1">
              {error.message || 'An error occurred while deleting your account.'}
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
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Warning className="w-5 h-5" weight="fill" />
            Delete Account
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="rounded-lg bg-destructive/10 p-4 border border-destructive/20">
              <div className="flex items-start gap-3">
                <Warning className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" weight="fill" />
                <div className="text-sm">
                  <p className="font-semibold text-destructive mb-2">Warning: This action is irreversible!</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>All tracked products will be deleted</li>
                    <li>Your price history will be lost</li>
                    <li>All alerts will be removed</li>
                    <li>Your account cannot be recovered</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="confirm-delete">
                Type <span className="font-mono font-bold text-destructive">DELETE</span> to confirm
              </Label>
              <Input
                id="confirm-delete"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
                required
                autoComplete="off"
                className="font-mono"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false)
                setConfirmText('')
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="destructive" 
              disabled={isSubmitting || confirmText !== 'DELETE'}
            >
              <Trash className="w-4 h-4 mr-2" weight="fill" />
              {isSubmitting ? 'Deleting...' : 'Delete Account'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
