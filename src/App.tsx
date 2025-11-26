import { useState, useEffect } from "react"
import { useKV } from "@github/spark/hooks"
import { TrackedProduct, UserSettings } from "@/lib/types"
import { WatchlistScreen } from "@/components/WatchlistScreen"
import { ProfileScreen } from "@/components/ProfileScreen"
import { AddProductScreen } from "@/components/AddProductScreen"
import { ProductDetailScreen } from "@/components/ProductDetailScreen"
import { SettingsScreen } from "@/components/SettingsScreen"
import { BottomNav } from "@/components/BottomNav"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

type Screen = 'watchlist' | 'profile' | 'add-product' | 'product-detail' | 'settings'

function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('watchlist')
  const [products, setProducts] = useKV<TrackedProduct[]>("tracked-products", [])
  const [settings, setSettings] = useKV<UserSettings>("user-settings", {
    notificationsEnabled: true,
    alertType: 'drops',
    defaultTargetPercent: 10,
  })
  const [selectedProduct, setSelectedProduct] = useState<TrackedProduct | null>(null)
  const [prefillUrl, setPrefillUrl] = useState<string>()

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

  const handleAddProduct = (url: string, targetPrice?: number) => {
    if (!products) return
    
    const existingProduct = products.find(p => p.productUrl === url)
    if (existingProduct) {
      toast.error('This product is already in your watchlist')
      return
    }

    const mockPrice = Math.random() * 500 + 50
    const siteDomain = new URL(url).hostname.replace('www.', '')
    
    const newProduct: TrackedProduct = {
      id: Date.now().toString(),
      productUrl: url,
      siteDomain,
      title: `Product from ${siteDomain}`,
      imageUrl: `https://picsum.photos/seed/${Date.now()}/400/400`,
      currentPrice: mockPrice,
      currency: 'USD',
      targetPrice,
      isActive: true,
      lastCheckedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      priceHistory: [
        {
          price: mockPrice,
          currency: 'USD',
          checkedAt: new Date().toISOString(),
        }
      ],
      inStock: true,
    }

    setProducts([...products, newProduct])
    setActiveScreen('watchlist')
  }

  const handleProductClick = (product: TrackedProduct) => {
    setSelectedProduct(product)
    setActiveScreen('product-detail')
  }

  const handleToggleActive = (id: string) => {
    if (!products) return
    
    setProducts(
      products.map(p =>
        p.id === id ? { ...p, isActive: !p.isActive } : p
      )
    )
    const product = products.find(p => p.id === id)
    toast.success(
      product?.isActive 
        ? 'Tracking paused' 
        : 'Tracking resumed'
    )
  }

  const handleDeleteProduct = (id: string) => {
    if (!products) return
    
    setProducts(products.filter(p => p.id !== id))
    toast.success('Product removed from watchlist')
    if (activeScreen === 'product-detail') {
      setActiveScreen('watchlist')
    }
  }

  const handleUpdateTargetPrice = (id: string, price?: number) => {
    if (!products) return
    
    setProducts(
      products.map(p =>
        p.id === id ? { ...p, targetPrice: price } : p
      )
    )
    if (selectedProduct?.id === id) {
      setSelectedProduct(prev => prev ? { ...prev, targetPrice: price } : null)
    }
  }

  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings)
    toast.success('Settings saved')
  }

  const handleBottomNavClick = (screen: 'watchlist' | 'profile' | 'settings') => {
    setActiveScreen(screen)
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case 'watchlist':
        return (
          <WatchlistScreen
            products={products || []}
            onProductClick={handleProductClick}
            onAddProduct={() => setActiveScreen('add-product')}
            onToggleActive={handleToggleActive}
            onDelete={handleDeleteProduct}
          />
        )
      
      case 'profile':
        return (
          <ProfileScreen
            products={products || []}
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
            settings={settings || { notificationsEnabled: true, alertType: 'drops' }}
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
