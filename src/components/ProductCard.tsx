import { useState } from 'react'
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
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp'

interface ProductCardProps {
  product: TrackedProduct
  onClick: () => void
  onToggleActive: (id: string) => void
  onDelete: (id: string) => void
}

export function ProductCard({ product, onClick, onToggleActive, onDelete }: ProductCardProps) {
  const twa = useTelegramWebApp()
  const [isHovered, setIsHovered] = useState(false)
  const isLightTheme = document.documentElement.classList.contains('light-theme')
  
  const priceChangeData = product.previousPrice 
    ? calculatePriceChange(product.currentPrice, product.previousPrice)
    : null

  const handleClick = () => {
    twa.haptic.selection()
    onClick()
  }

  const handleToggleActive = (e: React.MouseEvent) => {
    e.stopPropagation()
    twa.haptic.impact('light')
    onToggleActive(product.id)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    twa.haptic.impact('medium')
    onDelete(product.id)
  }

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
      className="overflow-hidden cursor-pointer group active:scale-[0.98] transition-all duration-300 relative neumorphic-raised"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: isLightTheme 
          ? 'linear-gradient(145deg, oklch(0.95 0.010 60 / 0.98), oklch(0.92 0.012 60 / 0.95))'
          : 'linear-gradient(145deg, oklch(0.18 0.04 250 / 0.95), oklch(0.14 0.03 250 / 0.9))',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: isLightTheme
          ? isHovered 
            ? '14px 14px 32px oklch(0.68 0.022 60 / 0.5), -8px -8px 20px oklch(0.96 0.008 60 / 0.8), inset 0 1px 0 oklch(1 0 0 / 0.9), 0 0 50px oklch(0.65 0.20 230 / 0.35), 0 0 80px oklch(0.50 0.18 250 / 0.2)'
            : '12px 12px 24px oklch(0.68 0.022 60 / 0.4), -6px -6px 16px oklch(0.96 0.008 60 / 0.7), inset 0 1px 0 oklch(1 0 0 / 0.8)'
          : isHovered 
            ? '10px 10px 24px oklch(0.06 0.01 250 / 0.8), -5px -5px 16px oklch(0.24 0.05 250 / 0.5), inset 0 1px 0 oklch(0.95 0 0 / 0.15), 0 0 50px oklch(0.65 0.20 230 / 0.25), 0 0 80px oklch(0.50 0.18 250 / 0.15)'
            : '8px 8px 16px oklch(0.06 0.01 250 / 0.5), -4px -4px 12px oklch(0.22 0.04 250 / 0.3), inset 0 1px 0 oklch(0.95 0 0 / 0.08)',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      <div 
        className="absolute inset-0 bg-gradient-to-tr from-accent/8 via-primary/5 to-transparent opacity-0 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ opacity: isHovered ? 1 : 0 }}
      ></div>
      
      <div 
        className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent/5 opacity-0 transition-opacity duration-700 pointer-events-none rounded-2xl"
        style={{ opacity: isHovered ? 1 : 0 }}
      ></div>
      
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-300"
        style={{ 
          backgroundImage: isHovered 
            ? 'linear-gradient(90deg, transparent, oklch(0.65 0.20 230 / 0.4) 50%, transparent)' 
            : 'linear-gradient(90deg, transparent, oklch(0.95 0 0 / 0.1) 50%, transparent)'
        }}
      ></div>
      
      <div className="flex gap-4 p-4 relative z-10">
        <div 
          className="w-24 h-24 flex-shrink-0 rounded-lg relative neumorphic-inset transition-all duration-500 flex items-center justify-center p-2 bg-background"
          style={{
            transform: isHovered ? 'scale(1.05) rotate(-1deg)' : 'scale(1)',
            boxShadow: isLightTheme
              ? isHovered 
                ? 'inset 10px 10px 20px oklch(0.68 0.022 60 / 0.6), inset -8px -8px 16px oklch(0.96 0.008 60 / 0.8), 0 0 20px oklch(0.65 0.20 230 / 0.3)'
                : 'inset 8px 8px 16px oklch(0.68 0.022 60 / 0.5), inset -6px -6px 12px oklch(0.96 0.008 60 / 0.7)'
              : isHovered 
                ? 'inset 8px 8px 16px oklch(0.06 0.01 250 / 0.9), inset -6px -6px 12px oklch(0.20 0.04 250 / 0.5), 0 0 20px oklch(0.65 0.20 230 / 0.2)'
                : 'inset 6px 6px 12px oklch(0.06 0.01 250 / 0.6), inset -4px -4px 8px oklch(0.20 0.04 250 / 0.4)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-60 pointer-events-none z-10 transition-opacity duration-300"
            style={{ opacity: isHovered ? 0.8 : 0.6 }}
          ></div>
          <div className="absolute inset-0 shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)] rounded-lg pointer-events-none z-10"></div>
          <img 
            src={product.imageUrl} 
            alt={product.title}
            className="w-full h-full object-contain transition-transform duration-700"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-semibold text-sm line-clamp-2 leading-tight drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)] transition-all duration-300"
              style={{
                transform: isHovered ? 'translateX(2px)' : 'translateX(0)',
                textShadow: isHovered 
                  ? '0 2px 4px rgba(0,0,0,0.6), 0 0 12px rgba(101, 80, 230, 0.3)' 
                  : '0 2px 3px rgba(0,0,0,0.5)'
              }}
            >
              {product.title}
            </h3>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 flex-shrink-0 rounded-full neumorphic-button hover:glow-accent active:scale-95 transition-all duration-300"
                  style={{
                    background: isLightTheme
                      ? 'linear-gradient(145deg, oklch(0.93 0.012 60), oklch(0.89 0.015 60))'
                      : 'linear-gradient(145deg, oklch(0.20 0.04 250), oklch(0.16 0.03 250))',
                  }}
                  onMouseEnter={(e) => {
                    const btn = e.currentTarget
                    if (isLightTheme) {
                      btn.style.boxShadow = '14px 14px 28px oklch(0.68 0.022 60 / 0.5), -8px -8px 18px oklch(0.96 0.008 60 / 0.8), inset 0 1px 0 oklch(1 0 0 / 0.9), 0 0 20px oklch(0.65 0.20 230 / 0.5)'
                    } else {
                      btn.style.boxShadow = '10px 10px 20px oklch(0.06 0.01 250 / 0.7), -5px -5px 14px oklch(0.24 0.05 250 / 0.5), inset 0 1px 0 oklch(0.95 0 0 / 0.15), 0 0 20px oklch(0.65 0.20 230 / 0.4)'
                    }
                    btn.style.transform = 'scale(1.08) rotate(90deg)'
                  }}
                  onMouseLeave={(e) => {
                    const btn = e.currentTarget
                    if (isLightTheme) {
                      btn.style.boxShadow = '9px 9px 18px oklch(0.68 0.022 60 / 0.4), -5px -5px 14px oklch(0.96 0.008 60 / 0.7), inset 0 1px 0 oklch(1 0 0 / 0.8)'
                    } else {
                      btn.style.boxShadow = '6px 6px 12px oklch(0.06 0.01 250 / 0.5), -3px -3px 8px oklch(0.22 0.04 250 / 0.3), inset 0 1px 0 oklch(0.95 0 0 / 0.08)'
                    }
                    btn.style.transform = 'scale(1) rotate(0deg)'
                  }}
                >
                  <DotsThree className="w-5 h-5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]" weight="bold" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="glass-morphism shadow-[0_12px_48px_rgba(0,0,0,0.4)] border-border/30"
                style={{
                  background: isLightTheme
                    ? 'linear-gradient(145deg, oklch(0.95 0.010 60 / 0.98), oklch(0.92 0.012 60 / 0.95))'
                    : 'linear-gradient(145deg, oklch(0.20 0.04 250 / 0.98), oklch(0.16 0.03 250 / 0.95))',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                }}
              >
                <DropdownMenuItem onClick={handleToggleActive} className="cursor-pointer">
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
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span 
              className="text-xs font-medium text-muted-foreground px-2.5 py-1 rounded-lg border border-border/40 neumorphic-inset shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] transition-all duration-300"
              style={{
                transform: isHovered ? 'translateY(-1px) scale(1.02)' : 'translateY(0) scale(1)',
                boxShadow: isHovered 
                  ? 'inset 0 3px 6px rgba(0,0,0,0.3), 0 0 12px oklch(0.65 0.20 230 / 0.15)'
                  : 'inset 0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              {getSiteName(product.siteDomain)}
            </span>
            {!product.isActive && (
              <Badge 
                variant="outline" 
                className="text-xs py-0.5 h-5 glass-morphism border-border/50 transition-all duration-300 animate-pulse"
                style={{
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)'
                }}
              >
                Paused
              </Badge>
            )}
            {!product.inStock && (
              <Badge 
                variant="destructive" 
                className="text-xs py-0.5 h-5 shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.15)] transition-all duration-300 animate-pulse"
                style={{
                  background: 'linear-gradient(145deg, oklch(0.60 0.22 15), oklch(0.50 0.20 15))',
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: isHovered 
                    ? '0 3px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2), 0 0 20px oklch(0.55 0.22 15 / 0.6)'
                    : '0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)'
                }}
              >
                Out of Stock
              </Badge>
            )}
          </div>

          <div className="flex items-baseline gap-2.5 mb-1">
            <span 
              className="text-xl font-bold text-numeric bg-gradient-to-br from-foreground via-foreground to-foreground/80 bg-clip-text drop-shadow-[0_3px_6px_rgba(0,0,0,0.6)] transition-all duration-500"
              style={{
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                textShadow: isHovered 
                  ? '0 4px 8px rgba(0,0,0,0.7), 0 0 20px rgba(101, 80, 230, 0.5)' 
                  : '0 3px 6px rgba(0,0,0,0.6)'
              }}
            >
              {formatPrice(product.currentPrice, product.currency)}
            </span>
            
            {priceChangeData && priceChangeData.direction !== 'same' && (
              <div className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border ${getPriceChangeColor()} ${
                priceChangeData.direction === 'down' 
                  ? 'border-success/40 glow-success neumorphic-inset' 
                  : 'border-destructive/40 neumorphic-inset'
              } transition-all duration-500`}
                style={{
                  background: priceChangeData.direction === 'down'
                    ? isLightTheme
                      ? 'linear-gradient(145deg, oklch(0.88 0.015 60), oklch(0.92 0.012 60))'
                      : 'linear-gradient(145deg, oklch(0.12 0.02 250), oklch(0.16 0.03 250))'
                    : isLightTheme
                      ? 'linear-gradient(145deg, oklch(0.88 0.015 60), oklch(0.92 0.012 60))'
                      : 'linear-gradient(145deg, oklch(0.12 0.02 250), oklch(0.16 0.03 250))',
                  transform: isHovered ? 'scale(1.05) translateY(-2px)' : 'scale(1)',
                  boxShadow: isLightTheme
                    ? isHovered
                      ? priceChangeData.direction === 'down'
                        ? 'inset 5px 5px 10px oklch(0.68 0.022 60 / 0.5), inset -3px -3px 8px oklch(0.96 0.008 60 / 0.7), 0 0 20px oklch(0.65 0.20 145 / 0.6)'
                        : 'inset 5px 5px 10px oklch(0.68 0.022 60 / 0.5), inset -3px -3px 8px oklch(0.96 0.008 60 / 0.7), 0 0 20px oklch(0.55 0.22 15 / 0.6)'
                      : 'inset 4px 4px 8px oklch(0.68 0.022 60 / 0.4), inset -2px -2px 6px oklch(0.96 0.008 60 / 0.6)'
                    : isHovered
                      ? priceChangeData.direction === 'down'
                        ? 'inset 4px 4px 8px oklch(0.06 0.01 250 / 0.8), inset -2px -2px 6px oklch(0.20 0.04 250 / 0.6), 0 0 20px oklch(0.65 0.20 145 / 0.5)'
                        : 'inset 4px 4px 8px oklch(0.06 0.01 250 / 0.8), inset -2px -2px 6px oklch(0.20 0.04 250 / 0.6), 0 0 20px oklch(0.55 0.22 15 / 0.5)'
                      : 'inset 3px 3px 6px oklch(0.06 0.01 250 / 0.6), inset -2px -2px 4px oklch(0.20 0.04 250 / 0.4)'
                }}
              >
                <span style={{ transform: isHovered ? 'scale(1.15)' : 'scale(1)', display: 'inline-block', transition: 'transform 0.3s ease' }}>
                  {getPriceChangeIcon()}
                </span>
                <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                  {Math.abs(priceChangeData.percent).toFixed(1)}%
                </span>
              </div>
            )}
          </div>

          <div 
            className="text-xs text-muted-foreground mt-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-all duration-300"
            style={{
              transform: isHovered ? 'translateX(2px)' : 'translateX(0)',
              opacity: isHovered ? 1 : 0.8
            }}
          >
            Updated {getRelativeTime(product.lastCheckedAt)}
          </div>
        </div>
      </div>
      
      <div 
        className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden"
        style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.6s ease' }}
      >
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          style={{
            transform: 'translateX(-100%)',
            animation: isHovered ? 'shimmer 2s ease-in-out infinite' : 'none'
          }}
        />
      </div>
    </Card>
  )
}
