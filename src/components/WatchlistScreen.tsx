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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Watchlist</h1>
            <p className="text-sm text-muted-foreground">
              {products.length} {products.length === 1 ? 'product' : 'products'} tracked
            </p>
          </div>
          <Button onClick={onAddProduct} size="icon" className="rounded-full h-12 w-12">
            <Plus className="w-6 h-6" weight="bold" />
          </Button>
        </div>

        {products.length > 0 && (
          <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all" className="text-xs">
                All
                {counts.all > 0 && (
                  <span className="ml-1 text-muted-foreground">({counts.all})</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="dropped" className="text-xs">
                Dropped
                {counts.dropped > 0 && (
                  <span className="ml-1 text-success">({counts.dropped})</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="increased" className="text-xs">
                Increased
                {counts.increased > 0 && (
                  <span className="ml-1 text-destructive">({counts.increased})</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="out-of-stock" className="text-xs">
                OOS
                {counts['out-of-stock'] > 0 && (
                  <span className="ml-1 text-muted-foreground">({counts['out-of-stock']})</span>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              {filter === 'all' ? 'No products yet' : 'No products found'}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              {filter === 'all' 
                ? 'Start tracking product prices by adding your first product'
                : `No products match the "${filter}" filter`
              }
            </p>
            {filter === 'all' && (
              <Button onClick={onAddProduct}>
                <Plus className="w-4 h-4 mr-2" weight="bold" />
                Add Your First Product
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove product?</AlertDialogTitle>
            <AlertDialogDescription>
              This will stop tracking this product and remove it from your watchlist. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
