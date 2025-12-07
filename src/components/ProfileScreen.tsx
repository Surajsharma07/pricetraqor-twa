import { useEffect, useState } from 'react'
import { TrackedProduct, User as UserType } from '@/lib/types'
import { authService } from '@/services/auth'
import { formatPrice } from '@/lib/helpers'
import { isAccountFullySynced } from '@/lib/accountHelpers'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EditProfileDialog } from '@/components/EditProfileDialog'
import { LinkAccountDialog } from '@/components/LinkAccountDialog'
import { ChangePasswordDialog } from '@/components/ChangePasswordDialog'
import { 
  User, 
  ChartLine,
  TrendDown, 
  Bell, 
  Package,
  Clock,
  Crown,
  Sparkle,
  Check,
  PencilSimple,
  Link as LinkIcon,
  LockKey
} from '@phosphor-icons/react'

interface ProfileScreenProps {
  products: TrackedProduct[]
  onLogout?: () => void
}

export function ProfileScreen({ products, onLogout }: ProfileScreenProps) {
  const [user, setUser] = useState<UserType | null>(null)
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [linkAccountOpen, setLinkAccountOpen] = useState(false)
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const isLightTheme = document.documentElement.classList.contains('light-theme')

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userInfo = await authService.getCurrentUser()
        setUser(userInfo)
      } catch (error) {
        console.error('Failed to load user:', error)
      }
    }
    loadUser()
  }, [])

  const activeProducts = products.filter(p => p.isActive)
  const productsWithDrops = products.filter(p => p.priceChange && p.priceChange < 0)

  const averagePrice = products.length > 0
    ? products.reduce((sum, p) => sum + p.currentPrice, 0) / products.length
    : 0

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const subscriptionPlan = user?.plan?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Free'
  const maxProducts = user?.max_products || 10
  const usedProducts = user?.current_count || products.length
  const usedPriceChecks = products.reduce((sum, p) => sum + p.priceHistory.length, 0)

  const handleProfileUpdated = (updatedUser: UserType) => {
    setUser(updatedUser)
  }

  const handleAccountLinked = (linkedUser: UserType) => {
    setUser(linkedUser)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <User className="w-7 h-7 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" weight="bold" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">Profile</h1>
          <p className="text-sm text-muted-foreground mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">Your tracking overview</p>
        </div>
      </div>

      <Card 
        className="p-6 relative overflow-hidden neumorphic-raised"
        style={{
          background: 'linear-gradient(145deg, oklch(0.18 0.04 250 / 0.95), oklch(0.14 0.03 250 / 0.9))',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>
        <div className="flex items-center gap-4 relative z-10">
          <Avatar className="w-20 h-20 neumorphic-raised ring-2 ring-border/60 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-50 pointer-events-none z-10"></div>
            <AvatarImage src={user?.photo_url} alt={user?.full_name || user?.telegram_username || 'User'} />
            <AvatarFallback 
              className="text-xl font-bold neumorphic-inset relative"
              style={{
                background: 'linear-gradient(145deg, oklch(0.55 0.18 250), oklch(0.45 0.18 250))',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-60 pointer-events-none"></div>
              <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                {user?.full_name || user?.telegram_username ? getInitials(user?.full_name || user?.telegram_username || '') : 'U'}
              </span>
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-bold drop-shadow-[0_3px_6px_rgba(0,0,0,0.6)]">{user?.full_name || user?.telegram_username || 'Loading...'}</h2>
            {user?.telegram_username && (
              <p className="text-sm text-muted-foreground mt-0.5 drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]">@{user.telegram_username}</p>
            )}
            {user?.is_admin && (
              <Badge 
                variant="secondary" 
                className="mt-2 glass-morphism border border-accent/30 glow-accent"
                style={{
                  background: 'linear-gradient(145deg, oklch(0.20 0.04 250 / 0.8), oklch(0.16 0.03 250 / 0.6))',
                }}
              >
                <Sparkle className="w-3 h-3 mr-1" weight="fill" />
                Owner
              </Badge>
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => setEditProfileOpen(true)}
        >
          <PencilSimple className="w-4 h-4 mr-2" weight="bold" />
          Edit Profile
        </Button>
        
        {!isAccountFullySynced(user) && (
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setLinkAccountOpen(true)}
          >
            <LinkIcon className="w-4 h-4 mr-2" weight="bold" />
            Link Account
          </Button>
        )}
        
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => setChangePasswordOpen(true)}
        >
          <LockKey className="w-4 h-4 mr-2" weight="bold" />
          Change Password
        </Button>
      </div>

      <Card 
        className="p-6 relative overflow-hidden neumorphic-raised"
        style={{
          background: 'linear-gradient(145deg, oklch(0.18 0.04 250 / 0.95), oklch(0.14 0.03 250 / 0.9))',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-accent/25 via-accent/10 to-transparent blur-3xl pointer-events-none"></div>
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full neumorphic-raised flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-transparent to-transparent opacity-60 pointer-events-none"></div>
                <Crown className="w-6 h-6 text-accent drop-shadow-[0_3px_8px_oklch(0.65_0.20_230_/_0.7)] relative z-10 glow-accent" weight="fill" />
              </div>
              <div>
                <h3 className="text-lg font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">Subscription</h3>
                <p className="text-xs text-muted-foreground drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">{subscriptionPlan} Plan</p>
              </div>
            </div>
            <Badge 
              variant="secondary" 
              className="px-3 py-1.5 neumorphic-inset border border-accent/30 glow-accent"
              style={{
                background: 'linear-gradient(145deg, oklch(0.12 0.02 250), oklch(0.16 0.03 250))',
              }}
            >
              <Sparkle className="w-3.5 h-3.5 mr-1.5" weight="fill" />
              <span className="font-bold">Active</span>
            </Badge>
          </div>

          <div className="space-y-5 mb-6">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-sm text-muted-foreground font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">Products Tracked</span>
                <span className="text-sm font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">{usedProducts} / {maxProducts}</span>
              </div>
              <div className="h-3 neumorphic-inset rounded-full overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-30 pointer-events-none"></div>
                <div 
                  className="h-full bg-gradient-to-r from-accent via-accent/90 to-accent/80 rounded-full transition-all duration-500 relative glow-accent"
                  style={{ 
                    width: `${Math.min((usedProducts / maxProducts) * 100, 100)}%`,
                    boxShadow: '0 0 12px oklch(0.65 0.20 230 / 0.6), inset 0 1px 0 oklch(0.95 0 0 / 0.2)'
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div 
            className="p-5 rounded-xl border mb-5 neumorphic-inset relative overflow-hidden"
            style={{
              borderColor: 'oklch(0.25 0.04 250 / 0.4)',
              background: 'linear-gradient(145deg, oklch(0.12 0.02 250 / 0.8), oklch(0.16 0.03 250 / 0.6))',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <p className="text-xs font-bold text-muted-foreground mb-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-accent shadow-[0_0_6px_oklch(0.65_0.20_230_/_0.8)]"></div>
              Free Plan Includes:
            </p>
            <div className="space-y-3">
              {[
                `Track up to ${maxProducts} products`,
                'Unlimited price checks',
                'Daily price updates',
                'Email notifications',
                'Price history charts'
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full neumorphic-inset flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-success/20 via-transparent to-transparent opacity-50 pointer-events-none"></div>
                    <Check className="w-3.5 h-3.5 text-success drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] relative z-10" weight="bold" />
                  </div>
                  <span className="text-xs font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <Button 
            className="w-full neumorphic-button hover:glow-primary active:scale-95 relative overflow-hidden"
            size="lg"
            style={{
              background: 'linear-gradient(145deg, oklch(0.55 0.18 250), oklch(0.45 0.18 250))',
              boxShadow: `
                8px 8px 16px oklch(0.06 0.01 250 / 0.6),
                -4px -4px 12px oklch(0.22 0.04 250 / 0.4),
                inset 0 1px 0 oklch(0.95 0 0 / 0.15),
                0 0 30px oklch(0.50 0.18 250 / 0.3)
              `
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/25 via-transparent to-transparent opacity-70 pointer-events-none"></div>
            <Crown className="w-5 h-5 mr-2 relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" weight="fill" />
            <span className="relative z-10 font-bold">Upgrade to Pro</span>
          </Button>
        </div>
      </Card>

      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2 drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]">
          <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_oklch(0.65_0.20_230_/_0.8)] glow-accent"></div>
          Statistics
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <Card 
            className="p-4 hover:glow-accent transition-all duration-300 cursor-pointer active:scale-[0.98] neumorphic-raised relative overflow-hidden group"
            style={{
              background: 'linear-gradient(145deg, oklch(0.18 0.04 250 / 0.95), oklch(0.14 0.03 250 / 0.9))',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-12 h-12 rounded-full neumorphic-inset flex items-center justify-center relative overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-transparent opacity-50 pointer-events-none"></div>
                <Package className="w-6 h-6 text-accent drop-shadow-[0_3px_6px_oklch(0.65_0.20_230_/_0.6)] relative z-10" weight="bold" />
              </div>
              <div>
                <p className="text-2xl font-bold drop-shadow-[0_3px_6px_rgba(0,0,0,0.6)]">{products.length}</p>
                <p className="text-xs text-muted-foreground font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">Total Products</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-4 hover:glow-success transition-all duration-300 cursor-pointer active:scale-[0.98] neumorphic-raised relative overflow-hidden group"
            style={{
              background: 'linear-gradient(145deg, oklch(0.18 0.04 250 / 0.95), oklch(0.14 0.03 250 / 0.9))',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-success/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-12 h-12 rounded-full neumorphic-inset flex items-center justify-center relative overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-success/20 via-transparent to-transparent opacity-50 pointer-events-none"></div>
                <ChartLine className="w-6 h-6 text-success drop-shadow-[0_3px_6px_oklch(0.65_0.20_145_/_0.6)] relative z-10" weight="bold" />
              </div>
              <div>
                <p className="text-2xl font-bold drop-shadow-[0_3px_6px_rgba(0,0,0,0.6)]">{activeProducts.length}</p>
                <p className="text-xs text-muted-foreground font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">Active Tracking</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-4 hover:glow-success transition-all duration-300 cursor-pointer active:scale-[0.98] neumorphic-raised relative overflow-hidden group"
            style={{
              background: 'linear-gradient(145deg, oklch(0.18 0.04 250 / 0.95), oklch(0.14 0.03 250 / 0.9))',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-success/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-12 h-12 rounded-full neumorphic-inset flex items-center justify-center relative overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-success/20 via-transparent to-transparent opacity-50 pointer-events-none"></div>
                <TrendDown className="w-6 h-6 text-success drop-shadow-[0_3px_6px_oklch(0.65_0.20_145_/_0.6)] relative z-10" weight="bold" />
              </div>
              <div>
                <p className="text-2xl font-bold drop-shadow-[0_3px_6px_rgba(0,0,0,0.6)]">{productsWithDrops.length}</p>
                <p className="text-xs text-muted-foreground font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">Price Drops</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-4 hover:glow-accent transition-all duration-300 cursor-pointer active:scale-[0.98] neumorphic-raised relative overflow-hidden group"
            style={{
              background: 'linear-gradient(145deg, oklch(0.18 0.04 250 / 0.95), oklch(0.14 0.03 250 / 0.9))',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-12 h-12 rounded-full neumorphic-inset flex items-center justify-center relative overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-transparent opacity-50 pointer-events-none"></div>
                <Bell className="w-6 h-6 text-accent drop-shadow-[0_3px_6px_oklch(0.65_0.20_230_/_0.6)] relative z-10" weight="bold" />
              </div>
              <div>
                <p className="text-2xl font-bold drop-shadow-[0_3px_6px_rgba(0,0,0,0.6)]">{products.filter(p => p.targetPrice).length}</p>
                <p className="text-xs text-muted-foreground font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">Alerts Active</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {products.length > 0 && (
        <Card className="p-6 glass-card">
          <h3 className="text-sm font-semibold mb-5 flex items-center gap-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
            <ChartLine className="w-5 h-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" weight="bold" />
            Insights
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 frosted-glass rounded-lg border border-border/30">
              <span className="text-sm text-muted-foreground font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">Average product price</span>
              <span className="text-sm font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]">{formatPrice(averagePrice, 'INR')}</span>
            </div>
            <div className="flex items-center justify-between p-3 frosted-glass rounded-lg border border-border/30">
              <span className="text-sm text-muted-foreground font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">Most tracked site</span>
              <span className="text-sm font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
                {products.length > 0
                  ? products.reduce((acc, p) => {
                      acc[p.siteDomain] = (acc[p.siteDomain] || 0) + 1
                      return acc
                    }, {} as Record<string, number>)[
                      Object.entries(
                        products.reduce((acc, p) => {
                          acc[p.siteDomain] = (acc[p.siteDomain] || 0) + 1
                          return acc
                        }, {} as Record<string, number>)
                      ).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
                    ]
                  : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 frosted-glass rounded-lg border border-border/30">
              <span className="text-sm text-muted-foreground font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">Tracking since</span>
              <span className="text-sm font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
                {products.length > 0
                  ? new Date(
                      Math.min(...products.map(p => new Date(p.createdAt).getTime()))
                    ).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
                  : 'N/A'}
              </span>
            </div>
          </div>
        </Card>
      )}

      {products.length === 0 && (
        <Card className="p-8 text-center glass-card">
          <div className="w-20 h-20 rounded-full neumorphic-inset flex items-center justify-center mx-auto mb-5">
            <Clock className="w-10 h-10 text-muted-foreground drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" weight="bold" />
          </div>
          <h3 className="text-lg font-semibold mb-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]">Start tracking products</h3>
          <p className="text-sm text-muted-foreground mb-6 drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
            Add products to your watchlist to see your tracking statistics here
          </p>
        </Card>
      )}

      {/* Logout Button */}
      {onLogout && (
        <div className="pb-24">
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => {
              if (confirm('Are you sure you want to logout?')) {
                onLogout()
              }
            }}
          >
            <span>Logout</span>
          </Button>
        </div>
      )}

      {/* Dialogs */}
      {user && (
        <>
          <EditProfileDialog
            user={user}
            open={editProfileOpen}
            onOpenChange={setEditProfileOpen}
            onProfileUpdated={handleProfileUpdated}
          />
          <LinkAccountDialog
            open={linkAccountOpen}
            onOpenChange={setLinkAccountOpen}
            onAccountLinked={handleAccountLinked}
            currentUser={user}
          />
          <ChangePasswordDialog
            open={changePasswordOpen}
            onOpenChange={setChangePasswordOpen}
          />
        </>
      )}
    </div>
  )
}
