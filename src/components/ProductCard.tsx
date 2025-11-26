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
      className="overflow-hidden hover:border-accent/50 transition-all duration-300 cursor-pointer group shadow-[0_8px_24px_rgba(0,0,0,0.25),0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(0,0,0,0.2)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.3),0_4px_12px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.25)] active:scale-[0.97] active:shadow-[inset_0_4px_16px_rgba(0,0,0,0.3),inset_0_-1px_2px_rgba(255,255,255,0.05)] bg-gradient-to-b from-card/98 via-card to-card/95 backdrop-blur-xl relative before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-accent/5 before:via-transparent before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
      onClick={onClick}
    >
      <div className="flex gap-4 p-4 relative z-10">
        <div className="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-secondary/90 via-secondary/70 to-secondary/50 rounded-2xl overflow-hidden shadow-[inset_0_4px_12px_rgba(0,0,0,0.25),inset_0_-2px_6px_rgba(255,255,255,0.05),0_4px_12px_rgba(0,0,0,0.2)] ring-1 ring-border/40 relative before:absolute before:inset-0 before:bg-gradient-to-tr before:from-transparent before:via-white/5 before:to-white/10 before:opacity-80">
          <img 
            src={product.imageUrl} 
            alt={product.title}
            className="w-full h-full object-cover relative z-10"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-semibold text-sm line-clamp-2 leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
              {product.title}
            </h3>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-10 w-10 flex-shrink-0 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.2),0_1px_4px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.2)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.25),0_2px_6px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.25)] active:shadow-[inset_0_4px_12px_rgba(0,0,0,0.3),inset_0_-1px_2px_rgba(255,255,255,0.08)] active:scale-95 bg-gradient-to-b from-secondary/70 via-secondary/60 to-secondary/50 transition-all duration-200">
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
            <span className="text-xs font-medium text-muted-foreground bg-gradient-to-b from-muted/60 to-muted/40 px-2.5 py-1 rounded-lg shadow-[inset_0_2px_6px_rgba(0,0,0,0.15),inset_0_-1px_2px_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.1)] border border-border/30">
              {getSiteName(product.siteDomain)}
            </span>
            {!product.isActive && (
              <Badge variant="outline" className="text-xs py-0.5 h-5 shadow-[0_2px_6px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.05)] border-border/40">
                Paused
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="destructive" className="text-xs py-0.5 h-5 shadow-[0_2px_6px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.1)]">
                Out of Stock
              </Badge>
            )}
          </div>

          <div className="flex items-baseline gap-2.5 mb-1">
            <span className="text-xl font-bold text-numeric bg-gradient-to-br from-foreground via-foreground to-foreground/80 bg-clip-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
              {formatPrice(product.currentPrice, product.currency)}
            </span>
            
            {priceChangeData && priceChangeData.direction !== 'same' && (
              <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg shadow-[inset_0_2px_6px_rgba(0,0,0,0.15),inset_0_-1px_2px_rgba(255,255,255,0.08),0_1px_3px_rgba(0,0,0,0.1)] border ${getPriceChangeColor()} ${
                priceChangeData.direction === 'down' ? 'bg-gradient-to-b from-success/20 to-success/10 border-success/20' : 'bg-gradient-to-b from-destructive/20 to-destructive/10 border-destructive/20'
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
