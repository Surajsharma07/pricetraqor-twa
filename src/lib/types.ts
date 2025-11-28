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

// Product from backend
export interface Product {
  _id: string
  user_id: string
  url: string
  title: string
  current_price: number
  desired_price?: number
  image_url?: string
  platform: string
  currency?: string
  is_active: boolean
  in_stock?: boolean
  last_checked?: string
  created_at: string
  updated_at?: string
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
    currency: snap.currency || product.currency || 'INR',
    checkedAt: snap.fetched_at,
  }))
  
  // Add current price as the latest entry if not already in history
  if (product.current_price && product.current_price > 0) {
    const latestHistoryPrice = priceHistory.length > 0 ? priceHistory[priceHistory.length - 1].price : null
    if (latestHistoryPrice !== product.current_price) {
      priceHistory.push({
        price: product.current_price,
        currency: product.currency || 'INR',
        checkedAt: product.last_checked || product.updated_at || product.created_at,
      })
    }
  }
  
  // If current_price is 0 or null, use the latest snapshot price
  const currentPrice = (product.current_price && product.current_price > 0) 
    ? product.current_price 
    : (priceHistory.length > 0 ? priceHistory[priceHistory.length - 1].price : 0)

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

  // Extract site domain from URL
  let siteDomain = product.platform
  try {
    const url = new URL(product.url)
    siteDomain = url.hostname.replace('www.', '')
  } catch {
    siteDomain = product.platform
  }

  return {
    id: product._id,
    productUrl: product.url,
    siteDomain,
    title: product.title || 'Untitled Product',
    imageUrl: product.image_url || '',
    currentPrice: currentPrice,
    currency: product.currency || 'INR',
    targetPrice: product.desired_price,
    isActive: product.is_active ?? true,
    lastCheckedAt: product.last_checked || product.updated_at || product.created_at,
    createdAt: product.created_at,
    priceHistory,
    previousPrice,
    priceChange,
    priceChangePercent,
    inStock: product.in_stock ?? true,
  }
}

