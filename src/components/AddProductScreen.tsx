import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Link as LinkIcon, QrCode, Percent, CurrencyCircleDollar } from '@phosphor-icons/react'
import { validateProductUrl } from '@/lib/helpers'
import { toast } from 'sonner'
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface AddProductScreenProps {
  onBack: () => void
  onAdd: (url: string, targetPrice?: number, alertType?: string, alertPercentage?: number) => void
  prefillUrl?: string
}

export function AddProductScreen({ onBack, onAdd, prefillUrl }: AddProductScreenProps) {
  const twa = useTelegramWebApp()
  const [url, setUrl] = useState(prefillUrl || '')
  const [alertType, setAlertType] = useState<'none' | 'percentage_drop' | 'price_below'>('none')
  const [targetPrice, setTargetPrice] = useState('')
  const [targetPercent, setTargetPercent] = useState('10')
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

  const handleScanQR = async () => {
    try {
      twa.haptic.impact('light')
      const scannedData = await twa.scanQR('Scan product QR code or barcode')
      
      // Check if the scanned data is a URL
      if (scannedData && scannedData.startsWith('http')) {
        setUrl(scannedData)
        twa.haptic.notification('success')
        toast.success('QR code scanned successfully')
      } else if (scannedData) {
        // If it's not a URL, it might be a product code - show it to user
        toast.info(`Scanned: ${scannedData}`)
        twa.haptic.notification('warning')
      }
    } catch (error: any) {
      console.error('QR scan error:', error)
      if (error.message !== 'QR Scanner not available') {
        twa.haptic.notification('error')
        toast.error('Failed to scan QR code')
      }
    }
  }

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
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

      let finalTargetPrice: number | undefined
      let finalAlertPercentage: number | undefined
      let finalAlertType: string | undefined

      if (alertType === 'price_below') {
        const target = targetPrice ? parseFloat(targetPrice) : undefined
        if (targetPrice && (isNaN(target!) || target! <= 0)) {
          toast.error('Please enter a valid target price')
          setIsValidating(false)
          return
        }
        finalTargetPrice = target
        finalAlertType = 'price_below'
      } else if (alertType === 'percentage_drop') {
        const percent = parseFloat(targetPercent)
        if (isNaN(percent) || percent <= 0 || percent > 100) {
          toast.error('Please enter a valid percentage (1-100)')
          setIsValidating(false)
          return
        }
        finalAlertPercentage = percent
        finalAlertType = 'percentage_drop'
      }

      onAdd(url, finalTargetPrice, finalAlertType, finalAlertPercentage)
      setIsValidating(false)
    }, 800)
  }, [url, alertType, targetPrice, targetPercent, onAdd])

  // Setup MainButton for "Add to Watchlist"
  useEffect(() => {
    const handleMainButtonClick = () => {
      handleSubmit(new Event('submit') as any)
    }

    twa.mainButton.show('Add to Watchlist', handleMainButtonClick)
    
    return () => {
      twa.mainButton.hide()
    }
  }, [handleSubmit, twa])

  // Update MainButton loading state
  useEffect(() => {
    twa.mainButton.setLoading(isValidating)
  }, [isValidating, twa])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">Add Product</h1>
        <p className="text-sm text-muted-foreground drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">Track prices from any supported store</p>
      </div>

      <Card className="p-6 glass-card relative before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-tr before:from-accent/5 before:via-transparent before:to-transparent before:opacity-50">
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <Label htmlFor="product-url" className="text-sm font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
              Product URL
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]" />
                <Input
                  id="product-url"
                  type="url"
                  placeholder="https://www.amazon.com/product/..."
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className={`pl-10 neumorphic-inset ${urlError ? 'border-destructive' : ''}`}
                />
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                onClick={handleScanQR}
                className="neumorphic-button hover:glow-accent active:scale-95 shrink-0"
                title="Scan QR Code"
              >
                <QrCode className="w-5 h-5" weight="bold" />
              </Button>
            </div>
            {urlError && (
              <p className="text-xs text-destructive font-medium">{urlError}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Supported: Amazon, Flipkart, eBay, Walmart, Target, Best Buy
            </p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
              Price Alert (Optional)
            </Label>
            <RadioGroup value={alertType} onValueChange={(value: any) => setAlertType(value)}>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="alert-none" />
                  <Label htmlFor="alert-none" className="font-normal cursor-pointer">
                    No alert - Just track price
                  </Label>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="percentage_drop" id="alert-percent" />
                    <Label htmlFor="alert-percent" className="font-normal cursor-pointer">
                      Notify on percentage drop
                    </Label>
                  </div>
                  {alertType === 'percentage_drop' && (
                    <div className="ml-6 relative">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="number"
                        step="1"
                        min="1"
                        max="100"
                        placeholder="10"
                        value={targetPercent}
                        onChange={(e) => setTargetPercent(e.target.value)}
                        className="pl-10 neumorphic-inset"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Alert when price drops by this percentage
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="price_below" id="alert-price" />
                    <Label htmlFor="alert-price" className="font-normal cursor-pointer">
                      Notify at target price
                    </Label>
                  </div>
                  {alertType === 'price_below' && (
                    <div className="ml-6 relative">
                      <CurrencyCircleDollar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={targetPrice}
                        onChange={(e) => setTargetPrice(e.target.value)}
                        className="pl-10 neumorphic-inset"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Alert when price drops to or below this amount
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </RadioGroup>
          </div>
        </form>
      </Card>

      <Card className="p-5 frosted-glass">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
          <div className="w-1.5 h-1.5 rounded-full bg-accent glow-accent"></div>
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
