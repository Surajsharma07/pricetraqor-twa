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
      className="overflow-hidden hover:border-accent/50 transition-all duration-300 cursor-pointer group shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(255,255,255,0.08)] active:scale-[0.97] bg-gradient-to-b from-card to-card/95"
      onClick={onClick}
    >
      <div className="flex gap-4 p-4">
        <div className="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-secondary/80 to-secondary/60 rounded-xl overflow-hidden shadow-[inset_0_3px_8px_rgba(0,0,0,0.15),0_2px_4px_rgba(0,0,0,0.1)] ring-1 ring-border/50">
          <img 
            src={product.imageUrl} 
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
              {product.title}
            </h3>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(255,255,255,0.08)] active:shadow-[inset_0_3px_8px_rgba(0,0,0,0.2)] bg-gradient-to-b from-secondary/60 to-secondary/40">
                  <DotsThree className="w-5 h-5" weight="bold" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
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

          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)]">
              {getSiteName(product.siteDomain)}
            </span>
            {!product.isActive && (
              <Badge variant="outline" className="text-xs py-0.5 h-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
                Paused
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="destructive" className="text-xs py-0.5 h-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
                Out of Stock
              </Badge>
            )}
          </div>

          <div className="flex items-baseline gap-2.5 mb-1">
            <span className="text-xl font-bold text-numeric bg-gradient-to-br from-foreground to-foreground/80 bg-clip-text">
              {formatPrice(product.currentPrice, product.currency)}
            </span>
            
            {priceChangeData && priceChangeData.direction !== 'same' && (
              <div className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-md shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)] ${getPriceChangeColor()} ${
                priceChangeData.direction === 'down' ? 'bg-success/15' : 'bg-destructive/15'
              }`}>
                {getPriceChangeIcon()}
                <span>
                  {Math.abs(priceChangeData.percent).toFixed(1)}%
                </span>
              </div>
            )}
          </div>

          <div className="text-xs text-muted-foreground mt-1.5">
            Updated {getRelativeTime(product.lastCheckedAt)}
          </div>
        </div>
      </div>
    </Card>
  )
}
