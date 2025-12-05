import { useState, useEffect, useRef } from "react"
import WebApp from "@twa-dev/sdk"
import { TrackedProduct, UserSettings, productToTrackedProduct, User } from "@/lib/types"
import { WatchlistScreen } from "@/components/WatchlistScreen"
import { ProfileScreen } from "@/components/ProfileScreen"
import { AddProductScreen } from "@/components/AddProductScreen"
import { ProductDetailScreen } from "@/components/ProductDetailScreen"
import { SettingsScreen } from "@/components/SettingsScreen"
import { NotificationCenter } from "@/components/NotificationCenter"
import { BottomNav } from "@/components/BottomNav"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { authService } from "@/services/auth"
import { productService } from "@/services/products"
import { useTelegramWebApp } from "@/hooks/useTelegramWebApp"
import { useNotifications } from "@/hooks/useNotifications"

type Screen = 'watchlist' | 'profile' | 'add-product' | 'product-detail' | 'settings' | 'notifications'

function App() {
  const twa = useTelegramWebApp()
  const { stats: notificationStats, startPolling, stopPolling } = useNotifications()
  const [activeScreen, setActiveScreen] = useState<Screen>('watchlist')
  const [products, setProducts] = useState<TrackedProduct[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [settings, setSettings] = useState<UserSettings>({
    notificationsEnabled: true,
    alertType: 'drops',
    defaultTargetPercent: 10,
    theme: 'dark',
  })
  const [selectedProduct, setSelectedProduct] = useState<TrackedProduct | null>(null)
  const [isLoadingProductDetail, setIsLoadingProductDetail] = useState(false)
  const [prefillUrl, setPrefillUrl] = useState<string>()

  // Start notification polling when user is authenticated
  useEffect(() => {
    if (user && settings.notificationsEnabled) {
      startPolling(30000) // Poll every 30 seconds
      return () => {
        stopPolling()
      }
    }
  }, [user, settings.notificationsEnabled, startPolling, stopPolling])

  // Load settings from CloudStorage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await twa.cloudStorage.getItem('user_settings')
        if (storedSettings) {
          const parsed = JSON.parse(storedSettings)
          setSettings(parsed)
        }
      } catch (error) {
        console.error('Failed to load settings from CloudStorage:', error)
      }
    }
    loadSettings()
  }, [twa])

  // Initialize Telegram WebApp and authenticate
  useEffect(() => {
    const initApp = async () => {
      try {
        console.log('Telegram WebApp initialized:', {
          initData: WebApp.initData ? 'present' : 'missing',
          user: WebApp.initDataUnsafe?.user
        })

        // Check if already authenticated
        if (authService.isAuthenticated()) {
          console.log('User already authenticated, loading profile...')
          try {
            const userData = await authService.getCurrentUser()
            setUser(userData)
            await loadProducts()
          } catch (error) {
            console.error('Failed to get user, re-authenticating:', error)
            await authenticateWithTelegram()
          }
        } else {
          // Not authenticated, authenticate with Telegram
          await authenticateWithTelegram()
        }
      } catch (error) {
        console.error('App initialization failed:', error)
        toast.error('Failed to initialize app')
      } finally {
        setIsLoading(false)
      }
    }

    initApp()
  }, [])

  // Authenticate with Telegram WebApp
  const authenticateWithTelegram = async () => {
    try {
      const initData = WebApp.initData
      
      if (!initData) {
        console.warn('No Telegram initData available - running in development mode')
        // For development/testing without Telegram
        toast.info('Development mode - authentication skipped')
        setIsLoading(false)
        return
      }

      console.log('Authenticating with Telegram initData...')
      const authResponse = await authService.authenticateWithTelegram(initData)
      setUser(authResponse.user)
      await loadProducts()
      toast.success(`Welcome ${authResponse.user.full_name}!`)
    } catch (error: any) {
      console.error('Telegram authentication failed:', error)
      toast.error(error.message || 'Authentication failed')
    }
  }

  // Load products from backend
  const loadProducts = async () => {
    try {
      setIsLoadingProducts(true)
      const backendProducts = await productService.getProducts()
      
      // Load price history for each product to get current price
      const trackedProducts = await Promise.all(
        backendProducts.map(async (p) => {
          try {
            const priceHistory = await productService.getPriceHistory(p._id)
            return productToTrackedProduct(p, priceHistory)
          } catch (err) {
            console.error(`Failed to load history for product ${p._id}:`, err)
            return productToTrackedProduct(p)
          }
        })
      )
      setProducts(trackedProducts)
    } catch (error: any) {
      console.error('Failed to load products:', error)
      toast.error(error.message || 'Failed to load products')
    } finally {
      setIsLoadingProducts(false)
    }
  }

  // Theme effect - integrate with Telegram theme
  useEffect(() => {
    const updateTheme = (withAnimation = false) => {
      if (withAnimation) {
        document.body.classList.add('theme-transitioning')
        setTimeout(() => {
          document.body.classList.remove('theme-transitioning')
        }, 800)
      }
      
      // Use Telegram's color scheme if available
      const telegramColorScheme = twa.theme.colorScheme
      const finalTheme = settings?.theme || (telegramColorScheme === 'light' ? 'light' : 'dark')
      
      if (finalTheme === 'light') {
        document.documentElement.classList.add('light-theme')
      } else {
        document.documentElement.classList.remove('light-theme')
      }

      // Set Telegram header and background colors to match theme
      const bgColor = finalTheme === 'light' ? '#f5f5f5' : '#0a0a0b'
      twa.theme.setBackgroundColor(bgColor)
      twa.theme.setHeaderColor(bgColor)
    }
    
    const hasThemeChanged = document.documentElement.classList.contains('light-theme') !== (settings?.theme === 'light')
    updateTheme(hasThemeChanged)
  }, [settings?.theme, twa])

  // Handle URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const productUrl = urlParams.get('url')
    const productId = urlParams.get('productId')
    
    if (productUrl) {
      setPrefillUrl(productUrl)
      setActiveScreen('add-product')
    } else if (productId && products) {
      const product = products.find(p => p.id === productId)
      if (product) {
        setSelectedProduct(product)
        setActiveScreen('product-detail')
      }
    }
  }, [products])

  const handleAddProduct = async (url: string, targetPrice?: number, alertType?: string, alertPercentage?: number) => {
    try {
      // Safety check for undefined url
      if (!url || typeof url !== 'string') {
        twa.haptic.notification('error')
        toast.error('Invalid product URL')
        return
      }

      const existingProduct = products.find(p => p.productUrl === url)
      if (existingProduct) {
        twa.haptic.notification('warning')
        toast.error('This product is already in your watchlist')
        return
      }

      // Detect marketplace from URL
      const lowerUrl = url.toLowerCase()
      const marketplace = lowerUrl.includes('flipkart.com') ? 'flipkart' :
                         lowerUrl.includes('reliance') || lowerUrl.includes('jiomart') ? 'reliance' :
                         lowerUrl.includes('croma.com') ? 'croma' : 'amazon'

      // Add product via API with correct field names
      twa.haptic.impact('light')
      
      // Build payload - only include alert fields if alert type is specified
      const payload: any = {
        url,
        marketplace,
      }
      
      if (alertType && alertType !== 'none') {
        payload.alert_type = alertType
        if (alertType === 'percentage_drop' && alertPercentage) {
          payload.alert_threshold_percentage = alertPercentage
        }
        if (alertType === 'price_below' && targetPrice) {
          payload.alert_threshold_price = targetPrice
        }
      }
      
      const newProduct = await productService.addProduct(payload)

      // Debug: log the response
      console.log('Product added successfully:', newProduct)

      // Convert to tracked product and add to list
      const trackedProduct = productToTrackedProduct(newProduct)
      console.log('Converted to tracked product:', trackedProduct)
      
      setProducts([...products, trackedProduct])
      setActiveScreen('watchlist')
      twa.haptic.notification('success')
      toast.success('Product added! Fetching details...')

      // Poll for product data to be hydrated by worker
      // The backend enqueues a snapshot job, which usually completes within 5-15 seconds
      let pollAttempts = 0
      const maxPollAttempts = 6 // Poll for up to 30 seconds (6 * 5 seconds)
      
      const pollForProductData = async () => {
        try {
          pollAttempts++
          const updatedProduct = await productService.getProduct(newProduct._id)
          
          // Check if product has been hydrated (has title and price)
          if (updatedProduct.title && updatedProduct.last_snapshot_price) {
            // Product has been hydrated, update the list
            const updatedTrackedProduct = productToTrackedProduct(updatedProduct)
            setProducts(prevProducts => 
              prevProducts.map(p => p.id === updatedProduct._id ? updatedTrackedProduct : p)
            )
            console.log('Product hydrated successfully:', updatedProduct)
          } else if (pollAttempts < maxPollAttempts) {
            // Not hydrated yet, poll again in 5 seconds
            setTimeout(pollForProductData, 5000)
          } else {
            // Max attempts reached, product might take longer to hydrate
            console.log('Product hydration taking longer than expected')
          }
        } catch (error) {
          console.error('Failed to poll for product data:', error)
          // Don't retry on error, just log it
        }
      }
      
      // Start polling after 3 seconds (give worker time to start)
      setTimeout(pollForProductData, 3000)
    } catch (error: any) {
      console.error('Failed to add product:', error)
      console.error('Error details:', {
        message: error?.message,
        response: error?.response,
        data: error?.response?.data
      })
      twa.haptic.notification('error')
      
      // Check if this is actually a success but wrongly caught as error
      // This can happen if the response structure is unexpected
      if (error?.response?.status === 201 || error?.response?.status === 200) {
        // Product was actually added successfully
        console.log('Product was added despite error - reloading products')
        toast.success('Product added! Refreshing list...')
        
        // Reload products from backend
        try {
          const refreshedProducts = await productService.getProducts()
          const trackedProducts = refreshedProducts.map(p => productToTrackedProduct(p))
          setProducts(trackedProducts)
          setActiveScreen('watchlist')
        } catch (refreshError) {
          console.error('Failed to refresh products:', refreshError)
        }
        return
      }
      
      // Extract error message with multiple fallbacks
      let errorMessage = 'Failed to add product'
      
      if (error?.message && typeof error.message === 'string') {
        errorMessage = error.message
      } else if (error?.response?.data?.detail) {
        const detail = error.response.data.detail
        if (typeof detail === 'string') {
          errorMessage = detail
        } else if (detail?.message) {
          errorMessage = detail.message
        } else if (typeof detail === 'object') {
          errorMessage = JSON.stringify(detail)
        }
      } else if (typeof error === 'string') {
        errorMessage = error
      } else if (error?.toString && typeof error.toString === 'function') {
        const str = error.toString()
        if (str !== '[object Object]') {
          errorMessage = str
        }
      }
      
      toast.error(errorMessage)
    }
  }

  const handleProductClick = async (product: TrackedProduct) => {
    try {
      twa.haptic.selection()
      setIsLoadingProductDetail(true)
      
      // Set screen after loading state to avoid flash
      setTimeout(() => setActiveScreen('product-detail'), 0)
      
      // Load full product details with price history
      const priceHistory = await productService.getPriceHistory(product.id)
      const fullProduct = await productService.getProduct(product.id)
      const trackedProduct = productToTrackedProduct(fullProduct, priceHistory)
      
      setSelectedProduct(trackedProduct)
    } catch (error: any) {
      console.error('Failed to load product details:', error)
      twa.haptic.notification('error')
      toast.error(error.message || 'Failed to load product details')
      setActiveScreen('watchlist')
    } finally {
      setIsLoadingProductDetail(false)
    }
  }

  const handleToggleActive = async (id: string) => {
    try {
      const product = products.find(p => p.id === id)
      if (!product) return

      twa.haptic.impact('light')
      await productService.toggleActive(id, !product.isActive)
      
      // Update local state
      const newIsActive = !product.isActive
      setProducts(
        products.map(p =>
          p.id === id ? { ...p, isActive: newIsActive } : p
        )
      )
      
      // Update selected product if it's the one being toggled
      if (selectedProduct?.id === id) {
        setSelectedProduct({ ...selectedProduct, isActive: newIsActive })
      }
      
      twa.haptic.notification('success')
      toast.success(
        product.isActive 
          ? 'Tracking paused' 
          : 'Tracking resumed'
      )
    } catch (error: any) {
      console.error('Failed to toggle product:', error)
      twa.haptic.notification('error')
      toast.error(error.message || 'Failed to update product')
    }
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      // Use native Telegram confirmation dialog
      const confirmed = await twa.dialog.showConfirm('Are you sure you want to remove this product from your watchlist?')
      
      if (!confirmed) {
        return
      }

      twa.haptic.impact('medium')
      await productService.deleteProduct(id)
      
      setProducts(products.filter(p => p.id !== id))
      twa.haptic.notification('success')
      toast.success('Product removed from watchlist')
      
      if (activeScreen === 'product-detail') {
        setActiveScreen('watchlist')
      }
    } catch (error: any) {
      console.error('Failed to delete product:', error)
      twa.haptic.notification('error')
      toast.error(error.message || 'Failed to delete product')
    }
  }

  const handleUpdateTargetPrice = async (id: string, price?: number) => {
    try {
      twa.haptic.impact('light')
      await productService.updateDesiredPrice(id, price)
      
      // Update local state
      setProducts(
        products.map(p =>
          p.id === id ? { ...p, targetPrice: price } : p
        )
      )
      
      if (selectedProduct?.id === id) {
        setSelectedProduct({ ...selectedProduct, targetPrice: price })
      }
      
      twa.haptic.notification('success')
      toast.success(price ? 'Target price updated' : 'Target price removed')
    } catch (error: any) {
      console.error('Failed to update target price:', error)
      twa.haptic.notification('error')
      toast.error(error.message || 'Failed to update target price')
    }
  }

  const handleUpdateAlert = async (
    id: string,
    alertType?: string,
    targetPrice?: number,
    percentage?: number
  ) => {
    try {
      twa.haptic.impact('light')
      await productService.updateAlert(id, alertType, targetPrice, percentage)
      
      // Update local state
      setProducts(products.map(p => 
        p.id === id ? { 
          ...p, 
          targetPrice: alertType === 'price_below' ? targetPrice : undefined 
        } : p
      ))
      
      // Update selected product if it's the one being edited
      if (selectedProduct && selectedProduct.id === id) {
        setSelectedProduct({ 
          ...selectedProduct, 
          targetPrice: alertType === 'price_below' ? targetPrice : undefined 
        })
      }
      
      twa.haptic.notification('success')
      toast.success('Alert settings updated')
    } catch (error: any) {
      console.error('Failed to update alert:', error)
      twa.haptic.notification('error')
      toast.error(error.message || 'Failed to update alert')
    }
  }

  const handleUpdateSettings = async (newSettings: UserSettings) => {
    setSettings(newSettings)
    
    // Save to CloudStorage
    try {
      await twa.cloudStorage.setItem('user_settings', JSON.stringify(newSettings))
      twa.haptic.notification('success')
      toast.success('Settings saved')
    } catch (error) {
      console.error('Failed to save settings to CloudStorage:', error)
      twa.haptic.notification('error')
      toast.error('Settings saved locally only')
    }
  }

  const handleBottomNavClick = (screen: 'watchlist' | 'profile' | 'settings' | 'notifications') => {
    twa.haptic.selection()
    setActiveScreen(screen)
  }

  const handleNotificationClick = (productId: string) => {
    const product = products.find(p => p.id === productId)
    if (product) {
      setSelectedProduct(product)
      setActiveScreen('product-detail')
    } else {
      toast.error('Product not found')
    }
  }

  // Track the current back button handler to ensure proper cleanup
  const backButtonHandlerRef = useRef<(() => void) | null>(null)

  // Handle BackButton visibility based on current screen
  useEffect(() => {
    const shouldShowBack = activeScreen !== 'watchlist' && activeScreen !== 'profile' && activeScreen !== 'settings' && activeScreen !== 'notifications'
    
    // Clean up previous handler
    if (backButtonHandlerRef.current) {
      twa.backButton.hide()
      backButtonHandlerRef.current = null
    }
    
    if (shouldShowBack) {
      const handleBack = () => {
        twa.haptic.impact('light')
        if (activeScreen === 'add-product' || activeScreen === 'product-detail') {
          setActiveScreen('watchlist')
        }
      }
      
      backButtonHandlerRef.current = handleBack
      twa.backButton.show(handleBack)
    }

    return () => {
      twa.backButton.hide()
      backButtonHandlerRef.current = null
    }
  }, [activeScreen, twa])

  // Enable closing confirmation when user is on add-product screen
  useEffect(() => {
    if (activeScreen === 'add-product') {
      twa.enableClosingConfirmation()
    } else {
      twa.disableClosingConfirmation()
    }

    return () => {
      twa.disableClosingConfirmation()
    }
  }, [activeScreen, twa])

  // Handle viewport height to ensure proper display
  useEffect(() => {
    const setViewportHeight = () => {
      // Use stable viewport height for better consistency
      const height = twa.viewport.stableHeight || twa.viewport.height || window.innerHeight
      document.documentElement.style.setProperty('--twa-viewport-height', `${height}px`)
    }

    setViewportHeight()
    
    // Listen for viewport changes
    window.addEventListener('resize', setViewportHeight)
    
    return () => {
      window.removeEventListener('resize', setViewportHeight)
    }
  }, [twa])

  if (isLoading) {
    return (
      <div className="min-h-twa-viewport bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case 'watchlist':
        return (
          <WatchlistScreen
            products={products}
            onProductClick={handleProductClick}
            onAddProduct={() => setActiveScreen('add-product')}
            onToggleActive={handleToggleActive}
            onDelete={handleDeleteProduct}
            isLoading={isLoadingProducts}
          />
        )
      
      case 'profile':
        return (
          <ProfileScreen
            products={products}
          />
        )
      
      case 'add-product':
        return (
          <AddProductScreen
            onBack={() => setActiveScreen('watchlist')}
            onAdd={handleAddProduct}
            prefillUrl={prefillUrl}
          />
        )
      
      case 'product-detail':
        return (
          <ProductDetailScreen
            product={selectedProduct}
            onBack={() => setActiveScreen('watchlist')}
            onToggleActive={handleToggleActive}
            onDelete={handleDeleteProduct}
            onUpdateTargetPrice={handleUpdateTargetPrice}
            onUpdateAlert={handleUpdateAlert}
            isLoading={isLoadingProductDetail}
          />
        )
      
      case 'settings':
        return (
          <SettingsScreen
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />
        )
      
      case 'notifications':
        return (
          <NotificationCenter
            onNotificationClick={handleNotificationClick}
            onClose={() => setActiveScreen('watchlist')}
          />
        )
    }
  }

  return (
    <div className="min-h-twa-viewport bg-background text-foreground pb-20">
      <div className="mx-auto max-w-[430px] px-4 pt-6">
        {renderScreen()}
      </div>
      
      {(activeScreen === 'watchlist' || activeScreen === 'profile' || activeScreen === 'settings' || activeScreen === 'notifications') && (
        <BottomNav 
          active={activeScreen} 
          onNavigate={handleBottomNavClick}
          notificationCount={notificationStats.unread}
        />
      )}
      
      <Toaster />
    </div>
  )
}

export default App
