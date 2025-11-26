import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Plus, Link as LinkIcon, CurrencyDollar } from '@phosphor-icons/react'
import { validateProductUrl } from '@/lib/helpers'
import { toast } from 'sonner'

interface AddProductScreenProps {
  onBack: () => void
  onAdd: (url: string, targetPrice?: number) => void
  prefillUrl?: string
}

export function AddProductScreen({ onBack, onAdd, prefillUrl }: AddProductScreenProps) {
  const [url, setUrl] = useState(prefillUrl || '')
  const [targetPrice, setTargetPrice] = useState('')
  const [urlError, setUrlError] = useState('')
  const [isValidating, setIsValidating] = useState(false)

  useEffect(() => {
    if (prefillUrl) {
      setUrl(prefillUrl)
    }
  }, [prefillUrl])

  const handleUrlChange = (value: string) => {
    setUrl(value)
    setUrlError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url.trim()) {
      setUrlError('Please enter a product URL')
      return
    }

    setIsValidating(true)
    
    const validation = validateProductUrl(url)
    
    setTimeout(() => {
      if (!validation.valid) {
        setUrlError(validation.error || 'Invalid URL')
        setIsValidating(false)
        return
      }

      const target = targetPrice ? parseFloat(targetPrice) : undefined
      
      if (targetPrice && (isNaN(target!) || target! <= 0)) {
        toast.error('Please enter a valid target price')
        setIsValidating(false)
        return
      }

      onAdd(url, target)
      toast.success('Product added to watchlist!')
      setIsValidating(false)
    }, 800)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(255,255,255,0.08)]">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add Product</h1>
          <p className="text-sm text-muted-foreground">Track prices from any supported store</p>
        </div>
      </div>

      <Card className="p-6 shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.05)] bg-gradient-to-b from-card to-card/95">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="product-url" className="text-sm font-semibold">
              Product URL
            </Label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="product-url"
                type="url"
                placeholder="https://www.amazon.com/product/..."
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                className={`pl-10 shadow-[inset_0_2px_6px_rgba(0,0,0,0.1)] ${urlError ? 'border-destructive' : ''}`}
              />
            </div>
            {urlError && (
              <p className="text-xs text-destructive font-medium">{urlError}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Supported: Amazon, Flipkart, eBay, Walmart, Target, Best Buy
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-price" className="text-sm font-semibold">
              Target Price (Optional)
            </Label>
            <div className="relative">
              <CurrencyDollar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="target-price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="pl-10 shadow-[inset_0_2px_6px_rgba(0,0,0,0.1)]"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Get notified when the price drops to or below this amount
            </p>
          </div>

          <Button type="submit" className="w-full shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)] active:shadow-[inset_0_3px_10px_rgba(0,0,0,0.25)]" disabled={isValidating}>
            {isValidating ? (
              <>
                <span className="animate-pulse">Validating...</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 mr-2" weight="bold" />
                Add to Watchlist
              </>
            )}
          </Button>
        </form>
      </Card>

      <Card className="p-5 bg-gradient-to-br from-muted/60 to-muted/40 shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.05)]">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
          How it works
        </h3>
        <ul className="text-xs text-muted-foreground space-y-2">
          <li className="flex gap-2.5">
            <span className="text-accent font-bold">•</span>
            <span>Paste any product URL from supported stores</span>
          </li>
          <li className="flex gap-2.5">
            <span className="text-accent font-bold">•</span>
            <span>We'll track the price and notify you of changes</span>
          </li>
          <li className="flex gap-2.5">
            <span className="text-accent font-bold">•</span>
            <span>Set a target price for automatic alerts</span>
          </li>
          <li className="flex gap-2.5">
            <span className="text-accent font-bold">•</span>
            <span>View price history and trends over time</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
