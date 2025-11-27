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
      className="overflow-hidden cursor-pointer group active:scale-[0.98] transition-all duration-200 relative neumorphic-raised hover:shadow-[8px_8px_20px_oklch(0.06_0.01_250_/_0.7),-4px_-4px_14px_oklch(0.22_0.04_250_/_0.4),inset_0_1px_0_oklch(0.95_0_0_/_0.1),0_0_40px_oklch(0.65_0.20_230_/_0.15)]"
      onClick={onClick}
      style={{
        background: 'linear-gradient(145deg, oklch(0.18 0.04 250 / 0.95), oklch(0.14 0.03 250 / 0.9))',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      
      <div className="flex gap-4 p-4 relative z-10">
        <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden relative neumorphic-inset">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-60 pointer-events-none z-10"></div>
          <div className="absolute inset-0 shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)] rounded-2xl pointer-events-none z-10"></div>
          <img 
            src={product.imageUrl} 
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-semibold text-sm line-clamp-2 leading-tight drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]">
              {product.title}
            </h3>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 flex-shrink-0 rounded-full neumorphic-button hover:glow-accent active:scale-95 transition-all duration-200"
                  style={{
                    background: 'linear-gradient(145deg, oklch(0.20 0.04 250), oklch(0.16 0.03 250))',
                  }}
                >
                  <DotsThree className="w-5 h-5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]" weight="bold" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="glass-morphism shadow-[0_12px_48px_rgba(0,0,0,0.4)] border-border/30"
                style={{
                  background: 'linear-gradient(145deg, oklch(0.20 0.04 250 / 0.98), oklch(0.16 0.03 250 / 0.95))',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                }}
              >
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation()
                  onToggleActive(product.id)
                }} className="cursor-pointer">
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
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-muted-foreground px-2.5 py-1 rounded-lg border border-border/40 neumorphic-inset shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]">
              {getSiteName(product.siteDomain)}
            </span>
            {!product.isActive && (
              <Badge variant="outline" className="text-xs py-0.5 h-5 glass-morphism border-border/50">
                Paused
              </Badge>
            )}
            {!product.inStock && (
              <Badge 
                variant="destructive" 
                className="text-xs py-0.5 h-5 shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.15)]"
                style={{
                  background: 'linear-gradient(145deg, oklch(0.60 0.22 15), oklch(0.50 0.20 15))',
                }}
              >
                Out of Stock
              </Badge>
            )}
          </div>

          <div className="flex items-baseline gap-2.5 mb-1">
            <span className="text-xl font-bold text-numeric bg-gradient-to-br from-foreground via-foreground to-foreground/80 bg-clip-text drop-shadow-[0_3px_6px_rgba(0,0,0,0.6)]">
              {formatPrice(product.currentPrice, product.currency)}
            </span>
            
            {priceChangeData && priceChangeData.direction !== 'same' && (
              <div className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border ${getPriceChangeColor()} ${
                priceChangeData.direction === 'down' 
                  ? 'border-success/40 glow-success neumorphic-inset' 
                  : 'border-destructive/40 neumorphic-inset'
              }`}
                style={{
                  background: priceChangeData.direction === 'down'
                    ? 'linear-gradient(145deg, oklch(0.12 0.02 250), oklch(0.16 0.03 250))'
                    : 'linear-gradient(145deg, oklch(0.12 0.02 250), oklch(0.16 0.03 250))',
                }}
              >
                {getPriceChangeIcon()}
                <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                  {Math.abs(priceChangeData.percent).toFixed(1)}%
                </span>
              </div>
            )}
          </div>

          <div className="text-xs text-muted-foreground mt-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
            Updated {getRelativeTime(product.lastCheckedAt)}
          </div>
        </div>
      </div>
    </Card>
  )
}
