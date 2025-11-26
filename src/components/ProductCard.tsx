import { TrackedProduct } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice, calculatePriceChange, getRelativeTime, getSiteName } from '@/lib/helpers'
import { TrendDown, TrendUp, Minus, Trash, PauseCircle, PlayCircle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DotsThree } from '@phosphor-icons/react'

interface ProductCardProps {
  product: TrackedProduct
  onClick: () => void
  onToggleActive: (id: string) => void
  onDelete: (id: string) => void
}

export function ProductCard({ product, onClick, onToggleActive, onDelete }: ProductCardProps) {
  const priceChangeData = product.previousPrice 
    ? calculatePriceChange(product.currentPrice, product.previousPrice)
    : null

  const getPriceChangeColor = () => {
    if (!priceChangeData) return 'text-muted-foreground'
    if (priceChangeData.direction === 'down') return 'text-success'
    if (priceChangeData.direction === 'up') return 'text-destructive'
    return 'text-muted-foreground'
  }

  const getPriceChangeIcon = () => {
    if (!priceChangeData) return <Minus className="w-4 h-4" />
    if (priceChangeData.direction === 'down') return <TrendDown className="w-4 h-4" weight="bold" />
    if (priceChangeData.direction === 'up') return <TrendUp className="w-4 h-4" weight="bold" />
    return <Minus className="w-4 h-4" />
  }

  return (
    <Card 
      className="overflow-hidden hover:border-accent/50 transition-all cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex gap-3 p-3">
        <div className="w-20 h-20 flex-shrink-0 bg-secondary rounded-md overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-medium text-sm line-clamp-2 leading-tight">
              {product.title}
            </h3>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                  <DotsThree className="w-5 h-5" weight="bold" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation()
                  onToggleActive(product.id)
                }}>
                  {product.isActive ? (
                    <>
                      <PauseCircle className="w-4 h-4 mr-2" />
                      Pause Tracking
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Resume Tracking
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(product.id)
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-muted-foreground">
              {getSiteName(product.siteDomain)}
            </span>
            {!product.isActive && (
              <Badge variant="outline" className="text-xs py-0 h-4">
                Paused
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="destructive" className="text-xs py-0 h-4">
                Out of Stock
              </Badge>
            )}
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-numeric">
              {formatPrice(product.currentPrice, product.currency)}
            </span>
            
            {priceChangeData && priceChangeData.direction !== 'same' && (
              <div className={`flex items-center gap-1 text-xs font-medium ${getPriceChangeColor()}`}>
                {getPriceChangeIcon()}
                <span>
                  {Math.abs(priceChangeData.percent).toFixed(1)}%
                </span>
              </div>
            )}
          </div>

          <div className="text-xs text-muted-foreground mt-1">
            Updated {getRelativeTime(product.lastCheckedAt)}
          </div>
        </div>
      </div>
    </Card>
  )
}
