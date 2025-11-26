import { useEffect, useState } from 'react'
import { TrackedProduct } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  ChartLine, 
  TrendDown, 
  Bell, 
  Package,
  Clock,
  Crown,
  Sparkle,
  Check
} from '@phosphor-icons/react'

interface ProfileScreenProps {
  products: TrackedProduct[]
}

interface UserInfo {
  login: string
  email?: string
  avatarUrl: string
  isOwner: boolean
}

export function ProfileScreen({ products }: ProfileScreenProps) {
  const [user, setUser] = useState<UserInfo | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userInfo = await window.spark.user()
        setUser(userInfo)
      } catch (error) {
        console.error('Failed to load user:', error)
      }
    }
    loadUser()
  }, [])

  const activeProducts = products.filter(p => p.isActive)
  const productsWithDrops = products.filter(p => p.priceChange && p.priceChange < 0)
  const totalSavings = productsWithDrops.reduce((sum, p) => {
    if (p.priceChange && p.previousPrice) {
      return sum + Math.abs(p.priceChange)
    }
    return sum
  }, 0)

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

  const subscriptionPlan = 'Free'
  const maxProducts = 10
  const maxPriceChecks = 100
  const usedProducts = products.length
  const usedPriceChecks = products.reduce((sum, p) => sum + p.priceHistory.length, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <User className="w-7 h-7 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" weight="bold" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">Profile</h1>
          <p className="text-sm text-muted-foreground mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">Your tracking overview</p>
        </div>
      </div>

      <Card className="p-6 glass-card relative before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-tr before:from-accent/5 before:via-transparent before:to-transparent before:opacity-50">
        <div className="flex items-center gap-4 relative z-10">
          <Avatar className="w-20 h-20 neumorphic-raised ring-2 ring-border/60">
            <AvatarImage src={user?.avatarUrl} alt={user?.login || 'User'} />
            <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70 neumorphic-inset">
              {user ? getInitials(user.login) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">{user?.login || 'Loading...'}</h2>
            {user?.email && (
              <p className="text-sm text-muted-foreground mt-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">{user.email}</p>
            )}
            {user?.isOwner && (
              <Badge variant="secondary" className="mt-2 glass-morphism">
                Owner
              </Badge>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-6 glass-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/20 via-accent/10 to-transparent blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full neumorphic-raised flex items-center justify-center">
                <Crown className="w-5 h-5 text-accent drop-shadow-[0_2px_6px_rgba(var(--accent),0.6)]" weight="fill" />
              </div>
              <div>
                <h3 className="text-lg font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">Subscription</h3>
                <p className="text-xs text-muted-foreground drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">{subscriptionPlan} Plan</p>
              </div>
            </div>
            <Badge variant="secondary" className="glass-morphism px-3 py-1">
              <Sparkle className="w-3 h-3 mr-1" weight="fill" />
              Active
            </Badge>
          </div>

          <div className="space-y-4 mb-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">Products Tracked</span>
                <span className="text-sm font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]">{usedProducts} / {maxProducts}</span>
              </div>
              <div className="h-2.5 neumorphic-inset rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-accent via-accent/90 to-accent/80 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(var(--accent),0.5)]"
                  style={{ width: `${Math.min((usedProducts / maxProducts) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">Price Checks Used</span>
                <span className="text-sm font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]">{usedPriceChecks} / {maxPriceChecks}</span>
              </div>
              <div className="h-2.5 neumorphic-inset rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-success via-success/90 to-success/80 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(var(--success),0.4)]"
                  style={{ width: `${Math.min((usedPriceChecks / maxPriceChecks) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="p-4 frosted-glass rounded-xl border border-border/30 mb-4">
            <p className="text-xs font-semibold text-muted-foreground mb-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">Free Plan Includes:</p>
            <div className="space-y-2">
              {[
                `Track up to ${maxProducts} products`,
                `${maxPriceChecks} price checks per month`,
                'Daily price updates',
                'Email notifications',
                'Price history charts'
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full neumorphic-inset flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-success" weight="bold" />
                  </div>
                  <span className="text-xs font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <Button 
            className="w-full neumorphic-button hover:glow-primary active:scale-95 bg-gradient-to-br from-primary via-primary/90 to-primary/80 shadow-[0_4px_16px_rgba(var(--primary),0.3)]"
            size="lg"
          >
            <Crown className="w-5 h-5 mr-2" weight="fill" />
            Upgrade to Pro
          </Button>
        </div>
      </Card>

      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
          <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(var(--accent),0.6)]"></div>
          Statistics
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 glass-card hover:glow-accent transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full neumorphic-inset flex items-center justify-center">
                <Package className="w-6 h-6 text-accent drop-shadow-[0_2px_6px_rgba(var(--accent),0.5)]" weight="bold" />
              </div>
              <div>
                <p className="text-2xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">{products.length}</p>
                <p className="text-xs text-muted-foreground font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">Total Products</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 glass-card hover:glow-accent transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full neumorphic-inset flex items-center justify-center">
                <ChartLine className="w-6 h-6 text-success drop-shadow-[0_2px_6px_rgba(var(--success),0.5)]" weight="bold" />
              </div>
              <div>
                <p className="text-2xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">{activeProducts.length}</p>
                <p className="text-xs text-muted-foreground font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">Active Tracking</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 glass-card hover:glow-accent transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full neumorphic-inset flex items-center justify-center">
                <TrendDown className="w-6 h-6 text-success drop-shadow-[0_2px_6px_rgba(var(--success),0.5)]" weight="bold" />
              </div>
              <div>
                <p className="text-2xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">{productsWithDrops.length}</p>
                <p className="text-xs text-muted-foreground font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">Price Drops</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 glass-card hover:glow-accent transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full neumorphic-inset flex items-center justify-center">
                <Bell className="w-6 h-6 text-accent drop-shadow-[0_2px_6px_rgba(var(--accent),0.5)]" weight="bold" />
              </div>
              <div>
                <p className="text-2xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">${totalSavings.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">Total Savings</p>
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
              <span className="text-sm font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]">${averagePrice.toFixed(2)}</span>
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
    </div>
  )
}
