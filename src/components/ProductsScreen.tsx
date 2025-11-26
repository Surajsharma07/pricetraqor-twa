import { TrackedProduct } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, TrendDown, TrendUp, Package } from '@phosphor-icons/react'
import { formatPrice } from '@/lib/helpers'

interface ProductsScreenProps {
  products: TrackedProduct[]
  onProductClick: (product: TrackedProduct) => void
  onAddProduct: () => void
}

export function ProductsScreen({ products, onProductClick, onAddProduct }: ProductsScreenProps) {
  const activeProducts = products.filter(p => p.isActive)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">
            {activeProducts.length} active {activeProducts.length === 1 ? 'product' : 'products'}
          </p>
        </div>
        <Button 
          onClick={onAddProduct} 
          size="icon" 
          className="rounded-full h-12 w-12 shadow-[0_4px_16px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.15)] active:shadow-[inset_0_3px_10px_rgba(0,0,0,0.3)]"
        >
          <Plus className="w-6 h-6" weight="bold" />
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No products yet</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
            Start building your collection by adding products you want to track
          </p>
          <Button onClick={onAddProduct}>
            <Plus className="w-4 h-4 mr-2" weight="bold" />
            Add Product
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-all shadow-[0_2px_8px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.03)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.03)] active:scale-[0.98]"
              onClick={() => onProductClick(product)}
            >
              <div className="aspect-square bg-muted relative">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                {!product.isActive && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="secondary" className="text-xs">
                      Paused
                    </Badge>
                  </div>
                )}
                {!product.inStock && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="destructive" className="text-xs">
                      Out of Stock
                    </Badge>
                  </div>
                )}
                {product.priceChange && product.priceChange !== 0 && product.isActive && (
                  <div className="absolute top-2 right-2">
                    <Badge
                      variant={product.priceChange < 0 ? 'default' : 'destructive'}
                      className={`text-xs ${
                        product.priceChange < 0 ? 'bg-success text-success-foreground' : ''
                      }`}
                    >
                      {product.priceChange < 0 ? (
                        <TrendDown className="w-3 h-3 mr-1" weight="bold" />
                      ) : (
                        <TrendUp className="w-3 h-3 mr-1" weight="bold" />
                      )}
                      {Math.abs(product.priceChangePercent || 0).toFixed(0)}%
                    </Badge>
                  </div>
                )}
              </div>
              <div className="p-3 space-y-2">
                <h3 className="font-medium text-sm line-clamp-2 min-h-[2.5rem]">
                  {product.title}
                </h3>
                <div className="space-y-1">
                  <p className="text-lg font-bold">
                    {formatPrice(product.currentPrice, product.currency)}
                  </p>
                  {product.previousPrice && product.previousPrice !== product.currentPrice && (
                    <p className="text-xs text-muted-foreground line-through">
                      {formatPrice(product.previousPrice, product.currency)}
                    </p>
                  )}
                  {product.targetPrice && (
                    <p className="text-xs text-muted-foreground">
                      Target: {formatPrice(product.targetPrice, product.currency)}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
