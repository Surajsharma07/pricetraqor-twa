import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Link as LinkIcon, QrCode, Percent, CurrencyCircleDollar, SpinnerGap } from '@phosphor-icons/react'
import { validateProductUrl } from '@/lib/helpers'
import { toast } from 'sonner'
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import WebApp from '@twa-dev/sdk'

export type AddProductStatus = 'idle' | 'adding' | 'fetching' | 'success' | 'error'

interface AddProductScreenProps {
  onBack: () => void
  onAdd: (url: string, targetPrice?: number, alertType?: string, alertPercentage?: number) => void
  prefillUrl?: string
  status?: AddProductStatus
  theme?: 'dark' | 'light'
}

// Global handler reference for MainButton - avoids stale closure issues
let globalAddProductHandler: (() => void) | null = null

export function AddProductScreen({ onBack, onAdd, prefillUrl, status = 'idle', theme = 'dark' }: AddProductScreenProps) {
  const twa = useTelegramWebApp()
  const [url, setUrl] = useState(prefillUrl || '')
  const [alertType, setAlertType] = useState<'none' | 'percentage_drop' | 'price_below'>('none')
  const [targetPrice, setTargetPrice] = useState('')
  const [targetPercent, setTargetPercent] = useState('10')
  const [urlError, setUrlError] = useState('')
  
  // Derive isSubmitting from status
  const isSubmitting = status === 'adding' || status === 'fetching'
  
  // Use refs for current values - this is the key to avoiding stale closures!
  const onAddRef = useRef(onAdd)
  const urlRef = useRef(url)
  const alertTypeRef = useRef(alertType)
  const targetPriceRef = useRef(targetPrice)
  const targetPercentRef = useRef(targetPercent)
  const isSubmittingRef = useRef(false)
  
  // Keep refs in sync
  useEffect(() => { onAddRef.current = onAdd }, [onAdd])
  useEffect(() => { urlRef.current = url }, [url])
  useEffect(() => { alertTypeRef.current = alertType }, [alertType])
  useEffect(() => { targetPriceRef.current = targetPrice }, [targetPrice])
  useEffect(() => { targetPercentRef.current = targetPercent }, [targetPercent])
  useEffect(() => { isSubmittingRef.current = isSubmitting }, [isSubmitting])

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

  const handleAddProduct = useCallback(() => {
    console.log('[AddProductScreen] handleAddProduct called!')
    
    // Prevent multiple submissions
    if (isSubmittingRef.current) {
      console.log('[AddProductScreen] Already submitting, ignoring duplicate click')
      return
    }
    
    const currentUrl = urlRef.current
    const currentAlertType = alertTypeRef.current
    const currentTargetPrice = targetPriceRef.current
    const currentTargetPercent = targetPercentRef.current
    
    console.log('[AddProductScreen] Current URL:', currentUrl)

    if (!currentUrl.trim()) {
      console.log('[AddProductScreen] URL is empty')
      setUrlError('Please enter a product URL')
      return
    }

    const validation = validateProductUrl(currentUrl)
    
    if (!validation.valid) {
      setUrlError(validation.error || 'Invalid URL')
      return
    }

    // Clear any previous errors
    setUrlError('')

    let finalTargetPrice: number | undefined
    let finalAlertPercentage: number | undefined
    let finalAlertType: string | undefined

    if (currentAlertType === 'price_below') {
      const target = currentTargetPrice ? parseFloat(currentTargetPrice) : undefined
      if (currentTargetPrice && (isNaN(target!) || target! <= 0)) {
        toast.error('Please enter a valid target price')
        return
      }
      finalTargetPrice = target
      finalAlertType = 'price_below'
    } else if (currentAlertType === 'percentage_drop') {
      const percent = parseFloat(currentTargetPercent)
      if (isNaN(percent) || percent <= 0 || percent > 100) {
        toast.error('Please enter a valid percentage (1-100)')
        return
      }
      finalAlertPercentage = percent
      finalAlertType = 'percentage_drop'
    }

    // Call onAdd using REF to avoid stale closure!
    console.log('[AddProductScreen] Calling onAddRef.current')
    onAddRef.current(currentUrl, finalTargetPrice, finalAlertType, finalAlertPercentage)
  }, []) // No dependencies - we use refs!

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleAddProduct()
  }

  // Get button text based on status
  const getButtonText = () => {
    switch (status) {
      case 'adding':
        return 'Adding Product...'
      case 'fetching':
        return 'Fetching Details...'
      case 'success':
        return 'Success!'
      case 'error':
        return 'Add to Watchlist'
      default:
        return 'Add to Watchlist'
    }
  }

  // Setup MainButton 
  useEffect(() => {
    const buttonText = getButtonText()
    
    // Handler function
    const onMainButtonClick = () => {
      console.log('[MainButton] CLICKED - calling handleAddProduct')
      handleAddProduct()
    }
    
    // Remove any existing handler first
    if (globalAddProductHandler) {
      WebApp.MainButton.offClick(globalAddProductHandler)
    }
    globalAddProductHandler = onMainButtonClick
    
    // Set color based on app theme - using theme's primary blue color
    const isDark = theme === 'dark'
    const buttonColor = '#3b82f6' // Theme primary blue (consistent for both themes)
    const bottomBarColor = isDark ? '#1a1a2e' : '#ffffff' // Dark background for dark theme
    
    // Helper to post events to Telegram
    const postTelegramEvent = (eventType: string, eventData: any) => {
      try {
        if ((window as any).TelegramWebviewProxy?.postEvent) {
          (window as any).TelegramWebviewProxy.postEvent(eventType, JSON.stringify(eventData))
          console.log(`[Telegram] ${eventType}:`, eventData)
        } else if (window.parent !== window) {
          window.parent.postMessage(JSON.stringify({ eventType, eventData }), '*')
          console.log(`[Telegram] ${eventType} (postMessage):`, eventData)
        }
      } catch (e) {
        console.log(`[Telegram] ${eventType} failed:`, e)
      }
    }
    
    // Set bottom bar color to match app theme
    postTelegramEvent('web_app_set_bottom_bar_color', { color: bottomBarColor })
    
    // Use native postEvent for maximum compatibility with all parameters
    const setupMainButton = (params: {
      is_visible?: boolean
      is_active?: boolean
      is_progress_visible?: boolean
      text?: string
      color?: string
      text_color?: string
      has_shine_effect?: boolean
    }) => {
      postTelegramEvent('web_app_setup_main_button', params)
    }
    
    // Setup main button with all parameters including shine effect
    setupMainButton({
      is_visible: true,
      is_active: true,
      is_progress_visible: false,
      text: buttonText,
      color: buttonColor,
      text_color: '#ffffff',
      has_shine_effect: true
    })
    
    // Attach click handler using SDK
    WebApp.MainButton.onClick(onMainButtonClick)
    
    console.log('[MainButton] Setup complete with color:', buttonColor)
    
    return () => {
      if (globalAddProductHandler) {
        WebApp.MainButton.offClick(globalAddProductHandler)
        globalAddProductHandler = null
      }
      setupMainButton({ is_visible: false })
    }
  }, [status, handleAddProduct, theme])

  // Update loading state using native postEvent
  useEffect(() => {
    const isDark = theme === 'dark'
    const buttonColor = '#3b82f6' // Theme primary blue
    const buttonText = getButtonText()
    
    const updateMainButton = (params: {
      is_progress_visible?: boolean
      is_active?: boolean
      text?: string
      color?: string
      text_color?: string
    }) => {
      try {
        if ((window as any).TelegramWebviewProxy?.postEvent) {
          (window as any).TelegramWebviewProxy.postEvent('web_app_setup_main_button', JSON.stringify(params))
        } else if (window.parent !== window) {
          window.parent.postMessage(JSON.stringify({
            eventType: 'web_app_setup_main_button',
            eventData: params
          }), '*')
        }
      } catch (e) {
        console.log('[MainButton] update failed:', e)
      }
    }
    
    if (isSubmitting) {
      updateMainButton({
        is_progress_visible: true,
        is_active: false,
        text: buttonText,
        color: buttonColor,
        text_color: '#ffffff'
      })
    } else {
      updateMainButton({
        is_progress_visible: false,
        is_active: true,
        text: buttonText,
        color: buttonColor,
        text_color: '#ffffff'
      })
    }
  }, [isSubmitting, theme])

  // Loading overlay component
  const LoadingOverlay = () => {
    if (status === 'idle' || status === 'error') return null
    
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-6">
          <SpinnerGap className="w-12 h-12 text-primary animate-spin" weight="bold" />
          <div className="text-center">
            <p className="text-lg font-semibold">
              {status === 'adding' && 'Adding to Watchlist...'}
              {status === 'fetching' && 'Fetching Product Details...'}
              {status === 'success' && 'Success!'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {status === 'adding' && 'Please wait while we add your product'}
              {status === 'fetching' && 'Getting price and product information'}
              {status === 'success' && 'Redirecting to product details'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <LoadingOverlay />
      
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
