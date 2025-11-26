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
  X
} from '@phosphor-icons/react'
import { formatPrice, calculatePriceChange, getRelativeTime, getSiteName } from '@/lib/helpers'
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isEditingTarget, setIsEditingTarget] = useState(false)
  const [targetPriceInput, setTargetPriceInput] = useState(
    product.targetPrice?.toString() || ''
  )

  const priceChangeData = product.previousPrice 
    ? calculatePriceChange(product.currentPrice, product.previousPrice)
    : null

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
                  onClick={() => window.open(product.productUrl, '_blank')}
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
              {product.priceHistory.length > 0 ? (
                <div className="space-y-2.5">
                  {product.priceHistory.slice(0, 10).map((entry, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between py-2.5 px-4 bg-gradient-to-br from-muted/80 to-muted/60 rounded-lg shadow-[inset_0_2px_6px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.05)]"
                    >
                      <span className="text-sm font-semibold text-numeric">
                        {formatPrice(entry.price, entry.currency)}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">
                        {new Date(entry.checkedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No price history yet</p>
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
                Pause Tracking
              </>
            ) : (
              <>
                <PlayCircle className="w-5 h-5 mr-2" />
                Resume Tracking
              </>
            )}
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
