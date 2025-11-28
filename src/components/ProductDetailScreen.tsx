import { useState } from 'react'
import { TrackedProduct } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  ArrowSquareOut, 
  TrendDown, 
  TrendUp, 
  Trash, 
  PauseCircle, 
  PlayCircle,
  Check,
  X,
  ShareNetwork
} from '@phosphor-icons/react'
import { formatPrice, calculatePriceChange, getRelativeTime, getSiteName, addAffiliateTag } from '@/lib/helpers'
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
import { toast } from 'sonner'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp'

interface ProductDetailScreenProps {
  product: TrackedProduct
  onBack: () => void
  onToggleActive: (id: string) => void
  onDelete: (id: string) => void
  onUpdateTargetPrice: (id: string, price?: number) => void
}

export function ProductDetailScreen({ 
  product, 
  onBack, 
  onToggleActive, 
  onDelete,
  onUpdateTargetPrice 
}: ProductDetailScreenProps) {
  const twa = useTelegramWebApp()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isEditingTarget, setIsEditingTarget] = useState(false)
  const [targetPriceInput, setTargetPriceInput] = useState(
    product.targetPrice?.toString() || ''
  )

  const priceChangeData = product.previousPrice 
    ? calculatePriceChange(product.currentPrice, product.previousPrice)
    : null

  const handleShareProduct = () => {
    try {
      twa.haptic.impact('light')
      const priceInfo = formatPrice(product.currentPrice, product.currency)
      const changeInfo = priceChangeData 
        ? ` (${priceChangeData.direction === 'down' ? '📉' : '📈'} ${Math.abs(priceChangeData.percent).toFixed(1)}%)`
        : ''
      
      const shareMessage = `Check out this product: ${product.title}\n💰 Current Price: ${priceInfo}${changeInfo}\n🔗 ${product.productUrl}`
      
      twa.share.switchInlineQuery(shareMessage, ['users', 'groups', 'channels'])
      twa.haptic.notification('success')
    } catch (error) {
      console.error('Share failed:', error)
      twa.haptic.notification('error')
      toast.error('Failed to share product')
    }
  }

  const handleSaveTargetPrice = () => {
    const price = targetPriceInput.trim() ? parseFloat(targetPriceInput) : undefined
    
    if (targetPriceInput.trim() && (isNaN(price!) || price! <= 0)) {
      toast.error('Please enter a valid price')
      return
    }

    onUpdateTargetPrice(product.id, price)
    setIsEditingTarget(false)
    toast.success(price ? 'Target price updated' : 'Target price removed')
  }

  const handleCancelEdit = () => {
    setTargetPriceInput(product.targetPrice?.toString() || '')
    setIsEditingTarget(false)
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full neumorphic-button hover:glow-accent active:scale-95 bg-gradient-to-b from-secondary/60 to-secondary/40">
            <ArrowLeft className="w-5 h-5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" />
          </Button>
          <h1 className="text-xl font-bold tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">Product Details</h1>
        </div>

        <Card className="overflow-hidden glass-card">
          <div className="aspect-square w-full frosted-glass flex items-center justify-center neumorphic-inset relative before:absolute before:inset-0 before:bg-gradient-to-tr before:from-white/5 before:via-transparent before:to-white/10 before:opacity-60">
            <img 
              src={product.imageUrl} 
              alt={product.title}
              className="w-full h-full object-contain relative z-10"
            />
          </div>
          
          <div className="p-5 space-y-5">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h2 className="font-semibold leading-tight text-base drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]">{product.title}</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => window.open(addAffiliateTag(product.productUrl, product.site), '_blank')}
                  className="flex-shrink-0 rounded-full neumorphic-button hover:glow-accent active:scale-95 bg-gradient-to-b from-secondary/70 to-secondary/50"
                >
                  <ArrowSquareOut className="w-5 h-5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="glass-morphism border-border/40">{getSiteName(product.siteDomain)}</Badge>
                {!product.isActive && (
                  <Badge variant="outline" className="glass-morphism border-border/40">
                    Paused
                  </Badge>
                )}
                {!product.inStock && (
                  <Badge variant="destructive" className="shadow-[0_2px_6px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.1)]">Out of Stock</Badge>
                )}
              </div>
            </div>

            <Separator className="shadow-[0_1px_2px_rgba(0,0,0,0.1)]" />

            <div>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-numeric bg-gradient-to-br from-foreground to-foreground/80 bg-clip-text">
                  {formatPrice(product.currentPrice, product.currency)}
                </span>
                {priceChangeData && priceChangeData.direction !== 'same' && (
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg frosted-glass ${
                    priceChangeData.direction === 'down' ? 'text-success border border-success/30 glow-accent' : 'text-destructive border border-destructive/30'
                  }`}>
                    {priceChangeData.direction === 'down' ? (
                      <TrendDown className="w-5 h-5" weight="bold" />
                    ) : (
                      <TrendUp className="w-5 h-5" weight="bold" />
                    )}
                    <span className="text-sm font-bold">
                      {formatPrice(Math.abs(priceChangeData.amount), product.currency)}
                    </span>
                    <span className="text-sm font-semibold">
                      ({Math.abs(priceChangeData.percent).toFixed(1)}%)
                    </span>
                  </div>
                )}
              </div>
              {product.previousPrice && (
                <p className="text-sm text-muted-foreground">
                  Previous: {formatPrice(product.previousPrice, product.currency)}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1.5">
                Last updated {getRelativeTime(product.lastCheckedAt)}
              </p>
            </div>

            <Separator className="shadow-[0_1px_2px_rgba(0,0,0,0.1)]" />

            <div>
              <Label className="text-sm font-semibold mb-3 block">Target Price Alert</Label>
              {!isEditingTarget ? (
                <div className="flex items-center gap-2">
                  {product.targetPrice ? (
                    <>
                      <div className="flex-1 px-4 py-2.5 bg-gradient-to-br from-muted/80 to-muted/60 rounded-lg text-sm font-medium shadow-[inset_0_2px_6px_rgba(0,0,0,0.1)]">
                        Notify me when price ≤ {formatPrice(product.targetPrice, product.currency)}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditingTarget(true)}
                        className="shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
                      >
                        Edit
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
                      onClick={() => setIsEditingTarget(true)}
                    >
                      Set Target Price
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Enter target price"
                      value={targetPriceInput}
                      onChange={(e) => setTargetPriceInput(e.target.value)}
                      className="flex-1 shadow-[inset_0_2px_6px_rgba(0,0,0,0.1)]"
                    />
                    <Button
                      variant="default"
                      size="icon"
                      onClick={handleSaveTargetPrice}
                      className="rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.25)]"
                    >
                      <Check className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCancelEdit}
                      className="rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Leave empty to remove target price
                  </p>
                </div>
              )}
            </div>

            <Separator className="shadow-[0_1px_2px_rgba(0,0,0,0.1)]" />

            <div>
              <h3 className="text-sm font-semibold mb-3">Price History</h3>
              {product.priceHistory.length > 1 ? (
                <div className="space-y-4">
                  <div className="neumorphic-inset p-4 rounded-xl">
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart 
                        data={product.priceHistory.map(entry => {
                          let dateStr = 'Unknown'
                          try {
                            const timestamp = entry.checkedAt
                            if (!timestamp) return { date: 'Unknown', price: entry.price, fullDate: '' }
                            
                            // Try ISO date first
                            let date = new Date(timestamp)
                            
                            // Try ObjectId if ISO fails
                            if (isNaN(date.getTime()) && typeof timestamp === 'string' && timestamp.length === 24 && /^[0-9a-f]{24}$/i.test(timestamp)) {
                              const seconds = parseInt(timestamp.substring(0, 8), 16)
                              date = new Date(seconds * 1000)
                            }
                            
                            // Try epoch number if still invalid
                            if (isNaN(date.getTime()) && !isNaN(Number(timestamp))) {
                              date = new Date(Number(timestamp))
                            }
                            
                            if (!isNaN(date.getTime())) {
                              dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                            }
                          } catch (e) {
                            dateStr = 'Unknown'
                          }
                          return {
                            date: dateStr,
                            price: entry.price,
                            fullDate: entry.checkedAt
                          }
                        })}
                        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="oklch(0.65 0.20 230)" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="oklch(0.65 0.20 230)" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid 
                          strokeDasharray="3 3" 
                          stroke="var(--color-border)" 
                          vertical={false}
                        />
                        <XAxis 
                          dataKey="date" 
                          stroke="var(--color-muted-foreground)"
                          style={{ fontSize: '11px', fontWeight: 500 }}
                          tickLine={false}
                        />
                        <YAxis 
                          stroke="var(--color-muted-foreground)"
                          style={{ fontSize: '11px', fontWeight: 500 }}
                          tickLine={false}
                          tickFormatter={(value) => formatPrice(value, product.currency)}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'var(--color-card)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '12px',
                            padding: '8px 12px',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                            backdropFilter: 'blur(16px)'
                          }}
                          labelStyle={{ 
                            color: 'var(--color-foreground)', 
                            fontSize: '12px',
                            fontWeight: 600,
                            marginBottom: '4px'
                          }}
                          itemStyle={{ 
                            color: 'oklch(0.65 0.20 230)',
                            fontSize: '13px',
                            fontWeight: 700
                          }}
                          formatter={(value: number) => [formatPrice(value, product.currency), 'Price']}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="price" 
                          stroke="oklch(0.65 0.20 230)" 
                          strokeWidth={3}
                          dot={{ 
                            fill: 'oklch(0.65 0.20 230)', 
                            r: 4,
                            strokeWidth: 2,
                            stroke: 'var(--color-card)'
                          }}
                          activeDot={{ 
                            r: 6,
                            fill: 'oklch(0.65 0.20 230)',
                            stroke: 'var(--color-card)',
                            strokeWidth: 2,
                            filter: 'drop-shadow(0 0 8px oklch(0.65 0.20 230 / 0.6))'
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-semibold text-muted-foreground">Recent Prices</h4>
                    {product.priceHistory.slice(0, 5).map((entry, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between py-2.5 px-4 bg-gradient-to-br from-muted/80 to-muted/60 rounded-lg shadow-[inset_0_2px_6px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.05)]"
                      >
                        <span className="text-sm font-semibold text-numeric">
                          {formatPrice(entry.price, entry.currency)}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">
                          {(() => {
                            try {
                              const timestamp = entry.checkedAt
                              // Handle MongoDB ObjectId timestamp (first 8 chars are hex timestamp)
                              if (typeof timestamp === 'string' && timestamp.length === 24 && /^[0-9a-f]{24}$/i.test(timestamp)) {
                                const seconds = parseInt(timestamp.substring(0, 8), 16)
                                const date = new Date(seconds * 1000)
                                return date.toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })
                              }
                              // Handle regular ISO date string
                              const date = new Date(timestamp)
                              return isNaN(date.getTime()) ? 'Unknown' : date.toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })
                            } catch (e) {
                              return 'Unknown'
                            }
                          })()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : product.priceHistory.length === 1 ? (
                <div className="p-6 text-center neumorphic-inset rounded-xl">
                  <p className="text-sm text-muted-foreground">Add more price checks to see the graph</p>
                </div>
              ) : (
                <div className="p-6 text-center neumorphic-inset rounded-xl">
                  <p className="text-sm text-muted-foreground">No price history yet</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)]"
            onClick={() => onToggleActive(product.id)}
          >
            {product.isActive ? (
              <>
                <PauseCircle className="w-5 h-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <PlayCircle className="w-5 h-5 mr-2" />
                Resume
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="flex-1 shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)]"
            onClick={handleShareProduct}
          >
            <ShareNetwork className="w-5 h-5 mr-2" />
            Share
          </Button>
          <Button
            variant="destructive"
            className="flex-1 shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)]"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash className="w-5 h-5 mr-2" />
            Remove
          </Button>
        </div>
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
            <AlertDialogAction 
              onClick={() => {
                onDelete(product.id)
                setDeleteDialogOpen(false)
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
