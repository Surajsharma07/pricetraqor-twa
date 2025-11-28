import { useState, useEffect } from "react"
import WebApp from "@twa-dev/sdk"
import { TrackedProduct, UserSettings, productToTrackedProduct, User } from "@/lib/types"
import { WatchlistScreen } from "@/components/WatchlistScreen"
import { ProfileScreen } from "@/components/ProfileScreen"
import { AddProductScreen } from "@/components/AddProductScreen"
import { ProductDetailScreen } from "@/components/ProductDetailScreen"
import { SettingsScreen } from "@/components/SettingsScreen"
import { BottomNav } from "@/components/BottomNav"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { authService } from "@/services/auth"
import { productService } from "@/services/products"

type Screen = 'watchlist' | 'profile' | 'add-product' | 'product-detail' | 'settings'

function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('watchlist')
  const [products, setProducts] = useState<TrackedProduct[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState<UserSettings>({
    notificationsEnabled: true,
    alertType: 'drops',
    defaultTargetPercent: 10,
    theme: 'dark',
  })
  const [selectedProduct, setSelectedProduct] = useState<TrackedProduct | null>(null)
  const [prefillUrl, setPrefillUrl] = useState<string>()

  // Initialize Telegram WebApp and authenticate
  useEffect(() => {
    const initApp = async () => {
      try {
        // Initialize Telegram WebApp SDK
        WebApp.ready()
        WebApp.expand()
        
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
    }
  }

  // Theme effect
  useEffect(() => {
    const updateTheme = (withAnimation = false) => {
      if (withAnimation) {
        document.body.classList.add('theme-transitioning')
        setTimeout(() => {
          document.body.classList.remove('theme-transitioning')
        }, 800)
      }
      
      if (settings?.theme === 'light') {
        document.documentElement.classList.add('light-theme')
      } else {
        document.documentElement.classList.remove('light-theme')
      }
    }
    
    const hasThemeChanged = document.documentElement.classList.contains('light-theme') !== (settings?.theme === 'light')
    updateTheme(hasThemeChanged)
  }, [settings?.theme])

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

  const handleAddProduct = async (url: string, targetPrice?: number) => {
    try {
      const existingProduct = products.find(p => p.productUrl === url)
      if (existingProduct) {
        toast.error('This product is already in your watchlist')
        return
      }

      // Add product via API
      const newProduct = await productService.addProduct({
        url,
        desired_price: targetPrice,
      })

      // Convert to tracked product and add to list
      const trackedProduct = productToTrackedProduct(newProduct)
      setProducts([...products, trackedProduct])
      setActiveScreen('watchlist')
      toast.success('Product added to watchlist')
    } catch (error: any) {
      console.error('Failed to add product:', error)
      toast.error(error.message || 'Failed to add product')
    }
  }

  const handleProductClick = async (product: TrackedProduct) => {
    try {
      // Load full product details with price history
      const priceHistory = await productService.getPriceHistory(product.id)
      const fullProduct = await productService.getProduct(product.id)
      const trackedProduct = productToTrackedProduct(fullProduct, priceHistory)
      
      setSelectedProduct(trackedProduct)
      setActiveScreen('product-detail')
    } catch (error: any) {
      console.error('Failed to load product details:', error)
      toast.error(error.message || 'Failed to load product details')
    }
  }

  const handleToggleActive = async (id: string) => {
    try {
      const product = products.find(p => p.id === id)
      if (!product) return

      const updatedProduct = await productService.toggleActive(id, !product.isActive)
      
      // Update local state
      setProducts(
        products.map(p =>
          p.id === id ? { ...p, isActive: !p.isActive } : p
        )
      )
      
      // Update selected product if it's the one being toggled
      if (selectedProduct?.id === id) {
        const trackedProduct = productToTrackedProduct(updatedProduct)
        setSelectedProduct(trackedProduct)
      }
      
      toast.success(
        product.isActive 
          ? 'Tracking paused' 
          : 'Tracking resumed'
      )
    } catch (error: any) {
      console.error('Failed to toggle product:', error)
      toast.error(error.message || 'Failed to update product')
    }
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      await productService.deleteProduct(id)
      
      setProducts(products.filter(p => p.id !== id))
      toast.success('Product removed from watchlist')
      
      if (activeScreen === 'product-detail') {
        setActiveScreen('watchlist')
      }
    } catch (error: any) {
      console.error('Failed to delete product:', error)
      toast.error(error.message || 'Failed to delete product')
    }
  }

  const handleUpdateTargetPrice = async (id: string, price?: number) => {
    try {
      const updatedProduct = await productService.updateDesiredPrice(id, price)
      
      // Update local state
      setProducts(
        products.map(p =>
          p.id === id ? { ...p, targetPrice: price } : p
        )
      )
      
      if (selectedProduct?.id === id) {
        const trackedProduct = productToTrackedProduct(updatedProduct)
        setSelectedProduct(trackedProduct)
      }
      
      toast.success('Target price updated')
    } catch (error: any) {
      console.error('Failed to update target price:', error)
      toast.error(error.message || 'Failed to update target price')
    }
  }

  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings)
    // Could also save to backend/user preferences here
    toast.success('Settings saved')
  }

  const handleBottomNavClick = (screen: 'watchlist' | 'profile' | 'settings') => {
    setActiveScreen(screen)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
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
        return selectedProduct ? (
          <ProductDetailScreen
            product={selectedProduct}
            onBack={() => setActiveScreen('watchlist')}
            onToggleActive={handleToggleActive}
            onDelete={handleDeleteProduct}
            onUpdateTargetPrice={handleUpdateTargetPrice}
          />
        ) : null
      
      case 'settings':
        return (
          <SettingsScreen
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="mx-auto max-w-[430px] px-4 pt-6">
        {renderScreen()}
      </div>
      
      {(activeScreen === 'watchlist' || activeScreen === 'profile' || activeScreen === 'settings') && (
        <BottomNav 
          active={activeScreen} 
          onNavigate={handleBottomNavClick} 
        />
      )}
      
      <Toaster />
    </div>
  )
}

export default App
