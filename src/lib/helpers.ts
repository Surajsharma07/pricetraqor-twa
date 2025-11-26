import { TrackedProduct } from './types'

export function formatPrice(price: number, currency: string): string {
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
