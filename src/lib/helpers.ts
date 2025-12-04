import { TrackedProduct } from './types'

export function addAffiliateTag(url: string, site: string): string {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.toLowerCase()
    
    if (hostname.includes('amazon')) {
      const tag = import.meta.env.VITE_AMAZON_AFFILIATE_TAG || 'pricetraqor-21'
      urlObj.searchParams.set('tag', tag)
    } else if (hostname.includes('flipkart')) {
      const tag = import.meta.env.VITE_FLIPKART_AFFILIATE_TAG || 'pricetraq'
      urlObj.searchParams.set('affid', tag)
    }
    
    return urlObj.toString()
  } catch (e) {
    return url
  }
}

export function formatPrice(price: number, currency: string): string {
  // Handle undefined or null price
  if (price === undefined || price === null || isNaN(price)) {
    return 'N/A'
  }
  
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
  }

  const symbol = symbols[currency] || currency
  
  if (currency === 'JPY') {
    return `${symbol}${Math.round(price).toLocaleString()}`
  }
  
  return `${symbol}${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function calculatePriceChange(current: number, previous: number): {
  amount: number
  percent: number
  direction: 'up' | 'down' | 'same'
} {
  const amount = current - previous
  const percent = ((amount / previous) * 100)
  
  let direction: 'up' | 'down' | 'same' = 'same'
  if (amount > 0) direction = 'up'
  else if (amount < 0) direction = 'down'
  
  return { amount, percent, direction }
}

export function getRelativeTime(timestamp: string): string {
  const now = new Date()
  const then = new Date(timestamp)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return then.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function validateProductUrl(url: string): { valid: boolean; domain?: string; error?: string } {
  try {
    const parsed = new URL(url)
    const domain = parsed.hostname.replace('www.', '')
    
    const supportedDomains = [
      'amazon.com',
      'amazon.in',
      'amazon.co.uk',
      'flipkart.com',
      'ebay.com',
      'walmart.com',
      'target.com',
      'bestbuy.com',
    ]
    
    const isSupported = supportedDomains.some(d => domain.includes(d))
    
    if (!isSupported) {
      return {
        valid: false,
        error: 'Unsupported website. Try Amazon, Flipkart, eBay, Walmart, Target, or Best Buy.'
      }
    }
    
    return { valid: true, domain }
  } catch {
    return { valid: false, error: 'Invalid URL format. Please enter a complete product URL.' }
  }
}

export function getSiteName(domain: string): string {
  const domainMap: Record<string, string> = {
    'amazon.com': 'Amazon',
    'amazon.in': 'Amazon India',
    'amazon.co.uk': 'Amazon UK',
    'flipkart.com': 'Flipkart',
    'ebay.com': 'eBay',
    'walmart.com': 'Walmart',
    'target.com': 'Target',
    'bestbuy.com': 'Best Buy',
  }
  
  for (const [key, value] of Object.entries(domainMap)) {
    if (domain.includes(key)) return value
  }
  
  return domain
}

export function filterProducts(products: TrackedProduct[], filterType: string): TrackedProduct[] {
  switch (filterType) {
    case 'dropped':
      return products.filter(p => p.priceChange && p.priceChange < 0)
    case 'increased':
      return products.filter(p => p.priceChange && p.priceChange > 0)
    case 'out-of-stock':
      return products.filter(p => !p.inStock)
    default:
      return products
  }
}

export function getThemeAwareCardBg(): string {
  const isLight = document.documentElement.classList.contains('light-theme')
  return isLight
    ? 'linear-gradient(145deg, oklch(0.95 0.010 60 / 0.98), oklch(0.92 0.012 60 / 0.95))'
    : 'linear-gradient(145deg, oklch(0.18 0.04 250 / 0.95), oklch(0.14 0.03 250 / 0.9))'
}

export function getThemeAwareButtonBg(): string {
  const isLight = document.documentElement.classList.contains('light-theme')
  return isLight
    ? 'linear-gradient(145deg, oklch(0.93 0.012 60), oklch(0.89 0.015 60))'
    : 'linear-gradient(145deg, oklch(0.20 0.04 250), oklch(0.16 0.03 250))'
}

export function getThemeAwareNeumorphicBg(): string {
  const isLight = document.documentElement.classList.contains('light-theme')
  return isLight
    ? 'linear-gradient(145deg, oklch(0.94 0.010 60), oklch(0.90 0.012 60))'
    : 'linear-gradient(145deg, oklch(0.16 0.03 250), oklch(0.12 0.025 250))'
}

export function isLightTheme(): boolean {
  return document.documentElement.classList.contains('light-theme')
}

// Alias for getRelativeTime for consistency
export const formatRelativeTime = getRelativeTime
