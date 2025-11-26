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
        <User className="w-6 h-6" weight="bold" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
          <p className="text-sm text-muted-foreground">Your tracking overview</p>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user?.avatarUrl} alt={user?.login || 'User'} />
            <AvatarFallback className="text-lg">
              {user ? getInitials(user.login) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{user?.login || 'Loading...'}</h2>
            {user?.email && (
              <p className="text-sm text-muted-foreground">{user.email}</p>
            )}
            {user?.isOwner && (
              <Badge variant="secondary" className="mt-2">
                Owner
              </Badge>
            )}
          </div>
        </div>
      </Card>

      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Statistics</h3>
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Package className="w-5 h-5 text-accent" weight="bold" />
              </div>
              <div>
                <p className="text-2xl font-bold">{products.length}</p>
                <p className="text-xs text-muted-foreground">Total Products</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                <ChartLine className="w-5 h-5 text-success" weight="bold" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeProducts.length}</p>
                <p className="text-xs text-muted-foreground">Active Tracking</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                <TrendDown className="w-5 h-5 text-success" weight="bold" />
              </div>
              <div>
                <p className="text-2xl font-bold">{productsWithDrops.length}</p>
                <p className="text-xs text-muted-foreground">Price Drops</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-accent" weight="bold" />
              </div>
              <div>
                <p className="text-2xl font-bold">${totalSavings.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">Total Savings</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {products.length > 0 && (
        <Card className="p-6">
          <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
            <ChartLine className="w-4 h-4" weight="bold" />
            Insights
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Average product price</span>
              <span className="text-sm font-semibold">${averagePrice.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Most tracked site</span>
              <span className="text-sm font-semibold">
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
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tracking since</span>
              <span className="text-sm font-semibold">
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
        <Card className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">Start tracking products</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Add products to your watchlist to see your tracking statistics here
          </p>
        </Card>
      )}
    </div>
  )
}
