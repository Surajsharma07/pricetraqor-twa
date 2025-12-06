import { User } from '@/lib/types'

/**
 * Check if user account is fully synced (has both email and Telegram linked)
 */
export function isAccountFullySynced(user: User | null): boolean {
  if (!user) return false
  return !!(user.has_email && user.has_telegram)
}

/**
 * Check if user has only Telegram account (no email/password)
 */
export function isTelegramOnlyUser(user: User | null): boolean {
  if (!user) return false
  return !!(user.has_telegram && !user.has_email)
}

/**
 * Check if user has only email account (no Telegram)
 */
export function isEmailOnlyUser(user: User | null): boolean {
  if (!user) return false
  return !!(user.has_email && !user.has_telegram)
}

/**
 * Get the type of account linking needed
 */
export function getLinkingRequirement(user: User | null): 'none' | 'telegram' | 'email' {
  if (!user) return 'none'
  
  // If fully synced, no linking needed
  if (isAccountFullySynced(user)) {
    return 'none'
  }
  
  // If only email, needs Telegram
  if (isEmailOnlyUser(user)) {
    return 'telegram'
  }
  
  // If only Telegram, needs email
  if (isTelegramOnlyUser(user)) {
    return 'email'
  }
  
  return 'none'
}
