/**
 * Types matching FastAPI backend MongoDB schemas
 */

// User from backend
export interface User {
  _id: string
  email?: string | null
  external_id?: string
  full_name?: string
  telegram_id?: number
  telegram_user_id?: number
  telegram_username?: string
  telegram_chat_id?: number
  photo_url?: string
  plan: string
  current_count: number
  max_products: number
  created_at: string
  updated_at: string
  is_admin: boolean
  needs_profile_setup?: boolean
}

// Product from backend (ProductOut schema)
export interface Product {
  _id: string
  marketplace: string
  url: string
  affiliate_url?: string | null
  title: string | null
  image_url?: string | null
  mrp?: number | null
  last_snapshot_price: number | null
  last_snapshot_currency?: string | null
  last_snapshot_at?: string | null
  last_alert_at?: string | null
  price_change_pct?: number | null
  availability_text?: string | null
  status: string
  alert_type?: string | null
  alert_threshold_percentage?: number | null
  alert_threshold_price?: number | null
  created_at: string
  updated_at: string
  hydrated_at?: string | null
  category?: string | null
  tags?: string[]
  notes?: string | null
  specifications?: any[] | null
  brand?: string | null
  rating?: number | null
  slug?: string | null
}

// Price snapshot from backend
export interface PriceSnapshot {
  _id: string
  product_id: string
  price: number
  fetched_at: string
  in_stock: boolean
  currency?: string
}

// Legacy types for component compatibility
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
  theme?: 'dark' | 'light'
}

export type FilterType = 'all' | 'dropped' | 'increased' | 'out-of-stock'

/**
 * Adapter function to convert backend Product to TrackedProduct format
 */
export function productToTrackedProduct(
  product: Product,
  snapshots: PriceSnapshot[] = []
): TrackedProduct {
  // Ensure snapshots is an array
  const snapshotArray = Array.isArray(snapshots) ? snapshots : []
  
  const priceHistory: PriceHistoryEntry[] = snapshotArray.map(snap => ({
    price: snap.price,
    currency: snap.currency || product.last_snapshot_currency || 'INR',
    checkedAt: snap.fetched_at,
  }))
  
  // Use last_snapshot_price from backend
  const currentPrice = product.last_snapshot_price && product.last_snapshot_price > 0
    ? product.last_snapshot_price
    : (priceHistory.length > 0 ? priceHistory[priceHistory.length - 1].price : 0)

  // Add current price as the latest entry if not already in history
  if (currentPrice && currentPrice > 0) {
    const latestHistoryPrice = priceHistory.length > 0 ? priceHistory[priceHistory.length - 1].price : null
    if (latestHistoryPrice !== currentPrice) {
      priceHistory.push({
        price: currentPrice,
        currency: product.last_snapshot_currency || 'INR',
        checkedAt: product.last_snapshot_at || product.updated_at || product.created_at,
      })
    }
  }

  // Find the last price that's different from current price
  let previousPrice: number | undefined = undefined
  for (let i = priceHistory.length - 1; i >= 0; i--) {
    if (priceHistory[i].price !== currentPrice) {
      previousPrice = priceHistory[i].price
      break
    }
  }
  
  const priceChange = previousPrice && currentPrice ? currentPrice - previousPrice : undefined
  const priceChangePercent = previousPrice && priceChange ? (priceChange / previousPrice) * 100 : undefined

  // Extract site domain from URL or use marketplace
  let siteDomain = product.marketplace
  try {
    const url = new URL(product.url)
    siteDomain = url.hostname.replace('www.', '')
  } catch {
    siteDomain = product.marketplace
  }

  return {
    id: product._id,
    productUrl: product.url,
    siteDomain,
    title: product.title || 'Untitled Product',
    imageUrl: product.image_url || '',
    currentPrice: currentPrice,
    currency: product.last_snapshot_currency || 'INR',
    targetPrice: product.alert_threshold_price || undefined,
    isActive: product.status === 'active',
    lastCheckedAt: product.last_snapshot_at || product.updated_at || product.created_at,
    createdAt: product.created_at,
    priceHistory,
    previousPrice,
    priceChange,
    priceChangePercent,
    inStock: product.availability_text !== 'Out of Stock',
  }
}

