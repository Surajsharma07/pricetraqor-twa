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
  Clock
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <User className="w-7 h-7" weight="bold" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Your tracking overview</p>
        </div>
      </div>

      <Card className="p-6 shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.05)] bg-gradient-to-b from-card to-card/95">
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20 shadow-[0_4px_16px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(255,255,255,0.1)] ring-2 ring-border/50">
            <AvatarImage src={user?.avatarUrl} alt={user?.login || 'User'} />
            <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-primary/80 to-primary/60">
              {user ? getInitials(user.login) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{user?.login || 'Loading...'}</h2>
            {user?.email && (
              <p className="text-sm text-muted-foreground mt-0.5">{user.email}</p>
            )}
            {user?.isOwner && (
              <Badge variant="secondary" className="mt-2 shadow-[0_2px_6px_rgba(0,0,0,0.1)]">
                Owner
              </Badge>
            )}
          </div>
        </div>
      </Card>

      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
          Statistics
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 shadow-[0_4px_12px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.05)] bg-gradient-to-br from-card to-card/95 hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/30 to-accent/15 flex items-center justify-center shadow-[inset_0_3px_8px_rgba(0,0,0,0.15),0_2px_4px_rgba(0,0,0,0.1)]">
                <Package className="w-6 h-6 text-accent" weight="bold" />
              </div>
              <div>
                <p className="text-2xl font-bold">{products.length}</p>
                <p className="text-xs text-muted-foreground font-medium">Total Products</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 shadow-[0_4px_12px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.05)] bg-gradient-to-br from-card to-card/95 hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-success/30 to-success/15 flex items-center justify-center shadow-[inset_0_3px_8px_rgba(0,0,0,0.15),0_2px_4px_rgba(0,0,0,0.1)]">
                <ChartLine className="w-6 h-6 text-success" weight="bold" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeProducts.length}</p>
                <p className="text-xs text-muted-foreground font-medium">Active Tracking</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 shadow-[0_4px_12px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.05)] bg-gradient-to-br from-card to-card/95 hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-success/30 to-success/15 flex items-center justify-center shadow-[inset_0_3px_8px_rgba(0,0,0,0.15),0_2px_4px_rgba(0,0,0,0.1)]">
                <TrendDown className="w-6 h-6 text-success" weight="bold" />
              </div>
              <div>
                <p className="text-2xl font-bold">{productsWithDrops.length}</p>
                <p className="text-xs text-muted-foreground font-medium">Price Drops</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 shadow-[0_4px_12px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.05)] bg-gradient-to-br from-card to-card/95 hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/30 to-accent/15 flex items-center justify-center shadow-[inset_0_3px_8px_rgba(0,0,0,0.15),0_2px_4px_rgba(0,0,0,0.1)]">
                <Bell className="w-6 h-6 text-accent" weight="bold" />
              </div>
              <div>
                <p className="text-2xl font-bold">${totalSavings.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground font-medium">Total Savings</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {products.length > 0 && (
        <Card className="p-6 shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.05)] bg-gradient-to-b from-card to-card/95">
          <h3 className="text-sm font-semibold mb-5 flex items-center gap-2">
            <ChartLine className="w-5 h-5" weight="bold" />
            Insights
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gradient-to-br from-muted/80 to-muted/60 rounded-lg shadow-[inset_0_2px_6px_rgba(0,0,0,0.1)]">
              <span className="text-sm text-muted-foreground font-medium">Average product price</span>
              <span className="text-sm font-bold">${averagePrice.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gradient-to-br from-muted/80 to-muted/60 rounded-lg shadow-[inset_0_2px_6px_rgba(0,0,0,0.1)]">
              <span className="text-sm text-muted-foreground font-medium">Most tracked site</span>
              <span className="text-sm font-bold">
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
            <div className="flex items-center justify-between p-3 bg-gradient-to-br from-muted/80 to-muted/60 rounded-lg shadow-[inset_0_2px_6px_rgba(0,0,0,0.1)]">
              <span className="text-sm text-muted-foreground font-medium">Tracking since</span>
              <span className="text-sm font-bold">
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
        <Card className="p-8 text-center shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.05)] bg-gradient-to-b from-card to-card/95">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-muted/80 to-muted/60 flex items-center justify-center mx-auto mb-5 shadow-[inset_0_3px_8px_rgba(0,0,0,0.15),0_2px_6px_rgba(0,0,0,0.1)]">
            <Clock className="w-10 h-10 text-muted-foreground" weight="bold" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Start tracking products</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Add products to your watchlist to see your tracking statistics here
          </p>
        </Card>
      )}
    </div>
  )
}
