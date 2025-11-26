export interface TrackedProduct {
  id: string
  productUrl: string
  siteDomain: string
  title: string
  imageUrl: string
  currentPrice: number
  currency: string
  targetPrice?: number
  isActive: boolean
  lastCheckedAt: string
  createdAt: string
  priceHistory: PriceHistoryEntry[]
  previousPrice?: number
  priceChange?: number
  priceChangePercent?: number
  inStock: boolean
}

export interface PriceHistoryEntry {
  price: number
  currency: string
  checkedAt: string
}

export interface UserSettings {
  notificationsEnabled: boolean
  alertType: 'drops' | 'all'
  defaultTargetPercent?: number
}

export type FilterType = 'all' | 'dropped' | 'increased' | 'out-of-stock'
