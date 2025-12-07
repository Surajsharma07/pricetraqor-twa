import { useState, useEffect, useRef, useCallback } from "react"
import WebApp from "@twa-dev/sdk"
import { TrackedProduct, UserSettings, productToTrackedProduct, User } from "@/lib/types"
import { WatchlistScreen } from "@/components/WatchlistScreen"
import { ProfileScreen } from "@/components/ProfileScreen"
import { AddProductScreen } from "@/components/AddProductScreen"
import { ProductDetailScreen } from "@/components/ProductDetailScreen"
import { SettingsScreen } from "@/components/SettingsScreen"
import { NotificationCenter } from "@/components/NotificationCenter"
import { BottomNav } from "@/components/BottomNav"
import { LoginScreen } from "@/components/LoginScreen"
import { SignupScreen } from "@/components/SignupScreen"
import { AuthScreen } from "@/components/AuthScreen"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { authService } from "@/services/auth"
import { productService } from "@/services/products"
import { useTelegramWebApp } from "@/hooks/useTelegramWebApp"
import { useNotifications } from "@/hooks/useNotifications"

type Screen = 'watchlist' | 'profile' | 'add-product' | 'product-detail' | 'settings' | 'notifications' | 'login' | 'signup' | 'auth'

type AuthState = 'unauthenticated' | 'authenticating' | 'authenticated' | 'loading'

function App() {
  const twa = useTelegramWebApp()
  const { stats: notificationStats, startPolling, stopPolling } = useNotifications()
  const [activeScreen, setActiveScreen] = useState<Screen>('watchlist')
  const [authState, setAuthState] = useState<AuthState>('authenticating')
  const [products, setProducts] = useState<TrackedProduct[]>([])
  const [user, setUser] = useState<User | null>(null)
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
  
  // Use ref to prevent multiple initialization attempts
  const initializingRef = useRef(false)

  // Notification polling disabled - endpoint not implemented yet
  // useEffect(() => {
  //   if (user && settings.notificationsEnabled) {
  //     startPolling(30000) // Poll every 30 seconds
  //     return () => {
  //       stopPolling()
  //     }
  //   }
  // }, [user, settings.notificationsEnabled, startPolling, stopPolling])

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
    // Prevent multiple initialization attempts
    if (initializingRef.current) {
      return
    }
    initializingRef.current = true

    const initApp = async () => {
      try {
        console.log('Telegram WebApp initialized:', {
          initData: WebApp.initData ? 'present' : 'missing',
          user: WebApp.initDataUnsafe?.user
        })

        // Check if user has valid session in localStorage
        if (authService.hasValidSession()) {
          console.log('Valid session found, loading profile...')
          setAuthState('loading')
          try {
            const userData = await authService.getCurrentUser()
            setUser(userData)
            await loadProducts()
            setAuthState('authenticated')
            setActiveScreen('watchlist')
          } catch (error) {
            console.error('Failed to load profile, clearing session:', error)
            authService.logout()
            setAuthState('unauthenticated')
            setActiveScreen('auth')
          }
        } else if (WebApp.initData) {
          // No session but Telegram initData available - show auth screen for new users
          console.log('No session but Telegram initData available, showing auth screen...')
          setAuthState('unauthenticated')
          setActiveScreen('auth')
        } else {
          // No session and no Telegram initData - show auth screen
          console.log('No authentication available, showing auth screen')
          setAuthState('unauthenticated')
          setActiveScreen('auth')
        }
      } catch (error) {
        console.error('App initialization failed:', error)
        toast.error('Failed to initialize app')
        setAuthState('unauthenticated')
      }
    }

    initApp()
  }, [])

  // Authenticate with Telegram WebApp
  const authenticateWithTelegram = async () => {
    try {
      const initData = WebApp.initData
      
      if (!initData) {
        console.warn('No Telegram initData available')
        setAuthState('unauthenticated')
        setActiveScreen('login')
        return
      }

      console.log('Authenticating with Telegram initData...')
      const authResponse = await authService.authenticateWithTelegram(initData)
      setUser(authResponse.user)
      await loadProducts()
      setAuthState('authenticated')
      setActiveScreen('watchlist')
      toast.success(`Welcome ${authResponse.user.full_name}!`)
    } catch (error: any) {
      console.error('Telegram authentication failed:', error)
      // Only show error if it's not already authenticated
      if (authState !== 'authenticated') {
        toast.error(error.message || 'Authentication failed')
        setAuthState('unauthenticated')
        setActiveScreen('login')
      }
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

  // Track if product addition is in progress to prevent duplicates
  const isAddingProductRef = useRef(false)
  const lastAddAttemptRef = useRef(0)
  const DEBOUNCE_MS = 2000 // 2 second debounce

  // State to track add product loading status for UI feedback
  const [addProductStatus, setAddProductStatus] = useState<'idle' | 'adding' | 'fetching' | 'success' | 'error'>('idle')

  const handleAddProduct = async (url: string, targetPrice?: number, alertType?: string, alertPercentage?: number) => {
    console.log('[handleAddProduct] START - URL:', url)
    
    // Prevent multiple submissions
    if (isAddingProductRef.current) {
      console.log('[handleAddProduct] Already in progress')
      return
    }
    
    // Debounce
    const now = Date.now()
    if (now - lastAddAttemptRef.current < DEBOUNCE_MS) {
      console.log('[handleAddProduct] Debouncing')
      return
    }
    lastAddAttemptRef.current = now
    isAddingProductRef.current = true
    setAddProductStatus('adding')
    
    // Validate URL
    if (!url || typeof url !== 'string') {
      console.log('[handleAddProduct] Invalid URL')
      toast.error('Invalid product URL')
      setAddProductStatus('error')
      isAddingProductRef.current = false
      return
    }

    // Detect marketplace
    const lowerUrl = url.toLowerCase()
    const marketplace = lowerUrl.includes('flipkart.com') ? 'flipkart' :
                       lowerUrl.includes('reliance') || lowerUrl.includes('jiomart') ? 'reliance' :
                       lowerUrl.includes('croma.com') ? 'croma' : 'amazon'

    const payload: any = { url, marketplace }
    
    if (alertType && alertType !== 'none') {
      payload.alert_type = alertType
      if (alertType === 'percentage_drop' && alertPercentage) {
        payload.alert_threshold_percentage = alertPercentage
      }
      if (alertType === 'price_below' && targetPrice) {
        payload.alert_threshold_price = targetPrice
      }
    }
    
    console.log('[handleAddProduct] Calling API with:', payload)
    
    try {
      const newProduct = await productService.addProduct(payload)
      console.log('[handleAddProduct] API returned:', JSON.stringify(newProduct))
      
      // Validate the response has required fields
      if (!newProduct || typeof newProduct !== 'object') {
        console.log('[handleAddProduct] Invalid response - not an object')
        throw new Error('Invalid response from server')
      }
      
      if (!newProduct._id) {
        console.log('[handleAddProduct] Invalid response - no _id')
        throw new Error('Invalid response from server - missing product ID')
      }
      
      console.log('[handleAddProduct] Product validated, _id:', newProduct._id)
      
      // Product added successfully!
      setAddProductStatus('success')
      try {
        twa.haptic.notification('success')
      } catch (hapticErr) {
        console.log('[handleAddProduct] Haptic failed (non-critical):', hapticErr)
      }
      toast.success('Product added!')
      
      // Add to list and navigate - wrap in try-catch
      try {
        console.log('[handleAddProduct] Converting to TrackedProduct...')
        const trackedProduct = productToTrackedProduct(newProduct)
        console.log('[handleAddProduct] TrackedProduct:', trackedProduct.id)
        setProducts(prev => [...prev, trackedProduct])
        setSelectedProduct(trackedProduct)
        setActiveScreen('product-detail')
      } catch (convErr: any) {
        console.log('[handleAddProduct] Error converting product:', convErr)
        // Still navigate to watchlist even if conversion fails
        setActiveScreen('watchlist')
      }
      
    } catch (error: any) {
      const errorMsg = error?.message || ''
      console.log('[handleAddProduct] CATCH - Error:', errorMsg)
      
      // Check if "already tracking" - this is success, not failure!
      if (errorMsg.toLowerCase().includes('already tracking')) {
        console.log('[handleAddProduct] Product already exists - treating as success')
        
        // Reload products and find it
        try {
          const allProducts = await productService.getProducts()
          setProducts(allProducts.map(p => productToTrackedProduct(p)))
          
          const existing = allProducts.find(p => 
            p.url.toLowerCase().includes(url.toLowerCase().split('?')[0]) ||
            url.toLowerCase().includes(p.url.toLowerCase().split('?')[0])
          )
          
          setAddProductStatus('success')
          twa.haptic.notification('success')
          toast.success('Product is in your watchlist!')
          
          if (existing) {
            setSelectedProduct(productToTrackedProduct(existing))
            setActiveScreen('product-detail')
          } else {
            setActiveScreen('watchlist')
          }
        } catch (e) {
          console.log('[handleAddProduct] Error loading products:', e)
          setActiveScreen('watchlist')
        }
      } else {
        // Real error
        console.log('[handleAddProduct] Real error - showing toast')
        setAddProductStatus('error')
        twa.haptic.notification('error')
        toast.error(errorMsg || 'Failed to add product')
      }
    } finally {
      isAddingProductRef.current = false
      setTimeout(() => setAddProductStatus('idle'), 1000)
    }
  }

  const handleProductClick = async (product: TrackedProduct) => {
    try {
      twa.haptic.selection()
      setIsLoadingProductDetail(true)
      // Don't change screen yet - wait until product is loaded to avoid hook order issues
      
      // Load full product details with price history
      const priceHistory = await productService.getPriceHistory(product.id)
      const fullProduct = await productService.getProduct(product.id)
      const trackedProduct = productToTrackedProduct(fullProduct, priceHistory)
      
      // Set product first, then change screen - this ensures component renders with product data
      setSelectedProduct(trackedProduct)
      setActiveScreen('product-detail')
    } catch (error: any) {
      console.error('Failed to load product details:', error)
      twa.haptic.notification('error')
      toast.error(error.message || 'Failed to load product details')
      setActiveScreen('watchlist')
      setSelectedProduct(null)
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

  const handleUpdateTargetPrice = useCallback(async (id: string, price?: number) => {
    try {
      twa.haptic.impact('light')
      await productService.updateDesiredPrice(id, price)
      
      // Update local state using functional updates to avoid stale closure issues
      setProducts(prevProducts =>
        prevProducts.map(p =>
          p.id === id ? { ...p, targetPrice: price } : p
        )
      )
      
      setSelectedProduct(prev => prev?.id === id ? { ...prev, targetPrice: price } : prev)
      
      twa.haptic.notification('success')
      toast.success(price ? 'Target price updated' : 'Target price removed')
    } catch (error: any) {
      console.error('Failed to update target price:', error)
      twa.haptic.notification('error')
      toast.error(error.message || 'Failed to update target price')
    }
  }, [twa])

  const handleUpdateAlert = useCallback(async (
    id: string,
    alertType?: string,
    targetPrice?: number,
    percentage?: number
  ) => {
    try {
      twa.haptic.impact('light')
      await productService.updateAlert(id, alertType, targetPrice, percentage)
      
      // Update local state using functional updates to avoid stale closure issues
      setProducts(prevProducts => prevProducts.map(p => 
        p.id === id ? { 
          ...p, 
          targetPrice: alertType === 'price_below' ? targetPrice : undefined 
        } : p
      ))
      
      // Update selected product if it's the one being edited
      setSelectedProduct(prev => prev && prev.id === id ? { 
        ...prev, 
        targetPrice: alertType === 'price_below' ? targetPrice : undefined 
      } : prev)
      
      twa.haptic.notification('success')
      toast.success('Alert settings updated')
    } catch (error: any) {
      console.error('Failed to update alert:', error)
      twa.haptic.notification('error')
      toast.error(error.message || 'Failed to update alert')
    }
  }, [twa])

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

  const handleNotificationClick = async (productId: string) => {
    const product = products.find(p => p.id === productId)
    if (product) {
      try {
        setIsLoadingProductDetail(true)
        setSelectedProduct(null)
        setActiveScreen('product-detail')
        
        // Load full product details with price history
        const priceHistory = await productService.getPriceHistory(product.id)
        const fullProduct = await productService.getProduct(product.id)
        const trackedProduct = productToTrackedProduct(fullProduct, priceHistory)
        
        setSelectedProduct(trackedProduct)
      } catch (error: any) {
        console.error('Failed to load product details:', error)
        toast.error(error.message || 'Failed to load product details')
        setActiveScreen('watchlist')
        setSelectedProduct(null)
      } finally {
        setIsLoadingProductDetail(false)
      }
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

  const renderScreen = () => {
    // Show loading screen during auth state transitions
    if (authState === 'authenticating' || authState === 'loading') {
      return (
        <div className="min-h-twa-viewport flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Initializing app...</p>
          </div>
        </div>
      )
    }

    // Show login/signup for unauthenticated users
    if (authState === 'unauthenticated') {
      // Show auth screen for new users (with all options)
      if (activeScreen === 'auth') {
        return (
          <AuthScreen
            onSignupSuccess={() => {
              setAuthState('authenticated')
              setActiveScreen('watchlist')
              // Reload user and products
              authService.getCurrentUser().then(userData => {
                setUser(userData)
                loadProducts()
              })
            }}
            onLoginSuccess={() => {
              setAuthState('authenticated')
              setActiveScreen('watchlist')
              // Reload user and products
              authService.getCurrentUser().then(userData => {
                setUser(userData)
                loadProducts()
              })
            }}
          />
        )
      }

      if (activeScreen === 'signup') {
        return (
          <SignupScreen
            onSignupSuccess={() => {
              setAuthState('authenticated')
              setActiveScreen('watchlist')
              // Reload user and products
              authService.getCurrentUser().then(userData => {
                setUser(userData)
                loadProducts()
              })
            }}
            onSwitchToLogin={() => setActiveScreen('login')}
          />
        )
      }
      
      return (
        <LoginScreen
          onLoginSuccess={() => {
            setAuthState('authenticated')
            setActiveScreen('watchlist')
            // Reload user and products
            authService.getCurrentUser().then(userData => {
              setUser(userData)
              loadProducts()
            })
          }}
          onSwitchToSignup={() => setActiveScreen('signup')}
        />
      )
    }

    // Show app screens for authenticated users
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
            onLogout={() => {
              // Clear all user data and show auth screen
              authService.logout()
              // Disable auto-auth on next mount so user can choose to login
              sessionStorage.setItem('autoAuthDisabled', 'true')
              setUser(null)
              setProducts([])
              setAuthState('unauthenticated')
              setActiveScreen('auth')
              toast.info('Logged out successfully')
            }}
          />
        )
      
      case 'add-product':
        return (
          <AddProductScreen
            onBack={() => setActiveScreen('watchlist')}
            onAdd={handleAddProduct}
            prefillUrl={prefillUrl}
            status={addProductStatus}
            theme={settings.theme}
          />
        )
      
      case 'product-detail':
        // CRITICAL: Only render ProductDetailScreen when we have a product
        // This prevents React error #310 by ensuring component always renders with consistent data
        // Never pass null product - always show loading state instead
        if (!selectedProduct) {
          // Show loading skeleton while product is being loaded
          return (
            <div className="min-h-twa-viewport flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-muted-foreground">Loading product details...</p>
              </div>
            </div>
          )
        }
        // selectedProduct is guaranteed to be non-null here
        // Use product ID as key to ensure React treats it as same component type when switching products
        return (
          <ProductDetailScreen
            key={selectedProduct.id}
            product={selectedProduct}
            onBack={() => setActiveScreen('watchlist')}
            onToggleActive={handleToggleActive}
            onDelete={handleDeleteProduct}
            onUpdateTargetPrice={handleUpdateTargetPrice}
            onUpdateAlert={handleUpdateAlert}
            isLoading={false}
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
      
      default:
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
    }
  }

  return (
    <div className="min-h-twa-viewport bg-background text-foreground pb-20">
      <div className="mx-auto max-w-[430px] px-4 pt-6">
        {renderScreen()}
      </div>
      
      {authState === 'authenticated' && (activeScreen === 'watchlist' || activeScreen === 'profile' || activeScreen === 'settings' || activeScreen === 'notifications') && (
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
