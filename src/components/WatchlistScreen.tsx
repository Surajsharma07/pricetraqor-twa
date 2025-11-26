import { useState } from 'react'
import { TrackedProduct, FilterType } from '@/lib/types'
import { ProductCard } from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Package } from '@phosphor-icons/react'
import { filterProducts } from '@/lib/helpers'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface WatchlistScreenProps {
  products: TrackedProduct[]
  onProductClick: (product: TrackedProduct) => void
  onAddProduct: () => void
  onToggleActive: (id: string) => void
  onDelete: (id: string) => void
}

export function WatchlistScreen({ 
  products, 
  onProductClick, 
  onAddProduct,
  onToggleActive,
  onDelete 
}: WatchlistScreenProps) {
  const [filter, setFilter] = useState<FilterType>('all')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)

  const filteredProducts = filterProducts(products, filter)

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (productToDelete) {
      onDelete(productToDelete)
      setDeleteDialogOpen(false)
      setProductToDelete(null)
    }
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
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">Watchlist</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {products.length} {products.length === 1 ? 'product' : 'products'} tracked
            </p>
          </div>
          <Button 
            onClick={onAddProduct} 
            size="icon" 
            className="rounded-full h-14 w-14 shadow-[0_6px_20px_rgba(0,0,0,0.25),inset_0_1px_2px_rgba(255,255,255,0.15)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.2)] active:shadow-[inset_0_4px_12px_rgba(0,0,0,0.35)] active:scale-95 bg-gradient-to-br from-primary to-primary/90 transition-all duration-200"
          >
            <Plus className="w-7 h-7" weight="bold" />
          </Button>
        </div>

        {products.length > 0 && (
          <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
            <TabsList className="grid w-full grid-cols-4 shadow-[0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.03)] bg-gradient-to-b from-muted/80 to-muted/60">
              <TabsTrigger value="all" className="text-xs data-[state=active]:shadow-[0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.08)]">
                All
                {counts.all > 0 && (
                  <span className="ml-1.5 text-muted-foreground">({counts.all})</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="dropped" className="text-xs data-[state=active]:shadow-[0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.08)]">
                Dropped
                {counts.dropped > 0 && (
                  <span className="ml-1.5 text-success">({counts.dropped})</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="increased" className="text-xs data-[state=active]:shadow-[0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.08)]">
                Increased
                {counts.increased > 0 && (
                  <span className="ml-1.5 text-destructive">({counts.increased})</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="out-of-stock" className="text-xs data-[state=active]:shadow-[0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.08)]">
                OOS
                {counts['out-of-stock'] > 0 && (
                  <span className="ml-1.5 text-muted-foreground">({counts['out-of-stock']})</span>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-muted/80 to-muted/60 flex items-center justify-center mb-5 shadow-[inset_0_3px_8px_rgba(0,0,0,0.15),0_2px_6px_rgba(0,0,0,0.1)]">
              <Package className="w-10 h-10 text-muted-foreground" weight="bold" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {filter === 'all' ? 'No products yet' : 'No products found'}
            </h3>
            <p className="text-sm text-muted-foreground mb-8 max-w-xs">
              {filter === 'all' 
                ? 'Start tracking product prices by adding your first product'
                : `No products match the "${filter}" filter`
              }
            </p>
            {filter === 'all' && (
              <Button onClick={onAddProduct} className="shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)]">
                <Plus className="w-5 h-5 mr-2" weight="bold" />
                Add Your First Product
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="shadow-[0_16px_64px_rgba(0,0,0,0.35)]">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove product?</AlertDialogTitle>
            <AlertDialogDescription>
              This will stop tracking this product and remove it from your watchlist. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="shadow-[0_2px_8px_rgba(0,0,0,0.15)]">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
