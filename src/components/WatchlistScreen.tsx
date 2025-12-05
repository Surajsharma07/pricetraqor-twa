import { useState } from 'react'
import { TrackedProduct, FilterType } from '@/lib/types'
import { ProductCard } from '@/components/ProductCard'
import { ProductCardSkeleton } from '@/components/ProductCardSkeleton'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Package } from '@phosphor-icons/react'
import { filterProducts } from '@/lib/helpers'
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp'

interface WatchlistScreenProps {
  products: TrackedProduct[]
  onProductClick: (product: TrackedProduct) => void
  onAddProduct: () => void
  onToggleActive: (id: string) => void
  onDelete: (id: string) => void
  isLoading?: boolean
}

export function WatchlistScreen({ 
  products, 
  onProductClick, 
  onAddProduct,
  onToggleActive,
  onDelete,
  isLoading = false
}: WatchlistScreenProps) {
  const twa = useTelegramWebApp()
  const [filter, setFilter] = useState<FilterType>('all')

  const filteredProducts = filterProducts(products, filter)

  const handleDeleteClick = (id: string) => {
    twa.haptic.impact('light')
    // Pass to parent which handles the native dialog
    onDelete(id)
  }

  const handleFilterChange = (value: FilterType) => {
    twa.haptic.selection()
    setFilter(value)
  }

  const handleAddProductClick = () => {
    twa.haptic.impact('medium')
    onAddProduct()
  }

  const getFilterCounts = () => {
    return {
      all: products.length,
      dropped: products.filter(p => p.priceChange && p.priceChange < 0).length,
      increased: products.filter(p => p.priceChange && p.priceChange > 0).length,
      'out-of-stock': products.filter(p => !p.inStock).length,
    }
  }

  const counts = getFilterCounts()

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text drop-shadow-[0_3px_8px_rgba(0,0,0,0.7)]">Watchlist</h1>
            <p className="text-sm text-muted-foreground mt-1 drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]">
              {products.length} {products.length === 1 ? 'product' : 'products'} tracked
            </p>
          </div>
          <Button 
            onClick={handleAddProductClick} 
            size="icon" 
            className="rounded-full h-16 w-16 neumorphic-button hover:glow-primary active:scale-95 transition-all duration-200 relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, oklch(0.55 0.18 250), oklch(0.45 0.18 250))',
              boxShadow: `
                8px 8px 16px oklch(0.06 0.01 250 / 0.6),
                -4px -4px 12px oklch(0.22 0.04 250 / 0.4),
                inset 0 1px 0 oklch(0.95 0 0 / 0.15),
                0 0 30px oklch(0.50 0.18 250 / 0.3)
              `
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/25 via-transparent to-transparent opacity-70 pointer-events-none"></div>
            <Plus className="w-8 h-8 relative z-10 drop-shadow-[0_3px_6px_rgba(0,0,0,0.5)]" weight="bold" />
          </Button>
        </div>

        {products.length > 0 && (
          <Tabs value={filter} onValueChange={(v) => handleFilterChange(v as FilterType)}>
            <TabsList 
              className="grid w-full grid-cols-4 p-1 neumorphic-inset relative overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, oklch(0.12 0.02 250), oklch(0.16 0.03 250))',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-50 pointer-events-none"></div>
              <TabsTrigger 
                value="all" 
                className="text-xs data-[state=active]:neumorphic-raised data-[state=active]:glow-accent relative z-10 transition-all duration-200"
                style={{
                  ['--tw-shadow' as string]: 'data-[state=active]:0 0 16px oklch(0.65 0.20 230 / 0.25)',
                }}
              >
                All
                {counts.all > 0 && (
                  <span className="ml-1.5 text-muted-foreground">({counts.all})</span>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="dropped" 
                className="text-xs data-[state=active]:neumorphic-raised data-[state=active]:glow-success relative z-10 transition-all duration-200"
              >
                Dropped
                {counts.dropped > 0 && (
                  <span className="ml-1.5 text-success font-bold">({counts.dropped})</span>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="increased" 
                className="text-xs data-[state=active]:neumorphic-raised data-[state=active]:shadow-[0_0_16px_oklch(0.55_0.22_15_/_0.25)] relative z-10 transition-all duration-200"
              >
                Increased
                {counts.increased > 0 && (
                  <span className="ml-1.5 text-destructive font-bold">({counts.increased})</span>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="out-of-stock" 
                className="text-xs data-[state=active]:neumorphic-raised data-[state=active]:glow-accent relative z-10 transition-all duration-200"
              >
                OOS
                {counts['out-of-stock'] > 0 && (
                  <span className="ml-1.5 text-muted-foreground">({counts['out-of-stock']})</span>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-24 h-24 rounded-full neumorphic-inset flex items-center justify-center mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-50"></div>
              <Package className="w-12 h-12 text-muted-foreground drop-shadow-[0_3px_6px_rgba(0,0,0,0.4)] relative z-10" weight="bold" />
            </div>
            <h3 className="text-lg font-semibold mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
              {filter === 'all' ? 'No products yet' : 'No products found'}
            </h3>
            <p className="text-sm text-muted-foreground mb-8 max-w-xs drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
              {filter === 'all' 
                ? 'Start tracking product prices by adding your first product'
                : `No products match the "${filter}" filter`
              }
            </p>
            {filter === 'all' && (
              <Button 
                onClick={onAddProduct} 
                className="neumorphic-button hover:glow-primary active:scale-95 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg, oklch(0.55 0.18 250), oklch(0.45 0.18 250))',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-60 pointer-events-none"></div>
                <Plus className="w-5 h-5 mr-2 relative z-10" weight="bold" />
                <span className="relative z-10">Add Your First Product</span>
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => onProductClick(product)}
                onToggleActive={onToggleActive}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
